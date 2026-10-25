"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIntegrations } from "@/hooks/use-integrations";
import {
  CampaignOutreachSnapshot,
  OutreachChannel,
  OutreachVariant,
  addCampaignRecipients,
  getCampaignOutreach,
  launchCampaignOutreach,
  pauseCampaignOutreach,
  suppressCampaignRecipient,
  updateCampaignOutreach,
} from "@/lib/gtm-api";
import { effectiveIntegrationPlatform } from "@/lib/integrations-api";
import {
  ArrowLeft,
  CirclePause,
  Loader2,
  Megaphone,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useState } from "react";

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

function errorMessage(error: unknown, fallback: string) {
  const response = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return response.response?.data?.message || response.message || fallback;
}

export default function CampaignOutreachPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    orgId,
    integrations,
    isLoading: integrationsLoading,
  } = useIntegrations();
  const [snapshot, setSnapshot] = useState<CampaignOutreachSnapshot>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [throttle, setThrottle] = useState(20);
  const [senders, setSenders] = useState<
    Partial<Record<OutreachChannel, string>>
  >({});
  const [variants, setVariants] = useState<OutreachVariant[]>([]);
  const [recipientText, setRecipientText] = useState("");
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [consentSource, setConsentSource] = useState("");

  const load = useCallback(async () => {
    if (!orgId || !id) return;
    setLoading(true);
    try {
      const data = await getCampaignOutreach(id);
      if (data.campaign.chatId) {
        router.replace(`/chat/${data.campaign.chatId}`);
        return;
      }
      setSnapshot(data);
      setThrottle(data.campaign.outreach?.throttlePerMinute || 20);
      setSenders(data.campaign.outreach?.integrations || {});
      setVariants(data.campaign.outreach?.variants || []);
    } catch (error) {
      toast.error(errorMessage(error, "Campaign outreach could not be loaded"));
    } finally {
      setLoading(false);
    }
  }, [id, orgId, router]);

  useEffect(() => void load(), [load]);

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

  async function save() {
    setSaving(true);
    try {
      await updateCampaignOutreach(id, {
        throttlePerMinute: throttle,
        integrations: senders,
        variants,
      });
      toast.success("Outreach settings saved");
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Outreach settings could not be saved"));
    } finally {
      setSaving(false);
    }
  }

  async function importRecipients() {
    if (!consentConfirmed) {
      toast.error("Confirm that these recipients consented to this outreach");
      return;
    }
    const recipients = recipientText
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
    if (!recipients.length || recipients.some((item) => !item.address)) {
      toast.error("Use one recipient per line: channel,address,name");
      return;
    }
    try {
      await addCampaignRecipients(id, recipients);
      setRecipientText("");
      setConsentConfirmed(false);
      toast.success(
        `${recipients.length} recipient${recipients.length === 1 ? "" : "s"} imported`
      );
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Recipients could not be imported"));
    }
  }

  async function launch() {
    setLaunching(true);
    try {
      await updateCampaignOutreach(id, {
        throttlePerMinute: throttle,
        integrations: senders,
        variants,
      });
      const result = await launchCampaignOutreach(id);
      toast.success(
        `${result.scheduled} message${result.scheduled === 1 ? "" : "s"} scheduled`
      );
      if (result.rejected.length)
        toast.warning(
          `${result.rejected.length} recipient${result.rejected.length === 1 ? "" : "s"} need attention`
        );
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Campaign could not be launched"));
    } finally {
      setLaunching(false);
    }
  }

  async function pause() {
    try {
      await pauseCampaignOutreach(id);
      toast.success("Campaign outreach paused");
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Campaign could not be paused"));
    }
  }

  if (loading || integrationsLoading || !snapshot) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <Loader2 className='text-muted-foreground size-6 animate-spin' />
      </div>
    );
  }

  const stats = snapshot.stats;
  const total = snapshot.recipients.length;

  return (
    <div className='space-y-6 pb-10'>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <Button asChild variant='ghost' size='sm' className='mb-2 -ml-3'>
            <Link href='/visuals/campaigns'>
              <ArrowLeft /> Campaigns
            </Link>
          </Button>
          <h1 className='text-2xl font-bold tracking-tight'>
            {snapshot.campaign.name}
          </h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Multichannel outreach
          </p>
        </div>
        <div className='flex gap-2'>
          {snapshot.campaign.outreach?.status === "running" && (
            <Button variant='outline' onClick={() => void pause()}>
              <CirclePause /> Pause
            </Button>
          )}
          <Button
            variant='outline'
            onClick={() => void save()}
            disabled={saving}
          >
            {saving ? <Loader2 className='animate-spin' /> : <Save />} Save
          </Button>
          <Button
            onClick={() => void launch()}
            disabled={launching || !total || !variants.length}
          >
            {launching ? <Loader2 className='animate-spin' /> : <Megaphone />}{" "}
            Launch
          </Button>
        </div>
      </header>

      <section className='grid gap-3 sm:grid-cols-3 lg:grid-cols-8'>
        {[
          ["Recipients", total],
          ["Scheduled", stats.scheduled || 0],
          ["Sent", stats.sent || 0],
          ["Delivered", stats.delivered || 0],
          ["Read", stats.read || 0],
          ["Replied", stats.replied || 0],
          ["Failed", stats.failed || 0],
          ["Suppressed", stats.suppressed || 0],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className='p-4'>
              <p className='text-muted-foreground text-xs'>{label}</p>
              <p className='mt-2 text-2xl font-semibold'>{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className='grid gap-6 xl:grid-cols-[1fr_1.4fr]'>
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Sending accounts</CardTitle>
              <CardDescription>
                Select one connected account for every channel you use.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {CHANNELS.map(({ value, label }) => {
                const options = integrationsByChannel.get(value) || [];
                if (!options.length) return null;
                return (
                  <div
                    key={value}
                    className='grid grid-cols-[110px_1fr] items-center gap-3'
                  >
                    <label className='text-sm font-medium'>{label}</label>
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
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='none'>Not selected</SelectItem>
                        {options.map((integration) => (
                          <SelectItem
                            key={integration._id}
                            value={integration._id}
                          >
                            {integration.accountName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
              <div className='grid grid-cols-[110px_1fr] items-center gap-3 pt-2'>
                <label htmlFor='throttle' className='text-sm font-medium'>
                  Pacing
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
                  />
                  <span className='text-muted-foreground text-xs whitespace-nowrap'>
                    messages / minute
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Import recipients</CardTitle>
              <CardDescription>
                One per line: channel,address,name. Provider IDs are required
                for social channels.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Textarea
                value={recipientText}
                onChange={(event) => setRecipientText(event.target.value)}
                rows={7}
                placeholder={
                  "whatsapp,2348012345678,Ada\ngmail,ada@example.com,Ada"
                }
              />
              <Input
                value={consentSource}
                onChange={(event) => setConsentSource(event.target.value)}
                placeholder='Consent source, e.g. website signup on 2026-09-14'
              />
              <label className='flex items-start gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={consentConfirmed}
                  onChange={(event) =>
                    setConsentConfirmed(event.target.checked)
                  }
                  className='mt-1'
                />
                <span>
                  I confirm these recipients opted in to messages on the
                  selected channels.
                </span>
              </label>
              <Button variant='outline' onClick={() => void importRecipients()}>
                <ShieldCheck /> Import opted-in recipients
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className='flex-row items-center justify-between space-y-0'>
            <div>
              <CardTitle className='text-base'>Message variants</CardTitle>
              <CardDescription>
                Recipients get one stable weighted variant for their channel.
              </CardDescription>
            </div>
            <Button variant='outline' size='sm' onClick={addVariant}>
              <Plus /> Add variant
            </Button>
          </CardHeader>
          <CardContent className='space-y-4'>
            {variants.length ? (
              variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className='space-y-3 rounded-xl border p-4'
                >
                  <div className='grid gap-3 sm:grid-cols-[150px_1fr_90px_auto]'>
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
                      <SelectTrigger>
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
                    />
                    <Input
                      type='number'
                      min={1}
                      max={100}
                      value={variant.weight}
                      title='Variant weight'
                      onChange={(event) =>
                        updateVariant(index, {
                          weight: Number(event.target.value),
                        })
                      }
                    />
                    <Button
                      variant='ghost'
                      size='icon'
                      aria-label={`Remove ${variant.name}`}
                      onClick={() =>
                        setVariants((current) =>
                          current.filter((_, position) => position !== index)
                        )
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  {EMAIL_CHANNELS.includes(variant.channel) && (
                    <Input
                      value={variant.subject || ""}
                      onChange={(event) =>
                        updateVariant(index, { subject: event.target.value })
                      }
                      placeholder='Email subject'
                    />
                  )}
                  {variant.channel === "whatsapp" && (
                    <div className='grid gap-3 sm:grid-cols-[1fr_140px]'>
                      <Input
                        value={variant.templateName || ""}
                        onChange={(event) =>
                          updateVariant(index, {
                            templateName: event.target.value,
                          })
                        }
                        placeholder='Approved WhatsApp template name'
                      />
                      <Input
                        value={variant.templateLanguage || "en_US"}
                        onChange={(event) =>
                          updateVariant(index, {
                            templateLanguage: event.target.value,
                          })
                        }
                        placeholder='en_US'
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
                        ? "Audit label or template preview"
                        : "Message content"
                    }
                    rows={5}
                  />
                </div>
              ))
            ) : (
              <div className='rounded-xl border border-dashed py-12 text-center'>
                <Megaphone className='text-muted-foreground mx-auto size-6' />
                <p className='mt-2 text-sm font-medium'>
                  No message variants yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Recipients</CardTitle>
          <CardDescription>
            Replies and opt-outs automatically stop pending sends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[720px] text-left text-sm'>
              <thead className='text-muted-foreground border-b text-xs'>
                <tr>
                  <th className='py-3'>Recipient</th>
                  <th>Channel</th>
                  <th>Consent</th>
                  <th>Status</th>
                  <th>Variant</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {snapshot.recipients.map((recipient) => (
                  <tr key={recipient._id} className='border-b last:border-0'>
                    <td className='py-3'>
                      <p className='font-medium'>{recipient.name}</p>
                      <p className='text-muted-foreground text-xs'>
                        {recipient.address}
                      </p>
                    </td>
                    <td className='capitalize'>{recipient.channel}</td>
                    <td>
                      <Badge variant='outline'>
                        {recipient.consent.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        variant={
                          recipient.status === "failed" ||
                          recipient.status === "suppressed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {recipient.status}
                      </Badge>
                      {recipient.lastError && (
                        <p className='text-destructive mt-1 max-w-xs text-xs'>
                          {recipient.lastError}
                        </p>
                      )}
                    </td>
                    <td className='text-muted-foreground text-xs'>
                      {recipient.variantId || "—"}
                    </td>
                    <td className='text-right'>
                      {!["suppressed", "replied"].includes(
                        recipient.status
                      ) && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={async () => {
                            await suppressCampaignRecipient(id, recipient._id);
                            toast.success("Recipient suppressed");
                            await load();
                          }}
                        >
                          Suppress
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
