import { apiResponse } from "@/utils/apiResponse";

export const LEAD_STAGES = [
  "new",
  "engaged",
  "qualified",
  "booked",
  "won",
  "lost",
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export const STAGE_LABEL: Record<LeadStage, string> = {
  new: "New",
  engaged: "In conversation",
  qualified: "Qualified",
  booked: "Booked",
  won: "Won",
  lost: "Lost",
};

export const SOURCE_LABEL: Record<string, string> = {
  inbox: "Inbox",
  meta_lead_ads: "Meta lead ad",
  website_form: "Website form",
  webhook: "Webhook",
  manual: "Added manually",
  import: "Import",
  apollo: "Apollo",
  pdl: "People Data Labs",
  hunter: "Hunter",
};

export type QualifyingQuestion = {
  key: string;
  label: string;
  ask: string;
  required: boolean;
};

export type PipelineLead = {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  company?: string;
  source: string;
  channel?: string;
  stage?: LeadStage;
  stageChangedAt?: string;
  stageHistory?: Array<{ stage: LeadStage; at: string; by: "agent" | "user" | "system"; note?: string }>;
  dealValue?: number;
  currency?: string;
  lostReason?: string;
  notes?: string;
  score: number;
  qualification?: {
    vertical?: string;
    answers?: Record<string, string>;
    missing?: string[];
    intent?: string;
    summary?: string;
    qualifiedAt?: string;
  };
  booking?: {
    status: "booked" | "cancelled" | "completed" | "no_show";
    start: string;
    end: string;
    timezone?: string;
    eventLink?: string;
  };
  followUp?: { count: number; nextAt?: string; stoppedReason?: string };
  firstResponseAt?: string;
  lastInboundAt?: string;
  lastOutboundAt?: string;
  conversation?: string;
  attribution?: Record<string, string | undefined>;
  agentSkippedReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadMessage = {
  _id: string;
  senderType: "customer" | "agent" | "bot";
  content?: string;
  createdAt: string;
  metadata?: { ai?: { followUp?: number }; booking?: { start: string } };
};

export type FunnelBucket = {
  captured: number;
  engaged: number;
  qualified: number;
  booked: number;
  won: number;
  lost: number;
  wonValue: number;
  bookingRate: number;
  winRate: number;
};

export type PipelineReport = {
  days: number;
  totals: FunnelBucket;
  steps: Array<{ stage: LeadStage; count: number; ofCaptured: number; fromPrevious: number }>;
  speedToLead: {
    medianMinutes: number | null;
    within5MinutesPct: number;
    responded: number;
    unanswered: number;
  };
  bySource: Array<FunnelBucket & { name: string }>;
  byChannel: Array<FunnelBucket & { name: string }>;
  daily: Array<{ date: string; captured: number; booked: number }>;
  pipeline: Partial<Record<LeadStage, { count: number; value: number }>>;
  upcomingBookings: Array<Pick<PipelineLead, "_id" | "fullName" | "channel" | "booking" | "stage">>;
};

export type SalesAgentSettings = {
  enabled: boolean;
  captureChats: boolean;
  captureEmail: boolean;
  vertical: string;
  customQuestions: QualifyingQuestion[];
  qualifyThreshold: number;
  currency: string;
  booking: {
    enabled: boolean;
    calendarIntegrationId?: string;
    meetingName?: string;
    durationMinutes: number;
    bufferMinutes: number;
    timezone: string;
    days: number[];
    startHour: number;
    endHour: number;
    minNoticeHours: number;
    horizonDays: number;
    location?: string;
  };
  followUp: { enabled: boolean; delaysHours: number[] };
  formKey: string;
  emailIntegrationId?: string;
};

export type PipelineSettingsResponse = {
  settings: SalesAgentSettings;
  capacity: { plan: string; month: string; used: number; limit: number | null; remaining: number | null };
  formEndpoint: string;
  verticals: Array<{ key: string; name: string; meetingName: string; questions: QualifyingQuestion[] }>;
  calendars: Array<{ id: string; name: string }>;
  emailSenders: Array<{ id: string; platform: string; name: string }>;
};

export async function listPipeline(params: { q?: string; source?: string } = {}) {
  const { data } = await apiResponse.get<{ leads: PipelineLead[] }>("gtm/pipeline", { params });
  return data.leads;
}

export async function getPipelineLead(id: string) {
  const { data } = await apiResponse.get<{
    lead: PipelineLead;
    messages: LeadMessage[];
    questions: QualifyingQuestion[];
  }>(`gtm/pipeline/leads/${id}`);
  return data;
}

export type LeadPatch = Partial<{
  stage: LeadStage;
  stageNote: string;
  dealValue: number | null;
  currency: string;
  notes: string;
  lostReason: string;
  fullName: string;
  email: string;
  phone: string;
  answers: Record<string, string>;
  followUp: "stop" | "resume";
}>;

export async function updatePipelineLead(id: string, patch: LeadPatch) {
  const { data } = await apiResponse.patch<{ lead: PipelineLead }>(`gtm/pipeline/leads/${id}`, patch);
  return data.lead;
}

export async function createPipelineLead(input: {
  name: string;
  email?: string;
  phone?: string;
  dealValue?: number;
  notes?: string;
  startFollowUp?: boolean;
}) {
  const { data } = await apiResponse.post<{ lead: PipelineLead; created: boolean }>("gtm/pipeline/leads", input);
  return data;
}

export async function getPipelineReport(days: number) {
  const { data } = await apiResponse.get<{ report: PipelineReport }>("gtm/pipeline/report", { params: { days } });
  return data.report;
}

export async function getPipelineSettings() {
  const { data } = await apiResponse.get<PipelineSettingsResponse>("gtm/pipeline/settings");
  return data;
}

export async function savePipelineSettings(input: Partial<SalesAgentSettings> & { rotateFormKey?: boolean }) {
  const { data } = await apiResponse.put<{ settings: SalesAgentSettings; formEndpoint: string }>(
    "gtm/pipeline/settings",
    input
  );
  return data;
}

export async function getPipelineSlots() {
  const { data } = await apiResponse.get<{
    connected: boolean;
    slots: Array<{ id: string; start: string; end: string; label: string }>;
  }>("gtm/pipeline/slots");
  return data;
}
