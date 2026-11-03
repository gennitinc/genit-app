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
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCampaignOptions } from "@/hooks/use-campaigns";
import { useMediaQuery } from "@/hooks/use-media-query";
import type {
  IntegrationConnection,
  IntegrationPlatform,
} from "@/lib/integrations-api";
import {
  type YouTubePlaylistSummary,
  type YouTubePrivacy,
} from "@/lib/integrations-api";
import {
  POST_PLATFORMS,
  type SocialPostConnectionOptions,
  type SocialPostMedia,
  type SocialPostStatus,
  getSocialPostConnectionOptions,
} from "@/lib/social-posts-api";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  AlertCircle,
  CalendarClock,
  CircleFadingArrowUp,
  FileText,
  Send,
  X,
} from "lucide-react";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

export { POST_PLATFORMS } from "@/lib/social-posts-api";

export const POST_PLATFORM_LABELS: Partial<
  Record<IntegrationPlatform, string>
> = {
  facebook: "Facebook",
  instagram: "Instagram",
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
  providerTargetIds: Partial<Record<IntegrationPlatform, string>>;
  tiktokPrivacyLevel: string;
  youtubePlaylistId: string;
  youtubePlaylistTitle: string;
  youtubePlaylistDescription: string;
  youtubePlaylistPrivacyStatus: YouTubePrivacy;
  youtubePrivacyStatus: YouTubePrivacy;
  youtubeMadeForKids: boolean;
  status: SocialPostStatus;
  scheduledFor: string;
  /** GTM campaign this post belongs to; drives campaign attribution. */
  campaignId: string;
};

export const EMPTY_POST_FORM: PostEditorForm = {
  title: "",
  content: "",
  mediaUrl: "",
  mediaType: "",
  media: [],
  platforms: [],
  integrationIds: {},
  providerTargetIds: {},
  tiktokPrivacyLevel: "SELF_ONLY",
  youtubePlaylistId: "",
  youtubePlaylistTitle: "",
  youtubePlaylistDescription: "",
  youtubePlaylistPrivacyStatus: "public",
  youtubePrivacyStatus: "public",
  youtubeMadeForKids: false,
  status: "draft",
  scheduledFor: "",
  campaignId: "",
};

