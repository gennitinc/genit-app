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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIntegrations } from "@/hooks/use-integrations";
import { useToast } from "@/hooks/use-toast";
import type { IntegrationPlatform } from "@/lib/integrations-api";
import {
  createSocialPost,
  deleteSocialPost,
  listSocialPosts,
  type SocialPost,
  type SocialPostStatus,
  updateSocialPost,
} from "@/lib/social-posts-api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const PLATFORMS: IntegrationPlatform[] = [
  "facebook",
  "instagram",
  "threads",
  "linkedin",
  "x",
  "tiktok",
  "youtube",
  "pinterest",
];

const PLATFORM_LABELS: Partial<Record<IntegrationPlatform, string>> = {
  facebook: "Facebook",
  instagram: "Instagram",
  threads: "Threads",
  linkedin: "LinkedIn",
  x: "X",
  tiktok: "TikTok",
  youtube: "YouTube",
  pinterest: "Pinterest",
};

const EMPTY_FORM = {
  title: "",
  content: "",
  mediaUrl: "",
  platform: "instagram" as IntegrationPlatform,
  integrationId: "",
  status: "draft" as SocialPostStatus,
  scheduledFor: "",
};

function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function compact(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function errorMessage(error: any) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.message ||
    "Something went wrong"
  );
}

