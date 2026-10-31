import { spawn } from 'node:child_process';
import { secrets } from './secrets.mjs';
const env = await secrets();
for (const name of ['DATABASE_URL', 'HOST_PASSWORD', 'SESSION_SECRET']) {
  if (!env[name]) throw new Error('Missing private setting: ' + name);
  const code = await new Promise(resolve => {
    const child = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'pages', 'secret', 'put', name, '--project-name', 'elio-invitation-test'], { stdio: ['pipe', 'pipe', 'pipe'] });
    // Suppress CLI output because credentials must never appear in deployment logs.
    child.stdout.resume(); child.stderr.resume();
    child.on('close', resolve); child.on('error', () => resolve(1));
    child.stdin.end(env[name] + '\n');
  });
  if (code !== 0) { console.error('Could not upload ' + name + '. Check Cloudflare authorization.'); process.exit(1); }
  console.log(name + ' uploaded securely.');
}
