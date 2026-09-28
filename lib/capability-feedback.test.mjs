import { isCapabilityUnavailable } from "./capability-feedback.ts";
import assert from "node:assert/strict";

assert.equal(
  isCapabilityUnavailable("genit_feature_missing"),
  true
);
assert.equal(isCapabilityUnavailable("provider_action_unavailable"), false);
assert.equal(isCapabilityUnavailable("provider_plan_required"), false);

console.log("capability feedback tests passed");
