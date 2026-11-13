---
name: "Elio’s Paper-Cut Invitation"
description: "A warm, sculpted paper safari for a real first-birthday celebration."
colors:
  forest: "#1e4b34"
  cream: "#f6f0df"
  sage: "#859b61"
  gold: "#efb34f"
  countdown-ochre: "#995f16"
  kraft: "#cbb489"
  muted: "#546247"
  action-cream: "#fff9e9"
  secondary-paper: "#e8e7cc"
  field-paper: "#fffbed"
typography:
  display:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "6.1cqw"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(30px, 4vw, 39px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-1px"
  journal-title:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(32px, 6vw, 47px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-1.4px"
  hero-support:
    fontFamily: "Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.25
  hero-action:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1
  footer-title:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(36px, 3.45vw, 46px)"
    fontWeight: 400
    lineHeight: 1.08
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  field:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
  host-heading:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-.03em"
  host-stat:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 750
    lineHeight: 1.15
  countdown:
    fontFamily: "Caprasimo, Georgia, serif"
    fontSize: "clamp(31px, 8.8vw, 47px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-1.5px"
rounded:
  hero: "38px"
  hero-tablet: "28px"
  hero-phone: "24px"
  card: "23px"
  control: "13px 13px 15px 5px"
  field: "10px 10px 11px 4px"
  filter: "8px 8px 10px 4px"
  hero-action: "28px"
  nav: "16px"
  circle: "50%"
spacing:
  card: "30px"
  guide: "23px"
  control-gap: "10px"
  planning-gap: "44px"
  field: "13px 14px"
  button: "12px 21px"
  hero-action: "8px 22px"
components:
  button-hero:
    backgroundColor: "{colors.gold}"
    textColor: "#173e2c"
    rounded: "{rounded.hero-action}"
    typography: "{typography.hero-action}"
    padding: "{spacing.hero-action}"
  button-hero-outline:
    backgroundColor: "transparent"
    textColor: "#fff4d7"
    rounded: "{rounded.hero-action}"
    typography: "{typography.hero-action}"
    padding: "{spacing.hero-action}"
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.action-cream}"
    rounded: "{rounded.control}"
    padding: "{spacing.button}"
  button-secondary:
    backgroundColor: "{colors.secondary-paper}"
    textColor: "{colors.forest}"
    rounded: "{rounded.control}"
    padding: "{spacing.button}"
  text-field:
    backgroundColor: "{colors.field-paper}"
    textColor: "#263f2e"
    typography: "{typography.field}"
    rounded: "{rounded.field}"
    padding: "{spacing.field}"
  paper-card:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.forest}"
    rounded: "{rounded.card}"
  host-filter:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.forest}"
    rounded: "8px"
    padding: "9px 15px"
  host-filter-selected:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.action-cream}"
    rounded: "8px"
    padding: "9px 15px"
  host-navigation:
    backgroundColor: "#e8ebd7"
    rounded: "12px"
    padding: "5px"
  header-rsvp:
    backgroundColor: "{colors.gold}"
    textColor: "#143d2b"
    rounded: "25px"
    padding: "10px 27px"
  compact-footer:
    backgroundColor: "{colors.forest}"
    textColor: "#fff2d1"
    rounded: "30px"
    padding: "0"
  countdown-tile:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.countdown-ochre}"
    rounded: "3px 5px 3px 5px"
    padding: "16px 3px 13px"
---

# Design System: Elio’s Paper-Cut Invitation

## Overview

**Creative North Star: "A Little Paper Safari"**

The invitation feels assembled by hand from sculpted, layered matte ivory and kraft paper. Forest-green scenery, rounded animal silhouettes, warm gold tabs and real family photography make it playful and affectionate. Depth comes from visible paper edges, shallow relief, soft contact shadows and fine grayscale paper grain.

Illustration leads the guest’s arrival and photo browsing; practical chapters use the same material language with clearer grouping, readable labels and familiar controls. Host tools use an Operate treatment: the established cream and forest palette with compact Figtree hierarchy, calm cards and familiar task controls. Preserve the complete invitation content and behavior when extending the system.

**Key Characteristics:**

- Sculpted paper layers with a coherent forest, cream, sage and gold palette.
- Authentic supplied baby photography inside scalloped paper frames.
- Rounded Caprasimo display type, compact Georgia hero copy and readable Figtree practical text.
- Complete, friendly animal silhouettes and a grounded twelve-species parade.
- Restrained arrival and interaction motion, with reduced-motion support.

