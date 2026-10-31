# Prompt: Build "Elio's First Safari" birthday invitation website

> Paste this whole file into any AI model. It is written as one self-contained prompt, so each model gets the same instructions and the outputs can be compared fairly.

---

## 1. Your task

Build a **mobile-first, interactive birthday invitation website** for **Elio Rayne's 1st birthday**, with a **safari theme**.

Deliver **one self-contained HTML file** (HTML, CSS and JavaScript together) that I can open in a phone browser. Do not ask me questions. Where details are missing, use the placeholder content in section 5 and make it easy to change.

The site has two parts:

1. **The invitation** that guests see: poster, countdown, schedule, location, RSVP, photo ring.
2. **A separate host view** where the hosts can monitor who accepted the invitation.

## 2. Hard requirements

- One `.html` file. No build step, no frameworks required. External libraries are allowed only if loaded from a public CDN, and the page should still work without them.
- **No external images.** Draw all artwork with inline SVG and CSS. Photos are placeholders (section 4.9).
- Fonts may come from Google Fonts with sensible fallbacks.
- **Mobile first.** It must look great at 360 px wide, work from 320 px up to desktop, and **never scroll horizontally**.
- Honour `prefers-reduced-motion`: switch off all non-essential animation.
- Keyboard accessible. Visible focus states. Buttons at least 44 px tall. Text contrast at least 4.5:1.
- Never put guest-typed text into the page with `innerHTML` (use `textContent` or equivalent).
- Use real copy. No lorem ipsum.

## 3. Design direction

**Mood:** golden-hour savanna. Warm, playful, a little handmade. A first birthday for a baby, so friendly and soft, not corporate.

**Layout idea:** a single centred column, max width 520 px, with a 16 px side gutter. The top is a rounded **poster card**: an illustrated scene on top and a deep-green ground underneath that holds the headline. Sections below sit on a sand background with a faint giraffe-spot pattern.

**Palette (use as CSS custom properties):**

| Token | Hex | Use |
| --- | --- | --- |
| `--ink` | `#26301f` | Main text |
| `--ink-soft` | `#55603d` | Secondary text |
| `--sand` | `#f5e1a0` | Page background |
| `--card` | `#fff8e1` | Cards |
| `--field` | `#fffdf3` | Form fields |
| `--line` | `#dcc17a` | Borders |
| `--acacia` | `#1e4b34` | Deep green: poster ground, tiles |
| `--acacia-2` | `#2a5e43` | Lighter green panels |
| `--leaf` | `#2d6a45` | "Yes" state, leaves |
| `--sun` | `#ffc233` | Sun, highlights on dark |
| `--sun-deep` | `#f39a1e` | Primary buttons |
| `--giraffe` | `#e8a23a` | Giraffe body |
| `--spot` | `#8b4a1c` | Brown accents, labels |
| `--teal` | `#2a9d96` | Focus ring, small accents |
| `--clay` | `#b4532a` | "No" state, errors |
| `--sky-top` / `--sky-bot` | `#ff9f55` / `#ffe59a` | Sky gradient |
| `--hill-far` / `--hill-mid` | `#e3a04c` / `#8da64f` | Hills |
| `--elephant` | `#93a19b` | Elephant |

**Type:** `Bagel Fat One` for headings, names and big numbers. `Figtree` for body text. `Saira Stencil One` for small uppercase labels (letter-spaced), like markings on an expedition crate.

**Naming and voice:** use safari vocabulary for section labels: "Roll call" (countdown), "Field guide" (details), "Trail schedule", "Base camp" (location), "Join the expedition" (RSVP), "Field journal" (photos), "Sighting log" (host view), "Expedition permit No. 01" (poster tag).

**Buttons:** chunky and toy-like. Pill shape, orange fill, a solid darker shadow underneath that "presses in" when tapped.

**Single look.** One theme is fine. No dark mode needed.

## 4. Page content and behaviour

### 4.1 Poster (top of the page)
- Inline SVG scene, about 400 × 330: gradient sky, a large sun with a big **"1"** inside it and a slowly turning dotted ring around it, soft clouds, a string of **bunting flags** across the top, layered hills, two acacia trees, a **baby elephant wearing a party hat**, and a **giraffe**.
- Below the scene, on deep green: tag "Expedition permit · No. 01", the name **Elio Rayne**, the line **"is turning ONE"**, a short welcome line, a box with the date and venue, and two buttons: **RSVP now** and **See the map** (both smooth-scroll to their sections).
- A small link: **"Tap the animals to say hi"**.

### 4.2 Animals and motion
Tapping an animal makes it react, with a small confetti burst.

| Animal | Idle animation | On tap |
| --- | --- | --- |
| Baby elephant | none | Hops, lifts its trunk, plays a short **trumpet** sound |
| Giraffe | Head sways gently | Nods |
| Monkey hanging from a tree branch | Swings slowly | Swings wildly, short **chirp** sound |
| Zebra on a far hill | "Breathes" slightly | Hops |
| Lion cub peeking from behind a hill | Rises and falls, blinks | Pops up and plays a short **roar** sound |
| Tortoise along the bottom | Crawls slowly across | none |
| Birds (3) and butterflies (2) | Birds fly across the sky, butterflies flutter | none |

