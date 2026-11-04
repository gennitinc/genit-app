"use client";

import { Button } from "@/components/ui/button";
import { useUpdateIntegrationInboxSettings } from "@/hooks/use-integrations";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

const MAX = 1500;

/**
 * Owner instructions for the AI auto-reply. Facts (prices, delivery, hours)
 * belong in Brand Brain, where the AI looks them up; this is for tone and
 * rules such as "never offer discounts".
 */
export function AutoReplyInstructions({
  integrationId,
  initial,
}: {
  integrationId: string;
  initial?: string;
}) {
  const [value, setValue] = useState(initial || "");
  const update = useUpdateIntegrationInboxSettings();
  const dirty = value.trim() !== (initial || "").trim();

  async function save() {
    try {
      await update.mutateAsync({
        id: integrationId,
        autoReplyInstruction: value.trim(),
      });
      toast.success("Auto-reply instructions saved");
    } catch (err: any) {
      toast.error("Could not save instructions", {
        description: err?.response?.data?.message || err?.message,
      });
    }
  }

  return (
    <div className='mt-3 border-t border-black/5 pt-3 dark:border-white/10'>
      <label
        htmlFor={`auto-reply-${integrationId}`}
        className='text-foreground block text-xs font-medium'
      >
        Instructions for the AI
      </label>
      <textarea
        id={`auto-reply-${integrationId}`}
        value={value}
        maxLength={MAX}
        rows={3}
        onChange={(event) => setValue(event.target.value)}
        placeholder='e.g. Be warm and brief. Never offer discounts. Ask for the delivery address before confirming an order.'
        className='border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mt-1.5 w-full resize-y rounded-md border px-2.5 py-2 text-xs leading-relaxed focus-visible:ring-1 focus-visible:outline-none'
      />
      <div className='mt-1.5 flex items-start justify-between gap-3'>
        <p className='text-muted-foreground text-xs leading-snug'>
          Answers come from your{" "}
          <Link href='/chat/brain' className='text-foreground underline'>
            Brand Brain
          </Link>
          . If the answer isn&apos;t there, the AI hands the chat to your team
          instead of guessing.
        </p>
        <Button
          type='button'
          size='sm'
          variant='secondary'
          className='h-7 shrink-0 text-xs'
          disabled={!dirty || update.isPending}
          onClick={save}
        >
          {update.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