This document captures the implemented local preview. Its sources are `styles/base.css`, `styles/controls.css`, `styles/journal.css`, `styles/footer.css`, `footer.mjs`, `styles/hero-motion.css`, `hero-motion.mjs`, `host.mjs`, `host-enhancements.js`, the last-loaded `styles/host.css`, `build.mjs` and inherited base rules in the built `index.html`. Frontmatter records actual CSS values; it does not add a new implementation token layer. The preview remains unpublished, uses separate browser-local storage and has no production-backend connection. The root production invitation remains outside this design scope.

## Colors

Warm paper neutrals carry the content; forest ink gives it structure, sage softens the foliage, and gold marks celebration and selected moments.

### Primary

- **Forest:** hero, countdown and footer grounds; practical primary actions; selected host tabs and filters; principal text on light paper.
- **Golden Paper:** the hero RSVP action, birthday emphasis, section tabs and active journal dot. Keep its paper edge and warm shadow.
- **Countdown Ochre:** countdown numerals on cream tiles. This deeper warm ink is intentional; do not substitute the brighter decorative gold.

### Secondary

- **Sage:** the established foliage and control palette. Lighter olive and sage variants already appear in art, guide icons and selected form surfaces.
- **Kraft:** exposed backing layers beneath cards and controls, giving cream surfaces a physical edge.

### Neutral

- **Cream:** the page ground, journal paper and practical card faces.
- **Muted Olive Ink:** supporting practical copy, helper text and host metadata.
- **Action Cream:** light labels on forest actions and selected host states.
- **Secondary Paper:** the soft olive-cream fill of secondary practical actions.
- **Field Paper:** editable fields and attendance controls.

**The Warm Ink Rule.** Keep readable text and numbers in forest or the implemented deeper warm inks. Gold is a decorative accent and action surface.

The sidecar’s generated tonal ramps are reference metadata, not additional CSS tokens or approved substitutions. Component-specific border, focus and shadow colors remain in the source CSS and sidecar snippets.

## Typography

**Display Font:** Caprasimo, with Georgia and serif fallbacks.  
**Body Font:** Figtree, with system-ui and sans-serif fallbacks.  
**Hero Supporting Font:** Georgia, with serif fallback.

The rounded display letterforms give the type the same full, friendly silhouette as the paper animals. Caprasimo uses its bundled static regular face (400); synthetic bold is disabled with `font-synthesis: none`. Georgia supplies the compact reference-style welcome and event details in the hero. Figtree keeps practical descriptions, labels, form inputs and host records easy to scan. Caprasimo and Figtree are bundled in the self-contained preview; the display asset is `assets/caprasimo.woff2`, with provenance in `assets/font-sources.json` and licenses in `assets/FONT-LICENSES.txt`.

### Hierarchy

- **Display:** the hero name uses the frontmatter display role. Below the tablet breakpoint it becomes `clamp(44px, 8vw, 60px)`; on small phones it becomes `clamp(39px, 11.3vw, 51px)`.
- **Headline:** practical chapter headings use the headline role; the journal uses its larger journal-title role.
- **Hero supporting text:** the short welcome uses the hero-support role. A muted gold divider separates it from the bold Georgia date line (18px / 1.2), “22 December 2026 · 3:00 PM”, above the Georgia venue line (17px / 1.2).
- **Footer title:** the two-line signoff uses the footer-title role with a maximum width (11ch). It becomes (36px) in the stacked layout and (32px) at 420px or below.
- **Body:** inherited body text uses the body role. Practical descriptions commonly use smaller text (14–15px) with relaxed line-height (1.7–1.8).
- **Fields:** inputs retain the field role, including the phone-friendly size (16px).
- **Labels:** short paper labels use Figtree, usually bold (700–800), with restrained uppercase tracking. Preserve sentence case for field labels and journal placeholder explanations. The above-heading journal and countdown tags are intentionally hidden, as are redundant host eyebrows; do not restore them during a type refresh.
- **Countdown:** use the countdown role with tabular numerals. At widths of 380px or less, digits settle at (31px).
- **Host operation:** dashboard headings, section headings and statistics use Figtree rather than the celebratory display face. The dashboard title uses the host-heading role, reducing to (30px) below 600px; statistic values use the host-stat role, reducing to (29px). Labels, helper text and controls stay compact and readable, with (16px) field text.

**The Type Roles Rule.** Use Caprasimo for celebration, guest chapter titles, hero actions and countdown numbers; Georgia for the compact hero welcome and event details; Figtree for practical reading and all host operation, including host headings and statistics.

