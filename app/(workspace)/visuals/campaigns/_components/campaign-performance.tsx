"use client";

import { Empty, MetricStrip, Section } from "./campaign-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { campaignError, formatCompact } from "@/lib/campaign-utils";
import {
  type GtmAttribution,
  type GtmCampaign,
  addGtmConversion,
  makeGtmUtm,
  runGtmOptimizer,
  scheduleGtmOptimizer,
  updateGtmCampaign,
} from "@/lib/gtm-api";
import { cn } from "@/lib/utils";
import { apiOrigin } from "@/utils/apiResponse";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { type FormEvent, type ReactNode, useState } from "react";

type Props = {
  campaign: GtmCampaign;
  attribution?: GtmAttribution;
  loading: boolean;
  onChanged: () => Promise<unknown>;
};

const PRIORITY_TONE = {
  high: "text-red-600 dark:text-red-400",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-muted-foreground",
} as const;

async function copy(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Copy failed. Select the text and copy it manually.");
  }
}

export function CampaignPerformance({
  campaign,
  attribution,
  loading,
  onChanged,
}: Props) {
  const [optimizing, setOptimizing] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [conversionValue, setConversionValue] = useState("");
  const [conversionSource, setConversionSource] = useState("");
  const [recording, setRecording] = useState(false);
  const [utmInput, setUtmInput] = useState({
    url: "",
    source: "",
    medium: "",
  });
  const [utmUrl, setUtmUrl] = useState("");
  const [building, setBuilding] = useState(false);
  const [updatingRecommendation, setUpdatingRecommendation] = useState(-1);

  const metrics = attribution?.metrics;
  const engagement = metrics
    ? metrics.likes + metrics.comments + metrics.shares
    : 0;
  const roi =
    attribution?.roi === null || attribution?.roi === undefined
      ? "—"
      : `${Math.round(attribution.roi * 100)}%`;
  const value = (content: string) =>
    loading ? <Skeleton className='mt-1 h-6 w-14' /> : content;
  const tiles = [
    {
      label: "Reach",
      value: value(formatCompact(metrics?.impressions || metrics?.views || 0)),
      hint: attribution
        ? `${attribution.postCount} linked post${attribution.postCount === 1 ? "" : "s"}`
        : undefined,
    },
    { label: "Clicks", value: value(formatCompact(metrics?.clicks || 0)) },
    { label: "Engagement", value: value(formatCompact(engagement)) },
    {
      label: "Conversions",
      value: value(String(attribution?.conversions || 0)),
    },
    {
      label: "Revenue",
      value: value(formatCompact(attribution?.conversionValue || 0)),
    },
    {
      label: "ROI",
      value: value(roi),
      hint: attribution?.spend
        ? `On ${formatCompact(attribution.spend)} budget`
        : "Add a budget to calculate",
    },
  ];
  const openRecommendations = campaign.recommendations
    .map((recommendation, index) => ({ recommendation, index }))
    .filter(({ recommendation }) => recommendation.status === "open");
  const webhookUrl = `${apiOrigin}/api/v1/gtm/public/campaigns/${campaign._id}/conversions`;

  async function optimize() {
    setOptimizing(true);
    try {
      const result = await runGtmOptimizer(campaign._id);
      toast.success(
        result.recommendations.length
          ? `${result.recommendations.length} new recommendation${result.recommendations.length === 1 ? "" : "s"}`
          : "No new recommendations. The campaign is on track."
      );
      await onChanged();
    } catch (error) {
      toast.error(campaignError(error, "Optimizer could not run"));
    } finally {
      setOptimizing(false);
    }
  }

  async function scheduleWeekly() {
    setScheduling(true);
    try {
      await scheduleGtmOptimizer(campaign._id, 7);
      toast.success("Weekly optimization scheduled");
      await onChanged();
    } catch (error) {
      toast.error(campaignError(error, "Optimization could not be scheduled"));
    } finally {
      setScheduling(false);
    }
  }

  async function recordConversion(event: FormEvent) {
    event.preventDefault();
    const value = Number(conversionValue);
    if (!Number.isFinite(value) || value < 0) {
      toast.error("Enter a conversion value of 0 or more");
      return;
    }
    setRecording(true);
    try {
      await addGtmConversion(campaign._id, {
        value,
        source: conversionSource.trim() || "manual",
      });
      setConversionValue("");
      setConversionSource("");
      toast.success("Conversion recorded");
      await onChanged();
    } catch (error) {
      toast.error(campaignError(error, "Conversion could not be recorded"));
    } finally {
      setRecording(false);
    }
  }

  async function buildUtm(event: FormEvent) {
    event.preventDefault();
    setBuilding(true);
    try {
      setUtmUrl(
        await makeGtmUtm(campaign._id, {
          url: utmInput.url.trim(),
          source: utmInput.source.trim() || undefined,
          medium: utmInput.medium.trim() || undefined,
        })
      );
    } catch (error) {
      toast.error(campaignError(error, "Tracking link could not be built"));
    } finally {
      setBuilding(false);
    }
  }

  async function setRecommendationStatus(
    index: number,
    status: "done" | "dismissed"
  ) {
    setUpdatingRecommendation(index);
    try {
      await updateGtmCampaign(campaign._id, {
        recommendations: campaign.recommendations.map((item, position) =>
          position === index ? { ...item, status } : item
        ),
      });
      await onChanged();
    } catch (error) {
      toast.error(campaignError(error, "Recommendation could not be updated"));
    } finally {
      setUpdatingRecommendation(-1);
    }
  }

  return (
    <div className='space-y-10'>
      <MetricStrip metrics={tiles} />

      <div className='grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_320px]'>
        <Section
          title='Recommendations'
          meta={
            campaign.lastOptimizedAt
              ? `Reviewed ${new Date(campaign.lastOptimizedAt).toLocaleDateString()}`
              : "Not reviewed yet"
          }
          action={
            <>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => void scheduleWeekly()}
                disabled={scheduling}
                title='Re-run the review every 7 days'
              >
                {scheduling && <Loader2 className='animate-spin' />}
                Review weekly
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => void optimize()}
                disabled={optimizing}
              >
                {optimizing && <Loader2 className='animate-spin' />}
                Review now
              </Button>
            </>
          }
        >
          {openRecommendations.length ? (
            <ul className='divide-y'>
              {openRecommendations.map(({ recommendation, index }) => (
                <li
                  key={`${recommendation.title}-${index}`}
                  className='group grid grid-cols-[4rem_minmax(0,1fr)_auto] gap-3 py-3.5 first:pt-0'
                >
                  <span
                    className={cn(
                      "pt-px text-xs font-medium capitalize",
                      PRIORITY_TONE[recommendation.priority]
                    )}
                  >
                    {recommendation.priority}
                  </span>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium'>
                      {recommendation.title}
                    </p>
                    <p className='text-muted-foreground mt-0.5 text-sm'>
                      {recommendation.action}
                    </p>
                  </div>
                  <div className='flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 px-2 text-xs'
                      disabled={updatingRecommendation === index}
                      onClick={() =>
                        void setRecommendationStatus(index, "done")
                      }
                    >
                      Done
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-muted-foreground h-7 px-2 text-xs'
                      disabled={updatingRecommendation === index}
                      onClick={() =>
                        void setRecommendationStatus(index, "dismissed")
                      }
                    >
                      Dismiss
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>
              {campaign.lastOptimizedAt
                ? "Nothing to act on right now."
                : "Run a review to get specific next steps for this campaign."}
            </Empty>
          )}
        </Section>

        <aside className='space-y-10'>
          <Section title='Record a conversion'>
            <form
              onSubmit={(event) => void recordConversion(event)}
              className='space-y-2'
            >
              <div className='grid grid-cols-2 gap-2'>
                <Input
                  type='number'
                  min={0}
                  step='any'
                  inputMode='decimal'
                  value={conversionValue}
                  onChange={(event) => setConversionValue(event.target.value)}
                  placeholder='Value'
                  aria-label='Conversion value'
                  className='h-8'
                  required
                />
                <Input
                  value={conversionSource}
                  onChange={(event) => setConversionSource(event.target.value)}
                  placeholder='Source'
                  aria-label='Conversion source'
                  className='h-8'
                />
              </div>
              <Button
                type='submit'
                variant='outline'
                size='sm'
                className='w-full'
                disabled={recording}
              >
                {recording && <Loader2 className='animate-spin' />} Record
              </Button>
            </form>
            <CopyField
              label={
                <>
                  Or POST{" "}
                  <code className='font-mono'>{"{ value, source }"}</code> from
                  your site or CRM:
                </>
              }
              value={webhookUrl}
              name='Webhook URL'
            />
          </Section>

          <Section title='Tracking link'>
            <form
              onSubmit={(event) => void buildUtm(event)}
              className='space-y-2'
            >
              <Input
                type='url'
                value={utmInput.url}
                onChange={(event) =>
                  setUtmInput((current) => ({
                    ...current,
                    url: event.target.value,
                  }))
                }
                placeholder='https://yoursite.com/offer'
                aria-label='Landing page URL'
                className='h-8'
                required
              />
              <div className='grid grid-cols-2 gap-2'>
                <Input
                  value={utmInput.source}
                  onChange={(event) =>
                    setUtmInput((current) => ({
                      ...current,
                      source: event.target.value,
                    }))
                  }
                  placeholder='Source, e.g. instagram'
                  aria-label='UTM source'
                  className='h-8'
                />
                <Input
                  value={utmInput.medium}
                  onChange={(event) =>
                    setUtmInput((current) => ({
                      ...current,
                      medium: event.target.value,
                    }))
                  }
                  placeholder='Medium, e.g. social'
                  aria-label='UTM medium'
                  className='h-8'
                />
              </div>
              <Button
                type='submit'
                variant='outline'
                size='sm'
                className='w-full'
                disabled={building}
              >
                {building && <Loader2 className='animate-spin' />} Build link
              </Button>
            </form>
            {utmUrl && <CopyField value={utmUrl} name='Tracking link' />}
          </Section>
        </aside>
      </div>
    </div>
  );
}

function CopyField({
  label,
  value,
  name,
}: {
  label?: ReactNode;
  value: string;
  name: string;
}) {
  return (
    <div className='mt-4'>
      {label && <p className='text-muted-foreground mb-1.5 text-xs'>{label}</p>}
      <div className='flex items-center gap-1 rounded-md bg-zinc-50 py-1 pr-1 pl-2.5 dark:bg-white/[0.04]'>
        <p className='text-muted-foreground min-w-0 flex-1 truncate font-mono text-[11px]'>
          {value}
        </p>
        <Button
          variant='ghost'
          size='icon'
          className='size-7 shrink-0'
          aria-label={`Copy ${name.toLowerCase()}`}
          onClick={() => void copy(value, name)}
        >
          <Copy className='size-3.5' />
        </Button>
      </div>
    </div>
  );
}
