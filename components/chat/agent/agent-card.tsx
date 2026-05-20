"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "error" | "warning" | "info";

const toneIconClass: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  error: "text-rose-600 dark:text-rose-400",
  warning: "text-amber-600 dark:text-amber-400",
  info: "text-foreground",
};

export function AgentCard({
  icon,
  title,
  meta,
  tone = "neutral",
  children,
  className,
  footer,
}: {
  icon?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-border/70 bg-card text-card-foreground my-3 overflow-hidden rounded-xl border shadow-[0_1px_0_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none",
        className
      )}
    >
      <div className='border-border/70 flex items-center gap-2 border-b px-3.5 py-2.5 dark:border-white/10'>
        {icon && (
          <span className={cn("flex h-4 w-4 items-center justify-center", toneIconClass[tone])}>
            {icon}
          </span>
        )}
        <span className='text-foreground text-[13px] leading-none font-medium tracking-tight'>
          {title}
        </span>
        {meta && (
          <span className='text-muted-foreground ml-auto truncate text-[11px] tabular-nums'>
            {meta}
          </span>
        )}
      </div>
      {children && <div className='px-3.5 py-3'>{children}</div>}
      {footer && (
        <div className='border-border/70 bg-muted/30 border-t px-3.5 py-2 dark:border-white/10 dark:bg-white/[0.015]'>
          {footer}
        </div>
      )}
    </div>
  );
}

// Compact pill button styled for use inside AgentCard footers and bodies.
// No gradients — solid foreground/background or outlined.
export function AgentButton({
  variant = "primary",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-md h-7 px-2.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";
  const styles: Record<string, string> = {
    primary:
      "bg-foreground text-background hover:bg-foreground/90",
    secondary:
      "border border-border/70 bg-background text-foreground hover:bg-accent dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]",
    ghost:
      "text-muted-foreground hover:text-foreground hover:bg-accent dark:hover:bg-white/[0.05]",
  };
  return (
    <button className={cn(base, styles[variant], className)} {...rest}>
      {children}
    </button>
  );
}

// Compact text input used inside the cards. Matches the chat-input language
// but at a smaller scale.
export function AgentInput({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "border-border/70 bg-background text-foreground placeholder:text-muted-foreground/70 h-8 w-full rounded-md border px-2.5 text-xs leading-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none dark:border-white/10 dark:bg-white/[0.03]",
        className
      )}
      {...rest}
    />
  );
}

// Section eyebrow label (e.g. "PLAN", "THOUGHT"). Tight, all-caps, restrained.
export function AgentEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-muted-foreground text-[10px] font-medium tracking-[0.08em] uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}
