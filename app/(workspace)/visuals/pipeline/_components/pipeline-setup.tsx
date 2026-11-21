"use client";

import { Section } from "../../campaigns/_components/campaign-ui";
import { pipelineKeys } from "./pipeline-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useIntegrations } from "@/hooks/use-integrations";
import { campaignError } from "@/lib/campaign-utils";
import {
  type SalesAgentSettings,
  getPipelineSettings,
  getPipelineSlots,
  savePipelineSettings,
} from "@/lib/pipeline-api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { type ReactNode, useEffect, useMemo, useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const AUTO = "auto";

function timezones() {
  try {
    return (Intl as unknown as { supportedValuesOf(key: string): string[] }).supportedValuesOf("timeZone");
  } catch {
    return ["UTC"];
  }
}

export function PipelineSetup() {
  const { orgId } = useIntegrations();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: pipelineKeys.settings(orgId),
    queryFn: getPipelineSettings,
    enabled: Boolean(orgId),
  });
  const [draft, setDraft] = useState<SalesAgentSettings | null>(null);
  const [delays, setDelays] = useState("");
  const [copied, setCopied] = useState("");
  const zones = useMemo(timezones, []);

  useEffect(() => {
    if (!query.data) return;
    setDraft(query.data.settings);
    setDelays(query.data.settings.followUp.delaysHours.join(", "));
  }, [query.data]);

  const slots = useQuery({
    queryKey: [...pipelineKeys.settings(orgId), "slots", draft?.booking.enabled],
    queryFn: getPipelineSlots,
    enabled: Boolean(orgId && draft?.booking.enabled && query.data?.calendars.length),
  });

  const save = useMutation({
    mutationFn: (input: Partial<SalesAgentSettings> & { rotateFormKey?: boolean }) => savePipelineSettings(input),
    onSuccess: () => {
      toast.success("Sales agent settings saved");
      void queryClient.invalidateQueries({ queryKey: pipelineKeys.all(orgId) });
    },
    onError: (error) => toast.error(campaignError(error, "Settings could not be saved")),
  });

  if (query.isError)
    return <p className='text-sm text-red-600'>{campaignError(query.error, "Settings could not be loaded")}</p>;
  if (!query.data || !draft) return <Skeleton className='h-96' />;

  const data = query.data;
  const vertical = data.verticals.find((v) => v.key === draft.vertical) || data.verticals[0];
  const set = (patch: Partial<SalesAgentSettings>) => setDraft((current) => (current ? { ...current, ...patch } : current));
  const setBooking = (patch: Partial<SalesAgentSettings["booking"]>) =>
    setDraft((current) => (current ? { ...current, booking: { ...current.booking, ...patch } } : current));

  function submit() {
    if (!draft) return;
    const delaysHours = delays
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => Number.isFinite(n) && n > 0);
    save.mutate({ ...draft, followUp: { ...draft.followUp, delaysHours } });
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1500);
  };

  const snippet = `<form action="${data.formEndpoint}" method="POST">
  <input name="name" placeholder="Your name" required />
  <input name="email" type="email" placeholder="Email" />
  <input name="phone" type="tel" placeholder="Phone" />
${vertical.questions
  .filter((q) => q.required)
  .slice(0, 3)
  .map((q) => `  <input name="${q.key}" placeholder="${q.label}" />`)
  .join("\n")}
  <textarea name="message" placeholder="How can we help?"></textarea>
  <input name="website" style="display:none" tabindex="-1" autocomplete="off" />
  <input type="hidden" name="redirect" value="https://YOUR-SITE.com/thank-you" />
  <button type="submit">Send</button>
</form>`;

  const capacity = data.capacity;

  return (
    <div className='max-w-3xl space-y-8'>
      <Section title='AI sales agent' meta={`${capacity.plan} plan`}>
        <Row
          label='Qualify, book and follow up automatically'
          hint='When off, enquiries still land in the pipeline and auto-replies only answer questions.'
        >
          <Switch checked={draft.enabled} onCheckedChange={(enabled) => set({ enabled })} />
        </Row>
        <p className='text-muted-foreground mt-2 text-xs'>
          {capacity.limit === null
            ? `${capacity.used} leads worked by AI this month · unlimited on your plan.`
            : `${capacity.used} of ${capacity.limit} AI-worked leads used this month. Leads beyond the limit are still captured.`}
        </p>
        <p className='text-muted-foreground mt-1 text-xs'>
          The AI only messages customers on channels where you’ve turned on AI replies in the{" "}
          <Link href='/visuals/inbox' className='underline underline-offset-2'>
            inbox
          </Link>
          .
        </p>
      </Section>

      <Section title='What counts as a qualified lead'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label='Industry'>
            <Select value={draft.vertical} onValueChange={(value) => set({ vertical: value })}>
              <SelectTrigger className='h-9'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data.verticals.map((v) => (
                  <SelectItem key={v.key} value={v.key}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={`Qualified at score ${draft.qualifyThreshold}`} hint='Higher means stricter.'>
            <input
              type='range'
              min={30}
              max={100}
              step={5}
              value={draft.qualifyThreshold}
              onChange={(event) => set({ qualifyThreshold: Number(event.target.value) })}
              className='mt-3 w-full accent-sky-500'
              aria-label='Qualification threshold'
            />
          </Field>
        </div>
        <p className='text-muted-foreground mt-4 mb-2 text-xs'>The assistant asks for these, one at a time:</p>
        <ul className='space-y-1 text-sm'>
          {vertical.questions.map((q) => (
            <li key={q.key} className='flex gap-2'>
              <span className='w-36 shrink-0 font-medium'>{q.label}</span>
              <span className='text-muted-foreground'>
                {q.ask}
                {!q.required && " (optional)"}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title='Capture' meta='Where leads come from'>
        <div className='space-y-3'>
          <Row label='Chats and DMs' hint='Instagram, Messenger, WhatsApp, Telegram, X and LinkedIn messages.'>
            <Switch checked={draft.captureChats} onCheckedChange={(captureChats) => set({ captureChats })} />
          </Row>
          <Row label='Email inboxes' hint='Off by default — inboxes also receive newsletters and receipts.'>
            <Switch checked={draft.captureEmail} onCheckedChange={(captureEmail) => set({ captureEmail })} />
          </Row>
          <Row
            label='Meta lead ads'
            hint='Captured automatically from Facebook pages connected in Integrations (needs the leads_retrieval permission and the page’s leadgen webhook).'
          >
            <span className='text-muted-foreground text-xs'>Automatic</span>
          </Row>
        </div>
      </Section>

      <Section title='Booking' meta={vertical.meetingName}>
        <Row label='Let the assistant book meetings' hint='Offers real free times from your Google Calendar once a lead is qualified.'>
          <Switch checked={draft.booking.enabled} onCheckedChange={(enabled) => setBooking({ enabled })} />
        </Row>
        {draft.booking.enabled && (
          <div className='mt-4 space-y-4'>
            {!data.calendars.length ? (
              <p className='rounded-md bg-amber-50 p-3 text-sm dark:bg-amber-500/10'>
                Connect Google Calendar in{" "}
                <Link href='/integrations' className='font-medium underline underline-offset-2'>
                  Integrations
                </Link>{" "}
                so the assistant can see when you’re free.
              </p>
            ) : (
              <Field label='Calendar'>
                <Select
                  value={draft.booking.calendarIntegrationId || AUTO}
                  onValueChange={(value) => setBooking({ calendarIntegrationId: value === AUTO ? undefined : value })}
                >
                  <SelectTrigger className='h-9'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AUTO}>First connected calendar</SelectItem>
                    {data.calendars.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
            <div className='grid gap-4 sm:grid-cols-2'>
              <Field label='Meeting name'>
                <Input
                  value={draft.booking.meetingName || ""}
                  placeholder={vertical.meetingName}
                  onChange={(event) => setBooking({ meetingName: event.target.value })}
                />
              </Field>
              <Field label='Location (optional)'>
                <Input
                  value={draft.booking.location || ""}
                  placeholder='Address or video link'
                  onChange={(event) => setBooking({ location: event.target.value })}
                />
              </Field>
              <Field label='Time zone'>
                <Select value={draft.booking.timezone} onValueChange={(timezone) => setBooking({ timezone })}>
                  <SelectTrigger className='h-9'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='max-h-72'>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label='Hours'>
                <div className='flex items-center gap-2'>
                  <NumberInput value={draft.booking.startHour} min={0} max={23} onChange={(startHour) => setBooking({ startHour })} label='Start hour' />
                  <span className='text-muted-foreground text-sm'>to</span>
                  <NumberInput value={draft.booking.endHour} min={1} max={24} onChange={(endHour) => setBooking({ endHour })} label='End hour' />
                </div>
              </Field>
              <Field label='Length (min)'>
                <NumberInput value={draft.booking.durationMinutes} min={10} max={240} onChange={(durationMinutes) => setBooking({ durationMinutes })} label='Meeting length' />
              </Field>
              <Field label='Gap between meetings (min)'>
                <NumberInput value={draft.booking.bufferMinutes} min={0} max={120} onChange={(bufferMinutes) => setBooking({ bufferMinutes })} label='Buffer' />
              </Field>
              <Field label='Minimum notice (hours)'>
                <NumberInput value={draft.booking.minNoticeHours} min={0} max={168} onChange={(minNoticeHours) => setBooking({ minNoticeHours })} label='Minimum notice' />
              </Field>
              <Field label='Book up to (days ahead)'>
                <NumberInput value={draft.booking.horizonDays} min={1} max={30} onChange={(horizonDays) => setBooking({ horizonDays })} label='Booking horizon' />
              </Field>
            </div>
            <Field label='Days'>
              <div className='flex flex-wrap gap-1'>
                {DAYS.map((day, index) => {
                  const on = draft.booking.days.includes(index);
                  return (
                    <button
                      key={day}
                      type='button'
                      aria-pressed={on}
                      onClick={() =>
                        setBooking({
                          days: on ? draft.booking.days.filter((d) => d !== index) : [...draft.booking.days, index].sort(),
                        })
                      }
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-xs",
                        on ? "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300" : "text-muted-foreground"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </Field>
            {slots.data?.slots.length ? (
              <p className='text-muted-foreground text-xs'>
                Next free times (saved settings): {slots.data.slots.slice(0, 4).map((s) => s.label).join(" · ")}
              </p>
            ) : null}
          </div>
        )}
      </Section>

      <Section title='Follow-ups'>
        <Row label='Nudge leads who go quiet' hint='Chats are only followed up inside the platform’s 24-hour messaging window.'>
          <Switch
            checked={draft.followUp.enabled}
            onCheckedChange={(enabled) => set({ followUp: { ...draft.followUp, enabled } })}
          />
        </Row>
        {draft.followUp.enabled && (
          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <Field label='Hours between follow-ups' hint='Comma-separated, up to 5. Email waits at least 24h.'>
              <Input value={delays} onChange={(event) => setDelays(event.target.value)} placeholder='4, 20, 72' />
            </Field>
            <Field label='Email sender for form leads'>
              {data.emailSenders.length ? (
                <Select
                  value={draft.emailIntegrationId || AUTO}
                  onValueChange={(value) => set({ emailIntegrationId: value === AUTO ? undefined : value })}
                >
                  <SelectTrigger className='h-9'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AUTO}>First connected sender</SelectItem>
                    {data.emailSenders.map((sender) => (
                      <SelectItem key={sender.id} value={sender.id}>
                        {sender.name} ({sender.platform})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className='text-muted-foreground pt-2 text-xs'>
                  Connect Gmail or Brevo in{" "}
                  <Link href='/integrations' className='underline underline-offset-2'>
                    Integrations
                  </Link>{" "}
                  to email form leads.
                </p>
              )}
            </Field>
          </div>
        )}
      </Section>

      <div className='flex gap-2'>
        <Button onClick={submit} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save settings"}
        </Button>
      </div>

      <Section
        title='Website form & webhooks'
        meta='Post leads from your site, Zapier, LinkedIn Lead Gen (via Zapier) or any tool'
        action={
          <Button
            variant='ghost'
            size='sm'
            className='text-xs'
            onClick={() => {
              if (window.confirm("Generate a new form URL? Forms using the old one will stop working.")) save.mutate({ rotateFormKey: true });
            }}
          >
            New URL
          </Button>
        }
      >
        <Field label='Endpoint (POST)'>
          <div className='flex gap-2'>
            <Input readOnly value={data.formEndpoint} className='font-mono text-xs' onFocus={(e) => e.target.select()} />
            <Button variant='outline' size='icon' onClick={() => void copy(data.formEndpoint, "url")} aria-label='Copy endpoint'>
              {copied === "url" ? <Check /> : <Copy />}
            </Button>
          </div>
        </Field>
        <p className='text-muted-foreground mt-2 text-xs'>
          Send <code>name</code>, <code>email</code> and/or <code>phone</code>, optional <code>message</code>, UTM fields, and any
          answers (e.g. <code>budget</code>). JSON or a normal HTML form both work.
        </p>
        <div className='relative mt-3'>
          <Textarea readOnly value={snippet} rows={12} className='font-mono text-xs' />
          <Button
            variant='outline'
            size='sm'
            className='absolute top-2 right-2 h-7 text-xs'
            onClick={() => void copy(snippet, "snippet")}
          >
            {copied === "snippet" ? <Check /> : <Copy />} Copy HTML
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className='flex items-start justify-between gap-6'>
      <div>
        <p className='text-sm font-medium'>{label}</p>
        {hint && <p className='text-muted-foreground mt-0.5 text-xs'>{hint}</p>}
      </div>
      <div className='shrink-0 pt-0.5'>{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className='space-y-1.5'>
      <Label className='text-xs'>{label}</Label>
      {children}
      {hint && <p className='text-muted-foreground text-[11px]'>{hint}</p>}
    </div>
  );
}

function NumberInput({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <Input
      type='number'
      inputMode='numeric'
      min={min}
      max={max}
      value={value}
      aria-label={label}
      onChange={(event) => {
        const next = Number(event.target.value);
        if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next)));
      }}
      className='h-9 w-24'
    />
  );
}
