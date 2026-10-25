import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("the inbox plus action composes a message and protects contact identity", () => {
  const dialog = readFileSync(
    new URL(
      "../app/(workspace)/visuals/inbox/_components/new-conversation-dialog.tsx",
      import.meta.url
    ),
    "utf8"
  );
  const page = readFileSync(
    new URL("../app/(workspace)/visuals/inbox/page.tsx", import.meta.url),
    "utf8"
  );
  const details = readFileSync(
    new URL(
      "../app/(workspace)/visuals/inbox/_components/contact-details.tsx",
      import.meta.url
    ),
    "utf8"
  );

  assert.match(dialog, /New message/);
  assert.match(dialog, /Send message/);
  assert.match(dialog, /message\.trim\(\)/);
  assert.match(page, /"instagram", "messenger"/);
  assert.match(page, /sendMutation\.mutate/);
  assert.match(details, /label='Contact'[\s\S]{0,220}disabled/);
  assert.doesNotMatch(details, /customerHandle: handle/);
});
