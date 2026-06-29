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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import type {
  IntegrationConnection,
  IntegrationPlatform,
} from "@/lib/integrations-api";
import {
  type YouTubePlaylistSummary,
  listYouTubePlaylists,
} from "@/lib/integrations-api";
import type { SocialPostMedia, SocialPostStatus } from "@/lib/social-posts-api";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  AlertCircle,
  CalendarClock,
  Check,
  CircleFadingArrowUp,
  FileText,
  Send,
  X,
} from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  mediaType: string;
  media: SocialPostMedia[];
  platforms: IntegrationPlatform[];
  integrationIds: Partial<Record<IntegrationPlatform, string>>;
  youtubePlaylistId: string;
  youtubePlaylistTitle: string;
  status: SocialPostStatus;
  scheduledFor: string;
};

export const EMPTY_POST_FORM: PostEditorForm = {
  title: "",
  content: "",
  mediaUrl: "",
  mediaType: "",
  media: [],
  platforms: [],
  integrationIds: {},
  youtubePlaylistId: "",
  youtubePlaylistTitle: "",
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
  isGeneratingText?: boolean;
  onSave: () => void;
  onEnhanceText?: (field: "title" | "content") => void;
};

type PlatformRule = {
  summary: string;
  contentMax?: number;
  titleRequired?: boolean;
  titleMax?: number;
  media: "optional" | "required" | "image" | "video";
  content: "optional" | "required" | "content-or-media";
};

const PLATFORM_RULES: Record<string, PlatformRule> = {
  facebook: {
    summary: "Caption, image, or video. At least one is required.",
    media: "optional",
    content: "content-or-media",
  },
  instagram: {
    summary:
      "Requires an image or video; the caption is optional (2,200 characters max).",
    contentMax: 2200,
    media: "required",
    content: "optional",
  },
  threads: {
    summary: "Caption, image, or video. Captions can be up to 500 characters.",
    contentMax: 500,
    media: "optional",
    content: "content-or-media",
  },
  linkedin: {
    summary: "Requires post text (3,000 characters max).",
    contentMax: 3000,
    media: "optional",
    content: "required",
  },
  x: {
    summary: "Requires post text (280 characters max).",
    contentMax: 280,
    media: "optional",
    content: "required",
  },
  tiktok: {
    summary: "Requires a video and a caption (2,200 characters max).",
    contentMax: 2200,
    media: "video",
    content: "required",
  },
  youtube: {
    summary:
      "Requires a video and a title (100 characters max); the description is optional.",
    titleRequired: true,
    titleMax: 100,
    media: "video",
    content: "optional",
  },
  pinterest: {
    summary: "Requires an image. Title is optional (100 characters max).",
    titleMax: 100,
    contentMax: 800,
    media: "image",
    content: "optional",
  },
};

