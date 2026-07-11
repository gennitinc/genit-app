import { apiResponse } from "@/utils/apiResponse";

export type IntegrationPlatform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "x"
  | "tiktok"
  | "youtube"
  | "pinterest"
  | "snapchat"
  | "threads"
  | "meta_ads"
  | "google_ads"
  | "tiktok_ads"
  | "linkedin_ads"
  | "x_ads"
  | "gmail"
  | "outlook"
  | "mailchimp"
  | "brevo"
  | "whatsapp"
  | "telegram"
  | "messenger"
  | "google_calendar"
  | "google_drive"
  | "google_meet"
  | "google_sheets"
  | "google_slides"
  | "google_docs"
  | "google_forms";

export type MetaSurface =
  "facebook" | "instagram" | "meta_ads" | "whatsapp" | "messenger";

export type ConnectionState = "active" | "expired" | "revoked" | "error";

export interface IntegrationConnection {
  _id: string;
  platform: IntegrationPlatform;
  identity?: string;
  accountId: string;
  accountName: string;
  accountAvatar?: string;
  scopes: string[];
  status: ConnectionState;
  expiresAt?: string;
  isPrimary?: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface MetaIdentitySummary {
  _id: string;
  // Which Meta product this identity authorizes. Each surface (Facebook,
  // Instagram, Meta Ads, WhatsApp) has its own identity row so connect /
  // revoke are independent.
  surface: MetaSurface;
  metaUserId: string;
  metaUserName: string;
  metaUserAvatar?: string;
  scopes: string[];
  status: ConnectionState;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListIntegrationsResponse {
  success: boolean;
  integrations: IntegrationConnection[];
  // Per-surface identities. Use this going forward.
  identities: MetaIdentitySummary[];
  // Deprecated: first identity, for backwards compat only.
  identity: MetaIdentitySummary | null;
}

const SUPPORTED_PLATFORMS: ReadonlySet<IntegrationPlatform> = new Set([
  "facebook",
  "instagram",
  "meta_ads",
  "threads",
  "whatsapp",
  "messenger",
  "gmail",
  "outlook",
  "telegram",
  "x",
  "linkedin",
  "tiktok",
  "youtube",
  "brevo",
  "pinterest",
  "snapchat",
  "google_ads",
  "tiktok_ads",
  "linkedin_ads",
  "x_ads",
  "google_calendar",
  "google_drive",
  "google_meet",
  "google_sheets",
  "google_slides",
  "google_docs",
  "google_forms",
  "mailchimp",
]);

// Platforms that connect via a credential-entry form (no OAuth popup).
const CREDENTIAL_PLATFORMS: ReadonlySet<IntegrationPlatform> = new Set([
  "telegram",
  "brevo",
  "mailchimp",
  "linkedin_ads",
  "x_ads",
]);

export function isCredentialPlatform(platform: IntegrationPlatform): boolean {
  return CREDENTIAL_PLATFORMS.has(platform);
}

export function isPlatformSupported(platform: IntegrationPlatform): boolean {
  return SUPPORTED_PLATFORMS.has(platform);
}

export function isMetaSurface(
  platform: IntegrationPlatform
): platform is MetaSurface {
  return (
    platform === "facebook" ||
    platform === "instagram" ||
    platform === "meta_ads" ||
    platform === "whatsapp" ||
    platform === "messenger"
  );
}

export async function fetchIntegrations(): Promise<{
  integrations: IntegrationConnection[];
  identities: MetaIdentitySummary[];
}> {
  const { data } =
    await apiResponse.get<ListIntegrationsResponse>("/integrations");
  return {
    integrations: data.integrations,
    identities: data.identities ?? [],
  };
}

export interface FacebookProvisionedTarget {
  integrationId: string;
  pageId: string;
  pageName: string;
}
export interface InstagramProvisionedTarget {
  integrationId: string;
  igUserId: string;
  username: string;
}
export interface MetaAdsProvisionedTarget {
  integrationId: string;
  adAccountId: string;
  name: string;
}
export interface WhatsAppProvisionedTarget {
  integrationId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  wabaId: string;
}

// One Instagram Business account discovered through the user's Pages.
// The user picks one or more of these from the connect dialog's selection
// step before any Integration row is written.
export interface InstagramCandidate {
  igAccountId: string;
  username: string;
  name?: string;
  profilePictureUrl?: string;
  parentPageId: string;
  parentPageName: string;
}

export type ConnectUrlResponse =
  | {
      success: true;
      skipOAuth: false;
      authorizeUrl: string;
    }
  | {
      success: true;
      skipOAuth: true;
      surface: MetaSurface;
      provisioned: {
        pages?: FacebookProvisionedTarget[];
        instagram?: InstagramProvisionedTarget[];
        adAccounts?: MetaAdsProvisionedTarget[];
        whatsapp?: WhatsAppProvisionedTarget[];
      };
    }
  | {
      // Instagram fast-path: identity already exists with the right scopes,
      // so OAuth is skipped, but we still hand back candidates so the user
      // can pick which IG account to provision in the dialog.
      success: true;
      skipOAuth: true;
      surface: "instagram";
      identityId: string;
      candidates: InstagramCandidate[];
    };

export async function requestConnectUrl(
  platform: IntegrationPlatform
): Promise<ConnectUrlResponse> {
  const { data } = await apiResponse.post<ConnectUrlResponse>(
    `/integrations/${platform}/connect-url`
  );
  return data;
}

export type GoogleWorkspacePlatform = Extract<
  IntegrationPlatform,
  "google_meet" | "google_sheets" | "google_slides" | "google_docs" | "google_forms"
>;

/** Calls the full Google Workspace action surface. Roles map to Google Drive:
 * reader=viewer, commenter=commenter, writer=editor, owner=owner. */
export async function runGoogleWorkspaceAction<T = unknown>(
  platform: GoogleWorkspacePlatform,
  integrationId: string,
  action: string,
  input: Record<string, unknown> = {}
): Promise<T> {
  const { data } = await apiResponse.post<{ success: true; result: T }>(
    `/integrations/${platform}/${integrationId}/actions/${action}`,
    input
  );
  return data.result;
}

// Step 2 of the Instagram connect flow: takes the IG account IDs the user
// picked in the selection UI and asks the server to provision them.
export async function provisionInstagramSelected(
  igAccountIds: string[]
): Promise<{ provisioned: InstagramProvisionedTarget[] }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    provisioned: InstagramProvisionedTarget[];
  }>("/integrations/instagram/provision", { igAccountIds });
  return { provisioned: data.provisioned };
}

export async function provisionFacebookSelected(
  pageIds: string[]
): Promise<{ provisioned: FacebookProvisionedTarget[] }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    provisioned: FacebookProvisionedTarget[];
  }>("/integrations/facebook/provision", { pageIds });
  return { provisioned: data.provisioned };
}

export async function disconnectIntegrationById(id: string): Promise<void> {
  await apiResponse.delete(`/integrations/${id}`);
}

export async function disconnectMetaIdentityById(id: string): Promise<void> {
  await apiResponse.delete(`/integrations/identity/${id}`);
}

export async function setPrimaryIntegrationById(id: string): Promise<void> {
  await apiResponse.post(`/integrations/${id}/primary`);
}

export async function updateTelegramSettings(
  id: string,
  input: { autoReplyEnabled: boolean }
): Promise<Record<string, any>> {
  const { data } = await apiResponse.patch<{
    success: boolean;
    metadata: Record<string, any>;
  }>(`/integrations/telegram/${id}/settings`, input);
  return data.metadata;
}

export async function updateIntegrationInboxSettings(
  id: string,
  input: { autoReplyEnabled: boolean }
): Promise<Record<string, any>> {
  const { data } = await apiResponse.patch<{
    success: boolean;
    metadata: Record<string, any>;
  }>(`/integrations/${id}/inbox-settings`, input);
  return data.metadata;
}

