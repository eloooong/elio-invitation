import { defaults, validateInvitation } from './invitation.js';

const encoder = new TextEncoder();
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const json = (value, status = 200, cookie) => new Response(JSON.stringify(value), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', ...(cookie ? { 'Set-Cookie': cookie } : {}) }
});
const hex = (bytes) => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
async function digest(value) { return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value))); }
async function signature(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}
function equal(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function token(subject, seconds, env) {
  const body = subject + '.' + (Math.floor(Date.now() / 1000) + seconds);
  return body + '.' + await signature(body, env.SESSION_SECRET);
}
async function readToken(request, name, env) {
  const raw = request.headers.get('cookie')?.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='))?.slice(name.length + 1);
  if (!raw || raw.length > 250) return null;
  const parts = raw.split('.');
  if (parts.length !== 3 || !/^\d+$/.test(parts[1]) || Number(parts[1]) <= Date.now() / 1000) return null;
  if (!equal(parts[2], await signature(parts[0] + '.' + parts[1], env.SESSION_SECRET))) return null;
  return parts[0];
}
function cookie(request, name, value, seconds) {
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${seconds}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
async function host(request, env) {
  return await readToken(request, 'elio_host', env) === 'host-' + await digest(env.HOST_PASSWORD);
}
async function requireHost(request, env) {
  if (!await host(request, env)) fail(401, 'Please sign in to the host view again.');
}
async function body(request, limit = 4096) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) fail(415, 'Send JSON data.');
  if (Number(request.headers.get('content-length')) > limit) fail(413, 'Upload is too large.');
  const reader = request.body?.getReader();
  if (!reader) fail(400, 'Missing request data.');
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); fail(413, 'Upload is too large.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { fail(400, 'Invalid request data.'); }
}
function replyInput(value) {
  if (!value || typeof value !== 'object' || typeof value.name !== 'string' || !value.name.trim() || value.name.length > 60 || typeof value.going !== 'boolean') fail(400, 'Please enter your name and RSVP answer.');
  for (const [key, limit] of [['diet', 140], ['note', 280]]) {
    if (value[key] != null && (typeof value[key] !== 'string' || value[key].length > limit)) fail(400, 'Please shorten your message.');
  }
  if (value.going && (!Number.isInteger(value.adults) || value.adults < 1 || value.adults > 8 || !Number.isInteger(value.kids) || value.kids < 0 || value.kids > 8)) fail(400, 'Please choose a valid guest count.');
  return { name: value.name.trim(), going: value.going, adults: value.going ? value.adults : 0, kids: value.going ? value.kids : 0, diet: value.diet?.trim() || '', note: value.note?.trim() || '' };
}
const record = r => r && ({ id: r.id, name: r.name, going: r.going, adults: r.adults, kids: r.kids, diet: r.diet, note: r.note, manual: r.manual, updatedAt: new Date(r.updated_at).toISOString() });
const isUUID = s => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s || '');

