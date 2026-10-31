import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';
const run = promisify(execFile);
const project = process.argv[2];
if (!project) throw new Error('Pass the Neon project ID.');
try {
  const { stdout } = await run(process.execPath, ['node_modules/neonctl/bin/cli.js', 'connection-string', '--project-id', project, '--pooled', '--output', 'json'], { maxBuffer: 1024 * 1024 });
  let parsed;
  try { parsed = JSON.parse(stdout); } catch { parsed = stdout.trim(); }
  const url = typeof parsed === 'string' ? parsed : parsed.connection_string || parsed.connection_uri || parsed.uri;
  if (!url?.startsWith('postgresql://')) throw new Error('Invalid connection data');
  await fs.writeFile('.dev.vars', [
    'DATABASE_URL=' + JSON.stringify(url),
    'HOST_PASSWORD=' + JSON.stringify(randomBytes(18).toString('base64url')),
    'SESSION_SECRET=' + JSON.stringify(randomBytes(32).toString('hex')),
  ].join('\n') + '\n', { flag: 'wx' });
  console.log('Private database connection and random host credentials saved locally; no secrets printed.');
} catch { console.error('Could not provision private settings; existing .dev.vars is never overwritten.'); process.exitCode = 1; }
