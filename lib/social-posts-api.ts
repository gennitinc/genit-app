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

export type SocialPostInput = Pick<SocialPost, "platform" | "content"> &
  Partial<
    Pick<SocialPost, "title" | "mediaUrl" | "status" | "scheduledFor">
  > & { integrationId?: string };

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
export async function deleteSocialPost(id: string): Promise<void> {
  await apiResponse.delete(`/social-posts/${id}`, { timeout: 20_000 });
}