## Layout

At desktop widths (960px and above), the hero is an inline-size query container. Portrait and name scale with `cqw` (17cqw and 6.1cqw). Supporting copy and actions retain readable minimum sizes: welcome (16–18px), date and actions (16–20px), venue (15–18px). The content determines the card height, with padding (40px 30px 80px) and a (24px) column gap. Reserve (2.6cqw) below the portrait for its extending ribbon, and keep the buttons clear of the foreground hills. Welcome copy uses line-height (1.4). Actions retain a 44px minimum height. The name has no legacy 340px maximum width.

The desktop shell is `min(1180px, calc(100% - 64px))`. The hero pairs copy and portrait with the diorama in a two-column grid (45fr / 55fr), subtracting the column gap before allocating space. Avoid a fixed card aspect ratio: the live welcome text can occupy multiple lines. The artwork is (1414 × 1113px), shown in an SVG viewBox (560 × 441) with matching scene aspect ratio. At 959px or below the hero becomes one column with the diorama first; the shell becomes `min(700px, calc(100% - 32px))`. At 480px or below, page gutters narrow to (12px) each; the hero diorama caps at (320px) and the portrait width is (132px). The middle layout uses a portrait width of (150px).

Keep content in distinct paper chapters with generous breathing room. The planning grid uses a row gap (44px). The field guide becomes two columns from (760px); at small widths, cards and forms stack. Practical cards use comfortable padding: RSVP cards (30px), guide rows (23px), with targeted reductions below (599px). Host content caps its width at (1080px). Host editor padding is (25px), reducing to (20px 16px) below 600px; its fields and photo cards form responsive grids.

The journal opens directly onto the cream page: its former board, border, backing shadow and decorative pseudo-elements are removed. It preserves its existing cylinder geometry. Month cards remain (176px × 238px), with a photo/frame region (176px × 196px); these dimensions are tied to the ring math. The stage deliberately clips neighboring cards and uses a soft edge mask. Do not “fix” that intentional preview by changing card widths independently of the interaction.

The footer is a grounded closing scene in a (40% / 60%) desktop grid: signoff and family credit on the left, followed by a gold “Share details” button, with the existing native animal artwork anchored on the right. Continuous olive paper hills connect both columns along the bottom. A separate cream utility row carries the slogan on the left and Host view on the right. The panoramic (800 × 210) scene is used above 1050px; the compact (460 × 226) composition keeps animals larger at 1050px or below, including the medium side-by-side layout. At 700px or below, centered copy sits above that compact scene. The old heart seal and detached grass strip are absent.

The countdown uses four equal columns in a container capped at (520px). It stays in one row on phones; gaps shrink from (15px) on wider screens to (10px), then (7px) at 380px or below.

The supplied corrective screenshot is the current hero visual authority. The matching hero implementation captures live in `review/revision2/`, including `hero-actual.jpg`, `hero-mobile.jpg` and `hero-320.jpg`. The current footer captures are `review/footer-refined-desktop.jpg` and `review/footer-refined-mobile.jpg`; earlier footer captures show superseded layouts.

## Elevation & Depth

Depth is structural. Hard, closely stacked shadows read as cut-paper thickness; a final diffuse shadow grounds the assembled piece. Artwork has sculpted edges and matte surfaces. Avoid replacing this with glossy gradients or floating glass.

The generated grayscale texture (`assets/paper-texture.webp`) is embedded as `--paper-grain`, repeats at a background size (600px) and uses soft-light blending. The body carries it directly as a blended background; the old body pseudo-element is removed. The isolated hero overlay uses opacity (.65). The countdown ground, guide rows and compact footer also carry the grain. The former journal backing sheet is absent. Outer practical card faces and host editor cards retain their existing more-specific surface treatments. Texture source and prompt metadata remain in `assets/`; do not bake the grain into Elio’s photograph.

### Shadow Vocabulary

- **Hero surface:** `inset 0 1px 1px #ffffff22`; the former thick bottom backing and diffuse external hero shadow are removed.
- **Practical paper stack:** `0 3px 0 #e8dcc0, 0 7px 0 #cbb489, 0 15px 30px #243d2611`.
- **Primary control edge:** `0 3px 0 #123723, 0 6px 9px #243d2610`.
- **Scalloped journal frame:** `drop-shadow(1px 3px 0 #bfa36d) drop-shadow(2px 6px 5px #3e2e172b)`.

