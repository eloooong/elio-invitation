import fs from 'node:fs/promises';

// Applies the painted setting without changing the invitation or animal drawings.
const file = 'index.html';
let html = await fs.readFile(file, 'utf8');
const marker = 'data-painted-scenery="v1"';
if (html.includes(marker)) {
  console.log('Painted scenery is already applied; no files changed.');
  process.exit(0);
}

const required = [
  'tree', 'storybook-leaves', 'storybook-compass', 'storybook-binoculars',
  'bird', 'butterfly', 'paw', 'painted-sun', 'painted-meadow',
  'painted-grass', 'painted-seedgrass', 'painted-frame', 'painted-ribbon',
];
for (const id of required) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Add the painted symbol #${id} before running this helper.`);
}
if (html.includes('id="painted-landscape"')) throw new Error('A painted-landscape definition already exists without the scenery marker; inspect the partial integration.');

function elementRange(source, start, tag) {
  const tokens = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
  tokens.lastIndex = start;
  let depth = 0, token;
  while ((token = tokens.exec(source))) {
    if (token[0].startsWith('</')) depth--;
    else if (!token[0].endsWith('/>')) depth++;
    if (depth === 0) return [start, tokens.lastIndex];
  }
  throw new Error(`Unbalanced <${tag}> element.`);
}

function rangeByClass(source, tag, className) {
  const pattern = new RegExp(`<${tag}\\b[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`);
  const match = pattern.exec(source);
  if (!match) throw new Error(`Missing ${tag}.${className}.`);
  return elementRange(source, match.index, tag);
}

function rewriteByClass(source, tag, className, content) {
  const [start, end] = rangeByClass(source, tag, className);
  const old = source.slice(start, end);
  const opening = old.slice(0, old.indexOf('>') + 1);
  return source.slice(0, start) + opening + '\n' + content + `\n</${tag}>` + source.slice(end);
}

const [sceneStart, sceneEnd] = rangeByClass(html, 'svg', 'scene');
const scene = html.slice(sceneStart, sceneEnd);
const sceneOpening = scene.slice(0, scene.indexOf('>') + 1).replace('>', ` ${marker}>`);
const title = scene.match(/<title\b[^>]*>[\s\S]*?<\/title>/)?.[0];
const description = scene.match(/<desc\b[^>]*>[\s\S]*?<\/desc>/)?.[0];
const numeral = scene.match(/<text\b[^>]*>[\s\S]*?<\/text>/)?.[0];
if (!title || !description || !numeral) throw new Error('The hero title, description, or birthday numeral is missing.');

const animals = {};
for (const name of ['monkey', 'zebra', 'giraffe', 'lion', 'elephant']) {
  const position = scene.indexOf(`data-animal="${name}"`);
  if (position < 0) throw new Error(`Missing hero ${name}.`);
  const start = scene.lastIndexOf('<g', position);
  const [a, b] = elementRange(scene, start, 'g');
  animals[name] = scene.slice(a, b);
}
if (!animals.monkey.includes('translate(53 149)')) throw new Error('The monkey anchor changed; inspect its tree attachment before applying scenery.');
animals.monkey = animals.monkey.replace('translate(53 149)', 'translate(53 180)');

function decorativeGroups(className) {
  const groups = [];
  const matches = scene.matchAll(new RegExp(`<g\\b[^>]*class="${className}(?: [^"]*)?"[^>]*>`, 'g'));
  for (const match of matches) {
    const [a, b] = elementRange(scene, match.index, 'g');
    groups.push(scene.slice(a, b));
  }
  return groups.join('\n');
}
const birds = decorativeGroups('bird-flight');
const butterflies = decorativeGroups('butterfly-motion');
const tortoise = decorativeGroups('tortoise-motion');
if (!birds || !butterflies || !tortoise) throw new Error('A decorative hero animal is missing.');

// The branch in the plate and the monkey are deliberately one static plane.
const paintedScene = `${sceneOpening}
${title}
${description}
<g class="parallax-layer painted-scene-plane" data-depth="0">
  <use href="#painted-landscape" x="0" y="0" width="560" height="480" aria-hidden="true" />
  <g aria-hidden="true">${numeral}</g>
  ${animals.monkey}
</g>
<g aria-hidden="true">${birds}</g>
${animals.zebra}
${animals.giraffe}
${animals.lion}
${animals.elephant}
<g aria-hidden="true">${butterflies}\n${tortoise}</g>
</svg>`;
html = html.slice(0, sceneStart) + paintedScene + html.slice(sceneEnd);