// -----------------------------------------------------------------------------
// Publishing
// -----------------------------------------------------------------------------

export type FacebookPostKind = "text" | "photo" | "video" | "link";

export interface PublishFacebookInput {
  kind: FacebookPostKind;
  message?: string;
  link?: string;
  mediaUrl?: string;
  published?: boolean;
}

export async function publishFacebookPost(
  integrationId: string,
  input: PublishFacebookInput
): Promise<{ id: string; postId?: string }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    post: { id: string; postId?: string };
  }>(`/integrations/facebook/${integrationId}/publish`, input);
  return data.post;
}

export type IgMediaKind = "IMAGE" | "VIDEO" | "REELS" | "CAROUSEL";

export interface PublishInstagramInput {
  kind: IgMediaKind;
  caption?: string;
  mediaUrl?: string;
  children?: Array<{ kind: "IMAGE" | "VIDEO"; mediaUrl: string }>;
}

export async function publishInstagramPost(
  integrationId: string,
  input: PublishInstagramInput
): Promise<{ mediaId: string; containerId: string }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    media: { mediaId: string; containerId: string };
  }>(`/integrations/instagram/${integrationId}/publish`, input);
  return data.media;
}

export interface FacebookPostSummary {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  full_picture?: string;
  is_published?: boolean;
  scheduled_publish_time?: number;
  reactions?: { summary?: { total_count?: number } };
  comments?: { summary?: { total_count?: number } };
  shares?: { count?: number };
  insights?: {
    data?: Array<{
      name?: string;
      values?: Array<{ value?: number | Record<string, number> }>;
    }>;
  };
  attachments?: {
    data?: Array<{
      media_type?: string;
      media?: { image?: { src?: string }; source?: string };
      url?: string;
      subattachments?: {
        data?: Array<{
          media_type?: string;
          media?: { image?: { src?: string }; source?: string };
          url?: string;
        }>;
      };
    }>;
  };
}
export async function listFacebookPosts(
  integrationId: string,
  limit = 25
): Promise<FacebookPostSummary[]> {
  const { data } = await apiResponse.get<{ posts: FacebookPostSummary[] }>(
    `/integrations/facebook/${integrationId}/posts?limit=${limit}`
  );
  return data.posts;
}

export async function updateFacebookPost(
  integrationId: string,
  postId: string,
  message: string
): Promise<void> {
  await apiResponse.patch(
    `/integrations/facebook/${integrationId}/posts/${encodeURIComponent(postId)}`,
    { message }
  );
}

export async function deleteFacebookPost(
  integrationId: string,
  postId: string
): Promise<void> {
  await apiResponse.delete(
    `/integrations/facebook/${integrationId}/posts/${encodeURIComponent(postId)}`
  );
}

export interface InstagramPostSummary {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  comments_count?: number;
  like_count?: number;
}
export async function listInstagramPosts(
  integrationId: string,
  limit = 25
): Promise<InstagramPostSummary[]> {
  const { data } = await apiResponse.get<{ posts: InstagramPostSummary[] }>(
    `/integrations/instagram/${integrationId}/posts?limit=${limit}`
  );
  return data.posts;
}

// -----------------------------------------------------------------------------
// Insights
// -----------------------------------------------------------------------------

export interface InsightsQuery {
  metric: string[];
  period?: string;
  since?: string;
  until?: string;
  mediaId?: string;
}

function insightsParams(q: InsightsQuery): URLSearchParams {
  const params = new URLSearchParams();
  params.set("metric", q.metric.join(","));
  if (q.period) params.set("period", q.period);
  if (q.since) params.set("since", q.since);
  if (q.until) params.set("until", q.until);
  if (q.mediaId) params.set("media_id", q.mediaId);
  return params;
}

export async function fetchFacebookInsights(
  integrationId: string,
  q: InsightsQuery
): Promise<unknown> {
  const { data } = await apiResponse.get(
    `/integrations/facebook/${integrationId}/insights?${insightsParams(q)}`
  );
  return (data as { insights: unknown }).insights;
}

export async function fetchInstagramInsights(
  integrationId: string,
  q: InsightsQuery
): Promise<unknown> {
  const { data } = await apiResponse.get(
    `/integrations/instagram/${integrationId}/insights?${insightsParams(q)}`
  );
  return (data as { insights: unknown }).insights;
}

export interface MetaAdsInsightsQuery {
  level?: "account" | "campaign" | "adset" | "ad";
  fields?: string[];
  since?: string;
  until?: string;
  datePreset?: string;
}

export async function fetchMetaAdsInsights(
  integrationId: string,
  q: MetaAdsInsightsQuery = {}
): Promise<unknown> {
  const params = new URLSearchParams();
  if (q.level) params.set("level", q.level);
  if (q.fields) params.set("fields", q.fields.join(","));
  if (q.since) params.set("since", q.since);
  if (q.until) params.set("until", q.until);
  if (q.datePreset) params.set("date_preset", q.datePreset);
  const { data } = await apiResponse.get(
    `/integrations/meta_ads/${integrationId}/insights?${params}`
  );
  return (data as { insights: unknown }).insights;
}

// -----------------------------------------------------------------------------
// Meta Ads Marketing API
// -----------------------------------------------------------------------------

export interface CampaignSummary {
  id: string;
  name: string;
  status?: string;
  objective?: string;
  effective_status?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  created_time?: string;
}

export async function listAdCampaigns(
  integrationId: string
): Promise<CampaignSummary[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    campaigns: CampaignSummary[];
  }>(`/integrations/meta_ads/${integrationId}/campaigns`);
  return data.campaigns;
}

export interface CreateCampaignInput {
  name: string;
  objective: string;
  status?: "ACTIVE" | "PAUSED";
  special_ad_categories?: string[];
}

export async function createAdCampaign(
  integrationId: string,
  input: CreateCampaignInput
): Promise<{ id: string }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    campaign: { id: string };
  }>(`/integrations/meta_ads/${integrationId}/campaigns`, input);
  return data.campaign;
}

// -----------------------------------------------------------------------------
// Threads
// -----------------------------------------------------------------------------

export type ThreadsMediaKind = "TEXT" | "IMAGE" | "VIDEO" | "CAROUSEL";

export interface PublishThreadInput {
  kind: ThreadsMediaKind;
  text?: string;
  mediaUrl?: string;
  altText?: string;
  children?: Array<{
    kind: "IMAGE" | "VIDEO";
    mediaUrl: string;
    altText?: string;
  }>;
  replyToId?: string;
}

export async function publishThreadsPost(
  integrationId: string,
  input: PublishThreadInput
): Promise<{ mediaId: string; containerId: string }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    media: { mediaId: string; containerId: string };
  }>(`/integrations/threads/${integrationId}/publish`, input);
  return data.media;
}

export async function deleteThreadsPost(
  integrationId: string,
  mediaId: string
): Promise<void> {
  await apiResponse.delete(
    `/integrations/threads/${integrationId}/posts/${mediaId}`
  );
}

export interface ThreadsPostSummary {
  id: string;
  text?: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  timestamp?: string;
  is_quote_post?: boolean;
}

export async function listThreadsPosts(
  integrationId: string,
  limit = 50
): Promise<ThreadsPostSummary[]> {
  const { data } = await apiResponse.get<{ posts: ThreadsPostSummary[] }>(
    `/integrations/threads/${integrationId}/posts?limit=${limit}`
  );
  return data.posts;
}

export interface ThreadsReply {
  id: string;
  text?: string;
  from?: { id: string; username: string };
  timestamp?: string;
  permalink?: string;
}

