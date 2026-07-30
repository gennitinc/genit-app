"use client";

import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

type CalendarView = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

type CalendarEvent = {
  id: string;
  title: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  extendedProps?: Record<string, any>;
};

type CalendarEventClickInfo = {
  event: CalendarEvent;
};

type CalendarEventDropInfo = {
  event: CalendarEvent;
  oldEvent: CalendarEvent;
  newStart: Date;
  newEnd?: Date;
  allDay: boolean;
};

type CalendarDatesSetInfo = {
  start: Date;
  end: Date;
  view: {
    type: CalendarView;
    title: string;
  };
};

export interface EventCalendarHandle {
  getApi: () => {
    prev: () => void;
    next: () => void;
    setOption: (name: "view" | "date", value: CalendarView | Date) => void;
  };
}

interface EventCalendarProps {
  options: {
    view?: CalendarView;
    date?: Date;
    events?: CalendarEvent[];
    datesSet?: (info: CalendarDatesSetInfo) => void;
    eventClick?: (info: CalendarEventClickInfo) => void;
    eventDrop?: (info: CalendarEventDropInfo) => void;
    firstDay?: number;
    slotMinTime?: string;
    slotMaxTime?: string;
    editable?: boolean;
  };
  className?: string;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOUR_HEIGHT = 72;

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function startOfWeek(date: Date, firstDay: number) {
  const start = startOfDay(date);
  const offset = (start.getDay() - firstDay + 7) % 7;
  return addDays(start, -offset);
}

function startOfMonth(date: Date) {
  const start = startOfDay(date);
  start.setDate(1);
  return start;
}

function endOfMonth(date: Date) {
  const end = startOfMonth(date);
  end.setMonth(end.getMonth() + 1);
  return end;
}

function parseEventDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameDay(a: Date, b: Date) {
  return dateKey(a) === dateKey(b);
}

function maxDate(a: Date, b: Date) {
  return a.getTime() > b.getTime() ? a : b;
}

function minDate(a: Date, b: Date) {
  return a.getTime() < b.getTime() ? a : b;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatTitle(date: Date, view: CalendarView, firstDay: number) {
  if (view === "dayGridMonth") {
    return new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(date);
  }

  if (view === "timeGridDay") {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  const start = startOfWeek(date, firstDay);
  const end = addDays(start, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "long" });
  const shortMonthFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
  });
  const year = end.getFullYear();
  if (sameMonth) {
    return `${monthFormatter.format(start)} ${start.getDate()} - ${end.getDate()}, ${year}`;
  }
  return `${shortMonthFormatter.format(start)} ${start.getDate()} - ${shortMonthFormatter.format(end)} ${end.getDate()}, ${year}`;
}

function getVisibleRange(date: Date, view: CalendarView, firstDay: number) {
  if (view === "dayGridMonth") {
    const monthStart = startOfMonth(date);
    const start = startOfWeek(monthStart, firstDay);
    const end = addDays(startOfWeek(endOfMonth(date), firstDay), 7);
    return { start, end };
  }

  if (view === "timeGridWeek") {
    const start = startOfWeek(date, firstDay);
    return { start, end: addDays(start, 7) };
  }

  const start = startOfDay(date);
  return { start, end: addDays(start, 1) };
}

function parseHour(value = "06:00:00") {
  const [hour] = value.split(":").map(Number);
  return Number.isFinite(hour) ? hour : 6;
}

function getEventDuration(event: CalendarEvent) {
  const start = parseEventDate(event.start);
  const end = parseEventDate(event.end);
  if (!start || !end) return 60 * 60_000;
  return Math.max(end.getTime() - start.getTime(), 30 * 60_000);
}

function getEventEnd(event: CalendarEvent) {
  const start = parseEventDate(event.start);
  const end = parseEventDate(event.end);
  if (end) return end;
  if (!start) return null;
  return new Date(start.getTime() + 60 * 60_000);
}

