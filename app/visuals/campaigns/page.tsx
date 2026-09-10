"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntegrations } from "@/hooks/use-integrations";
import { campaignError } from "@/lib/campaign-utils";
import {
  type GtmCampaign,
  type GtmCampaignPage,
  deleteGtmCampaign,
  listGtmCampaigns,
} from "@/lib/gtm-api";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Layers3,
  MessageSquareText,
  RefreshCw,
  Search,
  Target,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Fragment, useCallback, useEffect, useState } from "react";

type CampaignStatus = GtmCampaign["status"];
const PAGE_SIZE = 8;

function compact(value = 0) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function chatHref(prompt: string) {
  return `/chat?prompt=${encodeURIComponent(prompt)}`;
}

function campaignValue(campaign: GtmCampaign) {
  return campaign.conversions.reduce(
    (total, conversion) => total + Number(conversion.value || 0),
    0
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Activity;
}) {
  return (
    <div className='bg-background min-w-0 rounded-2xl border border-black/5 p-5 shadow-xs dark:border-white/10'>
      <div className='flex items-start justify-between gap-3'>
        <p className='text-muted-foreground text-sm font-medium'>{label}</p>
        <Icon className='text-muted-foreground size-4 shrink-0' />
      </div>
      <p className='mt-6 text-3xl font-semibold tracking-tight'>{value}</p>
      <p className='mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
        {detail}
      </p>
    </div>
  );
}

