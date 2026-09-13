"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const DAY_MS = 86_400_000;

export function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromIso(value: string) {
  return new Date(`${value}T12:00:00`);
}

function prettyDateRange(from: string, to: string) {
  const format = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${format.format(dateFromIso(from))} - ${format.format(dateFromIso(to))}`;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function monthCells(month: Date) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function DateRangeMonth({
  month,
  from,
  to,
  onSelect,
}: {
  month: Date;
  from: Date;
  to: Date;
  onSelect: (date: Date) => void;
}) {
  return (
    <div>
      <h3 className='mb-4 text-center text-sm font-semibold text-zinc-950 dark:text-white'>
        {month.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h3>
      <div className='mb-2 grid grid-cols-7 text-center text-xs text-zinc-500 dark:text-white/45'>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-y-1'>
        {monthCells(month).map((day) => {
          const muted = day.getMonth() !== month.getMonth();
          const selected =
            isoDate(day) === isoDate(from) || isoDate(day) === isoDate(to);
          const ranged =
            day.getTime() > from.getTime() && day.getTime() < to.getTime();
          return (
            <button
              key={day.toISOString()}
              type='button'
              onClick={() => onSelect(day)}
              className={[
                "mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm transition",
                muted
                  ? "text-zinc-300 dark:text-white/25"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-white/65 dark:hover:bg-white/10",
                ranged ? "bg-sky-500/10 text-sky-600 dark:text-sky-300" : "",
                selected
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/20 hover:bg-sky-500 dark:bg-sky-500 dark:text-white"
                  : "",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({
  from,
  to,
  onChange,
}: {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [isPickingRangeEnd, setIsPickingRangeEnd] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [rangeStart, rangeEnd] = useMemo(() => {
    const start = dateFromIso(from);
    const end = dateFromIso(to);
    return start <= end ? [start, end] : [end, start];
  }, [from, to]);

  const selectDate = (date: Date) => {
    if (!isPickingRangeEnd) {
      onChange(isoDate(date), isoDate(date));
      setIsPickingRangeEnd(true);
    } else {
      onChange(
        isoDate(date < rangeStart ? date : rangeStart),
        isoDate(date < rangeStart ? rangeStart : date)
      );
      setIsPickingRangeEnd(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type='button'
          className='flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-700 shadow-sm transition hover:bg-zinc-100 sm:w-auto dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80 dark:shadow-none dark:hover:bg-white/[0.07]'
        >
          <CalendarDays className='h-4 w-4 text-zinc-500 dark:text-white/55' />
          {prettyDateRange(from, to)}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        className='w-[min(calc(100vw-2rem),760px)] rounded-lg border-zinc-200 bg-white p-4 text-zinc-950 dark:border-white/10 dark:bg-[#0b0b0b] dark:text-white'
      >
        <div className='mb-4 flex items-center justify-between'>
          <button
            type='button'
            onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
            className='flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
            aria-label='Previous month'
          >
            <ChevronLeft className='h-4 w-4' />
          </button>
          <p className='text-sm font-medium text-zinc-600 dark:text-white/60'>
            {prettyDateRange(from, to)}
          </p>
          <button
            type='button'
            onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
            className='flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
            aria-label='Next month'
          >
            <ChevronRight className='h-4 w-4' />
          </button>
        </div>
        <div className='grid gap-6 md:grid-cols-2'>
          <DateRangeMonth
            month={visibleMonth}
            from={rangeStart}
            to={rangeEnd}
            onSelect={selectDate}
          />
          <DateRangeMonth
            month={addMonths(visibleMonth, 1)}
            from={rangeStart}
            to={rangeEnd}
            onSelect={selectDate}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
