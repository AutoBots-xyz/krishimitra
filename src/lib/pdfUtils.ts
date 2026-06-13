import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Captures an HTML element and downloads it as a PDF
 * @param elementId The ID of the HTML element to capture
 * @param filename The name of the downloaded PDF file (without .pdf)
 */
export const downloadAsPDF = async (elementId: string, filename: string = "report"): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  // Add a temporary class to ensure it's rendered cleanly for the PDF
  const originalStyle = element.style.cssText;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate PDF dimensions (A4 size)
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    // Restore original style if any modifications were made
    element.style.cssText = originalStyle;
  }
};
