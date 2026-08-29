# Evergreen Creativity Mindsets

A static, single-page reference site for Evergreen School's 2026–27 Creativity
Program. It gives teachers a fast, browsable way to explore the five
creativity mindsets — **Imaginative, Inquisitive, Persistent, Collaborative,**
and **Disciplined** — and the classroom practices associated with each one.

No build step, server, database, login, or paid API is required. The whole
site is HTML, CSS, and vanilla JavaScript, and it is designed to be hosted
directly on GitHub Pages.

## What it does

- A hero section introduces the five-mindset framework.
- Five mindset cards are generated from a single data file. Clicking a card
  expands an in-page detail panel (no page navigation) with:
  - a one-line description, short intro paragraph, and pull quote
  - an accordion: **What It Looks Like**, **Practices to Try**, **Teacher
    Moves**
- Only one mindset is expanded at a time, and only one card shows as
  "selected" at a time.
- Accordions are keyboard accessible, animate open/closed, and use
  `aria-expanded` / `aria-controls`.
- The header compacts as you scroll and offers quick links to Home, Explore
  the Mindsets, and About the Project.
- Fully responsive: 5-column grid on desktop, 2–3 columns on tablet, single
  column on mobile.

## File structure

```
/
├── index.html          Page structure (hero, card grid, detail panel, about, footer)
├── css/
│   └── styles.css       All visual styling — colors, type, layout, animation
├── js/
│   └── app.js            Renders cards + accordions from data, handles all interaction
├── data/
│   └── mindsets.js        All mindset content, as a single MINDSETS array
├── assets/                Reserved for future images/icons
└── README.md
```

There is intentionally **no per-mindset HTML** in `index.html`. Everything
under the hero is built at runtime from `data/mindsets.js`, so adding a
mindset, reordering practices, or rewriting copy never requires touching the
markup.

## Running it locally

Because the site is plain static files, you can just open `index.html` in a
browser. For a closer match to how GitHub Pages serves it (and to avoid any
browser quirks with `file://` URLs), run a tiny local server from the project
root instead:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Deploying with GitHub Pages

1. Push this project to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch."
4. Choose the branch (e.g. `main`) and the `/ (root)` folder, then save.
5. GitHub will publish the site at `https://<username>.github.io/<repo>/`.

No further configuration is needed — there's no build step to run.

## How to modify mindset content

Open [`data/mindsets.js`](data/mindsets.js). It exports a single `MINDSETS`
array with one object per mindset:

```js
{
  id,             // slug used in URLs/DOM ids, e.g. "imaginative"
  name,           // display name
  tagline,        // one-sentence description shown on the card and detail header
  keywords,       // 3 short words shown as pills on the card
  icon,           // one of: "spark", "compass", "mountain", "people", "pencil"
  quote,          // pull quote shown in the detail panel
  introduction,   // short paragraph
  whatItLooksLike: [ "...", "..." ],
  practices: [
    { title, description, examples: ["...", "..."], purpose }
  ],
  teacherMoves: [ "...", "..." ]
}
```

Edit any field's text directly — the page re-renders itself from this data,
so no other file needs to change. To add a sixth mindset, copy an existing
object, give it a new `id`, and add a matching accent color pair (see
"Colors, icons, and style variables" below).

## Adding classroom examples later

Each `practices[].examples` entry is currently a plain string. The data
model is intentionally simple today but was designed to grow — the project
brief calls for future support for teacher-submitted examples, grade-level
and subject filtering, and more. When that's needed:

1. Change example entries from strings to objects, e.g.
   `{ text: "Think–Pair–Share", gradeLevel: "K-2", subject: "ELA", teacherSubmitted: true }`.
2. Update the `.map()` calls in `js/app.js` (`practice-group__examples`) to
   read `.text` instead of the raw string, and to render any new metadata
   you want visible (a small tag, a filter chip, etc.).
