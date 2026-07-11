"use client";

import {
  type GtmCampaign,
  type Lead,
  addGtmConversion,
  createGtmCampaign,
  exportGtmReport,
  getGtmAttribution,
  importLeads,
  listGtmCampaigns,
  listLeads,
  makeGtmUtm,
  researchLead,
  runGtmOptimizer,
  scheduleGtmOptimizer,
  scheduleGtmEmail,
  scheduleOutbound,
  searchLeads,
  verifyLead,
} from "@/lib/gtm-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { serverUrlSocket } from "@/utils/apiResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  CalendarDays,
  Link2,
  Mail,
  Download,
  Plus,
  Send,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const CHANNELS = ["instagram", "facebook", "linkedin", "x", "email"];

function money(value = 0) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function splitContacts(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function fullUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${(serverUrlSocket || "http://localhost:8000").replace(/\/$/, "")}${url}`;
}

function errorMessage(error: any) {
  return error?.response?.data?.message || error?.message || "Please try again.";
}

function parseLeadRows(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [email, fullName, title, company, companyUrl] = line
        .split(",")
        .map((item) => item.trim());
      return { email, fullName, title, company, companyUrl };
    })
    .filter((lead) => lead.email);
}

export default function CampaignsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    objective: "",
    audience: "",
    offer: "",
    budget: "",
    channels: ["instagram", "facebook", "email"],
  });
  const [contacts, setContacts] = useState("");
  const [leadRows, setLeadRows] = useState("");
  const [leadSearch, setLeadSearch] = useState({
    provider: "apollo" as "apollo" | "pdl",
    query: "technology startups",
    title: "CTO",
    location: "United States",
    limit: "25",
  });
  const [conversion, setConversion] = useState("");
  const [utmUrl, setUtmUrl] = useState("");
  const [utmResult, setUtmResult] = useState("");
  const [reportUrl, setReportUrl] = useState("");

  const campaignsQuery = useQuery({
    queryKey: ["gtm-campaigns"],
    queryFn: listGtmCampaigns,
  });
  const campaigns = campaignsQuery.data || [];
  const selected = campaigns.find((item) => item._id === selectedId) || campaigns[0];

  const leadsQuery = useQuery({
    queryKey: ["gtm-leads", selected?._id],
    queryFn: () => listLeads(selected?._id),
    enabled: Boolean(selected?._id),
  });
  const leads = leadsQuery.data || [];

  const attributionQuery = useQuery({
    queryKey: ["gtm-attribution", selected?._id],
    queryFn: () => getGtmAttribution(selected!._id),
    enabled: Boolean(selected?._id),
  });
  const attribution = attributionQuery.data;

  const createMutation = useMutation({
    mutationFn: createGtmCampaign,
    onSuccess: (campaign) => {
      qc.invalidateQueries({ queryKey: ["gtm-campaigns"] });
      setSelectedId(campaign._id);
      setForm({
        name: "",
        objective: "",
        audience: "",
        offer: "",
        budget: "",
        channels: ["instagram", "facebook", "email"],
      });
      toast({ title: "Campaign planned" });
    },
    onError: (error: any) =>
      toast({
        title: "Could not create campaign",
        description: errorMessage(error),
        variant: "destructive",
      }),
  });

  const scheduleMutation = useMutation({
    mutationFn: (campaign: GtmCampaign) =>
      scheduleGtmEmail(campaign._id, {
        contacts: splitContacts(contacts || campaign.email.contacts.join(",")),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gtm-campaigns"] });
      toast({ title: "Email sequence scheduled" });
    },
    onError: (error: any) =>
      toast({
        title: "Could not schedule email",
        description: errorMessage(error),
        variant: "destructive",
      }),
  });

  const importLeadsMutation = useMutation({
    mutationFn: () =>
      importLeads({
        campaignId: selected!._id,
        leads: parseLeadRows(leadRows),
      }),
    onSuccess: (leads) => {
      setLeadRows("");
      qc.invalidateQueries({ queryKey: ["gtm-leads", selected?._id] });
      toast({ title: `${leads.length} leads imported` });
    },
    onError: (error: any) =>
      toast({
        title: "Could not import leads",
        description: errorMessage(error),
        variant: "destructive",
      }),
  });

  const searchLeadsMutation = useMutation({
    mutationFn: () =>
      searchLeads({
        campaignId: selected!._id,
        provider: leadSearch.provider,
        query: leadSearch.query,
        titles: leadSearch.title ? [leadSearch.title] : undefined,
        locations: leadSearch.location ? [leadSearch.location] : undefined,
        limit: Number(leadSearch.limit) || 25,
      }),
    onSuccess: (leads) => {
      qc.invalidateQueries({ queryKey: ["gtm-leads", selected?._id] });
      toast({ title: `${leads.length} provider leads added` });
    },
    onError: (error: any) =>
      toast({
        title: "Lead provider unavailable",
        description: errorMessage(error),
        variant: "destructive",
      }),
  });

  const leadActionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "verify" | "research" }) =>
      action === "verify" ? verifyLead(id) : researchLead(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["gtm-leads", selected?._id] }),
    onError: (error: any) =>
      toast({
        title: "Lead action failed",
        description: errorMessage(error),
        variant: "destructive",
      }),
  });

  const outboundMutation = useMutation({
    mutationFn: () =>
      scheduleOutbound({
        campaignId: selected!._id,
        leadIds: leads.map((lead) => lead._id),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gtm-leads", selected?._id] });
      toast({ title: "Personalized outbound scheduled" });
    },
    onError: (error: any) =>
      toast({
        title: "Could not schedule outbound",
        description: errorMessage(error),
        variant: "destructive",
      }),
  });

  const conversionMutation = useMutation({
    mutationFn: () =>
      addGtmConversion(selected!._id, { value: Number(conversion) || 0 }),
    onSuccess: () => {
      setConversion("");
      qc.invalidateQueries({ queryKey: ["gtm-campaigns"] });
      qc.invalidateQueries({ queryKey: ["gtm-attribution", selected?._id] });
      toast({ title: "Conversion tracked" });
    },
    onError: (error: any) =>
      toast({ title: "Could not track conversion", description: errorMessage(error), variant: "destructive" }),
  });

  const optimizeMutation = useMutation({
    mutationFn: () => runGtmOptimizer(selected!._id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gtm-campaigns"] });
      qc.invalidateQueries({ queryKey: ["gtm-attribution", selected?._id] });
      toast({ title: "Optimizer updated recommendations" });
    },
    onError: (error: any) =>
      toast({ title: "Optimizer failed", description: errorMessage(error), variant: "destructive" }),
  });

  const scheduleOptimizerMutation = useMutation({
    mutationFn: () => scheduleGtmOptimizer(selected!._id, 7),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gtm-campaigns"] });
      toast({ title: "Weekly optimizer scheduled" });
    },
    onError: (error: any) =>
      toast({ title: "Could not schedule optimizer", description: errorMessage(error), variant: "destructive" }),
  });

  const utmMutation = useMutation({
    mutationFn: () => makeGtmUtm(selected!._id, { url: utmUrl }),
    onSuccess: setUtmResult,
    onError: (error: any) =>
      toast({ title: "Invalid campaign URL", description: errorMessage(error), variant: "destructive" }),
  });

  const reportMutation = useMutation({
    mutationFn: () => exportGtmReport(selected!._id),
    onSuccess: (report) => {
      setReportUrl(fullUrl(report.url));
      toast({ title: "PDF report ready" });
    },
    onError: (error: any) =>
      toast({ title: "Could not export PDF", description: errorMessage(error), variant: "destructive" }),
  });

  const stats = useMemo(
    () => [
      ["Clicks", attribution?.metrics.clicks || 0],
      ["Conversions", attribution?.conversions || 0],
      ["Value", money(attribution?.conversionValue || 0)],
      [
        "ROI",
        attribution?.roi == null ? "n/a" : `${Math.round(attribution.roi * 100)}%`,
      ],
    ],
    [attribution]
  );

  return (
    <main className='space-y-5'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Campaigns</h1>
          <p className='text-muted-foreground text-sm'>
            Plan campaigns, schedule email, track attribution, and run the optimizer.
          </p>
        </div>
      </div>

      <div className='grid gap-4 xl:grid-cols-[22rem_1fr]'>
        <Card className='rounded-md'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Plus className='h-4 w-4' />
              New Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Input
              placeholder='Campaign name'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Textarea
              placeholder='Objective'
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
            />
            <Input
              placeholder='Audience'
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
            />
            <Input
              placeholder='Offer'
              value={form.offer}
              onChange={(e) => setForm({ ...form, offer: e.target.value })}
            />
            <Input
              type='number'
              placeholder='Budget'
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
            <div className='flex flex-wrap gap-2'>
              {CHANNELS.map((channel) => {
                const active = form.channels.includes(channel);
                return (
                  <button
                    key={channel}
                    type='button'
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        channels: active
                          ? current.channels.filter((item) => item !== channel)
                          : [...current.channels, channel],
                      }))
                    }
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs",
                      active && "border-sky-500 bg-sky-500/10 text-sky-700"
                    )}
                  >
                    {channel}
                  </button>
                );
              })}
            </div>
            <Button
              className='w-full'
              disabled={!form.name || !form.objective || createMutation.isPending}
              onClick={() =>
                createMutation.mutate({
                  ...form,
                  budget: Number(form.budget) || undefined,
                })
              }
            >
              <Target className='mr-2 h-4 w-4' />
              Plan Campaign
            </Button>
          </CardContent>
        </Card>

        <section className='grid gap-4 lg:grid-cols-[18rem_1fr]'>
          <div className='space-y-2'>
            {campaigns.map((campaign) => (
              <button
                key={campaign._id}
                onClick={() => setSelectedId(campaign._id)}
                className={cn(
                  "w-full rounded-md border p-3 text-left text-sm transition",
                  selected?._id === campaign._id
                    ? "border-sky-500 bg-sky-500/10"
                    : "hover:bg-muted/60"
                )}
              >
                <div className='font-medium'>{campaign.name}</div>
                <div className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                  {campaign.objective}
                </div>
              </button>
            ))}
            {!campaigns.length && (
              <div className='text-muted-foreground rounded-md border p-4 text-sm'>
                No campaigns yet.
              </div>
            )}
          </div>

          {selected && (
            <div className='space-y-4'>
              <Card className='rounded-md'>
                <CardHeader>
                  <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
                    <CardTitle className='text-lg'>{selected.name}</CardTitle>
                    <Badge variant='outline'>{selected.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground text-sm'>{selected.plan.summary}</p>
                  <div className='grid gap-3 md:grid-cols-4'>
                    {stats.map(([label, value]) => (
                      <div key={label} className='rounded-md border p-3'>
                        <div className='text-muted-foreground text-xs'>{label}</div>
                        <div className='mt-1 text-xl font-semibold'>{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className='grid gap-4 xl:grid-cols-2'>
                <Card className='rounded-md'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <CalendarDays className='h-4 w-4' />
                      Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {selected.plan.funnel.map((stage) => (
                      <div key={stage.stage} className='space-y-1'>
                        <div className='font-medium'>{stage.stage}</div>
                        <div className='text-muted-foreground text-sm'>{stage.goal}</div>
                        {stage.actions.map((action) => (
                          <div key={action} className='text-sm'>- {action}</div>
                        ))}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className='rounded-md'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <Mail className='h-4 w-4' />
                      Email Sequence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <Textarea
                      placeholder='lead@example.com, buyer@example.com'
                      value={contacts}
                      onChange={(e) => setContacts(e.target.value)}
                    />
                    <div className='space-y-2'>
                      {selected.email.steps.map((step) => (
                        <div key={`${step.delayDays}-${step.subject}`} className='rounded-md border p-3 text-sm'>
                          <div className='flex items-center justify-between gap-2'>
                            <span className='font-medium'>{step.subject}</span>
                            <Badge variant='outline'>day {step.delayDays}</Badge>
                          </div>
                          <p className='text-muted-foreground mt-1 line-clamp-2'>{step.body}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      disabled={scheduleMutation.isPending}
                      onClick={() => scheduleMutation.mutate(selected)}
                    >
                      Schedule Sequence
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className='rounded-md'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Users className='h-4 w-4' />
                    Leads & Outbound
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-3 xl:grid-cols-2'>
                    <div className='space-y-2'>
                      <Textarea
                        placeholder='email, full name, title, company, company URL'
                        value={leadRows}
                        onChange={(e) => setLeadRows(e.target.value)}
                      />
                      <Button
                        variant='outline'
                        disabled={!leadRows || importLeadsMutation.isPending}
                        onClick={() => importLeadsMutation.mutate()}
                      >
                        Import Approved Leads
                      </Button>
                    </div>
                    <div className='grid gap-2 sm:grid-cols-2'>
                      <select
                        className='border-input bg-background rounded-md border px-3 py-2 text-sm'
                        value={leadSearch.provider}
                        onChange={(e) =>
                          setLeadSearch({
                            ...leadSearch,
                            provider: e.target.value as "apollo" | "pdl",
                          })
                        }
                      >
                        <option value='apollo'>Apollo</option>
                        <option value='pdl'>People Data Labs</option>
                      </select>
                      <Input
                        placeholder='Limit'
                        value={leadSearch.limit}
                        onChange={(e) =>
                          setLeadSearch({ ...leadSearch, limit: e.target.value })
                        }
                      />
                      <Input
                        placeholder='ICP / industry'
                        value={leadSearch.query}
                        onChange={(e) =>
                          setLeadSearch({ ...leadSearch, query: e.target.value })
                        }
                      />
                      <Input
                        placeholder='Title'
                        value={leadSearch.title}
                        onChange={(e) =>
                          setLeadSearch({ ...leadSearch, title: e.target.value })
                        }
                      />
                      <Input
                        className='sm:col-span-2'
                        placeholder='Location'
                        value={leadSearch.location}
                        onChange={(e) =>
                          setLeadSearch({
                            ...leadSearch,
                            location: e.target.value,
                          })
                        }
                      />
                      <Button
                        className='sm:col-span-2'
                        disabled={searchLeadsMutation.isPending}
                        onClick={() => searchLeadsMutation.mutate()}
                      >
                        Find Provider Leads
                      </Button>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <p className='text-muted-foreground text-sm'>
                      {leads.length} lead{leads.length === 1 ? "" : "s"} attached
                    </p>
                    <Button
                      disabled={!leads.length || outboundMutation.isPending}
                      onClick={() => outboundMutation.mutate()}
                    >
                      <Send className='mr-2 h-4 w-4' />
                      Schedule Personalized Outbound
                    </Button>
                  </div>

                  <div className='grid gap-2'>
                    {leads.slice(0, 12).map((lead: Lead) => (
                      <div
                        key={lead._id}
                        className='grid gap-2 rounded-md border p-3 text-sm md:grid-cols-[1fr_auto]'
                      >
                        <div>
                          <div className='font-medium'>
                            {lead.fullName}{" "}
                            <span className='text-muted-foreground font-normal'>
                              {lead.title ? `- ${lead.title}` : ""}
                            </span>
                          </div>
                          <div className='text-muted-foreground text-xs'>
                            {lead.email} {lead.company ? `- ${lead.company}` : ""}
                          </div>
                          {lead.research && (
                            <p className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                              {lead.research}
                            </p>
                          )}
                        </div>
                        <div className='flex flex-wrap items-center gap-2'>
                          <Badge variant='outline'>{lead.emailStatus}</Badge>
                          <Badge variant='outline'>{lead.status}</Badge>
                          <Button
                            size='sm'
                            variant='outline'
                            disabled={leadActionMutation.isPending}
                            onClick={() =>
                              leadActionMutation.mutate({
                                id: lead._id,
                                action: "verify",
                              })
                            }
                          >
                            Verify
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            disabled={leadActionMutation.isPending}
                            onClick={() =>
                              leadActionMutation.mutate({
                                id: lead._id,
                                action: "research",
                              })
                            }
                          >
                            Research
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className='grid gap-4 xl:grid-cols-2'>
                <Card className='rounded-md'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <BarChart3 className='h-4 w-4' />
                      Attribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex gap-2'>
                      <Input
                        type='number'
                        placeholder='Conversion value'
                        value={conversion}
                        onChange={(e) => setConversion(e.target.value)}
                      />
                      <Button
                        disabled={!conversion || conversionMutation.isPending}
                        onClick={() => conversionMutation.mutate()}
                      >
                        Track
                      </Button>
                    </div>
                    <div className='flex gap-2'>
                      <Input
                        placeholder='https://example.com/landing'
                        value={utmUrl}
                        onChange={(e) => setUtmUrl(e.target.value)}
                      />
                      <Button
                        variant='outline'
                        disabled={!utmUrl || utmMutation.isPending}
                        onClick={() => utmMutation.mutate()}
                      >
                        <Link2 className='h-4 w-4' />
                      </Button>
                    </div>
                    {utmResult && (
                      <p className='break-all rounded-md border p-3 text-xs'>{utmResult}</p>
                    )}
                  </CardContent>
                </Card>

                <Card className='rounded-md'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-base'>
                      <Sparkles className='h-4 w-4' />
                      Optimizer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex flex-wrap gap-2'>
                      <Button
                        disabled={optimizeMutation.isPending}
                        onClick={() => optimizeMutation.mutate()}
                      >
                        Run Optimizer
                      </Button>
                      <Button
                        variant='outline'
                        disabled={scheduleOptimizerMutation.isPending}
                        onClick={() => scheduleOptimizerMutation.mutate()}
                      >
                        Schedule Weekly
                      </Button>
                      <Button
                        variant='outline'
                        disabled={reportMutation.isPending}
                        onClick={() => reportMutation.mutate()}
                      >
                        <Download className='mr-2 h-4 w-4' />
                        Export PDF
                      </Button>
                    </div>
                    {reportUrl && (
                      <a
                        href={reportUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='text-foreground inline-flex text-xs underline-offset-2 hover:underline'
                      >
                        View report
                      </a>
                    )}
                    {selected.recommendations.map((rec) => (
                      <div key={`${rec.title}-${rec.action}`} className='rounded-md border p-3 text-sm'>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='font-medium'>{rec.title}</span>
                          <Badge variant={rec.priority === "high" ? "destructive" : "outline"}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className='text-muted-foreground mt-1'>{rec.action}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
