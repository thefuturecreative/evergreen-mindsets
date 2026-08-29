/**
 * Application state, form wiring, and live preview rendering.
 *
 * State shape (also the shape persisted to localStorage and to
 * Export/Import Entry Data JSON files):
 *
 * {
 *   mindset: "imaginative" | "inquisitive" | "persistent" | "collaborative" | "disciplined" | null,
 *   title, teacherName: string,
 *   subjects: string[], subjectOther: string,
 *   grades: string[],
 *   objectives, overview, integration: string,
 *   time: string, timeOther: string,
 *   resources: string, link: string,
 *   wisdom: [string, string, string]
 * }
 */

const STORAGE_KEY = "evergreenToolkitEntry";
const NATIVE_PAGE_WIDTH = 816; // 8.5in @ 96dpi
const NATIVE_PAGE_HEIGHT = 1056; // 11in @ 96dpi
const THUMB_WIDTH = 108;

function defaultState() {
  return {
    mindset: null,
    title: "",
    teacherName: "",
    subjects: [],
    subjectOther: "",
    grades: [],
    objectives: "",
    overview: "",
    integration: "",
    time: "",
    timeOther: "",
    resources: "",
    link: "",
    wisdom: ["", "", ""],
  };
}

let state = defaultState();
let activePage = 1;
let overflowFlags = { 1: false, 2: false, 3: false, 4: false, 5: false };
let isExporting = false;

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// ---------------- Persistence ----------------

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state = Object.assign(defaultState(), parsed);
    if (!Array.isArray(state.subjects)) state.subjects = [];
    if (!Array.isArray(state.grades)) state.grades = [];
    if (!Array.isArray(state.wisdom) || state.wisdom.length !== 3) {
      state.wisdom = [state.wisdom?.[0] || "", state.wisdom?.[1] || "", state.wisdom?.[2] || ""];
    }
  } catch (e) {
    console.warn("Could not load saved entry:", e);
  }
}

const saveState = debounce(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const el = document.getElementById("save-indicator");
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    el.textContent = `Saved on this device · ${time}`;
  } catch (e) {
    console.warn("Could not save entry:", e);
  }
}, 300);

// ---------------- Form population (used on load + import) ----------------

function populateFormFromState() {
  $("#field-title").value = state.title;
  $("#field-teacher").value = state.teacherName;
  $("#field-objectives").value = state.objectives;
  $("#field-overview").value = state.overview;
  $("#field-integration").value = state.integration;
  $("#field-resources").value = state.resources;
  $("#field-link").value = state.link;
  $("#field-wisdom-1").value = state.wisdom[0];
  $("#field-wisdom-2").value = state.wisdom[1];
  $("#field-wisdom-3").value = state.wisdom[2];
  $("#field-time").value = state.time && !TIME_OPTIONS.includes(state.time) ? "Other" : state.time;
  $("#time-other-input").value = state.timeOther;
  $("#time-other-wrap").hidden = $("#field-time").value !== "Other";
  $("#subject-other-input").value = state.subjectOther;

  document.querySelectorAll("#subject-checkboxes input[type=checkbox]").forEach((cb) => {
    cb.checked = state.subjects.includes(cb.value);
  });
  $("#subject-other-wrap").hidden = !state.subjects.includes("Other");

  document.querySelectorAll("#grade-checkboxes input[type=checkbox]").forEach((cb) => {
    cb.checked = state.grades.includes(cb.value);
  });

  document.querySelectorAll("#mindset-picker-grid .mindset-option").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.mindset === state.mindset));
  });

  updateWordCounter("overview");
  updateWordCounter("integration");
  updateMindsetDependentUI();
  validateLinkField();
}

function $(sel, root = document) {
  return root.querySelector(sel);
}

// ---------------- Build static dynamic pieces ----------------

function buildMindsetPicker() {
  const grid = $("#mindset-picker-grid");
  grid.innerHTML = MINDSET_ORDER.map((id) => {
    const m = MINDSETS[id];
    return `
      <button type="button" class="mindset-option" data-mindset="${id}"
        style="--mindset-color:${m.color}; --mindset-text:${m.textColor};"
        aria-pressed="false">
        <span class="mindset-option__name">${m.name}</span>
        <span class="mindset-option__descriptor">${m.descriptor}</span>
      </button>`;
  }).join("");

  grid.querySelectorAll(".mindset-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mindset = btn.dataset.mindset;
      grid.querySelectorAll(".mindset-option").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      updateMindsetDependentUI();
      saveState();
      scheduleRender();
    });
  });
}

