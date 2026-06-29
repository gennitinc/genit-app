"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  type CreateGoogleCalendarEventInput,
  type GoogleCalendarEvent,
  type GoogleCalendarSummary,
} from "@/lib/integrations-api";
import { LoadingFileLoader } from "@/utils/Loading";
import { GradientFrame } from "@/utils/gradient-frame";
import {
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const ALLOWED_DESCRIPTION_TAGS = new Set([
  "A",
  "B",
  "BR",
  "DIV",
  "EM",
  "I",
  "LI",
  "OL",
  "P",
  "SPAN",
  "STRONG",
  "U",
  "UL",
]);

function sanitizeEventDescription(html: string) {
  if (typeof window === "undefined") {
    return "";
  }

  const documentNode = new DOMParser().parseFromString(html, "text/html");
  const elements = Array.from(documentNode.body.querySelectorAll("*"));
  for (const element of elements) {
    if (!ALLOWED_DESCRIPTION_TAGS.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      const isSafeLinkAttribute =
        element.tagName === "A" &&
        ["href", "target", "rel"].includes(attribute.name);
      if (!isSafeLinkAttribute) element.removeAttribute(attribute.name);
    }

    if (element.tagName === "A") {
      const href = element.getAttribute("href") || "";
      if (!/^(https?:|mailto:|tel:)/i.test(href))
        element.removeAttribute("href");
      element.setAttribute("rel", "noopener noreferrer");
      element.setAttribute("target", "_blank");
    }
  }

  return documentNode.body.innerHTML;
}

type EditorValues = {
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
  allDay: boolean;
  attendeeEmails: string;
  calendarId: string;
};

interface CalendarEventPanelProps {
  open: boolean;
  event: GoogleCalendarEvent | null;
  defaultCalendarId: string;
  calendars: GoogleCalendarSummary[];
  onOpenChange: (open: boolean) => void;
  onSave: (input: CreateGoogleCalendarEventInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function toLocalInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function initialValues(
  event: GoogleCalendarEvent | null,
  calendarId: string
): EditorValues {
  const allDay = Boolean(event?.start?.date && !event.start.dateTime);
  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0);
  const later = new Date(now.getTime() + 60 * 60_000);
  return {
    summary: event?.summary || "",
    description: event?.description || "",
    location: event?.location || "",
    start: allDay
      ? event?.start?.date || ""
      : toLocalInput(event?.start?.dateTime) || toLocalInput(now.toISOString()),
    end: allDay
      ? event?.end?.date || ""
      : toLocalInput(event?.end?.dateTime) || toLocalInput(later.toISOString()),
    allDay,
    attendeeEmails: (event?.attendees || [])
      .map((item) => item.email)
      .join(", "),
    calendarId,
  };
}

function readableDate(event: GoogleCalendarEvent) {
  const start = event.start?.dateTime || event.start?.date;
  const end = event.end?.dateTime || event.end?.date;
  if (!start) return "Time not set";
  const allDay = Boolean(event.start?.date && !event.start.dateTime);
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(allDay ? {} : { hour: "numeric", minute: "2-digit" }),
  });
  return `${formatter.format(new Date(start))}${end ? ` – ${formatter.format(new Date(end))}` : ""}`;
}

