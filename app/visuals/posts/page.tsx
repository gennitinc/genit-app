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
import { useIntegrations } from "@/hooks/use-integrations";
import { useToast } from "@/hooks/use-toast";
import {
  fetchFacebookInsights,
  fetchInstagramInsights,
  fetchPinterestPinAnalytics,
  fetchThreadsInsights,
  fetchTikTokVideoMetrics,
  fetchTweetMetrics,
  fetchYouTubeAnalytics,
  type IntegrationConnection,
  type IntegrationPlatform,
  type FacebookPostSummary,
  listFacebookPosts,
  listInstagramPosts,
  listPinterestPins,
  listThreadsPosts,
  listTikTokVideos,
  listUserTweets,
  listYouTubeVideos,
} from "@/lib/integrations-api";
import {
  createSocialPosts,
  deleteSocialPost,
  listSocialPosts,
  type SocialPost,
  type SocialPostMetrics,
  type SocialPostStatus,
  updateSocialPost,
} from "@/lib/social-posts-api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  CalendarClock,
  Check,
  Clock3,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Heart,
  Loader2,
  MessageCircle,
  MousePointerClick,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share2,
  Trash2,
  type LucideIcon,
} from "lucide-react";
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
const LABEL: Partial<Record<IntegrationPlatform, string>> = {
  facebook: "Facebook",
  instagram: "Instagram",
  threads: "Threads",
  linkedin: "LinkedIn",
  x: "X",
  tiktok: "TikTok",
  youtube: "YouTube",
  pinterest: "Pinterest",
};
const TINT: Partial<Record<IntegrationPlatform, string>> = {
  facebook: "from-blue-500/20 to-blue-500/[0.03]",
  instagram: "from-fuchsia-500/20 to-orange-400/[0.04]",
  threads: "from-zinc-500/20 to-zinc-500/[0.03]",
  linkedin: "from-sky-500/20 to-sky-500/[0.03]",
  x: "from-zinc-500/20 to-zinc-500/[0.03]",
  tiktok: "from-cyan-400/20 to-pink-500/[0.05]",
  youtube: "from-red-500/20 to-red-500/[0.03]",
  pinterest: "from-rose-500/20 to-rose-500/[0.03]",
};
const EMPTY_METRICS: SocialPostMetrics = {
  impressions: 0,
  views: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  clicks: 0,
};
const EMPTY_FORM = {
  title: "",
  content: "",
  mediaUrl: "",
  platforms: [] as IntegrationPlatform[],
  integrationIds: {} as Partial<Record<IntegrationPlatform, string>>,
  status: "draft" as SocialPostStatus,
  scheduledFor: "",
};

type DisplayPost = SocialPost & {
  remote?: boolean;
  mediaType?: string;
  thumbnailUrl?: string;
};
type View = "live" | "scheduled" | "drafts";

function PlatformIcon({
  platform,
  className,
}: {
  platform: IntegrationPlatform;
  className?: string;
}) {
  const props = { className: cn("h-5 w-5", className) };
  if (platform === "facebook") return <FacebookBrand {...props} />;
  if (platform === "instagram") return <InstagramBrand {...props} />;
  if (platform === "linkedin") return <LinkedinBrand {...props} />;
  if (platform === "x") return <XBrand {...props} />;
  if (platform === "tiktok") return <TikTokBrand {...props} />;
  if (platform === "youtube") return <YoutubeBrand {...props} />;
  if (platform === "pinterest") return <PinterestBrand {...props} />;
  return <span className={cn("font-semibold", className)}>@</span>;
}

