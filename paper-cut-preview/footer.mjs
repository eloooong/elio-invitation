export function refineFooter(html) {
  const original=html.match(/<footer class="footer">[\s\S]*?<\/footer>/)?.[0];
  if(!original)throw new Error('Footer not found');
  const share=original.match(/<button\b[^>]*id="share-invitation"[^>]*>[\s\S]*?<\/button>/)?.[0];
  const host=original.match(/<button\b[^>]*id="open-host"[^>]*>[\s\S]*?<\/button>/)?.[0];
  const family=original.match(/<p id="family-credit">[\s\S]*?<\/p>/)?.[0];
  const heading=original.match(/<p class="display">[\s\S]*?<\/p>/)?.[0];
  const scene=original.match(/<svg class="footer-vignette"[\s\S]*?<\/svg>/)?.[0];
  if(!share||!host||!family||!heading||!scene)throw new Error('Footer content missing');
  const compact=`<svg class="footer-vignette footer-scene-compact" viewBox="0 0 460 226" aria-hidden="true">
    <use href="#painted-sun" x="204" y="7" width="68" height="68"/>
    <use href="#tree" x="0" y="84" width="112" height="112"/>
    <use href="#tree" x="365" y="92" width="95" height="102"/>
    <use href="#painted-meadow" x="0" y="184" width="240" height="42"/>
    <use href="#painted-meadow" x="220" y="184" width="240" height="42"/>
    <use href="#storybook-leaves" x="2" y="155" width="44" height="62"/>
    <use href="#storybook-leaves" x="417" y="151" width="43" height="63"/>
    <use href="#mini-elephant" x="32" y="121" width="106" height="88"/>
    <use href="#mini-zebra" x="143" y="126" width="82" height="82"/>
    <use href="#mini-lion" x="244" y="126" width="104" height="83"/>
    <use href="#mini-giraffe" x="350" y="67" width="88" height="142"/>
    <use href="#mini-tortoise" x="207" y="173" width="58" height="42"/>
    <use href="#butterfly" x="151" y="89" width="19" height="19"/>
    <use href="#bird" x="300" y="55" width="26" height="15"/>
  </svg>`;
  const footer=`<footer class="footer">
    <div class="footer-copy">${heading}${family}<div class="footer-share">${share}</div></div>
    <div class="footer-scene">${scene.replace('class="footer-vignette"','class="footer-vignette footer-scene-wide"')}${compact}</div>
    <svg class="footer-ground" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 37C130 7 200 51 360 40S605 21 740 39 980 9 1200 30V70H0Z" fill="#768641"/><path d="M0 54C170 30 255 69 420 53S684 42 820 54 1020 33 1200 44V70H0Z" fill="#929e57"/></svg>
    <div class="footer-links"><span class="label">Our greatest little adventure</span>${host}</div>
  </footer>`;
  return html.replace(original,()=>footer);
}
