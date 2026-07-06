"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New conversation</DialogTitle>
          <DialogDescription>
            Start a thread through one of your connected channels.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-2'>
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
                account?.platform === "gmail" || account?.platform === "outlook"
                  ? "name@example.com"
                  : account?.platform === "telegram"
                    ? "Telegram chat ID"
                    : account?.platform === "x"
                      ? "X user ID"
                      : "Provider recipient ID"
              }
            />
          </label>
          {account && ["gmail", "email", "outlook"].includes(account.platform) && (
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
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
