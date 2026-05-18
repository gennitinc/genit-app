"use client";

import { Calendar, Clock, ExternalLink, MapPin, Users } from "lucide-react";

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

function formatRange(
  start?: GcalEvent["start"],
  end?: GcalEvent["end"]
): string {
  const s = start?.dateTime || start?.date;
  const e = end?.dateTime || end?.date;
  if (!s) return "";
  try {
    const sd = new Date(s);
    if (!e) return sd.toLocaleString();
    const ed = new Date(e);
    const sameDay = sd.toDateString() === ed.toDateString();
    const dateStr = sd.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (start?.date) {
      return `${dateStr} · all day`;
    }
    const sTime = sd.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    const eTime = ed.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return sameDay
      ? `${dateStr} · ${sTime} – ${eTime}`
      : `${sd.toLocaleString()} – ${ed.toLocaleString()}`;
  } catch {
    return s;
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
    <div className='border-border bg-card/40 my-2 overflow-hidden rounded-md border dark:border-white/10 dark:bg-white/[0.02]'>
      <div className='border-border bg-card/60 flex items-center gap-2 border-b px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]'>
        <Calendar className='h-3.5 w-3.5 text-blue-500' />
        <span className='text-xs font-medium'>
          Calendar · {events.length}{" "}
          {events.length === 1 ? "event" : "events"}
        </span>
        {account && (
          <span className='text-muted-foreground ml-auto text-[10px]'>
            {account}
          </span>
        )}
      </div>
      {events.length === 0 ? (
        <div className='text-muted-foreground px-3 py-4 text-center text-xs'>
          Nothing on the calendar.
        </div>
      ) : (
        <ul className='divide-border divide-y dark:divide-white/10'>
          {events.map((e, i) => (
            <li key={e.id || i} className='px-3 py-2.5'>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <div className='text-foreground truncate text-sm font-medium'>
                    {e.summary || "(no title)"}
                  </div>
                  <div className='text-muted-foreground mt-0.5 flex items-center gap-1 text-[11px]'>
                    <Clock className='h-3 w-3' />
                    {formatRange(e.start, e.end)}
                  </div>
                  {e.location && (
                    <div className='text-muted-foreground mt-0.5 flex items-center gap-1 text-[11px]'>
                      <MapPin className='h-3 w-3' />
                      <span className='truncate'>{e.location}</span>
                    </div>
                  )}
                  {e.attendees && e.attendees.length > 0 && (
                    <div className='text-muted-foreground mt-0.5 flex items-center gap-1 text-[11px]'>
                      <Users className='h-3 w-3' />
                      {e.attendees.length}{" "}
                      {e.attendees.length === 1 ? "attendee" : "attendees"}
                    </div>
                  )}
                </div>
                {e.htmlLink && (
                  <a
                    href={e.htmlLink}
                    target='_blank'
                    rel='noreferrer'
                    className='text-muted-foreground hover:text-foreground shrink-0'
                    aria-label='Open in Google Calendar'
                  >
                    <ExternalLink className='h-3.5 w-3.5' />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
