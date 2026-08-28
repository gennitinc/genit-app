const HTML_PATTERN =
  /<\s*(?:!doctype|html|head|body|table|div|p|br|img|a|h[1-6]|span|strong|em|ul|ol|li|section|article|center|font)\b/i;

function decodeNumericEntity(entity: string, code: string) {
  const point = Number.parseInt(code.replace(/^x/i, ""), /^x/i.test(code) ? 16 : 10);
  return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
}

export function isInboxEmailHtml(value: string) {
  return HTML_PATTERN.test(value);
}

export function inboxEmailPreview(value: string) {
  if (!isInboxEmailHtml(value)) return value;
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#(x[\da-f]+|\d+);/gi, decodeNumericEntity)
    .replace(/\s+/g, " ")
    .trim();
}
