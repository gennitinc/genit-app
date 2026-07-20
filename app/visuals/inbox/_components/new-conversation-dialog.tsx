"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import type { CreateConversationInput } from "@/lib/inbox-api";
import type { IntegrationConnection } from "@/lib/integrations-api";
import { useEffect, useState } from "react";

export function NewConversationDialog({
  open,
  onOpenChange,
  accounts,
  pending,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: IntegrationConnection[];
  pending: boolean;
  onCreate: (input: CreateConversationInput) => void;
}) {
  const [integrationId, setIntegrationId] = useState("");
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const account = accounts.find((item) => item._id === integrationId);

  useEffect(() => {
    if (open && !integrationId) setIntegrationId(accounts[0]?._id || "");
  }, [accounts, integrationId, open]);

  useEffect(() => {
    if (open) return;
    setIntegrationId("");
    setName("");
    setRecipient("");
    setSubject("");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='top'
        className='h-dvh w-full gap-0 p-0 data-[state=closed]:duration-150 data-[state=open]:duration-200 [&>button]:hidden'
      >
        <div className='flex h-full min-h-0 flex-col'>
          <SheetHeader className='shrink-0 border-b px-5 py-4 text-left'>
            <SheetTitle>New conversation</SheetTitle>
            <SheetDescription>
              Start a thread through one of your connected channels.
            </SheetDescription>
          </SheetHeader>
          <div className='min-h-0 flex-1 overflow-y-auto px-5 py-6'>
            <div className='mx-auto w-full max-w-2xl space-y-4'>
              <label className='block text-sm font-medium'>
                Channel
                <select
                  className='bg-background mt-2 h-10 w-full rounded-md border px-3'
                  value={integrationId}
                  onChange={(event) => setIntegrationId(event.target.value)}
                >
                  {accounts.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.accountName || item.platform} · {item.platform}
                    </option>
                  ))}
                </select>
              </label>
              <label className='block text-sm font-medium'>
                Contact name
                <Input
                  className='mt-2'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder='Jane Doe'
                />
              </label>
              <label className='block text-sm font-medium'>
                Recipient
                <Input
                  className='mt-2'
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  placeholder={
                    account?.platform === "gmail" ||
                    account?.platform === "outlook"
                      ? "name@example.com"
                      : account?.platform === "telegram"
                        ? "Telegram chat ID"
                        : account?.platform === "whatsapp"
                          ? "WhatsApp number, e.g. 2348012345678"
                          : account?.platform === "x"
                            ? "X user ID"
                            : "Provider recipient ID"
                  }
                />
              </label>
              {account &&
                ["gmail", "email", "outlook"].includes(account.platform) && (
                  <label className='block text-sm font-medium'>
                    Subject (optional)
                    <Input
                      className='mt-2'
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                    />
                  </label>
                )}
            </div>
          </div>
          <SheetFooter className='shrink-0 gap-2 border-t px-5 py-4 sm:space-x-0'>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              disabled={pending || !account || !name.trim() || !recipient.trim()}
              onClick={() =>
                account &&
                onCreate({
                  integrationId: account._id,
                  platform:
                    account.platform as CreateConversationInput["platform"],
                  customerName: name.trim(),
                  customerId: recipient.trim(),
                  customerHandle: recipient.trim(),
                  subject: subject.trim() || undefined,
                })
              }
            >
              Create conversation
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
