"use client";

import {
  FacebookBrand,
  InstagramBrand,
  LinkedinBrand,
  PinterestBrand,
  TikTokBrand,
  XBrand,
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import type {
  IntegrationConnection,
  IntegrationPlatform,
} from "@/lib/integrations-api";
import type { SocialPostStatus } from "@/lib/social-posts-api";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { CalendarClock, Check, FileText, Loader2, Send, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export const POST_PLATFORMS: IntegrationPlatform[] = [
  "facebook",
  "instagram",
  "threads",
  "linkedin",
  "x",
  "tiktok",
  "youtube",
  "pinterest",
];

export const POST_PLATFORM_LABELS: Partial<
  Record<IntegrationPlatform, string>
> = {
  facebook: "Facebook",
  instagram: "Instagram",
  threads: "Threads",
  linkedin: "LinkedIn",
  x: "X",
  tiktok: "TikTok",
  youtube: "YouTube",
  pinterest: "Pinterest",
};

export type PostEditorForm = {
  title: string;
  content: string;
  mediaUrl: string;
  platforms: IntegrationPlatform[];
  integrationIds: Partial<Record<IntegrationPlatform, string>>;
  status: SocialPostStatus;
  scheduledFor: string;
};

export const EMPTY_POST_FORM: PostEditorForm = {
  title: "",
  content: "",
  mediaUrl: "",
  platforms: [],
  integrationIds: {},
  status: "draft",
  scheduledFor: "",
};

function PlatformIcon({ platform }: { platform: IntegrationPlatform }) {
  const props = { className: "h-5 w-5" };
  if (platform === "facebook") return <FacebookBrand {...props} />;
  if (platform === "instagram") return <InstagramBrand {...props} />;
  if (platform === "linkedin") return <LinkedinBrand {...props} />;
  if (platform === "x") return <XBrand {...props} />;
  if (platform === "tiktok") return <TikTokBrand {...props} />;
  if (platform === "youtube") return <YoutubeBrand {...props} />;
  if (platform === "pinterest") return <PinterestBrand {...props} />;
  return <span className='font-semibold'>@</span>;
}

type PostEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: boolean;
  connected: IntegrationConnection[];
  form: PostEditorForm;
  setForm: Dispatch<SetStateAction<PostEditorForm>>;
  isSaving: boolean;
  onSave: () => void;
};

export function PostEditorDialog({
  open,
  onOpenChange,
  editing,
  connected,
  form,
  setForm,
  isSaving,
  onSave,
}: PostEditorDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  function togglePlatform(platform: IntegrationPlatform) {
    setForm((current) => ({
      ...current,
      platforms: current.platforms.includes(platform)
        ? current.platforms.filter((item) => item !== platform)
        : editing
          ? [platform]
          : [...current.platforms, platform],
      integrationIds: current.platforms.includes(platform)
        ? current.integrationIds
        : {
            ...current.integrationIds,
            [platform]:
              connected.find((item) => item.platform === platform)?._id || "",
          },
    }));
  }

  const description = editing
    ? "Update this post and its destination."
    : "Check every platform you want to post to, then compose once.";

  const formContent = (
    <div className='grid gap-4 lg:grid-cols-[0.9fr_1.1fr]'>
      <section className='space-y-4 lg:border-r lg:border-white/[0.05] lg:pr-4'>
        <div className='grid gap-2'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h3 className='text-sm font-semibold text-white'>Destinations</h3>
              <p className='mt-1 text-xs text-zinc-500'>
                Choose where this post should appear.
              </p>
            </div>
            <span className='rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-zinc-300 ring-1 ring-white/10'>
              {form.platforms.length} 
            </span>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            {POST_PLATFORMS.map((platform) => {
              const selected = form.platforms.includes(platform);
              const isConnected = connected.some(
                (item) => item.platform === platform
              );
              return (
                <button
                  key={platform}
                  type='button'
                  role='checkbox'
                  aria-checked={selected}
                  onClick={() => togglePlatform(platform)}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-medium transition-all duration-200",
                    selected
                      ? "border-indigo-500/40 bg-indigo-500/[0.06] text-white"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/70"
                  )}
                >
                  <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 ring-1 ring-zinc-800'>
                    <PlatformIcon platform={platform} />
                  </span>
                  <span className='min-w-0'>
                    <span className='block truncate'>
                      {POST_PLATFORM_LABELS[platform]}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block text-[9px]",
                        isConnected ? "text-emerald-400 font-medium" : "text-zinc-600"
                      )}
                    >
                      {isConnected ? "Connected" : "No account"}
                    </span>
                  </span>
                  {selected && (
                    <span className='absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-white'>
                      <Check className='h-2 w-2 stroke-[3]' />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {form.platforms.length > 0 && (
          <div className='hidden gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 lg:grid'>
            <p className='text-[10px] font-semibold tracking-[0.16em] text-zinc-400 uppercase'>
              Connected accounts
            </p>
            <div className='space-y-2'>
              {form.platforms.map((platform) => {
                const accounts = connected.filter(
                  (item) => item.platform === platform
                );
                return (
                  <div key={platform} className='rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5 space-y-1.5'>
                    <Label className='flex items-center gap-2 text-xs text-zinc-200 font-medium'>
                      <span className='flex h-5 w-5 items-center justify-center rounded bg-white/5 ring-1 ring-white/10'>
                        <PlatformIcon platform={platform} />
                      </span>
                      {POST_PLATFORM_LABELS[platform]} account
                    </Label>
                    <Select
                      value={form.integrationIds[platform] || "none"}
                      onValueChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          integrationIds: {
                            ...current.integrationIds,
                            [platform]: value === "none" ? "" : value,
                          },
                        }))
                      }
                    >
                      <SelectTrigger className='w-full border-zinc-800 bg-zinc-950 text-zinc-200 h-9 rounded-lg'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='border-zinc-800 bg-zinc-950 text-zinc-200'>
                        <SelectItem value='none'>No connected account</SelectItem>
                        {accounts.map((account) => (
                          <SelectItem key={account._id} value={account._id}>
                            {account.accountName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className='space-y-3'>
        <div className='grid gap-2'>
          <Label
            htmlFor='post-title'
            className='text-xs font-medium text-zinc-300'
          >
            Internal title
          </Label>
          <Input
            id='post-title'
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            placeholder='Summer launch'
            className='border-white/10 bg-white/[0.02] text-white placeholder:text-zinc-600 focus-visible:ring-white/20 focus-visible:ring-offset-0'
          />
        </div>
        <div className='grid gap-2'>
          <Label
            htmlFor='post-content'
            className='text-xs font-medium text-zinc-300'
          >
            Caption
          </Label>
          <Textarea
            id='post-content'
            value={form.content}
            onChange={(event) =>
              setForm({ ...form, content: event.target.value })
            }
            rows={5}
            placeholder='Write your post…'
            className='resize-none border-white/10 bg-white/[0.02] text-white placeholder:text-zinc-600 focus-visible:ring-white/20 focus-visible:ring-offset-0'
          />
        </div>
        <div className='grid gap-2'>
          <Label className='text-zinc-300'>Media</Label>
          <MediaPicker
            accept='media'
            value={form.mediaUrl}
            onChange={(mediaUrl) =>
              setForm((current) => ({ ...current, mediaUrl }))
            }
          />
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='grid gap-2'>
            <Label className='text-zinc-300'>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm({ ...form, status: value as SocialPostStatus })
              }
            >
              <SelectTrigger className='w-full border-white/10 bg-white/[0.02] text-zinc-200'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='scheduled'>Scheduled</SelectItem>
                <SelectItem value='published'>Mark as published</SelectItem>
                <SelectItem value='failed'>Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.status === "scheduled" && (
            <div className='grid gap-2'>
              <Label htmlFor='scheduled-for' className='text-zinc-300'>
                Publish time
              </Label>
              <Input
                id='scheduled-for'
                type='datetime-local'
                value={form.scheduledFor}
                onChange={(event) =>
                  setForm({ ...form, scheduledFor: event.target.value })
                }
                className='border-white/10 bg-white/[0.02] text-white'
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const actions = (
    <>
      <Button
        variant='outline'
        className='rounded-md border-none bg-transparent text-foreground transition-all duration-200'
        onClick={() => onOpenChange(false)}
      >
        Cancel
      </Button>
      <Button
        className='rounded-md bg-indigo-600 px-5 text-white font-medium hover:bg-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500'
        disabled={
          !form.platforms.length ||
          !form.content.trim() ||
          (form.status === "scheduled" && !form.scheduledFor) ||
          isSaving
        }
        onClick={onSave}
      >
        {isSaving ? (
          <LoadingFileLoader />
        ) : form.status === "scheduled" ? (
          <CalendarClock className='h-4 w-4' />
        ) : (
          <FileText className='h-4 w-4' />
        )}
        {isSaving
          ? "Saving…"
          : editing
            ? "Save post"
            : `Create ${form.platforms.length || ""} post${form.platforms.length === 1 ? "" : "s"}`}
      </Button>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className='flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-0 text-white shadow-2xl sm:max-w-3xl'
          hideDialogClose
        >
          <DialogHeader className='relative px-5 pt-4 pb-3 text-left border-b border-white/[0.05]'>
            <div className='flex items-center gap-2.5'>
              <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/20'>
                <Send className='h-4 w-4' />
              </span>
              <div>
                <DialogTitle className='text-sm font-semibold text-white'>
                  {editing ? "Edit post" : "Create post"}
                </DialogTitle>
                <DialogDescription className='text-[11px] text-zinc-500'>
                  {description}
                </DialogDescription>
              </div>
            </div>
            <button
              type='button'
              onClick={() => onOpenChange(false)}
              className='absolute top-3 right-3 rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-900 hover:text-white'
              aria-label='Close post composer'
            >
              <X className='h-5 w-5' />
            </button>
          </DialogHeader>
          <div className='min-h-0 flex-1 overflow-y-auto px-5 py-4'>
            {formContent}
          </div>
          <DialogFooter className='border-t border-white/[0.05] bg-[#0c0c0e]/95 px-5 py-3'>
            {actions}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
    >
      <DrawerContent className='h-[94dvh] max-h-[94dvh] overflow-hidden rounded-t-[2rem] border-t border-white/[0.08] bg-[#0c0c0e] p-0 text-white shadow-2xl'>
        <DrawerHeader className='border-b border-white/[0.05] p-2 text-left'>
          <DrawerTitle className='text-lg text-white'>
            {editing ? "Edit post" : "Create post"}
          </DrawerTitle>
          <DrawerDescription className='text-xs text-zinc-500'>
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <div className='min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6'>
          {formContent}
        </div>
        <DrawerFooter className='grid grid-cols-2 border-t border-white/[0.05] bg-[#0c0c0e]/95 px-4 py-4 sm:px-6'>
          {actions}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
