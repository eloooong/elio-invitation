import fs from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
import { defaults } from '../server/invitation.js';
import { secrets } from './secrets.mjs';
try {
  const env = await secrets();
  const sql = neon(env.DATABASE_URL);
  const statements = (await fs.readFile('server/schema.sql', 'utf8')).split(';').map(s => s.trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
  await sql`INSERT INTO invitation(id, config) VALUES (1, ${JSON.stringify(defaults)}::jsonb) ON CONFLICT(id) DO NOTHING`;
  console.log('Neon schema is ready. Existing invitation edits and replies were preserved.');
} catch { console.error('Database setup failed. Check the private .dev.vars file and Neon connection.'); process.exitCode = 1; }
