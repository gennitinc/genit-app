import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("new posts only offer connected destinations and always show account selection", () => {
  const source = readFileSync(
    new URL(
      "../app/visuals/_components/post-editor-dialog.tsx",
      import.meta.url
    ),
    "utf8"
  );

  assert.match(source, /connectedPlatforms\.map/);
  assert.doesNotMatch(source, /POST_PLATFORMS\.map/);
  assert.match(source, /Choose a connected.*account/);
  assert.match(source, /<SelectValue placeholder='Select account'/);
});

test("visual publishing routes managed social accounts through Composio", () => {
  const source = readFileSync(
    new URL(
      "../../gennit-v1-server/src/services/social-post-service.ts",
      import.meta.url
    ),
    "utf8"
  );

  for (const tool of [
    "TWITTER_CREATION_OF_A_POST",
    "TIKTOK_PUBLISH_VIDEO",
    "YOUTUBE_MULTIPART_UPLOAD_VIDEO",
    "PINTEREST_CREATE_PIN",
  ]) {
    assert.match(source, new RegExp(tool));
  }

  const youtube = readFileSync(
    new URL(
      "../../gennit-v1-server/src/services/youtube/youtube-service.ts",
      import.meta.url
    ),
    "utf8"
  );
  assert.match(youtube, /YOUTUBE_LIST_USER_PLAYLISTS/);
});
