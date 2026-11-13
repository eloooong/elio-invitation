import fs from 'node:fs/promises';
import crypto from 'node:crypto';
export async function loadRenderedAssets(){
 const assets=new URL('./assets/',import.meta.url),dir=new URL('rendered/',assets);
 const manifest=JSON.parse(await fs.readFile(new URL('manifest.json',dir),'utf8'));
 for(const [file,hash]of Object.entries(manifest.inputs)){
  const current=crypto.createHash('sha256').update(await fs.readFile(new URL(file,assets))).digest('hex');
  if(current!==hash)throw new Error('Artwork changed; run npm run assets:render before building.');
 }
 const cache=new Map();
 async function hydrate(value){
  if(value&&typeof value==='object'){
   if(value.file){if(!cache.has(value.file))cache.set(value.file,'data:image/webp;base64,'+(await fs.readFile(new URL(value.file,dir))).toString('base64'));return{...value,href:cache.get(value.file)};}
   for(const key of Object.keys(value))value[key]=await hydrate(value[key]);
  }
  return value;
 }
 await hydrate(manifest.hero);await hydrate(manifest.walk);await hydrate(manifest.mini);await hydrate(manifest.props);
 manifest.textureHref='data:image/webp;base64,'+(await fs.readFile(new URL(manifest.texture,dir))).toString('base64');
 return manifest;
}