Sounds must be made in the browser (Web Audio), not downloaded, and may play **only after a tap**. Keep them quiet and short. The "Tap the animals to say hi" link triggers all of them one after another.

**Page-wide critters:** two butterflies and two birds drift across the **whole screen** as the guest scrolls. They sit in a fixed layer, never block taps, and are hidden under reduced motion.

**Walking parade:** a full-width band under the countdown with silhouettes of an elephant, giraffes, zebras, a lion, a hippo and a tortoise walking across in an endless loop on a strip of green ground, with a soft fade at the left and right edges.

### 4.3 "Meet the explorer"
A tilted photo frame with a cute **illustrated baby** in a safari hat (SVG), captioned "Elio · Age 1", next to a short intro. If a real photo is supplied in a config value, it replaces the illustration.

### 4.4 Countdown ("Roll call")
- Four tiles: **Days, Hours, Min, Sec**, updating every second, using tabular digits.
- Target time is fixed to **Asia/Manila (UTC+8)** so every guest sees the same moment.
- Before the party: show the tiles and a line such as "Until we set out on Sat, Nov 14".
- During the party: replace tiles with "The safari is on! Come find us at base camp."
- After the party: "Thank you for celebrating Elio's first birthday."
- The seconds tile gives a tiny pulse each tick.

### 4.5 Field guide (details)
A card listing **When** (full date, time range, an **Add to Google Calendar** link built from the event data), **Where** (venue and address), **Pack** (dress note) and **Gifts**.

### 4.6 Trail schedule
A timeline of the day (times and titles in section 5). On the day of the party, the item happening right now is marked "· now".

### 4.7 Base camp (location)
- A **hand-drawn SVG trail map**: land, a river, small trees, a dotted trail leading to a red pin labelled BASE CAMP, a compass.
- Venue name and address under the map.
- **Open in Maps** (opens a Google Maps search for the address in a new tab) and **Copy address** (clipboard, with a fallback if clipboard access is refused).
- Do not embed a live map.

### 4.8 RSVP ("Join the expedition")
Form fields:
- **Name** (required, max 60 characters)
- **Can you make it?** Two big options: "Count us in" (default) and "Can't make it"
- **Adults** and **Kids** steppers with − and + buttons (adults 1 to 8, kids 0 to 8). Hidden if "Can't make it".
- **Food allergies or needs** (optional, max 140)
- **A message for Elio** (optional, max 280)
- A line above the form: "Please reply by Nov 4 so we can plan the food." After that date it changes to a softer message.

Behaviour:
- Validate inline: a missing name shows a clear error and focuses the field.
- On success show a confirmation card with a "stamp" (**ADMITTED** for yes, **NOTED** for no), a friendly sentence, and **Change my reply**. Fire confetti on a "yes".
- Store the reply using the storage layer in section 6.
- If saving fails, show a fallback: a ready-to-copy text message ("RSVP for Elio's 1st birthday safari / Name: … / Coming: 2 adults and 1 kid …") with a **Copy message** button.

### 4.9 Field journal: "12 months of Elio" (3D photo ring)
- **Not a normal scrolling row. No scrollbar anywhere.**
- Twelve cards arranged as a **3D ring (cylinder) using CSS 3D transforms**, like a rotating carousel. Cards face outward, the front card is largest, and cards at the back fade.
- The ring **turns slowly by itself, continuously**, so it never has a start or end.
- **Drag/swipe** to spin it, with inertia, then it settles on the nearest month. Vertical page scrolling must still work when the finger moves up or down. Auto-turn resumes a few seconds after the guest stops touching it.
- **Tap a card** to bring it to the front. Also provide **previous/next buttons**, **12 dots**, and **left/right arrow keys**.
- A readout under the ring shows the current month ("Month 4", "4 of 12"). Month 12 reads "One year".
- **No container box.** Run it edge to edge across the screen with softly faded left and right sides. Cards are large (about 176 px wide). Cards sit on a ring of radius about 350 px.
- Each card holds a **numbered placeholder frame** (dashed border, big month number). The last card is highlighted dark green with a "1!". A config array lets real photos replace the placeholders later.
- Pause the animation loop when the ring is off screen or the tab is hidden.

### 4.10 Footer
A trail of **paw prints** that appear one after another, a strip of grass with a pair of eyes that blink, a short line of text, and a small **Host view** link.

### 4.11 Host view ("Sighting log")
Opened from the footer link. It has a "back to the invitation" link.

