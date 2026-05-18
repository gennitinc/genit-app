"use client";

import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
} from "lucide-react";
import type { AgentTask } from "@/lib/agents-api";

function Icon({ status }: { status: AgentTask["status"] }) {
  if (status === "running")
    return <Loader2 className='h-3.5 w-3.5 animate-spin text-blue-500' />;
  if (status === "done")
    return <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />;
  if (status === "failed")
    return <XCircle className='h-3.5 w-3.5 text-rose-500' />;
  return <Circle className='text-muted-foreground/50 h-3.5 w-3.5' />;
}

export function AgentPlan({ tasks }: { tasks: AgentTask[] }) {
  if (!tasks || tasks.length === 0) return null;
  return (
    <div className='border-border bg-card/40 my-2 rounded-md border px-3 py-2 dark:border-white/10 dark:bg-white/[0.02]'>
      <div className='text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wide uppercase'>
        Plan
      </div>
      <ul className='space-y-1'>
        {tasks.map((t) => (
          <li key={t.id} className='flex items-start gap-2 text-xs'>
            <span className='mt-0.5'>
              <Icon status={t.status} />
            </span>
            <span
              className={
                t.status === "done"
                  ? "text-muted-foreground line-through"
                  : t.status === "failed"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-foreground"
              }
            >
              {t.title}
              {t.detail && (
                <span className='text-muted-foreground ml-1.5 text-[11px] italic'>
                  · {t.detail}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
