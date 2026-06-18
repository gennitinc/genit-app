"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { createCalendar, destroyCalendar, TimeGrid, DayGrid, Interaction } from '@event-calendar/core';
import '@event-calendar/core/index.css';

export interface EventCalendarHandle {
  getApi: () => any | null;
}

interface EventCalendarProps {
  options: any;
  className?: string;
}

export const EventCalendar = forwardRef<EventCalendarHandle, EventCalendarProps>(
  ({ options, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<any | null>(null);

    useImperativeHandle(ref, () => ({
      getApi: () => calendarRef.current,
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      // Initialize the calendar
      calendarRef.current = createCalendar(
        containerRef.current,
        [TimeGrid, DayGrid, Interaction],
        options
      );

      // Cleanup on unmount
      return () => {
        if (calendarRef.current) {
          destroyCalendar(calendarRef.current);
          calendarRef.current = null;
        }
      };
    }, []); // Only run once on mount

    // Update options when they change
    useEffect(() => {
      if (calendarRef.current) {
        calendarRef.current.setOption('events', options.events);
        // Note: You can add other options to update here if needed.
        // For a generic wrapper, we might diff options or explicitly update known changing props.
      }
    }, [options.events]);

    return (
      <div 
        ref={containerRef} 
        className={`ec-custom-theme ${className || ""}`}
      />
    );
  }
);

EventCalendar.displayName = 'EventCalendar';