export function HomeCommandCenter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { integrations } = useIntegrations();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<SocialPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const postsQuery = useQuery({
    queryKey: ["social-posts"],
    queryFn: listSocialPosts,
  });
  const posts = postsQuery.data || [];
  const connected = useMemo(
    () =>
      integrations.filter(
        (item) => item.status === "active" && PLATFORMS.includes(item.platform)
      ),
    [integrations]
  );
  const drafts = posts.filter((post) => post.status === "draft");
  const scheduled = posts
    .filter((post) => post.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledFor || 0).getTime() -
        new Date(b.scheduledFor || 0).getTime()
    );
  const published = posts.filter((post) => post.status === "published");
  const recent = [...posts]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6);
  const totals = posts.reduce(
    (sum, post) => ({
      impressions: sum.impressions + (post.metrics?.impressions || 0),
      engagement:
        sum.engagement +
        (post.metrics?.likes || 0) +
        (post.metrics?.comments || 0) +
        (post.metrics?.shares || 0) +
        (post.metrics?.clicks || 0),
      views: sum.views + (post.metrics?.views || 0),
    }),
    { impressions: 0, engagement: 0, views: 0 }
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      const input = {
        title: form.title.trim() || undefined,
        content: form.content.trim(),
        mediaUrl: form.mediaUrl.trim() || undefined,
        platform: form.platform,
        integrationId: form.integrationId || undefined,
        status: form.status,
        scheduledFor:
          form.status === "scheduled" ? form.scheduledFor : undefined,
      };
      return editing
        ? updateSocialPost(editing._id, input)
        : createSocialPost(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      setEditorOpen(false);
      toast({ title: editing ? "Post updated" : "Post created" });
    },
    onError: (error) =>
      toast({
        title: "Could not save post",
        description: errorMessage(error),
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSocialPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      setDeleteTarget(null);
      toast({ title: "Post deleted" });
    },
    onError: (error) =>
      toast({
        title: "Could not delete post",
        description: errorMessage(error),
        variant: "destructive",
      }),
  });

  function openCreate() {
    const first = connected[0];
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      platform: first?.platform || "instagram",
      integrationId: first?._id || "",
    });
    setEditorOpen(true);
  }

  function openEdit(post: SocialPost) {
    setEditing(post);
    setForm({
      title: post.title || "",
      content: post.content,
      mediaUrl: post.mediaUrl || "",
      platform: post.platform,
      integrationId: post.integration || "",
      status: post.status,
      scheduledFor: post.scheduledFor?.slice(0, 16) || "",
    });
    setEditorOpen(true);
  }

  function setPlatform(platform: IntegrationPlatform) {
    setForm((current) => ({
      ...current,
      platform,
      integrationId:
        connected.find((item) => item.platform === platform)?._id || "",
    }));
  }

  const canSave =
    form.content.trim().length > 0 &&
    (form.status !== "scheduled" || Boolean(form.scheduledFor));

  if (postsQuery.isLoading) {
    return (
      <div className='flex min-h-64 items-center justify-center rounded-3xl bg-black/[0.015] ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/10'>
        <Loader2 className='h-6 w-6 animate-spin text-indigo-500' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 pb-14'>
      <section>
        <div className='mb-4 flex items-end justify-between gap-4'>
          <div>
          
            <h2 className='mt-1 text-xl font-bold tracking-tight'>Brand activity</h2>
          </div>
          <Button onClick={openCreate} className='rounded-full bg-indigo-600 text-white hover:bg-indigo-700'>
            <Plus className='mr-1.5 h-4 w-4' /> Create post
          </Button>
        </div>
        <div className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
          {[
            { label: "Drafts", value: drafts.length, icon: FileText, tint: "text-amber-600 bg-amber-500/10" },
            { label: "Scheduled", value: scheduled.length, icon: CalendarClock, tint: "text-sky-600 bg-sky-500/10" },
            { label: "Published", value: published.length, icon: CheckCircle2, tint: "text-emerald-600 bg-emerald-500/10" },
            { label: "Connected channels", value: connected.length, icon: Send, tint: "text-violet-600 bg-violet-500/10" },
          ].map(({ label, value, icon: Icon, tint }) => (
            <div key={label} className='rounded-2xl bg-black/[0.015] p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 dark:bg-white/[0.03] dark:ring-white/10'>
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", tint)}>
                <Icon className='h-4 w-4' />
              </div>
              <p className='mt-4 text-2xl font-bold tracking-tight'>{value}</p>
              <p className='mt-1 text-xs font-medium text-muted-foreground'>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)]'>
        <div className='overflow-hidden rounded-3xl bg-black/[0.015] shadow-sm ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/10'>
          <div className='flex items-center justify-between border-b border-black/5 p-5 dark:border-white/10'>
            <div>
              <h3 className='font-bold tracking-tight'>Content pipeline</h3>
              <p className='mt-1 text-xs text-muted-foreground'>Create, revise, schedule, and remove work from one place.</p>
            </div>
            <Button asChild variant='ghost' size='sm' className='rounded-full'>
              <Link href='/visuals/posts'>View all <ArrowRight className='ml-1.5 h-3.5 w-3.5' /></Link>
            </Button>
          </div>
          {recent.length ? (
            <div className='divide-y divide-black/5 dark:divide-white/10'>
              {recent.map((post) => (
                <article key={post._id} className='group flex items-center gap-3 p-4 transition hover:bg-black/[0.02] dark:hover:bg-white/[0.025]'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/5 ring-1 ring-black/5 dark:ring-white/10'>
                    {post.mediaUrl ? <img src={post.mediaUrl} alt='' className='h-full w-full object-cover' /> : <Sparkles className='h-4 w-4 text-indigo-500' />}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <h4 className='truncate text-sm font-semibold'>{post.title || post.content}</h4>
                      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize", post.status === "published" ? "bg-emerald-500/10 text-emerald-600" : post.status === "scheduled" ? "bg-sky-500/10 text-sky-600" : post.status === "failed" ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600")}>{post.status}</span>
                    </div>
                    <p className='mt-1 truncate text-xs text-muted-foreground'>
                      {PLATFORM_LABELS[post.platform] || post.platform} · {post.status === "scheduled" ? formatDate(post.scheduledFor) : `Updated ${formatDate(post.updatedAt)}`}
                    </p>
                  </div>
                  <button onClick={() => openEdit(post)} className='flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10' aria-label={`Edit ${post.title || "post"}`}><Edit3 className='h-3.5 w-3.5' /></button>
                  <button onClick={() => setDeleteTarget(post)} className='flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-rose-500/10 hover:text-rose-600' aria-label={`Delete ${post.title || "post"}`}><Trash2 className='h-3.5 w-3.5' /></button>
                </article>
              ))}
            </div>
          ) : (
            <div className='flex min-h-64 flex-col items-center justify-center px-6 text-center'>
              <FileText className='h-7 w-7 text-muted-foreground/60' />
              <h4 className='mt-3 font-semibold'>Your pipeline is ready</h4>
              <p className='mt-1 max-w-sm text-sm text-muted-foreground'>Start a draft, schedule it, and track it through publishing.</p>
              <Button onClick={openCreate} variant='outline' className='mt-4 rounded-full'><Plus className='mr-1.5 h-4 w-4' />New post</Button>
            </div>
          )}
        </div>

        <div className='rounded-3xl bg-slate-950 p-5 text-white shadow-sm ring-1 ring-white/10'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='font-bold tracking-tight'>Coming up</h3>
              <p className='mt-1 text-xs text-white/50'>Your next scheduled releases</p>
            </div>
            <Clock3 className='h-4 w-4 text-indigo-300' />
          </div>
          <div className='mt-5 space-y-3'>
            {scheduled.slice(0, 4).map((post, index) => (
              <button key={post._id} onClick={() => openEdit(post)} className='flex w-full items-start gap-3 rounded-2xl bg-white/[0.06] p-3 text-left ring-1 ring-white/10 transition hover:bg-white/[0.1]'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-bold text-indigo-200'>{index + 1}</div>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold'>{post.title || post.content}</p>
                  <p className='mt-1 text-[11px] text-white/55'>{formatDate(post.scheduledFor)} · {PLATFORM_LABELS[post.platform]}</p>
                </div>
              </button>
            ))}
            {!scheduled.length && (
              <div className='rounded-2xl border border-dashed border-white/15 p-6 text-center'>
                <CalendarClock className='mx-auto h-6 w-6 text-white/35' />
                <p className='mt-3 text-sm font-medium'>No posts scheduled</p>
                <button onClick={openCreate} className='mt-2 text-xs font-semibold text-indigo-300 hover:text-indigo-200'>Plan one now</button>
              </div>
            )}
          </div>
          <Button asChild variant='ghost' className='mt-4 w-full rounded-xl text-white/70 hover:bg-white/10 hover:text-white'>
            <Link href='/visuals/calendar'>Open calendar <ArrowRight className='ml-1.5 h-4 w-4' /></Link>
          </Button>
        </div>
      </section>

      <section className='grid gap-4 md:grid-cols-3'>
        {[
          { label: "Impressions", value: totals.impressions, icon: Eye, detail: "Across recorded posts" },
          { label: "Views", value: totals.views, icon: BarChart3, detail: "Total content views" },
          { label: "Engagements", value: totals.engagement, icon: MoreHorizontal, detail: "Likes, replies, shares & clicks" },
        ].map(({ label, value, icon: Icon, detail }) => (
          <div key={label} className='rounded-2xl bg-black/[0.015] p-5 shadow-sm ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-semibold text-muted-foreground'>{label}</p>
                <p className='mt-2 text-2xl font-bold tracking-tight'>{compact(value)}</p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'><Icon className='h-5 w-5' /></div>
            </div>
            <p className='mt-3 text-[11px] text-muted-foreground'>{detail}</p>
          </div>
        ))}
      </section>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit post" : "Create a post"}</DialogTitle>
            <DialogDescription>Save a draft, schedule it for later, or record it as published.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-1'>
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder='Post title (optional)' />
            <Textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder='What do you want to share?' rows={5} />
            <Input value={form.mediaUrl} onChange={(event) => setForm({ ...form, mediaUrl: event.target.value })} placeholder='Media URL (optional)' />
            <div className='grid gap-3 sm:grid-cols-2'>
              <Select value={form.platform} onValueChange={(value) => setPlatform(value as IntegrationPlatform)}>
                <SelectTrigger><SelectValue placeholder='Platform' /></SelectTrigger>
                <SelectContent>{PLATFORMS.map((platform) => <SelectItem key={platform} value={platform}>{PLATFORM_LABELS[platform]}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.integrationId || "none"} onValueChange={(value) => setForm({ ...form, integrationId: value === "none" ? "" : value })}>
                <SelectTrigger><SelectValue placeholder='Connected account' /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>No connected account</SelectItem>
                  {connected.filter((item) => item.platform === form.platform).map((item) => <SelectItem key={item._id} value={item._id}>{item.accountName || PLATFORM_LABELS[item.platform]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as SocialPostStatus })}>
                <SelectTrigger><SelectValue placeholder='Status' /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='draft'>Draft</SelectItem>
                  <SelectItem value='scheduled'>Scheduled</SelectItem>
                  <SelectItem value='published'>Published</SelectItem>
                  <SelectItem value='failed'>Failed</SelectItem>
                </SelectContent>
              </Select>
              {form.status === "scheduled" ? (
                <Input type='datetime-local' value={form.scheduledFor} onChange={(event) => setForm({ ...form, scheduledFor: event.target.value })} />
              ) : <div className='hidden sm:block' />}
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button disabled={!canSave || saveMutation.isPending} onClick={() => saveMutation.mutate()}>
              {saveMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {editing ? "Save changes" : "Create post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete this post?</DialogTitle>
            <DialogDescription>This removes it from the content workspace and cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant='destructive' disabled={deleteMutation.isPending} onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}>
              {deleteMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Delete post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
