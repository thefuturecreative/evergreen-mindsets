/**
 * PDF and PNG export.
 *
 * Approach: each publication page is captured from the live DOM (the same
 * markup the on-screen preview uses, rendered full-size and unscaled in the
 * off-screen #export-stage) via html2canvas, so exported typography and
 * layout are pixel-faithful to what the teacher sees while editing. The
 * canvas image is placed into a jsPDF document sized to true US Letter
 * (8.5 x 11in). A real jsPDF link annotation is layered on top of the
 * lesson-resource button on Page 4 (positioned from the captured element's
 * on-page coordinates) so the hyperlink stays genuinely clickable in the
 * exported PDF, even though the surrounding page content is an image.
 *
 * This hybrid keeps layout/typography perfectly consistent across every
 * teacher's submission (a hard requirement, since entries will later be
 * combined into one toolkit) without hand-implementing PDF text layout.
 * The tradeoff: exported body text is not selectable/searchable, only the
 * resource link is a real clickable/selectable annotation.
 */

const EXPORT_CAPTURE_SCALE = 2.5;

function setExportStatus(msg) {
  $("#export-status").textContent = msg;
}

async function renderPageForExport(pageNum) {
  const stage = $("#export-stage");
  stage.innerHTML = renderPageByNumber(pageNum, state);
  await document.fonts.ready;
  // A short delay (not requestAnimationFrame, which browsers can throttle
  // indefinitely on a hidden/background tab) to let layout settle before
  // capture.
  await new Promise((r) => setTimeout(r, 50));
  return stage.querySelector(".page");
}

function clearExportStage() {
  $("#export-stage").innerHTML = "";
}

function getResourceLinkRectInInches(pageEl) {
  const link = pageEl.querySelector(".resource-link");
  if (!link) return null;
  const pageRect = pageEl.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  const PX_PER_IN = pageRect.width / 8.5;
  return {
    x: (linkRect.left - pageRect.left) / PX_PER_IN,
    y: (linkRect.top - pageRect.top) / PX_PER_IN,
    w: linkRect.width / PX_PER_IN,
    h: linkRect.height / PX_PER_IN,
    url: link.getAttribute("href"),
  };
}

async function captureCanvas(pageEl) {
  return html2canvas(pageEl, {
    scale: EXPORT_CAPTURE_SCALE,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    windowWidth: NATIVE_PAGE_WIDTH,
    windowHeight: NATIVE_PAGE_HEIGHT,
  });
}

function buildExportFilenameBase() {
  const mindsetPart = state.mindset ? MINDSETS[state.mindset].name : "Entry";
  return `Evergreen_${sanitizeFilenamePart(mindsetPart)}_${sanitizeFilenamePart(state.title)}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function handleDownloadPdf() {
  if (isExporting) return;
  const { canExportPdf } = updateValidationSummary();
  if (!canExportPdf) {
    setExportStatus("Please resolve the items above before exporting the PDF.");
    $("#validation-summary").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  isExporting = true;
  $("#btn-download-pdf").disabled = true;
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "in", format: "letter", orientation: "portrait", compress: true });

    for (let n = 1; n <= 5; n++) {
      setExportStatus(`Preparing page ${n} of 5…`);
      const pageEl = await renderPageForExport(n);
      const canvas = await captureCanvas(pageEl);
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const linkRect = getResourceLinkRectInInches(pageEl);

      if (n > 1) doc.addPage("letter", "portrait");
      doc.addImage(imgData, "JPEG", 0, 0, 8.5, 11, undefined, "FAST");

      if (linkRect && linkRect.url) {
        doc.link(linkRect.x, linkRect.y, linkRect.w, linkRect.h, { url: linkRect.url });
      }
    }

    clearExportStage();
    setExportStatus("Finalizing PDF…");
    doc.save(`${buildExportFilenameBase()}.pdf`);
    setExportStatus("PDF downloaded.");
  } catch (err) {
    console.error(err);
    setExportStatus("Something went wrong generating the PDF. Please try again.");
  } finally {
    clearExportStage();
    isExporting = false;
    $("#btn-download-pdf").disabled = false;
    setTimeout(() => setExportStatus(""), 4000);
  }
}

async function handleDownloadCurrentPagePng() {
  if (isExporting) return;
  isExporting = true;
  $("#btn-download-png").disabled = true;
  try {
    setExportStatus(`Preparing page ${activePage} as an image…`);
    const pageEl = await renderPageForExport(activePage);
    const canvas = await captureCanvas(pageEl);
    clearExportStage();
    await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        downloadBlob(blob, `${buildExportFilenameBase()}_Page${activePage}.png`);
        resolve();
      }, "image/png");
    });
    setExportStatus("Image downloaded.");
  } catch (err) {
    console.error(err);
    setExportStatus("Something went wrong generating the image. Please try again.");
  } finally {
    clearExportStage();
    isExporting = false;
    $("#btn-download-png").disabled = false;
    setTimeout(() => setExportStatus(""), 4000);
  }
}

async function handleDownloadAllPagesPng() {
  if (isExporting) return;
  isExporting = true;
  $("#btn-download-png-all").disabled = true;
  try {
    for (let n = 1; n <= 5; n++) {
      setExportStatus(`Preparing page ${n} of 5 as an image…`);
      const pageEl = await renderPageForExport(n);
      const canvas = await captureCanvas(pageEl);
      clearExportStage();
      await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          downloadBlob(blob, `${buildExportFilenameBase()}_Page${n}.png`);
          resolve();
        }, "image/png");
      });
      await new Promise((r) => setTimeout(r, 250));
    }
    setExportStatus("All five page images downloaded.");
  } catch (err) {
    console.error(err);
    setExportStatus("Something went wrong generating the images. Please try again.");
  } finally {
    clearExportStage();
    isExporting = false;
    $("#btn-download-png-all").disabled = false;
    setTimeout(() => setExportStatus(""), 4000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("#btn-download-pdf").addEventListener("click", handleDownloadPdf);
  $("#btn-download-png").addEventListener("click", handleDownloadCurrentPagePng);
  $("#btn-download-png-all").addEventListener("click", handleDownloadAllPagesPng);
});
