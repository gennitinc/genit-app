import type { IntegrationPlatform } from "./integrations-api";
import { apiResponse } from "@/utils/apiResponse";

export type SocialPostStatus = "draft" | "scheduled" | "published" | "failed";
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

export async function listSocialPosts(): Promise<SocialPost[]> {
  const { data } = await apiResponse.get<{ posts: SocialPost[] }>(
    "/social-posts",
    { timeout: 15_000 }
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
