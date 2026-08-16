/**
 * exportResumePDF - Uses a hidden print window instead of html2canvas.
 *
 * html2canvas has known bugs with:
 *  - Monospace/custom fonts (word merging)
 *  - em-based letter-spacing (characters overlap)
 *  - Word spacing (words run together)
 *
 * The browser's native print engine renders HTML perfectly — same as what
 * the user sees on screen — so we open a hidden window with the exact HTML
 * and trigger print as PDF.
 */
export async function exportResumePDF(filename = 'resume') {
  const element = document.getElementById('resume-preview');
  if (!element) throw new Error('Preview element not found');

  // 1. Collect all stylesheets from the current page
  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((link) => `<link rel="stylesheet" href="${link.href}" />`)
    .join('\n');

  const styleBlocks = Array.from(document.querySelectorAll('style'))
    .map((s) => `<style>${s.textContent}</style>`)
    .join('\n');

  // 2. Get the inner HTML of the resume element (preserves all classes & inline styles)
  const resumeHTML = element.outerHTML;

  // 3. Build a complete HTML document for printing
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
      margin: 0;
      padding: 0;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @page {
      size: A4 portrait;
      margin: 0;
    }

    @media print {
      html, body {
        width: 210mm;
        margin: 0;
        padding: 0;
      }
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
<body>
  ${resumeHTML}
</body>
</html>`;

  // 4. Open a hidden popup window, write the doc, and print
  const printWindow = window.open('', '_blank', 'width=794,height=1123');
  if (!printWindow) {
    // Popup was blocked — fall back to old html2pdf method
    return fallbackHtml2Pdf(element, filename);
  }

  printWindow.document.open();
  printWindow.document.write(printDoc);
  printWindow.document.close();

  // Wait for fonts & images to load before printing
  await new Promise((resolve) => {
    printWindow.onload = resolve;
    // Safety timeout in case onload doesn't fire
    setTimeout(resolve, 2000);
  });

  // Extra wait for Google Fonts
  await new Promise((r) => setTimeout(r, 800));

  printWindow.focus();
  printWindow.print();

  // Close the print window after a short delay
  setTimeout(() => printWindow.close(), 1000);
}

/**
 * Fallback: original html2canvas method if popup is blocked
 */
async function fallbackHtml2Pdf(element, filename) {
  const parent = element.parentElement;
  const grandParent = parent?.parentElement;
  const origParentTx = parent ? parent.style.transform : '';
  const origGrandTx = grandParent ? grandParent.style.transform : '';
  if (parent) parent.style.transform = 'none';
  if (grandParent) grandParent.style.transform = 'none';

  const origWidth = element.style.width;
  const origHeight = element.style.height;
  const origMin = element.style.minHeight;
  const origOverflow = element.style.overflow;
  element.style.width = '794px';
  element.style.minHeight = '0';
  element.style.height = 'auto';
  element.style.overflow = 'visible';

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
      }
    }).from(element).save();
  } finally {
    fixStyle.remove();
    if (parent) parent.style.transform = origParentTx;
    if (grandParent) grandParent.style.transform = origGrandTx;
    element.style.width = origWidth;
    element.style.height = origHeight;
    element.style.minHeight = origMin;
    element.style.overflow = origOverflow;
  }
}