export function CalendarEventPanel({
  open,
  event,
  defaultCalendarId,
  calendars,
  onOpenChange,
  onSave,
  onDelete,
}: CalendarEventPanelProps) {
  const isLaptop = useMediaQuery("(min-width: 1024px)");
  const [editing, setEditing] = useState(!event);
  const [values, setValues] = useState(() =>
    initialValues(event, defaultCalendarId)
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(initialValues(event, defaultCalendarId));
    setEditing(!event);
    setConfirmDelete(false);
  }, [defaultCalendarId, event, open]);

  const title = event
    ? editing
      ? "Edit event"
      : event.summary || "Untitled event"
    : "Create event";
  const description =
    event && !editing
      ? readableDate(event)
      : "Keep the team aligned without leaving Genit.";

  const content = useMemo(
    () => (
      <div className='relative overflow-hidden rounded-[inherit]'>
        <div className='relative max-h-[65vh] overflow-y-auto pr-1'>
          {!editing && event ? (
            <div className='space-y-5'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/15 dark:text-violet-300'>
                <CalendarDays className='h-5 w-5' />
              </div>
              <div className='space-y-3 rounded-2xl bg-black/[0.025] p-4 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
                <div className='flex gap-3 text-sm'>
                  <Clock3 className='mt-0.5 h-4 w-4 shrink-0 text-violet-500' />
                  <span>{readableDate(event)}</span>
                </div>
                {event.location && (
                  <div className='flex gap-3 text-sm'>
                    <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-violet-500' />
                    <span>{event.location}</span>
                  </div>
                )}
                {!!event.attendees?.length && (
                  <div className='flex gap-3 text-sm'>
                    <Users className='mt-0.5 h-4 w-4 shrink-0 text-violet-500' />
                    <span>
                      {event.attendees
                        .map((item) => item.displayName || item.email)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
              {event.description && (
                <div
                  suppressHydrationWarning
                  className='text-muted-foreground text-sm leading-6 whitespace-pre-wrap [&_a]:text-violet-600 [&_a]:underline [&_a]:underline-offset-2 dark:[&_a]:text-violet-300 [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeEventDescription(event.description),
                  }}
                />
              )}
              <div className='flex flex-col gap-2 border-t border-black/5 pt-5 sm:flex-row dark:border-white/10'>
                <Button
                  className='rounded-xl bg-violet-600 text-white hover:bg-violet-700'
                  onClick={() => setEditing(true)}
                >
                  <Pencil className='h-4 w-4' /> Edit event
                </Button>
                <Button
                  variant='outline'
                  className='rounded-xl sm:ml-auto'
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className='h-4 w-4' /> Delete
                </Button>
              </div>
              {confirmDelete && (
                <div className='relative mt-4 overflow-hidden rounded-2xl bg-neutral-50 px-4 py-4 ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
                  <GradientFrame />
                  <div className='relative z-10'>
                    <p className='text-foreground text-sm font-medium dark:text-white'>
                      Delete this event for everyone?
                    </p>
                    <p className='text-muted-foreground mt-1 text-xs dark:text-white/60'>
                      This cannot be undone.
                    </p>
                    <div className='mt-4 flex gap-2'>
                      <Button
                        size='sm'
                        disabled={deleting}
                        onClick={async () => {
                          setDeleting(true);
                          try {
                            await onDelete?.();
                          } finally {
                            setDeleting(false);
                          }
                        }}
                        className='rounded-xl bg-red-500 text-white hover:bg-red-600'
                      >
                        {deleting && <LoadingFileLoader size={20} />} Delete
                        event
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => setConfirmDelete(false)}
                        className='rounded-xl'
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form
              className='space-y-5'
              onSubmit={async (submitEvent) => {
                submitEvent.preventDefault();
                setSaving(true);
                const attendees = values.attendeeEmails
                  .split(",")
                  .map((email) => email.trim())
                  .filter(Boolean)
                  .map((email) => ({ email }));
                try {
                  await onSave({
                    calendarId: values.calendarId,
                    summary: values.summary.trim(),
                    description: values.description.trim() || undefined,
                    location: values.location.trim() || undefined,
                    start: values.allDay
                      ? { date: values.start }
                      : { dateTime: new Date(values.start).toISOString() },
                    end: values.allDay
                      ? { date: values.end }
                      : { dateTime: new Date(values.end).toISOString() },
                    attendees: attendees.length ? attendees : undefined,
                    sendUpdates: "all",
                  });
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div className='space-y-2'>
                <Label
                  htmlFor='event-title'
                  className='text-zinc-600 dark:text-zinc-400'
                >
                  Event title
                </Label>
                <Input
                  id='event-title'
                  required
                  autoFocus={!event}
                  value={values.summary}
                  onChange={(e) =>
                    setValues({ ...values, summary: e.target.value })
                  }
                  placeholder='Campaign review'
                  className='h-11 rounded-xl border-black/5 bg-black/[0.02] focus-visible:border-violet-500 focus-visible:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
                />
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='event-start'
                    className='text-zinc-600 dark:text-zinc-400'
                  >
                    Starts
                  </Label>
                  <Input
                    id='event-start'
                    required
                    type={values.allDay ? "date" : "datetime-local"}
                    value={values.start}
                    onChange={(e) =>
                      setValues({ ...values, start: e.target.value })
                    }
                    className='h-11 rounded-xl border-black/5 bg-black/[0.02] focus-visible:border-violet-500 focus-visible:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='event-end'
                    className='text-zinc-600 dark:text-zinc-400'
                  >
                    Ends
                  </Label>
                  <Input
                    id='event-end'
                    required
                    type={values.allDay ? "date" : "datetime-local"}
                    value={values.end}
                    onChange={(e) =>
                      setValues({ ...values, end: e.target.value })
                    }
                    className='h-11 rounded-xl border-black/5 bg-black/[0.02] focus-visible:border-violet-500 focus-visible:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
                  />
                </div>
              </div>
              <label className='flex cursor-pointer items-center gap-3 rounded-xl bg-black/[0.02] p-3.5 text-sm ring-1 ring-black/5 transition hover:bg-black/[0.03] dark:bg-white/[0.04] dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-white/[0.06]'>
                <input
                  type='checkbox'
                  checked={values.allDay}
                  onChange={(e) => {
                    const allDay = e.target.checked;
                    setValues({
                      ...values,
                      allDay,
                      start: allDay
                        ? values.start.slice(0, 10)
                        : `${values.start.slice(0, 10)}T09:00`,
                      end: allDay
                        ? values.end.slice(0, 10)
                        : `${values.end.slice(0, 10)}T10:00`,
                    });
                  }}
                  className='accent-violet-600'
                />{" "}
                All-day event
              </label>
              <div className='space-y-2'>
                <Label
                  htmlFor='event-calendar'
                  className='text-zinc-600 dark:text-zinc-400'
                >
                  Calendar
                </Label>
                <select
                  id='event-calendar'
                  value={values.calendarId}
                  onChange={(e) =>
                    setValues({ ...values, calendarId: e.target.value })
                  }
                  className='h-11 w-full rounded-xl border border-black/5 bg-black/[0.02] px-3 text-sm focus:ring-2 focus:ring-violet-500/50 focus:outline-none focus-visible:border-violet-500 focus-visible:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
                >
                  <option value='primary'>Primary calendar</option>
                  {calendars
                    .filter((item) => !item.primary && item.id !== "primary")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.summary}
                      </option>
                    ))}
                </select>
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='event-location'
                  className='text-zinc-600 dark:text-zinc-400'
                >
                  Location
                </Label>
                <Input
                  id='event-location'
                  value={values.location}
                  onChange={(e) =>
                    setValues({ ...values, location: e.target.value })
                  }
                  placeholder='Add a location or meeting link'
                  className='h-11 rounded-xl border-black/5 bg-black/[0.02] focus-visible:border-violet-500 focus-visible:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
                />
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='event-guests'
                  className='text-zinc-600 dark:text-zinc-400'
                >
                  Guests
                </Label>
                <Input
                  id='event-guests'
                  type='text'
                  value={values.attendeeEmails}
                  onChange={(e) =>
                    setValues({ ...values, attendeeEmails: e.target.value })
                  }
                  placeholder='name@company.com, teammate@company.com'
                  className='h-11 rounded-xl border-black/5 bg-black/[0.02] focus-visible:border-violet-500 focus-visible:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
                />
                <p className='text-muted-foreground text-xs dark:text-white/50'>
                  Separate email addresses with commas.
                </p>
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='event-description'
                  className='text-zinc-600 dark:text-zinc-400'
                >
                  Notes
                </Label>
                <Textarea
                  id='event-description'
                  value={values.description}
                  onChange={(e) =>
                    setValues({ ...values, description: e.target.value })
                  }
                  placeholder='Add an agenda or a helpful note'
                  className='min-h-24 rounded-xl border-black/5 bg-black/[0.02] p-3 focus-visible:border-violet-500 focus-visible:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
                />
              </div>
              <div className='flex flex-col-reverse gap-2 border-t border-black/5 pt-5 sm:flex-row sm:justify-end dark:border-white/10'>
                {event && (
                  <Button
                    type='button'
                    variant='ghost'
                    className='rounded-xl'
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type='submit'
                  disabled={saving || !values.summary.trim()}
                  className='rounded-xl bg-violet-600 text-white hover:bg-violet-700'
                >
                  {saving && <LoadingFileLoader size={20} />}
                  {event ? "Save changes" : "Create event"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    ),
    [confirmDelete, deleting, editing, event, onDelete, onSave, saving, values]
  );

  const panelUI = (
    <div className='group relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl bg-black/[0.02] p-4 ring-1 ring-black/5 md:p-6 dark:bg-white/[0.04] dark:ring-white/10'>
      <GradientFrame />
      <div className='relative z-10 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
        <div className='flex flex-col gap-1 border-b border-black/5 pb-4 dark:border-white/10'>
          <DialogTitle className='text-foreground text-xl font-semibold tracking-tight dark:text-white'>
            {title}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm dark:text-white/70'>
            {description}
          </DialogDescription>
        </div>
        {content}
      </div>
    </div>
  );

  if (isLaptop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-h-[94vh] max-w-xl overflow-y-auto border-0 bg-transparent p-0 shadow-none'>
          <DialogTitle className='sr-only'>{title}</DialogTitle>
          {panelUI}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='max-h-[96vh] overflow-y-auto border-0 bg-transparent px-3 pb-3 shadow-none'>
        <DrawerTitle className='sr-only'>{title}</DrawerTitle>
        {panelUI}
      </DrawerContent>
    </Drawer>
  );
}
