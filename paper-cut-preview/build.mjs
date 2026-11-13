import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { retargetWalk } from './retarget-walk.mjs';
import { buildHeroMotion } from './hero-motion.mjs';
import { refineFooter } from './footer.mjs';
import { refineHost } from './host.mjs';
import { loadRenderedAssets } from './rendered-assets.mjs';
import { improvePerformance } from './performance.mjs';

const dir=path.dirname(fileURLToPath(import.meta.url));
const rendered=await loadRenderedAssets();
const read=(name)=>fs.readFile(path.join(dir,name),'utf8');
const data=async(name,mime)=>`data:${mime};base64,${(await fs.readFile(path.join(dir,'assets',name))).toString('base64')}`;
let html=await fs.readFile(path.join(dir,'..','index.html'),'utf8');
html=html.replace(/<fieldset class="editor-section">\s*<legend>Trail schedule<\/legend>[\s\S]*?<\/fieldset>/,'');
html=html.replace(/^[ \t]*\["scheduleTitle", "Trail schedule heading", "text", 100, true\],\r?\n/m,'');
const trailEditorStart=html.indexOf('      function readTrailDraft() {');
const faqEditorStart=html.indexOf('      function readFaqDraft() {',trailEditorStart);
if(trailEditorStart<0||faqEditorStart<0)throw new Error('Host editor boundaries not found');
html=html.slice(0,trailEditorStart)+html.slice(faqEditorStart);
html=html.replace(/^[ \t]*(?:renderTrailEditor\(\)|updateTrailControls\(\)|put\("#trail-editor-status", ""\)|next\.schedule = readTrailDraft\(\));\r?\n/gm,'');
// Hidden legacy activity data must not constrain the host's editable party hours.
html=html.replace(/at <= previous\s*\|\|\s*at < Date\.parse\(result\.start\)\s*\|\|\s*at > Date\.parse\(result\.end\)/,'at <= previous');
html=html.replace("Trail stops must be in time order, within the party's start and end times.",'Stored activity times must be in order.');
html=html.replace('<body>','<body class="paper-preview">');
html=html.replace(/<link[^>]+(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[\s\S]*?>/g,'');
html=html.replace(/<meta name="elio-backend"[^>]*>/g,'');
html=html.replace('elio-safari-invitation-v1','elio-paper-preview-invitation-v1').replace('elio-safari-replies-v1','elio-paper-preview-replies-v1').replace('elio-safari-my-id-v1','elio-paper-preview-my-id-v1');
html=html.replace(/<title>[^<]*<\/title>/,'<title>Elio’s first adventure · Paper-cut preview</title>');
html=html.replace('document.title = CONFIG.child + "\'s First Safari · You\'re invited";', 'document.title = CONFIG.child + "\'s First Safari · Local preview";');
html=html.replace('Come celebrate his first trip around the sun with a little safari. Explorers of every size are welcome.','Come celebrate his first trip around the sun.');
const share=html.match(/<button\b[^>]*id="share-invitation"[^>]*>[\s\S]*?<\/button>/)?.[0];
if(!share)throw new Error('Share control not found');
html=html.replace(share,'');
html=html.replace('<div class="footer-links">',()=>'<div class="footer-links">'+share);
html=html.replace(/<div class="poster-actions">[\s\S]*?<\/div>/,block=>block.replace('RSVP now','RSVP').replace('See the map','Event details').replace('href="#base-camp"','href="#day-plan"'));
html=html.replace(/put\(\s*"#poster-date",[\s\S]*?put\(\s*"#full-date",/,`put("#poster-date", new Intl.DateTimeFormat("en-GB", {timeZone:zone,day:"numeric",month:"long",year:"numeric"}).format(start) + " · " + format(start, {hour:"numeric",minute:"2-digit"}));
        put("#poster-venue", CONFIG.venue.replace(/\\s+-\\s+/g, " · "));
        put("#full-date",`);
const props=await data('paper-props.webp','image/webp');
const boxes={
 'painted-frame':[10,105,340,447], 'paper-photo-frame':[348,103,617,442],
 'storybook-leaves':[644,96,898,444], 'painted-ribbon':[881,210,1241,356],
 'tree':[5,509,353,804], 'painted-meadow':[307,670,685,778],
 'painted-grass':[307,670,685,778], 'painted-seedgrass':[307,670,685,778],
 'painted-sun':[696,533,946,776], 'butterfly':[1008,583,1234,757],
 'bird':[31,918,282,1127], 'storybook-compass':[301,869,536,1171],
 'storybook-binoculars':[560,928,845,1147], 'paper-hills':[862,981,1244,1104]
};
const defs=rendered?[]:[`<image id="paper-prop-atlas" width="1254" height="1254" href="${props}"/>`];
for(const [id,[x,y,r,b]] of Object.entries(boxes)){
 const w=r-x,h=b-y,clip=`paper-prop-${id}-crop`;
 defs.push(`<clipPath id="${clip}"><rect width="${w}" height="${h}"/></clipPath>`);
 const ratio=['painted-meadow','paper-hills'].includes(id)?'none':['tree','painted-grass','painted-seedgrass'].includes(id)?'xMidYMax meet':'xMidYMid meet';
 const e=rendered?.props[id];
 const content=e?`<image x="${e.x}" y="${e.y}" width="${e.width}" height="${e.height}" href="${e.href}"/>`:`<g clip-path="url(#${clip})"><use href="#paper-prop-atlas" x="${-x}" y="${-y}"/></g>`;
 const symbol=`<symbol id="${id}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${ratio}">${content}</symbol>`;
 const re=new RegExp(`<symbol id="${id}"[^>]*>[\\s\\S]*?<\\/symbol>`);
 if(re.test(html))html=html.replace(re,()=>symbol);else defs.push(symbol);
}
const {width:artWidth,height:artHeight}=JSON.parse(await read('assets/diorama-size.json'));
if(!rendered)defs.push(`<image id="paper-diorama-original" width="${artWidth}" height="${artHeight}" href="${await data('diorama.webp','image/webp')}"/>`);
const heroMotion=buildHeroMotion({width:artWidth,height:artHeight,background:'',monkeyBackground:'',rendered:rendered.hero,animals:{...JSON.parse(await read('assets/hero-animals-a.json')),...JSON.parse(await read('assets/hero-animals-b.json'))},ambient:JSON.parse(await read('assets/hero-ambient-layers.json'))});
defs.push(heroMotion.definitions);
defs.push(`<symbol id="paper-portrait-frame" viewBox="0 0 240 240"><path d="M7 115C5 48 56 7 120 6C184 5 236 49 234 115V184Q237 236 185 234H54Q4 237 7 185Z" fill="#dec49a"/><path d="M5 112C5 47 55 5 120 5C185 5 235 47 235 112V183Q235 232 185 232H55Q5 232 5 183Z" fill="#fff0cf"/><path d="M14 112C14 55 59 14 120 14C181 14 226 55 226 112V183Q226 223 185 223H55Q14 223 14 183Z" fill="none" stroke="#cba85d" stroke-width="2"/><path d="M10 112C10 51 57 10 120 10" fill="none" stroke="#fff9e9" stroke-width="2" stroke-linecap="round"/></symbol>`);
html=html.replace('<use href="#painted-frame" width="240" height="240" />','<use href="#paper-portrait-frame" width="240" height="240" />');
html=html.replace(/(<svg\s+class="portrait-leaves"[\s\S]*?<\/svg>)/,group=>group+group.replace('class="portrait-leaves"','class="portrait-leaves right"'));
html=html.replace(/<span class="portrait-ribbon"[^>]*>[\s\S]*?<\/svg><span class="portrait-ribbon-word">ONE<\/span><\/span>/,'');
html=html.replace('<defs>',()=>`<defs>\n${defs.join('\n')}`);
const scene=/<svg\b[^>]*class="scene"[\s\S]*?<\/svg>/;
html=html.replace(scene,()=>heroMotion.scene);
html=html.replace('const g = $("[data-animal=" + animal + "]");',`const g = $("[data-animal=" + animal + "]");
        const actor = $(".scene [data-hero-animal=" + animal + "]");
        if (actor) {
          actor.classList.remove("reacting");
          void actor.getBoundingClientRect();
          actor.classList.add("reacting");
          setTimeout(() => actor.classList.remove("reacting"), 650);
        }`);
html=html.replace('      </article>',`<svg class="paper-hero-hills" viewBox="0 0 1200 110" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="paper-edge-shadow" x="0" y="-40%" width="100%" height="180%"><feDropShadow dx="0" dy="-2" stdDeviation="1.4" flood-color="#102d1d" flood-opacity=".27"/></filter></defs><path d="M0 48C95 1 170 92 290 53S495 33 620 62 810 8 952 47 1100 44 1200 38V110H0Z" fill="#919b53" stroke="#bdc283" stroke-width="1" filter="url(#paper-edge-shadow)"/><path d="M0 73C120 110 155 21 300 57S510 108 664 75 838 67 975 53 1110 96 1200 60V110H0Z" fill="#768641" stroke="#a5b06c" stroke-width="1"/><use href="#storybook-leaves" x="20" y="0" width="94" height="103" transform="rotate(-48 67 76)"/><use href="#storybook-leaves" x="1075" y="0" width="94" height="103" transform="rotate(39 1122 76)"/><path d="M0 87C97 115 127 34 270 62S436 104 570 85 719 51 833 67 1017 115 1113 82 1167 77 1200 89V112H0Z" fill="#f6f0df" filter="url(#paper-edge-shadow)"/></svg>\n      </article>`);
html=html.replace('const frame = el("div", "photo-placeholder");',`const frame = el("div", "photo-placeholder");
        const paperFrame = document.createElementNS(NS, "svg");
        paperFrame.setAttribute("class", "paper-card-frame");
        paperFrame.setAttribute("viewBox", "0 0 269 339");
        paperFrame.setAttribute("preserveAspectRatio", "none");
        paperFrame.setAttribute("aria-hidden", "true");
        const paperFrameArt = document.createElementNS(NS, "use");
        paperFrameArt.setAttribute("href", "#paper-photo-frame");
        paperFrameArt.setAttribute("width", "269"); paperFrameArt.setAttribute("height", "339");
        paperFrame.append(paperFrameArt); frame.append(paperFrame);`);
const rigs=JSON.parse(await read('assets/paper-walk-rig.json'));
html=retargetWalk(html,rigs,'','',rendered).html;
html=refineFooter(html);
html=refineHost(html);
html=improvePerformance(html);
// Remove obsolete raster payloads after their consumers have been replaced.
html=html.replace(/<image id="(?:safari-atlas|safari-walk-poses|painted-decor-atlas)"[^>]*\/>/g,'');
html=html.replace(/<symbol id="painted-landscape"[^>]*>[\s\S]*?<\/symbol>/,'');
html=html.replace(/<symbol id="(?:painted-frond|painted-cloud|painted-bunting)"[^>]*>[\s\S]*?<\/symbol>/g,'');
html=html.replace(/<symbol id="paw"[^>]*>[\s\S]*?<\/symbol>/,'<symbol id="paw" viewBox="0 0 28 30"><g fill="#bf985a" stroke="#e0c897" stroke-width=".6"><ellipse cx="5" cy="10" rx="3.2" ry="4" transform="rotate(-25 5 10)"/><ellipse cx="11" cy="5" rx="3" ry="4"/><ellipse cx="19" cy="5" rx="3" ry="4"/><ellipse cx="25" cy="11" rx="3" ry="4" transform="rotate(25 25 11)"/><path d="M5 24c0-4 3-5 5-9 2-3 6-3 8 0 2 4 6 5 6 9 0 6-6 3-10 3s-9 3-9-3Z"/></g></symbol>');
let css=`@font-face{font-family:Caprasimo;font-style:normal;font-weight:400;font-display:swap;src:url('${await data('caprasimo.woff2','font/woff2')}') format('woff2')}\n@font-face{font-family:Figtree;font-style:normal;font-weight:400 800;font-display:swap;src:url('${await data('figtree.woff2','font/woff2')}') format('woff2')}\n:root{--paper-grain:url('${rendered.textureHref}')}\n`;
for(const file of ['base','controls','journal','footer','hero-motion','host'])css+=await read('styles/'+file+'.css')+'\n';
const awaitHostScript=await read('host-enhancements.js');
html=html.replace('  </head>',()=>`<style id="paper-cut-styles">${css}</style><script id="host-usability">${awaitHostScript}</script>\n  </head>`);
await fs.writeFile(path.join(dir,'index.html'),html);
console.log('Built the separate, self-contained paper-cut preview. Production files were not changed.');
