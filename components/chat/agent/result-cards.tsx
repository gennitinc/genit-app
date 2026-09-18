"use client";

import { AgentCard } from "./agent-card";
import {
  AutomationNodeCreatedCard,
  AutomationNodesConnectedCard,
} from "./automation-cards";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useProjectDesign } from "@/context/DesignProject";
import { toast } from "@/hooks/use-toast";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import { templateApi } from "@/utils/inspire-api";
import {
  BarChart3,
  CheckCircle2,
  Download,
  ExternalLink,
  File as FileIcon,
  FileText,
  Folder,
  Forward,
  LayoutGrid,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getFullUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = serverUrlSocket
    ? serverUrlSocket.replace(/\/$/, "")
    : "http://localhost:8000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

// Tiny inline link with a trailing icon — consistent treatment across cards.
function ExternalLinkInline({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      className='text-foreground hover:text-foreground/80 inline-flex items-center gap-1 text-[12px] font-medium underline-offset-2 hover:underline'
    >
      {children}
      <ExternalLink className='h-3 w-3' />
    </a>
  );
}

// ─── Social post published (FB / IG / X / LI / Threads / TikTok / YT / Pinterest) ───
export function SocialPostPublishedCard({ data }: { data: any }) {
  const item = data?.actionItem;
  const url =
    item?.filePath ||
    item?.data?.permalink ||
    item?.data?.tweetUrl ||
    item?.data?.url ||
    data?.permalink;
  return (
    <AgentCard
      icon={<CheckCircle2 className='h-3.5 w-3.5' />}
      title={item?.name || "Post published"}
      meta={data?.account}
      tone='success'
    >
      {item?.text && (
        <div className='text-foreground line-clamp-3 text-[13.5px] leading-relaxed'>
          {item.text}
        </div>
      )}
      {item?.data?.mediaUrl && (
        <img
          src={item.data.mediaUrl}
          alt=''
          className='border-border/70 mt-3 max-h-48 w-auto rounded-md border object-cover dark:border-white/10'
        />
      )}
      {url && (
        <div className='mt-3'>
          <ExternalLinkInline href={url}>
            <LocalizedText text={"Open post"} />
          </ExternalLinkInline>
        </div>
      )}
    </AgentCard>
  );
}

// ─── Post list (recent posts from a connected social) ───
export function PostListCard({ data }: { data: any }) {
  const items: any[] =
    data?.posts ||
    data?.media ||
    data?.tweets ||
    data?.videos ||
    data?.playlists ||
    data?.items ||
    data?.pins ||
    [];
  const label = data?.playlists ? "playlist" : data?.items ? "item" : "post";
  return (
    <AgentCard
      icon={<FileText className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? label : `${label}s`}`}
      meta={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"No"} />
          {label}
          <LocalizedText text={"s found."} />
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {items.slice(0, 5).map((p, i) => (
            <li key={p.id || i} className='px-3.5 py-2.5'>
              <div className='text-foreground line-clamp-2 text-[12.5px] leading-relaxed'>
                {p.message ||
                  p.caption ||
                  p.text ||
                  p.title ||
                  p.snippet?.title ||
                  "(no title)"}
              </div>
              {(p.permalink_url || p.permalink || p.url) && (
                <div className='mt-1'>
                  <ExternalLinkInline
                    href={p.permalink_url || p.permalink || p.url}
                  >
                    <LocalizedText text={"Open"} />
                  </ExternalLinkInline>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </AgentCard>
  );
}

// ─── Comments list ───
export function CommentsListCard({ data }: { data: any }) {
  const items: any[] = data?.comments || data?.replies || [];
  return (
    <AgentCard
      icon={<MessageSquare className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "comment" : "comments"}`}
      meta={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"No comments."} />
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {items.slice(0, 5).map((c, i) => (
            <li key={c.id || i} className='px-3.5 py-2.5'>
              <div className='text-foreground text-[12.5px] font-medium'>
                {c.from?.name || c.username || c.author || "User"}
              </div>
              <div className='text-muted-foreground mt-0.5 line-clamp-2 text-[12.5px] leading-relaxed'>
                {c.message || c.text}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AgentCard>
  );
}

// ─── Insights / analytics ───
function formatMetricValue(v: unknown): string {
  if (typeof v === "number") return v.toLocaleString();
  if (typeof v === "string") return v;
  if (v === null || v === undefined) return "—";
  try {
    return JSON.stringify(v).slice(0, 40);
  } catch {
    return String(v);
  }
}

function humanizeKey(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

export function InsightsCard({ data }: { data: any }) {
  const metrics =
    data?.metrics || data?.insights || data?.stats || data?.report || data;
  const entries =
    typeof metrics === "object" && metrics
      ? Object.entries(metrics)
          .filter(([k]) => !["status", "actionItem", "account"].includes(k))
          .slice(0, 8)
      : [];
  return (
    <AgentCard
      icon={<TrendingUp className='h-3.5 w-3.5' />}
      title='Insights'
      meta={data?.account}
    >
      {entries.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"No metrics returned."} />
        </div>
      ) : (
        <dl className='grid grid-cols-2 gap-x-4 gap-y-3'>
          {entries.map(([k, v]) => (
            <div key={k} className='min-w-0'>
              <dt className='text-muted-foreground text-[10.5px] tracking-[0.04em] uppercase'>
                {humanizeKey(k)}
              </dt>
              <dd className='text-foreground mt-0.5 truncate text-[15px] font-semibold tabular-nums'>
                {formatMetricValue(v)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </AgentCard>
  );
}

// ─── Email sent ───
export function EmailSentCard({ data }: { data: any }) {
  const item = data?.actionItem;
  const d = item?.data || {};
  return (
    <AgentCard
      icon={<Send className='h-3.5 w-3.5' />}
      title='Email sent'
      meta={d.to || data?.to}
      tone='success'
    >
      {(d.subject || data?.subject) && (
        <div className='text-foreground text-[13.5px] font-medium'>
          {d.subject || data?.subject}
        </div>
      )}
      {(d.snippet || d.body) && (
        <div className='text-muted-foreground mt-1 line-clamp-3 text-[12.5px] leading-relaxed'>
          {d.snippet || d.body}
        </div>
      )}
    </AgentCard>
  );
}

// ─── Email list ───
export function EmailListCard({ data }: { data: any }) {
  const items: any[] = data?.messages || data?.emails || [];
  return (
    <AgentCard
      icon={<Mail className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "email" : "emails"}`}
      meta={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"Inbox is clear."} />
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {items.slice(0, 5).map((m, i) => (
            <li key={m.id || i} className='px-3.5 py-2.5'>
              <div className='text-foreground line-clamp-1 text-[12.5px] font-medium'>
                {m.subject || "(no subject)"}
              </div>
              <div className='text-muted-foreground mt-0.5 line-clamp-1 text-[11.5px]'>
                <span className='text-foreground/80'>{m.from || m.sender}</span>
                {(m.from || m.sender) && m.snippet ? " · " : ""}
                {m.snippet || ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AgentCard>
  );
}

// ─── Message sent (WhatsApp / Telegram) ───
export function MessageSentCard({ data }: { data: any }) {
  const item = data?.actionItem;
  const d = item?.data || {};
  return (
    <AgentCard
      icon={<Send className='h-3.5 w-3.5' />}
      title='Message sent'
      meta={d.recipient || d.chat || d.to}
      tone='success'
    >
      {(d.message || d.text) && (
        <div className='text-foreground line-clamp-3 text-[13.5px] leading-relaxed'>
          {d.message || d.text}
        </div>
      )}
    </AgentCard>
  );
}

// ─── Drive files ───
export function DriveFilesCard({ data }: { data: any }) {
  const items: any[] = data?.files || [];
  return (
    <AgentCard
      icon={<Folder className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "file" : "files"}`}
      meta={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"No files."} />
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {items.slice(0, 6).map((f, i) => (
            <li
              key={f.id || i}
              className='flex items-center gap-2.5 px-3.5 py-2'
            >
              <FileIcon className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
              <span className='text-foreground line-clamp-1 flex-1 text-[12.5px]'>
                {f.name}
              </span>
              {f.webViewLink && (
                <a
                  href={f.webViewLink}
                  target='_blank'
                  rel='noreferrer'
                  className='text-muted-foreground hover:text-foreground shrink-0'
                  aria-label='Open'
                >
                  <ExternalLink className='h-3.5 w-3.5' />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </AgentCard>
  );
}

export function GoogleFormCard({ data }: { data: any }) {
  const form = data?.result || data || {};
  const formUrl = form.formUrl || form.responderUri || form.url;
  const fieldCount = form.verifiedFieldCount ?? form.items?.length;

  return (
    <AgentCard
      icon={<FileText className='h-3.5 w-3.5' />}
      title={form.info?.title || "Google Form ready"}
      meta={
        typeof fieldCount === "number" ? `${fieldCount} fields` : data?.account
      }
      tone='success'
    >
      {formUrl ? (
        <ExternalLinkInline href={formUrl}>
          <LocalizedText text={"Open the form"} />
        </ExternalLinkInline>
      ) : (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"Google did not return a form link."} />
        </div>
      )}
    </AgentCard>
  );
}

// ─── Campaign list (Meta Ads / Google Ads / TikTok Ads / Snapchat / Brevo) ───
function statusDotClass(status?: string): string {
  const s = String(status || "").toLowerCase();
  if (s.includes("active") || s.includes("live") || s.includes("running"))
    return "bg-emerald-500";
  if (s.includes("pause")) return "bg-amber-500";
  if (s.includes("end") || s.includes("archive") || s.includes("delete"))
    return "bg-muted-foreground/50";
  return "bg-muted-foreground/40";
}

export function CampaignListCard({ data }: { data: any }) {
  const items: any[] = data?.campaigns || [];
  return (
    <AgentCard
      icon={<BarChart3 className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "campaign" : "campaigns"}`}
      meta={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"No campaigns."} />
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {items.slice(0, 6).map((c, i) => (
            <li
              key={c.id || i}
              className='flex items-center gap-2.5 px-3.5 py-2.5'
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDotClass(c.status)}`}
                aria-hidden
              />
              <div className='min-w-0 flex-1'>
                <div className='text-foreground line-clamp-1 text-[12.5px] font-medium'>
                  {c.name || c.campaign_name || "Untitled"}
                </div>
              </div>
              {c.status && (
                <span className='text-muted-foreground text-[10.5px] tracking-[0.04em] uppercase'>
                  {String(c.status).toLowerCase()}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </AgentCard>
  );
}

// ─── Contact list (Brevo) ───
export function ContactListCard({ data }: { data: any }) {
  const items: any[] = data?.contacts || [];
  return (
    <AgentCard
      icon={<Users className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "contact" : "contacts"}`}
      meta={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"No contacts."} />
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {items.slice(0, 6).map((c, i) => (
            <li key={c.id || i} className='px-3.5 py-2'>
              <div className='text-foreground line-clamp-1 text-[12.5px]'>
                {c.email || c.name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AgentCard>
  );
}

// ─── Generated Design/Video ───
export function GeneratedDesignCard({ data }: { data: any }) {
  const isVideo = data.url?.endsWith(".mp4") || data.message?.includes("video");
  const { project, setFocusedGenerationId } = useProjectDesign();
  const { user } = useUserContext();
  const router = useRouter();
  const projectId = project?._id;
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(
    data.publishStatus === "published" || data.isPublished
  );

  const handleSetAsActive = async (
    itemId: string,
    generationGroupId: string
  ) => {
    if (!projectId) return;
    try {
      const response = await apiResponse.post(
        `/projects/${projectId}/set-active-generation`,
        {
          generationGroupId,
          itemId,
        },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast({
          title: "Selection saved",
          description: "This version is now the active one for this card.",
        });
      } else {
        throw new Error(response.data?.message || "Failed to update selection");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const downloadUrl = data.url ? getFullUrl(data.url) : "";

  const handlePublishToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to publish to inspiration",
        variant: "destructive",
      });
      router.push("/signin");
      return;
    }

    if (!downloadUrl) return;

    try {
      setPublishing(true);
      if (published) {
        const response =
          await templateApi.unpublishFromInspiration(downloadUrl);
        if (!response.success) {
          throw new Error(response.message || "Failed to unpublish");
        }

        setPublished(false);
        window.dispatchEvent(
          new CustomEvent("template:unpublished", {
            detail: { mediaUrl: downloadUrl },
          })
        );
        toast({
          title: "Unpublished from inspiration",
          description:
            "This content has been removed from the inspiration gallery",
        });
        return;
      }

      const response = await templateApi.publishToInspiration({
        mediaUrl: downloadUrl,
        thumbnailUrl: downloadUrl,
        mediaType: isVideo ? "video" : "image",
        prompt: data.prompt || data.message || data.name || "",
        category: project?.category || "generic_design",
        title: data.name || (isVideo ? "Generated video" : "Generated design"),
      });

      if (
        response.success ||
        response.message?.toLowerCase().includes("already")
      ) {
        setPublished(true);
        const templatePayload = {
          id: response.data?.id || data.id || downloadUrl,
          src: downloadUrl,
          alt: data.name || data.prompt || data.message || "Generated design",
          category: response.data?.category || "generic_design",
          userId: {
            _id: (user as any)?._id || (user as any)?.id,
            username: (user as any)?.username,
            email: (user as any)?.email,
            profilePic: (user as any)?.userdp || (user as any)?.profilePic,
            isVerified: (user as any)?.isVerified,
          },
          author: (user as any)?.username,
          isUserGenerated: true,
          isPendingPublished: true,
        };

        // Fire in-page event (works when templateGridAll is already mounted)
        window.dispatchEvent(
          new CustomEvent("template:published", {
            detail: { template: templatePayload },
          })
        );

        // Also persist to localStorage so templateGridAll picks it up on next
        // mount (e.g. when user navigates to the inspiration/home page).
        try {
          const existing = JSON.parse(
            localStorage.getItem("gennit:pending_published_templates") || "[]"
          );
          const merged = Array.isArray(existing) ? existing : [];
          if (!merged.some((t: any) => t.src === templatePayload.src)) {
            merged.unshift(templatePayload);
          }
          localStorage.setItem(
            "gennit:pending_published_templates",
            JSON.stringify(merged)
          );
        } catch {
          // ignore storage errors
        }

        toast({
          title: response.success
            ? "Published to inspiration"
            : "Already published",
          description: response.success
            ? "Your content has been added to the inspiration gallery"
            : "This content has already been published to inspiration",
        });
        return;
      }

      throw new Error(response.message || "Failed to publish");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "";
      if (err?.response?.status === 409 || message.includes("already")) {
        setPublished(true);
        toast({
          title: "Already published",
          description: "This content has already been published to inspiration",
        });
      } else {
        toast({
          title: "Publish failed",
          description:
            err?.code === "ECONNABORTED"
              ? "The server did not respond. Please try again."
              : message ||
                `Failed to ${published ? "unpublish from" : "publish to"} inspiration. Please try again.`,
          variant: "destructive",
        });
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AgentCard
      icon={
        isVideo ? (
          <TrendingUp className='h-3.5 w-3.5' />
        ) : (
          <FileIcon className='h-3.5 w-3.5' />
        )
      }
      title={isVideo ? "Generated Video" : "Generated Design"}
      tone='success'
      meta={
        downloadUrl ? (
          <a
            href={downloadUrl}
            download
            target='_blank'
            rel='noreferrer'
            className='hover:text-foreground text-muted-foreground transition-colors'
            title='Download'
            onClick={(e) => e.stopPropagation()}
          >
            <Download className='h-3.5 w-3.5' />
          </a>
        ) : null
      }
    >
      <div className='text-foreground text-[13.5px] font-medium'>
        {data.name || "Design generated"}
      </div>
      {isVideo ? (
        <video
          src={getFullUrl(data.url)}
          controls
          className='border-border/70 mt-3 max-h-48 w-auto rounded-md border object-cover dark:border-white/10'
        />
      ) : (
        <img
          src={getFullUrl(data.url)}
          alt={data.name || "Design"}
          className='border-border/70 mt-3 max-h-48 w-auto rounded-md border object-cover dark:border-white/10'
        />
      )}
      {data.url && (
        <div className='mt-3 flex items-center gap-3'>
          {!isVideo && (
            <Button
              variant='outline'
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                const cleanId = data.id || data.url;
                if (data.id && data.generationGroupId) {
                  handleSetAsActive(data.id, data.generationGroupId);
                }
                setFocusedGenerationId?.(cleanId);
              }}
              className='border-primary/30 text-primary flex h-7 w-fit gap-1.5 px-2 text-xs hover:bg-indigo-600 hover:bg-indigo-700/5'
            >
              <LayoutGrid className='h-3 w-3' />
              <LocalizedText text={"View"} />
            </Button>
          )}
          <Button
            variant='outline'
            size='sm'
            onClick={handlePublishToggle}
            disabled={publishing}
            className='h-7 w-fit gap-1.5 px-2 text-xs'
          >
            {publishing ? (
              <LoadingFileLoader size={12} />
            ) : published ? (
              <CheckCircle2 className='h-3 w-3' />
            ) : (
              <Forward className='h-3 w-3' />
            )}
            {publishing
              ? published
                ? "Unpublishing..."
                : "Publishing..."
              : published
                ? "Published 🎉"
                : "Publish"}
          </Button>
          <ExternalLinkInline href={getFullUrl(data.url)}>
            <LocalizedText text={"Open"} />
            {isVideo ? "Video" : "Image"}
          </ExternalLinkInline>
        </div>
      )}
    </AgentCard>
  );
}

// ─── Design Inspiration List ───
export function DesignInspirationCard({ data }: { data: any }) {
  const items: any[] = Array.isArray(data)
    ? data
    : data?.pins || data?.inspirations || [];
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  return (
    <AgentCard
      icon={<TrendingUp className='h-3.5 w-3.5' />}
      title={`${items.length} internet search ${items.length === 1 ? "inspiration" : "inspirations"}`}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"No inspirations found."} />
        </div>
      ) : (
        <div className='mt-2'>
          <Carousel
            opts={{ align: "start", loop: false }}
            className='group/carousel w-full'
          >
            <CarouselContent className='-ml-2'>
              {items.map((item, i) => (
                <CarouselItem
                  key={item.id || i}
                  className='basis-1/2 pl-2 sm:basis-1/3'
                >
                  <div
                    onClick={() => {
                      setPreviewIndex(i);
                      setIsPreviewOpen(true);
                    }}
                    className='group border-border/50 relative block aspect-square cursor-pointer overflow-hidden rounded-md border dark:border-white/10'
                  >
                    <img
                      src={item.image}
                      alt={item.alt || "Design inspiration"}
                      className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {items.length > 2 && (
              <div className='mt-2 flex justify-end gap-1.5 opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100'>
                <CarouselPrevious className='border-border/50 bg-background/50 hover:bg-background/80 static h-6 w-6 translate-y-0 rounded-full' />
                <CarouselNext className='border-border/50 bg-background/50 hover:bg-background/80 static h-6 w-6 translate-y-0 rounded-full' />
              </div>
            )}
          </Carousel>

          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className='flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-white/10 bg-black p-0 shadow-2xl'>
              <Carousel
                opts={{ loop: true, align: "center", startIndex: previewIndex }}
                className='flex min-h-0 flex-1 flex-col'
              >
                <CarouselContent className='ml-0 h-full flex-1'>
                  {items.map((item, idx) => (
                    <CarouselItem
                      key={`preview-${idx}`}
                      className='flex h-full basis-full flex-col items-center justify-center p-6 pb-4'
                    >
                      <div className='relative flex min-h-0 w-full flex-1 items-center justify-center'>
                        <img
                          src={item.image}
                          alt={item.alt || "Design inspiration"}
                          className='max-h-full max-w-full rounded-xl object-contain shadow-2xl'
                          style={{ maxHeight: "calc(88vh - 120px)" }}
                        />
                      </div>
                      <div className='mt-3 flex w-full items-center justify-center'>
                        <div className='text-center'>
                          <p className='line-clamp-1 text-[11px] text-white/60'>
                            {item.alt || "Design Concept"}
                          </p>
                          <p className='mt-0.5 font-mono text-[9px] tracking-widest text-white/25'>
                            {idx + 1} / {items.length}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='absolute top-1/2 left-4 z-10 size-9 -translate-y-1/2 rounded-full border-none bg-black/55 text-white backdrop-blur-sm hover:bg-black/75' />
                <CarouselNext className='absolute top-1/2 right-4 z-10 size-9 -translate-y-1/2 rounded-full border-none bg-black/55 text-white backdrop-blur-sm hover:bg-black/75' />
              </Carousel>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </AgentCard>
  );
}

export function GtmCampaignCard({ data }: { data: any }) {
  const campaign = data?.campaign || data?.campaigns?.[0] || data;
  const campaigns = data?.campaigns || (campaign?._id ? [campaign] : []);
  return (
    <AgentCard
      icon={<Target className='h-3.5 w-3.5' />}
      title={campaigns.length > 1 ? "GTM campaigns" : "GTM campaign"}
      tone='success'
      meta={
        campaigns.length > 1 ? `${campaigns.length} total` : campaign?.status
      }
    >
      {campaigns.slice(0, 4).map((item: any) => (
        <div
          key={item._id || item.name}
          className='border-border/70 border-b py-2 last:border-b-0 dark:border-white/10'
        >
          <div className='text-foreground text-[13.5px] font-medium'>
            {item.name}
          </div>
          <p className='text-muted-foreground mt-1 line-clamp-2 text-[12.5px]'>
            {item.objective || item.plan?.summary}
          </p>
          {campaigns.length === 1 && (
            <div className='mt-3 space-y-3 text-[12.5px]'>
              <dl className='grid grid-cols-2 gap-x-4 gap-y-2'>
                {[
                  ["Audience", item.audience],
                  ["Offer", item.offer],
                  ["Timeline", item.timeline],
                  ["Success", item.successMetric],
                  ["Channels", item.channels?.join(", ")],
                  ["Budget", item.budget != null ? `$${item.budget}` : null],
                ]
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt className='text-muted-foreground text-[10.5px] uppercase'>
                        {label}
                      </dt>
                      <dd className='text-foreground mt-0.5'>{value}</dd>
                    </div>
                  ))}
              </dl>

              {item.research?.summary && (
                <div>
                  <div className='text-foreground font-medium'>Research</div>
                  <p className='text-muted-foreground mt-1 leading-relaxed'>
                    {item.research.summary}
                  </p>
                  {item.research.sources?.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-x-3 gap-y-1'>
                      {item.research.sources
                        .slice(0, 4)
                        .map((source: any, index: number) => (
                          <ExternalLinkInline
                            key={`${source.url}-${index}`}
                            href={source.url}
                          >
                            {source.title}
                          </ExternalLinkInline>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {item.plan?.funnel?.length > 0 && (
                <div>
                  <div className='text-foreground font-medium'>
                    Campaign plan
                  </div>
                  <ol className='mt-1.5 space-y-1.5'>
                    {item.plan.funnel.map((stage: any) => (
                      <li key={stage.stage}>
                        <span className='text-foreground'>{stage.stage}:</span>{" "}
                        <span className='text-muted-foreground'>
                          {stage.goal}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </AgentCard>
  );
}

export function GtmLeadsCard({ data }: { data: any }) {
  const leads: any[] = data?.leads || [];
  return (
    <AgentCard
      icon={<Users className='h-3.5 w-3.5' />}
      title={`${leads.length} ${leads.length === 1 ? "lead" : "leads"}`}
      meta={data?.provider}
      tone='success'
    >
      {leads.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"No leads found."} />
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {leads.slice(0, 6).map((lead, i) => (
            <li key={lead._id || lead.email || i} className='px-3.5 py-2.5'>
              <div className='text-foreground text-[12.5px] font-medium'>
                {lead.fullName || lead.email}
              </div>
              <div className='text-muted-foreground mt-0.5 text-[12px]'>
                {[lead.title, lead.company, lead.email]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AgentCard>
  );
}

export function GtmOutboundCard({ data }: { data: any }) {
  const jobs: any[] = data?.jobs || [];
  const recipients: any[] = data?.recipients || [];
  const stats = data?.stats || {};
  const scheduled = data?.scheduled ?? stats.scheduled ?? jobs.length;
  const imported = stats.imported ?? recipients.length;
  return (
    <AgentCard
      icon={<Mail className='h-3.5 w-3.5' />}
      title={scheduled > 0 ? "Campaign outreach" : "Campaign recipients"}
      meta={`${scheduled || imported} ${scheduled > 0 ? "scheduled" : "ready"}`}
      tone='success'
    >
      <div className='grid grid-cols-2 gap-2 text-[12.5px]'>
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className='rounded-md border px-2.5 py-2'>
            <div className='text-muted-foreground capitalize'>{label}</div>
            <div className='text-foreground mt-0.5 font-semibold'>
              {String(value)}
            </div>
          </div>
        ))}
      </div>
      {data?.rejected?.length > 0 && (
        <p className='text-muted-foreground mt-2 text-[12px]'>
          {data.rejected.length} recipient(s) were skipped; their reasons remain
          available in this campaign’s chat history.
        </p>
      )}
    </AgentCard>
  );
}

export function GtmAttributionCard({ data }: { data: any }) {
  const metrics = data?.metrics || data?.attribution?.metrics || {};
  const conversionValue =
    data?.conversionValue ?? data?.attribution?.conversionValue ?? 0;
  const roi = data?.roi ?? data?.attribution?.roi;
  return (
    <AgentCard
      icon={<BarChart3 className='h-3.5 w-3.5' />}
      title='GTM attribution'
      meta={data?.campaign?.name}
      tone='success'
    >
      <dl className='grid grid-cols-2 gap-x-4 gap-y-3'>
        {[
          ["Clicks", metrics.clicks || 0],
          ["Conversions", data?.conversions || 0],
          ["Value", `$${conversionValue}`],
          ["ROI", roi == null ? "n/a" : `${Math.round(roi * 100)}%`],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className='text-muted-foreground text-[10.5px] tracking-[0.04em] uppercase'>
              {label}
            </dt>
            <dd className='text-foreground mt-0.5 text-[15px] font-semibold'>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </AgentCard>
  );
}

export function GtmOptimizerCard({ data }: { data: any }) {
  const recommendations: any[] =
    data?.recommendations || data?.campaign?.recommendations || [];
  return (
    <AgentCard
      icon={<Sparkles className='h-3.5 w-3.5' />}
      title='Optimizer recommendations'
      meta={`${recommendations.length} new`}
      tone='success'
    >
      {recommendations.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          <LocalizedText text={"No new recommendations."} />
        </div>
      ) : (
        <ul className='space-y-2'>
          {recommendations.slice(0, 4).map((rec, i) => (
            <li key={`${rec.title}-${i}`} className='text-[12.5px]'>
              <span className='text-foreground font-medium'>{rec.title}</span>
              <span className='text-muted-foreground'> — {rec.action}</span>
            </li>
          ))}
        </ul>
      )}
    </AgentCard>
  );
}

export function GtmPdfReportCard({ data }: { data: any }) {
  const report = data?.report || data;
  const url = getFullUrl(report?.url || "");
  const { setArtifactPreview } = useProjectDesign();
  const showPreview = () =>
    setArtifactPreview({
      type: "document",
      title: report?.campaignName || "GTM campaign report",
      url,
      downloadUrl: url,
      fileName: report?.fileName,
    });

  useEffect(() => {
    if (url) showPreview();
  }, [url]);

  return (
    <AgentCard
      icon={<FileText className='h-3.5 w-3.5' />}
      title='PDF report ready'
      meta={report?.campaignName}
      tone='success'
    >
      <div className='flex flex-wrap items-center gap-2'>
        {url && (
          <>
            <Button
              variant='outline'
              size='sm'
              className='h-7 px-2 text-xs'
              onClick={showPreview}
            >
              <ExternalLink className='h-3 w-3' />
              <LocalizedText text={"View"} />
            </Button>
            <Button
              asChild
              variant='outline'
              size='sm'
              className='h-7 px-2 text-xs'
            >
              <a href={url} download>
                <Download className='h-3 w-3' />
                <LocalizedText text={"Download"} />
              </a>
            </Button>
          </>
        )}
      </div>
    </AgentCard>
  );
}

export function ResearchReportCard({ data }: { data: any }) {
  const report = data?.report || data;
  const previewUrl = getFullUrl(report?.previewUrl || "");
  const pdfUrl = getFullUrl(report?.pdfUrl || "");
  const { setArtifactPreview } = useProjectDesign();
  const showPreview = () =>
    setArtifactPreview({
      type: "document",
      title: report?.title || "Research report",
      url: previewUrl,
      downloadUrl: pdfUrl,
      fileName: report?.fileName,
    });

  useEffect(() => {
    if (previewUrl) showPreview();
  }, [previewUrl]);

  return (
    <AgentCard
      icon={<FileText className='h-3.5 w-3.5' />}
      title={report?.title || "Research report"}
      meta='Document and PDF'
      tone='success'
    >
      <div className='flex flex-wrap items-center gap-2'>
        {previewUrl && (
          <Button
            variant='outline'
            size='sm'
            className='h-7 px-2 text-xs'
            onClick={showPreview}
          >
            <ExternalLink className='h-3 w-3' />
            <LocalizedText text={"View report"} />
          </Button>
        )}
        {pdfUrl && (
          <Button
            asChild
            variant='outline'
            size='sm'
            className='h-7 px-2 text-xs'
          >
            <a href={pdfUrl} download={report?.fileName}>
              <Download className='h-3 w-3' />
              <LocalizedText text={"Download PDF"} />
            </a>
          </Button>
        )}
      </div>
    </AgentCard>
  );
}

export function DocumentArtifactCard({ data }: { data: any }) {
  const artifact = data?.artifact || data;
  const previewUrl = getFullUrl(
    artifact?.previewUrl || artifact?.fileUrl || ""
  );
  const fileUrl = getFullUrl(artifact?.fileUrl || "");
  const { setArtifactPreview } = useProjectDesign();
  const showPreview = () =>
    setArtifactPreview({
      type: "document",
      title: artifact?.title || "Document",
      url: previewUrl,
      downloadUrl: fileUrl,
      fileName: artifact?.fileName,
    });

  useEffect(() => {
    if (previewUrl) showPreview();
  }, [previewUrl]);

  return (
    <AgentCard
      icon={<FileText className='h-3.5 w-3.5' />}
      title={artifact?.title || "Document"}
      meta={`${String(artifact?.format || "file").toUpperCase()} · v${artifact?.version || 1}`}
      tone='success'
    >
      <div className='flex flex-wrap items-center gap-2'>
        {previewUrl && (
          <Button
            variant='outline'
            size='sm'
            className='h-7 px-2 text-xs'
            onClick={showPreview}
          >
            <ExternalLink className='h-3 w-3' />
            <LocalizedText text={"View"} />
          </Button>
        )}
        {fileUrl && (
          <Button
            asChild
            variant='outline'
            size='sm'
            className='h-7 px-2 text-xs'
          >
            <a href={fileUrl} download={artifact?.fileName}>
              <Download className='h-3 w-3' />
              <LocalizedText text={"Download"} />
            </a>
          </Button>
        )}
      </div>
    </AgentCard>
  );
}

export function DocumentListCard({ data }: { data: any }) {
  const artifacts: any[] = data?.artifacts || [];
  return (
    <AgentCard
      icon={<FileText className='h-3.5 w-3.5' />}
      title='Documents'
      meta={`${artifacts.length} recent`}
    >
      <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
        {artifacts.slice(0, 10).map((artifact) => (
          <li
            key={artifact._id}
            className='flex items-center justify-between gap-3 px-3.5 py-2.5'
          >
            <span className='min-w-0 truncate text-[12.5px] font-medium'>
              {artifact.title}
            </span>
            <span className='text-muted-foreground shrink-0 text-[11px] uppercase'>
              {artifact.format} <LocalizedText text={"· v"} />
              {artifact.version}
            </span>
          </li>
        ))}
      </ul>
    </AgentCard>
  );
}

// ─── Dispatcher: pick the right card for a render hint ───
export function renderToolResult(
  hint: string | undefined,
  data: any
): React.ReactNode | null {
  switch (hint) {
    case "social_post_published":
      return <SocialPostPublishedCard data={data} />;
    case "post_list":
      return <PostListCard data={data} />;
    case "comments_list":
      return <CommentsListCard data={data} />;
    case "insights":
      return <InsightsCard data={data} />;
    case "campaign_list":
    case "campaign_created":
      return <CampaignListCard data={data} />;
    case "email_sent":
      return <EmailSentCard data={data} />;
    case "email_list":
    case "email_detail":
    case "email_events":
      return <EmailListCard data={data} />;
    case "message_sent":
      return <MessageSentCard data={data} />;
    case "drive_files":
    case "drive_file_detail":
      return <DriveFilesCard data={data} />;
    case "google_form":
      return <GoogleFormCard data={data} />;
    case "contact_list":
    case "contact_created":
      return <ContactListCard data={data} />;
    case "automation_node_created":
      return <AutomationNodeCreatedCard data={data} />;
    case "automation_nodes_connected":
      return <AutomationNodesConnectedCard data={data} />;
    case "generated_design":
      return <GeneratedDesignCard data={data} />;
    case "design_inspiration":
      return <DesignInspirationCard data={data} />;
    case "gtm_campaign":
    case "gtm_campaign_list":
      return <GtmCampaignCard data={data} />;
    case "gtm_leads":
      return <GtmLeadsCard data={data} />;
    case "gtm_outbound":
      return <GtmOutboundCard data={data} />;
    case "gtm_attribution":
      return <GtmAttributionCard data={data} />;
    case "gtm_optimizer":
      return <GtmOptimizerCard data={data} />;
    case "gtm_pdf_report":
      return <GtmPdfReportCard data={data} />;
    case "research_report":
      return <ResearchReportCard data={data} />;
    case "document_artifact":
      return <DocumentArtifactCard data={data} />;
    case "document_list":
      return <DocumentListCard data={data} />;
    default:
      return null;
  }
}
