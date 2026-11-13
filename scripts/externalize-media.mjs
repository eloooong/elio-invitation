import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
export async function externalizeMedia(html,outputDir){
 const files=new Map(),extensions={'image/webp':'webp','image/png':'png','image/jpeg':'jpg','audio/mpeg':'mp3','font/woff2':'woff2'};
 function url(mime,encoded){
  if(!extensions[mime])throw new Error('Unsupported embedded media: '+mime);
  const bytes=Buffer.from(encoded,'base64'),hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20);
  const file=hash+'.'+extensions[mime];files.set(file,bytes);return'/media/'+file;
 }
 html=html.replace(/\b(href|src)=(["'])data:([^;]+);base64,([A-Za-z0-9+/=]+)\2/g,(_all,attr,q,mime,encoded)=>`${attr}=${q}${url(mime,encoded)}${q}`);
 html=html.replace(/url\((["']?)data:([^;]+);base64,([A-Za-z0-9+/=]+)\1\)/g,(_all,q,mime,encoded)=>`url('${url(mime,encoded)}')`);
 const hero=html.match(/class="hero-backplate"><image[^>]+href="([^"]+)"/)?.[1];
 if(hero)html=html.replace('</head>',()=>`<link rel="preload" as="image" href="${hero}" fetchpriority="high"/></head>`);
 await fs.mkdir(path.join(outputDir,'media'),{recursive:true});
 for(const [file,bytes]of files)await fs.writeFile(path.join(outputDir,'media',file),bytes);
 return{html,files:files.size,totalMediaBytes:[...files.values()].reduce((n,b)=>n+b.length,0)};
}