**The Contact Rule.** Every lifted paper piece needs a nearby backing edge or contact shadow; decorative layers must still feel assembled on the same ground.

## Shapes

Use softly cut silhouettes rather than a single universal radius. The hero is broadly rounded; practical cards are gently curved; controls use asymmetrical corners with a smaller lower-left cut. Small paper labels can stay almost square or slightly rotated. Round controls remain appropriate for journal arrows and portrait zoom.

The portrait uses a native SVG frame: twenty shallow cream scallops, a thin warm outline and an inset gold ring around the authentic circular photo. The frame uses a (240 × 240) viewBox; its outer contour follows radius `116 + 4 × cos(20 × angle)`, with an inner cutout radius (101) and a gold ring at radius (103.5), stroke width (7). Keep the paired leaves and ribbon aligned with the enlarged photo. Month frames retain their paper-art scalloped family; blank months remain honest placeholders.

The ribbon art and its “ONE” label share a (362 × 140) SVG viewBox. The label anchors at (181, 48), with centered text, a central baseline and Caprasimo regular at (47 SVG units). The level ribbon scales as one graphic. The portrait, name, supporting copy, date and action row share one centerline; the action row uses full available width, a (402px) cap and automatic inline margins.

The hero’s bottom edge uses native curved olive hills and a cream wave, with leaves integrated into the edge. Do not restore the old straight striped divider. The edge SVG uses a (1200 × 110) viewBox and stretches across the hero, at height (68px), or (65px) on phones.

## Components

### Buttons

Tactile paper actions with clear hierarchy.

- **Hero primary:** golden paper, dark forest text, rounded shape and a shallow ochre edge. Caprasimo regular (18px / 400), minimum height (44px), padding (8px 22px). The labels are “RSVP” and “Event details”; both remain on one row on phones, with padding (10px) and responsive type `clamp(14px, 4.1vw, 16px)`.
- **Hero outline:** transparent forest-ground treatment, warm cream border and light type. Preserve the separate outline variant.
- **Practical primary / secondary:** forest and soft olive-cream variants with asymmetric corners. Minimum height (48px); RSVP submission uses (54px).
- **States:** practical buttons rise (2px) on hover and depress (2px) on activation, losing their shadow when pressed. Their transition uses (160ms ease).
- **Focus:** practical buttons use a warm, visible outline (3px) offset (4px). Journal controls use their own outline offset (5px).
- **Disabled:** keep the native disabled state and cursor; prevent lift. Reduced-motion rules remove practical button transitions.

### Inputs / Fields

Inset cream paper with persistent readable labels.

- Minimum height (52px), padding from the field spacing token and an asymmetrical field radius.
- Borders use muted olive; placeholder text remains readable at full opacity.
- Textareas have minimum height (112px).
- Invalid fields have a warm brown border (2px) and an explicit error message. Do not rely on color alone.
- Attendance choices and steppers share field materials. A selected attendance choice adds forest edging and a sage paper fill. Steppers retain clear disabled states.
- Focus remains visible on fields and their associated attendance controls.

### Navigation and Chips

The header shows only Elio’s brand mark and title. RSVP remains in the hero and floating navigation. Below the hero, a cream navigation capsule provides Journal, The day, Map and RSVP links. It stays sticky (12px from the top) while scrolling, with a shared forest-green active-section highlight. Preserve its four-column phone layout, readable labels, minimum (44px) link height and keyboard focus. Use an opaque cream surface without backdrop blur. The separate mobile RSVP dock hides when the RSVP section is reached. The footer places the gold Share details action beneath the family credit, with Host view in its separate cream utility row.

Host navigation uses a quiet sage tray with forest selected tabs. Host filters use simple (8px) corners, counted labels and forest selected states. Preserve `aria-pressed` and the combined search/filter behavior. Controls remain comfortably touchable: host buttons, section controls and filters have a minimum height (44px); main host tabs have (46px). Guest controls retain their existing dimensions and paper shapes.

### Cards / Containers

Guest practical cards and dialogs share cream faces, muted cut edges and the practical paper-stack shadow. The field guide holds lighter guide sheets inside a forest backing. The RSVP tab crosses its upper edge; do not crop it. Host cards use cream faces, restrained borders and (12px) corners, with the decorative backing shadows removed to keep records and settings easy to scan.

FAQ items are individual asymmetrical sheets with a visible summary and calm expanded answer. Dialog backdrops use deep translucent forest and a blur (5px); dialogs remain scrollable within `calc(100dvh - 40px)`.

