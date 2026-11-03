import type { GtmCampaign, Lead } from "@/lib/gtm-api";

export function parseLeadList(value: string) {
  const seen = new Set<string>();
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [email = "", fullName = "", company = "", title = ""] = line
        .split(",")
        .map((part) => part.trim());
      return { email: email.toLowerCase(), fullName, company, title };
    })
    .filter((lead) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return false;
      if (seen.has(lead.email)) return false;
      seen.add(lead.email);
      return true;
    });
}

export function campaignPipeline(campaigns: GtmCampaign[]) {
  return campaigns.reduce(
    (total, campaign) =>
      total +
      campaign.conversions.reduce(
        (campaignTotal, conversion) =>
          campaignTotal + Number(conversion.value || 0),
        0
      ),
    0
  );
}

export function campaignLeadSummary(leads: Lead[]) {
  return leads.reduce(
    (summary, lead) => {
      summary.total += 1;
      if (lead.emailStatus === "valid") summary.verified += 1;
      if (lead.status === "contacted") summary.contacted += 1;
      if (["replied", "qualified"].includes(lead.status)) summary.engaged += 1;
      return summary;
    },
    { total: 0, verified: 0, contacted: 0, engaged: 0 }
  );
}

export function campaignError(error: unknown, fallback: string) {
  const candidate = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };
  return (
    candidate?.response?.data?.message ||
    candidate?.response?.data?.error ||
    candidate?.message ||
    fallback
  );
}

export function formatCompact(value = 0) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function campaignChatHref(prompt: string) {
  return `/chat?prompt=${encodeURIComponent(prompt)}`;
}

/**
 * Orders the checklist a business works through to take a campaign live, so
 * every surface shows the same "what's next" instead of ad-hoc hints.
 */
export function campaignReadiness(
  campaign: Pick<GtmCampaign, "plan" | "email" | "outreach" | "conversions">,
  linkedPosts: number
) {
  const steps = [
    {
      id: "plan",
      label: "Plan approved",
      done: campaign.plan.funnel.length > 0,
    },
    { id: "content", label: "Content linked", done: linkedPosts > 0 },
    {
      id: "outreach",
      label: "Outreach configured",
      done:
        campaign.email.steps.length > 0 ||
        campaign.outreach.variants.length > 0,
    },
    {
      id: "tracking",
      label: "Conversions tracked",
      done: campaign.conversions.length > 0,
    },
  ];
  return {
    steps,
    completed: steps.filter((step) => step.done).length,
    next: steps.find((step) => !step.done),
  };
}