export async function listThreadReplies(
  integrationId: string,
  mediaId: string
): Promise<ThreadsReply[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    replies: ThreadsReply[];
  }>(`/integrations/threads/${integrationId}/posts/${mediaId}/replies`);
  return data.replies;
}

export interface ThreadsInsightsQuery {
  metric: string[];
  mediaId?: string;
}

export async function fetchThreadsInsights(
  integrationId: string,
  q: ThreadsInsightsQuery
): Promise<unknown> {
  const params = new URLSearchParams();
  params.set("metric", q.metric.join(","));
  if (q.mediaId) params.set("media_id", q.mediaId);
  const { data } = await apiResponse.get(
    `/integrations/threads/${integrationId}/insights?${params}`
  );
  return (data as { insights: unknown }).insights;
}

// -----------------------------------------------------------------------------
// WhatsApp Business — Cloud API
// -----------------------------------------------------------------------------

export type WhatsAppMessageKind =
  "text" | "template" | "image" | "video" | "audio" | "document";

export interface SendWhatsAppMessageInput {
  kind: WhatsAppMessageKind;
  to: string;
  text?: string;
  previewUrl?: boolean;
  templateName?: string;
  templateLanguage?: string;
  templateComponents?: unknown[];
  mediaUrl?: string;
  mediaCaption?: string;
  mediaFilename?: string;
}

export interface SentWhatsAppMessage {
  messagingProduct: "whatsapp";
  contactWaId?: string;
  messageId: string;
}

export async function sendWhatsAppMessage(
  integrationId: string,
  input: SendWhatsAppMessageInput
): Promise<SentWhatsAppMessage> {
  const { data } = await apiResponse.post<{
    success: boolean;
    message: SentWhatsAppMessage;
  }>(`/integrations/whatsapp/${integrationId}/send`, input);
  return data.message;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  status?: string;
  language?: string;
  category?: string;
  components?: unknown[];
  rejected_reason?: string;
}

export async function listWhatsAppTemplates(
  integrationId: string
): Promise<WhatsAppTemplate[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    templates: WhatsAppTemplate[];
  }>(`/integrations/whatsapp/${integrationId}/templates`);
  return data.templates;
}

export interface CreateWhatsAppTemplateInput {
  name: string;
  language: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  components: unknown[];
}

export async function createWhatsAppTemplate(
  integrationId: string,
  input: CreateWhatsAppTemplateInput
): Promise<{ id: string; status?: string }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    template: { id: string; status?: string };
  }>(`/integrations/whatsapp/${integrationId}/templates`, input);
  return data.template;
}

export interface WhatsAppAnalyticsQuery {
  granularity?: "HALF_HOUR" | "DAY" | "MONTH";
  start: number; // unix seconds
  end: number;
  phoneNumbers?: string[];
}

export async function fetchWhatsAppAnalytics(
  integrationId: string,
  q: WhatsAppAnalyticsQuery
): Promise<unknown> {
  const params = new URLSearchParams();
  params.set("start", String(q.start));
  params.set("end", String(q.end));
  if (q.granularity) params.set("granularity", q.granularity);
  if (q.phoneNumbers && q.phoneNumbers.length > 0) {
    params.set("phone_numbers", q.phoneNumbers.join(","));
  }
  const { data } = await apiResponse.get(
    `/integrations/whatsapp/${integrationId}/analytics?${params}`
  );
  return (data as { analytics: unknown }).analytics;
}

// -----------------------------------------------------------------------------
// Messenger
// -----------------------------------------------------------------------------

export interface SendMessengerMessageInput {
  recipientId: string;
  text: string;
}

export interface SentMessengerMessage {
  recipient_id: string;
  message_id: string;
}

export async function sendMessengerMessage(
  integrationId: string,
  input: SendMessengerMessageInput
): Promise<SentMessengerMessage> {
  const { data } = await apiResponse.post<{
    success: boolean;
    message: SentMessengerMessage;
  }>(`/integrations/messenger/${integrationId}/send`, input);
  return data.message;
}

// -----------------------------------------------------------------------------
// Gmail
// -----------------------------------------------------------------------------

export interface SendGmailInput {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  fromName?: string;
}

export async function sendGmailEmail(
  integrationId: string,
  input: SendGmailInput
): Promise<{ id: string; threadId?: string }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    message: { id: string; threadId?: string };
  }>(`/integrations/gmail/${integrationId}/send`, input);
  return data.message;
}

export interface GmailMessageRef {
  id: string;
  threadId: string;
}

export interface ListGmailMessagesQuery {
  q?: string;
  labelIds?: string[];
  maxResults?: number;
  pageToken?: string;
}

export async function listGmailMessages(
  integrationId: string,
  q: ListGmailMessagesQuery = {}
): Promise<{ messages: GmailMessageRef[]; nextPageToken?: string }> {
  const params = new URLSearchParams();
  if (q.q) params.set("q", q.q);
  if (q.labelIds?.length) params.set("labelIds", q.labelIds.join(","));
  if (q.maxResults) params.set("maxResults", String(q.maxResults));
  if (q.pageToken) params.set("pageToken", q.pageToken);
  const { data } = await apiResponse.get<{
    success: boolean;
    messages: GmailMessageRef[];
    nextPageToken?: string;
  }>(`/integrations/gmail/${integrationId}/messages?${params}`);
  return { messages: data.messages, nextPageToken: data.nextPageToken };
}

// -----------------------------------------------------------------------------
// Telegram — credential-entry, not OAuth
// -----------------------------------------------------------------------------

export interface TelegramConnectResult {
  integrationId: string;
  botId: number;
  username?: string;
  warning?: string;
}

export async function connectTelegramWithToken(
  botToken: string
): Promise<TelegramConnectResult> {
  const { data } = await apiResponse.post<{
    success: boolean;
    integrationId: string;
    botId: number;
    username?: string;
    warning?: string;
  }>(`/integrations/telegram/connect-with-token`, { botToken });
  return {
    integrationId: data.integrationId,
    botId: data.botId,
    username: data.username,
    warning: data.warning,
  };
}

export type TelegramMessageKind = "text" | "photo" | "document" | "video";

export interface SendTelegramMessageInput {
  kind: TelegramMessageKind;
  chatId: string | number;
  text?: string;
  mediaUrl?: string;
  caption?: string;
  parseMode?: "HTML" | "MarkdownV2";
  disableNotification?: boolean;
  replyToMessageId?: number;
}

export async function sendTelegramMessage(
  integrationId: string,
  input: SendTelegramMessageInput
): Promise<{ message_id: number; chat: { id: number; type: string } }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    message: { message_id: number; chat: { id: number; type: string } };
  }>(`/integrations/telegram/${integrationId}/send`, input);
  return data.message;
}

export interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export async function listTelegramChats(
  integrationId: string,
  limit = 100
): Promise<TelegramChat[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    chats: TelegramChat[];
  }>(`/integrations/telegram/${integrationId}/chats?limit=${limit}`);
  return data.chats;
}

// -----------------------------------------------------------------------------
// X (Twitter)
// -----------------------------------------------------------------------------

export interface PostTweetInput {
  text: string;
  replyToTweetId?: string;
  quoteTweetId?: string;
  mediaIds?: string[];
}

export interface PostedTweet {
  id: string;
  text: string;
}

export async function postTweet(
  integrationId: string,
  input: PostTweetInput
): Promise<PostedTweet> {
  const { data } = await apiResponse.post<{
    success: boolean;
    tweet: PostedTweet;
  }>(`/integrations/x/${integrationId}/tweet`, input);
  return data.tweet;
}

export async function deleteTweet(
  integrationId: string,
  tweetId: string
): Promise<{ deleted: boolean }> {
  const { data } = await apiResponse.delete<{
    success: boolean;
    result: { deleted: boolean };
  }>(`/integrations/x/${integrationId}/tweets/${tweetId}`);
  return data.result;
}