### Host Dashboard and Settings

`host.mjs` refines the existing host markup and runtime without changing reply IDs, storage format or the disconnected production backend. `host-enhancements.js` runs after DOMContentLoaded to add section navigation, disclosure behavior and save-state feedback. `styles/host.css` loads last and scopes the operational treatment to host tools. The local preview uses the demo passcode `safari-demo`; production verifies the server-configured password. Its Show/Hide control resets to masked when the sign-in dialog is opened.

The dashboard uses clear **Guest replies** and **Invitation settings** labels. Compact totals distinguish **Guests attending**, **Attending replies** and **Declined replies**, with the adult/child breakdown in the supporting summary. A short local-preview notice states that replies and invitation edits stay in this browser and do not sync.

Keep the reply toolbar above the list: **Add reply** opens the existing manual form and focuses Guest name; **Export guest list** is a native disclosure for copy and CSV actions. **Find a guest** searches names, messages and food needs together with the counted All / Coming / Can't come filters. A result line reports the matching and total reply counts. **Food needs** is a separate native disclosure with its own count. Export menus expand in normal flow rather than floating over records or controls.

Invitation settings has three persistent sections: **Details**, **Questions** and **Photos**. Switching sections hides existing fieldsets without rebuilding their inputs or losing draft values. Details shows party basics first; **Invitation wording** reveals the welcome, dress code, gifts and journal text. Photos retains all thirteen slots: the portrait and twelve months. Trail schedule controls and the schedule heading input remain removed, while hidden legacy activity data is preserved through save and export without constraining party hours.

The save bar sits near the form top and stays sticky at (12px), or (8px) below 600px. It groups a concise state and the live status message with **Save changes** and **Save & preview**. The latter saves locally before opening the invitation; the preview's return action restores settings. **More options** expands the secondary **Download invitation** and **Discard unsaved changes** actions inline. Download saves and exports the current self-contained invitation; discard restores the last applied version and reports **Changes discarded** without claiming a new device save. Storage errors remain explicit. Saving an invalid field reveals its section and any enclosing wording disclosure, marks the field invalid and focuses it; hidden sections must never prevent recovery.

Host fields retain (16px) text and a (46px) minimum height. Toolbars and save actions wrap on phones; the three-section control fits in one row, and long photo settings remain reachable without horizontal scrolling. Keyboard focus and reduced-motion behavior remain active. Host QA uses `review/host-qa.html`, generated with separate `elio-paper-host-ui-qa-` storage keys; fixture replies and edits must not enter the preview's `elio-paper-preview-` keys or production storage.

### Compact Footer

Use `footer.mjs` and `styles/footer.css` as the footer authority. Desktop copy has padding (34px 0 37px 40px); the native animal scene aligns to the bottom of the adjacent column, with continuous olive hills spanning the forest ground. The gold Share details button sits below the family credit, uses Figtree (14px), and retains a minimum height (44px). The cream utility row below the scene has a minimum height (56px), with the slogan on the left and the quiet underlined Host view action on the right. Preserve the original `#share-invitation`, `#family-credit` and `#open-host` IDs and behavior.

At 1050px or below, the scene switches from the panoramic (800 × 210) layout to a compact native (460 × 226) composition. Copy and art remain side by side above 700px. At 700px or below, copy centers with padding (30px 24px 16px), followed by the compact scene in a container capped at (560px). This composition reuses the authentic existing artwork and shows every animal complete at useful sizes on medium screens and phones. The utility row remains separate and allows its slogan to wrap on phones. Share uses a cream keyboard-focus outline and Host view a gold outline (2px), both offset (4px); reduced motion removes the Share button's lift. Do not restore the detached grass or heart.

### Portrait, Journal and Paper Animals

Use Elio’s supplied real photograph unchanged as photography, not an illustrated or generated replacement. The hero portrait has a softly arched cream paper frame, a fine gold inset edge and two small olive branches of different sizes at its lower corners. Remove the former scalloped badge and “ONE” ribbon. Keep the same arch crop for the image and its zoom control, with a visible gold keyboard-focus ring; its former small zoom icon stays hidden. The share-preview image follows this portrait treatment. Empty monthly frames must not acquire invented child photographs.

Preserve the matching twelve animal species and complete silhouettes. The parade uses43 lower-leg parts traced for the paper atlas in `assets/paper-walk-rig.json`. Moving lower legs are drawn beneath one continuous fixed torso and upper-joint layer; each cut is confined to its own lower limb. Keep the original walking cadence and interactions. Keep feet on the visual ground and preserve anatomy, relative scale and scene contact.

