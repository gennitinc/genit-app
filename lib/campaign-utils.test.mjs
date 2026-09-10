import assert from "node:assert/strict";
import {
  campaignLeadSummary,
  campaignPipeline,
  parseLeadList,
} from "./campaign-utils.ts";

const leads = parseLeadList(
  "ADA@EXAMPLE.COM, Ada Lovelace, Analytical Engines, CTO\ninvalid\nada@example.com, Duplicate"
);
assert.equal(leads.length, 1);
assert.equal(leads[0].email, "ada@example.com");

assert.equal(
  campaignPipeline([
    { conversions: [{ value: 120 }, { value: 80 }] },
    { conversions: [{ value: 50 }] },
  ]),
  250
);

assert.deepEqual(
  campaignLeadSummary([
    { emailStatus: "valid", status: "contacted" },
    { emailStatus: "unknown", status: "qualified" },
  ]),
  { total: 2, verified: 1, contacted: 1, engaged: 1 }
);

console.log("campaign utilities: ok");
