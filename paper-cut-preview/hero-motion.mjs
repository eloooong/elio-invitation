const targets={monkey:[110,170,75,75],zebra:[205,193,89,65],giraffe:[405,198,105,195],lion:[228,294,120,112],elephant:[73,232,180,150]};

export function buildHeroMotion({animals,ambient,background,monkeyBackground,width,height,rendered}) {
  const objects={...animals,
    cloudLeft:{...ambient.cloudLeft,bounds:[390,197,672,301]},
    cloudRight:{...ambient.cloudRight,bounds:[1021,260,1259,354]},
    sunRays:{...ambient.sunRays,bounds:[670,138,1024,482]}};
  const shape=(name,color,stroke=0)=>`<path d="${objects[name].path}" fill="${color}" fill-rule="evenodd" stroke="${color}" stroke-width="${stroke}" stroke-linejoin="round"/>`;
  const definitions=[`<image id="hero-motion-background" width="${width}" height="${height}" href="${background}"/>`,
    `<image id="hero-monkey-background" width="${width}" height="${height}" href="${monkeyBackground}"/>`,
    `<mask id="hero-monkey-vacated" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" style="mask-type:luminance">${shape('monkey','white',12)}</mask>`,
    `<mask id="hero-still-scene" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" style="mask-type:luminance"><rect width="${width}" height="${height}" fill="white"/>${Object.keys(objects).map(name=>shape(name,'black',8)).join('')}</mask>`,
    `<mask id="hero-vacated-paper" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" style="mask-type:luminance">${Object.keys(objects).map(name=>shape(name,'white',12)).join('')}</mask>`];
  for(const [name,obj] of Object.entries(objects)) {
    const [l,t,r,b]=obj.bounds;
    definitions.push(`<mask id="hero-piece-${name}" maskUnits="userSpaceOnUse" x="${l-8}" y="${t-8}" width="${r-l+16}" height="${b-t+16}" style="mask-type:luminance">${shape(name,'white',3)}</mask>`);
  }
  const bitmap=e=>`<image x="${e.x}" y="${e.y}" width="${e.width}" height="${e.height}" href="${e.href}"/>`;
  const pixels=name=>rendered?bitmap(rendered.pieces[name]):`<g mask="url(#hero-piece-${name})"><use href="#paper-diorama-original"/></g>`;
  const pivotStyle=obj=>`--hero-pivot:${obj.pivot[0]}px ${obj.pivot[1]}px`;
  const clouds=['cloudLeft','cloudRight'].map((name,i)=>`<g class="hero-cloud hero-cloud-${i+1}">${pixels(name)}</g>`).join('');
  const rays=`<g class="hero-ray-sway" style="${pivotStyle(objects.sunRays)}">${pixels('sunRays')}</g>`;
  const water=`<g class="hero-river-glints">${ambient.water.paths.map((path,i)=>`<path class="hero-water-glint glint-${i+1}" d="${path}" pathLength="100"/>`).join('')}</g>`;
  const characters=['monkey','zebra','giraffe','elephant','lion'].map(name=>`<g class="hero-character hero-character-${name}" data-hero-animal="${name}" style="${pivotStyle(animals[name])}"><g class="hero-idle"><g class="hero-hello">${pixels(name)}</g></g></g>`).join('');
  const scene=`<svg class="scene" viewBox="0 0 560 441" aria-labelledby="scene-title scene-desc"><title id="scene-title">Elio’s living paper-cut safari</title><desc id="scene-desc">Clouds drift, sunlight shimmers and the friendly paper animals breathe and sway gently. Tap an animal to say hello.</desc><svg class="hero-native-canvas" width="560" height="441" viewBox="0 0 ${width} ${height}" aria-hidden="true" pointer-events="none"><use href="#hero-motion-background" mask="url(#hero-vacated-paper)"/><use href="#hero-monkey-background" mask="url(#hero-monkey-vacated)"/><use href="#paper-diorama-original" mask="url(#hero-still-scene)"/><circle class="hero-sun-warmth" cx="849" cy="314" r="111" fill="#ffd16c"/>${rays}${clouds}${water}${characters}</svg>${Object.entries(targets).map(([name,[x,y,w,h]])=>`<g data-animal="${name}" role="button" tabindex="0" aria-label="Say hello to the ${name}"><rect class="animal-hit" x="${x}" y="${y}" width="${w}" height="${h}" rx="18"/></g>`).join('')}</svg>`;
  if(rendered){
    const staticUses='<use href="#hero-motion-background" mask="url(#hero-vacated-paper)"/><use href="#hero-monkey-background" mask="url(#hero-monkey-vacated)"/><use href="#paper-diorama-original" mask="url(#hero-still-scene)"/>';
    return {definitions:'',scene:scene.replace(staticUses,()=>`<g class="hero-backplate">${bitmap(rendered.base)}</g>`)};
  }
  return {definitions:definitions.join('\n'),scene};
}
