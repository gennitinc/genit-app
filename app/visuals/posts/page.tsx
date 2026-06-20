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
import { PostEditorDialog } from "@/app/visuals/_components/post-editor-dialog";
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
import { useIntegrations } from "@/hooks/use-integrations";
import { useToast } from "@/hooks/use-toast";
import {
  type FacebookPostSummary,
  type IntegrationConnection,
  type IntegrationPlatform,
  fetchFacebookInsights,
  fetchInstagramInsights,
  fetchPinterestPinAnalytics,
  fetchThreadsInsights,
  fetchTikTokVideoMetrics,
  fetchTweetMetrics,
  fetchYouTubeAnalytics,
  listFacebookPosts,
  listInstagramPosts,
  listPinterestPins,
  listThreadsPosts,
  listTikTokVideos,
  listUserTweets,
  listYouTubeVideos,
} from "@/lib/integrations-api";
import {
  type SocialPost,
  type SocialPostMetrics,
  type SocialPostStatus,
  createSocialPosts,
  deleteSocialPost,
  listSocialPosts,
  updateSocialPost,
} from "@/lib/social-posts-api";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  BarChart3,
  CalendarClock,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Heart,
  Loader2,
  type LucideIcon,
  MessageCircle,
  MousePointerClick,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Trash2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

function PostMetrics({
  metrics,
  loading,
}: {
  metrics: SocialPostMetrics;
  loading?: boolean;
}) {
  return (
    <div className='text-muted-foreground flex items-center gap-3 text-[10px]'>
      <span className='flex items-center gap-1' title='Views or impressions'>
        <Eye className='h-3 w-3' />
        {compact(metrics.views || metrics.impressions)}
      </span>
      <span className='flex items-center gap-1' title='Likes'>
        <Heart className='h-3 w-3' />
        {compact(metrics.likes)}
      </span>
      <span className='flex items-center gap-1' title='Comments'>
        <MessageCircle className='h-3 w-3' />
        {compact(metrics.comments)}
      </span>
      {loading && (
        <Loader2
          className='h-3 w-3 animate-spin opacity-60'
          aria-label='Refreshing post metrics'
        />
      )}
    </div>
  );
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
  return (
    /\.(mp4|mov|m4v|webm|ogg)(?:$|\?)/i.test(url) ||
    /\/video(?:\/|_|-)/i.test(url)
  );
}

function facebookMedia(post: FacebookPostSummary) {
  const attachment = post.attachments?.data?.[0];
  const child = attachment?.subattachments?.data?.[0];
  const item = child || attachment;
  const mediaType = item?.media_type || attachment?.media_type;
  const thumbnailUrl =
    post.full_picture ||
    item?.media?.image?.src ||
    attachment?.media?.image?.src;
  const videoUrl = mediaType?.toLowerCase().includes("video")
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
        <PlatformIcon
          platform={post.platform}
          className='h-10 w-10 opacity-60'
        />
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
          return (
            total +
            Object.values(value).reduce<number>(
              (sum, part) => sum + (Number(part) || 0),
              0
            )
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
      analyticsValue(raw, [
        "impressions",
        "impression_count",
        "impressioncount",
        "post_impressions",
        "reach",
      ]) || fallback.impressions,
    views:
      analyticsValue(raw, [
        "views",
        "view_count",
        "viewcount",
        "video_views",
      ]) || fallback.views,
    likes:
      analyticsValue(raw, ["likes", "like_count", "likecount", "reactions"]) ||
      fallback.likes,
    comments:
      analyticsValue(raw, [
        "comments",
        "comment_count",
        "commentcount",
        "replies",
      ]) || fallback.comments,
    shares:
      analyticsValue(raw, [
        "shares",
        "share_count",
        "sharecount",
        "retweet_count",
        "reposts",
        "quotes",
      ]) || fallback.shares,
    clicks:
      analyticsValue(raw, [
        "clicks",
        "click_count",
        "clickcount",
        "post_clicks",
        "pin_click",
        "pin_clicks",
      ]) || fallback.clicks,
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
          thumbnailUrl:
            post.media_type === "IMAGE" ? post.media_url : undefined,
          permalink: post.permalink,
          createdAt: post.timestamp || base.updatedAt,
          metrics: EMPTY_METRICS,
        }));
      if (connection.platform === "x")
        return (
          await listUserTweets(connection._id, { maxResults: 50 })
        ).tweets.map((post) => {
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
        });
      if (connection.platform === "tiktok")
        return (
          await listTikTokVideos(connection._id, { maxCount: 50 })
        ).videos.map((post) => ({
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
        }));
      if (connection.platform === "youtube")
        return (
          await listYouTubeVideos(connection._id, { maxResults: 50 })
        ).videos.map((post) => ({
          ...base,
          _id: `remote:youtube:${post.id}`,
          externalId: post.id,
          title: post.snippet?.title,
          content:
            post.snippet?.description || post.snippet?.title || "YouTube video",
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
        }));
      if (connection.platform === "pinterest")
        return (
          await listPinterestPins(connection._id, { pageSize: 50 })
        ).pins.map((post) => ({
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
        }));
      return [];
    })
  );
  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
}