export function getProviderTargetMetadata(
  form: PostEditorForm,
  platform: IntegrationPlatform
) {
  const providerTargetId = form.providerTargetIds[platform];
  return {
    ...(providerTargetId ? { providerTargetId } : {}),
    ...(platform === "linkedin" && providerTargetId
      ? { linkedInAuthorUrn: providerTargetId }
      : {}),
    ...(platform === "pinterest" && providerTargetId
      ? { pinterestBoardId: providerTargetId }
      : {}),
    ...(platform === "tiktok"
      ? { tiktokPrivacyLevel: form.tiktokPrivacyLevel }
      : {}),
  };
}

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
  if (form.status === "scheduled") {
    const scheduledTime = new Date(form.scheduledFor).getTime();
    if (!form.scheduledFor || !Number.isFinite(scheduledTime))
      errors.add("Choose a publish time for a scheduled post.");
    else if (scheduledTime <= Date.now())
      errors.add("Choose a publish time in the future.");
  }
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
  const campaignOptions = useCampaignOptions(open);
  const connectedPlatforms = useMemo(
    () =>
      POST_PLATFORMS.filter((platform) =>
        connected.some((account) => account.platform === platform)
      ),
    [connected]
  );
  const accountValidationErrors = [
    ...getPostValidationErrors(form),
    ...form.platforms
      .filter(
        (platform) =>
          !connected.some(
            (account) =>
              account.platform === platform &&
              account._id === form.integrationIds[platform]
          )
      )
      .map(
        (platform) =>
          `Choose a connected ${POST_PLATFORM_LABELS[platform] || platform} account.`
      ),
  ];
  const youtubeIntegrationId = form.integrationIds.youtube || "";
  const showYouTubePlaylist = form.platforms.includes("youtube");
  const [youtubePlaylists, setYoutubePlaylists] = useState<
    YouTubePlaylistSummary[]
  >([]);
  const [connectionOptions, setConnectionOptions] = useState<
    Partial<Record<IntegrationPlatform, SocialPostConnectionOptions>>
  >({});
  const [connectionOptionErrors, setConnectionOptionErrors] = useState<
    Partial<Record<IntegrationPlatform, string>>
  >({});
  const [isCustomYoutubePlaylist, setIsCustomYoutubePlaylist] = useState(false);
  const [isLoadingYoutubePlaylists, setIsLoadingYoutubePlaylists] =
    useState(false);
  const validationErrors = [
    ...accountValidationErrors,
    ...form.platforms
      .filter((platform) => {
        const targets = connectionOptions[platform]?.targets || [];
        return (
          platform !== "youtube" &&
          targets.length > 0 &&
          !targets.some(
            (target) => target.id === form.providerTargetIds[platform]
          )
        );
      })
      .map(
        (platform) =>
          `Choose a ${POST_PLATFORM_LABELS[platform] || platform} destination.`
      ),
  ];
  const selectedYouTubePlaylistValue = useMemo(() => {
    if (form.youtubePlaylistId) return form.youtubePlaylistId;
    if (isCustomYoutubePlaylist || form.youtubePlaylistTitle) return "custom";
    return "none";
  }, [
    form.youtubePlaylistId,
    form.youtubePlaylistTitle,
    isCustomYoutubePlaylist,
  ]);

  const selectedConnectionsKey = form.platforms
    .map((platform) => `${platform}:${form.integrationIds[platform] || ""}`)
    .join("|");

  useEffect(() => {
    let cancelled = false;
    const selected = form.platforms
      .map((platform) => ({
        platform,
        integrationId: form.integrationIds[platform] || "",
      }))
      .filter((item) => item.integrationId);
    if (!selected.length) {
      setConnectionOptions({});
      setConnectionOptionErrors({});
      setYoutubePlaylists([]);
      return;
    }
    setIsLoadingYoutubePlaylists(
      selected.some((item) => item.platform === "youtube")
    );
    Promise.allSettled(
      selected.map(async ({ platform, integrationId }) => ({
        platform,
        options: await getSocialPostConnectionOptions(integrationId),
      }))
    )
      .then((results) => {
        if (cancelled) return;
        const fulfilled = results
          .filter(
            (
              result
            ): result is PromiseFulfilledResult<{
              platform: IntegrationPlatform;
              options: SocialPostConnectionOptions;
            }> => result.status === "fulfilled"
          )
          .map((result) => result.value);
        const options = Object.fromEntries(
          fulfilled.map((result) => [result.platform, result.options])
        ) as Partial<Record<IntegrationPlatform, SocialPostConnectionOptions>>;
        const errors: Partial<Record<IntegrationPlatform, string>> = {};
        results.forEach((result, index) => {
          if (result.status === "rejected")
            errors[selected[index].platform] =
              result.reason?.response?.data?.msg ||
              result.reason?.response?.data?.message ||
              result.reason?.message ||
              "Could not load account options.";
        });
        setConnectionOptions(options);
        setConnectionOptionErrors(errors);
        const youtube = options.youtube?.targets || [];
        setYoutubePlaylists(
          youtube.map((item) => ({
            id: item.id,
            snippet: { title: item.name, description: item.description },
          }))
        );
        setForm((current) => {
          const providerTargetIds = { ...current.providerTargetIds };
          let tiktokPrivacyLevel = current.tiktokPrivacyLevel;
          let changed = false;
          for (const result of fulfilled) {
            if (
              result.platform !== "youtube" &&
              result.options.targets.length &&
              !result.options.targets.some(
                (item) => item.id === providerTargetIds[result.platform]
              )
            ) {
              providerTargetIds[result.platform] = result.options.targets[0].id;
              changed = true;
            }
            if (
              result.platform === "tiktok" &&
              result.options.privacyLevels.length &&
              !result.options.privacyLevels.some(
                (item) => item.value === tiktokPrivacyLevel
              )
            ) {
              tiktokPrivacyLevel = result.options.privacyLevels[0].value;
              changed = true;
            }
          }
          return changed
            ? { ...current, providerTargetIds, tiktokPrivacyLevel }
            : current;
        });
      })
      .catch(() => {
        if (!cancelled) {
          setConnectionOptions({});
          setConnectionOptionErrors({});
          setYoutubePlaylists([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingYoutubePlaylists(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedConnectionsKey, setForm]);

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
    : "Choose where to post, then write it once.";

  // The strictest limit among the selected platforms is the one that matters.
  const limitFor = (key: "contentMax" | "titleMax") => {
    let limit: { max: number; platform: IntegrationPlatform } | undefined;
    for (const platform of form.platforms) {
      const max = PLATFORM_RULES[platform]?.[key];
      if (max && (!limit || max < limit.max)) limit = { max, platform };
    }
    return limit;
  };
  const contentLimit = limitFor("contentMax");
  const titleLimit = limitFor("titleMax");
  const titleIsPublic =
    form.platforms.includes("youtube") || form.platforms.includes("pinterest");

  const renderEnhanceButton = (field: "title" | "content") =>
    onEnhanceText ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type='button'
            size='icon'
            variant='ghost'
            aria-label='Enhance with AI'
            className='h-7 w-7 shrink-0 rounded-md text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-100'
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
        <TooltipContent side='top'>
          <LocalizedText text={"Enhance with AI"} />
        </TooltipContent>
      </Tooltip>
    ) : null;

  const counter = (
    length: number,
    limit?: { max: number; platform: IntegrationPlatform }
  ) =>
    limit ? (
      <span
        className={cn(
          "text-[11px] tabular-nums",
          length > limit.max ? "text-amber-300" : "text-zinc-600"
        )}
      >
        {length.toLocaleString()} / {limit.max.toLocaleString()}
        <span className='text-zinc-600'>
          {" "}
          · {POST_PLATFORM_LABELS[limit.platform]}
        </span>
      </span>
    ) : (
      <span className='text-[11px] text-zinc-600 tabular-nums'>
        {length.toLocaleString()}
      </span>
    );

  const destinations = (
    <div className='flex flex-wrap items-center gap-1.5'>
      {connectedPlatforms.length ? (
        connectedPlatforms.map((platform) => {
          const selected = form.platforms.includes(platform);
          return (
            <button
              key={platform}
              type='button'
              role='checkbox'
              aria-checked={selected}
              onClick={() => togglePlatform(platform)}
              className={cn(
                "flex h-8 items-center gap-2 rounded-md border px-2.5 text-[13px] transition-colors",
                selected
                  ? "border-white/25 bg-white/[0.08] text-white"
                  : "border-white/[0.07] text-zinc-500 hover:border-white/15 hover:text-zinc-300"
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center [&_svg]:h-4 [&_svg]:w-4",
                  !selected && "opacity-50 grayscale"
                )}
              >
                <PlatformIcon platform={platform} />
              </span>
              {POST_PLATFORM_LABELS[platform]}
            </button>
          );
        })
      ) : (
        <p className='text-[13px] text-zinc-500'>
          <LocalizedText
            text={"Connect a social account from Plugins to create a post."}
          />
        </p>
      )}
    </div>
  );

  const composer = (
    <div className='space-y-5'>
      <div className='rounded-lg border border-white/[0.08] bg-white/[0.015] focus-within:border-white/20'>
        <div className='flex items-center gap-2 border-b border-white/[0.06] pr-2'>
          <Input
            id='post-title'
            aria-label={titleIsPublic ? "Title" : "Internal title"}
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder={
              titleIsPublic ? "Title" : "Title — only visible in Genit"
            }
            className='h-11 rounded-none border-0 bg-transparent px-3.5 text-[15px] font-medium text-white shadow-none placeholder:font-normal placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          {titleLimit && counter(form.title.length, titleLimit)}
          {renderEnhanceButton("title")}
        </div>
        <Textarea
          id='post-content'
          aria-label='Caption'
          value={form.content}
          onChange={(event) =>
            setForm((current) => ({ ...current, content: event.target.value }))
          }
          placeholder='Write your post…'
          className='min-h-[220px] resize-none rounded-none border-0 bg-transparent px-3.5 py-3 text-[14px] leading-6 text-zinc-100 shadow-none placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <div className='flex items-center justify-between gap-2 px-3.5 pb-2'>
          {counter(form.content.length, contentLimit)}
          {renderEnhanceButton("content")}
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex items-baseline justify-between gap-3'>
          <Label className='text-[13px] font-medium text-zinc-300'>
            <LocalizedText text={"Media"} />
          </Label>
          <span className='text-[11px] text-zinc-600'>
            <LocalizedText text={"Images and videos"} />
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
    </div>
  );

  const timing = (
    <section className='space-y-2.5'>
      <h3 className='text-[13px] font-medium text-zinc-200'>
        <LocalizedText text={"When"} />
      </h3>
      <div
        role='radiogroup'
        aria-label='Post status'
        className='grid grid-cols-3 rounded-md border border-white/[0.08] p-0.5'
      >
        {(
          [
            ["draft", "Draft"],
            ["scheduled", "Schedule"],
            ["published", "Now"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type='button'
            role='radio'
            aria-checked={form.status === value}
            onClick={() =>
              setForm((current) => ({ ...current, status: value }))
            }
            className={cn(
              "h-7 rounded-[5px] text-[12px] transition-colors",
              form.status === value
                ? "bg-white/[0.1] text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <LocalizedText text={label} />
          </button>
        ))}
      </div>
      {form.status === "scheduled" && (
        <Input
          id='scheduled-for'
          aria-label='Publish time'
          type='datetime-local'
          min={new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
            .toISOString()
            .slice(0, 16)}
          value={form.scheduledFor}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              scheduledFor: event.target.value,
            }))
          }
          className={cn(FIELD, "[color-scheme:dark]")}
        />
      )}
    </section>
  );

  const youtubeSettings = (
    <>
      <Field label='Playlist'>
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
                youtubePlaylistDescription: "",
                youtubePlaylistPrivacyStatus: "public",
              }));
              return;
            }
            if (value === "custom") {
              setIsCustomYoutubePlaylist(true);
              setForm((current) => ({
                ...current,
                youtubePlaylistId: "",
                youtubePlaylistTitle: current.youtubePlaylistTitle,
                youtubePlaylistPrivacyStatus:
                  current.youtubePlaylistPrivacyStatus || "public",
              }));
              return;
            }
            const playlist = youtubePlaylists.find((item) => item.id === value);
            setIsCustomYoutubePlaylist(false);
            setForm((current) => ({
              ...current,
              youtubePlaylistId: value,
              youtubePlaylistTitle: playlist?.snippet?.title || "",
              youtubePlaylistDescription: playlist?.snippet?.description || "",
              youtubePlaylistPrivacyStatus:
                playlist?.status?.privacyStatus || "public",
            }));
          }}
        >
          <SelectTrigger className={FIELD}>
            <SelectValue
              placeholder={
                youtubeIntegrationId
                  ? "Choose playlist"
                  : "Select a YouTube account first"
              }
            />
          </SelectTrigger>
          <SelectContent className={MENU}>
            <SelectItem value='none'>
              <LocalizedText text={"No playlist"} />
            </SelectItem>
            {youtubePlaylists.map((playlist) => (
              <SelectItem key={playlist.id} value={playlist.id}>
                {playlist.snippet?.title || playlist.id}
              </SelectItem>
            ))}
            <SelectItem value='custom'>
              <LocalizedText text={"New playlist…"} />
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {selectedYouTubePlaylistValue === "custom" && (
        <div className='space-y-2 border-l border-white/[0.08] pl-3'>
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
            className={FIELD}
          />
          <Textarea
            value={form.youtubePlaylistDescription}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                youtubePlaylistDescription: event.target.value,
              }))
            }
            rows={2}
            placeholder='Playlist description'
            className='min-h-0 resize-none rounded-md border-white/10 bg-white/[0.03] text-[13px] text-zinc-200 placeholder:text-zinc-600'
          />
          <PrivacySelect
            label='Playlist visibility'
            value={form.youtubePlaylistPrivacyStatus}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                youtubePlaylistPrivacyStatus: value,
              }))
            }
          />
        </div>
      )}
      <PrivacySelect
        label='Video visibility'
        value={form.youtubePrivacyStatus}
        onChange={(value) =>
          setForm((current) => ({ ...current, youtubePrivacyStatus: value }))
        }
      />
      <label className='flex cursor-pointer items-center justify-between gap-3 py-0.5'>
        <span className='text-[12px] text-zinc-400'>
          <LocalizedText text={"Made for kids"} />
        </span>
        <Switch
          checked={form.youtubeMadeForKids}
          onCheckedChange={(checked) =>
            setForm((current) => ({ ...current, youtubeMadeForKids: checked }))
          }
          aria-label='Made for kids'
        />
      </label>
    </>
  );

  const platformSettings = form.platforms.map((platform) => {
    const accounts = connected.filter((item) => item.platform === platform);
    const options = connectionOptions[platform];
    const targetLabel =
      platform === "facebook"
        ? "Page"
        : platform === "instagram"
          ? "Instagram account"
          : platform === "linkedin"
            ? "Publish as"
            : platform === "pinterest"
              ? "Board"
              : "Destination";
    return (
      <section
        key={platform}
        className='space-y-2.5 border-t border-white/[0.06] pt-4'
      >
        <div>
          <h3 className='flex items-center gap-2 text-[13px] font-medium text-zinc-200 [&_svg]:h-3.5 [&_svg]:w-3.5'>
            <PlatformIcon platform={platform} />
            {POST_PLATFORM_LABELS[platform]}
          </h3>
          {PLATFORM_RULES[platform]?.summary && (
            <p className='mt-1 text-[11px] leading-4 text-zinc-600'>
              {PLATFORM_RULES[platform].summary}
            </p>
          )}
        </div>
        {accounts.length > 1 || !form.integrationIds[platform] ? (
          <Field label='Account'>
            <Select
              value={form.integrationIds[platform] || undefined}
              onValueChange={(value) => {
                if (platform === "youtube") setIsCustomYoutubePlaylist(false);
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
                        youtubePlaylistDescription: "",
                        youtubePlaylistPrivacyStatus: "public" as const,
                      }
                    : {}),
                }));
              }}
            >
              <SelectTrigger className={FIELD}>
                <SelectValue placeholder='Select account' />
              </SelectTrigger>
              <SelectContent className={MENU}>
                {accounts.map((account) => (
                  <SelectItem key={account._id} value={account._id}>
                    {account.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : (
          <p className='truncate text-[12px] text-zinc-400'>
            {accounts[0]?.accountName}
          </p>
        )}
        {platform !== "youtube" && options?.targets.length ? (
          <Field label={targetLabel}>
            <Select
              value={form.providerTargetIds[platform] || undefined}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  providerTargetIds: {
                    ...current.providerTargetIds,
                    [platform]: value,
                  },
                }))
              }
            >
              <SelectTrigger className={FIELD}>
                <SelectValue
                  placeholder={`Select ${targetLabel.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent className={MENU}>
                {options.targets.map((target) => (
                  <SelectItem key={target.id} value={target.id}>
                    {target.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        {platform === "tiktok" && options?.privacyLevels.length ? (
          <Field label='Who can view'>
            <Select
              value={form.tiktokPrivacyLevel}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  tiktokPrivacyLevel: value,
                }))
              }
            >
              <SelectTrigger className={FIELD}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={MENU}>
                {options.privacyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        {platform === "youtube" && youtubeSettings}
        {connectionOptionErrors[platform] ? (
          <p className='text-[11px] leading-4 text-amber-300'>
            {connectionOptionErrors[platform]}
          </p>
        ) : null}
      </section>
    );
  });

  const campaigns = campaignOptions.data || [];
  const campaignField = (
    <section className='space-y-2.5'>
      <h3 className='text-[13px] font-medium text-zinc-200'>
        <LocalizedText text={"Campaign"} />
      </h3>
      <Select
        value={form.campaignId || "none"}
        onValueChange={(value) =>
          setForm((current) => ({
            ...current,
            campaignId: value === "none" ? "" : value,
          }))
        }
        disabled={campaignOptions.isLoading}
      >
        <SelectTrigger className={FIELD} aria-label='Campaign'>
          <SelectValue
            placeholder={
              campaignOptions.isLoading ? "Loading campaigns…" : "No campaign"
            }
          />
        </SelectTrigger>
        <SelectContent className={MENU}>
          <SelectItem value='none'>
            <LocalizedText text={"No campaign"} />
          </SelectItem>
          {form.campaignId &&
            !campaigns.some((item) => item._id === form.campaignId) && (
              <SelectItem value={form.campaignId}>Linked campaign</SelectItem>
            )}
          {campaigns.map((campaign) => (
            <SelectItem key={campaign._id} value={campaign._id}>
              {campaign.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className='text-[11px] leading-4 text-zinc-500'>
        <LocalizedText
          text={"Linked posts count toward the campaign's reach and ROI."}
        />
      </p>
    </section>
  );

  const formContent = (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_272px]'>
      <div className='min-w-0'>{composer}</div>
      <aside className='space-y-4 lg:border-l lg:border-white/[0.06] lg:pl-6'>
        {timing}
        {campaignField}
        {platformSettings}
      </aside>
    </div>
  );

  const issues =
    validationErrors.length > 0 ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <p className='flex min-w-0 cursor-default items-center gap-1.5 text-[12px] text-amber-300/90'>
            <AlertCircle className='h-3.5 w-3.5 shrink-0' />
            <span className='truncate'>{validationErrors[0]}</span>
            {validationErrors.length > 1 && (
              <span className='shrink-0 text-zinc-500'>
                +{validationErrors.length - 1}
              </span>
            )}
          </p>
        </TooltipTrigger>
        {validationErrors.length > 1 && (
          <TooltipContent side='top' align='start' className='max-w-xs'>
            <ul className='space-y-1'>
              {validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </TooltipContent>
        )}
      </Tooltip>
    ) : (
      <span />
    );

  const actions = (
    <>
      <Button
        variant='ghost'
        className='h-9 rounded-md px-3 text-zinc-400 hover:bg-white/[0.06] hover:text-white'
        onClick={() => onOpenChange(false)}
      >
        <LocalizedText text={"Cancel"} />
      </Button>
      <Button
        className='h-9 rounded-md bg-white px-4 font-medium text-zinc-950 hover:bg-zinc-200 disabled:bg-white/10 disabled:text-zinc-500 disabled:opacity-100'
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
            : form.status === "scheduled"
              ? editing
                ? "Reschedule"
                : "Schedule"
              : editing
                ? "Save draft"
                : form.platforms.length > 1
                  ? `Save ${form.platforms.length} drafts`
                  : "Save draft"}
      </Button>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className='flex max-h-[86vh] flex-col gap-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c0e] p-0 text-white shadow-2xl sm:max-w-4xl'
          hideDialogClose
        >
          <DialogHeader className='space-y-3 border-b border-white/[0.06] px-6 pt-5 pb-4 text-left'>
            <div className='flex items-center justify-between gap-4'>
              <DialogTitle className='text-[15px] font-semibold text-white'>
                {editing ? "Edit post" : "New post"}
              </DialogTitle>
              <DialogDescription className='sr-only'>
                {description}
              </DialogDescription>
              <button
                type='button'
                onClick={() => onOpenChange(false)}
                className='-mr-1.5 rounded-md p-1.5 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white'
                aria-label='Close post composer'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
            {destinations}
          </DialogHeader>
          <div className='min-h-0 flex-1 overflow-y-auto px-6 py-5'>
            {formContent}
          </div>
          <div className='flex items-center justify-between gap-4 border-t border-white/[0.06] px-6 py-3'>
            <div className='min-w-0 flex-1'>{issues}</div>
            <div className='flex shrink-0 items-center gap-2'>{actions}</div>
          </div>
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
      <DrawerContent className='h-[94dvh] max-h-[94dvh] overflow-hidden rounded-t-2xl border-t border-white/[0.08] bg-[#0c0c0e] p-0 text-white shadow-2xl'>
        <DrawerHeader className='space-y-3 border-b border-white/[0.06] px-4 pt-2 pb-4 text-left'>
          <DrawerTitle className='text-[15px] font-semibold text-white'>
            {editing ? "Edit post" : "New post"}
          </DrawerTitle>
          <DrawerDescription className='sr-only'>{description}</DrawerDescription>
          {destinations}
        </DrawerHeader>
        <div className='min-h-0 flex-1 overflow-y-auto px-4 py-5'>
          {formContent}
        </div>
        <DrawerFooter className='gap-2 border-t border-white/[0.06] px-4 py-3'>
          {validationErrors.length > 0 && issues}
          <div className='grid grid-cols-2 gap-2'>{actions}</div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const FIELD =
  "h-9 w-full rounded-md border-white/10 bg-white/[0.03] text-[13px] text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0";
const MENU = "border-zinc-800 bg-zinc-950 text-zinc-200";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='grid gap-1.5'>
      <Label className='text-[11px] font-normal text-zinc-500'>
        <LocalizedText text={label} />
      </Label>
      {children}
    </div>
  );
}

function PrivacySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YouTubePrivacy;
  onChange: (value: YouTubePrivacy) => void;
}) {
  return (
    <Field label={label}>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as YouTubePrivacy)}
      >
        <SelectTrigger className={FIELD}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={MENU}>
          <SelectItem value='public'>
            <LocalizedText text={"Public"} />
          </SelectItem>
          <SelectItem value='unlisted'>
            <LocalizedText text={"Unlisted"} />
          </SelectItem>
          <SelectItem value='private'>
            <LocalizedText text={"Private"} />
          </SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}
