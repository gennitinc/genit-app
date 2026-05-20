"use client";

import { CheckCircle2, Circle, ListTodo, Loader2, XCircle } from "lucide-react";
import type { AgentTask } from "@/lib/agents-api";
import { AgentCard } from "./agent-card";

function Icon({ status }: { status: AgentTask["status"] }) {
  if (status === "running")
    return <Loader2 className='text-foreground h-3.5 w-3.5 animate-spin' />;
  if (status === "done")
    return <CheckCircle2 className='h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400' />;
  if (status === "failed")
    return <XCircle className='h-3.5 w-3.5 text-rose-600 dark:text-rose-400' />;
  return <Circle className='text-muted-foreground/40 h-3.5 w-3.5' />;
}

export function AgentPlan({ tasks }: { tasks: AgentTask[] }) {
  if (!tasks || tasks.length === 0) return null;
  const done = tasks.filter((t) => t.status === "done").length;
  return (
    <AgentCard
      icon={<ListTodo className='h-3.5 w-3.5' />}
      title='Plan'
      meta={`${done}/${tasks.length}`}
    >
      <ol className='space-y-1.5'>
        {tasks.map((t) => (
          <li key={t.id} className='flex items-start gap-2.5 text-[12.5px]'>
            <span className='mt-[2px] shrink-0'>
              <Icon status={t.status} />
            </span>
            <span className='min-w-0 flex-1 leading-relaxed'>
              <span
                className={
                  t.status === "done"
                    ? "text-muted-foreground line-through decoration-muted-foreground/40"
                    : t.status === "failed"
                      ? "text-rose-700 dark:text-rose-300"
                      : t.status === "running"
                        ? "text-foreground font-medium"
                        : "text-foreground"
                }
              >
                {t.title}
              </span>
              {t.detail && (
                <span className='text-muted-foreground ml-1.5 text-[11.5px]'>
                  · {t.detail}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </AgentCard>
  );
}
