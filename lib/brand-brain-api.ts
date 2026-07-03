import { apiResponse } from "@/utils/apiResponse";

export type BrandBrainItemType =
  | "document"
  | "website"
  | "brand_voice"
  | "product"
  | "faq"
  | "policy"
  | "instruction";

export type BrandBrainItem = {
  _id: string;
  orgId: string;
  type: BrandBrainItemType;
  title: string;
  sourceUrl?: string;
  fileName?: string;
  fileType?: string;
  content: string;
  summary?: string;
  chunks?: { text: string; index: number }[];
  tags?: string[];
  status: "active" | "processing" | "failed";
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BrandBrainStats = {
  totalItems: number;
  totalChunks: number;
  byType: Record<string, number>;
  canEdit: boolean;
};

export async function fetchBrandBrain(orgId: string) {
  const { data } = await apiResponse.get<{
    success: boolean;
    items: BrandBrainItem[];
    stats: BrandBrainStats;
  }>(`/orgs/${orgId}/brain`);
  return data;
}

export async function createBrandBrainItem(
  orgId: string,
  payload: {
    title: string;
    content: string;
    type: BrandBrainItemType;
    sourceUrl?: string;
    tags?: string[];
  }
) {
  const { data } = await apiResponse.post<{
    success: boolean;
    item: BrandBrainItem;
  }>(`/orgs/${orgId}/brain`, payload);
  return data.item;
}

export async function uploadBrandBrainDocuments(
  orgId: string,
  files: File[],
  tags?: string[]
) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  if (tags?.length) formData.append("tags", JSON.stringify(tags));

  const { data } = await apiResponse.post<{
    success: boolean;
    items: BrandBrainItem[];
  }>(`/orgs/${orgId}/brain/upload`, formData);
  return data.items;
}

export async function crawlBrandBrainWebsite(
  orgId: string,
  payload: { url: string; title?: string; tags?: string[] }
) {
  const { data } = await apiResponse.post<{
    success: boolean;
    item: BrandBrainItem;
  }>(`/orgs/${orgId}/brain/crawl`, payload);
  return data.item;
}

export async function updateBrandBrainItem(
  orgId: string,
  itemId: string,
  payload: Partial<
    Pick<BrandBrainItem, "title" | "content" | "type" | "sourceUrl" | "tags">
  >
) {
  const { data } = await apiResponse.patch<{
    success: boolean;
    item: BrandBrainItem;
  }>(`/orgs/${orgId}/brain/${itemId}`, payload);
  return data.item;
}

export async function deleteBrandBrainItem(orgId: string, itemId: string) {
  await apiResponse.delete(`/orgs/${orgId}/brain/${itemId}`);
}

export async function searchBrandBrain(orgId: string, query: string) {
  const { data } = await apiResponse.get<{
    success: boolean;
    chunks: Array<{
      itemId: string;
      title: string;
      type: BrandBrainItemType;
      sourceUrl?: string;
      text: string;
      score: number;
    }>;
    context: string;
  }>(`/orgs/${orgId}/brain/search`, { params: { q: query } });
  return data;
}

export async function syncBrandBrainFromBrand(orgId: string) {
  const { data } = await apiResponse.post<{
    success: boolean;
    items: BrandBrainItem[];
  }>(`/orgs/${orgId}/brain/sync-brand`);
  return data.items;
}
