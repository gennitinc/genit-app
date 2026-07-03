"use client";

import { CalendarEventPanel } from "./_components/calendar-event-panel";
import { GoogleCalendarBrand } from "@/app/(auth)/onboarding/_components/social-icons";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import {
  INTEGRATIONS,
  type Integration,
} from "@/app/integrations/integrations-explorer";
import { Button } from "@/components/ui/button";
import {
  EventCalendar,
  type EventCalendarHandle,
} from "@/components/ui/event-calendar";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useIntegrations } from "@/hooks/use-integrations";
import { useToast } from "@/hooks/use-toast";
import {
  type CreateGoogleCalendarEventInput,
  type GoogleCalendarEvent,
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  listGoogleCalendarEvents,
  listGoogleCalendars,
  updateGoogleCalendarEvent,
} from "@/lib/integrations-api";
import { LoadingFileLoader } from "@/utils/Loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import React, {
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from "react";

type CalendarView = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

const VIEW_OPTIONS: Array<{ label: string; value: CalendarView }> = [
  { label: "Month", value: "dayGridMonth" },
  { label: "Week", value: "timeGridWeek" },
  { label: "Day", value: "timeGridDay" },
];

const EVENT_COLORS = ["#7c3aed", "#2563eb", "#059669", "#db2777", "#d97706"];

function initialMonthRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(1);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

function eventStart(event: GoogleCalendarEvent) {
  return event.start?.dateTime || event.start?.date;
}

function eventEnd(event: GoogleCalendarEvent) {
  return event.end?.dateTime || event.end?.date;
}