function updateMindsetDependentUI() {
  const m = state.mindset ? MINDSETS[state.mindset] : null;
  $("#mindset-picker-descriptor").textContent = m ? m.descriptor : "";
  $("#mindset-guidance-text").textContent = m
    ? m.guidance
    : "Select a creativity mindset above to see tailored guidance here.";
  $("#integration-label").innerHTML = m
    ? `Describe how you integrated the ${m.name} mindset <span class="required-mark">*</span>`
    : `Describe how you integrated the mindset <span class="required-mark">*</span>`;

  document.documentElement.style.setProperty("--active-mindset-color", m ? m.color : "#00555C");
}

function buildCheckboxGroup(containerId, options, name) {
  const container = $("#" + containerId);
  container.innerHTML = options
    .map((opt, i) => {
      const id = `${containerId}-${i}`;
      return `
      <label class="checkbox-pill" for="${id}">
        <input type="checkbox" id="${id}" name="${name}" value="${escapeHtml(opt)}">
        <span>${escapeHtml(opt)}</span>
      </label>`;
    })
    .join("");
}

function buildTimeSelect() {
  const select = $("#field-time");
  select.innerHTML =
    `<option value="">Select&hellip;</option>` +
    TIME_OPTIONS.map((opt) => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join("");
}

// ---------------- Word counters ----------------

function updateWordCounter(fieldKey) {
  const textarea = $(`#field-${fieldKey}`);
  const counter = $(`#${fieldKey}-counter`);
  const count = wordCount(textarea.value);
  counter.textContent = `${count} / 50 words`;
  let stateAttr = "ok";
  if (count > 60) stateAttr = "strong";
  else if (count > 50) stateAttr = "warn";
  counter.dataset.state = stateAttr;
  if (stateAttr === "warn") {
    counter.textContent += " — consider tightening this a little.";
  } else if (stateAttr === "strong") {
    counter.textContent += " — consider shortening this so it fits comfortably on the page.";
  }
}

// ---------------- Validation ----------------

function validateLinkField() {
  const value = $("#field-link").value.trim();
  const warning = $("#link-warning");
  warning.hidden = value === "" || isLikelyValidUrl(value);
}

function getRequiredFieldIssues() {
  const issues = [];
  if (!state.title.trim()) issues.push({ label: "Lesson / Project Title", section: "context" });
  if (!state.subjects.length) issues.push({ label: "At least one Subject", section: "context" });
  if (state.subjects.includes("Other") && !state.subjectOther.trim())
    issues.push({ label: "Subject (please specify “Other”)", section: "context" });
  if (!state.grades.length) issues.push({ label: "At least one Grade Level", section: "context" });
  if (!state.mindset) issues.push({ label: "Creativity Mindset selection", section: "mindset" });
  if (!state.objectives.trim()) issues.push({ label: "Key Learning Objective(s)", section: "summary" });
  if (!state.overview.trim()) issues.push({ label: "Lesson / Project Overview", section: "summary" });
  if (!state.integration.trim()) issues.push({ label: "Mindset Integration description", section: "mindset" });
  return issues;
}

function updateValidationSummary() {
  const box = $("#validation-summary");
  const issues = getRequiredFieldIssues();
  const overflowPages = Object.keys(overflowFlags).filter((p) => overflowFlags[p]);

  if (!issues.length && !overflowPages.length) {
    box.hidden = true;
    box.innerHTML = "";
    return { canExportPdf: true };
  }

  box.hidden = false;
  let html = "";
  if (issues.length) {
    html += `<p class="validation-summary__title">Before exporting the PDF, please complete:</p><ul>${issues
      .map((i) => `<li><button type="button" class="validation-jump" data-section="${i.section}">${escapeHtml(i.label)}</button></li>`)
      .join("")}</ul>`;
  }
  if (overflowPages.length) {
    html += `<p class="validation-summary__title">Some content may not fit the page:</p><ul>${overflowPages
      .map((p) => `<li>Page ${p} has more text than comfortably fits. Consider shortening the related field.</li>`)
      .join("")}</ul>`;
  }
  box.innerHTML = html;
  box.querySelectorAll(".validation-jump").forEach((btn) => {
    btn.addEventListener("click", () => {
      const details = document.querySelector(`details[data-section="${btn.dataset.section}"]`);
      if (details) {
        details.open = true;
        details.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  return { canExportPdf: issues.length === 0 && overflowPages.length === 0 };
}

// ---------------- Progress indicator ----------------

function updateProgress() {
  const complete = {
    context: !!(state.title.trim() && state.subjects.length && state.grades.length),
    summary: !!(state.objectives.trim() && state.overview.trim()),
    mindset: !!(state.mindset && state.integration.trim()),
    logistics: !!(state.time.trim() || state.resources.trim() || state.link.trim()),
    wisdom: state.wisdom.some((w) => w.trim()),
  };
  document.querySelectorAll("#progress-tracker li").forEach((li) => {
    li.classList.toggle("is-complete", !!complete[li.dataset.progress]);
  });
}

// ---------------- Overflow detection ----------------

function checkOverflow(pageNum) {
  const stage = $("#export-stage");
  stage.innerHTML = renderPageByNumber(pageNum, state);
  const pageEl = stage.querySelector(".page");
  const content = pageEl.querySelector(".page-content");
  const footer = pageEl.querySelector(".page-footer");
  const overflowing = content.getBoundingClientRect().bottom > footer.getBoundingClientRect().top - 2;
  stage.innerHTML = "";
  return overflowing;
}

function refreshOverflowFlags() {
  if (isExporting) return;
  for (let n = 1; n <= 5; n++) {
    overflowFlags[n] = checkOverflow(n);
  }
  document.querySelectorAll(".page-nav__btn").forEach((btn) => {
    btn.classList.toggle("has-warning", overflowFlags[btn.dataset.page]);
  });
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.classList.toggle("has-warning", overflowFlags[thumb.dataset.page]);
  });
}

// ---------------- Preview rendering ----------------

function renderMainStage() {
  const scaler = $("#preview-scaler");
  scaler.innerHTML = renderPageByNumber(activePage, state);
  scaleMainStage();
}

function scaleMainStage() {
  const viewport = $("#preview-viewport");
  const frame = $("#preview-frame");
  const scaler = $("#preview-scaler");
  const available = viewport.clientWidth;
  let scale = available / NATIVE_PAGE_WIDTH;
  scale = Math.max(0.2, Math.min(scale, 1.15));
  frame.style.width = `${NATIVE_PAGE_WIDTH * scale}px`;
  frame.style.height = `${NATIVE_PAGE_HEIGHT * scale}px`;
  scaler.style.transform = `scale(${scale})`;
}

function renderThumbnails() {
  const strip = $("#thumbnail-strip");
  const thumbScale = THUMB_WIDTH / NATIVE_PAGE_WIDTH;
  strip.innerHTML = [1, 2, 3, 4, 5]
    .map(
      (n) => `
      <button type="button" class="thumbnail ${n === activePage ? "is-active" : ""}" data-page="${n}"
        aria-label="Go to page ${n}" style="width:${THUMB_WIDTH}px; height:${Math.round(NATIVE_PAGE_HEIGHT * thumbScale)}px;">
        <span class="thumbnail__frame" style="width:${NATIVE_PAGE_WIDTH}px; height:${NATIVE_PAGE_HEIGHT}px; transform: scale(${thumbScale});">
          ${renderPageByNumber(n, state)}
        </span>
        <span class="thumbnail__label">${n}</span>
      </button>`
    )
    .join("");

  strip.querySelectorAll(".thumbnail").forEach((btn) => {
    btn.addEventListener("click", () => setActivePage(Number(btn.dataset.page)));
  });
}

function setActivePage(n) {
  activePage = n;
  document.querySelectorAll(".page-nav__btn").forEach((btn) => {
    const isActive = Number(btn.dataset.page) === n;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-current", String(isActive));
  });
  renderMainStage();
  document.querySelectorAll(".thumbnail").forEach((t) => t.classList.toggle("is-active", Number(t.dataset.page) === n));
}

const scheduleRender = debounce(() => {
  renderMainStage();
  renderThumbnails();
  updateProgress();
  refreshOverflowFlags();
  const { canExportPdf } = updateValidationSummary();
  $("#btn-download-pdf").setAttribute("aria-disabled", String(!canExportPdf));
}, 120);

// ---------------- Event wiring ----------------

function bindTextField(id, key) {
  $(id).addEventListener("input", (e) => {
    state[key] = e.target.value;
    saveState();
    scheduleRender();
  });
}

function bindEvents() {
  bindTextField("#field-title", "title");
  bindTextField("#field-teacher", "teacherName");
  bindTextField("#field-objectives", "objectives");
  bindTextField("#field-resources", "resources");

  $("#field-wisdom-1").addEventListener("input", (e) => {
    state.wisdom[0] = e.target.value;
    saveState();
    scheduleRender();
  });
  $("#field-wisdom-2").addEventListener("input", (e) => {
    state.wisdom[1] = e.target.value;
    saveState();
    scheduleRender();
  });
  $("#field-wisdom-3").addEventListener("input", (e) => {
    state.wisdom[2] = e.target.value;
    saveState();
    scheduleRender();
  });

  $("#field-overview").addEventListener("input", (e) => {
    state.overview = e.target.value;
    updateWordCounter("overview");
    saveState();
    scheduleRender();
  });
  $("#field-integration").addEventListener("input", (e) => {
    state.integration = e.target.value;
    updateWordCounter("integration");
    saveState();
    scheduleRender();
  });

  $("#field-link").addEventListener("input", (e) => {
    state.link = e.target.value;
    validateLinkField();
    saveState();
    scheduleRender();
  });

  $("#field-time").addEventListener("change", (e) => {
    state.time = e.target.value;
    $("#time-other-wrap").hidden = e.target.value !== "Other";
    if (e.target.value !== "Other") state.timeOther = "";
    saveState();
    scheduleRender();
  });
  $("#time-other-input").addEventListener("input", (e) => {
    state.timeOther = e.target.value;
    saveState();
    scheduleRender();
  });

  $("#subject-other-input").addEventListener("input", (e) => {
    state.subjectOther = e.target.value;
    saveState();
    scheduleRender();
  });

  document.querySelectorAll("#subject-checkboxes input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      state.subjects = Array.from(document.querySelectorAll("#subject-checkboxes input:checked")).map((c) => c.value);
      $("#subject-other-wrap").hidden = !state.subjects.includes("Other");
      saveState();
      scheduleRender();
    });
  });

  document.querySelectorAll("#grade-checkboxes input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      state.grades = Array.from(document.querySelectorAll("#grade-checkboxes input:checked")).map((c) => c.value);
      saveState();
      scheduleRender();
    });
  });

  document.querySelectorAll(".page-nav__btn").forEach((btn) => {
    btn.addEventListener("click", () => setActivePage(Number(btn.dataset.page)));
  });

  window.addEventListener("resize", debounce(scaleMainStage, 100));

  $("#btn-new-entry").addEventListener("click", handleStartNewEntry);
  $("#btn-export-json").addEventListener("click", handleExportJson);
  $("#btn-import-json").addEventListener("click", () => $("#import-json-input").click());
  $("#import-json-input").addEventListener("change", handleImportJson);
}

