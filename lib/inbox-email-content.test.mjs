import {
  inboxEmailPreview,
  isInboxEmailHtml,
} from "./inbox-email-content.ts";
import assert from "node:assert/strict";

const raw =
  '<!doctype html><html><head><style>.x{width:900px}</style></head><body><h1>Receipt</h1><p>Total: &#8358;500 &amp; paid</p></body></html>';
assert.equal(isInboxEmailHtml(raw), true);
assert.equal(inboxEmailPreview(raw), "Receipt Total: ₦500 & paid");
assert.equal(inboxEmailPreview("Already clean"), "Already clean");
assert.equal(inboxEmailPreview("<strong>Paid&#x20;now</strong>"), "Paid now");
