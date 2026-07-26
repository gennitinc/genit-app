export function isOutlookQuoteHeader(text: string) {
  const value = text.toLowerCase();
  return ["from:", "sent:", "to:", "subject:"].every((label) =>
    value.includes(label)
  );
}

export function findQuotedTextStart(text: string) {
  const markers = [
    /(?:^|\n)\s*On .+ wrote:\s*(?:\n|$)/i,
    /(?:^|\n)\s*>/,
    /(?:^|\n)\s*-{2,}\s*(?:Original|Forwarded) Message\s*-{2,}/i,
  ];
  const indexes = markers
    .map((marker) => marker.exec(text)?.index)
    .filter((index): index is number => index !== undefined);
  const lines = text.split("\n");
  const outlookLine = lines.findIndex((line, index) => {
    if (!/^\s*From:/i.test(line)) return false;
    return isOutlookQuoteHeader(lines.slice(index, index + 8).join("\n"));
  });
  if (outlookLine >= 0)
    indexes.push(lines.slice(0, outlookLine).join("\n").length);
  return indexes.length ? Math.min(...indexes) : -1;
}
