import fs from 'node:fs/promises';
import crypto from 'node:crypto';

export async function addSharePreview(html, seed) {
 const origin='https://elios-birthday.vercel.app';
 const image=await fs.readFile('paper-cut-preview/assets/share-preview.jpg');
 const hash=crypto.createHash('sha256').update(image).digest('hex').slice(0,12);
 const file=`invitation-preview-${hash}.jpg`;
 await fs.writeFile('dist/'+file,image);
 const title=`${seed.child} is turning ONE!`;
 const description="You're invited to Elio's first birthday safari! 22 December 2026 at 3:00 PM · Kidzoona, SM City Laoag.";
 const alt="Elio Rayne's first birthday invitation with his portrait and a green paper-cut safari scene.";
 const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 const meta=(key,value,attribute='property')=>`    <meta ${attribute}="${key}" content="${escape(value)}" />`;
 const tags=[
  `<link rel="canonical" href="${origin}/" />`,
  meta('og:type','website'),
  meta('og:url',origin+'/'),
  meta('og:site_name',`${seed.child}'s First Birthday`),
  meta('og:title',title),
  meta('og:description',description),
  meta('og:image',origin+'/'+file),
  meta('og:image:secure_url',origin+'/'+file),
  meta('og:image:type','image/jpeg'),
  meta('og:image:width','1200'),
  meta('og:image:height','630'),
  meta('og:image:alt',alt),
  meta('og:locale','en_PH'),
  meta('twitter:card','summary_large_image','name'),
  meta('twitter:title',title,'name'),
  meta('twitter:description',description,'name'),
  meta('twitter:image',origin+'/'+file,'name'),
  meta('twitter:image:alt',alt,'name'),
 ].join('\n');
 return html.replace('</head>',tags+'\n</head>');
}
