"use client";

import {
  EMPTY_POST_FORM,
  POST_PLATFORMS,
  POST_PLATFORM_LABELS,
  PostEditorDialog,
  getProviderTargetMetadata,
} from "./post-editor-dialog";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIntegrations } from "@/hooks/use-integrations";
import { useToast } from "@/hooks/use-toast";
import { asEffectiveIntegration } from "@/lib/integrations-api";
import {
  type SocialPost,
  createSocialPosts,
  deleteSocialPost,
  generateSocialPostText,
  listSocialPosts,
  publishSocialPosts,
  updateSocialPosts,
} from "@/lib/social-posts-api";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarClock,
  CircleFadingArrowUp,
  Clock3,
  Edit3,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function errorMessage(error: any) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.msg ||
    error?.message ||
    "Something went wrong"
  );
}

export function HomeCommandCenter({
  createRequest = 0,
}: {
  createRequest?: number;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { integrations } = useIntegrations();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<SocialPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialPost | null>(null);
  const [form, setForm] = useState(EMPTY_POST_FORM);

  const postsQuery = useQuery({
    queryKey: ["social-posts"],
    queryFn: listSocialPosts,
  });
  const posts = postsQuery.data || [];
  const connected = useMemo(
    () =>
      integrations
        .filter((item) => item.status === "active")
        .map(asEffectiveIntegration)
        .filter((item) => POST_PLATFORMS.includes(item.platform)),
    [integrations]
  );
  const scheduled = posts
    .filter((post) => post.status === "scheduled")
    .sort(
      (a, b) =>
        new Date(a.scheduledFor || 0).getTime() -
        new Date(b.scheduledFor || 0).getTime()
    );
  const recent = [...posts]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const shared = {
        title: form.title.trim() || undefined,
        content: form.content.trim(),
        mediaUrl: form.mediaUrl.trim() || undefined,
        media: form.media,
        metadata: {
          youtubePlaylistId: form.youtubePlaylistId || undefined,
          youtubePlaylistTitle: form.youtubePlaylistTitle || undefined,
          youtubePlaylistDescription:
            form.youtubePlaylistDescription || undefined,
          youtubePlaylistPrivacyStatus: form.youtubePlaylistPrivacyStatus,
          youtubePrivacyStatus: form.youtubePrivacyStatus,
          youtubeMadeForKids: form.youtubeMadeForKids,
        },
        status: form.status === "published" ? "draft" : form.status,
        scheduledFor:
          form.status === "scheduled" ? form.scheduledFor : undefined,
      };
      if (editing) {
        const posts = await updateSocialPosts(editing._id, {
          ...shared,
          targets: form.platforms.map((platform) => ({
            platform,
            integrationId: form.integrationIds[platform] || undefined,
            metadata: getProviderTargetMetadata(form, platform),
          })),
        });
        return form.status === "published"
          ? publishSocialPosts(posts.map((post) => post._id))
          : posts;
      }
      const posts = await createSocialPosts({
        ...shared,
        targets: form.platforms.map((platform) => ({
          platform,
          integrationId: form.integrationIds[platform] || undefined,
          metadata: getProviderTargetMetadata(form, platform),
        })),
      });
      return form.status === "published"
        ? publishSocialPosts(posts.map((post) => post._id))
        : posts;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<SocialPost[]>(
        ["social-posts"],
        (current = []) => [
          ...saved,
          ...current.filter(
            (post) => !saved.some((item) => item._id === post._id)
          ),
        ]
      );
      setEditorOpen(false);
      setEditing(null);
      toast({
        title:
          form.status === "published"
            ? `${saved.length} post${saved.length === 1 ? "" : "s"} published`
            : editing
              ? "Post updated"
              : `${saved.length} post${saved.length === 1 ? "" : "s"} created`,
      });
    },
    onError: (error) =>
      toast({
        title: "Could not save post",
        description: errorMessage(error),
        variant: "destructive",
      }),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["social-posts"] }),
  });

  const textMutation = useMutation({
    mutationFn: generateSocialPostText,
    onSuccess: ({ text }, variables) => {
      setForm((current) => ({
        ...current,
        [variables.field === "title" ? "title" : "content"]: text,
      }));
      toast({ title: "AI enhancement added" });
    },
    onError: (error) =>
      toast({
        title: "Could not generate text",
        description: errorMessage(error),
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSocialPost,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["social-posts"] });
      const previous = queryClient.getQueryData<SocialPost[]>(["social-posts"]);
      queryClient.setQueryData<SocialPost[]>(["social-posts"], (current = []) =>
        current.filter((post) => post._id !== deletedId)
      );
      setDeleteTarget(null);
      return { previous };
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<SocialPost[]>(["social-posts"], (current = []) =>
        current.filter((post) => post._id !== deletedId)
      );
      setDeleteTarget(null);
      toast({ title: "Post deleted" });
    },
    onError: (error, _deletedId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["social-posts"], context.previous);
      }
      toast({
        title: "Could not delete post",
        description: errorMessage(error),
        variant: "destructive",
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["social-posts"] }),
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_POST_FORM, platforms: [], integrationIds: {} });
    setEditorOpen(true);
  }

  function openEdit(post: SocialPost) {
    setEditing(post);
    setForm({
      title: post.title || "",
      content: post.content,
      mediaUrl: post.mediaUrl || "",
      media:
        post.media && post.media.length
          ? post.media
          : post.mediaUrl
            ? [{ url: post.mediaUrl }]
            : [],
      mediaType: "",
      platforms: [post.platform],
      integrationIds: post.integration
        ? { [post.platform]: post.integration }
        : {},
      providerTargetIds: {
        [post.platform]:
          (typeof post.metadata?.providerTargetId === "string" &&
            post.metadata.providerTargetId) ||
          (typeof post.metadata?.linkedInAuthorUrn === "string" &&
            post.metadata.linkedInAuthorUrn) ||
          (typeof post.metadata?.pinterestBoardId === "string" &&
            post.metadata.pinterestBoardId) ||
          "",
      },
      tiktokPrivacyLevel:
        typeof post.metadata?.tiktokPrivacyLevel === "string"
          ? post.metadata.tiktokPrivacyLevel
          : "SELF_ONLY",
      status: post.status,
      scheduledFor: post.scheduledFor?.slice(0, 16) || "",
      youtubePlaylistId:
        typeof post.metadata?.youtubePlaylistId === "string"
          ? post.metadata.youtubePlaylistId
          : "",
      youtubePlaylistTitle:
        typeof post.metadata?.youtubePlaylistTitle === "string"
          ? post.metadata.youtubePlaylistTitle
          : "",
      youtubePlaylistDescription:
        typeof post.metadata?.youtubePlaylistDescription === "string"
          ? post.metadata.youtubePlaylistDescription
          : "",
      youtubePlaylistPrivacyStatus:
        post.metadata?.youtubePlaylistPrivacyStatus === "private" ||
        post.metadata?.youtubePlaylistPrivacyStatus === "unlisted" ||
        post.metadata?.youtubePlaylistPrivacyStatus === "public"
          ? post.metadata.youtubePlaylistPrivacyStatus
          : "public",
      youtubePrivacyStatus:
        post.metadata?.youtubePrivacyStatus === "private" ||
        post.metadata?.youtubePrivacyStatus === "unlisted" ||
        post.metadata?.youtubePrivacyStatus === "public"
          ? post.metadata.youtubePrivacyStatus
          : "public",
      youtubeMadeForKids:
        typeof post.metadata?.youtubeMadeForKids === "boolean"
          ? post.metadata.youtubeMadeForKids
          : false,
    });
    setEditorOpen(true);
  }

  useEffect(() => {
    if (!createRequest) return;
    setEditing(null);
    setForm({ ...EMPTY_POST_FORM, platforms: [], integrationIds: {} });
    setEditorOpen(true);
  }, [createRequest]);

  return (
    <div
      id='brand-activity'
      className='flex flex-col gap-6 border-none pt-4 pb-14'
    >
      <div className='h-fit'>
        {postsQuery.isLoading ? (
          <div className='flex h-[20px] items-center justify-center'>
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <LoadingFileLoader size={16} />
            </div>
          </div>
        ) : postsQuery.isError ? (
          <div className='flex h-[20px] items-center justify-center'>
            <div className='max-w-md p-5 text-center'>
              <p className='text-sm text-rose-700 dark:text-rose-300'>
                <LocalizedText text={"Could not load the content pipeline."} />
              </p>
              <p className='mt-1 text-xs text-rose-600/80 dark:text-rose-400/80'>
                {errorMessage(postsQuery.error)}
              </p>

              <button
                type='button'
                onClick={() => postsQuery.refetch()}
                className='mt-4 rounded-sm bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600'
              >
                <LocalizedText text={"Retry"} />
              </button>
            </div>
          </div>
        ) : (
          <section className='ml-2 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)]'>
            <div className='overflow-hidden rounded-lg bg-neutral-800 px-2 text-white shadow-sm ring-1 ring-white/10'>
              <div className='flex items-center justify-between gap-3 border-b border-white/10 p-2'>
                <div>
                  <h3 className='font-bold tracking-tight'>
                    <LocalizedText text={"Content pipeline"} />
                  </h3>
                </div>
                <div className='flex shrink-0 items-center gap-1.5'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={openCreate}
                    className='rounded-md border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
                  >
                    <Plus className='mr-1 h-3.5 w-3.5' />{" "}
                    <LocalizedText text={"New post"} />
                  </Button>
                  <Button
                    asChild
                    variant='ghost'
                    size='sm'
                    className='rounded-full text-white/70 hover:bg-white/10 hover:text-white'
                  >
                    <Link href='/visuals/posts'>
                      <LocalizedText text={"View all"} />
                      <ArrowRight className='ml-1.5 h-3.5 w-3.5' />
                    </Link>
                  </Button>
                </div>
              </div>
              {recent.length ? (
                <div className='mt-2 divide-y divide-white/10'>
                  {recent.map((post) => (
                    <article
                      key={post._id}
                      className='group flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]'
                    >
                      <div className='flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md ring-1 ring-white/10'>
                        {post.mediaUrl ? (
                          <img
                            src={post.mediaUrl}
                            alt=''
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <Sparkles className='h-4 w-4 text-indigo-300' />
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                          <h4 className='truncate text-sm font-semibold text-white'>
                            {post.title || post.content}
                          </h4>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize",
                              post.status === "published"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : post.status === "scheduled"
                                  ? "bg-sky-500/20 text-sky-300"
                                  : post.status === "failed"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : "bg-amber-500/20 text-amber-300"
                            )}
                          >
                            {post.status}
                          </span>
                        </div>
                        <p className='mt-1 truncate text-xs text-white/55'>
                          {POST_PLATFORM_LABELS[post.platform] || post.platform}{" "}
                          ·{" "}
                          {post.status === "scheduled"
                            ? formatDate(post.scheduledFor)
                            : `Updated ${formatDate(post.updatedAt)}`}
                        </p>
                      </div>
                      <button
                        onClick={() => openEdit(post)}
                        className='flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white'
                        aria-label={`Edit ${post.title || "post"}`}
                      >
                        <Edit3 className='h-3.5 w-3.5' />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className='flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-rose-500/20 hover:text-rose-400'
                        aria-label={`Delete ${post.title || "post"}`}
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className='flex min-h-64 flex-col items-center justify-center px-6 text-center text-white'>
                  <FileText className='h-7 w-7 text-white/40' />
                  <h4 className='mt-3 font-semibold text-white'>
                    <LocalizedText text={"Your pipeline is ready"} />
                  </h4>
                  <p className='mt-1 max-w-sm text-sm text-white/50'>
                    <LocalizedText
                      text={
                        "Start a draft, schedule it, and track it through publishing."
                      }
                    />
                  </p>
                  <Button
                    onClick={openCreate}
                    variant='outline'
                    className='mt-4 rounded-md border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
                  >
                    <Plus className='mr-1.5 h-4 w-4' />
                    <LocalizedText text={"New post"} />
                  </Button>
                </div>
              )}
            </div>

            <div className='h-fit rounded-lg bg-neutral-800 p-5 text-white shadow-sm ring-1 ring-white/10'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-bold tracking-tight'>
                    <LocalizedText text={"Coming up"} />
                  </h3>
                  <p className='mt-1 text-xs text-white/50'>
                    <LocalizedText text={"Your next scheduled releases"} />
                  </p>
                </div>
                <Clock3 className='h-4 w-4 text-indigo-300' />
              </div>
              <div className='mt-5 space-y-3'>
                {scheduled.slice(0, 4).map((post, index) => (
                  <button
                    key={post._id}
                    onClick={() => openEdit(post)}
                    className='flex w-full items-start gap-3 rounded-lg bg-white/[0.06] p-3 text-left ring-1 ring-white/10 transition hover:bg-white/[0.1]'
                  >
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-bold text-indigo-200'>
                      {index + 1}
                    </div>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-semibold'>
                        {post.title || post.content}
                      </p>
                      <p className='mt-1 text-[11px] text-white/55'>
                        {formatDate(post.scheduledFor)} ·{" "}
                        {POST_PLATFORM_LABELS[post.platform]}
                      </p>
                    </div>
                  </button>
                ))}
                {!scheduled.length && (
                  <div className='rounded-lg border border-dashed border-white/15 p-6 text-center'>
                    <CalendarClock className='mx-auto h-6 w-6 text-white/35' />
                    <p className='mt-3 text-sm font-medium'>
                      <LocalizedText text={"No posts scheduled"} />
                    </p>
                    <button
                      onClick={openCreate}
                      className='mt-2 text-xs font-semibold text-indigo-300 hover:text-indigo-200'
                    >
                      <LocalizedText text={"Plan one now"} />
                    </button>
                  </div>
                )}
              </div>
              <Button
                asChild
                variant='ghost'
                className='mt-4 w-full rounded-xl text-white/70 hover:bg-white/10 hover:text-white'
              >
                <Link href='/visuals/calendar'>
                  <LocalizedText text={"Open calendar"} />
                  <ArrowRight className='ml-1.5 h-4 w-4' />
                </Link>
              </Button>
            </div>
          </section>
        )}
      </div>
      <PostEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editing={Boolean(editing)}
        connected={connected}
        form={form}
        setForm={setForm}
        isSaving={saveMutation.isPending}
        isGeneratingText={textMutation.isPending}
        onEnhanceText={(field) =>
          textMutation.mutate({
            mode: "enhance",
            field,
            title: form.title,
            content: form.content,
            platforms: form.platforms,
            media: form.media,
          })
        }
        onSave={() => saveMutation.mutate()}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              <LocalizedText text={"Delete this post?"} />
            </DialogTitle>
            <DialogDescription>
              <LocalizedText
                text={
                  "This removes it from the content workspace and cannot be undone."
                }
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteTarget(null)}>
              <LocalizedText text={"Cancel"} />
            </Button>
            <Button
              variant='destructive'
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget._id)
              }
            >
              {deleteMutation.isPending && <LoadingFileLoader size={16} />}
              <LocalizedText text={"Delete post"} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
