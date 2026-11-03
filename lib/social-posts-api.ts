import type { IntegrationPlatform } from "./integrations-api";
import { apiResponse } from "@/utils/apiResponse";

export const POST_PLATFORMS: IntegrationPlatform[] = [
  "facebook",
  "instagram",
  "linkedin",
  "x",
  "tiktok",
  "youtube",
  "pinterest",
];

export type SocialPostStatus = "draft" | "scheduled" | "published" | "failed";

export function scheduledPostIso(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : undefined;
}

export function scheduledPostLocalValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}
export interface SocialPostMetrics {
  impressions: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}
export interface SocialPost {
  _id: string;
  integration?: string;
  project?: string;
  platform: IntegrationPlatform;
  accountName?: string;
  title?: string;
  content: string;
  mediaUrl?: string;
  media?: SocialPostMedia[];
  metadata?: Record<string, any>;
  permalink?: string;
  externalId?: string;
  source: "visuals" | "chat" | "integration";
  status: SocialPostStatus;
  scheduledFor?: string;
  publishedAt?: string;
  metrics: SocialPostMetrics;
  createdAt: string;
  updatedAt: string;
}

export type SocialPostMedia = {
  url: string;
  mimeType?: string;
};

export type SocialPostInput = Pick<SocialPost, "platform" | "content"> &
  Partial<
    Pick<SocialPost, "title" | "mediaUrl" | "media" | "status" | "scheduledFor">
  > & { integrationId?: string; metadata?: Record<string, any> };

export type SocialPostTarget = {
  platform: IntegrationPlatform;
  integrationId?: string;
  metadata?: Record<string, unknown>;
};

export type SocialPostConnectionOptions = {
  platform: IntegrationPlatform;
  targets: Array<{ id: string; name: string; description?: string }>;
  privacyLevels: Array<{ value: string; label: string }>;
};

export type MultiSocialPostInput = Omit<
  SocialPostInput,
  "platform" | "integrationId"
> & {
  targets: SocialPostTarget[];
};

export type SocialPostTextInput = {
  mode: "generate" | "analyze" | "enhance";
  field?: "title" | "content";
  title?: string;
  content?: string;
  platforms?: IntegrationPlatform[];
  media?: SocialPostMedia[];
};

export type SocialPostsPage = {
  posts: SocialPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export type SocialPostStats = {
  drafted: number;
  activeProjects: number;
  engagement: number;
  activity: Array<{
    date: string;
    drafted: number;
    published: number;
    projects: number;
    engagement: number;
  }>;
};

export async function getSocialPostStats(input: {
  from: string;
  to: string;
  timeZone: string;
}): Promise<SocialPostStats> {
  const params = new URLSearchParams(input);
  const { data } = await apiResponse.get<{ stats: SocialPostStats }>(
    `/social-posts/stats?${params}`,
    { timeout: 15_000 }
  );
  return data.stats;
}

export async function listSocialPostsPage({
  page = 1,
  limit = 50,
  campaignId,
}: {
  page?: number;
  limit?: number;
  campaignId?: string;
} = {}): Promise<SocialPostsPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(campaignId ? { campaignId } : {}),
  });
  const { data } = await apiResponse.get<SocialPostsPage>(
    `/social-posts?${params}`,
    { timeout: 15_000 }
  );
  return data;
}

export async function listSocialPosts(): Promise<SocialPost[]> {
  const { data } = await apiResponse.get<{ posts: SocialPost[] }>(
    "/social-posts",
    { timeout: 15_000 }
  );
  return data.posts;
}
export async function getSocialPostConnectionOptions(
  integrationId: string
): Promise<SocialPostConnectionOptions> {
  const { data } = await apiResponse.get<{
    options: SocialPostConnectionOptions;
  }>(`/social-posts/connections/${integrationId}/options`);
  return data.options;
}

// --- Connected-account post lifecycle ----------------------------------------
// The server resolves each connection's platform adapter; the client only
// reads `capabilities` to decide which actions to offer.

export type SocialCapability =
  | "listPosts"
  | "updatePost"
  | "deletePost"
  | "listComments"
  | "createComment"
  | "replyToComment"
  | "analytics";

export interface SocialConnection {
  _id: string;
  platform: IntegrationPlatform;
  accountName: string;
  accountAvatar?: string;
  accountId: string;
  provider: "managed" | "native";
  capabilities: SocialCapability[];
  updatedAt?: string;
}

