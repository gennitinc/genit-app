"use client";

import {
  Empty,
  MetricStrip,
  Section,
  StatusDot,
  rowClass,
  tableClass,
  theadClass,
} from "./campaign-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCampaignOutreach } from "@/hooks/use-campaigns";
import { useIntegrations } from "@/hooks/use-integrations";
import { campaignError } from "@/lib/campaign-utils";
import {
  type CampaignRecipient,
  type GtmCampaign,
  type OutreachChannel,
  type OutreachVariant,
  addCampaignRecipients,
  launchCampaignOutreach,
  pauseCampaignOutreach,
  suppressCampaignRecipient,
  updateCampaignOutreach,
} from "@/lib/gtm-api";
import { effectiveIntegrationPlatform } from "@/lib/integrations-api";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useMemo, useState } from "react";

const CHANNELS: Array<{ value: OutreachChannel; label: string }> = [
  { value: "gmail", label: "Gmail" },
  { value: "outlook", label: "Outlook" },
  { value: "brevo", label: "Brevo" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "messenger", label: "Messenger" },
  { value: "instagram", label: "Instagram" },
  { value: "telegram", label: "Telegram" },
  { value: "x", label: "X" },
  { value: "slack", label: "Slack" },
];

const EMAIL_CHANNELS: OutreachChannel[] = ["gmail", "outlook", "brevo"];

const RECIPIENT_STATUSES: Array<CampaignRecipient["status"]> = [
  "pending",
  "scheduled",
  "sent",
  "delivered",
  "read",
  "replied",
  "failed",
  "suppressed",
];

type Props = {
  campaign: GtmCampaign;
  onChanged: () => Promise<unknown>;
};