function eventColor(id: string) {
  const hash = Array.from(id).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  return EVENT_COLORS[hash % EVENT_COLORS.length];
}

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toMovedEventInput(
  event: GoogleCalendarEvent,
  calendarId: string,
  start: Date,
  end: Date | undefined,
  allDay: boolean
): CreateGoogleCalendarEventInput {
  const fallbackEnd = new Date(start.getTime() + 60 * 60_000);
  return {
    calendarId,
    summary: event.summary || "Untitled event",
    description: event.description,
    location: event.location,
    start: allDay
      ? { date: localDateString(start) }
      : { dateTime: start.toISOString() },
    end: allDay
      ? {
          date: localDateString(
            end || new Date(start.getTime() + 24 * 60 * 60_000)
          ),
        }
      : { dateTime: (end || fallbackEnd).toISOString() },
    attendees: event.attendees,
    sendUpdates: "all",
  };
}

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUserContext();
  const { byPlatform, isLoading: integrationsLoading } = useIntegrations();
  const googleConnections = byPlatform.get("google_calendar") || [];
  const activeConnection = googleConnections.find(
    (connection) => connection.status === "active"
  );

  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>("dayGridMonth");
  const [visibleRange, setVisibleRange] = useState(initialMonthRange);
  const [calendarTitle, setCalendarTitle] = useState(() =>
    new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(new Date())
  );
  const [selectedCalendarId, setSelectedCalendarId] = useState("primary");
  const [search, setSearch] = useState("");
  const [eventPanelOpen, setEventPanelOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<GoogleCalendarEvent | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const calendarRef = useRef<EventCalendarHandle>(null);

  const handleConnectCalendar = () => {
    const gcalIntegration = INTEGRATIONS.find(
      (i) => i.platform === "google_calendar"
    );
    if (gcalIntegration) {
      setConnectFor(gcalIntegration);
    }
  };

  const calendarsQuery = useQuery({
    queryKey: ["google-calendars", activeConnection?._id],
    queryFn: () => listGoogleCalendars(activeConnection!._id),
    enabled: Boolean(activeConnection),
    staleTime: 5 * 60_000,
  });

  const eventsQuery = useQuery({
    queryKey: [
      "google-calendar-events",
      activeConnection?._id,
      selectedCalendarId,
      visibleRange.start,
      visibleRange.end,
      deferredSearch,
    ],
    queryFn: () =>
      listGoogleCalendarEvents(activeConnection!._id, {
        calendarId: selectedCalendarId,
        q: deferredSearch || undefined,
        timeMin: visibleRange.start,
        timeMax: visibleRange.end,
        maxResults: 2500,
        orderBy: "startTime",
      }),
    enabled: Boolean(activeConnection),
    placeholderData: (previous) => previous,
    staleTime: 30_000,
  });

  const events = useMemo(
    () =>
      (eventsQuery.data?.events || [])
        .filter((event) => event.status !== "cancelled" && eventStart(event))
        .map((event) => ({
          id: event.id,
          start: eventStart(event),
          end: eventEnd(event),
          title: event.summary || "Untitled event",
          allDay: Boolean(event.start?.date && !event.start.dateTime),
          extendedProps: {
            sourceEvent: event,
            htmlLink: event.htmlLink,
            location: event.location,
            accent: eventColor(event.id),
          },
        })),
    [eventsQuery.data]
  );

  const handleDatesSet = useCallback((info: any) => {
    setVisibleRange({
      start: info.start.toISOString(),
      end: info.end.toISOString(),
    });
    setCalendarTitle(info.view?.title || "Calendar");
  }, []);

  const moveEvent = useCallback(
    async (info: any) => {
      if (!activeConnection) return;
      const sourceEvent =
        info.oldEvent?.extendedProps?.sourceEvent ||
        info.event?.extendedProps?.sourceEvent;
      if (!sourceEvent) return;

      try {
        await updateGoogleCalendarEvent(
          activeConnection._id,
          sourceEvent.id,
          toMovedEventInput(
            sourceEvent,
            selectedCalendarId,
            info.newStart,
            info.newEnd,
            Boolean(info.allDay)
          )
        );
        await queryClient.invalidateQueries({
          queryKey: ["google-calendar-events"],
        });
        toast({ title: "Event moved" });
      } catch (error: any) {
        toast({
          title: "Could not move event",
          description: error?.response?.data?.message || error?.message,
          variant: "destructive",
        });
        await queryClient.invalidateQueries({
          queryKey: ["google-calendar-events"],
        });
      }
    },
    [activeConnection, queryClient, selectedCalendarId, toast]
  );

  const calendarOptions = useMemo(
    () => ({
      view: currentView,
      headerToolbar: { start: "", center: "", end: "" },
      events,
      datesSet: handleDatesSet,
      slotMinTime: "06:00:00",
      slotMaxTime: "22:00:00",
      slotDuration: "00:30:00",
      allDaySlot: true,
      editable: true,
      nowIndicator: true,
      firstDay: 1,
      dayMaxEvents: 3,
      moreLinkContent: (info: any) => `View ${info.num} more`,
      dayHeaderFormat: { weekday: "short" },
      eventDrop: moveEvent,
      eventClick: (info: any) => {
        setSelectedEvent(info.event?.extendedProps?.sourceEvent || null);
        setEventPanelOpen(true);
      },
    }),
    [currentView, events, handleDatesSet, moveEvent]
  );

  const openCreateEvent = () => {
    setSelectedEvent(null);
    setEventPanelOpen(true);
  };

  const saveEvent = async (input: CreateGoogleCalendarEventInput) => {
    if (!activeConnection) return;
    try {
      if (selectedEvent) {
        await updateGoogleCalendarEvent(
          activeConnection._id,
          selectedEvent.id,
          input
        );
      } else {
        await createGoogleCalendarEvent(activeConnection._id, input);
      }
      await queryClient.invalidateQueries({
        queryKey: ["google-calendar-events"],
      });
      setEventPanelOpen(false);
      toast({ title: selectedEvent ? "Event updated" : "Event created" });
    } catch (error: any) {
      toast({
        title: "Could not save event",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeEvent = async () => {
    if (!activeConnection || !selectedEvent) return;
    try {
      await deleteGoogleCalendarEvent(
        activeConnection._id,
        selectedEvent.id,
        selectedCalendarId
      );
      await queryClient.invalidateQueries({
        queryKey: ["google-calendar-events"],
      });
      setEventPanelOpen(false);
      toast({ title: "Event deleted" });
    } catch (error: any) {
      toast({
        title: "Could not delete event",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const calendarApi = () => calendarRef.current?.getApi();
  const changeView = (view: CalendarView) => {
    setCurrentView(view);
    calendarApi()?.setOption("view", view);
  };

  const errorMessage =
    (eventsQuery.error as any)?.response?.data?.message ||
    (eventsQuery.error as Error | null)?.message;
  const eventCount = eventsQuery.data?.events.length || 0;

  return (
    <div className='animate-in fade-in flex w-full flex-col gap-5 duration-500'>
      <section className='relative overflow-hidden rounded-3xl border p-4'>
        <img
          src='https://i.pinimg.com/1200x/d3/fb/28/d3fb286b8631f66116718fdc97b1d6bf.jpg'
          className='pointer-events-none absolute inset-0 h-full w-full object-cover select-none'
          alt=''
        />
        <div className='relative grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:items-stretch'>
          <div className='flex min-w-0 flex-col justify-end py-1 lg:pl-6'>
            <div>
              <h3 className='font-instrument-serif text-2xl font-semibold tracking-tight text-white md:text-3xl'>
                Brand Events
              </h3>
              <p className='text-muted-foreground mt-1 text-sm'>
                Plan your work and keep every Google Calendar event in sync.
              </p>
            </div>

            <div className='mt-4 flex flex-wrap items-center gap-2'>
              <div className='relative min-w-56 flex-1 sm:flex-none'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <input
                  type='search'
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder='Search events'
                  className='border-border/70 bg-background h-10 w-full rounded-sm border pr-3 pl-9 text-sm shadow-sm transition outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-500/10 sm:w-64'
                />
              </div>
              {activeConnection ? (
                <Button
                  className='my-2 rounded-sm bg-indigo-600 px-4 text-white hover:bg-indigo-700'
                  onClick={openCreateEvent}
                >
                  New event
                  <Plus className='h-4 w-4' />
                </Button>
              ) : (
                <Button
                  className='h-10 rounded-sm'
                  onClick={handleConnectCalendar}
                >
                  <GoogleCalendarBrand />
                  Connect calendar
                </Button>
              )}
            </div>
          </div>

          <div className='hidden rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-black/5 sm:block sm:p-5 dark:bg-zinc-950/95 dark:shadow-none dark:ring-white/10'>
            <div className='flex items-center justify-between gap-3 border-b border-black/5 pb-4 dark:border-white/10'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                  <CalendarDays className='h-4 w-4' />
                </div>
                <div className='min-w-0'>
                  <p className='text-foreground truncate text-sm font-medium dark:text-white'>
                    Google Calendar
                  </p>
                  <p className='text-muted-foreground truncate text-xs dark:text-white/50'>
                    {activeConnection?.accountName || "Not connected"}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1 text-[11px] font-medium ring-1 ${
                  activeConnection
                    ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/15 dark:text-emerald-400"
                    : "bg-black/5 text-zinc-600 ring-black/5 dark:bg-white/5 dark:text-white/60 dark:ring-white/10"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-sm ${
                    activeConnection ? "bg-emerald-500" : "bg-zinc-400"
                  }`}
                />
                {activeConnection ? "Synced" : "Offline"}
              </span>
            </div>

            <div className='mt-4 grid grid-cols-2 gap-3'>
              <div className='rounded-sm bg-black/[0.025] p-3 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
                <p className='text-muted-foreground text-[11px] dark:text-white/50'>
                  Events in view
                </p>
                <p className='text-foreground mt-1 text-xl font-semibold dark:text-white'>
                  {eventCount}
                </p>
              </div>
              <div className='rounded-sm bg-black/[0.025] p-3 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
                <p className='text-muted-foreground text-[11px] dark:text-white/50'>
                  Current view
                </p>
                <p className='text-foreground mt-1 truncate text-sm font-semibold dark:text-white'>
                  {VIEW_OPTIONS.find((option) => option.value === currentView)
                    ?.label || "Month"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='calendar-shell overflow-hidden rounded-xl border border-black/5 bg-white shadow-[0_16px_50px_-30px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-zinc-950'>
        <div className='grid gap-3 border-b border-zinc-200/80 p-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-4 dark:border-white/10'>
          <div className='flex min-w-0 items-center gap-2'>
            <div className='flex rounded-sm bg-zinc-100 p-1 dark:bg-white/[0.06]'>
              {VIEW_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => changeView(option.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    currentView === option.value
                      ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {activeConnection && (
              <label className='relative hidden min-w-0 sm:block'>
                <select
                  value={selectedCalendarId}
                  onChange={(event) =>
                    setSelectedCalendarId(event.target.value)
                  }
                  disabled={calendarsQuery.isLoading}
                  aria-label='Google calendar'
                  className='h-9 max-w-48 appearance-none truncate rounded-lg border border-zinc-200 bg-white py-1 pr-8 pl-3 text-sm font-medium outline-none dark:border-white/10 dark:bg-zinc-900'
                >
                  <option value='primary'>Primary calendar</option>
                  {(calendarsQuery.data || [])
                    .filter(
                      (calendar) =>
                        !calendar.primary && calendar.id !== "primary"
                    )
                    .map((calendar) => (
                      <option key={calendar.id} value={calendar.id}>
                        {calendar.summary}
                      </option>
                    ))}
                </select>
                <ChevronDown className='pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
              </label>
            )}
          </div>

          <div className='flex items-center justify-center gap-1'>
            <button
              onClick={() => calendarApi()?.prev()}
              aria-label='Previous date range'
              className='rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-white/10 dark:hover:text-white'
            >
              <ChevronLeft className='h-4 w-4' />
            </button>
            <button
              onClick={() => calendarApi()?.setOption("date", new Date())}
              className='min-w-44 rounded-lg px-3 py-2 text-center text-base font-semibold tracking-tight hover:bg-zinc-50 dark:hover:bg-white/[0.05]'
            >
              {calendarTitle}
            </button>
            <button
              onClick={() => calendarApi()?.next()}
              aria-label='Next date range'
              className='rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-white/10 dark:hover:text-white'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>

          <div className='flex items-center justify-between gap-2 lg:justify-end'>
            <span className='text-muted-foreground text-xs'>
              {eventCount} events
            </span>
            <button
              onClick={() => calendarApi()?.setOption("date", new Date())}
              className='rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/[0.05]'
            >
              Today
            </button>
            <button
              onClick={() => eventsQuery.refetch()}
              disabled={!activeConnection || eventsQuery.isFetching}
              aria-label='Refresh events'
            >
              {eventsQuery.isFetching ? (
                <LoadingFileLoader size={18} />
              ) : (
                <RefreshCw className='h-4 text-gray-400' />
              )}
            </button>
          </div>
        </div>

        {activeConnection && (
          <div className='border-b border-zinc-200/80 px-3 py-2 sm:hidden dark:border-white/10'>
            <select
              value={selectedCalendarId}
              onChange={(event) => setSelectedCalendarId(event.target.value)}
              className='w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm dark:bg-white/[0.06]'
            >
              <option value='primary'>Primary calendar</option>
              {(calendarsQuery.data || [])
                .filter((calendar) => !calendar.primary)
                .map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.summary}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div
          className={`relative w-full ${
            currentView === "dayGridMonth"
              ? "h-[580px] sm:h-[680px] lg:h-[720px]"
              : "h-[620px] lg:h-[680px]"
          } calendar-scrollbar-hidden overflow-x-auto bg-transparent`}
        >
          <EventCalendar
            options={calendarOptions}
            ref={calendarRef}
            className={`h-full bg-transparent ${
              currentView === "dayGridMonth"
                ? "min-w-0"
                : "min-w-[680px] sm:min-w-0"
            }`}
          />

          {(integrationsLoading ||
            (activeConnection && eventsQuery.isLoading)) && (
            <LoadingFileLoader />
          )}

          {!integrationsLoading && !activeConnection && (
            <div className='absolute inset-0 z-20 flex items-center justify-center bg-white/55 p-5 text-center backdrop-blur-[2px] dark:bg-zinc-950/55'>
              <div className='relative w-full max-w-sm overflow-hidden rounded-3xl bg-white/95 p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950/95 dark:ring-white/10'>
                <h3 className='relative text-lg font-semibold'>
                  Bring your schedule into Genit
                </h3>
                <p className='text-muted-foreground relative mt-1 mb-5 text-sm'>
                  Connect Google Calendar to create, edit, and manage events.
                </p>
                <Button
                  className='relative rounded-sm bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black'
                  onClick={handleConnectCalendar}
                >
                  <GoogleCalendarBrand />
                  Connect Google Calendar
                </Button>
              </div>
            </div>
          )}

          {activeConnection && eventsQuery.isError && (
            <div className='absolute inset-x-4 top-4 z-20 flex items-center justify-between gap-3 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-800 shadow-sm dark:border-red-900 dark:bg-red-950 dark:text-red-200'>
              <span>Could not load events. {errorMessage}</span>
              <button
                onClick={() => eventsQuery.refetch()}
                className='shrink-0 font-semibold'
              >
                Try again
              </button>
            </div>
          )}
        </div>

        <footer className='flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200/80 px-4 py-3 text-xs text-zinc-500 dark:border-white/10'>
          <span>
            {activeConnection
              ? `Synced with ${activeConnection.accountName}`
              : "Google Calendar is not connected"}
          </span>
        </footer>
      </section>

      <ConnectDialog
        open={Boolean(connectFor)}
        onOpenChange={(o) => !o && setConnectFor(null)}
        platform={connectFor?.platform ?? null}
        platformName={connectFor?.name ?? ""}
        platformDescription={connectFor?.description ?? ""}
        Icon={connectFor?.icon ?? (() => null)}
        glow={connectFor?.glow ?? "rgba(113,113,122,0.4)"}
      />
      <CalendarEventPanel
        open={eventPanelOpen}
        event={selectedEvent}
        defaultCalendarId={selectedCalendarId}
        calendars={calendarsQuery.data || []}
        onOpenChange={setEventPanelOpen}
        onSave={saveEvent}
        onDelete={selectedEvent ? removeEvent : undefined}
      />
    </div>
  );
}
