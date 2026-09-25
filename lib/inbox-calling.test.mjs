import { supportsInboxCalling } from "./inbox-calling.ts";
import assert from "node:assert/strict";

assert.equal(supportsInboxCalling("whatsapp"), true);
assert.equal(supportsInboxCalling("WhatsApp"), true);
assert.equal(supportsInboxCalling("gmail"), false);
assert.equal(supportsInboxCalling("outlook"), false);

console.log("inbox calling tests passed");
