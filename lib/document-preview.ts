const OFFICE_FORMATS = new Set(["docx", "xlsx", "pptx"]);

export const getDocumentPreviewUrl = ({
  format,
  fileUrl,
  fallbackUrl,
}: {
  format?: string;
  fileUrl: string;
  fallbackUrl: string;
}) => {
  const normalizedFormat = format?.toLowerCase();

  if (normalizedFormat === "pdf" && fileUrl) return fileUrl;

  if (OFFICE_FORMATS.has(normalizedFormat || "") && fileUrl.startsWith("https://")) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
  }

  return fallbackUrl || fileUrl;
};
