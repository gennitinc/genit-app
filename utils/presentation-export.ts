import { PresentationProject, Slide } from "@/types/presentation-schema";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";

// Export to PowerPoint (PPTX)
export async function exportToPPTX(
  presentation: PresentationProject,
  slides: Slide[]
): Promise<void> {
  const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.author = "Gennit";
  pptx.company = "Gennit";
  pptx.title = presentation.title;
  pptx.layout = "LAYOUT_WIDE";

  // Add slides
  slides.forEach((slide, index) => {
    const slideObj = pptx.addSlide();

    // Set background
    if (slide.background?.color) {
      slideObj.background = { color: slide.background.color };
    }

    // Add title
    if (slide.title) {
      slideObj.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: 36,
        bold: true,
        color: "363636",
      });
    }

    // Add blocks
    slide.blocks.forEach((block) => {
      const content =
        typeof block.content === "string"
          ? block.content
          : extractTextFromRichContent(block.content);

      if (block.type === "heading") {
        slideObj.addText(content, {
          x: block.position.x,
          y: block.position.y,
          w: block.position.width,
          h: block.position.height,
          fontSize:
            typeof block.style?.fontSize === "number"
              ? block.style.fontSize
              : typeof block.style?.fontSize === "string"
                ? Number.parseFloat(block.style.fontSize) || 24
                : 24,
          bold: true,
          color: block.style?.color || "363636",
        });
      } else if (block.type === "text") {
        slideObj.addText(content, {
          x: block.position.x,
          y: block.position.y,
          w: block.position.width,
          h: block.position.height,
          fontSize:
            typeof block.style?.fontSize === "number"
              ? block.style.fontSize
              : typeof block.style?.fontSize === "string"
                ? Number.parseFloat(block.style.fontSize) || 14
                : 14,
          color: block.style?.color || "363636",
        });
      } else if (block.type === "list") {
        const items = content.split("\n").filter((item) => item.trim());
        // Convert HTML list items to plain text and create TextProps array
        const textProps = items.map((item) => {
          // Remove HTML tags and bullet markers
          const cleanText = item
            .replace(/<[^>]*>/g, "")
            .replace(/^[-•]\s*/, "")
            .trim();
          return { text: cleanText };
        });
        // Use type assertion since pptxgenjs accepts TextProps[] but types are strict
        slideObj.addText(textProps as any, {
          x: block.position.x,
          y: block.position.y,
          w: block.position.width,
          h: block.position.height,
          bullet: true,
          fontSize:
            typeof block.style?.fontSize === "number"
              ? block.style.fontSize
              : typeof block.style?.fontSize === "string"
                ? Number.parseFloat(block.style.fontSize) || 14
                : 14,
          color: block.style?.color || "363636",
        });
      }
    });
  });

  // Save the presentation
  await pptx.writeFile({ fileName: `${presentation.title}.pptx` });
}

// Export to PDF
export async function exportToPDF(
  presentation: PresentationProject,
  slides: Slide[],
  containerRef: HTMLElement | null
): Promise<void> {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [1920 / 10, 1080 / 10], // 16:9 aspect ratio
  });

  // For each slide, convert to image and add to PDF
  for (let i = 0; i < slides.length; i++) {
    if (!containerRef) {
      // Fallback: create a temporary element
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "1920px";
      tempDiv.style.height = "1080px";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.backgroundColor = slides[i].background?.color || "#ffffff";
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: slides[i].background?.color || "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 1920 / 10;
      const imgHeight = 1080 / 10;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      document.body.removeChild(tempDiv);
    } else {
      const slideElement = containerRef.querySelector(
        `[data-slide-id="${slides[i].id}"]`
      ) as HTMLElement;

      if (slideElement) {
        const canvas = await html2canvas(slideElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: slides[i].background?.color || "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 1920 / 10; // Convert to mm
        const imgHeight = 1080 / 10;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }
    }
  }

  pdf.save(`${presentation.title}.pdf`);
}

// Helper function to extract text from rich content
function extractTextFromRichContent(content: any): string {
  if (typeof content === "string") {
    return content;
  }

  if (content?.type === "doc" && content?.content) {
    return content.content
      .map((node: any) => {
        if (node.type === "text") {
          return node.text || "";
        }
        if (node.content) {
          return extractTextFromRichContent(node);
        }
        return "";
      })
      .join(" ");
  }

  return "";
}