function inferMediaKind(mediaType: string, mediaUrl: string) {
  if (mediaType.startsWith("image/")) return "image";
  if (mediaType.startsWith("video/")) return "video";
  const path = mediaUrl.split(/[?#]/)[0].toLowerCase();
  if (/\.(mp4|mov|webm|m4v)$/.test(path)) return "video";
  if (/\.(jpe?g|png|webp|gif|heic)$/.test(path)) return "image";
  return "unknown";
}

function getMediaKinds(form: PostEditorForm) {
  const media =
    form.media.length > 0
      ? form.media
      : form.mediaUrl
        ? [{ url: form.mediaUrl, mimeType: form.mediaType }]
        : [];
  return media.map((item) => inferMediaKind(item.mimeType || "", item.url));
}

export function getPostValidationErrors(form: PostEditorForm): string[] {
  if (!form.platforms.length) return ["Choose at least one destination."];
  const content = form.content.trim();
  const title = form.title.trim();
  const mediaKinds = getMediaKinds(form);
  const hasMedia = mediaKinds.length > 0;
  const hasImage = mediaKinds.includes("image");
  const hasVideo = mediaKinds.includes("video");
  const errors = new Set<string>();

  for (const platform of form.platforms) {
    const label = POST_PLATFORM_LABELS[platform] || platform;
    const rule = PLATFORM_RULES[platform];
    if (!rule) continue;
    if (rule.content === "required" && !content)
      errors.add(`${label} requires a caption.`);
    if (rule.content === "content-or-media" && !content && !hasMedia)
      errors.add(`${label} requires a caption or media.`);
    if (
      (rule.media === "required" ||
        rule.media === "image" ||
        rule.media === "video") &&
      !hasMedia
    )
      errors.add(
        `${label} requires ${rule.media === "required" ? "an image or video" : `a ${rule.media}`}.`
      );
    if (hasMedia && rule.media === "image" && !hasImage)
      errors.add(`${label} requires an image.`);
    if (hasMedia && rule.media === "video" && !hasVideo)
      errors.add(`${label} requires a video.`);
    if (rule.contentMax && content.length > rule.contentMax)
      errors.add(
        `${label} captions cannot exceed ${rule.contentMax.toLocaleString()} characters.`
      );
    if (rule.titleRequired && !title) errors.add(`${label} requires a title.`);
    if (rule.titleMax && title.length > rule.titleMax)
      errors.add(`${label} titles cannot exceed ${rule.titleMax} characters.`);
  }
  if (form.status === "scheduled" && !form.scheduledFor)
    errors.add("Choose a publish time for a scheduled post.");
  return [...errors];
}

export function PostEditorDialog({
  open,
  onOpenChange,
  editing,
  connected,
  form,
  setForm,
  isSaving,
  isGeneratingText = false,
  onSave,
  onEnhanceText,
}: PostEditorDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const validationErrors = getPostValidationErrors(form);
  const youtubeIntegrationId = form.integrationIds.youtube || "";
  const showYouTubePlaylist = form.platforms.includes("youtube");
  const [youtubePlaylists, setYoutubePlaylists] = useState<
    YouTubePlaylistSummary[]
  >([]);
  const [isCustomYoutubePlaylist, setIsCustomYoutubePlaylist] = useState(false);
  const [isLoadingYoutubePlaylists, setIsLoadingYoutubePlaylists] =
    useState(false);
  const selectedYouTubePlaylistValue = useMemo(() => {
    if (form.youtubePlaylistId) return form.youtubePlaylistId;
    if (isCustomYoutubePlaylist || form.youtubePlaylistTitle) return "custom";
    return "none";
  }, [
    form.youtubePlaylistId,
    form.youtubePlaylistTitle,
    isCustomYoutubePlaylist,
  ]);

  useEffect(() => {
    let cancelled = false;
    if (!showYouTubePlaylist || !youtubeIntegrationId) {
      setYoutubePlaylists([]);
      return;
    }
    setIsLoadingYoutubePlaylists(true);
    listYouTubePlaylists(youtubeIntegrationId, { maxResults: 50 })
      .then((result) => {
        if (!cancelled) setYoutubePlaylists(result.playlists);
      })
      .catch(() => {
        if (!cancelled) setYoutubePlaylists([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingYoutubePlaylists(false);
      });
    return () => {
      cancelled = true;
    };
  }, [showYouTubePlaylist, youtubeIntegrationId]);

  function togglePlatform(platform: IntegrationPlatform) {
    setForm((current) => ({
      ...current,
      platforms: current.platforms.includes(platform)
        ? current.platforms.filter((item) => item !== platform)
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

  const renderEnhanceButton = (field: "title" | "content") =>
    onEnhanceText ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type='button'
            size='icon'
            variant='ghost'
            aria-label='Enhance with AI'
            className='absolute top-1.5 right-1.5 h-7 w-7 rounded-md text-indigo-200 hover:bg-indigo-500/10 hover:text-white'
            disabled={isGeneratingText}
            onClick={() => onEnhanceText(field)}
          >
            {isGeneratingText ? (
              <LoadingFileLoader size={12} />
            ) : (
              <CircleFadingArrowUp className='h-3.5 w-3.5' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side='top'>Enhance with AI</TooltipContent>
      </Tooltip>
    ) : null;

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
                        isConnected
                          ? "font-medium text-emerald-400"
                          : "text-zinc-600"
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
                  <div
                    key={platform}
                    className='space-y-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5'
                  >
                    <Label className='flex items-center gap-2 text-xs font-medium text-zinc-200'>
                      <span className='flex h-5 w-5 items-center justify-center rounded bg-white/5 ring-1 ring-white/10'>
                        <PlatformIcon platform={platform} />
                      </span>
                      {POST_PLATFORM_LABELS[platform]} account
                    </Label>
                    <Select
                      value={form.integrationIds[platform] || "none"}
                      onValueChange={(value) => {
                        if (platform === "youtube")
                          setIsCustomYoutubePlaylist(false);
                        setForm((current) => ({
                          ...current,
                          integrationIds: {
                            ...current.integrationIds,
                            [platform]: value === "none" ? "" : value,
                          },
                          ...(platform === "youtube"
                            ? {
                                youtubePlaylistId: "",
                                youtubePlaylistTitle: "",
                              }
                            : {}),
                        }));
                      }}
                    >
                      <SelectTrigger className='h-9 w-full rounded-lg border-zinc-800 bg-zinc-950 text-zinc-200'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='border-zinc-800 bg-zinc-950 text-zinc-200'>
                        <SelectItem value='none'>
                          No connected account
                        </SelectItem>
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
        {showYouTubePlaylist && (
          <div className='grid gap-3 rounded-xl border border-red-500/15 bg-red-500/[0.04] p-3'>
            <div>
              <p className='text-[10px] font-semibold tracking-[0.16em] text-red-200/80 uppercase'>
                YouTube playlist
              </p>
              <p className='mt-1 text-[11px] leading-4 text-zinc-500'>
                Optional. Select an existing playlist or type a new one.
              </p>
            </div>
            <Select
              value={selectedYouTubePlaylistValue}
              disabled={!youtubeIntegrationId || isLoadingYoutubePlaylists}
              onValueChange={(value) => {
                if (value === "none") {
                  setIsCustomYoutubePlaylist(false);
                  setForm((current) => ({
                    ...current,
                    youtubePlaylistId: "",
                    youtubePlaylistTitle: "",
                  }));
                  return;
                }
                if (value === "custom") {
                  setIsCustomYoutubePlaylist(true);
                  setForm((current) => ({
                    ...current,
                    youtubePlaylistId: "",
                    youtubePlaylistTitle: current.youtubePlaylistTitle,
                  }));
                  return;
                }
                const playlist = youtubePlaylists.find(
                  (item) => item.id === value
                );
                setIsCustomYoutubePlaylist(false);
                setForm((current) => ({
                  ...current,
                  youtubePlaylistId: value,
                  youtubePlaylistTitle: playlist?.snippet?.title || "",
                }));
              }}
            >
              <SelectTrigger className='h-9 w-full rounded-lg border-zinc-800 bg-zinc-950 text-zinc-200'>
                <SelectValue
                  placeholder={
                    youtubeIntegrationId
                      ? "Choose playlist"
                      : "Select a YouTube account first"
                  }
                />
              </SelectTrigger>
              <SelectContent className='border-zinc-800 bg-zinc-950 text-zinc-200'>
                <SelectItem value='none'>No playlist</SelectItem>
                {youtubePlaylists.map((playlist) => (
                  <SelectItem key={playlist.id} value={playlist.id}>
                    {playlist.snippet?.title || playlist.id}
                  </SelectItem>
                ))}
                <SelectItem value='custom'>New playlist</SelectItem>
              </SelectContent>
            </Select>
            {selectedYouTubePlaylistValue === "custom" && (
              <Input
                value={form.youtubePlaylistTitle}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    youtubePlaylistId: "",
                    youtubePlaylistTitle: event.target.value,
                  }))
                }
                placeholder='Playlist name'
                className='h-9 border-white/10 bg-white/[0.02] text-white placeholder:text-zinc-600'
              />
            )}
          </div>
        )}
      </section>

      <section className='space-y-3'>
        <div className='grid gap-2'>
          <Label
            htmlFor='post-title'
            className='text-xs font-medium text-zinc-300'
          >
            {form.platforms.includes("youtube") ||
            form.platforms.includes("pinterest")
              ? "Post title"
              : "Internal title"}
          </Label>
          <div className='relative'>
            <Input
              id='post-title'
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder='Summer launch'
              className='border-white/10 bg-white/[0.02] pr-10 text-white placeholder:text-zinc-600 focus-visible:ring-white/20 focus-visible:ring-offset-0'
            />
            {renderEnhanceButton("title")}
          </div>
        </div>
        <div className='grid gap-2'>
          <Label
            htmlFor='post-content'
            className='text-xs font-medium text-zinc-300'
          >
            Caption
          </Label>
          <div className='relative'>
            <Textarea
              id='post-content'
              value={form.content}
              onChange={(event) =>
                setForm({ ...form, content: event.target.value })
              }
              rows={5}
              placeholder='Write your post…'
              className='resize-none border-white/10 bg-white/[0.02] pr-10 text-white placeholder:text-zinc-600 focus-visible:ring-white/20 focus-visible:ring-offset-0'
            />
            {renderEnhanceButton("content")}
          </div>
        </div>
        <div className='grid gap-2'>
          <div className='flex items-center justify-between gap-3'>
            <Label className='text-zinc-300'>Media</Label>
            <span className='text-[10px] text-zinc-500'>
              Images and videos only
            </span>
          </div>
          <MediaPicker
            accept='media'
            multiple
            value={form.mediaUrl}
            onChange={(mediaUrl) =>
              setForm((current) => ({ ...current, mediaUrl }))
            }
            values={form.media}
            onValuesChange={(media) =>
              setForm((current) => ({
                ...current,
                media,
                mediaUrl: media[0]?.url || "",
                mediaType: media[0]?.mimeType || "",
              }))
            }
            onMediaTypeChange={(mediaType) =>
              setForm((current) => ({ ...current, mediaType }))
            }
          />
        </div>
        {form.platforms.length > 0 && (
          <div className='space-y-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3'>
            {form.platforms.map((platform) => (
              <p
                key={platform}
                className='flex gap-2 text-[11px] leading-4 text-zinc-400'
              >
                <span className='font-semibold text-zinc-200'>
                  {POST_PLATFORM_LABELS[platform]}:
                </span>
                <span>{PLATFORM_RULES[platform]?.summary}</span>
              </p>
            ))}
            {validationErrors.length > 0 && (
              <div className='border-t border-white/[0.06] pt-2 text-[11px] text-amber-300'>
                {validationErrors.map((error) => (
                  <p key={error} className='flex gap-1.5'>
                    <AlertCircle className='mt-0.5 h-3 w-3 shrink-0' />
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
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
                <SelectItem value='published'>Publish</SelectItem>
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
        className='text-foreground rounded-md border-none bg-transparent transition-all duration-200'
        onClick={() => onOpenChange(false)}
      >
        Cancel
      </Button>
      <Button
        className='rounded-md bg-indigo-600 px-5 font-medium text-white transition-all duration-200 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:opacity-50'
        disabled={validationErrors.length > 0 || isSaving}
        onClick={onSave}
      >
        {isSaving ? (
          <LoadingFileLoader />
        ) : form.status === "scheduled" ? (
          <CalendarClock className='h-4 w-4' />
        ) : form.status === "published" ? (
          <Send className='h-4 w-4' />
        ) : (
          <FileText className='h-4 w-4' />
        )}
        {isSaving
          ? "Saving…"
          : form.status === "published"
            ? "Publish"
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
          className='flex max-h-[80vh] flex-col gap-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-0 text-white shadow-2xl sm:max-w-3xl'
          hideDialogClose
        >
          <DialogHeader className='relative border-b border-white/[0.05] px-5 pt-4 pb-3 text-left'>
            <div className='flex items-center gap-2.5'>
              <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 ring-1 ring-indigo-500/20'>
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
