# Evergreen Creativity Toolkit Builder

A static, single-page tool that lets Evergreen School teachers document a
lesson or project where they deliberately integrated one of the five
2026&ndash;27 creativity mindsets &mdash; **Imaginative, Inquisitive,
Persistent, Collaborative,** and **Disciplined** &mdash; and export it as a
polished, publication-ready, five-page US Letter PDF. Individual teacher
entries are designed to be combined later into one collective Evergreen
Creativity Toolkit, so every entry shares identical dimensions, margins,
typography, and page architecture &mdash; only content and mindset color vary.

No build step, server, database, login, or account is required. Everything
is HTML, CSS, and vanilla JavaScript, and the whole thing runs entirely in
the teacher's browser — nothing they type is ever transmitted anywhere.

## What it does

- A guided, five-section form (Context, Summary, Integrating the Mindset,
  Logistics, Words of Wisdom) built as an accordion, so teachers can freely
  revisit earlier sections instead of following a rigid wizard.
- A live, true-to-scale US Letter preview of all five pages that updates as
  the teacher types, with page navigation tabs and clickable thumbnails.
- Word counters (with gentle, non-blocking guidance) on the two ~50-word
  fields.
- Automatic content-overflow detection: if a field's text would visually
  overflow its page, the affected page is flagged and PDF export is
  blocked until it's shortened — text is never silently truncated or
  shrunk.
- One-click **Download PDF** producing a true 8.5×11in, 5-page PDF with a
  genuinely clickable hyperlink to the teacher's lesson resources.
- **Download Current Page as PNG** and **Download All Pages as Images** for
  quick sharing of a single page.
- Automatic local-only autosave (`localStorage`) plus secondary, low-key
  **Export/Import Entry Data (.json)** controls for manual backup, and a
  confirmed **Start New Entry** reset.

## File structure

```
/
├── index.html              Page shell: form column + live preview column
├── css/
│   ├── styles.css           Application chrome — header, form, buttons, preview shell
│   └── print.css            The US Letter publication page design itself
├── js/
│   ├── pages.js              Builds the HTML for all 5 pages from state (shared by preview + export)
│   ├── app.js                State, form wiring, live preview rendering, validation, autosave
│   └── export.js             PDF and PNG generation
├── data/
│   ├── mindsets.js            Central mindset data: names, colors, descriptors, guidance
│   └── formOptions.js         Subject / grade-level / time-required option lists
├── assets/
│   └── vendor/                 Local copies of jsPDF and html2canvas (no CDN dependency)
├── .nojekyll
└── README.md
```

## Running it locally

Because it's plain static files, you can open `index.html` directly in a
browser, or run a tiny local server from the project root for a closer
match to GitHub Pages:

```bash
python3 -m http.server 8123
```

Then visit `http://localhost:8123`.

## Deploying with GitHub Pages

1. Push this project to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch."
4. Choose the branch (e.g. `main`) and the `/ (root)` folder, then save.
5. GitHub publishes the site at `https://<username>.github.io/<repo>/`.

The `.nojekyll` file is already present so GitHub Pages serves the `assets/`
and other folders as-is, with no build step.

## Which file controls what

- **Evergreen color palette** — the `:root` block at the top of
  [`css/styles.css`](css/styles.css) (`--teal-deep`, `--teal-mid`,
  `--teal-darkest`, `--mint`, `--olive`, `--gold`, `--gold-deep`,
  `--orange`, `--cream`). The publication page design in
  [`css/print.css`](css/print.css) reads the same brand variables plus the
  per-mindset `--mindset-color` / `--mindset-text` custom properties that
  `js/pages.js` sets inline on each `.page`.
- **Mindset information** (name, color, text color, descriptor, tagline,
  builder-only guidance) — [`data/mindsets.js`](data/mindsets.js). This is
  the single source of truth; nothing about a mindset is duplicated
  elsewhere. To retheme or add a mindset, edit this file only.
- **Form options** (Subjects, Grade Levels, Time Required choices) —
  [`data/formOptions.js`](data/formOptions.js).
- **The US Letter page design** — [`css/print.css`](css/print.css) defines
  every page's dimensions, margins, typography, and footer system;
  [`js/pages.js`](js/pages.js) defines the markup for all five pages. Both
  files are shared, unmodified, between the on-screen live preview and the
  offscreen export capture, so what a teacher sees is exactly what gets
  exported.

## How PDF generation works

