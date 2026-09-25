import { isCapabilityUnavailable } from "./capability-feedback.ts";
import assert from "node:assert/strict";

assert.equal(
  isCapabilityUnavailable(
    "facebook currently exposes no event triggers. I cannot create a background listener."
  ),
  true
);
assert.equal(isCapabilityUnavailable("The provider timed out."), false);

console.log("capability feedback tests passed");
