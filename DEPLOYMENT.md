# Vercel + Neon invitation

The primary invitation is deployed to `https://elios-birthday.vercel.app` in Vercel project `elios-birthday` under `arc-reactor1`. Vercel serves `dist/` and routes `/api/*` to `api/index.js`, which uses the same Neon database and private host credentials as the Cloudflare deployment below. Existing invitation edits and RSVPs are preserved. Browser cookies are specific to each hostname, so hosts must sign in again on the Vercel address; guests who replied on the old address should use that address to update their original reply.

The production build now assembles the approved paper-cut design from `paper-cut-preview/build.mjs`, then enables the shared backend and restores production storage keys in `scripts/build.mjs`. The local preview stays isolated. Review fixtures and original PNG references are excluded from deployment. `npm test` runs the build first, then checks the API and production bundle. Deployment `dpl_8pDviCuDZikQ7eVzYQdfHjrzU2bq` published the design, corrected lion, footer and improved host interface; the preceding deployment was `dpl_EZD1jvR4KZALzNhFj9JCpQBDj4a6`.

Production media lives in `dist/media/` under content-hashed filenames with one-year immutable caching. The entry HTML is about 539 KB instead of 9.8 MB. The 3.36 MB soundtrack loads on interaction, not initial page load. `dist/offline-template.html` retains embedded media and is fetched only for the host's Download invitation action. Run `npm run assets:render` after changing artwork or rig inputs; it uses Sharp to render the approved masks into registered transparent cutouts. Builds validate the source hashes before using these assets. `scripts/performance-qa-server.mjs` is a local-only, in-memory API fixture; it never connects to the live database.

`vercel.json` configures the build, API routing, Singapore function region, and security headers. `.vercelignore` excludes private settings, local state, tests, and original media from uploads. Production `DATABASE_URL`, `HOST_PASSWORD`, and `SESSION_SECRET` are stored as sensitive Vercel environment variables. Never put their values into commands, commits, or chat.

To publish updates from this linked checkout:

```powershell
npm test
npx vercel deploy --prod --yes
```

Vercel Functions limit each request or response to 4.5 MB. The existing invitation configuration is about 202 KB; keep the combined configuration and embedded photos below that limit. Larger photo collections need separate object storage. The static invitation HTML, including its embedded music, is served as a static file and does not pass through a Function.

Verify `https://elios-birthday.vercel.app/api/health` returns `{ "ok": true }`, then check RSVP submission, host sign-in, and invitation saving. Local development can continue using the Cloudflare emulator below against the same Neon database.

## Previous Cloudflare deployment

The Cloudflare Pages site serves the invitation and `/api/*` Pages Functions. Neon PostgreSQL stores RSVPs, invitation details, the Trail schedule, and uploaded photos. Database credentials stay in server secrets. The standalone `index.html` still runs as a local demo.

## Projects

- Cloudflare Pages: `elio-invitation-test` (production branch `main`)
- Live testing URL: https://elio-invitation-test.pages.dev
- Neon: `elio-invitation-test`, ID `ancient-dew-85630991`, AWS Singapore
- All testing pages have `noindex` metadata and headers.

## Local testing

```powershell
npm ci
npm run build
npm run db:setup
npm run dev
```

Copy `.dev.vars.example` to `.dev.vars` for another developer’s setup. This machine already has a private `.dev.vars` with the Neon connection, the configured `HOST_PASSWORD`, and a random signing secret. Never commit, upload, paste into chat, or share this file. `HOST-ACCESS.txt` has the live URL and current host password for local use. The testing website uses the host password configured in Cloudflare’s server secrets. The host log refreshes every 30 seconds while visible.

`db:setup` creates tables and seeds the current invitation only if none exists. It preserves existing replies and host edits. Local development connects to the testing Neon database, so local RSVP submissions are real test records.

## Publish changes

```powershell
npm test
npx wrangler pages project create elio-invitation-test --production-branch main
node scripts/upload-secrets.mjs
npm run deploy -- --branch main
```

Create the Pages project only once. Later deployments need `npm run deploy -- --branch main`; secrets remain configured. Use CLI direct upload so Pages Functions are bundled. Drag-and-drop uploads through the dashboard do not deploy this backend. Only `dist` is uploaded, together with the bundled Functions; source files, original media folder, and private settings are excluded.

## Verify deployment

1. `/api/health` returns `{ "ok": true }`.
2. Send an RSVP in one browser; open the host view in another using the private password. The guest appears in the log.
3. Change the RSVP in the first browser. The same record updates. A different browser cannot see that guest’s private reply.
4. Save a party detail or photo edit in the host view. Refresh the invitation in another browser; the edit appears. Trail schedule editing has been removed.
5. Sign out of the host view. Guest-list API requests must return HTTP 401.

The guest cookie allows updates in the same browser for one year. Host sessions last eight hours; signing out removes the cookie. Rotating `HOST_PASSWORD` invalidates earlier host sessions. Failed host sign-ins are rate limited. Cookies are HttpOnly, SameSite Strict, and Secure on HTTPS. Cross-origin writes are rejected. Guest records are accessible only to signed-in hosts and their own guest browser.

Offline HTML downloads preserve photos and music, and intentionally return to the local demo storage model and demo passcode `safari-demo`. They do not contain the database URL, private host password, or guest records. Use the online Pages URL to collect shared RSVPs.

Uploaded photos are stored as validated JPEG/PNG/WebP data in Neon for this small testing invitation. Each image is limited to 2 MB; twelve journal photos plus the hero photo are supported. Large, high-traffic production use would benefit from object storage.