The hero uses the original diorama pixels as complete moving paper cutouts. `scripts/render-artwork.mjs` rasterizes the authored silhouettes into cropped transparent WebPs; [`hero-motion.mjs`](hero-motion.mjs) places these at their original coordinates, and [`styles/hero-motion.css`](styles/hero-motion.css) supplies their motion. Masks remain in the authoring sources, while the built page animates the rendered cutouts. Each animal remains one connected layer, including its hat, limbs and tail where present. Preserve the whole silhouettes and their natural gaps; keep the separate lower-leg rig confined to the walking parade.

Elephant, lion and zebra have small breathing idles; the giraffe sways and the hanging monkey swings. Their staggered cycles range from (6.8s) to (9.4s), with grounded pivots. Two clouds drift on (23s) and (29s) loops, rays sway gently around the still sun disc, and three restrained glints travel along the existing river. Tap or keyboard activation adds a brief (620ms) whole-character greeting; the monkey swings and the giraffe nods. Keep this motion small enough to retain the sculpted paper contact and calm reading experience.

The original frame and remaining scenery stay still. The hidden inpainted backing is [`assets/hero-motion-background.png`](assets/hero-motion-background.png), bundled as [`assets/hero-motion-background.webp`](assets/hero-motion-background.webp). It fills only the tiny vacated areas beneath moving cutouts. Its exact provenance is the `prompts["hero-motion-background"]` entry in [`assets/prompts.json`](assets/prompts.json), an edit of the original diorama that removes the five animals, two clouds and sun rays while retaining the paper scenery and numbered sun disc.

The monkey has a localized backing in [`assets/hero-monkey-background.png`](assets/hero-monkey-background.png), bundled as [`assets/hero-monkey-background.webp`](assets/hero-monkey-background.webp). This original-scene edit removes only the monkey and is clipped beneath its vacancy, preserving the dark green sky behind the curled tail and the original green/olive hill boundary. Its exact prompt is `prompts["hero-monkey-background"]` in [`assets/prompts.json`](assets/prompts.json). The main clean backing continues to serve the other moving pieces.

Hero motion shares the visibility controller: it pauses offscreen and while the browser tab is hidden. Reduced-motion preferences disable the animal idles, greeting animations and ambient motion while preserving animal controls and announcements. The invitation opens directly with its existing restrained `paper-arrive` hero entrance: (900ms), `cubic-bezier(.16, 1, .3, 1)`, from a vertical offset (7px) and scale (.99), only when reduced motion is not requested. The gentle diorama and animal animations continue after entry. All ordinary content remains visible: the soft-reveal override fixes opacity (1), transform (none) and transition (none). Retain the existing parade and journal reduced-motion behavior.

## Do's and Don'ts

### Performance constraints

The production document externalizes media to content-hashed `/media/` URLs with immutable caching. Music uses `preload="none"` and starts after a guest interaction. The self-contained preview and on-demand offline download retain embedded media. The journal follows the display refresh rate while moving, skips unchanged frames and avoids redundant style and accessibility writes. Swipes project release velocity into a nearby month and settle with a critically damped spring; rapid arrow and keyboard navigation advance from the current target. Outer cards fade between 55° and 85° before becoming hidden. Keep compositor hints limited to the visible carousel and remove them for reduced motion. Preserve offscreen, hidden-tab and reduced-motion pauses. Avoid runtime atlas masks and large animated drop shadows; the rendered art already supplies its paper shading.

### Do:

- **Do** preserve the chosen forest, cream, sage and gold paper world.
- **Do** keep Elio’s supplied photograph authentic and empty months as placeholders.
- **Do** retain all twelve species, the grounded43-part paper-specific lower-leg rig and existing animal interactions.
- **Do** preserve keyboard access, visible focus, readable controls and reduced-motion support.
- **Do** keep RSVP, journal, maps, calendar, FAQ and host editing behavior working.
- **Do** keep this preview unpublished with its separate localStorage keys and disconnected production backend.

### Don't:

- **Don't** introduce pink into the chosen visual direction.
- **Don't** generate replacement baby photos or fabricate missing monthly photographs.
- **Don't** replace matte layered paper with glossy, glassy or generic flat illustration.
- **Don't** brighten countdown digits back to decorative gold.
- **Don't** alter journal card geometry independently of its cylinder math.
- **Don't** deploy the preview or modify the root production invitation as part of visual maintenance.

