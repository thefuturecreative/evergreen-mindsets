/**
 * Evergreen Creativity Mindsets — app.js
 * -------------------------------------------------------------------------
 * Renders the mindset cards and the expandable detail panel entirely from
 * the MINDSETS array in data/mindsets.js. There is no per-mindset markup
 * in index.html — everything below is generated, so adding a sixth
 * mindset (or new fields) only requires editing the data file.
 */

(function () {
  "use strict";

  /* ---- Icon set (inline SVG, inherits color via currentColor) ---- */
  const ICONS = {
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5c.6 3.4 2 5.7 5.5 6.5-3.5.8-4.9 3.1-5.5 6.5-.6-3.4-2-5.7-5.5-6.5C10 8.2 11.4 5.9 12 2.5Z"/><path d="M19 15c.3 1.5.9 2.5 2.5 2.9-1.6.4-2.2 1.4-2.5 2.9-.3-1.5-.9-2.5-2.5-2.9 1.6-.4 2.2-1.4 2.5-2.9Z"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M14.8 9.2 13 13l-3.8 1.8L11 11l3.8-1.8Z"/></svg>',
    mountain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 18 6.5-10L14 15l2.5-3.5L21 18Z"/><path d="M3 18h18"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="9" r="3.2"/><circle cx="16" cy="10.5" r="2.6"/><path d="M4 19c.6-3 2.4-4.6 5-4.6s4.4 1.6 5 4.6"/><path d="M14 19c.4-2.2 1.7-3.5 3.6-3.5S21 16.8 21.4 19"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14.5 4.5 5 5L8 21l-5.5 1L3.5 16.5Z"/><path d="m12.5 6.5 5 5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };

  const grid = document.getElementById("mindset-grid");
  const detailPanel = document.getElementById("detail-panel");
  const detailContent = document.getElementById("detail-content");

  let activeId = null;

  /* ---- Escape helper for user-facing text interpolated into HTML ---- */
  function esc(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  /* ---- Build the five mindset cards ---- */
  function renderCards() {
    grid.innerHTML = MINDSETS.map((m) => `
      <button
        type="button"
        class="mindset-card"
        data-mindset="${m.id}"
        aria-pressed="false"
        aria-describedby="card-tagline-${m.id}"
      >
        <span class="mindset-card__check">${ICONS.check}</span>
        <span class="mindset-card__icon">${ICONS[m.icon] || ICONS.spark}</span>
        <span class="mindset-card__name">${esc(m.name)}</span>
        <span class="mindset-card__tagline" id="card-tagline-${m.id}">${esc(m.tagline)}</span>
        <span class="mindset-card__keywords">
          ${m.keywords.map((k) => `<span>${esc(k)}</span>`).join("")}
        </span>
      </button>
    `).join("");

    grid.querySelectorAll(".mindset-card").forEach((card) => {
      card.addEventListener("click", () => selectMindset(card.dataset.mindset));
    });
  }

  /* ---- Accordion section definitions for the detail panel ---- */
  function accordionSections(mindset) {
    return [
      {
        id: "looks-like",
        label: "What It Looks Like",
        bodyHTML: `
          <ul class="looks-like-list">
            ${mindset.whatItLooksLike.map((item) => `<li>${esc(item)}</li>`).join("")}
          </ul>
        `
      },
      {
        id: "practices",
        label: "Practices to Try",
        bodyHTML: mindset.practices.map((p) => `
          <div class="practice-group">
            <p class="practice-group__title">${esc(p.title)}</p>
            ${p.description ? `<p class="practice-group__description">${esc(p.description)}</p>` : ""}
            <ul class="practice-group__examples">
              ${p.examples.map((ex) => `<li>${esc(ex)}</li>`).join("")}
            </ul>
            ${p.purpose ? `<p class="practice-group__purpose"><strong>Purpose:</strong> ${esc(p.purpose)}</p>` : ""}
          </div>
        `).join("")
      },
      {
        id: "teacher-moves",
        label: "Teacher Moves",
        bodyHTML: `
          <ul class="teacher-moves-list">
            ${mindset.teacherMoves.map((move, i) => `
              <li>
                <span class="teacher-moves-list__num" aria-hidden="true">${i + 1}</span>
                <span>${esc(move)}</span>
              </li>
            `).join("")}
          </ul>
        `
      }
    ];
  }

  /* ---- Render the expanded detail panel for a given mindset ---- */
  function renderDetail(mindset) {
    const sections = accordionSections(mindset);

    detailContent.innerHTML = `
      <div class="detail-header" data-mindset="${mindset.id}">
        <p class="detail-header__eyebrow">
          <span class="detail-header__icon">${ICONS[mindset.icon] || ICONS.spark}</span>
          Mindset Spotlight
        </p>
        <h2 class="detail-header__name">${esc(mindset.name)}</h2>
        <p class="detail-header__tagline">${esc(mindset.tagline)}</p>
        <p class="detail-header__intro">${esc(mindset.introduction)}</p>
        ${mindset.quote ? `<blockquote class="detail-header__quote">&ldquo;${esc(mindset.quote)}&rdquo;</blockquote>` : ""}

        <div class="accordion">
          ${sections.map((s, i) => `
            <div class="accordion-item">
              <h3>
                <button
                  type="button"
                  class="accordion-trigger"
                  id="accordion-trigger-${s.id}"
                  aria-expanded="${i === 0 ? "true" : "false"}"
                  aria-controls="accordion-panel-${s.id}"
                >
                  <span class="accordion-trigger__label">${esc(s.label)}</span>
                  <span class="accordion-trigger__icon">${ICONS.plus}</span>
                </button>
              </h3>
              <div
                class="accordion-panel${i === 0 ? " is-open" : ""}"
                id="accordion-panel-${s.id}"
                role="region"
                aria-labelledby="accordion-trigger-${s.id}"
              >
                <div class="accordion-panel__inner">
                  <div class="accordion-panel__body">${s.bodyHTML}</div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        <button type="button" class="detail-header__close" id="detail-close">
          <span class="detail-header__close-icon">${ICONS.close}</span> Close this mindset
        </button>
      </div>
    `;

    // Set the accent custom properties on the header so accordion, quote
    // border, etc. all pick up the right color via CSS variables.
    const header = detailContent.querySelector(".detail-header");
    header.style.setProperty("--accent", `var(--accent-${mindset.id})`);
    header.style.setProperty("--accent-bg", `var(--accent-${mindset.id}-bg)`);

    // Wire up accordion triggers.
    detailContent.querySelectorAll(".accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => toggleAccordion(trigger));
    });

    // Wire up close button.
    document.getElementById("detail-close").addEventListener("click", () => {
      deselectMindset();
      document.querySelector(`.mindset-card[data-mindset="${mindset.id}"]`).focus();
    });
  }

  function toggleAccordion(trigger) {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    trigger.setAttribute("aria-expanded", String(!expanded));
    panel.classList.toggle("is-open", !expanded);
  }

  /* ---- Selection logic ---- */
  function selectMindset(id) {
    if (activeId === id) {
      deselectMindset();
      return;
    }

    activeId = id;
    const mindset = MINDSETS.find((m) => m.id === id);
    if (!mindset) return;

    grid.querySelectorAll(".mindset-card").forEach((card) => {
      const isActive = card.dataset.mindset === id;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", String(isActive));
    });

    renderDetail(mindset);
    detailPanel.hidden = false;

    // Scroll the panel into view without yanking focus away from the card.
    requestAnimationFrame(() => {
      detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function deselectMindset() {
    activeId = null;
    grid.querySelectorAll(".mindset-card").forEach((card) => {
      card.classList.remove("is-active");
      card.setAttribute("aria-pressed", "false");
    });
    detailPanel.hidden = true;
    detailContent.innerHTML = "";
  }

  /* ---- Sticky header compact state on scroll ---- */
  function initHeaderScroll() {
    const header = document.getElementById("site-header");
    let ticking = false;
    function update() {
      header.classList.toggle("is-compact", window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---- Init ---- */
  document.addEventListener("DOMContentLoaded", () => {
    renderCards();
    initHeaderScroll();
  });
})();
