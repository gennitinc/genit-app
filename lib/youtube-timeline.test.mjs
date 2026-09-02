import { createYoutubeTimeline } from "./youtube-timeline.ts";
import assert from "node:assert/strict";
import test from "node:test";

test("places scenes sequentially and gives invalid durations a safe minimum", () => {
  const timeline = createYoutubeTimeline([
    { number: 1, durationSeconds: 8 },
    { number: 2, durationSeconds: 0 },
    { number: 3, durationSeconds: 12 },
  ]);

  assert.deepEqual(
    timeline.map(({ start, end }) => [start, end]),
    [
      [0, 8],
      [8, 9],
      [9, 21],
    ]
  );
});
