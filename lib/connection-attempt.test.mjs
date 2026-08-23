import { beginConnectionAttempt } from "./connection-attempt.ts";
import assert from "node:assert/strict";
import test from "node:test";

test("a newer connection attempt invalidates every older attempt", () => {
  const ref = { current: 0 };
  const firstIsCurrent = beginConnectionAttempt(ref);
  assert.equal(firstIsCurrent(), true);

  const secondIsCurrent = beginConnectionAttempt(ref);
  assert.equal(firstIsCurrent(), false);
  assert.equal(secondIsCurrent(), true);

  ref.current += 1;
  assert.equal(secondIsCurrent(), false);
});