export function CampaignOutreach({ campaign, onChanged }: Props) {
  const { integrations } = useIntegrations();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    CampaignRecipient["status"] | "all"
  >("all");
  const outreach = useCampaignOutreach(campaign._id, page, statusFilter);
  const [saving, setSaving] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [throttle, setThrottle] = useState(
    campaign.outreach?.throttlePerMinute || 20
  );
  const [senders, setSenders] = useState<
    Partial<Record<OutreachChannel, string>>
  >(campaign.outreach?.integrations || {});
  const [variants, setVariants] = useState<OutreachVariant[]>(
    campaign.outreach?.variants || []
  );
  const [recipientText, setRecipientText] = useState("");
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [consentSource, setConsentSource] = useState("");
  const [suppressingId, setSuppressingId] = useState("");

  const integrationsByChannel = useMemo(() => {
    const result = new Map<OutreachChannel, typeof integrations>();
    for (const channel of CHANNELS.map((item) => item.value)) {
      result.set(
        channel,
        integrations.filter(
          (integration) =>
            integration.status === "active" &&
            effectiveIntegrationPlatform(integration) === channel
        )
      );
    }
    return result;
  }, [integrations]);

  const stats = outreach.data?.stats || {};
  const totalRecipients = Object.values(stats).reduce(
    (sum, count) => sum + (count || 0),
    0
  );
  const recipients = outreach.data?.recipients || [];
  const pagination = outreach.data?.recipientPagination;
  const hasSenders = Object.values(senders).some(Boolean);

  async function refresh() {
    await Promise.all([outreach.refetch(), onChanged()]);
  }

  function addVariant() {
    const channel =
      CHANNELS.find((item) => integrationsByChannel.get(item.value)?.length)
        ?.value || "gmail";
    setVariants((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        channel,
        name: `Variant ${current.filter((item) => item.channel === channel).length + 1}`,
        content: "",
        subject: EMAIL_CHANNELS.includes(channel) ? "" : undefined,
        templateLanguage: channel === "whatsapp" ? "en_US" : undefined,
        weight: 1,
      },
    ]);
  }

  function updateVariant(index: number, patch: Partial<OutreachVariant>) {
    setVariants((current) =>
      current.map((variant, position) =>
        position === index ? { ...variant, ...patch } : variant
      )
    );
  }

  function settings() {
    return { throttlePerMinute: throttle, integrations: senders, variants };
  }

  async function save() {
    setSaving(true);
    try {
      await updateCampaignOutreach(campaign._id, settings());
      toast.success("Outreach settings saved");
      await refresh();
    } catch (error) {
      toast.error(campaignError(error, "Outreach settings could not be saved"));
    } finally {
      setSaving(false);
    }
  }

  async function importRecipients() {
    if (!consentConfirmed) {
      toast.error("Confirm that these recipients consented to this outreach");
      return;
    }
    const parsed = recipientText
      .split(/\r?\n/)
      .map((line) => line.split(",").map((part) => part.trim()))
      .filter((parts) => parts.some(Boolean))
      .map(([channel, address, name]) => ({
        channel: channel?.toLowerCase() as OutreachChannel,
        address,
        name: name || address,
        consentStatus: "opted_in" as const,
        consentSource: consentSource.trim() || "operator-confirmed import",
      }));
    const invalid = parsed.findIndex(
      (item) =>
        !item.address ||
        !CHANNELS.some((channel) => channel.value === item.channel)
    );
    if (!parsed.length || invalid !== -1) {
      toast.error(
        invalid === -1
          ? "Use one recipient per line: channel,address,name"
          : `Line ${invalid + 1}: use channel,address,name with a supported channel`
      );
      return;
    }
    try {
      await addCampaignRecipients(campaign._id, parsed);
      setRecipientText("");
      setConsentConfirmed(false);
      toast.success(
        `${parsed.length} recipient${parsed.length === 1 ? "" : "s"} imported`
      );
      setPage(1);
      await refresh();
    } catch (error) {
      toast.error(campaignError(error, "Recipients could not be imported"));
    }
  }

  async function launch() {
    setLaunching(true);
    try {
      await updateCampaignOutreach(campaign._id, settings());
      const result = await launchCampaignOutreach(campaign._id);
      toast.success(
        `${result.scheduled} message${result.scheduled === 1 ? "" : "s"} scheduled`
      );
      if (result.rejected.length)
        toast.warning(
          `${result.rejected.length} recipient${result.rejected.length === 1 ? "" : "s"} need attention`
        );
      await refresh();
    } catch (error) {
      toast.error(campaignError(error, "Campaign could not be launched"));
    } finally {
      setLaunching(false);
    }
  }

  async function pause() {
    try {
      await pauseCampaignOutreach(campaign._id);
      toast.success("Campaign outreach paused");
      await refresh();
    } catch (error) {
      toast.error(campaignError(error, "Campaign could not be paused"));
    }
  }

  async function suppress(recipientId: string) {
    setSuppressingId(recipientId);
    try {
      await suppressCampaignRecipient(campaign._id, recipientId);
      toast.success("Recipient suppressed");
      await outreach.refetch();
    } catch (error) {
      toast.error(campaignError(error, "Recipient could not be suppressed"));
    } finally {
      setSuppressingId("");
    }
  }

  const connectedChannels = CHANNELS.filter(
    ({ value }) => integrationsByChannel.get(value)?.length
  );
  const launchBlocker = !hasSenders
    ? "Choose a sending account"
    : !variants.length
      ? "Write at least one message"
      : !totalRecipients
        ? "Import recipients"
        : "";
  const status = campaign.outreach?.status || "draft";

  return (
    <div className='space-y-10'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3 text-sm'>
          <StatusDot status={status} className='text-sm' />
          <span className='text-muted-foreground text-xs'>
            {campaign.outreach?.launchedAt
              ? `Launched ${new Date(campaign.outreach.launchedAt).toLocaleDateString()}`
              : launchBlocker
                ? `To launch: ${launchBlocker.toLowerCase()}`
                : "Ready to launch"}
          </span>
        </div>
        <div className='flex gap-2'>
          {status === "running" && (
            <Button variant='ghost' size='sm' onClick={() => void pause()}>
              Pause
            </Button>
          )}
          <Button
            variant='outline'
            size='sm'
            onClick={() => void save()}
            disabled={saving}
          >
            {saving && <Loader2 className='animate-spin' />} Save
          </Button>
          <Button
            size='sm'
            onClick={() => void launch()}
            disabled={launching || Boolean(launchBlocker)}
            title={launchBlocker || undefined}
          >
            {launching && <Loader2 className='animate-spin' />}
            {status === "running" ? "Send to new recipients" : "Launch"}
          </Button>
        </div>
      </div>

      {totalRecipients > 0 && (
        <MetricStrip
          metrics={[
            { label: "Recipients", value: totalRecipients },
            { label: "Scheduled", value: stats.scheduled || 0 },
            { label: "Sent", value: stats.sent || 0 },
            { label: "Delivered", value: stats.delivered || 0 },
            { label: "Read", value: stats.read || 0 },
            { label: "Replied", value: stats.replied || 0 },
            {
              label: "Failed",
              value: stats.failed || 0,
              hint: stats.suppressed
                ? `${stats.suppressed} suppressed`
                : undefined,
            },
          ]}
        />
      )}

      <div className='grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_320px]'>
        <Section
          title='Messages'
          meta='Each recipient gets one weighted variant for their channel'
          action={
            <Button variant='ghost' size='sm' onClick={addVariant}>
              <Plus /> Variant
            </Button>
          }
        >
          {variants.length ? (
            <div className='divide-y'>
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className='space-y-2 py-5 first:pt-0 last:pb-0'
                >
                  <div className='flex flex-wrap items-center gap-2'>
                    <Select
                      value={variant.channel}
                      onValueChange={(channel: OutreachChannel) =>
                        updateVariant(index, {
                          channel,
                          subject: EMAIL_CHANNELS.includes(channel)
                            ? variant.subject || ""
                            : undefined,
                          templateName:
                            channel === "whatsapp"
                              ? variant.templateName
                              : undefined,
                        })
                      }
                    >
                      <SelectTrigger className='h-8 w-32' aria-label='Channel'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CHANNELS.map((channel) => (
                          <SelectItem key={channel.value} value={channel.value}>
                            {channel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={variant.name}
                      onChange={(event) =>
                        updateVariant(index, { name: event.target.value })
                      }
                      placeholder='Variant name'
                      aria-label='Variant name'
                      className='h-8 min-w-0 flex-1 border-transparent px-1.5 font-medium shadow-none hover:border-inherit focus-visible:border-inherit'
                    />
                    <label className='text-muted-foreground flex items-center gap-1.5 text-xs'>
                      Weight
                      <Input
                        type='number'
                        min={1}
                        max={100}
                        value={variant.weight}
                        onChange={(event) =>
                          updateVariant(index, {
                            weight: Number(event.target.value),
                          })
                        }
                        className='h-8 w-16'
                      />
                    </label>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-muted-foreground size-8'
                      aria-label={`Remove ${variant.name}`}
                      onClick={() =>
                        setVariants((current) =>
                          current.filter((_, position) => position !== index)
                        )
                      }
                    >
                      <X />
                    </Button>
                  </div>
                  {EMAIL_CHANNELS.includes(variant.channel) && (
                    <Input
                      value={variant.subject || ""}
                      onChange={(event) =>
                        updateVariant(index, { subject: event.target.value })
                      }
                      placeholder='Subject line'
                      aria-label='Email subject'
                    />
                  )}
                  {variant.channel === "whatsapp" && (
                    <div className='grid gap-2 sm:grid-cols-[1fr_120px]'>
                      <Input
                        value={variant.templateName || ""}
                        onChange={(event) =>
                          updateVariant(index, {
                            templateName: event.target.value,
                          })
                        }
                        placeholder='Approved template name'
                        aria-label='WhatsApp template name'
                      />
                      <Input
                        value={variant.templateLanguage || "en_US"}
                        onChange={(event) =>
                          updateVariant(index, {
                            templateLanguage: event.target.value,
                          })
                        }
                        placeholder='en_US'
                        aria-label='Template language'
                      />
                    </div>
                  )}
                  <Textarea
                    value={variant.content}
                    onChange={(event) =>
                      updateVariant(index, { content: event.target.value })
                    }
                    placeholder={
                      variant.channel === "whatsapp"
                        ? "Template preview (for your records)"
                        : "Write the message…"
                    }
                    aria-label='Message'
                    rows={5}
                    className='resize-y text-sm leading-6'
                  />
                </div>
              ))}
            </div>
          ) : (
            <Empty
              action={
                <Button size='sm' variant='outline' onClick={addVariant}>
                  <Plus /> Write a message
                </Button>
              }
            >
              No messages yet. Add two variants to test which one gets more
              replies.
            </Empty>
          )}
        </Section>

        <aside className='space-y-10'>
          <Section title='Send from'>
            {connectedChannels.length ? (
              <div className='space-y-2.5'>
                {connectedChannels.map(({ value, label }) => (
                  <div
                    key={value}
                    className='grid grid-cols-[84px_minmax(0,1fr)] items-center gap-2'
                  >
                    <span className='text-muted-foreground text-sm'>
                      {label}
                    </span>
                    <Select
                      value={senders[value] || "none"}
                      onValueChange={(integrationId) =>
                        setSenders((current) => ({
                          ...current,
                          [value]:
                            integrationId === "none"
                              ? undefined
                              : integrationId,
                        }))
                      }
                    >
                      <SelectTrigger
                        className='h-8'
                        aria-label={`${label} account`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='none'>Don’t send</SelectItem>
                        {(integrationsByChannel.get(value) || []).map(
                          (integration) => (
                            <SelectItem
                              key={integration._id}
                              value={integration._id}
                            >
                              {integration.accountName}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <div className='grid grid-cols-[84px_minmax(0,1fr)] items-center gap-2 pt-1'>
                  <label
                    htmlFor='throttle'
                    className='text-muted-foreground text-sm'
                  >
                    Pace
                  </label>
                  <div className='flex items-center gap-2'>
                    <Input
                      id='throttle'
                      type='number'
                      min={1}
                      max={120}
                      value={throttle}
                      onChange={(event) =>
                        setThrottle(Number(event.target.value))
                      }
                      className='h-8 w-20'
                    />
                    <span className='text-muted-foreground text-xs'>
                      per minute
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <Empty
                action={
                  <Button asChild size='sm' variant='outline'>
                    <Link href='/integrations'>Connect</Link>
                  </Button>
                }
              >
                Connect Gmail, WhatsApp or another inbox to send from.
              </Empty>
            )}
          </Section>

          <Section title='Add recipients'>
            <div className='space-y-2'>
              <Textarea
                value={recipientText}
                onChange={(event) => setRecipientText(event.target.value)}
                rows={5}
                aria-label='Recipients, one per line'
                placeholder={
                  "channel,address,name\ngmail,ada@example.com,Ada\nwhatsapp,2348012345678,Ada"
                }
                className='font-mono text-xs leading-5'
              />
              <Input
                value={consentSource}
                onChange={(event) => setConsentSource(event.target.value)}
                placeholder='Where they opted in, e.g. website signup'
                aria-label='Consent source'
                className='h-8'
              />
              <label className='text-muted-foreground flex items-start gap-2 py-1 text-xs leading-5'>
                <input
                  type='checkbox'
                  checked={consentConfirmed}
                  onChange={(event) =>
                    setConsentConfirmed(event.target.checked)
                  }
                  className='mt-1'
                />
                These people agreed to hear from us on these channels.
              </label>
              <Button
                variant='outline'
                size='sm'
                className='w-full'
                onClick={() => void importRecipients()}
                disabled={!recipientText.trim()}
              >
                Import
              </Button>
            </div>
          </Section>
        </aside>
      </div>

      <Section
        title='Recipients'
        meta='Replies and opt-outs stop pending sends automatically'
        action={
          <Select
            value={statusFilter}
            onValueChange={(value: CampaignRecipient["status"] | "all") => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className='h-8 w-36' aria-label='Filter recipients'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All statuses</SelectItem>
              {RECIPIENT_STATUSES.map((item) => (
                <SelectItem key={item} value={item} className='capitalize'>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        {outreach.isLoading ? (
          <div className='space-y-px'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='h-12 rounded-none' />
            ))}
          </div>
        ) : recipients.length ? (
          <div
            className={cn(
              "overflow-x-auto transition-opacity",
              outreach.isFetching && "opacity-60"
            )}
          >
            <table className={cn(tableClass, "min-w-[680px]")}>
              <thead className={theadClass}>
                <tr>
                  <th>Recipient</th>
                  <th className='w-28'>Channel</th>
                  <th className='w-44'>Status</th>
                  <th className='w-36'>Variant</th>
                  <th className='w-24' />
                </tr>
              </thead>
              <tbody>
                {recipients.map((recipient) => (
                  <tr key={recipient._id} className={cn(rowClass, "group")}>
                    <td className='max-w-0'>
                      <p className='truncate font-medium'>{recipient.name}</p>
                      <p className='text-muted-foreground truncate text-xs'>
                        {recipient.address}
                        {recipient.consent.status !== "opted_in" &&
                          ` · consent ${recipient.consent.status.replace("_", " ")}`}
                      </p>
                    </td>
                    <td className='capitalize'>{recipient.channel}</td>
                    <td>
                      <StatusDot status={recipient.status} />
                      {recipient.lastError && (
                        <p className='mt-1 line-clamp-2 text-xs text-red-600 dark:text-red-400'>
                          {recipient.lastError}
                        </p>
                      )}
                    </td>
                    <td className='text-muted-foreground truncate text-xs'>
                      {variants.find((item) => item.id === recipient.variantId)
                        ?.name ||
                        recipient.variantId ||
                        "—"}
                    </td>
                    <td className='text-right'>
                      {!["suppressed", "replied"].includes(
                        recipient.status
                      ) && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-muted-foreground h-7 px-2 text-xs opacity-100 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100'
                          disabled={suppressingId === recipient._id}
                          onClick={() => void suppress(recipient._id)}
                        >
                          Stop sending
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>
            {statusFilter === "all"
              ? "No recipients yet. Add opted-in contacts on the right."
              : `No ${statusFilter} recipients.`}
          </Empty>
        )}
        {pagination && pagination.totalPages > 1 && (
          <div className='mt-3 flex items-center justify-between gap-4'>
            <p className='text-muted-foreground text-xs tabular-nums'>
              Page {pagination.page} of {pagination.totalPages} ·{" "}
              {pagination.total} recipients
            </p>
            <div className='flex gap-1'>
              <Button
                variant='ghost'
                size='icon'
                className='size-8'
                onClick={() => setPage((current) => current - 1)}
                disabled={!pagination.hasPreviousPage || outreach.isFetching}
                aria-label='Previous page'
              >
                <ChevronLeft />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='size-8'
                onClick={() => setPage((current) => current + 1)}
                disabled={!pagination.hasNextPage || outreach.isFetching}
                aria-label='Next page'
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
