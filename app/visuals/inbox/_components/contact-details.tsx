"use client";

import { LocalizedText } from "@/components/localized-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  InboxConversation,
  UpdateConversationInput,
} from "@/lib/inbox-api";
import { Check, Pencil, Tag } from "lucide-react";
import { useEffect, useState } from "react";

export function ContactDetails({
  conversation,
  saving,
  onSave,
  onCancel,
}: {
  conversation: InboxConversation;
  saving: boolean;
  onSave: (input: UpdateConversationInput) => void;
  onCancel?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(conversation.customerName);
  const [subject, setSubject] = useState(conversation.subject || "");
  const [notes, setNotes] = useState(conversation.notes || "");
  const [labels, setLabels] = useState((conversation.labels || []).join(", "));

  useEffect(() => {
    setEditing(false);
    setName(conversation.customerName);
    setSubject(conversation.subject || "");
    setNotes(conversation.notes || "");
    setLabels((conversation.labels || []).join(", "));
  }, [conversation._id, conversation.updatedAt]);

  const save = () =>
    onSave({
      customerName: name,
      subject,
      notes,
      labels: labels
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean),
    });

  return (
    <div className='bg-background flex h-full min-h-0 flex-col overflow-y-auto'>
      <div className='flex h-fit shrink-0 items-center gap-2 border-b px-4 py-2.5'>
        <h3 className='font-semibold'>
          <LocalizedText text={"Contact details"} />
        </h3>
        <Button
          variant='outline'
          size='icon'
          className='rounded-lg'
          onClick={() => (editing ? save() : setEditing(true))}
          disabled={saving}
          aria-label={editing ? "Save contact details" : "Edit contact details"}
        >
          {editing ? (
            <Check className='h-4 w-4' />
          ) : (
            <Pencil className='h-4 w-4' />
          )}
        </Button>
        {onCancel && (
          <Button
            variant='ghost'
            className='ml-auto rounded-xl'
            onClick={onCancel}
          >
            <LocalizedText text={"Cancel"} />
          </Button>
        )}
      </div>
      <div className='space-y-6 p-4 text-sm'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-12 w-12'>
            {conversation.customerAvatar && (
              <AvatarImage
                src={conversation.customerAvatar}
                alt={conversation.customerName}
                className='object-cover'
              />
            )}
            <AvatarFallback className='bg-indigo-500/10 font-semibold text-indigo-600'>
              {conversation.customerName.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1'>
            {editing ? (
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            ) : (
              <p className='truncate font-semibold'>{name}</p>
            )}
            <p className='text-muted-foreground mt-1 truncate text-xs capitalize'>
              {conversation.platform}
            </p>
          </div>
        </div>

        <Detail
          label='Contact'
          editing={editing}
          value={conversation.customerHandle || conversation.customerId || ""}
          placeholder='Email, username, or phone'
          disabled
          hint={`Managed by ${conversation.platform}`}
        />
        <Detail
          label='Subject'
          editing={editing}
          value={subject}
          onChange={setSubject}
          placeholder='Conversation subject'
        />

        <section className='border-t pt-5'>
          <div className='mb-2 flex items-center gap-2 font-medium'>
            <Tag className='h-4 w-4' /> <LocalizedText text={"Labels"} />
          </div>
          {editing ? (
            <Input
              value={labels}
              onChange={(event) => setLabels(event.target.value)}
              placeholder='Lead, VIP, Support'
            />
          ) : conversation.labels?.length ? (
            <div className='flex flex-wrap gap-1.5'>
              {conversation.labels.map((label) => (
                <span
                  key={label}
                  className='rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-600'
                >
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground text-xs'>
              <LocalizedText text={"No labels yet"} />
            </p>
          )}
        </section>

        <section className='border-t pt-5'>
          <p className='mb-2 font-medium'>
            <LocalizedText text={"Notes"} />
          </p>
          {editing ? (
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className='min-h-28 w-full resize-y rounded-lg border bg-transparent p-3 outline-none focus:border-indigo-500'
              placeholder='Add private notes about this contact'
            />
          ) : (
            <p className='text-muted-foreground text-xs leading-5 whitespace-pre-wrap'>
              {notes || "No notes yet"}
            </p>
          )}
        </section>

        <section className='border-t pt-5 text-xs'>
          <p className='mb-3 font-medium'>
            <LocalizedText text={"Conversation"} />
          </p>
          <div className='text-muted-foreground grid grid-cols-[90px_1fr] gap-2'>
            <span>
              <LocalizedText text={"Status"} />
            </span>
            <span className='capitalize'>{conversation.status}</span>
            <span>
              <LocalizedText text={"Started"} />
            </span>
            <span>{new Date(conversation.createdAt).toLocaleDateString()}</span>
            <span>
              <LocalizedText text={"Updated"} />
            </span>
            <span>{new Date(conversation.updatedAt).toLocaleString()}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function Detail({
  label,
  editing,
  value,
  onChange,
  placeholder,
  disabled = false,
  hint,
}: {
  label: string;
  editing: boolean;
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <p className='mb-2 font-medium'>{label}</p>
      {editing ? (
        <Input
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <p className='text-muted-foreground text-xs break-words'>
          {value || "Not provided"}
        </p>
      )}
      {editing && disabled && hint && (
        <p className='text-muted-foreground mt-1.5 text-xs capitalize'>
          {hint}
        </p>
      )}
    </div>
  );
}
