import fs from 'node:fs/promises';
export async function secrets() {
  const raw = await fs.readFile('.dev.vars', 'utf8');
  const values = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) values[match[1]] = JSON.parse(match[2]);
  }
  return values;
}
