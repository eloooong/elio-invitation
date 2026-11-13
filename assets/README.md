# Safari storybook artwork

`safari-storybook-atlas.png` is the original 1448 × 1086 transparent artwork generated with the built-in ImageGen tool for Elio's invitation on 12 November 2026. The image is embedded once in `index.html`; rectangular SVG clipping selects each character without modifying the original pixels. The invitation remains self-contained when downloaded.

The complete generation prompt is in `safari-storybook-prompt.txt`.

## Walking parade

The countdown parade uses separate `walk-*` symbols. Their legs are clipped from the original painted pixels and moved around measured joints; the static body is masked underneath, and small original-art collars hide attachment seams. The original `mini-*` artwork remains in the hero and footer.

`safari-walking-poses.png` supplies standing lion and monkey poses created with built-in ImageGen from the original atlas as a style and character reference. Its brief was: preserve the same gouache texture, small dark eyes, and warm colors; show the lion on four separate legs and the monkey upright with two planted feet and lowered arms; face right, retain full tails, and use a transparent background without scenery or labels.

The source-coordinate joints, masks, and phases are in `safari-walk-rig.json`. After changing the rig or source PNG, rebuild the self-contained inline definitions with:

```powershell
node scripts/build-walk-assets.mjs
npm run build
```

The walking loop runs at 30 frames per second only while the parade is visible. It pauses when hidden, resets to a neutral pose under reduced motion, and resumes when motion is enabled again.

## Matching painted scenery

`safari-painted-landscape.png` is the full 1354 × 1161 painted savanna plate. `safari-painted-decorations.png` is the 1254 × 1254 transparent library of sixteen matching props. Both were made with built-in ImageGen using the animal atlas as the style reference. A second ImageGen edit removed the decoration sheet's background haze while preserving the objects and the transparent photo-frame opening.

Generation brief: use the same soft gouache, colored-pencil detail, sage greens, warm ochres and parchment tones as the animals. Paint an open savanna with an empty sun for the native birthday numeral, cloth bunting, clouds, layered hills, two acacias, and a bare left branch for the monkey. Keep the foreground open for the five separate animal characters. The prop atlas contains an acacia, leaf sprig, frond, meadow strip, cloud, bunting, blank sun, empty scalloped paper photo frame, compass, binoculars, butterfly, bird, paw stamp, grass, seed grass and blank ribbon; all objects have clean alpha and no lettering.

The WebP siblings are delivery copies: the scenery uses quality 90, and the decoration atlas is lossless. The original PNG artwork is retained. Each delivery image is embedded once, so downloaded invitations stay self-contained. `safari-decorations-map.json` records the source rectangles; `scripts/build-painted-decorations.mjs` rebuilds the shared symbols. `scripts/apply-painted-scenery.mjs` performs the one-time scenery migration.

The background and monkey are one static plane so the hand remains attached to the branch. The monkey's local translation is `(53, 180)`, putting the hand at about `(106, 194)` in the 560 × 480 hero. The walking parade retains its separate articulated animal symbols. Functional interface icons remain vector line icons for clarity.

Art direction: professional children's picture-book gouache, soft painted shading and colored-pencil edges, small simple dark eyes without white sclera, rounded baby-animal anatomy, complete natural feet and tails, and a restrained sage / ochre / cream / chestnut palette. No scenery, labels, panels, glossy toy surfaces, or exaggerated facial features.

Atlas order, left to right:

1. Elephant, giraffe, zebra, seated lion cub.
2. Hanging monkey, hippo, rhino, antelope.
3. Cheetah, ostrich, crocodile, tortoise.

Raw alpha bounding boxes use `[left, top, right, bottom]` coordinates (right and bottom exclusive). The embedded symbols add three pixels of transparent padding and explicitly clip to the padded region to prevent neighboring artwork showing through letterboxing.

```json
{
  "elephant": [18, 24, 408, 355],
  "giraffe": [417, 9, 673, 357],
  "zebra": [752, 53, 1068, 355],
  "lion": [1133, 52, 1417, 355],
  "monkey": [67, 366, 285, 706],
  "hippo": [378, 426, 694, 693],
  "rhino": [743, 414, 1075, 688],
  "antelope": [1146, 380, 1407, 702],
  "cheetah": [11, 751, 338, 1049],
  "ostrich": [398, 729, 649, 1064],
  "crocodile": [687, 840, 1083, 1004],
  "tortoise": [1126, 838, 1421, 1022]
}
```