export interface SocialComment {
  id: string;
  text: string;
  authorName?: string;
  authorAvatar?: string;
  createdAt?: string;
  likeCount?: number;
  replyCount?: number;
  replies?: SocialComment[];
}

function connectionPostPath(integrationId: string, postId: string) {
  return `/social-posts/connections/${integrationId}/posts/${encodeURIComponent(postId)}`;
}

export async function listSocialConnections(): Promise<SocialConnection[]> {
  const { data } = await apiResponse.get<{ connections: SocialConnection[] }>(
    "/social-posts/connections",
    { timeout: 15_000 }
  );
  return data.connections;
}

export async function updateConnectionPost(
  integrationId: string,
  postId: string,
  update: { content?: string; title?: string }
) {
  await apiResponse.patch(connectionPostPath(integrationId, postId), update);
}

export async function deleteConnectionPost(
  integrationId: string,
  postId: string
) {
  await apiResponse.delete(connectionPostPath(integrationId, postId));
}

export async function listPostComments(
  integrationId: string,
  postId: string
): Promise<{
  comments: SocialComment[];
  canComment: boolean;
  canReply: boolean;
}> {
  const { data } = await apiResponse.get<{
    comments: SocialComment[];
    canComment: boolean;
    canReply: boolean;
  }>(`${connectionPostPath(integrationId, postId)}/comments`, {
    timeout: 30_000,
  });
  return data;
}

export async function createPostComment(
  integrationId: string,
  postId: string,
  text: string
) {
  await apiResponse.post(
    `${connectionPostPath(integrationId, postId)}/comments`,
    { text },
    { timeout: 30_000 }
  );
}

export async function replyToPostComment(
  integrationId: string,
  postId: string,
  commentId: string,
  text: string
) {
  await apiResponse.post(
    `${connectionPostPath(integrationId, postId)}/comments/${encodeURIComponent(commentId)}/replies`,
    { text },
    { timeout: 30_000 }
  );
}

export async function fetchConnectionPostAnalytics(
  integrationId: string,
  postId: string
): Promise<SocialPostMetrics> {
  const { data } = await apiResponse.get<{ metrics: SocialPostMetrics }>(
    `${connectionPostPath(integrationId, postId)}/analytics`,
    { timeout: 30_000 }
  );
  return data.metrics;
}

export async function listRemoteSocialPosts(
  integrationId: string,
  limit = 50
): Promise<SocialPost[]> {
  const { data } = await apiResponse.get<{ posts: SocialPost[] }>(
    `/social-posts/connections/${integrationId}/posts?limit=${limit}`,
    { timeout: 30_000 }
  );
  return data.posts;
}
export async function createSocialPost(
  input: SocialPostInput
): Promise<SocialPost> {
  const { data } = await apiResponse.post<{ post: SocialPost }>(
    "/social-posts",
    input,
    { timeout: 20_000 }
  );
  return data.post;
}
export async function createSocialPosts(
  input: MultiSocialPostInput
): Promise<SocialPost[]> {
  const { data } = await apiResponse.post<{ posts: SocialPost[] }>(
    "/social-posts",
    input,
    { timeout: 20_000 }
  );
  return data.posts;
}
export async function updateSocialPost(
  id: string,
  input: Partial<SocialPostInput>
): Promise<SocialPost> {
  const { data } = await apiResponse.patch<{ post: SocialPost }>(
    `/social-posts/${id}`,
    input,
    { timeout: 20_000 }
  );
  return data.post;
}
export async function updateSocialPosts(
  id: string,
  input: Partial<MultiSocialPostInput>
): Promise<SocialPost[]> {
  const { data } = await apiResponse.patch<{
    post: SocialPost;
    posts?: SocialPost[];
  }>(`/social-posts/${id}`, input, { timeout: 20_000 });
  return data.posts || [data.post];
}
export async function publishSocialPosts(ids: string[]): Promise<SocialPost[]> {
  const { data } = await apiResponse.post<{ posts: SocialPost[] }>(
    "/social-posts/publish",
    { ids },
    { timeout: 120_000 }
  );
  return data.posts;
}
export async function deleteSocialPost(id: string): Promise<void> {
  await apiResponse.delete(`/social-posts/${id}`, { timeout: 20_000 });
}
export async function generateSocialPostText(
  input: SocialPostTextInput
): Promise<{ text: string; cost: number }> {
  const { data } = await apiResponse.post<{ text: string; cost: number }>(
    "/social-posts/ai-text",
    input,
    { timeout: 30_000 }
  );
  return data;
}
