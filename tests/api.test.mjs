import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { handleRequest } from '../server/api.js';
import { defaults } from '../server/invitation.js';
const env = { HOST_PASSWORD: 'safari-demo', SESSION_SECRET: 'test-secret-with-more-than-32-characters' };
const db = new PGlite();
const sql = async (strings, ...values) => (await db.query(strings.reduce((s, part, i) => s + part + (i < values.length ? '$' + (i + 1) : ''), ''), values)).rows;
const call = (path, method = 'GET', value, cookie = '', origin = 'https://invitation.test') => handleRequest(new Request('https://invitation.test/api/' + path, {
  method, headers: { origin, cookie, 'content-type': 'application/json' }, body: value === undefined ? undefined : JSON.stringify(value),
}), env, sql);
const cookieOf = response => response.headers.get('set-cookie').split(';')[0];
let hostCookie, guestCookie, replyId;
before(async () => { await db.exec(await fs.readFile('server/schema.sql', 'utf8')); });
after(async () => { await db.close(); });

test('public invitation defaults contain no host credentials', async () => {
  const response = await call('invitation');
  const value = await response.json();
  assert.equal(value.child, 'Elio Rayne');
  assert.equal(value.hostPasscode, undefined);
  assert.equal(value.photos.length, 12);
});
test('guests cannot list, delete, add manual replies or change the invitation', async () => {
  for (const [path, method, value] of [['replies', 'GET'], ['replies/' + crypto.randomUUID(), 'DELETE'], ['manual-reply', 'POST', {}], ['invitation', 'PUT', defaults]]) {
    assert.equal((await call(path, method, value)).status, 401);
  }
});
test('cross-origin writes are rejected', async () => {
  assert.equal((await call('reply', 'POST', {}, '', 'https://other.test')).status, 403);
});
test('host password requires server verification and issues a secure cookie', async () => {
  assert.equal((await call('login', 'POST', { password: 'incorrect-password' })).status, 401);
  const response = await call('login', 'POST', { password: env.HOST_PASSWORD });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Strict;.*Secure/);
  hostCookie = cookieOf(response);
});
test('invalid guest data is rejected', async () => {
  for (const value of [{ name: '', going: true }, { name: 'Test', going: true, adults: 0, kids: 0 }, { name: 'Test', going: false, note: 'x'.repeat(281) }]) assert.equal((await call('reply', 'POST', value)).status, 400);
});
test('RSVP persists; same guest updates one reply; separate guest cannot read it', async () => {
  let response = await call('reply', 'POST', { name: "Guest O'Neil", going: true, adults: 2, kids: 1, note: '<script>test</script>' });
  assert.equal(response.status, 200);
  guestCookie = cookieOf(response);
  replyId = (await response.json()).reply.id;
  assert.equal(await (await call('reply')).json(), null);
  assert.equal((await (await call('reply', 'GET', undefined, guestCookie)).json()).id, replyId);
  response = await call('reply', 'POST', { name: "Guest O'Neil", going: false }, guestCookie);
  assert.equal((await response.json()).reply.id, replyId);
  const records = await (await call('replies', 'GET', undefined, hostCookie)).json();
  assert.equal(records.length, 1);
  assert.equal(records[0].adults, 0);
});
test('a forged guest cookie cannot overwrite another reply', async () => {
  const forged = guestCookie.slice(0, -1) + (guestCookie.endsWith('a') ? 'b' : 'a');
  assert.equal(await (await call('reply', 'GET', undefined, forged)).json(), null);
});
test('host edits persist publicly, ignoring injected credentials', async () => {
  const updated = { ...defaults, journalTitle: 'Our field journal', hostPasscode: 'leak-me', unexpected: 'ignore-me' };
  assert.equal((await call('invitation', 'PUT', updated, hostCookie)).status, 200);
  const config = await (await call('invitation')).json();
  assert.equal(config.journalTitle, updated.journalTitle);
  assert.equal(config.hostPasscode, undefined);
  assert.equal(config.unexpected, undefined);
  assert.equal((await call('invitation', 'PUT', { ...defaults, schedule: [] }, hostCookie)).status, 400);
});
test('host manual replies and delete work without changing their guest identity', async () => {
  const response = await call('manual-reply', 'POST', { name: 'Manual guest', going: true, adults: 1, kids: 0 }, hostCookie);
  assert.equal((await response.json()).reply.manual, true);
  assert.equal((await call('replies/' + replyId, 'DELETE', undefined, hostCookie)).status, 200);
  assert.equal(await (await call('reply', 'GET', undefined, guestCookie)).json(), null);
});
test('session expiry, password rotation, and sign-out revoke host access', async () => {
  assert.equal((await (await call('session', 'GET', undefined, hostCookie)).json()).authenticated, true);
  const old = env.HOST_PASSWORD;
  env.HOST_PASSWORD = 'new-private-password';
  assert.equal((await call('replies', 'GET', undefined, hostCookie)).status, 401);
  env.HOST_PASSWORD = old;
  const response = await call('logout', 'POST', {}, hostCookie);
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
});
test('login brute force is rate limited', async () => {
  for (let i = 0; i < 8; i++) assert.equal((await call('login', 'POST', { password: 'wrong' })).status, 401);
  assert.equal((await call('login', 'POST', { password: 'wrong' })).status, 429);
});
