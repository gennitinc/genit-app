"use client";

import { Button } from "@/components/ui/button";
import {
  EventCalendar,
  type EventCalendarHandle,
} from "@/components/ui/event-calendar";
import { useUserContext } from "@/context/AuthenticatedContext";
import { CalendarDays, ListFilter, Plus, Search } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";

export default function CalendarPage() {
  const { user } = useUserContext();
  const members = user?.currentOrganization?.members || [];

  const [currentView, setCurrentView] = useState("timeGridWeek");
  const calendarRef = useRef<EventCalendarHandle>(null);

  const mockEvents = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    return [
      {
        id: "1",
        start: new Date(currentYear, currentMonth, currentDate, 10, 0),
        end: new Date(currentYear, currentMonth, currentDate, 11, 0),
        title: "Summer Promo",
        extendedProps: {
          platform: "facebook",
          image:
            "https://i.pinimg.com/736x/b8/4a/b9/b84ab9b1f6117b4c6347d56f2b969381.jpg",
          tag: "meal",
          colorScheme: "bg-[#E8F5E9] dark:bg-gray-950/40 ring-gray-500/20",
          textColor: "text-gray-950 dark:text-gray-100",
          tagColor: "text-gray-800 dark:text-gray-300",
          tagBg: "bg-white/50 dark:bg-black/50",
        },
      },
      {
        id: "2",
        start: new Date(currentYear, currentMonth, currentDate + 1, 14, 0),
        end: new Date(currentYear, currentMonth, currentDate + 1, 15, 30),
        title: "Beautiful weather",
        extendedProps: {
          platform: "instagram",
          image: "/genit-auto.png",
          colorScheme:
            "bg-white dark:bg-zinc-900 ring-black/5 dark:ring-white/10",
        },
      },
      {
        id: "3",
        start: new Date(currentYear, currentMonth, currentDate + 2, 9, 0),
        end: new Date(currentYear, currentMonth, currentDate + 2, 10, 0),
        title: "Flash Sale",
        extendedProps: {
          platform: "x",
          colorScheme: "bg-[#FFF3E0] dark:bg-orange-950/40 ring-orange-500/20",
          textColor: "text-orange-950 dark:text-orange-100",
          tag: "promo",
          tagColor: "text-orange-800 dark:text-orange-300",
          tagBg: "bg-white/50 dark:bg-black/50",
        },
      },
    ];
  }, []);

  const calendarOptions = useMemo(
    () => ({
      view: currentView,
      headerToolbar: { start: "", center: "", end: "" },
      events: mockEvents,
      slotMinTime: "06:00:00",
      slotMaxTime: "22:00:00",
      allDaySlot: false,
      editable: true,
      dayHeaderFormat: { weekday: "long", day: "numeric" },
      eventContent: (info: any) => {
        const { extendedProps, title } = info.event;
        return {
          html: `
          <div class="relative h-full w-full rounded-[14px] p-2 md:p-3 shadow-sm ring-1 z-10 flex flex-col overflow-hidden ${extendedProps.colorScheme || "bg-white dark:bg-zinc-900 ring-black/5 dark:ring-white/10"}">
            ${
              extendedProps.image
                ? `
              <div class="w-full h-16 md:h-20 rounded-lg overflow-hidden relative mb-2 flex-shrink-0">
                <img src="${extendedProps.image}" class="w-full h-full object-cover" />
              </div>
            `
                : ""
            }
            <div class="flex-grow flex flex-col justify-between">
              <div>
                <p class="text-[10px] md:text-xs font-bold leading-tight ${extendedProps.textColor || "text-foreground dark:text-white"}">${title}</p>
                ${
                  extendedProps.tag
                    ? `
                  <div class="flex items-center gap-1 mt-1 md:mt-1.5">
                    <span class="text-[8px] md:text-[9px] px-1 md:px-1.5 py-0.5 rounded font-medium ${extendedProps.tagBg} ${extendedProps.tagColor}">${extendedProps.tag}</span>
                  </div>
                `
                    : ""
                }
              </div>
              ${
                extendedProps.platform
                  ? `
                <div class="absolute bottom-2 right-2 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-sm ${extendedProps.platform === "facebook" ? "bg-blue-600" : extendedProps.platform === "instagram" ? "bg-pink-500" : "bg-black dark:bg-white"}">
                  ${extendedProps.platform === "facebook" ? "f" : extendedProps.platform === "instagram" ? "ig" : "x"}
                </div>
              `
                  : ""
              }
            </div>
          </div>
        `,
        };
      },
    }),
    [currentView, mockEvents]
  );

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 flex w-full flex-col gap-8 duration-500'>
      {/* Top Search & Profile Bar */}
      <div className='hidden w-full items-center justify-between md:flex'>
        <div className='relative w-full max-w-md'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <input
            type='text'
            placeholder='Search anything...'
            className='h-10 w-full rounded-full border-none bg-black/[0.03] pr-4 pl-10 text-sm focus:ring-2 focus:ring-gray-500/50 focus:outline-none dark:bg-white/[0.03] dark:text-white'
          />
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-muted-foreground text-sm font-medium'>
            Team members
          </span>
          <div className='flex -space-x-2'>
            {members.slice(0, 5).map((member, i) => {
              const isCurrentUser =
                typeof member.user === "object"
                  ? (member.user as any)._id === user?._id
                  : member.user === user?._id;

              const dp =
                typeof member.user === "object" && (member.user as any).userdp
                  ? (member.user as any).userdp
                  : isCurrentUser
                    ? user?.userdp
                    : `https://i.pravatar.cc/150?u=${typeof member.user === "string" ? member.user : i}`;

              return (
                <div
                  key={i}
                  className='h-8 w-8 overflow-hidden rounded-full bg-black/5 ring-2 ring-white dark:bg-white/10 dark:ring-black'
                >
                  <img
                    src={dp}
                    alt='Team member'
                    className='h-full w-full object-cover'
                  />
                </div>
              );
            })}

            {members.length === 0 && user?.userdp && (
              <div className='h-8 w-8 overflow-hidden rounded-full bg-black/5 ring-2 ring-white dark:bg-white/10 dark:ring-black'>
                <img
                  src={user.userdp}
                  alt='Team member'
                  className='h-full w-full object-cover'
                />
              </div>
            )}

            <div className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-500 ring-2 ring-white transition hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-black'>
              <Plus className='h-4 w-4' />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banners */}
      <div className='flex w-full items-stretch gap-4'>
        {/* Main Banner - 60% */}
        <div className='relative basis-[60%] overflow-hidden rounded-2xl bg-black p-4 shadow-lg sm:p-6 dark:bg-black border'>
          <div className='relative z-20 w-[60%] max-w-sm'>
            <h2 className='mb-2 text-lg font-bold tracking-tight text-white sm:text-xl md:text-2xl dark:text-white'>
              Brand Calendar
            </h2>

            <p className='mb-4 text-xs text-gray-400 sm:text-sm'>
              30 days content planed in minutes
            </p>

            <Button size='sm' className="bg-white text-black">
              <Plus className='mr-2 h-4 w-4 text-black' />
              Create Post
            </Button>
          </div>

          {/* Background Image */}
          <div className='pointer-events-none absolute inset-y-0 right-0 w-[55%]'>
            <div className='absolute inset-0 z-10 bg-gradient-to-r from-black via-black/90 to-transparent dark:from-black dark:via-black/90' />

            <img
              src='https://i.pinimg.com/736x/99/b2/50/99b2505312d9cf6358758e1e392eeab6.jpg'
              alt='Calendar Decoration'
              className='h-full w-full object-cover'
            />
          </div>
        </div>

        {/* Side Banner - 40% */}
        <div className='relative basis-[40%] overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-black'>
          <div className='relative h-full min-h-[240px] w-full'>
            <Image
              src='/calendar-home1.png'
              alt='Calendar Decoration'
              fill
              priority
              className='object-cover object-[center_60%]'
            />
          </div>
        </div>
      </div>

      {/* Calendar Grid Header */}
      <div className='flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='flex items-center gap-3'>
          <h2 className='text-foreground text-xl font-bold md:text-2xl dark:text-white'>
            August 2026
          </h2>
          <select className='cursor-pointer rounded-full border-none bg-black/5 px-3 py-1 text-sm font-medium focus:ring-0 dark:bg-white/10'>
            <option>Social post</option>
            <option>Blog post</option>
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex items-center rounded-full bg-black/5 p-1 dark:bg-white/10'>
            <button
              onClick={() => {
                calendarRef.current?.getApi()?.today();
              }}
              className='rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm dark:bg-zinc-800'
            >
              Today
            </button>
            <button
              onClick={() => {
                setCurrentView((v) =>
                  v === "timeGridWeek" ? "timeGridDay" : "timeGridWeek"
                );
                calendarRef.current
                  ?.getApi()
                  ?.changeView(
                    currentView === "timeGridWeek"
                      ? "timeGridDay"
                      : "timeGridWeek"
                  );
              }}
              className='text-muted-foreground hover:text-foreground px-3 py-1 text-sm font-medium transition'
            >
              {currentView === "timeGridWeek" ? "Day" : "Week"}
            </button>
          </div>
          <div className='flex items-center rounded-full bg-black/5 p-1 dark:bg-white/10'>
            <button className='text-muted-foreground hover:text-foreground p-1.5 transition'>
              <ListFilter className='h-4 w-4' />
            </button>
            <button className='rounded-full bg-white p-1.5 shadow-sm dark:bg-zinc-800'>
              <CalendarDays className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Event Calendar */}
      <div className='h-[600px] w-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
        <EventCalendar options={calendarOptions} ref={calendarRef} />
      </div>
    </div>
  );
}
