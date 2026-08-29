/**
 * Publication page templates.
 *
 * This is the single source of truth for what the five US-Letter pages
 * contain and how they're structured. Both the on-screen live preview and
 * the PDF/PNG export use the exact same markup produced here, so what a
 * teacher sees while editing is exactly what gets exported.
 */

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

// Splits free text into paragraphs on blank lines, preserving single
// line breaks within a paragraph, escaping all user-provided text.
function textToParagraphs(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return "";
  return trimmed
    .split(/\n\s*\n/)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function wordCount(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function isLikelyValidUrl(value) {
  if (!value) return true; // optional field, empty is fine
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function getMindset(state) {
  return state.mindset ? MINDSETS[state.mindset] : null;
}

function pageFooter(pageNum) {
  return `
    <div class="page-footer">
      <span class="page-footer__rule" aria-hidden="true"></span>
      <span class="page-footer__project">Evergreen Creativity Project | 2026&ndash;27</span>
      <span class="page-footer__pagenum">Page ${pageNum} of 5</span>
    </div>`;
}

function pageShell(pageNum, mindset, bodyHtml, extraContentClass) {
  const color = mindset ? mindset.color : "#00555C";
  const textColor = mindset ? mindset.textColor : "#FFFFFF";
  return `
    <div class="page" data-page="${pageNum}" style="--mindset-color:${color}; --mindset-text:${textColor};">
      <div class="page-content${extraContentClass ? " " + extraContentClass : ""}">
        ${bodyHtml}
      </div>
      ${pageFooter(pageNum)}
    </div>`;
}

function eyebrow(label) {
  return `<p class="page-eyebrow">${escapeHtml(label)}</p>`;
}

// ---------- PAGE 1 — CONTEXT ----------
function renderPage1(state) {
  const mindset = getMindset(state);
  const subjects = [...state.subjects];
  if (state.subjects.includes("Other") && state.subjectOther) {
    const idx = subjects.indexOf("Other");
    subjects[idx] = state.subjectOther;
  }

  const body = `
    <div class="cover-band">
      <p class="cover-band__label">Creativity Mindset</p>
      <p class="cover-band__name">${mindset ? escapeHtml(mindset.name.toUpperCase()) : "Select a Mindset"}</p>
      <p class="cover-band__descriptor">${mindset ? escapeHtml(mindset.descriptor) : ""}</p>
    </div>
    <div class="cover-body">
      <h1 class="cover-title">${state.title ? escapeHtml(state.title) : "Untitled Lesson or Project"}</h1>
      <dl class="cover-meta">
        <div class="cover-meta__row">
          <dt>Subject${subjects.length > 1 ? "s" : ""}</dt>
          <dd>${subjects.length ? escapeHtml(subjects.join(", ")) : "&mdash;"}</dd>
        </div>
        <div class="cover-meta__row">
          <dt>Grade Level${state.grades.length > 1 ? "s" : ""}</dt>
          <dd>${state.grades.length ? escapeHtml(state.grades.join(", ")) : "&mdash;"}</dd>
        </div>
        ${state.teacherName ? `
        <div class="cover-meta__row">
          <dt>Teacher</dt>
          <dd>${escapeHtml(state.teacherName)}</dd>
        </div>` : ""}
      </dl>
      ${mindset ? `<p class="cover-tagline">&ldquo;${escapeHtml(mindset.tagline)}&rdquo;</p>` : ""}
    </div>`;
  return pageShell(1, mindset, body, "page-content--cover");
}

// ---------- PAGE 2 — SUMMARY ----------
function renderPage2(state) {
  const mindset = getMindset(state);
  const body = `
    ${eyebrow("The Lesson")}
    <h1 class="page-title">Lesson Summary</h1>
    <section class="content-block">
      <h2 class="content-block__heading">Key Learning Objective(s)</h2>
      <div class="content-block__body">${textToParagraphs(state.objectives) || emptyState("Learning objectives will appear here.")}</div>
    </section>
    <section class="content-block">
      <h2 class="content-block__heading">Lesson / Project Overview</h2>
      <div class="content-block__body">${textToParagraphs(state.overview) || emptyState("A brief overview of the lesson or project will appear here.")}</div>
    </section>`;
  return pageShell(2, mindset, body);
}

// ---------- PAGE 3 — INTEGRATING THE MINDSET ----------
function renderPage3(state) {
  const mindset = getMindset(state);
  const heading = mindset
    ? `Bringing the ${mindset.name} Mindset Into the Lesson`
    : "Bringing the Mindset Into the Lesson";
  const body = `
    ${eyebrow("Integrating the Mindset")}
    <h1 class="page-title">${escapeHtml(heading)}</h1>
    ${mindset ? `
    <div class="mindset-badge">
      <span class="mindset-badge__name">${escapeHtml(mindset.name)}</span>
      <span class="mindset-badge__descriptor">${escapeHtml(mindset.descriptor)}</span>
    </div>` : ""}
    <section class="content-block content-block--feature">
      <div class="content-block__body content-block__body--feature">${textToParagraphs(state.integration) || emptyState("A description of how this mindset was integrated will appear here.")}</div>
    </section>`;
  return pageShell(3, mindset, body);
}

// ---------- PAGE 4 — LOGISTICS ----------
function renderPage4(state) {
  const mindset = getMindset(state);
  const timeValue = state.time === "Other" && state.timeOther ? state.timeOther : state.time;
  const hasValidLink = state.link && isLikelyValidUrl(state.link);

  const body = `
    ${eyebrow("Making It Happen")}
    <h1 class="page-title">Making It Happen</h1>
    <section class="content-block">
      <h2 class="content-block__heading">Time Required</h2>
      <div class="content-block__body">${timeValue ? escapeHtml(timeValue) : emptyState("Not specified.")}</div>
    </section>
    <section class="content-block">
      <h2 class="content-block__heading">Required Resources</h2>
      <div class="content-block__body">${textToParagraphs(state.resources) || emptyState("No special resources listed.")}</div>
    </section>
    <section class="content-block">
      <h2 class="content-block__heading">Lesson / Project Link</h2>
      <div class="content-block__body">
        ${hasValidLink
          ? `<a class="resource-link" href="${escapeHtml(state.link)}" target="_blank" rel="noopener noreferrer">View Lesson &amp; Resources &rarr;</a>`
          : emptyState("No link provided.")}
      </div>
    </section>`;
  return pageShell(4, mindset, body);
}

// ---------- PAGE 5 — WORDS OF WISDOM ----------
function renderPage5(state) {
  const mindset = getMindset(state);
  const wisdomItems = state.wisdom.filter((w) => w && w.trim());
  const body = `
    ${eyebrow("Words of Wisdom")}
    <h1 class="page-title">Words of Wisdom</h1>
    <p class="page-subheading">Based on ${state.teacherName ? escapeHtml(state.teacherName) + "&rsquo;s" : "this teacher&rsquo;s"} experience, what should another Evergreen teacher know before trying this lesson or project?</p>
    <ol class="wisdom-list">
      ${wisdomItems.length
        ? wisdomItems.map((w, i) => `<li class="wisdom-list__item"><span class="wisdom-list__number">${i + 1}</span><span class="wisdom-list__text">${escapeHtml(w)}</span></li>`).join("")
        : `<li class="wisdom-list__item wisdom-list__item--empty">${emptyState("Practitioner advice will appear here once added.")}</li>`}
    </ol>`;
  return pageShell(5, mindset, body);
}

function emptyState(msg) {
  return `<p class="empty-state">${escapeHtml(msg)}</p>`;
}

const PAGE_RENDERERS = [renderPage1, renderPage2, renderPage3, renderPage4, renderPage5];

function renderPageByNumber(n, state) {
  return PAGE_RENDERERS[n - 1](state);
}
