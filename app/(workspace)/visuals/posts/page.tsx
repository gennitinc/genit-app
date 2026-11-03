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
import {
  PostEditorDialog,
  type PostEditorForm,
  getProviderTargetMetadata,
} from "@/app/(workspace)/visuals/_components/post-editor-dialog";
import { PostCommentsPanel } from "@/app/(workspace)/visuals/_components/post-comments-panel";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  type IntegrationPlatform,
  asEffectiveIntegration,
} from "@/lib/integrations-api";
import {
  type SocialPost,
  type SocialPostMedia,
  type SocialPostMetrics,
  type SocialConnection,
  type SocialCapability,
  createSocialPosts,
  deleteConnectionPost,
  deleteSocialPost,
  fetchConnectionPostAnalytics,
  generateSocialPostText,
  listRemoteSocialPosts,
  listSocialConnections,
  listSocialPostsPage,
  updateConnectionPost,
  publishSocialPosts,
  scheduledPostIso,
  scheduledPostLocalValue,
  updateSocialPosts,
} from "@/lib/social-posts-api";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { GradientFrame } from "@/utils/gradient-frame";
import {
  useInfiniteQuery,
  useMutation,
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
  type LucideIcon,
  MessageCircle,
  MoreHorizontal,
  MousePointerClick,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";

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
const POSTS_PAGE_SIZE = 50;
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
const EMPTY_FORM: PostEditorForm = {
  title: "",
  content: "",
  mediaUrl: "",
  mediaType: "",
  media: [] as SocialPostMedia[],
  platforms: [] as IntegrationPlatform[],
  integrationIds: {} as Partial<Record<IntegrationPlatform, string>>,
  providerTargetIds: {} as Partial<Record<IntegrationPlatform, string>>,
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

type DisplayPost = SocialPost & {
  remote?: boolean;
  mediaType?: string;
  thumbnailUrl?: string;
};
type View = "live" | "scheduled" | "drafts";
type DetailTab = "analytics" | "comments";
type LiveFetchFailure = {
  integrationId: string;
  platform: IntegrationPlatform;
  accountName: string;
  message: string;
};

function errorMessage(error: any) {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.message ||
    error?.message ||
    "Could not load posts from this account."
  );
}

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
      {loading && <LoadingFileLoader size={12} />}
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

function MediaPreview({ post }: { post: DisplayPost }) {
  const [failed, setFailed] = useState(false);
  const primaryMedia = post.media?.[0];
  const source = post.thumbnailUrl || primaryMedia?.url || post.mediaUrl;
  const isVideo =
    primaryMedia?.mimeType?.toLowerCase().includes("video") ||
    post.mediaType?.toLowerCase().includes("video") ||
    isVideoMedia(primaryMedia?.url || post.mediaUrl);

  if (!source || failed) {
    return null;
  }
  if (isVideo && (primaryMedia?.url || post.mediaUrl)) {
    return (
      <video
        src={primaryMedia?.url || post.mediaUrl}
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

// Every connected account is read through the same server endpoint; the
// server picks the platform adapter. Each post is attributed to the
// connection that fetched it, never to a provider-supplied id, so one
// account's posts cannot surface under another.
async function fetchLivePosts(
  connections: SocialConnection[]
): Promise<{ posts: DisplayPost[]; failures: LiveFetchFailure[] }> {
  const results = await Promise.allSettled(
    connections.map((connection) =>
      listRemoteSocialPosts(connection._id, 50)
    )
  );
  const failures: LiveFetchFailure[] = [];
  const posts = results.flatMap((result, index) => {
    const connection = connections[index];
    if (result.status === "fulfilled")
      return result.value.map((post) => ({
        ...post,
        remote: true,
        integration: connection._id,
        platform: connection.platform,
        accountName: connection.accountName,
      }));
    // Do not make one unavailable provider hide posts from every other
    // connected account; report which account failed instead.
    console.error(
      `[Visuals/Posts] Could not fetch ${connection.platform} posts for ${connection.accountName}:`,
      result.reason
    );
    failures.push({
      integrationId: connection._id,
      platform: connection.platform,
      accountName: connection.accountName,
      message: errorMessage(result.reason),
    });
    return [];
  });
  if (!posts.length && failures.length === connections.length && failures[0])
    throw new Error(failures[0].message);
  return { posts, failures };
}

function mergeMetrics(
  live: SocialPostMetrics,
  fallback: SocialPostMetrics = EMPTY_METRICS
): SocialPostMetrics {
  return {
    impressions: live.impressions || fallback.impressions,
    views: live.views || fallback.views,
    likes: live.likes || fallback.likes,
    comments: live.comments || fallback.comments,
    shares: live.shares || fallback.shares,
    clicks: live.clicks || fallback.clicks,
  };
}

export default function PostsPage() {
  const {
    orgId,
    integrations,
    isLoading: integrationsLoading,
  } = useIntegrations();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [view, setView] = useState<View>("live");
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<DisplayPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DisplayPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [detailPost, setDetailPost] = useState<DisplayPost | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("analytics");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Accounts the post editor can publish to.
  const connected = useMemo(
    () =>
      integrations
        .filter((item) => item.status === "active")
        .map(asEffectiveIntegration)
        .filter((item) => PLATFORMS.includes(item.platform)),
    [integrations]
  );
  // Accounts with live content, and what each one supports, come from the
  // server's platform adapters.
  const connectionsQuery = useQuery({
    queryKey: [
      "social-connections",
      orgId || "none",
      ...integrations.map((item) => `${item._id}:${item.updatedAt}`),
    ],
    queryFn: listSocialConnections,
    enabled: Boolean(orgId),
    staleTime: 30_000,
  });
  const socialConnections = useMemo(
    () => connectionsQuery.data || [],
    [connectionsQuery.data]
  );
  const connectionById = useMemo(
    () => new Map(socialConnections.map((item) => [item._id, item])),
    [socialConnections]
  );
  const liveConnections = useMemo(
    () =>
      socialConnections.filter((item) =>
        item.capabilities.includes("listPosts")
      ),
    [socialConnections]
  );
  const activeConnectionIds = useMemo(
    () => new Set(socialConnections.map((item) => item._id)),
    [socialConnections]
  );
  // A post's actions depend on its connected account's adapter.
  function can(post: DisplayPost | null, capability: SocialCapability) {
    return Boolean(
      post?.integration &&
      post.externalId &&
      connectionById.get(String(post.integration))?.capabilities.includes(
        capability
      )
    );
  }
  const postsQuery = useInfiniteQuery({
    queryKey: ["social-posts", orgId || "none", "pages"],
    queryFn: ({ pageParam }) =>
      listSocialPostsPage({ page: pageParam, limit: POSTS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: Boolean(orgId),
  });
  const liveQuery = useQuery({
    queryKey: [
      "connected-social-posts",
      orgId || "none",
      ...liveConnections.map(
        (item) => `${item._id}:${item.accountId}:${item.updatedAt}`
      ),
    ],
    queryFn: () => fetchLivePosts(liveConnections),
    enabled: Boolean(orgId && liveConnections.length > 0),
    staleTime: 60_000,
  });
  const analyticsQuery = useQuery({
    queryKey: [
      "post-analytics",
      orgId || "none",
      detailPost?.integration,
      detailPost?.externalId,
    ],
    queryFn: () =>
      fetchConnectionPostAnalytics(
        String(detailPost!.integration),
        detailPost!.externalId!
      ),
    enabled: can(detailPost, "analytics"),
    retry: false,
  });

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !postsQuery.hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !postsQuery.isFetchingNextPage) {
        postsQuery.fetchNextPage();
      }
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    postsQuery.hasNextPage,
    postsQuery.isFetchingNextPage,
    postsQuery.fetchNextPage,
  ]);

  const workspacePosts = useMemo(
    () => postsQuery.data?.pages.flatMap((page) => page.posts) || [],
    [postsQuery.data]
  );
  const scheduled = workspacePosts.filter(
    (post) => post.status === "scheduled"
  );
  const drafts = workspacePosts.filter(
    (post) => post.status !== "published" && post.status !== "scheduled"
  );
  const live = useMemo(() => {
    const combined: DisplayPost[] = [
      ...(liveQuery.data?.posts || []).filter((post) =>
        activeConnectionIds.has(String(post.integration))
      ),
      ...workspacePosts.filter(
        (post) =>
          post.status === "published" &&
          Boolean(post.integration) &&
          activeConnectionIds.has(String(post.integration))
      ),
    ];
    return combined.filter(
      (post, index) =>
        combined.findIndex((candidate) =>
          post.externalId && candidate.externalId
            ? post.externalId === candidate.externalId &&
              post.platform === candidate.platform &&
              String(post.integration || "") ===
                String(candidate.integration || "")
            : post._id === candidate._id
        ) === index
    );
  }, [activeConnectionIds, liveQuery.data, workspacePosts]);
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
        media: form.media,
        metadata: {
          youtubePlaylistId: form.youtubePlaylistId || undefined,
          youtubePlaylistTitle: form.youtubePlaylistTitle || undefined,
          youtubePlaylistDescription:
            form.youtubePlaylistDescription || undefined,
          youtubePlaylistPrivacyStatus: form.youtubePlaylistPrivacyStatus,
          youtubePrivacyStatus: form.youtubePrivacyStatus,
          youtubeMadeForKids: form.youtubeMadeForKids,
          campaignId: form.campaignId || undefined,
        },
        status: form.status === "published" ? "draft" : form.status,
        scheduledFor:
          form.status === "scheduled"
            ? scheduledPostIso(form.scheduledFor)
            : undefined,
      };
      if (editing) {
        if (editing.remote) {
          if (!can(editing, "updatePost"))
            throw new Error(
              `${LABEL[editing.platform] || editing.platform} posts cannot be edited after publishing.`
            );
          await updateConnectionPost(
            String(editing.integration),
            editing.externalId!,
            {
              content: form.content,
              ...(editing.title !== undefined ? { title: form.title } : {}),
            }
          );
          return [editing];
        }
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
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      queryClient.invalidateQueries({ queryKey: ["connected-social-posts"] });
      queryClient.invalidateQueries({ queryKey: ["gtm_campaigns"] });
      setEditorOpen(false);
      const count = result.length;
      toast({
        title:
          form.status === "published"
            ? `${count} post${count === 1 ? "" : "s"} published`
            : editing
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
    mutationFn: async (post: DisplayPost) => {
      // Published posts are removed from the platform itself (the server
      // also retires the workspace copy); drafts only exist in Genit.
      if (can(post, "deletePost")) {
        await deleteConnectionPost(String(post.integration), post.externalId!);
        return;
      }
      if (post.remote)
        throw new Error(
          `${LABEL[post.platform] || post.platform} does not allow deleting posts through its API.`
        );
      await deleteSocialPost(post._id);
    },
    onSuccess: (_result, post) => {
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      queryClient.invalidateQueries({ queryKey: ["connected-social-posts"] });
      if (detailPost?._id === post._id) setDetailPost(null);
      setDeleteTarget(null);
      toast({ title: "Post deleted" });
    },
    onError: (error: any) =>
      toast({
        title: "Could not delete post",
        description:
          error?.response?.data?.msg ||
          error?.response?.data?.message ||
          error.message,
        variant: "destructive",
      }),
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
    onError: (error: any) =>
      toast({
        title: "Could not generate text",
        description:
          error?.response?.data?.msg ||
          error?.response?.data?.message ||
          error.message,
        variant: "destructive",
      }),
  });

  function openDetail(post: DisplayPost, tab: DetailTab) {
    setDetailTab(tab);
    setDetailPost(post);
  }
  function openCreate(campaignId = "") {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      platforms: [],
      integrationIds: {},
      campaignId,
    });
    setEditorOpen(true);
  }

  // Deep link from a campaign: /visuals/posts?compose=1&campaignId=<id>
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("compose") !== "1") return;
    openCreate(url.searchParams.get("campaignId") || "");
    url.searchParams.delete("compose");
    url.searchParams.delete("campaignId");
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function openEdit(post: DisplayPost) {
    setEditing(post);
    setForm({
      title: post.title || "",
      content: post.content,
      mediaUrl: post.mediaUrl || "",
      media:
        post.media && post.media.length
          ? post.media
          : post.mediaUrl
            ? [{ url: post.mediaUrl, mimeType: post.mediaType }]
            : [],
      mediaType: post.mediaType || "",
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
      status: post.status === "failed" ? "draft" : post.status,
      scheduledFor: scheduledPostLocalValue(post.scheduledFor),
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
      campaignId:
        typeof post.metadata?.campaignId === "string"
          ? post.metadata.campaignId
          : "",
    });
    setEditorOpen(true);
  }
  const loading =
    integrationsLoading ||
    postsQuery.isLoading ||
    (view === "live" && (connectionsQuery.isLoading || liveQuery.isLoading));
  // Provider analytics can omit counts the post list already returned.
  const detailMetrics = analyticsQuery.data
    ? mergeMetrics(analyticsQuery.data, detailPost?.metrics)
    : detailPost?.metrics;
  const analyticsMetrics: Array<{
    label: string;
    value: number | undefined;
    icon: LucideIcon;
  }> = [
    {
      label: "Impressions",
      value:
        detailMetrics?.impressions,
      icon: Eye,
    },
    {
      label: "Views",
      value: detailMetrics?.views,
      icon: BarChart3,
    },
    {
      label: "Likes",
      value: detailMetrics?.likes,
      icon: Heart,
    },
    {
      label: "Comments",
      value: detailMetrics?.comments,
      icon: MessageCircle,
    },
    {
      label: "Shares",
      value: detailMetrics?.shares,
      icon: Share2,
    },
    {
      label: "Clicks",
      value: detailMetrics?.clicks,
      icon: MousePointerClick,
    },
  ];
  const analyticsChartData = analyticsMetrics.map(({ label, value }) => ({
    name: label,
    value: value || 0,
  }));
  const chartMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(24,24,27,0.55)";
  const chartGrid = isDark ? "rgba(255,255,255,0.06)" : "rgba(24,24,27,0.08)";
  const chartHover = isDark ? "rgba(255,255,255,0.04)" : "rgba(79,70,229,0.08)";

  return (
    <div className='animate-in fade-in flex min-h-[calc(100dvh-7rem)] w-full flex-col gap-5 rounded-lg bg-zinc-50 px-0 pb-14 text-zinc-950 duration-500 md:p-2 lg:p-6 lg:px-0 dark:bg-[#070707] dark:text-white'>
      <header className='p-1'>
        <div className='grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:items-center'>
          <div className='flex min-w-0 flex-col items-start justify-center py-1'>
            <div>
              <h1 className='font-instrument-serif text-2xl font-semibold tracking-tight'>
                <LocalizedText text={"Content workspace"} />
              </h1>
              <p className='mt-1 max-w-2xl text-sm leading-5 text-zinc-500 dark:text-white/55'>
                <LocalizedText
                  text={
                    "Create, schedule, and publish posts across all your social channels."
                  }
                />
              </p>
            </div>
            <Button
              onClick={() => openCreate()}
              className='mt-4 flex h-9 w-fit items-center gap-2 rounded-md px-4 text-sm disabled:opacity-50'
            >
              <LocalizedText text={"New Post"} />
              <Plus className='h-4 w-4' />
            </Button>
          </div>

          <div className='hidden rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:block dark:border-white/10 dark:bg-[#0c0c0c] dark:shadow-none'>
            <div className='flex items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-white/10'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/10'>
                  <BarChart3 className='h-4 w-4 text-zinc-500 dark:text-white/70' />
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>
                    <LocalizedText text={"Content overview"} />
                  </p>
                  <p className='truncate text-xs text-zinc-500 dark:text-white/50'>
                    {connected.length}{" "}
                    <LocalizedText text={"connected channel"} />
                    {connected.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              {/* <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2.5 py-1 text-[11px] font-medium ring-1",
                  connected.length
                    ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/15"
                    : "bg-white/10 text-white/60 ring-white/10"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-sm",
                    connected.length ? "bg-emerald-500" : "bg-zinc-400"
                  )}
                />
                {connected.length ? "Ready" : "Offline"}
              </span> */}
            </div>

            <div className='mt-3 grid grid-cols-3 gap-2'>
              {[
                {
                  label: "Drafts",
                  value: drafts.filter((post) => post.status === "draft")
                    .length,
                },
                { label: "Live", value: live.length },
                { label: "Scheduled", value: scheduled.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className='rounded-xl bg-zinc-50 px-3 py-2.5 ring-1 ring-zinc-200 dark:bg-white/[0.04] dark:ring-white/10'
                >
                  <p className='text-[11px] text-zinc-500 dark:text-white/50'>
                    {item.label}
                  </p>
                  <p className='mt-0.5 text-lg font-semibold'>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className='overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
        <div className='flex flex-col gap-3 border-b border-zinc-200 p-3 md:flex-row md:items-center md:justify-between dark:border-white/10'>
          <div className='grid w-full grid-cols-3 rounded-xl bg-zinc-100 p-1 md:inline-flex md:w-fit dark:bg-white/[0.06]'>
            {(
              [
                ["live", "Live", live.length],
                ["scheduled", "Scheduled", scheduled.length],
                ["drafts", "Drafts", drafts.length],
              ] as const
            ).map(([value, label, count]) => (
              <button
                key={value}
                onClick={() => setView(value)}
                className={cn(
                  "min-w-0 rounded-lg px-2.5 py-2 text-xs font-medium transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.98] sm:px-4",
                  view === value
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-950 dark:text-white/55 dark:hover:text-white"
                )}
              >
                {label}{" "}
                <span className='ml-1 tabular-nums opacity-50'>{count}</span>
              </button>
            ))}
          </div>
          <div className='grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 md:flex md:w-auto'>
            <div className='relative col-span-2 md:col-span-1'>
              <Search className='absolute top-3 left-3 h-4 w-4 text-zinc-400 dark:text-white/45' />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search posts'
                className='h-10 w-full rounded-xl border-zinc-200 bg-white pl-9 text-zinc-950 placeholder:text-zinc-400 md:w-56 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/35'
              />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className='h-10 w-full min-w-0 rounded-xl border-zinc-200 bg-white text-zinc-950 md:w-40 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>
                  <LocalizedText text={"All platforms"} />
                </SelectItem>
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
                className='h-10 w-10 shrink-0 rounded-xl border-zinc-200 bg-white text-zinc-700 transition-[background-color,transform] duration-150 hover:bg-zinc-100 active:scale-[0.96] dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10'
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

        {view === "live" && Boolean(liveQuery.data?.failures.length) && (
          <div className='mx-4 mt-4 space-y-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 md:mx-5 dark:text-amber-200'>
            {liveQuery.data?.failures.map((failure) => (
              <p key={failure.integrationId}>
                <span className='font-medium'>
                  {LABEL[failure.platform] || failure.platform} ·{" "}
                  {failure.accountName}:
                </span>{" "}
                {failure.message}
              </p>
            ))}
          </div>
        )}
        {loading ? (
          <div className='flex min-h-72 items-center justify-center text-zinc-500 dark:text-white/50'>
            <LoadingFileLoader size={24} />
          </div>
        ) : visible.length === 0 ? (
          <div className='flex min-h-72 flex-col items-center justify-center px-6 text-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/[0.06]'>
              {view === "drafts" ? (
                <FileText className='h-5 w-5 text-zinc-500 dark:text-white/50' />
              ) : view === "scheduled" ? (
                <CalendarClock className='h-5 w-5 text-zinc-500 dark:text-white/50' />
              ) : (
                <BarChart3 className='h-5 w-5 text-zinc-500 dark:text-white/50' />
              )}
            </div>
            <p className='mt-4 font-medium'>
              {view === "drafts"
                ? "No drafts yet"
                : view === "scheduled"
                  ? "Nothing scheduled"
                  : "No live posts found"}
            </p>
            <p className='mt-1 max-w-sm text-sm text-zinc-500 dark:text-white/50'>
              {view === "drafts"
                ? "Create a draft here, or generate content in chat and it will appear automatically."
                : view === "scheduled"
                  ? "Choose Scheduled while creating or editing a post to place it here."
                  : liveQuery.isError
                    ? liveQuery.error instanceof Error
                      ? liveQuery.error.message
                      : "Could not load posts from the connected accounts."
                    : connected.length
                      ? "No published posts were returned by the connected accounts."
                      : "Connect a social account to bring its live posts into this workspace."}
            </p>
            {view !== "live" && (
              <Button
                variant='outline'
                className='mt-5 rounded-md border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10'
                onClick={() => openCreate()}
              >
                <Plus className='mr-2 h-4 w-4' />
                <LocalizedText text={"New post"} />
              </Button>
            )}
          </div>
        ) : (
          <div className='columns-1 gap-4 p-4 md:columns-2 md:p-5 xl:columns-3'>
            {visible.map((post) => (
              <article
                key={post._id}
                className='group relative mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 align-top transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-[#0c0c0c] dark:hover:bg-white/[0.05]'
              >
                {(!post.remote ||
                  can(post, "updatePost") ||
                  can(post, "deletePost")) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className='absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/55 text-zinc-800 shadow-[0_6px_20px_rgba(0,0,0,0.12)] backdrop-blur-xl transition hover:border-white/80 hover:bg-white/75 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] dark:border-white/15 dark:bg-black/40 dark:text-white dark:hover:border-white/25 dark:hover:bg-black/55'
                        aria-label='Post actions'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='min-w-36'>
                      {((!post.remote && post.status !== "published") ||
                        can(post, "updatePost")) && (
                        <DropdownMenuItem onSelect={() => openEdit(post)}>
                          <Edit3 className='h-3.5 w-3.5' />
                          <LocalizedText text={"Edit"} />
                        </DropdownMenuItem>
                      )}
                      {(!post.remote || can(post, "deletePost")) && (
                        <DropdownMenuItem
                          onSelect={() => setDeleteTarget(post)}
                          className='text-red-600 focus:text-red-600'
                        >
                          <Trash2 className='h-3.5 w-3.5' />
                          <LocalizedText text={"Delete"} />
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {(post.thumbnailUrl || post.mediaUrl) && (
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
                  </div>
                )}
                <div className='p-4'>
                  {!post.thumbnailUrl && !post.mediaUrl && (
                    <div className='mb-4 flex min-h-8 items-center gap-2 pr-10'>
                      <span className='bg-muted rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize'>
                        {post.status}
                      </span>
                      {post.accountName && (
                        <span className='max-w-32 truncate text-[10px] text-zinc-500 dark:text-white/45'>
                          @{post.accountName}
                        </span>
                      )}
                    </div>
                  )}
                  <div className='flex items-center justify-between gap-3'>
                    <span className='flex items-center gap-2 text-xs font-medium'>
                      <PlatformIcon
                        platform={post.platform}
                        className='h-3.5 w-3.5'
                      />
                      {LABEL[post.platform]}
                    </span>
                    <span className='text-[10px] text-zinc-500 dark:text-white/45'>
                      {postDate(post)}
                    </span>
                  </div>
                  <h2 className='mt-3 line-clamp-1 text-sm font-semibold'>
                    {post.title || post.content || "Untitled post"}
                  </h2>
                  <p className='mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-zinc-500 dark:text-white/50'>
                    {post.content || "No caption yet"}
                  </p>
                  {view === "live" ? (
                    <div className='mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3 dark:border-white/10'>
                      <PostMetrics metrics={post.metrics || EMPTY_METRICS} />
                      <div className='flex items-center gap-3'>
                        {can(post, "listComments") && (
                          <button
                            onClick={() => openDetail(post, "comments")}
                            className='flex items-center gap-1 text-[11px] font-semibold text-zinc-600 dark:text-white/70'
                          >
                            <LocalizedText text={"Comments"} />
                            <MessageCircle className='h-3 w-3' />
                          </button>
                        )}
                        <button
                          onClick={() => openDetail(post, "analytics")}
                          className='flex items-center gap-1 text-[11px] font-semibold text-sky-300'
                        >
                          <LocalizedText text={"Analytics"} />
                          <BarChart3 className='h-3 w-3' />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
            {postsQuery.hasNextPage && (
              <div
                ref={loadMoreRef}
                className='text-muted-foreground flex h-12 break-inside-avoid items-center justify-center text-xs'
              >
                {postsQuery.isFetchingNextPage ? (
                  <LoadingFileLoader size={18} />
                ) : (
                  "Loading more..."
                )}
              </div>
            )}
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
        <DialogContent className='max-w-md overflow-hidden rounded-3xl border-0 bg-black/[0.02] p-5 shadow-none ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
          <GradientFrame />
          <div className='relative z-10 flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
            <div className='flex items-start gap-4'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-neutral-100 dark:bg-neutral-800'>
                <Trash2 className='h-5 w-5' />
              </div>
              <div>
                <DialogTitle className='text-foreground text-lg font-semibold tracking-tight dark:text-white'>
                  <LocalizedText text={"Delete Post"} />
                </DialogTitle>
                <p className='text-muted-foreground mt-2 text-sm dark:text-white/70'>
                  {can(deleteTarget, "deletePost") ? (
                    <>
                      <LocalizedText
                        text={"This permanently deletes the post from"}
                      />{" "}
                      <span className='text-foreground font-medium dark:text-white'>
                        {deleteTarget?.accountName ||
                          LABEL[deleteTarget?.platform || "facebook"]}
                      </span>
                      <LocalizedText text={". This action cannot be undone."} />
                    </>
                  ) : deleteTarget?.status === "published" ? (
                    <LocalizedText
                      text={
                        "This removes the post from Genit only. It stays live on the platform, which does not allow deleting it through its API."
                      }
                    />
                  ) : (
                    <LocalizedText
                      text={
                        "Are you sure you want to delete this post? This action cannot be undone."
                      }
                    />
                  )}
                </p>
              </div>
            </div>
            <div className='mt-2 flex justify-end gap-3 border-t border-black/5 pt-4 dark:border-white/10'>
              <button
                type='button'
                disabled={removeMutation.isPending}
                onClick={() => setDeleteTarget(null)}
                className='text-foreground px-4 py-2 text-sm font-medium ring-1 ring-black/10 transition'
              >
                <LocalizedText text={"Cancel"} />
              </button>
              <button
                type='button'
                disabled={removeMutation.isPending}
                onClick={() =>
                  deleteTarget && removeMutation.mutate(deleteTarget)
                }
                className='flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50'
              >
                {removeMutation.isPending ? <LoadingFileLoader /> : "Delete"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(detailPost)}
        onOpenChange={(open) => !open && setDetailPost(null)}
      >
        <DialogContent
          className='bg-background text-foreground flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-lg border border-black/10 p-0 shadow-2xl sm:max-w-3xl dark:border-white/[0.08] dark:bg-[#0c0c0e] dark:text-white'
          hideDialogClose
        >
          <DialogHeader className='relative border-b border-black/5 px-5 pt-4 pb-3 text-left dark:border-white/[0.05]'>
            <div className='flex items-center gap-2.5'>
              <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20'>
                <BarChart3 className='h-4 w-4' />
              </span>
              <div>
                <DialogTitle className='text-foreground text-sm font-semibold dark:text-white'>
                  <LocalizedText text={"Post details"} />
                </DialogTitle>
                <DialogDescription className='text-muted-foreground text-[11px]'>
                  <LocalizedText
                    text={"Performance and conversation for this post"}
                  />
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className='min-h-0 flex-1 overflow-y-auto px-5 py-4'>
            <div className='grid gap-4 lg:grid-cols-[1fr_1.4fr]'>
              {/* Left column: Post Preview Card */}
              <div className='flex flex-col gap-3 lg:border-r lg:border-black/5 lg:pr-4 dark:lg:border-white/[0.05]'>
                <div>
                  <h3 className='text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase'>
                    <LocalizedText text={"Post Details"} />
                  </h3>
                  <div className='group overflow-hidden rounded-xl border border-black/10 bg-black/[0.015] dark:border-white/[0.08] dark:bg-white/[0.02]'>
                    <div className='relative flex aspect-video w-full items-center justify-center overflow-hidden border-b border-black/5 bg-zinc-100 dark:border-white/[0.05] dark:bg-zinc-900'>
                      {detailPost && <MediaPreview post={detailPost} />}
                      <div className='absolute top-2 left-2 flex items-center gap-1.5'>
                        <span className='rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-semibold text-white/90 capitalize backdrop-blur'>
                          {detailPost?.status}
                        </span>
                        {detailPost?.accountName && (
                          <span className='max-w-28 truncate rounded-full bg-black/60 px-2 py-0.5 text-[9px] text-white/80 backdrop-blur'>
                            @{detailPost.accountName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='p-3'>
                      <div className='flex items-center justify-between gap-3'>
                        <span className='text-foreground flex items-center gap-2 text-xs font-medium dark:text-white/90'>
                          {detailPost && (
                            <PlatformIcon
                              platform={detailPost.platform}
                              className='h-3.5 w-3.5'
                            />
                          )}
                          {detailPost && LABEL[detailPost.platform]}
                        </span>
                        <span className='text-muted-foreground text-[10px]'>
                          {detailPost && postDate(detailPost)}
                        </span>
                      </div>
                      <h4 className='text-foreground mt-2 line-clamp-1 text-sm font-semibold dark:text-white'>
                        {detailPost?.title || "Untitled Post"}
                      </h4>
                      <p className='text-muted-foreground mt-1 line-clamp-3 text-xs leading-5'>
                        {detailPost?.content || "No caption"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: analytics or the comment thread */}
              <div className='space-y-4'>
                {can(detailPost, "listComments") && (
                  <div className='grid w-full grid-cols-2 rounded-lg bg-black/[0.04] p-1 dark:bg-white/[0.05]'>
                    {(["analytics", "comments"] as const).map((tab) => (
                      <button
                        key={tab}
                        type='button'
                        onClick={() => setDetailTab(tab)}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition",
                          detailTab === tab
                            ? "bg-white text-zinc-950 shadow-sm dark:bg-white/15 dark:text-white"
                            : "text-zinc-500 hover:text-zinc-800 dark:text-white/50 dark:hover:text-white"
                        )}
                      >
                        <LocalizedText text={tab} />
                      </button>
                    ))}
                  </div>
                )}
                {detailTab === "comments" &&
                detailPost?.integration &&
                detailPost.externalId &&
                can(detailPost, "listComments") ? (
                  <PostCommentsPanel
                    orgId={orgId}
                    integrationId={String(detailPost.integration)}
                    postId={detailPost.externalId}
                  />
                ) : analyticsQuery.isLoading ? (
                  <div className='flex h-48 items-center justify-center'>
                    <LoadingFileLoader />
                  </div>
                ) : (
                  <>
                    {analyticsQuery.isError && (
                      <div className='text-foreground/30 rounded-lg p-2.5 text-[11px]'>
                        <LocalizedText
                          text={
                            "Live analytics could not be refreshed. Showing the latest metrics supplied by the platform."
                          }
                        />
                      </div>
                    )}

                    <div>
                      <h3 className='text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase'>
                        <LocalizedText text={"Engagement"} />
                      </h3>
                      <div className='h-48 w-full rounded-xl border border-black/10 bg-black/[0.015] p-3 dark:border-white/[0.08] dark:bg-white/[0.02]'>
                        <ResponsiveContainer width='100%' height='100%'>
                          <BarChart
                            data={analyticsChartData}
                            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray='3 3'
                              vertical={false}
                              stroke={chartGrid}
                            />
                            <XAxis
                              dataKey='name'
                              axisLine={false}
                              tickLine={false}
                              tick={{
                                fontSize: 10,
                                fill: chartMuted,
                              }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              allowDecimals={false}
                              tickFormatter={(value) => compact(Number(value))}
                              tick={{
                                fontSize: 10,
                                fill: chartMuted,
                              }}
                            />
                            <Tooltip
                              cursor={{ fill: chartHover }}
                              formatter={(value) => [
                                Number(value).toLocaleString(),
                                "Total",
                              ]}
                              contentStyle={{
                                borderRadius: 10,
                                border: isDark
                                  ? "1px solid rgba(255,255,255,.1)"
                                  : "1px solid rgba(24,24,27,.12)",
                                background: isDark ? "#18181b" : "#fff",
                                color: isDark ? "#fff" : "#18181b",
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
                      <h3 className='text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase'>
                        <LocalizedText text={"Breakdown"} />
                      </h3>
                      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                        {analyticsMetrics.map(
                          ({ label, value, icon: Icon }) => (
                            <div
                              key={label}
                              className='rounded-lg border border-black/10 bg-black/[0.015] p-2.5 transition-all duration-200 hover:bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]'
                            >
                              <div className='text-muted-foreground flex items-center justify-between text-[11px]'>
                                <span>{label}</span>
                                <Icon className='h-3.5 w-3.5' />
                              </div>
                              <p className='text-foreground mt-1.5 text-lg font-semibold tracking-tight dark:text-white'>
                                {compact(value || 0)}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className='bg-background/95 gap-2 border-t border-black/5 px-5 py-3 sm:justify-between dark:border-white/[0.05] dark:bg-[#0c0c0e]/95'>
            {detailTab === "analytics" && can(detailPost, "analytics") ? (
              <Button
                variant='outline'
                onClick={() => analyticsQuery.refetch()}
                className='rounded-md border-none bg-transparent dark:hover:text-white'
              >
                <RefreshCw className='h-4 w-4' />
                <LocalizedText text={"Refresh"} />
              </Button>
            ) : (
              <span />
            )}
            {detailPost?.permalink && (
              <Button asChild className='rounded-md font-medium'>
                <a
                  href={detailPost.permalink}
                  target='_blank'
                  rel='noreferrer'
                >
                  <LocalizedText text={"View live post"} />
                  <ExternalLink className='h-4 w-4' />
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
