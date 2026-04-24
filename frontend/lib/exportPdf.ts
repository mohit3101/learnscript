import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportToPdf(
  elementId: string,
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) return

  // Temporarily expand height for full capture
  const original = {
    maxHeight: element.style.maxHeight,
    overflow:  element.style.overflow,
  }
  element.style.maxHeight = 'none'
  element.style.overflow  = 'visible'

  try {
    const canvas = await html2canvas(element, {
      scale:           2,           // Retina quality
      useCORS:         true,
      backgroundColor: '#0a0c10',
      logging:         false,
      windowWidth:     element.scrollWidth,
      windowHeight:    element.scrollHeight,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const pageW  = pdf.internal.pageSize.getWidth()
    const pageH  = pdf.internal.pageSize.getHeight()
    const margin = 10
    const imgW   = pageW - margin * 2
    const imgH   = (canvas.height * imgW) / canvas.width

    let y = margin

    // Multi-page support
    if (imgH <= pageH - margin * 2) {
      pdf.addImage(imgData, 'PNG', margin, y, imgW, imgH)
    } else {
      let remaining = imgH
      let srcY      = 0

      while (remaining > 0) {
        const sliceH = Math.min(remaining, pageH - margin * 2)
        const ratio  = canvas.height / imgH
        const sliceCanvas           = document.createElement('canvas')
        sliceCanvas.width           = canvas.width
        sliceCanvas.height          = sliceH * ratio

        const ctx = sliceCanvas.getContext('2d')!
        ctx.drawImage(canvas, 0, srcY * ratio, canvas.width, sliceH * ratio, 0, 0, canvas.width, sliceH * ratio)

        const sliceData = sliceCanvas.toDataURL('image/png')
        pdf.addImage(sliceData, 'PNG', margin, margin, imgW, sliceH)

        remaining -= sliceH
        srcY      += sliceH

        if (remaining > 0) pdf.addPage()
      }
    }

    pdf.save(filename)
  } finally {
    element.style.maxHeight = original.maxHeight
    element.style.overflow  = original.overflow
  }
}
