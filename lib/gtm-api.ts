import { apiResponse } from "@/utils/apiResponse";

export type OutreachChannel =
  | "gmail"
  | "outlook"
  | "brevo"
  | "whatsapp"
  | "messenger"
  | "instagram"
  | "telegram"
  | "x"
  | "slack";

export type OutreachVariant = {
  id: string;
  channel: OutreachChannel;
  name: string;
  content: string;
  subject?: string;
  templateName?: string;
  templateLanguage?: string;
  weight: number;
};

export type CampaignRecipient = {
  _id: string;
  channel: OutreachChannel;
  address: string;
  name: string;
  consent: {
    status: "opted_in" | "unknown" | "opted_out";
    source?: string;
    capturedAt?: string;
  };
  status:
    | "pending"
    | "scheduled"
    | "sent"
    | "delivered"
    | "read"
    | "replied"
    | "suppressed"
    | "failed";
  variantId?: string;
  lastError?: string;
  sentAt?: string;
  repliedAt?: string;
};

export type GtmCampaign = {
  _id: string;
  chatId?: string;
  name: string;
  objective: string;
  audience?: string;
  offer?: string;
  budget?: number;
  status: "draft" | "active" | "paused" | "completed";
  channels: string[];
  plan: {
    summary: string;
    funnel: Array<{ stage: string; goal: string; actions: string[] }>;
    calendar: Array<{ day: number; channel: string; action: string }>;
    kpis: string[];
  };
  email: {
    senderIntegration?: string;
    contacts: string[];
    steps: Array<{
      delayDays: number;
      subject: string;
      body: string;
      status: "draft" | "scheduled" | "sent";
    }>;
  };
  outreach: {
    status: "draft" | "running" | "paused" | "completed";
    throttlePerMinute: number;
    integrations: Partial<Record<OutreachChannel, string>>;
    variants: OutreachVariant[];
    launchedAt?: string;
  };
  conversions: Array<{ value: number; source?: string; medium?: string }>;
  recommendations: Array<{
    title: string;
    action: string;
    priority: "high" | "medium" | "low";
    status: "open" | "done" | "dismissed";
  }>;
  lastOptimizedAt?: string;
  createdAt: string;
};

export type Lead = {
  _id: string;
  campaign?: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  title?: string;
  email: string;
  company?: string;
  companyDomain?: string;
  companyUrl?: string;
  location?: string;
  linkedinUrl?: string;
  source: "manual" | "apollo" | "pdl" | "hunter" | "import";
  emailStatus: "unknown" | "valid" | "invalid" | "risky";
  status:
    | "new"
    | "verified"
    | "suppressed"
    | "contacted"
    | "replied"
    | "qualified"
    | "unsubscribed";
  score: number;
  research?: string;
  personalization?: string;
  createdAt: string;
};

export type GtmAttribution = {
  campaign: GtmCampaign;
  metrics: {
    impressions: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
  };
  conversions: number;
  conversionValue: number;
  spend: number;
  roi: number | null;
};

export type GtmCampaignPage = {
  campaigns: GtmCampaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    draftCampaigns: number;
    pipelineValue: number;
    conversions: number;
    sequencesReady: number;
  };
};

export async function listGtmCampaigns(
  input: {
    page?: number;
    limit?: number;
    search?: string;
    status?: GtmCampaign["status"] | "all";
  } = {}
): Promise<GtmCampaignPage> {
  const params = new URLSearchParams();
  if (input.page) params.set("page", String(input.page));
  if (input.limit) params.set("limit", String(input.limit));
  if (input.search) params.set("search", input.search);
  if (input.status && input.status !== "all")
    params.set("status", input.status);
  const { data } = await apiResponse.get<GtmCampaignPage>(
    `/gtm/campaigns?${params}`
  );
  return data;
}

export async function regenerateGtmPlan(id: string): Promise<GtmCampaign> {
  const { data } = await apiResponse.post<{ campaign: GtmCampaign }>(
    `/gtm/campaigns/${id}/plan`
  );
  return data.campaign;
}

export async function createGtmCampaign(input: {
  name: string;
  objective: string;
  audience?: string;
  offer?: string;
  budget?: number;
  channels: string[];
}): Promise<GtmCampaign> {
  const { data } = await apiResponse.post<{ campaign: GtmCampaign }>(
    "/gtm/campaigns",
    input
  );
  return data.campaign;
}

export async function updateGtmCampaign(
  id: string,
  input: Partial<GtmCampaign>
): Promise<GtmCampaign> {
  const { data } = await apiResponse.patch<{ campaign: GtmCampaign }>(
    `/gtm/campaigns/${id}`,
    input
  );
  return data.campaign;
}

export async function deleteGtmCampaign(id: string): Promise<void> {
  await apiResponse.delete(`/gtm/campaigns/${id}`);
}

export async function scheduleGtmEmail(
  id: string,
  input: {
    contacts?: string[];
    senderIntegration?: string;
    steps?: GtmCampaign["email"]["steps"];
  }
): Promise<GtmCampaign> {
  const { data } = await apiResponse.post<{ campaign: GtmCampaign }>(
    `/gtm/campaigns/${id}/email/schedule`,
    input
  );
  return data.campaign;
}