Each of the five pages is rendered from the exact same markup used in the
live preview into an offscreen, full-resolution (816×1056px = 8.5×11in @
96dpi), untransformed container (`#export-stage` in `index.html`). Each
page is then captured with **html2canvas** at 2.5× scale and placed into a
**jsPDF** document sized to true US Letter (8.5×11in) as a high-quality
JPEG image — one image per page, so typography, layout, colors, and page
breaks are pixel-faithful to what the teacher saw while editing. This
matters because dozens of separately-authored entries need to look like one
consistent publication, not five ad hoc canvases.

The tradeoff of this approach: body text in the exported PDF is not
selectable or searchable, since each page is fundamentally an embedded
image. Given the requirement that every entry share identical layout and
typography with no drift, this was chosen over hand-implementing PDF text
layout (which would risk inconsistent wrapping/kerning across browsers and
entries). See `js/export.js` for the full rationale in comments.

## How the clickable hyperlink is preserved

Because each page is otherwise a flattened image, the Page 4 "View Lesson &
Resources →" link would normally stop being clickable. To prevent that,
`js/export.js` reads the actual on-page pixel position of that button
(via `getBoundingClientRect`) right before capturing Page 4, converts it to
inches, and adds a real jsPDF link annotation (`doc.link(x, y, w, h, {
url })`) at that exact location on top of the image. The result is a
normal, standards-compliant PDF `/Link` annotation with a `/URI` action —
genuinely clickable (and screen-reader/PDF-tool discoverable) in any PDF
viewer, verified by inspecting the raw PDF bytes during development.

## How local autosave works

Every field edit updates an in-memory `state` object (see the top of
`js/app.js` for its shape) and, debounced by ~300ms, writes it as JSON to
`localStorage` under the key `evergreenToolkitEntry`. On page load, that
key is read back and used to repopulate the form and preview. Nothing is
ever sent over the network — there is no server, API, or analytics call
anywhere in the app. **Export Entry Data (.json)** / **Import Entry Data
(.json)** write/read that same JSON shape to/from a file, for manual backup
or moving an in-progress entry to another device.

## Technical limitations to know about

- **Exported PDF text isn't selectable/searchable** (see above) — it's a
  deliberate tradeoff for perfect visual consistency across submissions.
- **PDF file size** is a few hundred KB to ~1MB for a typical five-page
  entry (JPEG-compressed page images at 2.5× resolution). This keeps
  quality high while staying reasonable for email/sharing.
- **"Download All Pages as Images"** triggers five sequential browser
  downloads rather than a single zip file (no bundling library is used, to
  keep the dependency footprint small and avoid an extra build step).
  Browsers may prompt to allow multiple downloads the first time.
- **Overflow detection** measures actual rendered DOM height against each
  page's content area, so it responds to real text length, font rendering,
  and line-wrapping — but it only runs on data already in the form. Pasting
  extremely long content will correctly flag overflow and block PDF export
  until shortened.
- **`jsPDF` and `html2canvas`** are vendored locally in `assets/vendor/`
  (not loaded from a CDN), so the app works fully offline once loaded and
  isn't affected by CDN outages — but it also means upgrading those
  libraries requires manually replacing those two files.
- **Future-ready, not future-built**: the data model in `data/mindsets.js`
  and the flat `state` shape in `js/app.js` were kept simple and
  serializable on purpose, so that later features mentioned in the original
  brief (a shared example library, filtering by grade/subject/mindset,
  photo uploads, editing past submissions, QR codes, etc.) can be layered
  on without restructuring what's here. None of that is built yet.

## Before shipping a change

- All five mindsets: colors, descriptors, and guidance update correctly
  everywhere (picker, guidance panel, all 5 preview pages) when selected —
  including switching mindsets after content already exists, with no data
  loss.
- Word counters behave correctly at 0–50, 51–60, and 61+ words without
  ever truncating input.
- Multi-select Subjects/Grades, the Time "Other" reveal, and the Subject
  "Other" reveal all work and persist through save/reload.
- An invalid URL in the Lesson Link field shows a gentle (non-blocking)
  warning; a valid one renders a working "View Lesson & Resources →" link
  on Page 4.
- Required-field validation correctly blocks PDF export and links directly
  to the offending accordion section; optional fields can stay empty.
- Refreshing the browser restores the in-progress entry from
  `localStorage`; **Start New Entry** clears it only after confirmation.
- Desktop, tablet, and mobile widths all work with no horizontal page
  scrolling; the exported PDF/PNG dimensions never change regardless of
  screen size.
- A generated PDF actually opens: exactly 5 pages, true 8.5×11in portrait,
  no clipped content, correct mindset color and page numbering, and a
  working link on Page 4.