function compact(value = 0) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function postDate(post: DisplayPost) {
  const value = post.publishedAt || post.scheduledFor || post.createdAt;
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isVideoMedia(url?: string) {
  if (!url) return false;
  return /\.(mp4|mov|m4v|webm|ogg)(?:$|\?)/i.test(url) ||
    /\/video(?:\/|_|-)/i.test(url);
}

function facebookMedia(post: FacebookPostSummary) {
  const attachment = post.attachments?.data?.[0];
  const child = attachment?.subattachments?.data?.[0];
  const item = child || attachment;
  const mediaType = item?.media_type || attachment?.media_type;
  const thumbnailUrl =
    post.full_picture || item?.media?.image?.src || attachment?.media?.image?.src;
  const videoUrl =
    mediaType?.toLowerCase().includes("video")
      ? item?.media?.source || attachment?.media?.source
      : undefined;
  return {
    mediaType: videoUrl ? mediaType : "image",
    mediaUrl: videoUrl || thumbnailUrl,
    thumbnailUrl,
  };
}

function MediaPreview({ post }: { post: DisplayPost }) {
  const [failed, setFailed] = useState(false);
  const source = post.thumbnailUrl || post.mediaUrl;
  const isVideo =
    post.mediaType?.toLowerCase().includes("video") ||
    isVideoMedia(post.mediaUrl);

  if (!source || failed) {
    return (
      <div className='flex aspect-[4/3] w-full items-center justify-center'>
        <PlatformIcon platform={post.platform} className='h-10 w-10 opacity-60' />
      </div>
    );
  }
  if (isVideo && post.mediaUrl) {
    return (
      <video
        src={post.mediaUrl}
        poster={post.thumbnailUrl}
        controls
        muted
        playsInline
        preload='metadata'
        onError={() => setFailed(true)}
        className='block h-auto w-full bg-black object-contain'
      />
    );
  }
  return (
    <img
      src={source}
      alt={post.title || `${LABEL[post.platform]} post`}
      loading='lazy'
      onError={() => setFailed(true)}
      className='block h-auto w-full object-contain transition duration-500 group-hover:scale-[1.01]'
    />
  );
}

function metricValue(source: unknown, names: string[]): number {
  if (!source || typeof source !== "object") return 0;
  for (const [key, value] of Object.entries(source)) {
    if (names.includes(key.toLowerCase())) {
      const parsed = Number(
        typeof value === "object" && value && "value" in value
          ? (value as { value: unknown }).value
          : value
      );
      if (Number.isFinite(parsed)) return parsed;
    }
    const nested = metricValue(value, names);
    if (nested) return nested;
  }
  return 0;
}

function namedMetricValue(source: unknown, names: string[]): number {
  if (!source || typeof source !== "object") return 0;
  if (!Array.isArray(source)) {
    const item = source as Record<string, unknown>;
    const metricName = String(item.name || item.metric || "").toLowerCase();
    if (names.includes(metricName)) {
      const values = Array.isArray(item.values) ? item.values : [item];
      return values.reduce((total, entry) => {
        if (!entry || typeof entry !== "object") return total;
        const value = (entry as Record<string, unknown>).value;
        if (value && typeof value === "object") {
          return total + Object.values(value).reduce<number>(
            (sum, part) => sum + (Number(part) || 0),
            0
          );
        }
        return total + (Number(value) || 0);
      }, 0);
    }
  }
  for (const value of Object.values(source)) {
    const found = namedMetricValue(value, names);
    if (found) return found;
  }
  return 0;
}

function tabularMetricValue(source: unknown, names: string[]): number {
  if (!source || typeof source !== "object") return 0;
  const table = source as {
    columnHeaders?: Array<{ name?: string }>;
    rows?: unknown[][];
  };
  if (table.columnHeaders && table.rows) {
    const index = table.columnHeaders.findIndex((header) =>
      names.includes(String(header.name || "").toLowerCase())
    );
    if (index >= 0)
      return table.rows.reduce(
        (total, row) => total + (Number(row[index]) || 0),
        0
      );
  }
  return 0;
}

function analyticsValue(raw: unknown, names: string[]) {
  return (
    metricValue(raw, names) ||
    namedMetricValue(raw, names) ||
    tabularMetricValue(raw, names)
  );
}

function normalizeAnalytics(raw: unknown, fallback: SocialPostMetrics) {
  return {
    impressions:
      analyticsValue(raw, ["impressions", "impression_count", "impressioncount", "post_impressions", "reach"]) ||
      fallback.impressions,
    views:
      analyticsValue(raw, ["views", "view_count", "viewcount", "video_views"]) ||
      fallback.views,
    likes:
      analyticsValue(raw, ["likes", "like_count", "likecount", "reactions"]) || fallback.likes,
    comments:
      analyticsValue(raw, ["comments", "comment_count", "commentcount", "replies"]) ||
      fallback.comments,
    shares:
      analyticsValue(raw, ["shares", "share_count", "sharecount", "retweet_count", "reposts", "quotes"]) ||
      fallback.shares,
    clicks:
      analyticsValue(raw, ["clicks", "click_count", "clickcount", "post_clicks", "pin_click", "pin_clicks"]) ||
      fallback.clicks,
  };
}

async function fetchLivePosts(
  connections: IntegrationConnection[]
): Promise<DisplayPost[]> {
  const results = await Promise.allSettled(
    connections.map(async (connection): Promise<DisplayPost[]> => {
      const base = {
        integration: connection._id,
        accountName: connection.accountName,
        platform: connection.platform,
        source: "integration" as const,
        status: "published" as const,
        updatedAt: new Date().toISOString(),
        remote: true,
      };
      if (connection.platform === "facebook")
        return (await listFacebookPosts(connection._id, 50)).map((post) => ({
          ...base,
          ...facebookMedia(post),
          _id: `remote:facebook:${post.id}`,
          externalId: post.id,
          content: post.message || "Facebook post",
          permalink: post.permalink_url,
          createdAt: post.created_time || base.updatedAt,
          metrics: {
            ...EMPTY_METRICS,
            impressions: analyticsValue(post.insights, ["post_impressions"]),
            likes: post.reactions?.summary?.total_count || 0,
            comments: post.comments?.summary?.total_count || 0,
            shares: post.shares?.count || 0,
            clicks: analyticsValue(post.insights, ["post_clicks"]),
          },
        }));
      if (connection.platform === "instagram")
        return (await listInstagramPosts(connection._id, 50)).map((post) => ({
          ...base,
          _id: `remote:instagram:${post.id}`,
          externalId: post.id,
          content: post.caption || "Instagram post",
          mediaType: post.media_type,
          mediaUrl: post.media_url,
          thumbnailUrl: post.thumbnail_url || post.media_url,
          permalink: post.permalink,
          createdAt: post.timestamp || base.updatedAt,
          metrics: {
            ...EMPTY_METRICS,
            likes: post.like_count || 0,
            comments: post.comments_count || 0,
          },
        }));
      if (connection.platform === "threads")
        return (await listThreadsPosts(connection._id, 50)).map((post) => ({
          ...base,
          _id: `remote:threads:${post.id}`,
          externalId: post.id,
          content: post.text || "Threads post",
          mediaType: post.media_type,
          mediaUrl: post.media_url,
          thumbnailUrl: post.media_type === "IMAGE" ? post.media_url : undefined,
          permalink: post.permalink,
          createdAt: post.timestamp || base.updatedAt,
          metrics: EMPTY_METRICS,
        }));
      if (connection.platform === "x")
        return (await listUserTweets(connection._id, { maxResults: 50 })).tweets.map(
          (post) => {
            const media = post.media?.[0];
            return {
              ...base,
              _id: `remote:x:${post.id}`,
              externalId: post.id,
              content: post.text,
              mediaType: media?.type,
              mediaUrl: media?.type === "photo" ? media.url : media?.url,
              thumbnailUrl: media?.preview_image_url || media?.url,
              permalink: `https://x.com/${connection.accountName}/status/${post.id}`,
              createdAt: post.created_at || base.updatedAt,
              metrics: {
                ...EMPTY_METRICS,
                impressions: post.public_metrics?.impression_count || 0,
                likes: post.public_metrics?.like_count || 0,
                comments: post.public_metrics?.reply_count || 0,
                shares:
                  (post.public_metrics?.retweet_count || 0) +
                  (post.public_metrics?.quote_count || 0),
              },
            };
          }
        );
      if (connection.platform === "tiktok")
        return (await listTikTokVideos(connection._id, { maxCount: 50 })).videos.map(
          (post) => ({
            ...base,
            _id: `remote:tiktok:${post.id}`,
            externalId: post.id,
            title: post.title,
            content: post.video_description || post.title || "TikTok video",
            mediaUrl: post.cover_image_url,
            thumbnailUrl: post.cover_image_url,
            permalink: post.share_url,
            createdAt: post.create_time
              ? new Date(post.create_time * 1000).toISOString()
              : base.updatedAt,
            metrics: {
              ...EMPTY_METRICS,
              views: post.view_count || 0,
              likes: post.like_count || 0,
              comments: post.comment_count || 0,
              shares: post.share_count || 0,
            },
          })
        );
      if (connection.platform === "youtube")
        return (await listYouTubeVideos(connection._id, { maxResults: 50 })).videos.map(
          (post) => ({
            ...base,
            _id: `remote:youtube:${post.id}`,
            externalId: post.id,
            title: post.snippet?.title,
            content: post.snippet?.description || post.snippet?.title || "YouTube video",
            mediaUrl:
              post.snippet?.thumbnails?.medium?.url ||
              post.snippet?.thumbnails?.default?.url,
            thumbnailUrl:
              post.snippet?.thumbnails?.medium?.url ||
              post.snippet?.thumbnails?.default?.url,
            permalink: `https://youtube.com/watch?v=${post.id}`,
            createdAt: post.snippet?.publishedAt || base.updatedAt,
            metrics: {
              ...EMPTY_METRICS,
              views: Number(post.statistics?.viewCount) || 0,
              likes: Number(post.statistics?.likeCount) || 0,
              comments: Number(post.statistics?.commentCount) || 0,
            },
          })
        );
      if (connection.platform === "pinterest")
        return (await listPinterestPins(connection._id, { pageSize: 50 })).pins.map(
          (post) => ({
            ...base,
            _id: `remote:pinterest:${post.id}`,
            externalId: post.id,
            title: post.title,
            content: post.description || post.title || "Pinterest pin",
            mediaUrl: Object.values(post.media?.images || {})[0]?.url,
            thumbnailUrl: Object.values(post.media?.images || {})[0]?.url,
            permalink: post.link,
            createdAt: post.created_at || base.updatedAt,
            metrics: EMPTY_METRICS,
          })
        );
      return [];
    })
  );
  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
}

async function fetchPostAnalytics(post: DisplayPost) {
  if (!post.integration || !post.externalId) return post.metrics || EMPTY_METRICS;
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 28);
  const dates = {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
  let raw: unknown;
  if (post.platform === "x") raw = await fetchTweetMetrics(post.integration, post.externalId);
  else if (post.platform === "tiktok")
    raw = (await fetchTikTokVideoMetrics(post.integration, [post.externalId]))[0];
  else if (post.platform === "youtube")
    raw = await fetchYouTubeAnalytics(post.integration, {
      ...dates,
      videoId: post.externalId,
    });
  else if (post.platform === "pinterest")
    raw = await fetchPinterestPinAnalytics(post.integration, post.externalId, dates);
  else if (post.platform === "threads")
    raw = await fetchThreadsInsights(post.integration, {
      mediaId: post.externalId,
      metric: ["views", "likes", "replies", "reposts", "quotes", "shares"],
    });
  else if (post.platform === "instagram")
    raw = await fetchInstagramInsights(post.integration, {
      mediaId: post.externalId,
      metric: ["views", "reach", "likes", "comments", "shares", "saved"],
    });
  else if (post.platform === "facebook")
    raw = await fetchFacebookInsights(post.integration, {
      mediaId: post.externalId,
      metric: ["post_impressions", "post_engaged_users", "post_clicks"],
    });
  return normalizeAnalytics(raw, post.metrics || EMPTY_METRICS);
}

export default function PostsPage() {
  const { integrations, isLoading: integrationsLoading } = useIntegrations();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [view, setView] = useState<View>("live");
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<SocialPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [analyticsPost, setAnalyticsPost] = useState<DisplayPost | null>(null);

  const connected = useMemo(
    () =>
      integrations.filter(
        (item) => item.status === "active" && PLATFORMS.includes(item.platform)
      ),
    [integrations]
  );
  const postsQuery = useQuery({ queryKey: ["social-posts"], queryFn: listSocialPosts });
  const liveQuery = useQuery({
    queryKey: ["connected-social-posts", ...connected.map((item) => item._id)],
    queryFn: () => fetchLivePosts(connected),
    enabled: connected.length > 0,
    staleTime: 60_000,
  });
  const analyticsQuery = useQuery({
    queryKey: ["post-analytics", analyticsPost?._id],
    queryFn: () => fetchPostAnalytics(analyticsPost!),
    enabled: Boolean(analyticsPost),
  });

  const workspacePosts = postsQuery.data || [];
  const scheduled = workspacePosts.filter((post) => post.status === "scheduled");
  const drafts = workspacePosts.filter((post) => post.status !== "published" && post.status !== "scheduled");
  const live = useMemo(() => {
    const combined: DisplayPost[] = [
      ...(liveQuery.data || []),
      ...workspacePosts.filter((post) => post.status === "published"),
    ];
    return combined.filter(
      (post, index) =>
        combined.findIndex((candidate) =>
          post.externalId && candidate.externalId
            ? post.externalId === candidate.externalId &&
              post.platform === candidate.platform
            : post._id === candidate._id
        ) === index
    );
  }, [liveQuery.data, workspacePosts]);
  const viewPosts: DisplayPost[] =
    view === "live" ? live : view === "scheduled" ? scheduled : drafts;
  const visible: DisplayPost[] = viewPosts.filter((post) => {
    const needle = search.trim().toLowerCase();
    return (
      (platformFilter === "all" || post.platform === platformFilter) &&
      (!needle ||
        post.title?.toLowerCase().includes(needle) ||
        post.content.toLowerCase().includes(needle) ||
        post.accountName?.toLowerCase().includes(needle))
    );
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const shared = {
        title: form.title,
        content: form.content,
        mediaUrl: form.mediaUrl || undefined,
        status: form.status,
        scheduledFor: form.status === "scheduled" ? form.scheduledFor : undefined,
      };
      if (editing) {
        const post = await updateSocialPost(editing._id, {
            ...shared,
            platform: form.platforms[0],
            integrationId: form.integrationIds[form.platforms[0]] || undefined,
          });
        return [post];
      }
      return createSocialPosts({
        ...shared,
        targets: form.platforms.map((platform) => ({
          platform,
          integrationId: form.integrationIds[platform] || undefined,
        })),
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      setEditorOpen(false);
      const count = result.length;
      toast({
        title: editing
          ? "Post updated"
          : `${count} platform post${count === 1 ? "" : "s"} created`,
      });
    },
    onError: (error: any) =>
      toast({
        title: "Could not save post",
        description: error?.response?.data?.msg || error?.response?.data?.message || error.message,
        variant: "destructive",
      }),
  });
  const removeMutation = useMutation({
    mutationFn: deleteSocialPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      toast({ title: "Post deleted" });
    },
    onError: () => toast({ title: "Could not delete post", variant: "destructive" }),
  });

  function openCreate() {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      platforms: [],
      integrationIds: {},
    });
    setEditorOpen(true);
  }
  function openEdit(post: SocialPost) {
    setEditing(post);
    setForm({
      title: post.title || "",
      content: post.content,
      mediaUrl: post.mediaUrl || "",
      platforms: [post.platform],
      integrationIds: post.integration
        ? { [post.platform]: post.integration }
        : {},
      status: post.status,
      scheduledFor: post.scheduledFor?.slice(0, 16) || "",
    });
    setEditorOpen(true);
  }
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
            [platform]: connected.find((item) => item.platform === platform)?._id || "",
          },
    }));
  }
  const loading = integrationsLoading || postsQuery.isLoading || (view === "live" && liveQuery.isLoading);
  const analyticsMetrics: Array<{
    label: string;
    value: number | undefined;
    icon: LucideIcon;
  }> = [
    { label: "Impressions", value: analyticsQuery.data?.impressions ?? analyticsPost?.metrics.impressions, icon: Eye },
    { label: "Views", value: analyticsQuery.data?.views ?? analyticsPost?.metrics.views, icon: BarChart3 },
    { label: "Likes", value: analyticsQuery.data?.likes ?? analyticsPost?.metrics.likes, icon: Heart },
    { label: "Comments", value: analyticsQuery.data?.comments ?? analyticsPost?.metrics.comments, icon: MessageCircle },
    { label: "Shares", value: analyticsQuery.data?.shares ?? analyticsPost?.metrics.shares, icon: Share2 },
    { label: "Clicks", value: analyticsQuery.data?.clicks ?? analyticsPost?.metrics.clicks, icon: MousePointerClick },
  ];
  const analyticsChartData = analyticsMetrics.map(({ label, value }) => ({
    name: label,
    value: value || 0,
  }));

  return (
    <div className='animate-in fade-in flex w-full flex-col gap-6 pb-14 duration-500'>
      <header className='relative overflow-hidden rounded-xl border bg-black p-5 ring-1 ring-black/5 md:p-7 dark:ring-white/10 h-40'>
        <img
          src='https://i.pinimg.com/736x/3d/bc/57/3dbc57f575fe70c6a691d9665a6b2d3d.jpg'
          alt=''
          className='absolute inset-0 h-full w-full object-cover object-center opacity-45'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20' />
        <div className='relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div>
            <h1 className='font-instrument-serif mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl'>Content workspace</h1>
            <p className='mt-2 max-w-2xl text-sm leading-6 text-white/70'>
              Create, schedule, and publish posts across all your social channels with ease.
            </p>
          </div>
          <Button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50">
            <Plus className='mr-2 h-4 w-4' /> New draft
          </Button>
        </div>
      </header>

      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        {[
          { label: "Drafts", value: drafts.filter((p) => p.status === "draft").length, icon: FileText },
          { label: "Scheduled", value: scheduled.length, icon: Clock3 },
          { label: "Live posts", value: live.length, icon: Check },
          { label: "Channels", value: connected.length, icon: Send },
        ].map((item) => (
          <div key={item.label} className='rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.035]'>
            <div className='text-muted-foreground flex items-center justify-between text-xs'>
              <span>{item.label}</span><item.icon className='h-4 w-4' />
            </div>
            <p className='mt-3 text-2xl font-semibold'>{item.value}</p>
          </div>
        ))}
      </div>

      <section className='overflow-hidden rounded-xl border border-black/5 bg-black/[0.015] dark:border-white/10 dark:bg-white/[0.025]'>
        <div className='flex flex-col gap-4 border-b border-black/5 p-4 md:flex-row md:items-center md:justify-between md:p-5 dark:border-white/10'>
          <div className='inline-flex w-fit rounded-full bg-black/[0.04] p-1 dark:bg-white/[0.06]'>
            {([
              ["live", "Live posts", live.length],
              ["scheduled", "Scheduled", scheduled.length],
              ["drafts", "Drafts", drafts.length],
            ] as const).map(([value, label, count]) => (
              <button
                key={value}
                onClick={() => setView(value)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium transition",
                  view === value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label} <span className='ml-1.5 opacity-60'>{count}</span>
              </button>
            ))}
          </div>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-2.5 left-3 h-4 w-4' />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search posts' className='rounded-full pl-9 sm:w-56' />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className='rounded-full sm:w-40'><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All platforms</SelectItem>
                {PLATFORMS.map((platform) => <SelectItem key={platform} value={platform}>{LABEL[platform]}</SelectItem>)}
              </SelectContent>
            </Select>
            {view === "live" && (
              <Button variant='outline' size='icon' className='rounded-full' onClick={() => liveQuery.refetch()} aria-label='Refresh live posts'>
                <RefreshCw className={cn("h-4 w-4", liveQuery.isFetching && "animate-spin")} />
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className='flex min-h-72 items-center justify-center'><Loader2 className='text-muted-foreground h-6 w-6 animate-spin' /></div>
        ) : visible.length === 0 ? (
          <div className='flex min-h-72 flex-col items-center justify-center px-6 text-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.04] dark:bg-white/[0.06]'>
              {view === "drafts" ? <FileText className='text-muted-foreground h-5 w-5' /> : view === "scheduled" ? <CalendarClock className='text-muted-foreground h-5 w-5' /> : <BarChart3 className='text-muted-foreground h-5 w-5' />}
            </div>
            <p className='mt-4 font-medium'>{view === "drafts" ? "No drafts yet" : view === "scheduled" ? "Nothing scheduled" : "No live posts found"}</p>
            <p className='text-muted-foreground mt-1 max-w-sm text-sm'>
              {view === "drafts"
                ? "Create a draft here, or generate content in chat and it will appear automatically."
                : view === "scheduled"
                  ? "Choose Scheduled while creating or editing a post to place it here."
                  : connected.length ? "Publish on a connected platform, then refresh this view." : "Connect a social account to bring its live posts into this workspace."}
            </p>
            {view !== "live" && <Button variant='outline' className='mt-5 rounded-full' onClick={openCreate}><Plus className='mr-2 h-4 w-4' />New post</Button>}
          </div>
        ) : (
          <div className='columns-1 gap-4 p-4 md:columns-2 md:p-5 xl:columns-3'>
            {visible.map((post) => (
              <article key={post._id} className='group mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border border-black/5 bg-background align-top transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10'>
                <div className={cn("relative w-full overflow-hidden bg-gradient-to-br", TINT[post.platform])}>
                  <MediaPreview post={post} />
                  <div className='absolute top-3 left-3 flex items-center gap-2'>
                    <span className='rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold capitalize shadow-sm backdrop-blur'>{post.status}</span>
                    {post.accountName && <span className='max-w-32 truncate rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white backdrop-blur'>@{post.accountName}</span>}
                  </div>
                  {view !== "live" && !post.remote && (
                    <div className='absolute top-3 right-3 flex gap-1'>
                      <button onClick={() => openEdit(post)} className='flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm' aria-label='Edit post'><Edit3 className='h-3.5 w-3.5' /></button>
                      <button onClick={() => window.confirm("Delete this post?") && removeMutation.mutate(post._id)} className='flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-red-600 shadow-sm' aria-label='Delete post'><Trash2 className='h-3.5 w-3.5' /></button>
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='flex items-center gap-2 text-xs font-medium'><PlatformIcon platform={post.platform} className='h-3.5 w-3.5' />{LABEL[post.platform]}</span>
                    <span className='text-muted-foreground text-[10px]'>{postDate(post)}</span>
                  </div>
                  <h2 className='mt-3 line-clamp-1 text-sm font-semibold'>{post.title || post.content || "Untitled post"}</h2>
                  <p className='text-muted-foreground mt-1 line-clamp-2 min-h-10 text-xs leading-5'>{post.content || "No caption yet"}</p>
                  {view === "live" ? (
                    <div className='mt-4 flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/10'>
                      <div className='text-muted-foreground flex gap-3 text-[10px]'>
                        <span className='flex items-center gap-1'><Eye className='h-3 w-3' />{compact(post.metrics?.views || post.metrics?.impressions)}</span>
                        <span className='flex items-center gap-1'><Heart className='h-3 w-3' />{compact(post.metrics?.likes)}</span>
                        <span className='flex items-center gap-1'><MessageCircle className='h-3 w-3' />{compact(post.metrics?.comments)}</span>
                      </div>
                      <button onClick={() => setAnalyticsPost(post)} className='flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400'>Analytics <BarChart3 className='h-3 w-3' /></button>
                    </div>
                  ) : (
                    <button onClick={() => openEdit(post)} className='text-muted-foreground hover:text-foreground mt-4 flex w-full items-center justify-between border-t border-black/5 pt-3 text-[11px] font-medium dark:border-white/10'>Manage post <Edit3 className='h-3 w-3' /></button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className='max-h-[92vh] overflow-y-auto sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit post" : "Create draft"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this post and its destination."
                : "Check every platform you want to post to, then compose once."}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-2'>
            <div className='grid gap-2'>
              <div className='flex items-center justify-between gap-3'>
                <Label>Post to</Label>
                <span className='text-muted-foreground text-xs'>
                  {form.platforms.length} selected
                </span>
              </div>
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
                {PLATFORMS.map((platform) => {
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
                        "relative flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition",
                        selected
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 ring-2 ring-indigo-500/15 dark:text-indigo-300"
                          : "border-black/10 bg-black/[0.02] hover:border-black/20 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                      )}
                    >
                      <PlatformIcon platform={platform} className='h-5 w-5' />
                      <span>{LABEL[platform]}</span>
                      {selected && (
                        <span className='absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white'>
                          <Check className='h-3 w-3' />
                        </span>
                      )}
                      <span className={cn("text-[9px]", isConnected ? "text-emerald-600" : "text-muted-foreground")}>
                        {isConnected ? "Connected" : "No account"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {form.platforms.length > 0 && (
              <div className='grid gap-3 rounded-xl border border-black/5 bg-black/[0.02] p-3 sm:grid-cols-2 dark:border-white/10 dark:bg-white/[0.03]'>
                {form.platforms.map((platform) => {
                  const accounts = connected.filter(
                    (item) => item.platform === platform
                  );
                  return (
                    <div key={platform} className='grid gap-1.5'>
                      <Label className='flex items-center gap-2 text-xs'>
                        <PlatformIcon platform={platform} className='h-3.5 w-3.5' />
                        {LABEL[platform]} account
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
                        <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                        <SelectContent>
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
            )}
            <div className='grid gap-2'><Label htmlFor='post-title'>Internal title</Label><Input id='post-title' value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder='Summer launch' /></div>
            <div className='grid gap-2'><Label htmlFor='post-content'>Caption</Label><Textarea id='post-content' value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} placeholder='Write your post…' /></div>
            <div className='grid gap-2'><Label>Media</Label><MediaPicker accept='media' value={form.mediaUrl} onChange={(mediaUrl) => setForm((current) => ({ ...current, mediaUrl }))} /></div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='grid gap-2'>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as SocialPostStatus })}>
                  <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value='draft'>Draft</SelectItem><SelectItem value='scheduled'>Scheduled</SelectItem><SelectItem value='published'>Mark as published</SelectItem><SelectItem value='failed'>Failed</SelectItem></SelectContent>
                </Select>
              </div>
              {form.status === "scheduled" && <div className='grid gap-2'><Label htmlFor='scheduled-for'>Publish time</Label><Input id='scheduled-for' type='datetime-local' value={form.scheduledFor} onChange={(e) => setForm({ ...form, scheduledFor: e.target.value })} /></div>}
            </div>
          </div>
          <DialogFooter><Button variant='outline' onClick={() => setEditorOpen(false)}>Cancel</Button><Button disabled={!form.platforms.length || !form.content.trim() || (form.status === "scheduled" && !form.scheduledFor) || saveMutation.isPending} onClick={() => saveMutation.mutate()}>{saveMutation.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : form.status === "scheduled" ? <CalendarClock className='mr-2 h-4 w-4' /> : <FileText className='mr-2 h-4 w-4' />}{saveMutation.isPending ? "Saving…" : editing ? "Save post" : `Create ${form.platforms.length || ""} post${form.platforms.length === 1 ? "" : "s"}`}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(analyticsPost)} onOpenChange={(open) => !open && setAnalyticsPost(null)}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>{analyticsPost && <PlatformIcon platform={analyticsPost.platform} />} Post analytics</DialogTitle>
            <DialogDescription>{analyticsPost?.title || analyticsPost?.content || "Live post"} · last 28 days where supported</DialogDescription>
          </DialogHeader>
          {analyticsQuery.isLoading ? <div className='flex h-72 items-center justify-center'><Loader2 className='h-6 w-6 animate-spin' /></div> : (
            <>
              {analyticsQuery.isError && <div className='rounded-xl bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300'>Live analytics could not be refreshed. Showing the latest metrics supplied by the platform.</div>}
              <div className='mt-2 h-72 w-full rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.04]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={analyticsChartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='currentColor' opacity={0.08} />
                    <XAxis dataKey='name' axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.55 }} />
                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} tickFormatter={(value) => compact(Number(value))} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.55 }} />
                    <Tooltip
                      cursor={{ fill: "currentColor", opacity: 0.04 }}
                      formatter={(value) => [Number(value).toLocaleString(), "Total"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid rgba(127,127,127,.2)", fontSize: 12 }}
                    />
                    <Bar dataKey='value' fill='#6366f1' radius={[8, 8, 2, 2]} maxBarSize={54} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className='grid grid-cols-2 gap-3 py-2 sm:grid-cols-3'>
                {analyticsMetrics.map(({ label, value, icon: Icon }) => (
                  <div key={label} className='rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.04]'>
                    <div className='text-muted-foreground flex items-center justify-between text-xs'><span>{label}</span><Icon className='h-4 w-4' /></div>
                    <p className='mt-3 text-2xl font-semibold'>{compact(value || 0)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <DialogFooter className='sm:justify-between'>
            <Button variant='outline' onClick={() => analyticsQuery.refetch()}><RefreshCw className='mr-2 h-4 w-4' />Refresh</Button>
            {analyticsPost?.permalink && <Button asChild><a href={analyticsPost.permalink} target='_blank' rel='noreferrer'>View live post <ExternalLink className='ml-2 h-4 w-4' /></a></Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