export interface TweetSummary {
  id: string;
  text: string;
  created_at?: string;
  author_id?: string;
  conversation_id?: string;
  in_reply_to_user_id?: string;
  attachments?: { media_keys?: string[] };
  media?: Array<{
    media_key: string;
    type: "photo" | "video" | "animated_gif";
    url?: string;
    preview_image_url?: string;
  }>;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count?: number;
  };
}

export interface ListTweetsQuery {
  maxResults?: number;
  paginationToken?: string;
}

function tweetListParams(q: ListTweetsQuery): string {
  const params = new URLSearchParams();
  if (q.maxResults) params.set("maxResults", String(q.maxResults));
  if (q.paginationToken) params.set("paginationToken", q.paginationToken);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export async function listUserTweets(
  integrationId: string,
  q: ListTweetsQuery = {}
): Promise<{ tweets: TweetSummary[]; nextToken?: string }> {
  const { data } = await apiResponse.get<{
    success: boolean;
    tweets: TweetSummary[];
    nextToken?: string;
  }>(`/integrations/x/${integrationId}/tweets${tweetListParams(q)}`);
  return { tweets: data.tweets, nextToken: data.nextToken };
}

export async function listTweetMentions(
  integrationId: string,
  q: ListTweetsQuery = {}
): Promise<{ tweets: TweetSummary[]; nextToken?: string }> {
  const { data } = await apiResponse.get<{
    success: boolean;
    tweets: TweetSummary[];
    nextToken?: string;
  }>(`/integrations/x/${integrationId}/mentions${tweetListParams(q)}`);
  return { tweets: data.tweets, nextToken: data.nextToken };
}

export async function listTweetReplies(
  integrationId: string,
  tweetId: string,
  q: ListTweetsQuery = {}
): Promise<{ tweets: TweetSummary[]; nextToken?: string }> {
  const { data } = await apiResponse.get<{
    success: boolean;
    tweets: TweetSummary[];
    nextToken?: string;
  }>(
    `/integrations/x/${integrationId}/tweets/${tweetId}/replies${tweetListParams(q)}`
  );
  return { tweets: data.tweets, nextToken: data.nextToken };
}

export async function fetchTweetMetrics(
  integrationId: string,
  tweetId: string
): Promise<TweetSummary> {
  const { data } = await apiResponse.get<{
    success: boolean;
    tweet: TweetSummary;
  }>(`/integrations/x/${integrationId}/tweets/${tweetId}/metrics`);
  return data.tweet;
}

// -----------------------------------------------------------------------------
// LinkedIn
// -----------------------------------------------------------------------------

export type LinkedInPostVisibility = "PUBLIC" | "CONNECTIONS";

export interface PostLinkedInInput {
  text: string;
  visibility?: LinkedInPostVisibility;
  link?: { url: string; title?: string; description?: string };
}

export interface PostedLinkedInPost {
  id: string;
}

export async function publishLinkedInPost(
  integrationId: string,
  input: PostLinkedInInput
): Promise<PostedLinkedInPost> {
  const { data } = await apiResponse.post<{
    success: boolean;
    post: PostedLinkedInPost;
  }>(`/integrations/linkedin/${integrationId}/post`, input);
  return data.post;
}

export interface LinkedInComment {
  id?: string;
  actor?: string;
  message?: { text: string };
  created?: { time: number; actor: string };
  likesSummary?: { totalLikes: number };
}

export async function listLinkedInPostComments(
  integrationId: string,
  postUrn: string
): Promise<LinkedInComment[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    comments: LinkedInComment[];
  }>(
    `/integrations/linkedin/${integrationId}/posts/${encodeURIComponent(postUrn)}/comments`
  );
  return data.comments;
}

export interface LinkedInPostAnalytics {
  organizationalEntity?: string;
  totalShareStatistics?: {
    uniqueImpressionsCount?: number;
    clickCount?: number;
    engagement?: number;
    shareCount?: number;
    impressionCount?: number;
    commentCount?: number;
    likeCount?: number;
  };
}

export async function fetchLinkedInPostAnalytics(
  integrationId: string,
  postUrn: string
): Promise<LinkedInPostAnalytics> {
  const { data } = await apiResponse.get<{
    success: boolean;
    analytics: LinkedInPostAnalytics;
  }>(
    `/integrations/linkedin/${integrationId}/posts/${encodeURIComponent(postUrn)}/analytics`
  );
  return data.analytics;
}

// -----------------------------------------------------------------------------
// TikTok
// -----------------------------------------------------------------------------

export type TikTokPrivacy =
  | "PUBLIC_TO_EVERYONE"
  | "MUTUAL_FOLLOW_FRIENDS"
  | "FOLLOWER_OF_CREATOR"
  | "SELF_ONLY";

export interface PostTikTokVideoInput {
  title: string;
  videoUrl: string;
  privacy?: TikTokPrivacy;
  disableComment?: boolean;
  disableDuet?: boolean;
  disableStitch?: boolean;
  coverTimestampMs?: number;
  mode?: "DIRECT_POST" | "INBOX_DRAFT";
}

export async function postTikTokVideo(
  integrationId: string,
  input: PostTikTokVideoInput
): Promise<{ publishId: string }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    publishId: string;
  }>(`/integrations/tiktok/${integrationId}/videos`, input);
  return { publishId: data.publishId };
}

export interface TikTokPublishStatus {
  status: string;
  publicaly_available_post_id?: string[];
  fail_reason?: string;
  uploaded_bytes?: number;
}

export async function fetchTikTokPublishStatus(
  integrationId: string,
  publishId: string
): Promise<TikTokPublishStatus> {
  const { data } = await apiResponse.get<{
    success: boolean;
    status: TikTokPublishStatus;
  }>(`/integrations/tiktok/${integrationId}/publish/${publishId}/status`);
  return data.status;
}

export interface TikTokVideoSummary {
  id: string;
  title?: string;
  video_description?: string;
  create_time?: number;
  cover_image_url?: string;
  share_url?: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  duration?: number;
}

export interface ListTikTokVideosQuery {
  cursor?: number;
  maxCount?: number;
}

export async function listTikTokVideos(
  integrationId: string,
  q: ListTikTokVideosQuery = {}
): Promise<{
  videos: TikTokVideoSummary[];
  cursor?: number;
  hasMore?: boolean;
}> {
  const params = new URLSearchParams();
  if (q.cursor !== undefined) params.set("cursor", String(q.cursor));
  if (q.maxCount !== undefined) params.set("maxCount", String(q.maxCount));
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    videos: TikTokVideoSummary[];
    cursor?: number;
    hasMore?: boolean;
  }>(`/integrations/tiktok/${integrationId}/videos${qs ? `?${qs}` : ""}`);
  return {
    videos: data.videos,
    cursor: data.cursor,
    hasMore: data.hasMore,
  };
}

export interface TikTokComment {
  id: string;
  text?: string;
  username?: string;
  create_time?: number;
  like_count?: number;
  reply_count?: number;
}

export async function listTikTokVideoComments(
  integrationId: string,
  videoId: string,
  q: ListTikTokVideosQuery = {}
): Promise<{
  comments: TikTokComment[];
  cursor?: number;
  hasMore?: boolean;
}> {
  const params = new URLSearchParams();
  if (q.cursor !== undefined) params.set("cursor", String(q.cursor));
  if (q.maxCount !== undefined) params.set("maxCount", String(q.maxCount));
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    comments: TikTokComment[];
    cursor?: number;
    hasMore?: boolean;
  }>(
    `/integrations/tiktok/${integrationId}/videos/${videoId}/comments${qs ? `?${qs}` : ""}`
  );
  return {
    comments: data.comments,
    cursor: data.cursor,
    hasMore: data.hasMore,
  };
}

