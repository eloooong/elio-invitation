# Local paper-cut redesign

Preview: http://127.0.0.1:8777/

The approved design is live at **https://elios-birthday.vercel.app**. Production builds derive the design from this directory and enable the shared database; this local preview still uses separate browser storage. The original `../index.html` remains the source used by the design builder. Review fixtures are excluded from deployment.

## Build and view

Run from the project root:

```powershell
node paper-cut-preview/build.mjs
python -m http.server 8777 --bind 127.0.0.1 --directory paper-cut-preview
```

Open the preview URL, or open this directory’s `index.html` directly. The build copies the existing invitation’s content and behavior, adds the new artwork and styling, removes the production backend connection, and isolates its localStorage keys. Changes in the host editor are local to the preview browser. Local preview passcode: `safari-demo`. Production sign-in uses the server-configured host password.

## What changed

- Wide forest-green paper diorama matched to the supplied hero reference, with a larger real photographic portrait in a thin scalloped cream-and-gold frame.
- Living hero diorama: the five original whole-animal cutouts gently breathe, sway or swing, with drifting clouds, softly moving sun rays and river glints. Tap an animal, or activate it with the keyboard, for a brief greeting.
- Direct entry into the invitation with a subtle 900ms paper-arrive hero entrance.
- Matching paper-cut props, photo frames, grasses, divider hills and footer scenery.
- Twelve paper animal species with 43 lower-leg joints traced for this artwork. One fixed torso layer covers the moving leg joins, keeping the parade connected and grounded.
- Curved cream foreground and olive paper hills, compact header navigation and an unboxed photo-journal opening.
- Responsive countdown, field guide, map, RSVP, FAQ and host tools; a paper landscape footer with a clear sign-off, gold share action and separate cream host utility row. The animal scene uses a fuller arrangement on phones and small laptops.
- Bundled rounded Caprasimo and Figtree fonts, accessible contrast and reduced-motion support.

The local preview and downloaded HTML are self-contained, including images, fonts and existing music. The live page loads separately cached, content-hashed media so the initial HTML stays small. Music loads after guest interaction. The map needs internet access; its external Open in Maps link remains available.

Runtime artwork uses pre-rendered transparent WebP cutouts instead of repeatedly masking full-size atlases. Regenerate these deterministic assets with `npm run assets:render` after changing the source artwork or rig geometry; the normal build checks source hashes and preserves the approved registration. The journal follows the display refresh rate while moving, skips unchanged frames and avoids redundant card-state writes. Swipes use a velocity-aware spring snap; rapid arrow clicks advance from the intended month, and outer cards fade before becoming hidden. Offline downloads fetch the complete embedded template on demand, then include current saved edits.

The hero is assembled by [`hero-motion.mjs`](hero-motion.mjs) and animated by [`styles/hero-motion.css`](styles/hero-motion.css). Native SVG silhouette masks lift the original diorama pixels as complete paper cutouts, preserving their anatomy, texture and details. A hidden inpainted backing fills only the tiny areas exposed when a cutout moves; the original frame, scenery and sun disc remain still. All five animal idles, cloud/ray motion and water glints pause offscreen and when the browser tab is hidden. Reduced-motion preferences disable hero motion, including greeting animations; animal controls and announcements remain available.

The invitation opens directly. The hero’s existing `paper-arrive` entrance settles over 900ms, followed by the ongoing gentle diorama and animal animations. Reduced-motion preferences disable the entrance and ongoing motion.

## Host dashboard

Open **Host view** and sign in with `safari-demo`. The passcode field has a Show/Hide control. The dashboard separates **Guest replies** from **Invitation settings**, with plain labels and compact totals that distinguish guests attending from attending and declined replies.

- **Manage replies:** search names, messages or food needs, then combine the search with the counted All / Coming / Can't come filters. The result count shows how many replies match. **Add reply** opens the manual reply form and focuses Guest name. **Export guest list** expands the copy and CSV tools inline; **Food needs** expands the dietary summary.
- **Edit settings:** switch between **Details**, **Questions** and **Photos** without losing draft values. Details keeps the party basics visible and groups welcome, dress code, gifts and journal text under **Invitation wording**. Photos retains the portrait and all twelve monthly slots; empty months remain placeholders.
- **Save and review:** a sticky save bar keeps draft status, **Save changes** and **Save & preview** reachable during long edits. Save & preview saves locally before opening the invitation; **Back to editor** returns to settings. **More options** contains **Download invitation** and **Discard unsaved changes**. Download saves and includes the current content in a self-contained HTML file; discard restores the last applied version and reports “Changes discarded.” Invalid fields reveal their section or wording disclosure and receive focus.

Replies and edits remain in this browser and do not sync to other devices. Trail schedule controls and the schedule heading field remain removed; saved party hours can be edited independently of retained legacy activity data.

Host QA uses the separate `review/host-qa.html` fixture, generated by `review/build-host-qa.mjs`. Its `elio-paper-host-ui-qa-` storage keys isolate test replies and edits from the preview's `elio-paper-preview-` keys and from production data.

## Artwork and provenance

Created with the built-in ImageGen tool using the approved paper-cut website concept as the style reference. The animal atlas additionally used the existing animal atlas as a species and anatomy reference. Original PNGs and browser WebP assets are saved here:

- [Diorama](assets/diorama.png) · [WebP](assets/diorama.webp)
- [Hero motion background plate](assets/hero-motion-background.png) · [WebP](assets/hero-motion-background.webp)
- [Localized monkey background plate](assets/hero-monkey-background.png) · [WebP](assets/hero-monkey-background.webp)
- [Paper props and frames](assets/paper-props.png) · [WebP](assets/paper-props.webp)
- [Twelve animal atlas](assets/paper-animals.png) · [WebP](assets/paper-animals.webp)
- [Corrected two-eye lion](assets/lion-corrected.svg) · [Generated eye detail](assets/lion-eye.webp) · [Native placement](assets/lion-eye-region.json)
- [Matte paper texture](assets/paper-texture.png) · [WebP](assets/paper-texture.webp)
- [Exact generation prompt set](assets/prompts.json)

The hero backing was generated from the original diorama to remove the five animals, two clouds and surrounding sun rays and fill their former locations. Its exact edit prompt is recorded in [`assets/prompts.json`](assets/prompts.json), under `prompts["hero-motion-background"]`. This plate stays beneath the original artwork and cutouts; it is revealed only in the small vacated areas during motion.

The monkey uses a localized original-scene edit that removes only the monkey, clipped beneath its vacated silhouette to preserve the dark green sky and original hill boundary. Its exact prompt is `prompts["hero-monkey-background"]` in [`assets/prompts.json`](assets/prompts.json). The main clean backing remains in use for the other moving pieces.

Elio’s real photo is preserved from the existing invitation; it was not generated. Empty monthly frames remain placeholders.

The standing lion’s far eye was corrected with built-in ImageGen. The generated facial detail is blended into the shared native atlas in `retarget-walk.mjs`, so footer minis and walking lions use the same face while original silhouettes, bodies and leg joints stay aligned. The exact edit prompt is `prompts["lion-eye-correction"]` in `assets/prompts.json`; the full edited reference is `review/lion-eye-edited-atlas.png`.

Validation reports and desktop/mobile screenshots are in `review/`. The original production HTML’s task-start SHA256 is recorded in `review/original-sha256.txt` for comparison.
