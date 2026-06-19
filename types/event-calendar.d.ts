declare module "@event-calendar/core" {
  export interface Calendar {
    getOption(name: string): any;
    setOption(name: string, value: any): void;
    addEvent(event: any): void;
    getEventById(id: string): any;
    getEvents(): any[];
    removeEventById(id: string): void;
    updateEvent(event: any): void;
    refetchEvents(): void;
    refetchResources(): void;
    dateFromPoint(x: number, y: number): any;
    getView(): any;
    next(): void;
    prev(): void;
    unselect(): void;
    today(): void;
    changeView(view: string): void;
  }

  export function createCalendar(
    target: HTMLElement,
    plugins?: any[],
    options?: any
  ): Calendar;

  export function destroyCalendar(calendar: Calendar): Promise<void>;

  export const Calendar: any;
  export const TimeGrid: any;
  export const DayGrid: any;
  export const Interaction: any;
}

declare module "@event-calendar/time-grid" {
  const plugin: any;
  export default plugin;
}

declare module "@event-calendar/day-grid" {
  const plugin: any;
  export default plugin;
}

declare module "@event-calendar/interaction" {
  const plugin: any;
  export default plugin;
}
