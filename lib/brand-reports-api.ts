import { apiResponse } from "@/utils/apiResponse";

export type RecommendationStatus = "open" | "in_progress" | "done" | "dismissed";
export type RecommendationPriority = "high" | "medium" | "low";

export interface BrandRecommendation {
  _id: string;
  title: string;
  rationale: string;
  action: string;
  category: string;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BrandWork {
  sourceId: string;
  source: string;
  type: string;
  title: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  status?: string;
  platform?: string;
  metrics?: Record<string, number>;
  createdAt: string;
}

export interface BrandReport {
  _id: string;
  title: string;
  notes?: string;
  periodStart: string;
  periodEnd: string;
  executiveSummary: string;
  brandMeaning: string;
  score: number;
  metrics: {
    totalWork: number;
    projects: number;
    generatedAssets: number;
    socialPosts: number;
    published: number;
    scheduled: number;
    platforms: string[];
    typeCounts: Record<string, number>;
    identityCompleteness: number;
    consistency: number;
    engagement: number;
    impressions: number;
    views: number;
    engagementRate: number;
  };
  work: BrandWork[];
  recommendations: BrandRecommendation[];
  createdAt: string;
  updatedAt: string;
}

export async function listBrandReports() {
  const { data } = await apiResponse.get<{ reports: BrandReport[] }>("/brand-reports");
  return data.reports;
}

export async function createBrandReport(input: { title?: string; notes?: string; periodStart?: string; periodEnd?: string }) {
  const { data } = await apiResponse.post<{ report: BrandReport }>("/brand-reports", input);
  return data.report;
}

export async function updateBrandReport(id: string, input: Partial<Pick<BrandReport, "title" | "notes" | "executiveSummary" | "brandMeaning">>) {
  const { data } = await apiResponse.patch<{ report: BrandReport }>(`/brand-reports/${id}`, input);
  return data.report;
}

export async function refreshBrandReport(id: string) {
  const { data } = await apiResponse.post<{ report: BrandReport }>(`/brand-reports/${id}/refresh`);
  return data.report;
}

export async function deleteBrandReport(id: string) {
  await apiResponse.delete(`/brand-reports/${id}`);
}

export type RecommendationInput = Pick<BrandRecommendation, "title" | "rationale" | "action"> & Partial<Pick<BrandRecommendation, "category" | "priority" | "status">>;

export async function createRecommendation(reportId: string, input: RecommendationInput) {
  const { data } = await apiResponse.post<{ report: BrandReport }>(`/brand-reports/${reportId}/recommendations`, input);
  return data.report;
}

export async function updateRecommendation(reportId: string, recommendationId: string, input: Partial<RecommendationInput>) {
  const { data } = await apiResponse.patch<{ report: BrandReport }>(`/brand-reports/${reportId}/recommendations/${recommendationId}`, input);
  return data.report;
}

export async function deleteRecommendation(reportId: string, recommendationId: string) {
  const { data } = await apiResponse.delete<{ report: BrandReport }>(`/brand-reports/${reportId}/recommendations/${recommendationId}`);
  return data.report;
}