export async function fetchTikTokVideoMetrics(
  integrationId: string,
  videoIds: string[]
): Promise<TikTokVideoSummary[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    videos: TikTokVideoSummary[];
  }>(
    `/integrations/tiktok/${integrationId}/metrics?videoIds=${encodeURIComponent(videoIds.join(","))}`
  );
  return data.videos;
}

// -----------------------------------------------------------------------------
// YouTube
// -----------------------------------------------------------------------------

export type YouTubePrivacy = "private" | "unlisted" | "public";

export interface InitYouTubeUploadInput {
  title: string;
  description?: string;
  tags?: string[];
  categoryId?: string;
  privacyStatus?: YouTubePrivacy;
  madeForKids?: boolean;
  playlistId?: string;
  playlistTitle?: string;
  contentLength: number;
  contentType?: string;
}

// Returns a resumable upload URL the client should PUT video bytes to,
// following https://developers.google.com/youtube/v3/guides/using_resumable_upload_protocol.
// The PUT response on the final chunk is the YouTube video resource.
export async function initYouTubeVideoUpload(
  integrationId: string,
  input: InitYouTubeUploadInput
): Promise<{ uploadUrl: string; expiresAt: string }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    uploadUrl: string;
    expiresAt: string;
  }>(`/integrations/youtube/${integrationId}/uploads/init`, input);
  return { uploadUrl: data.uploadUrl, expiresAt: data.expiresAt };
}

export interface YouTubeVideoSummary {
  id: string;
  snippet?: {
    title: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      default?: { url: string };
      medium?: { url: string };
    };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
    favoriteCount?: string;
  };
  status?: {
    privacyStatus?: string;
    uploadStatus?: string;
  };
}

export interface ListYouTubeVideosQuery {
  maxResults?: number;
  pageToken?: string;
}

export async function listYouTubeVideos(
  integrationId: string,
  q: ListYouTubeVideosQuery = {}
): Promise<{ videos: YouTubeVideoSummary[]; nextPageToken?: string }> {
  const params = new URLSearchParams();
  if (q.maxResults) params.set("maxResults", String(q.maxResults));
  if (q.pageToken) params.set("pageToken", q.pageToken);
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    videos: YouTubeVideoSummary[];
    nextPageToken?: string;
  }>(`/integrations/youtube/${integrationId}/videos${qs ? `?${qs}` : ""}`);
  return { videos: data.videos, nextPageToken: data.nextPageToken };
}

export interface YouTubePlaylistSummary {
  id: string;
  snippet?: {
    title: string;
    description?: string;
    publishedAt?: string;
  };
  status?: {
    privacyStatus?: YouTubePrivacy;
  };
  contentDetails?: {
    itemCount?: number;
  };
}

export async function listYouTubePlaylists(
  integrationId: string,
  q: ListYouTubeVideosQuery = {}
): Promise<{ playlists: YouTubePlaylistSummary[]; nextPageToken?: string }> {
  const params = new URLSearchParams();
  if (q.maxResults) params.set("maxResults", String(q.maxResults));
  if (q.pageToken) params.set("pageToken", q.pageToken);
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    playlists: YouTubePlaylistSummary[];
    nextPageToken?: string;
  }>(`/integrations/youtube/${integrationId}/playlists${qs ? `?${qs}` : ""}`);
  return { playlists: data.playlists, nextPageToken: data.nextPageToken };
}

export async function createYouTubePlaylist(
  integrationId: string,
  input: {
    title: string;
    description?: string;
    privacyStatus?: YouTubePrivacy;
  }
): Promise<YouTubePlaylistSummary> {
  const { data } = await apiResponse.post<{
    success: boolean;
    playlist: YouTubePlaylistSummary;
  }>(`/integrations/youtube/${integrationId}/playlists`, input);
  return data.playlist;
}

export interface YouTubeComment {
  id: string;
  snippet?: {
    topLevelComment?: {
      snippet?: {
        textDisplay?: string;
        authorDisplayName?: string;
        authorProfileImageUrl?: string;
        publishedAt?: string;
        likeCount?: number;
      };
    };
    totalReplyCount?: number;
  };
}

export async function listYouTubeVideoComments(
  integrationId: string,
  videoId: string,
  pageToken?: string
): Promise<{ comments: YouTubeComment[]; nextPageToken?: string }> {
  const qs = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : "";
  const { data } = await apiResponse.get<{
    success: boolean;
    comments: YouTubeComment[];
    nextPageToken?: string;
  }>(`/integrations/youtube/${integrationId}/videos/${videoId}/comments${qs}`);
  return { comments: data.comments, nextPageToken: data.nextPageToken };
}

export async function replyToYouTubeComment(
  integrationId: string,
  commentId: string,
  text: string
): Promise<{ id: string }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    comment: { id: string };
  }>(`/integrations/youtube/${integrationId}/comments/${commentId}/reply`, {
    text,
  });
  return data.comment;
}

export interface YouTubeAnalyticsQuery {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  metrics?: string[];
  videoId?: string;
}

export async function fetchYouTubeAnalytics(
  integrationId: string,
  q: YouTubeAnalyticsQuery
): Promise<unknown> {
  const params = new URLSearchParams({
    startDate: q.startDate,
    endDate: q.endDate,
  });
  if (q.metrics?.length) params.set("metrics", q.metrics.join(","));
  if (q.videoId) params.set("videoId", q.videoId);
  const { data } = await apiResponse.get<{
    success: boolean;
    analytics: unknown;
  }>(`/integrations/youtube/${integrationId}/analytics?${params}`);
  return data.analytics;
}

// -----------------------------------------------------------------------------
// Brevo — credential-entry (API key), transactional + contacts + analytics
// -----------------------------------------------------------------------------

export interface BrevoConnectResult {
  integrationId: string;
  email: string;
  displayName: string;
}

export async function connectBrevoWithApiKey(
  apiKey: string
): Promise<BrevoConnectResult> {
  const { data } = await apiResponse.post<{
    success: boolean;
    integrationId: string;
    email: string;
    displayName: string;
  }>(`/integrations/brevo/connect-with-api-key`, { apiKey });
  return {
    integrationId: data.integrationId,
    email: data.email,
    displayName: data.displayName,
  };
}

export interface CredentialConnectResult {
  integrationId: string;
  accountId: string;
  displayName: string;
}

export async function connectMailchimpWithApiKey(
  apiKey: string
): Promise<CredentialConnectResult> {
  const { data } = await apiResponse.post<{
    success: boolean;
    integrationId: string;
    accountId: string;
    displayName: string;
  }>(`/integrations/mailchimp/connect-with-api-key`, { apiKey });
  return data;
}

export async function connectLinkedInAdsWithAccountId(
  accountId: string
): Promise<CredentialConnectResult> {
  const { data } = await apiResponse.post<{
    success: boolean;
    integrationId: string;
    accountId: string;
    displayName: string;
  }>(`/integrations/linkedin_ads/connect-with-account-id`, { accountId });
  return data;
}

export async function connectXAdsWithAccountId(
  accountId: string
): Promise<CredentialConnectResult> {
  const { data } = await apiResponse.post<{
    success: boolean;
    integrationId: string;
    accountId: string;
    displayName: string;
  }>(`/integrations/x_ads/connect-with-account-id`, { accountId });
  return data;
}

export interface BrevoEmailRecipient {
  email: string;
  name?: string;
}

export interface BrevoAttachment {
  url?: string;
  name?: string;
  content?: string; // base64
}

