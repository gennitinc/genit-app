import type { LeadStage, PipelineLead } from "@/lib/pipeline-api";

export const pipelineKeys = {
  all: (orgId?: string) => ["pipeline", orgId || "none"] as const,
  list: (orgId: string | undefined, q: string) => [...pipelineKeys.all(orgId), "list", q] as const,
  lead: (orgId: string | undefined, id: string) => [...pipelineKeys.all(orgId), "lead", id] as const,
  report: (orgId: string | undefined, days: number) => [...pipelineKeys.all(orgId), "report", days] as const,
  settings: (orgId?: string) => [...pipelineKeys.all(orgId), "settings"] as const,
};

export const STAGE_DOT: Record<LeadStage, string> = {
  new: "bg-zinc-400",
  engaged: "bg-sky-500",
  qualified: "bg-violet-500",
  booked: "bg-amber-500",
  won: "bg-emerald-500",
  lost: "bg-red-400",
};

export function leadStage(lead: Pick<PipelineLead, "stage">): LeadStage {
  return lead.stage || "new";
}

export function formatMinutes(minutes: number | null | undefined) {
  if (minutes === null || minutes === undefined) return "—";
  if (minutes < 1) return "<1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  if (minutes < 60 * 48) return `${Math.round(minutes / 6) / 10} h`;
  return `${Math.round(minutes / 1440)} d`;
}

export function relativeTime(value?: string) {
  if (!value) return "";
  const diff = new Date(value).getTime() - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (abs < 3_600_000) return rtf.format(Math.round(diff / 60_000), "minute");
  if (abs < 86_400_000) return rtf.format(Math.round(diff / 3_600_000), "hour");
  return rtf.format(Math.round(diff / 86_400_000), "day");
}

export function formatMoney(value?: number, currency = "USD") {
  if (value === undefined || value === null) return "";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      notation: value >= 100_000 ? "compact" : "standard",
      maximumFractionDigits: value >= 100_000 ? 1 : 0,
    }).format(value);
  } catch {
    return String(value);
  }
}

export function formatSlot(value: string, timeZone?: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone,
      timeZoneName: timeZone ? "short" : undefined,
    }).format(new Date(value));
  } catch {
    return new Date(value).toLocaleString();
  }
}

export const STOP_REASON: Record<string, string> = {
  booked: "Booked",
  won: "Won",
  lost: "Lost",
  handoff: "Handed to a teammate",
  human_replied: "A teammate replied",
  customer_replied: "Customer replied",
  not_interested: "Not interested",
  window_closed: "Messaging window closed",
  sequence_done: "Sequence finished",
  plan_limit: "Plan limit reached",
  ai_replies_off: "AI replies are off for this channel",
  no_email_integration: "No email sender connected",
  suppressed: "Unsubscribed",
  stopped_by_user: "Stopped by you",
  disabled: "Follow-ups are off",
  error: "Sending failed",
};
