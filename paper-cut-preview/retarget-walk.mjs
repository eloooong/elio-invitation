import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const paperAnimalBounds = {
  elephant: [16, 36, 399, 369], giraffe: [413, 11, 679, 368],
  zebra: [736, 65, 1058, 367], lion: [1102, 65, 1421, 370],
  monkey: [45, 413, 271, 714], hippo: [345, 434, 691, 705],
  rhino: [723, 428, 1075, 704], antelope: [1126, 391, 1408, 712],
  cheetah: [14, 752, 339, 1060], ostrich: [384, 727, 644, 1066],
  crocodile: [651, 843, 1089, 1023], tortoise: [1108, 833, 1425, 1040],
};

export function buildPaperWalk(rigs,rendered) {
  const definitions = [], symbols = [];
  for (const [species, rig] of Object.entries(rigs)) {
    const [left, top, right, bottom] = rig.box;
    const x=left-22, y=top-6, width=right-left+44, height=bottom-top+14;
    const id=`walk-${species}`;
    if(!rendered)definitions.push(`<clipPath id="${id}-crop"><rect x="${left-3}" y="${top-3}" width="${right-left+6}" height="${bottom-top+6}"/></clipPath>`);
    if(!rendered)definitions.push(`<mask id="${id}-body" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${width}" height="${height}" style="mask-type:luminance"><rect x="${x}" y="${y}" width="${width}" height="${height}" fill="white"/>${rig.parts.map(p=>`<path d="${p.cut}" fill="black"/>`).join('')}</mask>`);
    if(!rendered)for (const part of rig.parts) definitions.push(`<clipPath id="${id}-${part.name}-clip"><path d="${part.path}"/></clipPath>`);
    const bitmap=e=>`<image x="${e.x}" y="${e.y}" width="${e.width}" height="${e.height}" href="${e.href}"/>`;
    const limbs=['far','near'].flatMap(layer=>rig.parts.filter(p=>p.layer===layer)).map(part=>`<g class="walk-limb" data-species="${species}" data-part="${part.name}" data-pivot="${part.pivot.join(',')}" data-phase="${part.phase}" data-swing="${rig.swing}" data-lift="${rig.lift}" data-cycle="${rig.cycle}" data-foot-y="${part.footY??bottom}" transform="rotate(0 ${part.pivot.join(' ')})"><g clip-path="url(#${id}-crop)"><g clip-path="url(#${id}-${part.name}-clip)"><use href="#paper-animal-atlas"/></g></g></g>`).join('');
    // Preserve the torso and upper joints above every moving lower leg.
    const body=`<g class="walk-fixed-body" clip-path="url(#${id}-crop)"><g mask="url(#${id}-body)"><use href="#paper-animal-atlas"/></g></g>`;
    let content=limbs+body;
    if(rendered){
      content=content.replace(/<g class="walk-limb"([^>]*)>([\s\S]*?)<\/g><\/g><\/g>/g,(_all,attrs)=>{
        const part=attrs.match(/data-part="([^"]+)"/)[1];return `<g class="walk-limb"${attrs}>${bitmap(rendered[species].parts[part])}</g>`;
      });
      content=content.replace(body,()=>`<g class="walk-fixed-body">${bitmap(rendered[species].body)}</g>`);
    }
    symbols.push(`<symbol id="${id}" viewBox="${x} ${y} ${width} ${height}" preserveAspectRatio="xMidYMax meet" overflow="visible">${content}</symbol>`);
  }
  return `<!-- Painted walking assets: paper-specific lower-leg rigs. -->\n<g id="painted-walk-assets">${definitions.join('\n')}\n${symbols.join('\n')}</g>\n<!-- /Painted walking assets -->`;
}