// Decorative footer props keep their existing positions around the same animals.
const [footerStart, footerEnd] = rangeByClass(html, 'svg', 'footer-vignette');
const oldFooter = html.slice(footerStart, footerEnd);
const footerUses = [...oldFooter.matchAll(/<use\b[^>]*\/>/g)].map(match => match[0]).filter(use => /href="#(?:tree|storybook-leaves|mini-[^"]+|bird|butterfly)"/.test(use));
if (footerUses.length !== 11) throw new Error(`Expected eleven footer props/animals, found ${footerUses.length}.`);
const footerGround = [0, 200, 400, 600].map(x => `<use href="#painted-meadow" x="${x}" y="160" width="220" height="50" />`).join('\n');
html = rewriteByClass(html, 'svg', 'footer-vignette', `<use href="#painted-sun" x="359" y="25" width="92" height="92" />
${footerGround}
${footerUses.join('\n')}
<use href="#painted-grass" x="100" y="186" width="28" height="22" />
<use href="#painted-seedgrass" x="330" y="187" width="20" height="20" />
<use href="#painted-grass" x="428" y="188" width="30" height="22" />
<use href="#painted-grass" x="699" y="188" width="28" height="22" />`);

html = rewriteByClass(html, 'svg', 'parade-meadow', `<defs>
  <pattern id="painted-parade-meadow" width="190" height="40" patternUnits="userSpaceOnUse">
    <use href="#painted-meadow" x="-15" y="0" width="220" height="40" />
  </pattern>
</defs>
<rect width="100%" height="40" fill="url(#painted-parade-meadow)" />`);
html = rewriteByClass(html, 'svg', 'parade-grass-front', `<defs>
  <pattern id="painted-parade-grass" width="108" height="20" patternUnits="userSpaceOnUse">
    <g class="grass-sway"><use href="#painted-grass" x="14" y="2" width="28" height="18" /></g>
    <g class="grass-sway second"><use href="#painted-seedgrass" x="76" y="4" width="20" height="16" /></g>
  </pattern>
</defs>
<rect width="100%" height="20" fill="url(#painted-parade-grass)" />`);

// Replace the final dense vector blade band with a sparse painted continuation.
const grassPosition = html.indexOf('<div class="grass"');
if (grassPosition < 0) throw new Error('Footer grass band is missing.');
const grassSvg = html.indexOf('<svg', grassPosition);
const [grassStart, grassEnd] = elementRange(html, grassSvg, 'svg');
html = html.slice(0, grassStart) + `<svg width="100%" height="38" aria-hidden="true">
<defs><pattern id="painted-footer-grass" width="140" height="38" patternUnits="userSpaceOnUse">
  <use href="#painted-grass" x="12" y="9" width="30" height="27" />
  <use href="#painted-seedgrass" x="85" y="12" width="22" height="24" />
</pattern></defs>
<rect width="100%" height="38" fill="url(#painted-footer-grass)" />
</svg>` + html.slice(grassEnd);

html = rewriteByClass(html, 'svg', 'portrait-frame', '<use href="#painted-frame" width="240" height="240" />');

const landscape = (await fs.readFile('assets/safari-painted-landscape.webp')).toString('base64');
const definition = `<symbol id="painted-landscape" viewBox="0 0 1354 1161" preserveAspectRatio="none"><image width="1354" height="1161" href="data:image/webp;base64,${landscape}" /></symbol>`;
if (!html.includes('      <defs>')) throw new Error('Shared artwork definitions are missing.');
html = html.replace('      <defs>', () => `      <defs>\n${definition}`);

const [verifiedStart, verifiedEnd] = rangeByClass(html, 'svg', 'scene');
const verifiedScene = html.slice(verifiedStart, verifiedEnd);
for (const name of ['monkey', 'zebra', 'giraffe', 'lion', 'elephant']) {
  if ((verifiedScene.match(new RegExp(`data-animal="${name}"`, 'g')) || []).length !== 1) throw new Error(`The hero ${name} target was duplicated or removed.`);
}
if (!html.includes('id="painted-walk-assets"') || !html.includes('id="parade-track"')) throw new Error('The walking parade was not preserved.');
await fs.mkdir('.vercel', { recursive: true });
try { await fs.writeFile('.vercel/pre-painted-scenery.html', await fs.readFile(file), { flag: 'wx' }); }
catch (error) { if (error.code !== 'EEXIST') throw error; }
await fs.writeFile(file, html);
console.log('Applied painted hero scenery, footer, meadow, grass, and portrait frame. Animal controls and walking rigs were preserved.');
