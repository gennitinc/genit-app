import { formatElicitationQuestion } from "./format-elicitation-question.mjs";
import assert from "node:assert/strict";
import test from "node:test";

test("formats inline numbered and categorized questions as readable Markdown", () => {
  const input =
    "Before I build it, send: (1) brand/product and key benefit, (2) target audience and preferred UGC creator style, and (3) one model from each list: Image—Gpt-image-2 or Nano Banana Pro; Video—Veo 3.1, Kling v3, or Seedance 1.5 Pro; Audio—Eleven Flash or Eleven Labs v3. Also confirm vertical 9:16 videos.";

  assert.equal(
    formatElicitationQuestion(input),
    `Before I build it, send:\n\n1. brand/product and key benefit\n2. target audience and preferred UGC creator style\n3. one model from each list:\n   - **Image:** Gpt-image-2 or Nano Banana Pro\n   - **Video:** Veo 3.1, Kling v3, or Seedance 1.5 Pro\n   - **Audio:** Eleven Flash or Eleven Labs v3.\n\nAlso confirm vertical 9:16 videos.`
  );
});

test("preserves Markdown that is already laid out", () => {
  const input = "Choose one:\n\n1. **Image**\n2. **Video**";
  assert.equal(formatElicitationQuestion(input), input);
});
