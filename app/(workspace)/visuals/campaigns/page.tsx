"use client";

import {
  Empty,
  MetricStrip,
  StatusDot,
  rowClass,
  tableClass,
  theadClass,
} from "./_components/campaign-ui";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntegrations } from "@/hooks/use-integrations";
import {
  campaignChatHref,
  campaignError,
  formatCompact,
} from "@/lib/campaign-utils";
import {
  type GtmCampaign,
  type GtmCampaignPage,
  deleteGtmCampaign,
  listGtmCampaigns,
} from "@/lib/gtm-api";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

type CampaignStatus = GtmCampaign["status"];
const PAGE_SIZE = 12;
const NEW_CAMPAIGN_PROMPT = "Help me create a new GTM campaign.";
const FILTERS: Array<{ value: "all" | CampaignStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Drafts" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

function campaignValue(campaign: GtmCampaign) {
  return campaign.conversions.reduce(
    (total, conversion) => total + Number(conversion.value || 0),
    0
  );
}

function shortDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      new Date(value).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  });
}

export default function CampaignsPage() {
  const router = useRouter();
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

  const firstLoad = loading && !campaigns.length;
  const needsSequence = summary.totalCampaigns - summary.sequencesReady;

  return (
    <div className='min-h-[calc(100dvh-8rem)] space-y-8 pb-8'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>
            <LocalizedText text='Campaigns' />
          </h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            {summary.totalCampaigns
              ? `${summary.totalCampaigns} campaign${summary.totalCampaigns === 1 ? "" : "s"} · ${summary.activeCampaigns} running`
              : "Plan, publish and measure campaigns in one place."}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => void loadCampaigns()}
            disabled={loading}
            aria-label='Refresh campaigns'
            title='Refresh'
          >
            <RefreshCw className={cn(loading && "animate-spin")} />
          </Button>
          <Button asChild>
            <Link href={campaignChatHref(NEW_CAMPAIGN_PROMPT)}>
              <Plus /> New campaign
            </Link>
          </Button>
        </div>
      </header>

      {summary.totalCampaigns > 0 && (
        <MetricStrip
          metrics={[
            { label: "Running", value: summary.activeCampaigns },
            { label: "Drafts", value: summary.draftCampaigns },
            {
              label: "Attributed revenue",
              value: formatCompact(summary.pipelineValue),
            },
            { label: "Conversions", value: summary.conversions },
            {
              label: "Without a follow-up sequence",
              value: needsSequence,
            },
          ]}
        />
      )}

      <section className='space-y-3'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <nav
            aria-label='Filter by status'
            className='flex gap-1 overflow-x-auto'
          >
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type='button'
                onClick={() => {
                  setStatus(filter.value);
                  setPage(1);
                }}
                aria-pressed={status === filter.value}
                className={cn(
                  "rounded-md px-2.5 py-1 text-sm whitespace-nowrap transition-colors",
                  status === filter.value
                    ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-white/10 dark:text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </nav>
          <div className='relative w-full sm:w-64'>
            <Search className='text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2' />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder='Search'
              aria-label='Search campaigns'
              className='h-8 pl-8 text-sm'
            />
          </div>
        </div>

        {firstLoad ? (
          <div className='space-y-px border-t'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className='h-14 rounded-none' />
            ))}
          </div>
        ) : campaigns.length ? (
          <div
            className={cn(
              "overflow-x-auto transition-opacity",
              loading && "opacity-60"
            )}
          >
            <table className={cn(tableClass, "min-w-[760px]")}>
              <thead className={theadClass}>
                <tr>
                  <th>Campaign</th>
                  <th className='w-28'>Status</th>
                  <th className='w-44'>Channels</th>
                  <th className='w-24 text-right'>Revenue</th>
                  <th className='w-24 text-right'>Conversions</th>
                  <th className='w-24 text-right'>Created</th>
                  <th className='w-20' />
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => {
                  const href = `/visuals/campaigns/${campaign._id}`;
                  return (
                    <tr
                      key={campaign._id}
                      onClick={() => router.push(href)}
                      className={cn(
                        rowClass,
                        "group cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/[0.03]"
                      )}
                    >
                      <td className='max-w-0'>
                        <Link
                          href={href}
                          onClick={(event) => event.stopPropagation()}
                          className='block truncate font-medium focus-visible:underline focus-visible:outline-none'
                        >
                          {campaign.name}
                        </Link>
                        <p className='text-muted-foreground mt-0.5 truncate text-xs'>
                          {campaign.objective}
                        </p>
                      </td>
                      <td>
                        <StatusDot status={campaign.status} />
                      </td>
                      <td className='text-muted-foreground truncate text-xs capitalize'>
                        {campaign.channels.slice(0, 3).join(", ") || "—"}
                        {campaign.channels.length > 3 &&
                          ` +${campaign.channels.length - 3}`}
                      </td>
                      <td className='text-right tabular-nums'>
                        {formatCompact(campaignValue(campaign))}
                      </td>
                      <td className='text-right tabular-nums'>
                        {campaign.conversions.length}
                      </td>
                      <td className='text-muted-foreground text-right text-xs whitespace-nowrap'>
                        {shortDate(campaign.createdAt)}
                      </td>
                      <td>
                        <div className='flex justify-end gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'>
                          {campaign.chatId && (
                            <Button
                              asChild
                              variant='ghost'
                              size='icon'
                              className='size-7'
                            >
                              <Link
                                href={`/chat/${campaign.chatId}`}
                                onClick={(event) => event.stopPropagation()}
                                aria-label={`Open chat for ${campaign.name}`}
                                title='Open chat'
                              >
                                <MessageSquareText />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-muted-foreground size-7 hover:text-red-600'
                            onClick={(event) => {
                              event.stopPropagation();
                              setCampaignToDelete(campaign);
                            }}
                            aria-label={`Delete ${campaign.name}`}
                            title='Delete'
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : summary.totalCampaigns ? (
          <Empty>No campaigns match this filter.</Empty>
        ) : (
          <div className='border-t py-16'>
            <h2 className='text-base font-semibold'>No campaigns yet</h2>
            <p className='text-muted-foreground mt-1 max-w-md text-sm'>
              Describe what you want to sell and to whom. Genit researches the
              market, drafts the plan, and the campaign appears here.
            </p>
            <Button asChild className='mt-5'>
              <Link href={campaignChatHref(NEW_CAMPAIGN_PROMPT)}>
                <Plus /> New campaign
              </Link>
            </Button>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className='flex items-center justify-between gap-4 pt-1'>
            <p className='text-muted-foreground text-xs tabular-nums'>
              {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total}
            </p>
            <div className='flex gap-1'>
              <Button
                variant='ghost'
                size='icon'
                className='size-8'
                onClick={() => setPage(pagination.page - 1)}
                disabled={!pagination.hasPreviousPage || loading}
                aria-label='Previous page'
              >
                <ChevronLeft />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='size-8'
                onClick={() => setPage(pagination.page + 1)}
                disabled={!pagination.hasNextPage || loading}
                aria-label='Next page'
              >
                <ChevronRight />
              </Button>
            </div>
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