export async function addGtmConversion(
  id: string,
  input: { value: number; source?: string; medium?: string }
): Promise<GtmCampaign> {
  const { data } = await apiResponse.post<{ campaign: GtmCampaign }>(
    `/gtm/campaigns/${id}/conversions`,
    input
  );
  return data.campaign;
}

export async function getGtmAttribution(id: string): Promise<GtmAttribution> {
  const { data } = await apiResponse.get<GtmAttribution>(
    `/gtm/campaigns/${id}/attribution`
  );
  return data;
}

export async function runGtmOptimizer(id: string) {
  const { data } = await apiResponse.post(`/gtm/campaigns/${id}/optimize`);
  return data;
}

export async function scheduleGtmOptimizer(id: string, cadenceDays = 7) {
  const { data } = await apiResponse.post(
    `/gtm/campaigns/${id}/optimizer/schedule`,
    { cadenceDays }
  );
  return data;
}

export async function makeGtmUtm(
  id: string,
  input: { url: string; source?: string; medium?: string }
): Promise<string> {
  const { data } = await apiResponse.post<{ url: string }>(
    `/gtm/campaigns/${id}/utm`,
    input
  );
  return data.url;
}

export async function listLeads(campaignId?: string): Promise<Lead[]> {
  const params = campaignId ? `?campaignId=${campaignId}` : "";
  const { data } = await apiResponse.get<{ leads: Lead[] }>(
    `/gtm/leads${params}`
  );
  return data.leads;
}

export async function importLeads(input: {
  campaignId?: string;
  leads: Array<Partial<Lead> & { email: string }>;
}): Promise<Lead[]> {
  const { data } = await apiResponse.post<{ leads: Lead[] }>(
    "/gtm/leads/import",
    input
  );
  return data.leads;
}

export async function searchLeads(input: {
  provider: "apollo" | "pdl";
  query: string;
  titles?: string[];
  locations?: string[];
  limit?: number;
  campaignId?: string;
}): Promise<Lead[]> {
  const { data } = await apiResponse.post<{ leads: Lead[] }>(
    "/gtm/leads/search",
    input,
    { timeout: 60_000 }
  );
  return data.leads;
}

export async function verifyLead(id: string): Promise<Lead> {
  const { data } = await apiResponse.post<{ lead: Lead }>(
    `/gtm/leads/${id}/verify`
  );
  return data.lead;
}

export async function researchLead(id: string): Promise<Lead> {
  const { data } = await apiResponse.post<{ lead: Lead }>(
    `/gtm/leads/${id}/research`
  );
  return data.lead;
}

export async function scheduleOutbound(input: {
  campaignId: string;
  leadIds?: string[];
  senderIntegration?: string;
}) {
  const { data } = await apiResponse.post(
    `/gtm/campaigns/${input.campaignId}/outbound/schedule`,
    {
      leadIds: input.leadIds,
      senderIntegration: input.senderIntegration,
    }
  );
  return data;
}

export async function exportGtmReport(id: string): Promise<{
  url: string;
  fileName: string;
  campaignName: string;
}> {
  const { data } = await apiResponse.post<{
    report: { url: string; fileName: string; campaignName: string };
  }>(`/gtm/campaigns/${id}/report`, undefined, { timeout: 120_000 });
  return data.report;
}

export type CampaignOutreachSnapshot = {
  campaign: GtmCampaign;
  recipients: CampaignRecipient[];
  stats: Partial<Record<CampaignRecipient["status"], number>>;
  jobs: Array<{
    _id: string;
    status: string;
    error?: string;
    runAt: string;
    payload: { recipientId: string; variantId: string };
  }>;
};

export async function getCampaignOutreach(id: string) {
  const { data } = await apiResponse.get<CampaignOutreachSnapshot>(
    `/gtm/campaigns/${id}/outreach`
  );
  return data;
}

export async function updateCampaignOutreach(
  id: string,
  input: {
    throttlePerMinute?: number;
    integrations?: Partial<Record<OutreachChannel, string>>;
    variants?: OutreachVariant[];
  }
) {
  const { data } = await apiResponse.patch<{ campaign: GtmCampaign }>(
    `/gtm/campaigns/${id}/outreach`,
    input
  );
  return data.campaign;
}

export async function addCampaignRecipients(
  id: string,
  recipients: Array<{
    channel: OutreachChannel;
    address: string;
    name?: string;
    consentStatus: "opted_in" | "unknown" | "opted_out";
    consentSource?: string;
  }>
) {
  const { data } = await apiResponse.post<{ recipients: CampaignRecipient[] }>(
    `/gtm/campaigns/${id}/outreach/recipients`,
    { recipients }
  );
  return data.recipients;
}

export async function launchCampaignOutreach(id: string) {
  const { data } = await apiResponse.post<{
    scheduled: number;
    rejected: Array<{ recipientId: string; reason: string }>;
  }>(`/gtm/campaigns/${id}/outreach/launch`);
  return data;
}

export async function pauseCampaignOutreach(id: string) {
  const { data } = await apiResponse.post<{ campaign: GtmCampaign }>(
    `/gtm/campaigns/${id}/outreach/pause`
  );
  return data.campaign;
}

export async function suppressCampaignRecipient(
  campaignId: string,
  recipientId: string
) {
  await apiResponse.post(
    `/gtm/campaigns/${campaignId}/outreach/recipients/${recipientId}/suppress`
  );
}
