"use client";

import { MetricStrip } from "../campaigns/_components/campaign-ui";
import { AddLeadDialog } from "./_components/add-lead-dialog";
import { LeadSheet } from "./_components/lead-sheet";
import { PipelineBoard } from "./_components/pipeline-board";
import { PipelineReportView } from "./_components/pipeline-report";
import { PipelineSetup } from "./_components/pipeline-setup";
import { formatMinutes, pipelineKeys } from "./_components/pipeline-utils";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIntegrations } from "@/hooks/use-integrations";
import { formatCompact } from "@/lib/campaign-utils";
import { getPipelineReport, listPipeline } from "@/lib/pipeline-api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon, PlusSignIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const TABS = [
  { value: "board", label: "Board" },
  { value: "report", label: "Funnel" },
  { value: "setup", label: "Setup" },
] as const;
type Tab = (typeof TABS)[number]["value"];

function PipelinePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { orgId } = useIntegrations();
  const tab = (TABS.find((t) => t.value === params.get("tab"))?.value || "board") as Tab;
  const selected = params.get("lead") || "";
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(query.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const leads = useQuery({
    queryKey: pipelineKeys.list(orgId, debounced),
    queryFn: () => listPipeline({ q: debounced || undefined }),
    enabled: Boolean(orgId),
    refetchInterval: 30_000,
  });
  const report = useQuery({
    queryKey: pipelineKeys.report(orgId, 30),
    queryFn: () => getPipelineReport(30),
    enabled: Boolean(orgId),
    refetchInterval: 60_000,
  });

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/visuals/pipeline${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const r = report.data;
  const refreshing = leads.isFetching || report.isFetching;

  return (
    <div className='min-h-[calc(100dvh-8rem)] space-y-6 pb-8'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>
            <LocalizedText text='Pipeline' />
          </h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Every enquiry from your inbox, forms and lead ads — qualified, followed up and booked by Genit.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              void leads.refetch();
              void report.refetch();
            }}
            disabled={refreshing}
            aria-label='Refresh pipeline'
            title='Refresh'
          >
            <HugeiconsIcon icon={RefreshIcon} className={cn(refreshing && "animate-spin")} />
          </Button>
          <Button onClick={() => setAdding(true)}>
            <HugeiconsIcon icon={PlusSignIcon} /> Add lead
          </Button>
        </div>
      </header>

      <MetricStrip
        metrics={[
          { label: "New enquiries (30d)", value: r ? r.totals.captured : "—" },
          { label: "Qualified", value: r ? r.totals.qualified : "—" },
          {
            label: "Booked",
            value: r ? r.totals.booked : "—",
            hint: r ? `${r.totals.bookingRate}% of enquiries` : undefined,
          },
          {
            label: "Won",
            value: r ? formatCompact(r.totals.wonValue) : "—",
            hint: r ? `${r.totals.won} deal${r.totals.won === 1 ? "" : "s"}` : undefined,
          },
          {
            label: "Median first reply",
            value: r ? formatMinutes(r.speedToLead.medianMinutes) : "—",
            hint: r?.speedToLead.responded ? `${r.speedToLead.within5MinutesPct}% within 5 min` : undefined,
          },
        ]}
      />

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <nav aria-label='Pipeline views' className='flex gap-1'>
          {TABS.map((item) => (
            <button
              key={item.value}
              type='button'
              onClick={() => setParam("tab", item.value === "board" ? undefined : item.value)}
              aria-pressed={tab === item.value}
              className={cn(
                "rounded-md px-2.5 py-1 text-sm whitespace-nowrap transition-colors",
                tab === item.value
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-white/10 dark:text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {tab === "board" && (
          <div className='relative w-full sm:w-64'>
            <HugeiconsIcon icon={Search01Icon} className='text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2' />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search name, email, phone'
              aria-label='Search leads'
              className='h-8 pl-8 text-sm'
            />
          </div>
        )}
      </div>

      {tab === "board" && (
        <PipelineBoard
          leads={leads.data || []}
          loading={leads.isLoading}
          searching={Boolean(debounced)}
          onOpen={(id) => setParam("lead", id)}
          onSetup={() => setParam("tab", "setup")}
        />
      )}
      {tab === "report" && <PipelineReportView onOpen={(id) => setParam("lead", id)} />}
      {tab === "setup" && <PipelineSetup />}

      <LeadSheet leadId={selected} onClose={() => setParam("lead")} />
      <AddLeadDialog
        open={adding}
        onOpenChange={setAdding}
        onCreated={(id) => setParam("lead", id)}
      />
    </div>
  );
}

export default function PipelinePage() {
  return (
    <Suspense>
      <PipelinePageInner />
    </Suspense>
  );
}