export async function handleRequest(request, env, sql) {
  try {
    if (!sql || !env.HOST_PASSWORD || env.HOST_PASSWORD.length < 8 || !env.SESSION_SECRET || env.SESSION_SECRET.length < 32) fail(503, 'The invitation service is being set up. Please try again shortly.');
    const path = new URL(request.url).pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
    const method = request.method;
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method)) fail(405, 'Method not allowed.');
    if (method !== 'GET' && request.headers.get('origin') !== new URL(request.url).origin) fail(403, 'Please submit from the invitation website.');
    if (path === 'health' && method === 'GET') {
      await sql`SELECT id FROM invitation WHERE id = 1`;
      return json({ ok: true });
    }
    if (path === 'invitation' && method === 'GET') {
      const rows = await sql`SELECT config FROM invitation WHERE id = 1`;
      return json(rows[0]?.config || defaults);
    }
    if (path === 'invitation' && method === 'PUT') {
      await requireHost(request, env);
      let config;
      try { config = validateInvitation(await body(request, 27000000)); } catch (e) { if (e.status) throw e; fail(400, e.message); }
      await sql`INSERT INTO invitation(id, config) VALUES (1, ${JSON.stringify(config)}::jsonb) ON CONFLICT(id) DO UPDATE SET config = EXCLUDED.config, updated_at = now()`;
      return json({ saved: true });
    }
    if (path === 'session' && method === 'GET') return json({ authenticated: await host(request, env) });
    if (path === 'login' && method === 'POST') {
      const value = await body(request);
      const bucket = await digest((request.headers.get('cf-connecting-ip') || 'local') + env.SESSION_SECRET);
      await sql`DELETE FROM login_attempts WHERE expires_at < now()`;
      const attempts = await sql`INSERT INTO login_attempts(bucket, attempts, expires_at) VALUES (${bucket}, 1, now() + interval '15 minutes') ON CONFLICT(bucket) DO UPDATE SET attempts = login_attempts.attempts + 1 RETURNING attempts`;
      if (attempts[0].attempts > 8) fail(429, 'Too many sign-in attempts. Please try again in 15 minutes.');
      if (typeof value?.password !== 'string' || !equal(await digest(value.password), await digest(env.HOST_PASSWORD))) fail(401, 'That passcode doesn’t match. Please try again.');
      await sql`DELETE FROM login_attempts WHERE bucket = ${bucket}`;
      return json({ authenticated: true }, 200, cookie(request, 'elio_host', await token('host-' + await digest(env.HOST_PASSWORD), 28800, env), 28800));
    }
    if (path === 'logout' && method === 'POST') return json({ authenticated: false }, 200, cookie(request, 'elio_host', '', 0));
    if (path === 'reply' && method === 'GET') {
      const guest = await readToken(request, 'elio_guest', env);
      if (!isUUID(guest)) return json(null);
      const rows = await sql`SELECT * FROM replies WHERE guest_id = ${guest}::uuid`;
      return json(record(rows[0]) || null);
    }
    if (path === 'reply' && method === 'POST') {
      const value = replyInput(await body(request));
      const existing = await readToken(request, 'elio_guest', env);
      const guest = isUUID(existing) ? existing : crypto.randomUUID();
      const rows = await sql`INSERT INTO replies(id, guest_id, name, going, adults, kids, diet, note) VALUES (${crypto.randomUUID()}::uuid, ${guest}::uuid, ${value.name}, ${value.going}, ${value.adults}, ${value.kids}, ${value.diet}, ${value.note}) ON CONFLICT(guest_id) DO UPDATE SET name = EXCLUDED.name, going = EXCLUDED.going, adults = EXCLUDED.adults, kids = EXCLUDED.kids, diet = EXCLUDED.diet, note = EXCLUDED.note, updated_at = now() RETURNING *`;
      return json({ reply: record(rows[0]), persisted: true }, 200, cookie(request, 'elio_guest', await token(guest, 31536000, env), 31536000));
    }
    if (path === 'replies' && method === 'GET') {
      await requireHost(request, env);
      return json((await sql`SELECT * FROM replies ORDER BY updated_at DESC`).map(record));
    }
    if (path === 'manual-reply' && method === 'POST') {
      await requireHost(request, env);
      const value = replyInput(await body(request));
      const rows = await sql`INSERT INTO replies(id, name, going, adults, kids, diet, note, manual) VALUES (${crypto.randomUUID()}::uuid, ${value.name}, ${value.going}, ${value.adults}, ${value.kids}, ${value.diet}, ${value.note}, true) RETURNING *`;
      return json({ reply: record(rows[0]), persisted: true });
    }
    if (path.startsWith('replies/') && method === 'DELETE') {
      await requireHost(request, env);
      const id = path.slice(8);
      if (!isUUID(id)) fail(400, 'Invalid reply.');
      await sql`DELETE FROM replies WHERE id = ${id}::uuid`;
      return json({ persisted: true });
    }
    fail(404, 'Not found.');
  } catch (e) {
    // Never expose database errors, connection strings or credentials in responses or logs.
    return json({ error: e.status ? e.message : 'Could not save or load right now. Please try again.' }, e.status || 503);
  }
}