function eventIntersectsDay(event: CalendarEvent, day: Date) {
  const start = parseEventDate(event.start);
  const end = getEventEnd(event);
  if (!start || !end) return false;
  const dayStart = startOfDay(day);
  const dayEnd = addDays(dayStart, 1);
  return (
    start.getTime() < dayEnd.getTime() && end.getTime() > dayStart.getTime()
  );
}

function moveEventToDate(event: CalendarEvent, target: Date, allDay: boolean) {
  const originalStart = parseEventDate(event.start) || new Date();
  const duration = getEventDuration(event);
  const newStart = new Date(target);

  if (allDay) {
    newStart.setHours(0, 0, 0, 0);
  } else {
    const targetHasTime = target.getHours() !== 0 || target.getMinutes() !== 0;
    newStart.setHours(
      targetHasTime ? target.getHours() : originalStart.getHours(),
      targetHasTime ? target.getMinutes() : originalStart.getMinutes(),
      originalStart.getSeconds(),
      originalStart.getMilliseconds()
    );
  }

  const newEnd = new Date(newStart.getTime() + duration);
  return { newStart, newEnd };
}

export const EventCalendar = forwardRef<
  EventCalendarHandle,
  EventCalendarProps
>(({ options, className }, ref) => {
  const firstDay = options.firstDay ?? 1;
  const [view, setView] = useState<CalendarView>(
    options.view || "dayGridMonth"
  );
  const [currentDate, setCurrentDate] = useState(options.date || new Date());
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    if (options.view && options.view !== view) setView(options.view);
  }, [options.view, view]);

  useImperativeHandle(
    ref,
    () => ({
      getApi: () => ({
        prev: () =>
          setCurrentDate((date) =>
            view === "dayGridMonth"
              ? addMonths(date, -1)
              : addDays(date, view === "timeGridWeek" ? -7 : -1)
          ),
        next: () =>
          setCurrentDate((date) =>
            view === "dayGridMonth"
              ? addMonths(date, 1)
              : addDays(date, view === "timeGridWeek" ? 7 : 1)
          ),
        setOption: (name, value) => {
          if (name === "view") setView(value as CalendarView);
          if (name === "date") setCurrentDate(value as Date);
        },
      }),
    }),
    [view]
  );

  const visibleRange = useMemo(
    () => getVisibleRange(currentDate, view, firstDay),
    [currentDate, firstDay, view]
  );
  const title = useMemo(
    () => formatTitle(currentDate, view, firstDay),
    [currentDate, firstDay, view]
  );

  useEffect(() => {
    options.datesSet?.({
      start: visibleRange.start,
      end: visibleRange.end,
      view: { type: view, title },
    });
  }, [options.datesSet, title, view, visibleRange.end, visibleRange.start]);

  const events = useMemo(
    () =>
      (options.events || [])
        .filter((event) => parseEventDate(event.start))
        .sort((a, b) => {
          const aStart = parseEventDate(a.start)?.getTime() || 0;
          const bStart = parseEventDate(b.start)?.getTime() || 0;
          return aStart - bStart;
        }),
    [options.events]
  );

  const dropEvent = (
    eventId: string,
    target: Date,
    requestedAllDay: boolean
  ) => {
    const event = events.find((item) => item.id === eventId);
    if (!event || !options.editable) return;
    const allDay = Boolean(event.allDay && requestedAllDay);
    const { newStart, newEnd } = moveEventToDate(event, target, allDay);
    options.eventDrop?.({
      event: {
        ...event,
        start: newStart.toISOString(),
        end: newEnd.toISOString(),
        allDay,
      },
      oldEvent: event,
      newStart,
      newEnd,
      allDay,
    });
  };

  const onDragStart = (
    reactEvent: React.DragEvent<HTMLElement>,
    event: CalendarEvent
  ) => {
    setDraggedId(event.id);
    reactEvent.dataTransfer.effectAllowed = "move";
    reactEvent.dataTransfer.setData("text/calendar-event-id", event.id);
  };

  const getDraggedId = (reactEvent: React.DragEvent<HTMLElement>) =>
    reactEvent.dataTransfer.getData("text/calendar-event-id") || draggedId;

  const renderEvent = (
    event: CalendarEvent,
    variant: "month" | "time" = "month"
  ) => {
    const start = parseEventDate(event.start);
    const accent = event.extendedProps?.accent || "#7c3aed";
    return (
      <button
        key={event.id}
        type='button'
        draggable={Boolean(options.editable)}
        onDragStart={(reactEvent) => onDragStart(reactEvent, event)}
        onDragEnd={() => setDraggedId(null)}
        onClick={() => options.eventClick?.({ event })}
        className={cn(
          "gcal-event-card",
          variant === "time" && "gcal-event-card-time"
        )}
        style={{ "--event-accent": accent } as React.CSSProperties}
        title={event.title}
      >
        <span className='gcal-event-dot' />
        <span className='gcal-event-copy'>
          <span className='gcal-event-time'>
            {event.allDay || !start ? "All day" : formatTime(start)}
          </span>
          <span className='gcal-event-title'>{event.title}</span>
          {event.extendedProps?.location && (
            <span className='gcal-event-location'>
              {event.extendedProps.location}
            </span>
          )}
        </span>
      </button>
    );
  };

  const monthDays = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) =>
        addDays(visibleRange.start, index)
      ),
    [visibleRange.start]
  );
  const weekDays = useMemo(
    () =>
      Array.from({ length: view === "timeGridDay" ? 1 : 7 }, (_, index) =>
        addDays(visibleRange.start, index)
      ),
    [view, visibleRange.start]
  );
  const hourStart = parseHour(options.slotMinTime);
  const hourEnd = parseHour(options.slotMaxTime || "22:00:00");
  const hours = Array.from(
    { length: Math.max(hourEnd - hourStart, 1) },
    (_, index) => hourStart + index
  );
  const today = new Date();

  if (view === "dayGridMonth") {
    return (
      <div className={cn("ec-custom-theme gennit-calendar", className)}>
        <div className='gcal-month-head'>
          {Array.from({ length: 7 }, (_, index) => {
            const day = (firstDay + index) % 7;
            return <div key={day}>{WEEKDAY_LABELS[day]}</div>;
          })}
        </div>
        <div className='gcal-month-grid'>
          {monthDays.map((day) => {
            const dayEvents = events.filter((event) => {
              const start = parseEventDate(event.start);
              return start ? sameDay(start, day) : false;
            });
            return (
              <div
                key={dateKey(day)}
                className={cn(
                  "gcal-month-day",
                  day.getMonth() !== currentDate.getMonth() &&
                    "gcal-outside-month",
                  sameDay(day, today) && "gcal-today",
                  draggedId && "gcal-drop-ready"
                )}
                onDragOver={(reactEvent) => {
                  if (options.editable) reactEvent.preventDefault();
                }}
                onDrop={(reactEvent) => {
                  reactEvent.preventDefault();
                  const eventId = getDraggedId(reactEvent);
                  if (eventId) dropEvent(eventId, day, true);
                  setDraggedId(null);
                }}
              >
                <div className='gcal-day-number'>{day.getDate()}</div>
                <div className='gcal-day-events'>
                  {dayEvents.map((event) => renderEvent(event))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("ec-custom-theme gennit-calendar", className)}>
      <div
        className='gcal-time-head'
        style={{
          gridTemplateColumns: `72px repeat(${weekDays.length}, minmax(148px, 1fr))`,
        }}
      >
        <div />
        {weekDays.map((day) => (
          <div
            key={dateKey(day)}
            className={cn(
              "gcal-time-day-label",
              sameDay(day, today) && "gcal-today"
            )}
          >
            <span>{WEEKDAY_LABELS[day.getDay()]}</span>
            <strong>{day.getDate()}</strong>
          </div>
        ))}
      </div>
      <div
        className='gcal-all-day-row'
        style={{
          gridTemplateColumns: `72px repeat(${weekDays.length}, minmax(148px, 1fr))`,
        }}
      >
        <div className='gcal-all-day-label'>All day</div>
        {weekDays.map((day) => {
          const dayEvents = events.filter(
            (event) => event.allDay && eventIntersectsDay(event, day)
          );
          return (
            <div
              key={dateKey(day)}
              className={cn(
                "gcal-all-day-cell",
                draggedId && "gcal-drop-ready"
              )}
              onDragOver={(reactEvent) => {
                if (options.editable) reactEvent.preventDefault();
              }}
              onDrop={(reactEvent) => {
                reactEvent.preventDefault();
                const eventId = getDraggedId(reactEvent);
                if (eventId) dropEvent(eventId, day, true);
                setDraggedId(null);
              }}
            >
              {dayEvents.slice(0, 2).map((event) => renderEvent(event))}
              {dayEvents.length > 2 && (
                <span className='gcal-more-events'>
                  +{dayEvents.length - 2}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div
        className='gcal-time-grid'
        style={{
          gridTemplateColumns: `72px repeat(${weekDays.length}, minmax(148px, 1fr))`,
        }}
      >
        <div className='gcal-time-axis'>
          {hours.map((hour) => (
            <div key={hour} style={{ height: HOUR_HEIGHT }}>
              {formatTime(new Date(2020, 0, 1, hour))}
            </div>
          ))}
        </div>
        {weekDays.map((day) => (
          <div key={dateKey(day)} className='gcal-time-column'>
            {hours.map((hour) => {
              const slotDate = new Date(day);
              slotDate.setHours(hour, 0, 0, 0);
              return (
                <div
                  key={`${dateKey(day)}-${hour}`}
                  className={cn(
                    "gcal-time-slot",
                    draggedId && "gcal-drop-ready"
                  )}
                  style={{ height: HOUR_HEIGHT }}
                  onDragOver={(reactEvent) => {
                    if (options.editable) reactEvent.preventDefault();
                  }}
                  onDrop={(reactEvent) => {
                    reactEvent.preventDefault();
                    const eventId = getDraggedId(reactEvent);
                    if (eventId) dropEvent(eventId, slotDate, false);
                    setDraggedId(null);
                  }}
                />
              );
            })}
            <div className='gcal-time-events'>
              {events
                .filter((event) => {
                  if (event.allDay) return false;
                  return eventIntersectsDay(event, day);
                })
                .map((event) => {
                  const rawStart = parseEventDate(event.start)!;
                  const rawEnd = getEventEnd(event)!;
                  const visibleStart = new Date(day);
                  visibleStart.setHours(hourStart, 0, 0, 0);
                  const visibleEnd = new Date(day);
                  visibleEnd.setHours(hourEnd, 0, 0, 0);
                  const start = maxDate(rawStart, visibleStart);
                  const end = minDate(rawEnd, visibleEnd);

                  if (end.getTime() <= start.getTime()) return null;

                  const startMinutes =
                    (start.getHours() - hourStart) * 60 + start.getMinutes();
                  const durationMinutes = Math.max(
                    (end.getTime() - start.getTime()) / 60_000,
                    30
                  );
                  const top = Math.max((startMinutes / 60) * HOUR_HEIGHT, 0);
                  const height = Math.max(
                    (durationMinutes / 60) * HOUR_HEIGHT - 6,
                    36
                  );
                  return (
                    <div
                      key={event.id}
                      className='gcal-time-event'
                      style={{ top, height }}
                    >
                      {renderEvent(event, "time")}
                    </div>
                  );
                })
                .filter(Boolean)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

EventCalendar.displayName = "EventCalendar";
