import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const html=await fs.readFile('dist/index.html','utf8');
test('approved design ships in shared online mode without preview data',()=>{
 assert.match(html, /<meta name="elio-backend" content="cloud"/);
 assert.match(html, /id="host-usability"/);
 assert.match(html, /data-lion-eye-corrected="true"/);
 assert.match(html, /class="footer-copy"/);
 assert.doesNotMatch(html, /elio-paper-preview-|elio-paper-host-ui-qa-|QA Guest|id="safari-opening"|<legend>Trail schedule<\/legend>/);
 assert.match(html, /hostPasscode: "",/);
});
test('production inline JavaScript parses',()=>{
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  if(/\bsrc=|type="application\//.test(match[1]))continue;
  new vm.Script(match[2]);
 }
});
test('first document stays small and media is independently cacheable',async()=>{
 assert.ok(Buffer.byteLength(html)<650000,'HTML exceeded its 650 KB budget');
 assert.doesNotMatch(html,/data:audio\/mpeg;base64,/);
 assert.match(html,/<link rel="preload" as="image" href="\/media\//);
 const paths=[...new Set([...html.matchAll(/(?:href|src)=["'](\/media\/[^"']+)["']/g)].map(m=>m[1]))];
 assert.ok(paths.length>20);
 for(const file of paths)assert.ok((await fs.stat('dist'+file)).size>0);
 const vercel=JSON.parse(await fs.readFile('vercel.json','utf8'));
 assert.ok(vercel.headers.some(rule=>rule.source==='/media/(.*)'&&rule.headers.some(h=>h.value.includes('immutable'))));
});
test('moving artwork uses baked cutouts and offline downloads keep embedded media',async()=>{
 assert.doesNotMatch(html,/mask="url\(#(?:hero-|walk-)/);
 assert.equal([...html.matchAll(/class="walk-limb"/g)].length,43);
 const offline=await fs.readFile('dist/offline-template.html','utf8');
 assert.match(offline,/data:audio\/mpeg;base64,/);
 assert.match(offline,/data:image\/webp;base64,/);
 assert.doesNotMatch(offline,/(?:src|href)=["']\/media\//);
});