// ---------------- Advanced options: JSON backup, new entry ----------------

function sanitizeFilenamePart(str) {
  return String(str || "untitled")
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "untitled";
}

function handleStartNewEntry() {
  const confirmed = window.confirm(
    "Starting a new entry will clear your current locally saved entry on this device. This cannot be undone. Continue?"
  );
  if (!confirmed) return;
  state = defaultState();
  activePage = 1;
  localStorage.removeItem(STORAGE_KEY);
  document.querySelectorAll("details.accordion__item").forEach((d, i) => (d.open = i === 0));
  populateFormFromState();
  scheduleRender();
  const el = document.getElementById("save-indicator");
  el.textContent = "Your work is saved locally in this browser and is not uploaded by this tool.";
}

function handleExportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const mindsetPart = state.mindset ? MINDSETS[state.mindset].name : "Entry";
  a.href = url;
  a.download = `Evergreen_${sanitizeFilenamePart(mindsetPart)}_${sanitizeFilenamePart(state.title)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function handleImportJson(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state = Object.assign(defaultState(), parsed);
      if (!Array.isArray(state.subjects)) state.subjects = [];
      if (!Array.isArray(state.grades)) state.grades = [];
      if (!Array.isArray(state.wisdom) || state.wisdom.length !== 3) {
        state.wisdom = [state.wisdom?.[0] || "", state.wisdom?.[1] || "", state.wisdom?.[2] || ""];
      }
      populateFormFromState();
      saveState();
      scheduleRender();
    } catch (err) {
      alert("That file couldn’t be read as a valid Evergreen Toolkit entry (.json).");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
}

// ---------------- Init ----------------

function init() {
  loadState();
  buildMindsetPicker();
  buildCheckboxGroup("subject-checkboxes", SUBJECT_OPTIONS, "subjects");
  buildCheckboxGroup("grade-checkboxes", GRADE_OPTIONS, "grades");
  buildTimeSelect();
  bindEvents();
  populateFormFromState();
  setActivePage(1);
  renderThumbnails();
  updateProgress();
  refreshOverflowFlags();
  updateValidationSummary();
}

document.addEventListener("DOMContentLoaded", init);