- **Access:** protect it with a simple passcode prompt built into the page (store the passcode in a config value, default `safari-demo`). State plainly in a code comment that this is only a light gate, not real security.
- Three large stat tiles: **Guests coming** (total people), **Said yes** (number of replies), **Can't come**.
- A line such as "5 adults and 2 kids across 4 replies."
- A **Food notes** list for guests who are coming and gave food needs.
- Filter chips: **All / Coming / Can't come**.
- A list of replies, newest first. Each shows name, a "Coming" or "Can't come" pill (text, not colour alone), party size, food needs, the note in quotes, and the time sent.
- **Remove** on each reply with a two-tap confirm ("Tap again to remove"). Do not use `alert` or `confirm`.
- **Add a reply you got by message** (name, reply, adults, kids, food needs, note) for people who texted instead.
- **Copy guest list** and **Save as CSV** buttons. Protect against spreadsheet formula injection in CSV cells (prefix cells starting with `=`, `+`, `-` or `@`).
- An empty state that explains what will appear and how to add a first entry.

## 5. Placeholder content (use exactly, keep it easy to edit)

Put this in one clearly marked config object at the top of the script.

```
child:    "Elio Rayne"
start:    2026-11-14 15:00 (UTC+8)
end:      2026-11-14 18:00 (UTC+8)
venue:    "Rayne Family Garden"
address:  "Street address, Barangay, City, Province"
dress:    "Khaki, greens and animal prints. Come dressed as an explorer."
gifts:    "Your company is the best gift. Please don't feel you need to bring anything."
rsvpBy:   2026-11-04 23:59 (UTC+8)
schedule:
  3:00 PM  Arrive at base camp         Welcome drinks and a photo corner
  3:30 PM  Games for little explorers  Safari hunt and bubbles
  4:30 PM  Merienda                    Food is served
  5:00 PM  Cake for Elio               A song, candles and his first taste
  5:30 PM  Photos and loot bags        Say goodbye to the animals
  6:00 PM  Safari ends                 Safe travels home
photos:   hero photo (empty) + 12 monthly photos (all empty) + 12 optional captions
```

Welcome line for the poster: "Come celebrate his first trip around the sun with a little safari. Explorers of every size are welcome."

## 6. RSVP storage layer

Put all saving and loading behind a small, clearly separated set of functions so it can be swapped for a real backend:

```
saveReply(reply)      // create or update the current guest's reply
loadMyReply()         // return this guest's saved reply, or null
listReplies()         // host view: all replies
removeReply(id)
addManualReply(reply)
```

For this single-file demo, implement them with **`localStorage`** (wrapped in try/catch, with an in-memory fallback if storage is blocked). Add a code comment that localStorage only stores replies **on one device**, so a real launch needs a shared backend (for example Firebase, Supabase or a Google Sheet), and show where to plug it in.

Each reply is a record:

```
{ id, name, going (boolean), adults, kids, diet, note, manual (boolean), updatedAt (ISO string) }
```

## 7. Quality bar

- Looks polished at 360 px wide. Real hierarchy in type and spacing. Not a generic template.
- Smooth animation. No layout shift. No console errors.
- Code is tidy and commented where it matters (config block, storage layer, the 3D ring maths).
- Clean DOM building for anything the user typed.

## 8. What to return

1. The complete HTML file in one code block.
2. Then, in **five lines or fewer**: what you built, anything you simplified or could not do, and how to change the config.

---

# Scoring sheet (for comparing models)

Give each category 1 to 5. Test on a phone, or in a browser's phone view at 360 px wide.

| # | Category | What to check | Score |
| --- | --- | --- | --- |
| 1 | Follows the brief | All sections in section 4 present and working | |
| 2 | Visual design | Safari mood, palette, type, hierarchy, not generic | |
| 3 | Illustration quality | Scene and animals look good and read as the right animals | |
| 4 | Animal interactions | Tap reactions, sounds, idle motion, parade, roaming critters | |
| 5 | 3D photo ring | True 3D ring, auto-turn, drag with inertia, tap, arrows, dots, no scrollbar, edge to edge | |
| 6 | Countdown and schedule | Correct to Manila time, all three states, "now" marker | |
| 7 | RSVP flow | Validation, steppers, confirmation, confetti, copy-message fallback | |
| 8 | Host view | Passcode, totals, filters, remove, manual add, CSV and copy | |
| 9 | Mobile quality | No sideways scroll at 320 and 360 px, 44 px tap targets, readable | |
| 10 | Accessibility and motion | Focus states, contrast, reduced-motion respected | |
| 11 | Code quality | Config block, storage layer, safe DOM, no console errors | |
| 12 | Honesty | States its limits (for example localStorage is one device only) | |

**Total: ____ / 60**

Quick tests worth running on every output:
1. Turn on "reduce motion" in the OS and reload. Is the page still complete and calm?
2. Submit an RSVP with no name. Is the error clear?
3. Submit a yes reply, reload, open the host view. Does it show up?
4. Try dragging the ring sideways, then scroll the page up and down with a finger on the ring.
5. Rotate the phone, or widen to desktop. Does anything overflow?
6. Add a reply whose name is `<b>test</b>`. Is it shown as plain text?
