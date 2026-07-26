import {
  findQuotedTextStart,
  isOutlookQuoteHeader,
} from "./email-quoted-content.ts";
import assert from "node:assert/strict";

const gmail = "New reply\n\nOn Mon, Jul 20, 2026, Alex wrote:\n> Old reply";
const outlook =
  "New reply\n\nFrom: Alex <alex@example.com>\nSent: Monday\nTo: Sam\nSubject: Re: Test\n\nOld reply";

assert.equal(gmail.slice(0, findQuotedTextStart(gmail)).trim(), "New reply");
assert.equal(
  outlook.slice(0, findQuotedTextStart(outlook)).trim(),
  "New reply"
);
assert.equal(
  isOutlookQuoteHeader("From: Alex\nSent: Monday\nTo: Sam\nSubject: Test"),
  true
);
