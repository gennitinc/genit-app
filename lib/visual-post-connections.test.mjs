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
  assert.match(source, /getSocialPostConnectionOptions/);
  assert.match(source, /providerTargetIds/);
});

test("visual posts load remote content for Composio connections", () => {
  const source = readFileSync(
    new URL("../app/visuals/posts/page.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /listRemoteSocialPosts/);
  assert.match(source, /const liveConnections = connected/);
  assert.doesNotMatch(
    source,
    /connected\.filter\(\(item\) => !managedConnectionIds\.has\(item\._id\)\)/
  );

  const integrations = readFileSync(
    new URL("../lib/integrations-api.ts", import.meta.url),
    "utf8"
  );
  assert.match(integrations, /metadata\?\.toolkitSlug/);
  assert.match(integrations, /configuredPlatform === "twitter" \? "x"/);
  assert.match(integrations, /provider: "composio"/);
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
  for (const tool of [
    "FACEBOOK_LIST_MANAGED_PAGES",
    "INSTAGRAM_GET_IG_USER_MEDIA",
    "LINKEDIN_GET_IMAGES",
    "LINKEDIN_GET_VIDEOS",
    "TIKTOK_LIST_VIDEOS",
    "YOUTUBE_LIST_CHANNEL_VIDEOS",
    "PINTEREST_LIST_BOARDS",
    "PINTEREST_LIST_PINS",
  ]) {
    assert.match(source, new RegExp(tool));
  }
  assert.match(source, /api\.linkedin\.com\/rest\/posts/);
  assert.match(source, /api\.linkedin\.com\/rest\/socialActions/);

  const youtube = readFileSync(
    new URL(
      "../../gennit-v1-server/src/services/youtube/youtube-service.ts",
      import.meta.url
    ),
    "utf8"
  );
  assert.match(youtube, /YOUTUBE_LIST_USER_PLAYLISTS/);
});

test("visual post schedules use the durable worker and preserve local time", () => {
  const page = readFileSync(
    new URL("../app/visuals/posts/page.tsx", import.meta.url),
    "utf8"
  );
  const dashboard = readFileSync(
    new URL(
      "../app/visuals/_components/home-command-center.tsx",
      import.meta.url
    ),
    "utf8"
  );
  const server = readFileSync(
    new URL(
      "../../gennit-v1-server/src/services/social-post-service.ts",
      import.meta.url
    ),
    "utf8"
  );
  const controller = readFileSync(
    new URL(
      "../../gennit-v1-server/src/controllers/social-posts-controller.ts",
      import.meta.url
    ),
    "utf8"
  );
  const editor = readFileSync(
    new URL(
      "../app/visuals/_components/post-editor-dialog.tsx",
      import.meta.url
    ),
    "utf8"
  );

  assert.match(page, /scheduledPostIso\(form\.scheduledFor\)/);
  assert.match(dashboard, /scheduledPostIso\(form\.scheduledFor\)/);
  assert.match(editor, /Choose a publish time in the future/);
  assert.doesNotMatch(editor, /<SelectItem value='failed'>/);
  assert.match(server, /taskType: "visual_social_post"/);
  assert.match(server, /reconcileVisualSocialPostSchedules/);
  assert.match(controller, /futureVisualSocialPostDate\(scheduledFor\)/);
});
