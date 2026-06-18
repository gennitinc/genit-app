"use client";

import { Button } from "@/components/ui/button";
import {
  EventCalendar,
  type EventCalendarHandle,
} from "@/components/ui/event-calendar";
import { useUserContext } from "@/context/AuthenticatedContext";
import { CalendarDays, ListFilter, Plus, Search } from "lucide-react";
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
          colorScheme:
            "bg-[#E8F5E9] dark:bg-emerald-950/40 ring-emerald-500/20",
          textColor: "text-emerald-950 dark:text-emerald-100",
          tagColor: "text-emerald-800 dark:text-emerald-300",
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
            className='h-10 w-full rounded-full border-none bg-black/[0.03] pr-4 pl-10 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:outline-none dark:bg-white/[0.03] dark:text-white'
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
      <div className='flex w-full flex-col gap-4 xl:flex-row'>
        {/* Main Banner */}
        <div className='relative flex min-h-[180px] flex-grow items-center overflow-hidden rounded-2xl bg-emerald-500 p-6 shadow-lg md:p-8'>
          <div className='relative z-10 w-full max-w-sm'>
            <h2 className='mb-2 text-2xl font-bold tracking-tight text-white md:text-3xl'>
              Brand calendar
            </h2>
            <p className='mb-6 text-sm text-emerald-50 opacity-90'>
              engage your followers with powerful content generated by Genit AI.
            </p>
            <Button className='rounded-full border border-emerald-400/50 bg-emerald-700/50 text-white shadow-none backdrop-blur-sm hover:bg-emerald-600'>
              <Plus className='mr-2 h-4 w-4' /> Create post
            </Button>
          </div>

          {/* Decorative Image overlay */}
          <div className='pointer-events-none absolute top-0 right-0 bottom-0 w-1/2 md:w-2/3'>
            {/* Using gradient mask to blend the image smoothly into the green background */}
            <div className='absolute inset-0 z-10 bg-gradient-to-r from-emerald-500 via-emerald-500/80 to-transparent'></div>
            <img
              src='/genit-auto.png'
              alt='Calendar Decoration'
              className='h-full w-full object-cover object-[center_30%] opacity-80 mix-blend-overlay'
            />
          </div>
        </div>

        {/* Side Banner (Community) */}
        <div className='flex h-[180px] w-[280px] flex-col items-center overflow-hidden rounded-[25px] bg-gray-300 shadow-[2px_3px_4px_rgba(0,0,0,0.15)] transition duration-100 ease-in-out'>
          {/* Info section */}
          <section className='relative flex h-[75%] w-full items-center justify-between overflow-hidden text-white'>
            {/* Background */}
            <div className='absolute inset-0 overflow-hidden bg-[#ec7263]'>
              <div className='absolute -top-[80%] -right-[50%] h-[300px] w-[300px] rounded-full bg-[#efc745] opacity-40' />
              <div className='absolute -top-[70%] -right-[30%] h-[210px] w-[210px] rounded-full bg-[#efc745] opacity-40' />
              <div className='absolute -top-[35%] -right-[8%] h-[100px] w-[100px] rounded-full bg-[#efc745]' />
            </div>

            {/* Left side */}
            <div className='z-10 flex h-full flex-col justify-around pl-[18px]'>
              <div className='flex items-center justify-start gap-[5px]'>
                <div className='flex w-[40%] items-center'>
                  <svg
                    className='h-8 w-8 fill-white'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 1024 1024'
                  >
                    <path d='M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z' />
                  </svg>
                </div>
                <div>Sunny</div>
              </div>

              <div className='text-[34pt] leading-[8%] font-medium'>36°</div>
              <div>42°/28°</div>
            </div>

            {/* Right side */}
            <div className='z-10 flex h-full flex-col items-end justify-around pr-[18px]'>
              <div className='flex flex-col items-end'>
                <div className='text-[19pt] leading-none'>23:56</div>
                <div className='text-[15px]'>MON 08-23</div>
              </div>
              <div>A Coruña</div>
            </div>
          </section>

          {/* Days section */}
          <section className='flex h-[25%] w-full items-center justify-between gap-[2px] bg-[#974859] shadow-[inset_0_2px_5px_#974859]'>
            {["TUE", "WED", "THU", "FRI"].map((day) => (
              <button
                key={day}
                className='flex h-full w-full cursor-pointer items-center justify-center gap-[5px] border-0 bg-[#a75265] shadow-[inset_0_2px_5px_#974859] transition duration-100 ease-in-out hover:scale-90 hover:rounded-[10px]'
              >
                <span className='text-[10pt] font-medium text-white opacity-70'>
                  {day}
                </span>

                <span className='flex h-full w-5 items-center'>
                  <svg
                    className='h-5 w-5 fill-white'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 1024 1024'
                  >
                    <path d='M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32z' />
                  </svg>
                </span>
              </button>
            ))}
          </section>
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