export default function CampaignsPage() {
  const { orgId } = useIntegrations();
  const [campaigns, setCampaigns] = useState<GtmCampaign[]>([]);
  const [summary, setSummary] = useState<GtmCampaignPage["summary"]>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    draftCampaigns: 0,
    pipelineValue: 0,
    conversions: 0,
    sequencesReady: 0,
  });
  const [pagination, setPagination] = useState<GtmCampaignPage["pagination"]>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [status, setStatus] = useState<"all" | CampaignStatus>("all");
  const [campaignToDelete, setCampaignToDelete] = useState<GtmCampaign | null>(
    null
  );
  const [deletingId, setDeletingId] = useState("");
  const [openPerformanceId, setOpenPerformanceId] = useState("");
  const [page, setPage] = useState(1);

  const loadCampaigns = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const result = await listGtmCampaigns({
        page,
        limit: PAGE_SIZE,
        search: debouncedQuery,
        status,
      });
      setCampaigns(result.campaigns);
      setPagination(result.pagination);
      setSummary(result.summary);
    } catch (error) {
      toast.error(campaignError(error, "Campaigns could not be loaded"));
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, orgId, page, status]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    void loadCampaigns();
    const refresh = () => void loadCampaigns();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [loadCampaigns]);

  async function deleteCampaign() {
    if (!campaignToDelete) return;
    setDeletingId(campaignToDelete._id);
    try {
      await deleteGtmCampaign(campaignToDelete._id);
      toast.success(`“${campaignToDelete.name}” deleted`);
      setCampaignToDelete(null);
      if (campaigns.length === 1 && pagination.hasPreviousPage) {
        setPage((current) => current - 1);
      } else {
        await loadCampaigns();
      }
    } catch (error) {
      toast.error(campaignError(error, "Campaign could not be deleted"));
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className='animate-in fade-in slide-in-from-bottom-2 min-h-[calc(100dvh-8rem)] space-y-8 pb-8 duration-300 motion-reduce:animate-none'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='text-2xl font-bold tracking-tight'>
            <LocalizedText text='Campaign Dashboard' />
          </h1>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => void loadCampaigns()}
            disabled={loading}
            aria-label='Refresh campaigns'
            title='Refresh campaigns'
            className='active:scale-[0.97]'
          >
            <RefreshCw className={cn(loading && "animate-spin")} />
          </Button>
          <Button asChild className='active:scale-[0.97]'>
            <Link href={chatHref("Help me create a new GTM campaign.")}>
              <MessageSquareText /> Create in chat
            </Link>
          </Button>
        </div>
      </header>

      <section>
        <h2 className='text-muted-foreground mb-4 text-sm font-semibold'>
          Performance metrics
        </h2>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-5'>
          <MetricCard
            label='Total campaigns'
            value={String(summary.totalCampaigns)}
            detail={`${summary.activeCampaigns} active`}
            icon={Layers3}
          />
          <MetricCard
            label='Active campaigns'
            value={String(summary.activeCampaigns)}
            detail={`${summary.draftCampaigns} drafts ready`}
            icon={Activity}
          />
          <MetricCard
            label='Pipeline Generated value'
            value={compact(summary.pipelineValue)}
            detail='Attributed across '
            icon={CircleDollarSign}
          />
          <MetricCard
            label='Conversions Records'
            value={String(summary.conversions)}
            detail='Recorded outcomes'
            icon={Target}
          />
          <MetricCard
            label='Sequences ready'
            value={String(summary.sequencesReady)}
            detail={`${summary.totalCampaigns - summary.sequencesReady} need a sequence`}
            icon={MessageSquareText}
          />
        </div>
      </section>

      <section>
        <div className='flex flex-wrap items-center gap-2 rounded-t-lg border border-b-0 bg-zinc-50/80 p-3 dark:bg-zinc-900/60'>
          <div className='flex w-full flex-row items-center gap-2 sm:w-auto'>
            <Select
              value={status}
              onValueChange={(value: "all" | CampaignStatus) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className='w-[150px] rounded-md bg-white dark:bg-zinc-950'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All campaigns</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='paused'>Paused</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className='relative w-full sm:w-64'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder='Search campaigns'
                className='pl-9'
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className='space-y-2'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='h-24 rounded-xl' />
            ))}
          </div>
        ) : campaigns.length ? (
          <div className='overflow-hidden rounded-b-lg border border-black/5 bg-white shadow-xs dark:border-white/10 dark:bg-zinc-950'>
            <div className='max-h-[520px] overflow-auto'>
              <table className='w-full min-w-[680px] border-collapse text-left'>
                <thead className='sr-only'>
                  <tr>
                    <th>Campaign</th>
                    <th>Performance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => {
                    const performanceOpen = openPerformanceId === campaign._id;
                    return (
                      <Fragment key={campaign._id}>
                        <tr className='border-t first:border-t-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30'>
                          <td className='px-4'>
                            <div className='flex min-w-0 items-center gap-3'>
                              <h3 className='max-w-md truncate text-sm font-semibold'>
                                {campaign.name}
                              </h3>
                            </div>
                          </td>
                          <td className='px-5 py-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='active:scale-[0.97]'
                              onClick={() =>
                                setOpenPerformanceId(
                                  performanceOpen ? "" : campaign._id
                                )
                              }
                              aria-expanded={performanceOpen}
                              aria-controls={`performance-${campaign._id}`}
                            >
                              View
                              <ChevronDown
                                className={cn(
                                  "transition-transform duration-150",
                                  performanceOpen && "rotate-180"
                                )}
                              />
                            </Button>
                          </td>
                          <td className='px-5 py-2'>
                            <div className='flex justify-end gap-2'>
                              {campaign.chatId ? (
                                <Button
                                  asChild
                                  variant='outline'
                                  size='sm'
                                  className='active:scale-[0.97]'
                                >
                                  <Link href={`/chat/${campaign.chatId}`}>
                                    View in chat <ArrowUpRight />
                                  </Link>
                                </Button>
                              ) : (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  disabled
                                  title='No linked chat exists for this campaign'
                                >
                                  No linked chat
                                </Button>
                              )}
                              <Button
                                variant='ghost'
                                size='icon'
                                className='text-muted-foreground hover:bg-red-50 hover:text-red-600 active:scale-[0.97] dark:hover:bg-red-950/40'
                                onClick={() => setCampaignToDelete(campaign)}
                                aria-label={`Delete ${campaign.name}`}
                                title='Delete campaign'
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {performanceOpen && (
                          <tr id={`performance-${campaign._id}`}>
                            <td
                              colSpan={3}
                              className='border-t bg-zinc-50/70 px-5 py-4 dark:bg-zinc-900/40'
                            >
                              <div className='grid grid-cols-4 gap-2'>
                                {[
                                  [
                                    "Pipeline value",
                                    compact(campaignValue(campaign)),
                                  ],
                                  ["Conversions", campaign.conversions.length],
                                  [
                                    "Sequence steps",
                                    campaign.email.steps.length,
                                  ],
                                  [
                                    "Recommendations",
                                    campaign.recommendations.length,
                                  ],
                                ].map(([label, value]) => (
                                  <div
                                    key={label}
                                    className='rounded-lg border bg-white p-3 dark:bg-zinc-950'
                                  >
                                    <p className='text-muted-foreground text-[10px] font-medium uppercase'>
                                      {label}
                                    </p>
                                    <p className='mt-1 text-lg font-semibold'>
                                      {value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className='flex items-center justify-between gap-4 border-t px-5 py-3'>
              <p className='text-muted-foreground text-xs'>
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </p>
              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground text-xs'>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8 active:scale-[0.97]'
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={!pagination.hasPreviousPage || loading}
                  aria-label='Previous page'
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8 active:scale-[0.97]'
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  aria-label='Next page'
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        ) : summary.totalCampaigns ? (
          <div className='rounded-2xl border border-dashed px-6 py-16 text-center'>
            <p className='text-sm font-medium'>No matching campaigns</p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Try another search or campaign status.
            </p>
          </div>
        ) : (
          <div className='rounded-2xl border border-dashed px-6 py-16 text-center'>
            <MessageSquareText className='text-muted-foreground mx-auto size-7' />
            <h3 className='mt-3 text-sm font-semibold'>No campaigns yet</h3>
            <p className='text-muted-foreground mx-auto mt-1 max-w-sm text-xs'>
              Start in chat. Genit will create the campaign and add it to this
              dashboard.
            </p>
            <Button asChild size='sm' className='mt-4 active:scale-[0.97]'>
              <Link href={chatHref("Help me create a new GTM campaign.")}>
                Create in chat
              </Link>
            </Button>
          </div>
        )}
      </section>

      <DeleteConfirmDialog
        open={Boolean(campaignToDelete)}
        onOpenChange={(open) => !open && setCampaignToDelete(null)}
        description={
          <>
            “{campaignToDelete?.name}” and its campaign leads will be
            permanently deleted. Pending sends and optimizations will be
            cancelled. This action cannot be undone.
          </>
        }
        onConfirm={() => void deleteCampaign()}
        loading={Boolean(deletingId)}
        confirmLabel='Delete campaign'
      />
    </div>
  );
}