export interface SendBrevoEmailInput {
  to: BrevoEmailRecipient | BrevoEmailRecipient[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, unknown>;
  sender?: BrevoEmailRecipient;
  cc?: BrevoEmailRecipient[];
  bcc?: BrevoEmailRecipient[];
  replyTo?: BrevoEmailRecipient;
  tags?: string[];
  headers?: Record<string, string>;
  attachments?: BrevoAttachment[];
}

export async function sendBrevoEmail(
  integrationId: string,
  input: SendBrevoEmailInput
): Promise<{ messageId: string; messageIds?: string[] }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    message: { messageId: string; messageIds?: string[] };
  }>(`/integrations/brevo/${integrationId}/send`, input);
  return data.message;
}

export interface BrevoContact {
  id: number;
  email: string;
  emailBlacklisted?: boolean;
  smsBlacklisted?: boolean;
  createdAt?: string;
  modifiedAt?: string;
  attributes?: Record<string, unknown>;
  listIds?: number[];
}

export interface ListBrevoContactsQuery {
  limit?: number;
  offset?: number;
  modifiedSince?: string;
}

export async function listBrevoContacts(
  integrationId: string,
  q: ListBrevoContactsQuery = {}
): Promise<{ contacts: BrevoContact[]; count: number }> {
  const params = new URLSearchParams();
  if (q.limit !== undefined) params.set("limit", String(q.limit));
  if (q.offset !== undefined) params.set("offset", String(q.offset));
  if (q.modifiedSince) params.set("modifiedSince", q.modifiedSince);
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    contacts: BrevoContact[];
    count: number;
  }>(`/integrations/brevo/${integrationId}/contacts${qs ? `?${qs}` : ""}`);
  return { contacts: data.contacts, count: data.count };
}

export interface CreateBrevoContactInput {
  email: string;
  attributes?: Record<string, unknown>;
  listIds?: number[];
  updateEnabled?: boolean;
}

export async function createBrevoContact(
  integrationId: string,
  input: CreateBrevoContactInput
): Promise<{ id: number }> {
  const { data } = await apiResponse.post<{
    success: boolean;
    contact: { id: number };
  }>(`/integrations/brevo/${integrationId}/contacts`, input);
  return data.contact;
}

export interface BrevoEmailCampaign {
  id: number;
  name: string;
  subject?: string;
  type?: string;
  status?: string;
  scheduledAt?: string;
  testSent?: boolean;
  sender?: { name?: string; email?: string };
  createdAt?: string;
  modifiedAt?: string;
}

export interface ListBrevoCampaignsQuery {
  status?: "draft" | "sent" | "archive" | "queued" | "suspended" | "in_process";
  type?: "classic" | "trigger";
  limit?: number;
  offset?: number;
}

export async function listBrevoCampaigns(
  integrationId: string,
  q: ListBrevoCampaignsQuery = {}
): Promise<{ campaigns: BrevoEmailCampaign[]; count: number }> {
  const params = new URLSearchParams();
  if (q.status) params.set("status", q.status);
  if (q.type) params.set("type", q.type);
  if (q.limit !== undefined) params.set("limit", String(q.limit));
  if (q.offset !== undefined) params.set("offset", String(q.offset));
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    campaigns: BrevoEmailCampaign[];
    count: number;
  }>(`/integrations/brevo/${integrationId}/campaigns${qs ? `?${qs}` : ""}`);
  return { campaigns: data.campaigns, count: data.count };
}

export interface BrevoAggregatedReport {
  range?: string;
  requests?: number;
  delivered?: number;
  hardBounces?: number;
  softBounces?: number;
  clicks?: number;
  uniqueClicks?: number;
  opens?: number;
  uniqueOpens?: number;
  spamReports?: number;
  blocked?: number;
  invalid?: number;
  unsubscribed?: number;
}

export interface BrevoAggregatedReportQuery {
  days?: number;
  startDate?: string;
  endDate?: string;
  tag?: string;
}

export async function fetchBrevoAggregatedReport(
  integrationId: string,
  q: BrevoAggregatedReportQuery = {}
): Promise<BrevoAggregatedReport> {
  const params = new URLSearchParams();
  if (q.days !== undefined) params.set("days", String(q.days));
  if (q.startDate) params.set("startDate", q.startDate);
  if (q.endDate) params.set("endDate", q.endDate);
  if (q.tag) params.set("tag", q.tag);
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    report: BrevoAggregatedReport;
  }>(
    `/integrations/brevo/${integrationId}/stats/aggregated${qs ? `?${qs}` : ""}`
  );
  return data.report;
}

export interface BrevoEmailEvent {
  email: string;
  date?: string;
  subject?: string;
  messageId?: string;
  event?: string;
  reason?: string;
  tag?: string;
  ip?: string;
  link?: string;
  from?: string;
}

export interface BrevoEmailEventQuery {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  email?: string;
  event?:
    | "bounces"
    | "hardBounces"
    | "softBounces"
    | "delivered"
    | "spam"
    | "requests"
    | "opened"
    | "clicks"
    | "invalid"
    | "deferred"
    | "blocked"
    | "unsubscribed"
    | "error"
    | "loadedByProxy";
  tags?: string;
  messageId?: string;
}

export async function listBrevoEmailEvents(
  integrationId: string,
  q: BrevoEmailEventQuery = {}
): Promise<BrevoEmailEvent[]> {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null) continue;
    params.set(k, String(v));
  }
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    events: BrevoEmailEvent[];
  }>(`/integrations/brevo/${integrationId}/stats/events${qs ? `?${qs}` : ""}`);
  return data.events;
}

// -----------------------------------------------------------------------------
// Pinterest
// -----------------------------------------------------------------------------

export interface PinterestBoard {
  id: string;
  name: string;
  description?: string;
  privacy?: "PUBLIC" | "PROTECTED" | "SECRET";
  board_pins_modified_at?: string;
  pin_count?: number;
  follower_count?: number;
}

export interface ListPinterestBoardsQuery {
  pageSize?: number;
  bookmark?: string;
  privacy?: "PUBLIC" | "PROTECTED" | "SECRET";
}

export async function listPinterestBoards(
  integrationId: string,
  q: ListPinterestBoardsQuery = {}
): Promise<{ boards: PinterestBoard[]; bookmark?: string }> {
  const params = new URLSearchParams();
  if (q.pageSize !== undefined) params.set("pageSize", String(q.pageSize));
  if (q.bookmark) params.set("bookmark", q.bookmark);
  if (q.privacy) params.set("privacy", q.privacy);
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    boards: PinterestBoard[];
    bookmark?: string;
  }>(`/integrations/pinterest/${integrationId}/boards${qs ? `?${qs}` : ""}`);
  return { boards: data.boards, bookmark: data.bookmark };
}

export interface PinterestPin {
  id: string;
  link?: string;
  title?: string;
  description?: string;
  alt_text?: string;
  board_id?: string;
  board_section_id?: string;
  created_at?: string;
  media?: {
    media_type?: "image" | "video" | "multiple_images" | "multiple_videos";
    images?: Record<string, { url: string; width: number; height: number }>;
  };
}

export interface CreatePinterestPinInput {
  boardId: string;
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
  altText?: string;
  boardSectionId?: string;
}

export async function createPinterestPin(
  integrationId: string,
  input: CreatePinterestPinInput
): Promise<PinterestPin> {
  const { data } = await apiResponse.post<{
    success: boolean;
    pin: PinterestPin;
  }>(`/integrations/pinterest/${integrationId}/pins`, input);
  return data.pin;
}

export interface ListPinterestPinsQuery {
  pageSize?: number;
  bookmark?: string;
}

export async function listPinterestPins(
  integrationId: string,
  q: ListPinterestPinsQuery = {}
): Promise<{ pins: PinterestPin[]; bookmark?: string }> {
  const params = new URLSearchParams();
  if (q.pageSize !== undefined) params.set("pageSize", String(q.pageSize));
  if (q.bookmark) params.set("bookmark", q.bookmark);
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    pins: PinterestPin[];
    bookmark?: string;
  }>(`/integrations/pinterest/${integrationId}/pins${qs ? `?${qs}` : ""}`);
  return { pins: data.pins, bookmark: data.bookmark };
}

