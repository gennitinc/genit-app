"use client";

import { pipelineKeys } from "./pipeline-utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIntegrations } from "@/hooks/use-integrations";
import { campaignError } from "@/lib/campaign-utils";
import { createPipelineLead } from "@/lib/pipeline-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type FormEvent, useState } from "react";

const EMPTY = { name: "", email: "", phone: "", dealValue: "", notes: "", startFollowUp: false };

export function AddLeadDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (id: string) => void;
}) {
  const { orgId } = useIntegrations();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const create = useMutation({
    mutationFn: () =>
      createPipelineLead({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        dealValue: form.dealValue.trim() ? Number(form.dealValue) : undefined,
        notes: form.notes.trim() || undefined,
        startFollowUp: form.startFollowUp,
      }),
    onSuccess: ({ lead, created }) => {
      void queryClient.invalidateQueries({ queryKey: pipelineKeys.all(orgId) });
      toast.success(created ? "Lead added" : "This contact was already in your pipeline");
      setForm(EMPTY);
      onOpenChange(false);
      onCreated(lead._id);
    },
    onError: (error) => toast.error(campaignError(error, "Could not add lead")),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.email.trim() && !form.phone.trim()) {
      toast.error("Add an email address or phone number");
      return;
    }
    create.mutate();
  }

  const field = (key: keyof typeof EMPTY) => ({
    value: form[key] as string,
    onChange: (event: { target: { value: string } }) => setForm((current) => ({ ...current, [key]: event.target.value })),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <form onSubmit={submit} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>Add lead</DialogTitle>
            <DialogDescription>For enquiries that came in by phone, in person or anywhere Genit isn’t connected.</DialogDescription>
          </DialogHeader>
          <div className='space-y-1'>
            <Label htmlFor='lead-name'>Name</Label>
            <Input id='lead-name' required {...field("name")} />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <Label htmlFor='lead-email'>Email</Label>
              <Input id='lead-email' type='email' {...field("email")} />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='lead-phone'>Phone</Label>
              <Input id='lead-phone' type='tel' {...field("phone")} />
            </div>
          </div>
          <div className='space-y-1'>
            <Label htmlFor='lead-value'>Deal value (optional)</Label>
            <Input id='lead-value' inputMode='decimal' {...field("dealValue")} />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='lead-notes-new'>What do they want?</Label>
            <Textarea id='lead-notes-new' rows={3} {...field("notes")} />
          </div>
          <label className='flex items-start gap-2 text-sm'>
            <Checkbox
              checked={form.startFollowUp}
              onCheckedChange={(checked) => setForm((current) => ({ ...current, startFollowUp: checked === true }))}
              className='mt-0.5'
            />
            <span>
              Email them now and follow up automatically
              <span className='text-muted-foreground block text-xs'>Uses your connected Gmail or Brevo sender.</span>
            </span>
          </label>
          <DialogFooter>
            <Button type='button' variant='ghost' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={create.isPending || !form.name.trim()}>
              {create.isPending ? "Adding…" : "Add lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
