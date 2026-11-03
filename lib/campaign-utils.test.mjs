import {
  campaignLeadSummary,
  campaignPipeline,
  parseLeadList,
} from "./campaign-utils.ts";
import assert from "node:assert/strict";

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

const { campaignReadiness } = await import("./campaign-utils.ts");
const readiness = campaignReadiness(
  {
    plan: { funnel: [{ stage: "Awareness" }] },
    email: { steps: [] },
    outreach: { variants: [] },
    conversions: [],
  },
  2
);
assert.equal(readiness.completed, 2);
assert.equal(readiness.next.id, "outreach");
assert.equal(
  campaignReadiness(
    {
      plan: { funnel: [{}] },
      email: { steps: [{}] },
      outreach: { variants: [] },
      conversions: [{ value: 1 }],
    },
    1
  ).next,
  undefined
);
console.log("campaign readiness: ok");