export async function deletePinterestPin(
  integrationId: string,
  pinId: string
): Promise<void> {
  await apiResponse.delete(
    `/integrations/pinterest/${integrationId}/pins/${pinId}`
  );
}

export interface PinterestAnalyticsQuery {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  metricTypes?: string[];
  appTypes?: "ALL" | "MOBILE" | "TABLET" | "WEB";
}

function pinterestAnalyticsParams(q: PinterestAnalyticsQuery): string {
  const params = new URLSearchParams({
    startDate: q.startDate,
    endDate: q.endDate,
  });
  if (q.metricTypes?.length) params.set("metricTypes", q.metricTypes.join(","));
  if (q.appTypes) params.set("appTypes", q.appTypes);
  return params.toString();
}

export async function fetchPinterestPinAnalytics(
  integrationId: string,
  pinId: string,
  q: PinterestAnalyticsQuery
): Promise<unknown> {
  const { data } = await apiResponse.get<{
    success: boolean;
    analytics: unknown;
  }>(
    `/integrations/pinterest/${integrationId}/pins/${pinId}/analytics?${pinterestAnalyticsParams(q)}`
  );
  return data.analytics;
}

export async function fetchPinterestAccountAnalytics(
  integrationId: string,
  q: PinterestAnalyticsQuery
): Promise<unknown> {
  const { data } = await apiResponse.get<{
    success: boolean;
    analytics: unknown;
  }>(
    `/integrations/pinterest/${integrationId}/analytics?${pinterestAnalyticsParams(q)}`
  );
  return data.analytics;
}

// -----------------------------------------------------------------------------
// Snapchat (Marketing API — one Integration row per ad account)
// -----------------------------------------------------------------------------

export interface SnapCampaign {
  id: string;
  name: string;
  status?: string;
  objective?: string;
  ad_account_id?: string;
  start_time?: string;
  end_time?: string;
  daily_budget_micro?: number;
  lifetime_spend_cap_micro?: number;
  created_at?: string;
  updated_at?: string;
}

export async function listSnapCampaigns(
  integrationId: string
): Promise<SnapCampaign[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    campaigns: SnapCampaign[];
  }>(`/integrations/snapchat/${integrationId}/campaigns`);
  return data.campaigns;
}

export type SnapGranularity = "TOTAL" | "DAY" | "HOUR";

export interface SnapStatsQuery {
  startTime: string; // ISO-8601
  endTime: string;
  granularity?: SnapGranularity;
  fields?: string[];
}

function snapStatsParams(q: SnapStatsQuery): string {
  const params = new URLSearchParams({
    startTime: q.startTime,
    endTime: q.endTime,
  });
  if (q.granularity) params.set("granularity", q.granularity);
  if (q.fields?.length) params.set("fields", q.fields.join(","));
  return params.toString();
}

export async function fetchSnapAdAccountStats(
  integrationId: string,
  q: SnapStatsQuery
): Promise<unknown> {
  const { data } = await apiResponse.get<{
    success: boolean;
    stats: unknown;
  }>(`/integrations/snapchat/${integrationId}/stats?${snapStatsParams(q)}`);
  return data.stats;
}

export async function fetchSnapCampaignStats(
  integrationId: string,
  campaignId: string,
  q: SnapStatsQuery
): Promise<unknown> {
  const { data } = await apiResponse.get<{
    success: boolean;
    stats: unknown;
  }>(
    `/integrations/snapchat/${integrationId}/campaigns/${campaignId}/stats?${snapStatsParams(q)}`
  );
  return data.stats;
}

// -----------------------------------------------------------------------------
// Google Ads (one Integration row per accessible customer)
// -----------------------------------------------------------------------------

export interface GoogleAdsCampaign {
  id: string;
  name: string;
  status?: string;
  servingStatus?: string;
  advertisingChannelType?: string;
  startDate?: string;
  endDate?: string;
}

export async function listGoogleAdsCampaigns(
  integrationId: string
): Promise<GoogleAdsCampaign[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    campaigns: GoogleAdsCampaign[];
  }>(`/integrations/google_ads/${integrationId}/campaigns`);
  return data.campaigns;
}

export interface GoogleAdsStatsQuery {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  campaignId?: string;
}

export interface GoogleAdsCampaignStatsRow {
  date?: string;
  campaignId?: string;
  campaignName?: string;
  impressions?: number;
  clicks?: number;
  costMicros?: number;
  ctr?: number;
  averageCpc?: number;
  conversions?: number;
  conversionsValue?: number;
}

export async function fetchGoogleAdsCampaignStats(
  integrationId: string,
  q: GoogleAdsStatsQuery
): Promise<GoogleAdsCampaignStatsRow[]> {
  const params = new URLSearchParams({
    startDate: q.startDate,
    endDate: q.endDate,
  });
  if (q.campaignId) params.set("campaignId", q.campaignId);
  const { data } = await apiResponse.get<{
    success: boolean;
    stats: GoogleAdsCampaignStatsRow[];
  }>(`/integrations/google_ads/${integrationId}/stats?${params}`);
  return data.stats;
}

// -----------------------------------------------------------------------------
// TikTok Ads (one Integration row per authorized advertiser)
// -----------------------------------------------------------------------------

export interface TikTokAdsCampaign {
  campaign_id: string;
  campaign_name: string;
  campaign_type?: string;
  objective_type?: string;
  budget?: number;
  budget_mode?: string;
  operation_status?: string;
  status?: string;
  create_time?: string;
  modify_time?: string;
}

export interface ListTikTokAdsCampaignsQuery {
  page?: number;
  pageSize?: number;
}

export async function listTikTokAdsCampaigns(
  integrationId: string,
  q: ListTikTokAdsCampaignsQuery = {}
): Promise<{
  campaigns: TikTokAdsCampaign[];
  pageInfo?: {
    page: number;
    page_size: number;
    total_number: number;
    total_page: number;
  };
}> {
  const params = new URLSearchParams();
  if (q.page !== undefined) params.set("page", String(q.page));
  if (q.pageSize !== undefined) params.set("pageSize", String(q.pageSize));
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    campaigns: TikTokAdsCampaign[];
    pageInfo?: {
      page: number;
      page_size: number;
      total_number: number;
      total_page: number;
    };
  }>(
    `/integrations/tiktok_ads/${integrationId}/campaigns${qs ? `?${qs}` : ""}`
  );
  return { campaigns: data.campaigns, pageInfo: data.pageInfo };
}

export interface TikTokAdsReportQuery {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  dataLevel?: "AUCTION_CAMPAIGN" | "AUCTION_ADGROUP" | "AUCTION_AD";
  dimensions?: string[];
  metrics?: string[];
  campaignIds?: string[];
}

export interface TikTokAdsReportRow {
  dimensions: Record<string, string>;
  metrics: Record<string, string>;
}

export async function fetchTikTokAdsReport(
  integrationId: string,
  q: TikTokAdsReportQuery
): Promise<{
  rows: TikTokAdsReportRow[];
  pageInfo?: {
    page: number;
    page_size: number;
    total_number: number;
    total_page: number;
  };
}> {
  const params = new URLSearchParams({
    startDate: q.startDate,
    endDate: q.endDate,
  });
  if (q.dataLevel) params.set("dataLevel", q.dataLevel);
  if (q.dimensions?.length) params.set("dimensions", q.dimensions.join(","));
  if (q.metrics?.length) params.set("metrics", q.metrics.join(","));
  if (q.campaignIds?.length) params.set("campaignIds", q.campaignIds.join(","));
  const { data } = await apiResponse.get<{
    success: boolean;
    rows: TikTokAdsReportRow[];
    pageInfo?: {
      page: number;
      page_size: number;
      total_number: number;
      total_page: number;
    };
  }>(`/integrations/tiktok_ads/${integrationId}/report?${params}`);
  return { rows: data.rows, pageInfo: data.pageInfo };
}