3. Filtering UI (by grade, subject, etc.) can be added as controls above the
   `mindset-grid` or above the accordion, filtering the `MINDSETS` array (or
   a flattened examples list) before rendering.

This keeps the current interface simple while leaving room to grow without a
rebuild.

## Colors, icons, and style variables

Everything visual is controlled from the top of
[`css/styles.css`](css/styles.css) in the `:root` block:

- `--color-*` — the neutral palette (background, ink, borders, surfaces),
  tinted toward Evergreen's dark teal rather than pure black/gray.
- `--brand-*` — the Evergreen School brand colors, pulled directly from
  evergreenschool.org: `--brand-teal-deep` (#00555C, header/about/footer),
  `--brand-teal-darkest` (#172C2E, footer/ink), `--brand-teal-mid` (#0E7178),
  `--brand-mint` / `--brand-mint-tint` (#B7F4D8-family, light accents and
  text on dark backgrounds), `--brand-olive` (#AAB132, the "Evergreen"
  wordmark color), `--brand-gold` / `--brand-gold-deep` (#FFC166 / #C97A2E,
  hover states and the hero headline emphasis), and `--brand-orange` /
  `--brand-cream` (#FA9F4D / #FFE0B4, reserved for future accents).
- `--accent-<mindset>` / `--accent-<mindset>-bg` — the five mindset accent
  colors and their soft background tints. Each is a deepened, text-safe
  shade drawn from the `--brand-*` family above (olive for Imaginative,
  teal for Inquisitive, gold for Persistent, green for Collaborative, slate
  for Disciplined) so the five mindsets read as a family rather than a
  generic rainbow. Each mindset's accent is wired to its card and detail
  panel via `--accent` / `--accent-bg` custom properties set per
  `data-mindset` (see the "Per-mindset accent wiring" rules near the bottom
  of the card styles, and the inline `style.setProperty` calls in
  `js/app.js`).
- `--font-display` / `--font-body` — the two Google Fonts in use, matching
  evergreenschool.org's own pairing: Barlow Condensed for headings/quotes,
  Inter for body text.
- `--radius-*`, `--shadow-*`, `--transition-*` — shared shape, elevation,
  and animation tokens used across cards, panels, and accordions.

To re-sync with the live Evergreen School site if its brand colors change,
revisit evergreenschool.org and update the `--brand-*` values — the rest of
the site (including the five mindset accents) is derived from them.

Icons live inline in `js/app.js` as an `ICONS` object of small SVG strings
(no icon library/CDN dependency). To change a mindset's icon, either edit
its existing SVG or add a new key to `ICONS` and reference it from that
mindset's `icon` field in `data/mindsets.js`.

## Linking to a future teacher-output generator

The data model (`id`, structured `practices`, and reserved-but-unused
metadata fields like `gradeLevel`, `subject`, `duration`, `grouping`,
`materials`) is meant to double as an API contract for a second application
— for example, a tool that generates a printable lesson plan or reflection
artifact from a chosen mindset and practice.

Two straightforward integration paths:

- **Static handoff:** a second app reads `data/mindsets.js` (or a
  JSON export of it) directly, since it's already a plain, dependency-free
  data structure.
- **Deep link:** add a "Create a lesson artifact" button to the detail panel
  that links to the second app with the mindset `id` (and, later, a chosen
  practice) as a query parameter, e.g. `?mindset=imaginative&practice=...`.

Neither path requires changes to this site's core architecture — only an
added link/button and, if needed, a small JSON export step.

## Before you ship changes

A quick manual pass is worth doing after any edit:

- All five cards open and close correctly, and only one is active at a time.
- Every accordion opens, closes, and is operable with the keyboard (Tab +
  Enter/Space).
- The site looks right at desktop, tablet, and mobile widths.
- No errors appear in the browser console.
- Spelling of the five mindset names is correct: **Imaginative, Inquisitive,
  Persistent, Collaborative, Disciplined.**
