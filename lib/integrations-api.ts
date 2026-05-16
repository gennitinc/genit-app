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
  | "telegram";

export type ConnectionState = "active" | "expired" | "revoked" | "error";

export interface IntegrationConnection {
  _id: string;
  platform: IntegrationPlatform;
  accountId: string;
  accountName: string;
  accountAvatar?: string;
  scopes: string[];
  status: ConnectionState;
  expiresAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const SUPPORTED_PLATFORMS: ReadonlySet<IntegrationPlatform> = new Set([
  "facebook",
  "instagram",
]);

export function isPlatformSupported(platform: IntegrationPlatform): boolean {
  return SUPPORTED_PLATFORMS.has(platform);
}

export async function fetchIntegrations(): Promise<IntegrationConnection[]> {
  const { data } = await apiResponse.get<{
    success: boolean;
    integrations: IntegrationConnection[];
  }>("/api/v1/integrations");
  return data.integrations;
}

export async function requestConnectUrl(
  platform: IntegrationPlatform
): Promise<string> {
  const { data } = await apiResponse.post<{
    success: boolean;
    authorizeUrl: string;
  }>(`/api/v1/integrations/${platform}/connect-url`);
  return data.authorizeUrl;
}

export async function disconnectIntegrationById(id: string): Promise<void> {
  await apiResponse.delete(`/api/v1/integrations/${id}`);
}
