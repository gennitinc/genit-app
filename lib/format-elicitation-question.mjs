const numberedLine = (number) => `${number === "1" ? "\n\n" : "\n"}${number}. `;

export function formatElicitationQuestion(value) {
  let text = String(value || "").trim();

  if ((text.match(/\(\d+\)\s+/g) || []).length >= 2) {
    text = text
      .replace(/,\s*(?:and\s+)?\((\d+)\)\s*/gi, (_, number) =>
        numberedLine(number)
      )
      .replace(/;\s*\((\d+)\)\s*/g, (_, number) => numberedLine(number))
      .replace(/\s+\((\d+)\)\s*/g, (_, number) => numberedLine(number));
  }

  if ((text.match(/(?:^|\s)\d+\.\s+/g) || []).length >= 2) {
    text = text
      .replace(/\s+(?=1\.\s+)/, "\n\n")
      .replace(/\s+(?=[2-9]\d*\.\s+)/g, "\n");
  }

  const categoryPattern = /([:;])\s*([A-Z][A-Za-z0-9 /&]{1,30})\s*[—–]\s*/g;
  if ([...text.matchAll(categoryPattern)].length >= 2) {
    text = text.replace(
      categoryPattern,
      (_, separator, label) =>
        `${separator === ":" ? ":" : ""}\n   - **${label.trim()}:** `
    );
  }

  return text
    .replace(/([.!?])\s+(?=(?:Also|Finally|Please)\b)/g, "$1\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