// -----------------------------------------------------------------------------
// Google Calendar
// -----------------------------------------------------------------------------

export interface GoogleCalendarEventDateTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}

export interface GoogleCalendarAttendee {
  email: string;
  displayName?: string;
  optional?: boolean;
  responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
}

export interface GoogleCalendarEvent {
  id: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: GoogleCalendarEventDateTime;
  end?: GoogleCalendarEventDateTime;
  attendees?: GoogleCalendarAttendee[];
  htmlLink?: string;
  hangoutLink?: string;
  created?: string;
  updated?: string;
}

export interface ListGoogleCalendarEventsQuery {
  calendarId?: string;
  q?: string;
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
  pageToken?: string;
  orderBy?: "startTime" | "updated";
}

export async function listGoogleCalendarEvents(
  integrationId: string,
  q: ListGoogleCalendarEventsQuery = {}
): Promise<{ events: GoogleCalendarEvent[]; nextPageToken?: string }> {
  const params = new URLSearchParams();
  if (q.calendarId) params.set("calendarId", q.calendarId);
  if (q.q) params.set("q", q.q);
  if (q.timeMin) params.set("timeMin", q.timeMin);
  if (q.timeMax) params.set("timeMax", q.timeMax);
  if (q.maxResults) params.set("maxResults", String(q.maxResults));
  if (q.pageToken) params.set("pageToken", q.pageToken);
  if (q.orderBy) params.set("orderBy", q.orderBy);
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    events: GoogleCalendarEvent[];
    nextPageToken?: string;
  }>(
    `/integrations/google_calendar/${integrationId}/events${qs ? `?${qs}` : ""}`
  );
  return { events: data.events, nextPageToken: data.nextPageToken };
}

export interface CreateGoogleCalendarEventInput {
  calendarId?: string;
  summary: string;
  description?: string;
  location?: string;
  start: GoogleCalendarEventDateTime;
  end: GoogleCalendarEventDateTime;
  attendees?: GoogleCalendarAttendee[];
  sendUpdates?: "all" | "externalOnly" | "none";
}

export async function createGoogleCalendarEvent(
  integrationId: string,
  input: CreateGoogleCalendarEventInput
): Promise<GoogleCalendarEvent> {
  const { data } = await apiResponse.post<{
    success: boolean;
    event: GoogleCalendarEvent;
  }>(`/integrations/google_calendar/${integrationId}/events`, input);
  return data.event;
}

export async function updateGoogleCalendarEvent(
  integrationId: string,
  eventId: string,
  input: CreateGoogleCalendarEventInput
): Promise<GoogleCalendarEvent> {
  const { data } = await apiResponse.put<{
    success: boolean;
    event: GoogleCalendarEvent;
  }>(`/integrations/google_calendar/${integrationId}/events/${eventId}`, input);
  return data.event;
}

export async function deleteGoogleCalendarEvent(
  integrationId: string,
  eventId: string,
  calendarId = "primary"
): Promise<void> {
  await apiResponse.delete(
    `/integrations/google_calendar/${integrationId}/events/${eventId}`,
    { params: { calendarId, sendUpdates: "all" } }
  );
}

export interface GoogleCalendarSummary {
  id: string;
  summary: string;
  primary?: boolean;
  accessRole?: string;
  timeZone?: string;
  backgroundColor?: string;
}

export async function listGoogleCalendars(
  integrationId: string
): Promise<GoogleCalendarSummary[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    calendars: GoogleCalendarSummary[];
  }>(`/integrations/google_calendar/${integrationId}/calendars`);
  return data.calendars;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  size?: string;
  modifiedTime?: string;
  createdTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  trashed?: boolean;
}

export interface ListGoogleDriveFilesQuery {
  q?: string;
  folderId?: string;
  pageSize?: number;
  pageToken?: string;
  orderBy?: string;
  trashed?: boolean;
  fields?: string;
}

export async function listGoogleDriveFiles(
  integrationId: string,
  q: ListGoogleDriveFilesQuery = {}
): Promise<{ files: GoogleDriveFile[]; nextPageToken?: string }> {
  const params = new URLSearchParams();
  if (q.q) params.set("q", q.q);
  if (q.folderId) params.set("folderId", q.folderId);
  if (q.pageSize) params.set("pageSize", String(q.pageSize));
  if (q.pageToken) params.set("pageToken", q.pageToken);
  if (q.orderBy) params.set("orderBy", q.orderBy);
  if (q.fields) params.set("fields", q.fields);
  if (q.trashed !== undefined) params.set("trashed", String(q.trashed));
  const qs = params.toString();
  const { data } = await apiResponse.get<{
    success: boolean;
    files: GoogleDriveFile[];
    nextPageToken?: string;
  }>(`/integrations/google_drive/${integrationId}/files${qs ? `?${qs}` : ""}`);
  return { files: data.files, nextPageToken: data.nextPageToken };
}

export async function getGoogleDriveFile(
  integrationId: string,
  fileId: string,
  fields?: string
): Promise<GoogleDriveFile> {
  const qs = fields ? `?fields=${encodeURIComponent(fields)}` : "";
  const { data } = await apiResponse.get<{
    success: boolean;
    file: GoogleDriveFile;
  }>(
    `/integrations/google_drive/${integrationId}/files/${encodeURIComponent(fileId)}${qs}`
  );
  return data.file;
}

export async function createGoogleDriveFolder(
  integrationId: string,
  input: { name: string; parentId?: string }
): Promise<GoogleDriveFile> {
  const { data } = await apiResponse.post<{
    success: boolean;
    folder: GoogleDriveFile;
  }>(`/integrations/google_drive/${integrationId}/folders`, input);
  return data.folder;
}

export interface InitGoogleDriveUploadInput {
  name: string;
  mimeType: string;
  contentLength: number;
  parentId?: string;
  // If set, this becomes an in-place update of an existing file (PATCH) — the
  // bytes you stream to `uploadUrl` overwrite the file's content while keeping
  // its id and shareable link stable.
  fileId?: string;
}

export interface InitGoogleDriveUploadResult {
  uploadUrl: string;
  expiresAt: string;
  fileId?: string;
}

export async function initGoogleDriveUpload(
  integrationId: string,
  input: InitGoogleDriveUploadInput
): Promise<InitGoogleDriveUploadResult> {
  const { data } = await apiResponse.post<{
    success: boolean;
    uploadUrl: string;
    expiresAt: string;
    fileId?: string;
  }>(`/integrations/google_drive/${integrationId}/uploads/init`, input);
  return {
    uploadUrl: data.uploadUrl,
    expiresAt: data.expiresAt,
    fileId: data.fileId,
  };
}

export async function deleteGoogleDriveFile(
  integrationId: string,
  fileId: string
): Promise<void> {
  await apiResponse.delete(
    `/integrations/google_drive/${integrationId}/files/${encodeURIComponent(fileId)}`
  );
}

export interface GoogleDriveAbout {
  user: {
    displayName?: string;
    emailAddress?: string;
    photoLink?: string;
  };
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
    usageInDriveTrash?: string;
  };
}

export async function getGoogleDriveAbout(
  integrationId: string
): Promise<GoogleDriveAbout> {
  const { data } = await apiResponse.get<{
    success: boolean;
    about: GoogleDriveAbout;
  }>(`/integrations/google_drive/${integrationId}/about`);
  return data.about;
}
