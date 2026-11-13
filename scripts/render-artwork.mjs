// Deterministic rendering of the approved SVG cutouts, not new illustration.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {buildHeroMotion} from '../paper-cut-preview/hero-motion.mjs';
import {buildPaperWalk,retargetWalk,paperAnimalBounds} from '../paper-cut-preview/retarget-walk.mjs';
const dir=path.resolve('paper-cut-preview/assets'),out=path.join(dir,'rendered');
await fs.mkdir(out,{recursive:true});
const read=async name=>fs.readFile(path.join(dir,name));
const json=async name=>JSON.parse(await read(name));
const pngData=async name=>sharp(await read(name)).png().toBuffer();
const data=async name=>'data:image/png;base64,'+(await pngData(name)).toString('base64');
const manifest={hero:{pieces:{}},walk:{},mini:{},props:{},inputs:{}};
for(const name of ['diorama.webp','hero-motion-background.webp','hero-monkey-background.webp','paper-animals.webp','paper-props.webp','paper-texture.webp','lion-eye.webp','hero-animals-a.json','hero-animals-b.json','hero-ambient-layers.json','paper-walk-rig.json'])manifest.inputs[name]=crypto.createHash('sha256').update(await read(name)).digest('hex');
async function render(name,defs,fragment,box,scale=1){
 const [x,y,w,h]=box.map(Number);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"><defs>${defs}</defs>${fragment}</svg>`;
 const png=await sharp(Buffer.from(svg.replaceAll(' href=',' xlink:href='))).png().toBuffer();
 const {data:pixels,info}=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let l=info.width,t=info.height,r=-1,b=-1;
 for(let yy=0;yy<info.height;yy++)for(let xx=0;xx<info.width;xx++)if(pixels[(yy*info.width+xx)*4+3]){l=Math.min(l,xx);t=Math.min(t,yy);r=Math.max(r,xx);b=Math.max(b,yy);}
 if(r<l)throw new Error('Empty rendered cutout: '+name);
 const file=name+'.webp';
 let image=sharp(png).extract({left:l,top:t,width:r-l+1,height:b-t+1});
 if(scale!==1)image=image.resize({width:Math.max(1,Math.round((r-l+1)*scale))});
 await image.webp({quality:90,alphaQuality:100,effort:5}).toFile(path.join(out,file));
 await fs.writeFile(path.join(out,file+'.json'),JSON.stringify({prompt:'Sourced: deterministic rasterization of approved project SVG cutouts and existing bitmap artwork. No visual redesign. Native SVG clipping, alpha and registration preserved.',source:name},null,2));
 return {file,x:x+l,y:y+t,width:r-l+1,height:b-t+1};
}
const actors={...await json('hero-animals-a.json'),...await json('hero-animals-b.json')},ambient=await json('hero-ambient-layers.json');
const {width,height}=await json('diorama-size.json');
const hero=buildHeroMotion({animals:actors,ambient,width,height,background:await data('hero-motion-background.webp'),monkeyBackground:await data('hero-monkey-background.webp')});
const heroDefs=`<image id="paper-diorama-original" width="${width}" height="${height}" href="${await data('diorama.webp')}"/>${hero.definitions}`;
const still='<use href="#hero-motion-background" mask="url(#hero-vacated-paper)"/><use href="#hero-monkey-background" mask="url(#hero-monkey-vacated)"/><use href="#paper-diorama-original" mask="url(#hero-still-scene)"/>';
manifest.hero.base=await render('hero-base',heroDefs,still,[0,0,width,height],.85);
for(const match of hero.definitions.matchAll(/<mask id="hero-piece-([^"]+)"[^>]*x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/g)){
 const name=match[1];
 manifest.hero.pieces[name]=await render('hero-'+name,heroDefs,`<g mask="url(#hero-piece-${name})"><use href="#paper-diorama-original"/></g>`,match.slice(2,6));
}
console.log('Rendered hero backplate and '+Object.keys(manifest.hero.pieces).length+' moving cutouts.');
const rigs=await json('paper-walk-rig.json');
const stub=`<svg><defs>${buildPaperWalk(rigs)}${Object.keys(rigs).map(name=>`<symbol id="mini-${name}"></symbol>`).join('')}</defs></svg>`;
const native=retargetWalk(stub,rigs,(await pngData('paper-animals.webp')).toString('base64'),(await pngData('lion-eye.webp')).toString('base64')).html.replaceAll('data:image/webp;','data:image/png;');
const nativeDefs=native.slice(native.indexOf('<defs>')+6,native.lastIndexOf('</defs>'));
for(const [name,rig] of Object.entries(rigs)){
 const [l,t,r,b]=rig.box,box=[l-22,t-6,r-l+44,b-t+14];
 const crop=`<g clip-path="url(#walk-${name}-crop)">`,atlas='<use href="#paper-animal-atlas"/>';
 const body=`${crop}<g mask="url(#walk-${name}-body)">${atlas}</g></g>`;
 const result={body:await render('body-'+name,nativeDefs,body,box),parts:{}};
 for(const part of rig.parts)result.parts[part.name]=await render('leg-'+name+'-'+part.name,nativeDefs,`${crop}<g clip-path="url(#walk-${name}-${part.name}-clip)">${atlas}</g></g>`,box);
 manifest.walk[name]=result;
 const [ml,mt,mr,mb]=paperAnimalBounds[name];
 manifest.mini[name]=await render('mini-'+name,nativeDefs,atlas,[ml-3,mt-3,mr-ml+6,mb-mt+6]);
}
console.log('Rendered twelve intact animals and all lower-leg cutouts.');
const boxes={'painted-frame':[10,105,340,447],'paper-photo-frame':[348,103,617,442],'storybook-leaves':[644,96,898,444],'painted-ribbon':[881,210,1241,356],'tree':[5,509,353,804],'painted-meadow':[307,670,685,778],'painted-grass':[307,670,685,778],'painted-seedgrass':[307,670,685,778],'painted-sun':[696,533,946,776],'butterfly':[1008,583,1234,757],'bird':[31,918,282,1127],'storybook-compass':[301,869,536,1171],'storybook-binoculars':[560,928,845,1147],'paper-hills':[862,981,1244,1104]};
const propDefs=`<image id="props" width="1254" height="1254" href="${await data('paper-props.webp')}"/>`;
for(const [name,[l,t,r,b]]of Object.entries(boxes)){
 const asset=await render('prop-'+name,propDefs,'<use href="#props"/>',[l,t,r-l,b-t]);
 asset.x-=l;asset.y-=t;manifest.props[name]=asset;
}
await sharp(await read('paper-texture.webp')).resize(256,256).webp({quality:75}).toFile(path.join(out,'paper-texture.webp'));
await fs.writeFile(path.join(out,'paper-texture.webp.json'),JSON.stringify({prompt:'Sourced: downsampled existing approved paper-texture.webp to 256px for background tiling.'}));
manifest.texture='paper-texture.webp';
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
const files=await fs.readdir(out);let bytes=0;for(const f of files.filter(f=>f.endsWith('.webp')))bytes+=(await fs.stat(path.join(out,f))).size;
console.log(`Prepared ${files.filter(f=>f.endsWith('.webp')).length} cacheable cutouts, ${Math.round(bytes/1024)} KB total.`);
