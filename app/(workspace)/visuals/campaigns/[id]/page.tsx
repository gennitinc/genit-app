"use client";

import { CampaignContent } from "../_components/campaign-content";
import { CampaignOutreach } from "../_components/campaign-outreach";
import { CampaignOverview } from "../_components/campaign-overview";
import { CampaignPerformance } from "../_components/campaign-performance";
import {
  Empty,
  StatusDot,
  tabListClass,
  tabTriggerClass,
} from "../_components/campaign-ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  campaignKeys,
  useCampaign,
  useCampaignAttribution,
  useCampaignPosts,
} from "@/hooks/use-campaigns";
import { useIntegrations } from "@/hooks/use-integrations";
import { campaignChatHref, campaignError } from "@/lib/campaign-utils";
import { exportGtmReport } from "@/lib/gtm-api";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  FileDown,
  Loader2,
  MessageSquareText,
} from "lucide-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

const TABS = ["overview", "content", "performance", "outreach"] as const;
type Tab = (typeof TABS)[number];

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { orgId } = useIntegrations();
  const requestedTab = searchParams.get("tab") as Tab | null;
  const tab: Tab =
    requestedTab && TABS.includes(requestedTab) ? requestedTab : "overview";
  const [exporting, setExporting] = useState(false);

  const campaignQuery = useCampaign(id);
  const postsQuery = useCampaignPosts(id);
  const attributionQuery = useCampaignAttribution(id, tab === "performance");
  const campaign = campaignQuery.data;

  function setTab(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "overview") params.delete("tab");
    else params.set("tab", next);
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  function refresh() {
    return queryClient.invalidateQueries({
      queryKey: campaignKeys.detail(orgId, id),
    });
  }

  async function exportReport() {
    setExporting(true);
    try {
      const report = await exportGtmReport(id);
      window.open(report.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(campaignError(error, "Report could not be exported"));
    } finally {
      setExporting(false);
    }
  }

  if (campaignQuery.isLoading || !orgId) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-8 w-72' />
        <Skeleton className='h-10 w-full rounded-none' />
        <Skeleton className='h-64 w-full' />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className='space-y-4'>
        <Breadcrumb />
        <Empty
          action={
            <Button asChild variant='outline' size='sm'>
              <Link href='/visuals/campaigns'>All campaigns</Link>
            </Button>
          }
        >
          {campaignError(
            campaignQuery.error,
            "This campaign doesn't exist or was deleted."
          )}
        </Empty>
      </div>
    );
  }

  const linkedPosts = postsQuery.data?.pagination.total || 0;
  const meta = [
    campaign.channels.slice(0, 4).join(", "),
    campaign.timeline,
    `Created ${new Date(campaign.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`,
  ].filter(Boolean);

  return (
    <div className='space-y-6 pb-10'>
      <header className='space-y-3'>
        <Breadcrumb name={campaign.name} />
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='max-w-3xl min-w-0'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              {campaign.name}
            </h1>
            <div className='text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs capitalize'>
              <StatusDot status={campaign.status} className='text-foreground' />
              {meta.map((item) => (
                <span
                  key={item}
                  className='flex items-center gap-2 normal-case'
                >
                  <span aria-hidden>·</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => void exportReport()}
              disabled={exporting}
            >
              {exporting ? <Loader2 className='animate-spin' /> : <FileDown />}
              Export PDF
            </Button>
            <Button asChild variant='outline' size='sm'>
              <Link
                href={
                  campaign.chatId
                    ? `/chat/${campaign.chatId}`
                    : campaignChatHref(
                        `Help me improve my campaign "${campaign.name}" (id ${campaign._id}).`
                      )
                }
              >
                <MessageSquareText />
                {campaign.chatId ? "Open chat" : "Ask Genit"}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className={tabListClass}>
          <TabsTrigger value='overview' className={tabTriggerClass}>
            Overview
          </TabsTrigger>
          <TabsTrigger value='content' className={tabTriggerClass}>
            Content
            {linkedPosts > 0 && (
              <span className='ml-1.5 text-xs font-normal tabular-nums opacity-60'>
                {linkedPosts}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value='performance' className={tabTriggerClass}>
            Performance
          </TabsTrigger>
          <TabsTrigger value='outreach' className={tabTriggerClass}>
            Outreach
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='mt-8'>
          <CampaignOverview
            campaign={campaign}
            linkedPosts={linkedPosts}
            onNavigate={setTab}
          />
        </TabsContent>
        <TabsContent value='content' className='mt-8'>
          <CampaignContent
            campaignId={campaign._id}
            posts={postsQuery.data?.posts || []}
            total={linkedPosts}
            loading={postsQuery.isLoading}
          />
        </TabsContent>
        <TabsContent value='performance' className='mt-8'>
          <CampaignPerformance
            campaign={campaign}
            attribution={attributionQuery.data}
            loading={attributionQuery.isLoading}
            onChanged={refresh}
          />
        </TabsContent>
        {/* Stay mounted so unsaved variant edits survive tab switches. */}
        <TabsContent
          value='outreach'
          forceMount
          className='mt-8 data-[state=inactive]:hidden'
        >
          <CampaignOutreach
            key={campaign._id}
            campaign={campaign}
            onChanged={refresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Breadcrumb({ name }: { name?: string }) {
  return (
    <nav
      aria-label='Breadcrumb'
      className='text-muted-foreground flex items-center gap-1 text-xs'
    >
      <Link href='/visuals/campaigns' className='hover:text-foreground'>
        Campaigns
      </Link>
      {name && (
        <>
          <ChevronRight className='size-3' />
          <span className='text-foreground max-w-xs truncate'>{name}</span>
        </>
      )}
    </nav>
  );
}