async function fetchPostAnalytics(post: DisplayPost) {
  if (!post.integration || !post.externalId)
    return post.metrics || EMPTY_METRICS;
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 28);
  const dates = {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
  let raw: unknown;
  if (post.platform === "x")
    raw = await fetchTweetMetrics(post.integration, post.externalId);
  else if (post.platform === "tiktok")
    raw = (
      await fetchTikTokVideoMetrics(post.integration, [post.externalId])
    )[0];
  else if (post.platform === "youtube")
    raw = await fetchYouTubeAnalytics(post.integration, {
      ...dates,
      videoId: post.externalId,
    });
  else if (post.platform === "pinterest")
    raw = await fetchPinterestPinAnalytics(
      post.integration,
      post.externalId,
      dates
    );
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
  const postsQuery = useQuery({
    queryKey: ["social-posts"],
    queryFn: listSocialPosts,
  });
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
  const scheduled = workspacePosts.filter(
    (post) => post.status === "scheduled"
  );
  const drafts = workspacePosts.filter(
    (post) => post.status !== "published" && post.status !== "scheduled"
  );
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
  const liveAnalyticsQueries = useQueries({
    queries: live.map((post) => ({
      queryKey: ["post-analytics", post._id],
      queryFn: () => fetchPostAnalytics(post),
      enabled: Boolean(post.integration && post.externalId),
      staleTime: 5 * 60_000,
      retry: false,
    })),
  });
  const liveMetricsById = useMemo(
    () =>
      new Map(
        live.map((post, index) => [
          post._id,
          liveAnalyticsQueries[index]?.data || post.metrics || EMPTY_METRICS,
        ])
      ),
    [live, liveAnalyticsQueries]
  );
  const loadingMetricIds = useMemo(
    () =>
      new Set(
        live
          .filter((_post, index) => liveAnalyticsQueries[index]?.isLoading)
          .map((post) => post._id)
      ),
    [live, liveAnalyticsQueries]
  );
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
        scheduledFor:
          form.status === "scheduled" ? form.scheduledFor : undefined,
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
        description:
          error?.response?.data?.msg ||
          error?.response?.data?.message ||
          error.message,
        variant: "destructive",
      }),
  });
  const removeMutation = useMutation({
    mutationFn: deleteSocialPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      toast({ title: "Post deleted" });
    },
    onError: () =>
      toast({ title: "Could not delete post", variant: "destructive" }),
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
  const loading =
    integrationsLoading ||
    postsQuery.isLoading ||
    (view === "live" && liveQuery.isLoading);
  const analyticsMetrics: Array<{
    label: string;
    value: number | undefined;
    icon: LucideIcon;
  }> = [
    {
      label: "Impressions",
      value:
        analyticsQuery.data?.impressions ?? analyticsPost?.metrics.impressions,
      icon: Eye,
    },
    {
      label: "Views",
      value: analyticsQuery.data?.views ?? analyticsPost?.metrics.views,
      icon: BarChart3,
    },
    {
      label: "Likes",
      value: analyticsQuery.data?.likes ?? analyticsPost?.metrics.likes,
      icon: Heart,
    },
    {
      label: "Comments",
      value: analyticsQuery.data?.comments ?? analyticsPost?.metrics.comments,
      icon: MessageCircle,
    },
    {
      label: "Shares",
      value: analyticsQuery.data?.shares ?? analyticsPost?.metrics.shares,
      icon: Share2,
    },
    {
      label: "Clicks",
      value: analyticsQuery.data?.clicks ?? analyticsPost?.metrics.clicks,
      icon: MousePointerClick,
    },
  ];
  const analyticsChartData = analyticsMetrics.map(({ label, value }) => ({
    name: label,
    value: value || 0,
  }));

  return (
    <div className='animate-in fade-in flex w-full flex-col gap-6 pb-14 duration-500'>
      <header className='relative overflow-hidden rounded-3xl bg-black/[0.025] p-4 border dark:bg-white/[0.04]'>
         <img
          src='https://i.pinimg.com/1200x/d3/fb/28/d3fb286b8631f66116718fdc97b1d6bf.jpg'
          className='pointer-events-none absolute inset-0 h-full w-full object-cover select-none'
          alt=''
        />
        <div className='relative grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:items-center'>
          <div className='flex min-w-0 flex-col items-start justify-center py-1 lg:pl-6'>
            <div>
              <h1 className='font-instrument-serif text-2xl font-semibold tracking-tight text-white'>
                Content workspace
              </h1>
              <p className='mt-1 max-w-2xl text-sm leading-5 text-white/70'>
                Create, schedule, and publish posts across all your social
                channels.
              </p>
            </div>
            <Button
              onClick={openCreate}
              className='mt-4 flex h-9 w-fit items-center gap-2 rounded-sm bg-indigo-600 px-4 text-sm text-white hover:bg-indigo-500 disabled:opacity-50'
            >
              New Post <Plus className='h-4 w-4' />
            </Button>
          </div>

          <div className='hidden rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-black/5 sm:block dark:bg-zinc-950/95 dark:shadow-none dark:ring-white/10'>
            <div className='flex items-center justify-between gap-3 border-b border-black/5 pb-3 dark:border-white/10'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                  <BarChart3 className='h-4 w-4' />
                </div>
                <div className='min-w-0'>
                  <p className='text-foreground truncate text-sm font-medium dark:text-white'>
                    Content overview
                  </p>
                  <p className='text-muted-foreground truncate text-xs dark:text-white/50'>
                    {connected.length} connected channel
                    {connected.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1 text-[11px] font-medium ring-1",
                  connected.length
                    ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/15 dark:text-emerald-400"
                    : "bg-black/5 text-zinc-600 ring-black/5 dark:bg-white/5 dark:text-white/60 dark:ring-white/10"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-sm",
                    connected.length ? "bg-emerald-500" : "bg-zinc-400"
                  )}
                />
                {connected.length ? "Ready" : "Offline"}
              </span>
            </div>

            <div className='mt-3 grid grid-cols-3 gap-2'>
              {[
                {
                  label: "Drafts",
                  value: drafts.filter((post) => post.status === "draft")
                    .length,
                },
                { label: "Live posts", value: live.length },
                { label: "Scheduled", value: scheduled.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className='rounded-sm bg-black/[0.025] px-3 py-2.5 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'
                >
                  <p className='text-muted-foreground text-[11px] dark:text-white/50'>
                    {item.label}
                  </p>
                  <p className='text-foreground mt-0.5 text-lg font-semibold dark:text-white'>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className='overflow-hidden rounded-xl border border-black/5 bg-black/[0.015] dark:border-white/10 dark:bg-white/[0.025]'>
        <div className='flex flex-col gap-4 border-b border-black/5 p-2 md:flex-row md:items-center md:justify-between md:p-2 dark:border-white/10'>
          <div className='inline-flex w-fit rounded-full bg-black/[0.04] p-1 dark:bg-white/[0.06]'>
            {(
              [
                ["live", "Live posts", live.length],
                ["scheduled", "Scheduled", scheduled.length],
                ["drafts", "Drafts", drafts.length],
              ] as const
            ).map(([value, label, count]) => (
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
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search posts'
                className='rounded-full pl-9 sm:w-56'
              />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className='rounded-full sm:w-40'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All platforms</SelectItem>
                {PLATFORMS.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {LABEL[platform]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {view === "live" && (
              <Button
                variant='outline'
                size='icon'
                className='rounded-full'
                onClick={() => liveQuery.refetch()}
                aria-label='Refresh live posts'
              >
                {liveQuery.isFetching ? (
                  <div className=''>
                    <LoadingFileLoader />{" "}
                  </div>
                ) : (
                  <>
                    <RefreshCw className='size-4' />{" "}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className='text-muted-foreground flex min-h-72 items-center justify-center'>
            <LoadingFileLoader size={24} />
          </div>
        ) : visible.length === 0 ? (
          <div className='flex min-h-72 flex-col items-center justify-center px-6 text-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.04] dark:bg-white/[0.06]'>
              {view === "drafts" ? (
                <FileText className='text-muted-foreground h-5 w-5' />
              ) : view === "scheduled" ? (
                <CalendarClock className='text-muted-foreground h-5 w-5' />
              ) : (
                <BarChart3 className='text-muted-foreground h-5 w-5' />
              )}
            </div>
            <p className='mt-4 font-medium'>
              {view === "drafts"
                ? "No drafts yet"
                : view === "scheduled"
                  ? "Nothing scheduled"
                  : "No live posts found"}
            </p>
            <p className='text-muted-foreground mt-1 max-w-sm text-sm'>
              {view === "drafts"
                ? "Create a draft here, or generate content in chat and it will appear automatically."
                : view === "scheduled"
                  ? "Choose Scheduled while creating or editing a post to place it here."
                  : connected.length
                    ? "Publish on a connected platform, then refresh this view."
                    : "Connect a social account to bring its live posts into this workspace."}
            </p>
            {view !== "live" && (
              <Button
                variant='outline'
                className='mt-5 rounded-full'
                onClick={openCreate}
              >
                <Plus className='mr-2 h-4 w-4' />
                New post
              </Button>
            )}
          </div>
        ) : (
          <div className='columns-1 gap-4 p-4 md:columns-2 md:p-5 xl:columns-3'>
            {visible.map((post) => (
              <article
                key={post._id}
                className='group bg-background mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border border-black/5 align-top transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10'
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-gradient-to-br",
                    TINT[post.platform]
                  )}
                >
                  <MediaPreview post={post} />
                  <div className='absolute top-3 left-3 flex items-center gap-2'>
                    <span className='bg-background/90 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize shadow-sm backdrop-blur'>
                      {post.status}
                    </span>
                    {post.accountName && (
                      <span className='max-w-32 truncate rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-white backdrop-blur'>
                        @{post.accountName}
                      </span>
                    )}
                  </div>
                  {view !== "live" && !post.remote && (
                    <div className='absolute top-3 right-3 flex gap-1'>
                      <button
                        onClick={() => openEdit(post)}
                        className='bg-background/90 flex h-8 w-8 items-center justify-center rounded-full shadow-sm'
                        aria-label='Edit post'
                      >
                        <Edit3 className='h-3.5 w-3.5' />
                      </button>
                      <button
                        onClick={() =>
                          window.confirm("Delete this post?") &&
                          removeMutation.mutate(post._id)
                        }
                        className='bg-background/90 flex h-8 w-8 items-center justify-center rounded-full text-red-600 shadow-sm'
                        aria-label='Delete post'
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </button>
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='flex items-center gap-2 text-xs font-medium'>
                      <PlatformIcon
                        platform={post.platform}
                        className='h-3.5 w-3.5'
                      />
                      {LABEL[post.platform]}
                    </span>
                    <span className='text-muted-foreground text-[10px]'>
                      {postDate(post)}
                    </span>
                  </div>
                  <h2 className='mt-3 line-clamp-1 text-sm font-semibold'>
                    {post.title || post.content || "Untitled post"}
                  </h2>
                  <p className='text-muted-foreground mt-1 line-clamp-2 min-h-10 text-xs leading-5'>
                    {post.content || "No caption yet"}
                  </p>
                  {view === "live" ? (
                    <div className='mt-4 flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/10'>
                      <PostMetrics
                        metrics={liveMetricsById.get(post._id) || EMPTY_METRICS}
                        loading={loadingMetricIds.has(post._id)}
                      />
                      <button
                        onClick={() => setAnalyticsPost(post)}
                        className='flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400'
                      >
                        Analytics <BarChart3 className='h-3 w-3' />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openEdit(post)}
                      className='text-muted-foreground hover:text-foreground mt-4 flex w-full items-center justify-between border-t border-black/5 pt-3 text-[11px] font-medium dark:border-white/10'
                    >
                      Manage post <Edit3 className='h-3 w-3' />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <PostEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editing={Boolean(editing)}
        connected={connected}
        form={form}
        setForm={setForm}
        isSaving={saveMutation.isPending}
        onSave={() => saveMutation.mutate()}
      />

      <Dialog
        open={Boolean(analyticsPost)}
        onOpenChange={(open) => !open && setAnalyticsPost(null)}
      >
        <DialogContent
          className='flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-0 text-white shadow-2xl sm:max-w-3xl'
          hideDialogClose
        >
          <DialogHeader className='relative px-5 pt-4 pb-3 text-left border-b border-white/[0.05]'>
            <div className='flex items-center gap-2.5'>
              <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/20'>
                <BarChart3 className='h-4 w-4' />
              </span>
              <div>
                <DialogTitle className='text-sm font-semibold text-white'>
                  Post analytics
                </DialogTitle>
                <DialogDescription className='text-[11px] text-zinc-500'>
                  Performance metrics · last 28 days
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className='min-h-0 flex-1 overflow-y-auto px-5 py-4'>
            <div className='grid gap-4 lg:grid-cols-[1fr_1.4fr]'>
              {/* Left column: Post Preview Card */}
              <div className='flex flex-col gap-3 lg:border-r lg:border-white/[0.05] lg:pr-4'>
                <div>
                  <h3 className='text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2'>Post Details</h3>
                  <div className='group overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]'>
                    <div className='relative w-full overflow-hidden bg-zinc-900 aspect-video flex items-center justify-center border-b border-white/[0.05]'>
                      {analyticsPost && <MediaPreview post={analyticsPost} />}
                      <div className='absolute top-2 left-2 flex items-center gap-1.5'>
                        <span className='bg-black/70 rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize backdrop-blur text-white/90'>
                          {analyticsPost?.status}
                        </span>
                        {analyticsPost?.accountName && (
                          <span className='max-w-28 truncate rounded-full bg-black/60 px-2 py-0.5 text-[9px] text-white/80 backdrop-blur'>
                            @{analyticsPost.accountName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='p-3'>
                      <div className='flex items-center justify-between gap-3'>
                        <span className='flex items-center gap-2 text-xs font-medium text-white/90'>
                          {analyticsPost && (
                            <PlatformIcon
                              platform={analyticsPost.platform}
                              className='h-3.5 w-3.5'
                            />
                          )}
                          {analyticsPost && LABEL[analyticsPost.platform]}
                        </span>
                        <span className='text-zinc-500 text-[10px]'>
                          {analyticsPost && postDate(analyticsPost)}
                        </span>
                      </div>
                      <h4 className='mt-2 line-clamp-1 text-sm font-semibold text-white'>
                        {analyticsPost?.title || "Untitled Post"}
                      </h4>
                      <p className='text-zinc-400 mt-1 line-clamp-3 text-xs leading-5'>
                        {analyticsPost?.content || "No caption"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: Analytics Chart & Metrics */}
              <div className='space-y-4'>
                {analyticsQuery.isLoading ? (
                  <div className='flex h-48 items-center justify-center'>
                    <Loader2 className='h-5 w-5 animate-spin text-zinc-500' />
                  </div>
                ) : (
                  <>
                    {analyticsQuery.isError && (
                      <div className='rounded-lg bg-amber-500/10 p-2.5 text-[11px] text-amber-300'>
                        Live analytics could not be refreshed. Showing the latest
                        metrics supplied by the platform.
                      </div>
                    )}

                    <div>
                      <h3 className='text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2'>Engagement</h3>
                      <div className='h-48 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] p-3'>
                        <ResponsiveContainer width='100%' height='100%'>
                          <BarChart
                            data={analyticsChartData}
                            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray='3 3'
                              vertical={false}
                              stroke='rgba(255,255,255,0.06)'
                            />
                            <XAxis
                              dataKey='name'
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fontSize: 10,
                                fill: "rgba(255,255,255,0.4)",
                              }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              allowDecimals={false}
                              tickFormatter={(value) => compact(Number(value))}
                              tick={{
                                fontSize: 10,
                                fill: "rgba(255,255,255,0.4)",
                              }}
                            />
                            <Tooltip
                              cursor={{ fill: "rgba(255,255,255,0.04)" }}
                              formatter={(value) => [
                                Number(value).toLocaleString(),
                                "Total",
                              ]}
                              contentStyle={{
                                borderRadius: 10,
                                border: "1px solid rgba(255,255,255,.1)",
                                background: "#18181b",
                                color: "#fff",
                                fontSize: 11,
                              }}
                            />
                            <Bar
                              dataKey='value'
                              fill='#4f46e5'
                              radius={[4, 4, 1, 1]}
                              maxBarSize={36}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h3 className='text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2'>Breakdown</h3>
                      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                        {analyticsMetrics.map(({ label, value, icon: Icon }) => (
                          <div
                            key={label}
                            className='rounded-lg border border-white/[0.08] bg-white/[0.02] p-2.5 hover:bg-white/[0.04] transition-all duration-200'
                          >
                            <div className='flex items-center justify-between text-[11px] text-zinc-500'>
                              <span>{label}</span>
                              <Icon className='h-3.5 w-3.5' />
                            </div>
                            <p className='mt-1.5 text-lg font-semibold tracking-tight text-white'>
                              {compact(value || 0)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className='sm:justify-between gap-2 border-t border-white/[0.05] bg-[#0c0c0e]/95 px-5 py-3'>
            <Button
              variant='outline'
              onClick={() => analyticsQuery.refetch()}
              className='rounded-md border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white'
            >
              <RefreshCw className='h-4 w-4' />
              Refresh
            </Button>
            {analyticsPost?.permalink && (
              <Button
                asChild
                className='rounded-md bg-indigo-600 text-white hover:bg-indigo-500 font-medium'
              >
                <a
                  href={analyticsPost.permalink}
                  target='_blank'
                  rel='noreferrer'
                >
                  View live post <ExternalLink className='h-4 w-4' />
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
