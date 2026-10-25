"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateConversationInput } from "@/lib/inbox-api";
import type { IntegrationConnection } from "@/lib/integrations-api";
import { useEffect, useState } from "react";

const channelPlatform = (account?: IntegrationConnection) =>
  String(
    account?.platform === "composio"
      ? account.metadata?.nativePlatform || account.metadata?.toolkitSlug
      : account?.platform || ""
  ).toLowerCase();

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
  onCreate: (input: CreateConversationInput, message: string) => void;
}) {
  const [integrationId, setIntegrationId] = useState("");
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const account = accounts.find((item) => item._id === integrationId);
  const platform = channelPlatform(account);

  useEffect(() => {
    if (open && !integrationId) setIntegrationId(accounts[0]?._id || "");
  }, [accounts, integrationId, open]);

  useEffect(() => {
    if (open) return;
    setIntegrationId("");
    setName("");
    setRecipient("");
    setSubject("");
    setMessage("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='new-conversation-title'
      aria-describedby='new-conversation-description'
      className='bg-background animate-in slide-in-from-top-4 absolute inset-0 z-20 flex min-h-0 flex-col duration-200'
    >
      <div className='shrink-0 border-b px-5 py-4 text-left'>
        <h2 id='new-conversation-title' className='font-semibold'>
          <LocalizedText text={"New message"} />
        </h2>
        <p
          id='new-conversation-description'
          className='text-muted-foreground mt-1 text-sm'
        >
          <LocalizedText
            text={"Compose a message through one of your connected channels."}
          />
        </p>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto px-5 py-6'>
        <div className='mx-auto w-full max-w-2xl space-y-4'>
          <label className='block text-sm font-medium'>
            <LocalizedText text={"Channel"} />
            <select
              className='bg-background mt-2 h-10 w-full rounded-md border px-3'
              value={integrationId}
              onChange={(event) => setIntegrationId(event.target.value)}
            >
              {accounts.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.accountName || channelPlatform(item)} ·{" "}
                  {channelPlatform(item)}
                </option>
              ))}
            </select>
          </label>
          <label className='block text-sm font-medium'>
            <LocalizedText text={"Contact name"} />
            <Input
              className='mt-2'
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='Jane Doe'
            />
          </label>
          <label className='block text-sm font-medium'>
            <LocalizedText text={"Recipient"} />
            <Input
              className='mt-2'
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder={
                ["gmail", "email", "outlook"].includes(platform)
                  ? "name@example.com"
                  : platform === "instagram"
                    ? "Instagram-scoped recipient ID"
                    : platform === "messenger"
                      ? "Page-scoped recipient ID"
                      : platform === "telegram"
                        ? "Telegram chat ID"
                        : platform === "whatsapp"
                          ? "WhatsApp number, e.g. 2348012345678"
                          : platform === "x"
                            ? "X user ID"
                            : "Provider recipient ID"
              }
            />
          </label>
          {account && ["gmail", "email", "outlook"].includes(platform) && (
            <label className='block text-sm font-medium'>
              <LocalizedText text={"Subject (optional)"} />
              <Input
                className='mt-2'
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </label>
          )}
          {platform === "whatsapp" ? (
            <p className='text-muted-foreground rounded-md border px-3 py-2 text-sm'>
              <LocalizedText
                text={
                  "WhatsApp requires an approved template to start a new conversation. You will choose one next."
                }
              />
            </p>
          ) : (
            <label className='block text-sm font-medium'>
              <LocalizedText text={"Message"} />
              <textarea
                className='bg-background focus-visible:ring-ring mt-2 min-h-32 w-full resize-y rounded-md border px-3 py-2 outline-none focus-visible:ring-2'
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder='Write your message…'
              />
            </label>
          )}
        </div>
      </div>
      <div className='flex shrink-0 flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end'>
        <Button variant='outline' onClick={() => onOpenChange(false)}>
          <LocalizedText text={"Cancel"} />
        </Button>
        <Button
          disabled={
            pending ||
            !account ||
            !name.trim() ||
            !recipient.trim() ||
            (platform !== "whatsapp" && !message.trim())
          }
          onClick={() =>
            account &&
            onCreate(
              {
                integrationId: account._id,
                platform: platform as CreateConversationInput["platform"],
                customerName: name.trim(),
                customerId: recipient.trim(),
                customerHandle: recipient.trim(),
                subject: subject.trim() || undefined,
              },
              message.trim()
            )
          }
        >
          <LocalizedText
            text={
              pending
                ? "Sending…"
                : platform === "whatsapp"
                  ? "Choose template"
                  : "Send message"
            }
          />
        </Button>
      </div>
    </div>
  );
}
