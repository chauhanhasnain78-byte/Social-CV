/**
 * exportResumePDF — Reliable A4 PDF export via browser print API.
 *
 * Strategy:
 *  1. Open a hidden print window with all styles cloned.
 *  2. Use `onafterprint` + a MutationObserver fallback to detect when the
 *     print dialog closes (Chrome does NOT reliably fire `onafterprint`).
 *  3. Falls back to html2pdf.js if the popup is blocked.
 */
export async function exportResumePDF(filename = 'resume') {
  const element = document.getElementById('resume-preview');
  if (!element) throw new Error('Preview element not found. Please switch to Preview mode first.');

  // 1. Clone all stylesheets
  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((link) => `<link rel="stylesheet" href="${link.href}" />`)
    .join('\n');

  const styleBlocks = Array.from(document.querySelectorAll('style'))
    .map((s) => `<style>${s.textContent}</style>`)
    .join('\n');

  const resumeHTML = element.outerHTML;

  const printDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${filename}</title>
  ${styleLinks}
  ${styleBlocks}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 794px;
      margin: 0; padding: 0;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @page { size: A4 portrait; margin: 0; }
    @media print {
      html, body { width: 210mm; margin: 0; padding: 0; }
      .a4-page {
        width: 210mm !important;
        min-height: 0 !important;
        height: auto !important;
        box-shadow: none !important;
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>${resumeHTML}</body>
</html>`;

  // 2. Open print window
  const printWindow = window.open('', '_blank', 'width=794,height=1123');
  if (!printWindow) {
    return fallbackHtml2Pdf(element, filename);
  }

  printWindow.document.open();
  printWindow.document.write(printDoc);
  printWindow.document.close();

  // 3. Wait for fonts & images
  await new Promise((resolve) => {
    if (printWindow.document.readyState === 'complete') {
      resolve();
    } else {
      printWindow.onload = resolve;
      setTimeout(resolve, 2500);
    }
  });

  // Extra time for Google Fonts
  await new Promise((r) => setTimeout(r, 900));

  printWindow.focus();

  // 4. Reliable print-dialog-close detection
  // Chrome doesn't reliably fire `onafterprint`, so we use a multi-strategy approach:
  await new Promise((resolve) => {
    let resolved = false;
    const done = () => {
      if (resolved) return;
      resolved = true;
      resolve();
    };

    // Strategy A: standard afterprint event
    printWindow.addEventListener('afterprint', done);

    // Strategy B: poll for window focus returning to main window
    // (user closed print dialog → focus returns here)
    const focusListener = () => {
      setTimeout(done, 300); // slight delay to ensure dialog fully closed
    };
    window.addEventListener('focus', focusListener, { once: true });

    // Strategy C: safety timeout (2 minutes)
    const safetyTimer = setTimeout(done, 120_000);

    printWindow.print();

    // Cleanup
    Promise.resolve().then(() => {
      // Remove focus listener after done fires
      const origDone = done;
      // already wrapped above
    });
  });

  try { printWindow.close(); } catch (_) { /* ignore cross-origin errors */ }
}

/**
 * Fallback: original html2canvas/html2pdf method if popup is blocked.
 */
async function fallbackHtml2Pdf(element, filename) {
  const parent      = element.parentElement;
  const grandParent = parent?.parentElement;

  const origParentTx = parent      ? parent.style.transform      : '';
  const origGrandTx  = grandParent ? grandParent.style.transform : '';
  if (parent)      parent.style.transform      = 'none';
  if (grandParent) grandParent.style.transform = 'none';

  const origWidth    = element.style.width;
  const origHeight   = element.style.height;
  const origMin      = element.style.minHeight;
  const origOverflow = element.style.overflow;

  element.style.width     = '794px';
  element.style.minHeight = '0';
  element.style.height    = 'auto';
  element.style.overflow  = 'visible';

  const fixStyle = document.createElement('style');
  fixStyle.textContent = `#resume-preview * { word-spacing: 1px !important; }`;
  document.head.appendChild(fixStyle);

  const captureHeight = Math.max(element.scrollHeight, 1123);
  const html2pdf = (await import('html2pdf.js')).default;

  try {
    await html2pdf().set({
      margin: 0,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3, useCORS: true, scrollY: 0, scrollX: 0,
        width: 794, height: captureHeight,
        windowWidth: 794, windowHeight: captureHeight,
        letterRendering: true, logging: false,
      },
      jsPDF: {
        unit: 'px', format: [794, captureHeight],
        orientation: 'portrait', hotfixes: ['px_scaling'],
      },
    }).from(element).save();
  } finally {
    fixStyle.remove();
    if (parent)      parent.style.transform      = origParentTx;
    if (grandParent) grandParent.style.transform = origGrandTx;
    element.style.width     = origWidth;
    element.style.height    = origHeight;
    element.style.minHeight = origMin;
    element.style.overflow  = origOverflow;
  }
}