export function retargetWalk(html, rigs, atlasBase64, lionEyeBase64='',rendered) {
  for (const name of Object.keys(paperAnimalBounds)) if(!rigs[name]?.parts.length) throw new Error(`Missing paper walk rig: ${name}`);
  html=html.replace(/<!-- Painted walking assets:[\s\S]*?<!-- \/Painted walking assets -->/,()=>buildPaperWalk(rigs,rendered?.walk));
  let minis=0;
  html=html.replace(/<symbol\b[^>]*\bid="mini-([a-z]+)"[^>]*>[\s\S]*?<\/symbol>/g,(_symbol,name)=>{
    const [left,top,right,bottom]=paperAnimalBounds[name]; minis++;
    if(rendered){const e=rendered.mini[name];return `<symbol id="mini-${name}"${name==='lion'?' data-lion-eye-corrected="true"':''} viewBox="${left-3} ${top-3} ${right-left+6} ${bottom-top+6}" preserveAspectRatio="xMidYMax meet"><image x="${e.x}" y="${e.y}" width="${e.width}" height="${e.height}" href="${e.href}"/></symbol>`;}
    return `<symbol id="mini-${name}" viewBox="${left-3} ${top-3} ${right-left+6} ${bottom-top+6}" preserveAspectRatio="xMidYMax meet" overflow="hidden"><g clip-path="url(#paper-mini-${name}-crop)"><use href="#paper-animal-atlas"/></g></symbol>`;
  });
  const crops=Object.entries(paperAnimalBounds).map(([name,[left,top,right,bottom]])=>`<clipPath id="paper-mini-${name}-crop"><rect x="${left-3}" y="${top-3}" width="${right-left+6}" height="${bottom-top+6}"/></clipPath>`).join('\n');
  const pixels=lionEyeBase64?`<radialGradient id="paper-lion-eye-blend"><stop offset="65%" stop-color="white"/><stop offset="100%" stop-color="black"/></radialGradient><mask id="paper-lion-eye-mask" maskUnits="userSpaceOnUse" x="1353" y="132" width="30" height="31" style="mask-type:luminance"><circle cx="1370" cy="150" r="13" fill="url(#paper-lion-eye-blend)"/></mask><g id="paper-animal-atlas"><image width="1448" height="1086" href="data:image/webp;base64,${atlasBase64}"/><image x="1353" y="132" width="30" height="31" href="data:image/webp;base64,${lionEyeBase64}" mask="url(#paper-lion-eye-mask)"/></g>`:`<image id="paper-animal-atlas" width="1448" height="1086" href="data:image/webp;base64,${atlasBase64}"/>`;
  const atlas=rendered?'<!-- Paper animal atlas: rendered cutouts. --><!-- /Paper animal atlas -->':`<!-- Paper animal atlas: retarget-walk.mjs. -->\n${pixels}\n${crops}\n<!-- /Paper animal atlas -->`;
  const existing=/<!-- Paper animal atlas:[\s\S]*?<!-- \/Paper animal atlas -->/;
  html=existing.test(html)?html.replace(existing,()=>atlas):html.replace('<defs>',()=>'<defs>\n'+atlas);
  const walks=(html.match(/<symbol id="walk-/g)||[]).length;
  const limbs=(html.match(/class="walk-limb"/g)||[]).length;
  if(walks!==12||minis!==12||limbs!==Object.values(rigs).reduce((n,r)=>n+r.parts.length,0))throw new Error('Incomplete paper walking assets');
  return {html,walks,minis,limbs};
}

const thisFile=fileURLToPath(import.meta.url);
if(process.argv[1]&&path.resolve(process.argv[1])===thisFile){
  const dir=path.dirname(thisFile), target=path.join(dir,'index.html');
  const rigs=JSON.parse(await fs.readFile(path.join(dir,'assets/paper-walk-rig.json'),'utf8'));
  const rendered=await(await import('./rendered-assets.mjs')).loadRenderedAssets();
  const result=retargetWalk(await fs.readFile(target,'utf8'),rigs,'','',rendered);
  if(!process.argv.includes('--check'))await fs.writeFile(target,result.html);
  console.log(`Built ${result.walks} paper-specific walking animals with ${result.limbs} lower-leg parts.`);
}
