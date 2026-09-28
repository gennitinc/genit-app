"use client";

import { PluginLogo, PluginName } from "../plugin-logo";
import { AgentCard } from "./agent-card";
import { LocalizedText } from "@/components/localized-text";
import { ExternalLink, MapPin, Users } from "lucide-react";

type GcalEvent = {
  id?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
  htmlLink?: string;
  attendees?: { email: string; displayName?: string }[];
};

type FormattedRange = {
  date: string;
  time: string;
  allDay: boolean;
};

function formatRange(
  start?: GcalEvent["start"],
  end?: GcalEvent["end"]
): FormattedRange {
  const s = start?.dateTime || start?.date;
  const e = end?.dateTime || end?.date;
  if (!s) return { date: "", time: "", allDay: false };
  try {
    const sd = new Date(s);
    const date = sd.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (start?.date) {
      return { date, time: "All day", allDay: true };
    }
    if (!e) {
      return {
        date,
        time: sd.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        }),
        allDay: false,
      };
    }
    const ed = new Date(e);
    const sameDay = sd.toDateString() === ed.toDateString();
    const sTime = sd.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    const eTime = ed.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return {
      date,
      time: sameDay
        ? `${sTime} – ${eTime}`
        : `${sTime} – ${ed.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })} ${eTime}`,
      allDay: false,
    };
  } catch {
    return { date: s, time: "", allDay: false };
  }
}

export function CalendarEventsCard({
  events,
  account,
}: {
  events: GcalEvent[];
  account?: string;
}) {
  return (
    <AgentCard
      icon={
        <PluginLogo label='Google Calendar' slug='google_calendar' compact />
      }
      title={`${events.length} ${events.length === 1 ? "event" : "events"}`}
      meta={
        <span className='inline-flex items-center gap-1.5'>
          <PluginName name='Google Calendar' slug='google_calendar' />
          {account && <span>· {account}</span>}
        </span>
      }
    >
      {events.length === 0 ? (
        <div className='text-muted-foreground py-2 text-center text-[12.5px]'>
          <LocalizedText text={"Nothing on the calendar."} />
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {events.map((e, i) => {
            const r = formatRange(e.start, e.end);
            return (
              <li
                key={e.id || i}
                className='hover:bg-muted/30 px-3.5 py-3 transition-colors dark:hover:bg-white/[0.02]'
              >
                <div className='flex items-start gap-3'>
                  <div className='flex w-12 shrink-0 flex-col items-start'>
                    <div className='text-foreground text-[11px] font-medium tracking-tight'>
                      {r.date}
                    </div>
                    <div className='text-muted-foreground mt-0.5 text-[10.5px] tabular-nums'>
                      {r.time}
                    </div>
                  </div>
                  <div className='border-border/70 self-stretch border-l dark:border-white/10' />
                  <div className='min-w-0 flex-1'>
                    <div className='text-foreground truncate text-[13px] leading-snug font-medium'>
                      {e.summary || "(no title)"}
                    </div>
                    <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5'>
                      {e.location && (
                        <div className='text-muted-foreground flex items-center gap-1 text-[11px]'>
                          <MapPin className='h-3 w-3' />
                          <span className='max-w-[180px] truncate'>
                            {e.location}
                          </span>
                        </div>
                      )}
                      {e.attendees && e.attendees.length > 0 && (
                        <div className='text-muted-foreground flex items-center gap-1 text-[11px]'>
                          <Users className='h-3 w-3' />
                          {e.attendees.length}{" "}
                          {e.attendees.length === 1 ? "attendee" : "attendees"}
                        </div>
                      )}
                    </div>
                  </div>
                  {e.htmlLink && (
                    <a
                      href={e.htmlLink}
                      target='_blank'
                      rel='noreferrer'
                      className='text-muted-foreground hover:text-foreground -mr-1 shrink-0 rounded p-1 transition-colors'
                      aria-label='Open in Google Calendar'
                    >
                      <ExternalLink className='h-3.5 w-3.5' />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AgentCard>
  );
}
