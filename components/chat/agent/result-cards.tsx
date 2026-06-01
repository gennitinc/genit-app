"use client";

import {
  BarChart3,
  CheckCircle2,
  ExternalLink,
  File as FileIcon,
  FileText,
  Folder,
  LayoutGrid,
  Mail,
  MessageSquare,
  Send,
  TrendingUp,
  Users,
  Download,
} from "lucide-react";
import { AgentCard } from "./agent-card";
import {
  AutomationNodeCreatedCard,
  AutomationNodesConnectedCard,
} from "./automation-cards";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProjectDesign } from "@/context/DesignProject";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const getFullUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = serverUrlSocket ? serverUrlSocket.replace(/\/$/, "") : "http://localhost:8000";
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
          <ExternalLinkInline href={url}>Open post</ExternalLinkInline>
        </div>
      )}
    </AgentCard>
  );
}

// ─── Post list (recent posts from a connected social) ───
export function PostListCard({ data }: { data: any }) {
  const items: any[] =
    data?.posts || data?.media || data?.tweets || data?.videos || data?.pins || [];
  return (
    <AgentCard
      icon={<FileText className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "post" : "posts"}`}
      meta={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>
          No posts found.
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {items.slice(0, 5).map((p, i) => (
            <li key={p.id || i} className='px-3.5 py-2.5'>
              <div className='text-foreground line-clamp-2 text-[12.5px] leading-relaxed'>
                {p.message || p.caption || p.text || p.title || "(no caption)"}
              </div>
              {(p.permalink_url || p.permalink || p.url) && (
                <div className='mt-1'>
                  <ExternalLinkInline
                    href={p.permalink_url || p.permalink || p.url}
                  >
                    Open
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
        <div className='text-muted-foreground text-[12.5px]'>No comments.</div>
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
          No metrics returned.
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
          Inbox is clear.
        </div>
      ) : (
        <ul className='divide-border/70 -mx-3.5 -my-3 divide-y dark:divide-white/10'>
          {items.slice(0, 5).map((m, i) => (
            <li key={m.id || i} className='px-3.5 py-2.5'>
              <div className='text-foreground line-clamp-1 text-[12.5px] font-medium'>
                {m.subject || "(no subject)"}
              </div>
              <div className='text-muted-foreground mt-0.5 line-clamp-1 text-[11.5px]'>
                <span className='text-foreground/80'>
                  {m.from || m.sender}
                </span>
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
        <div className='text-muted-foreground text-[12.5px]'>No files.</div>
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
        <div className='text-muted-foreground text-[12.5px]'>No campaigns.</div>
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
        <div className='text-muted-foreground text-[12.5px]'>No contacts.</div>
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
  const projectId = project?._id;

  const handleSetAsActive = async (itemId: string, generationGroupId: string) => {
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

  return (
    <AgentCard
      icon={isVideo ? <TrendingUp className="h-3.5 w-3.5" /> : <FileIcon className='h-3.5 w-3.5' />}
      title={isVideo ? 'Generated Video' : 'Generated Design'}
      tone='success'
      meta={
        downloadUrl ? (
          <a
            href={downloadUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground text-muted-foreground transition-colors"
            title="Download"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="h-3.5 w-3.5" />
          </a>
        ) : null
      }
    >
      <div className='text-foreground text-[13.5px] font-medium'>
        {data.name || "Design generated"}
      </div>
      {isVideo ? (
         <video src={getFullUrl(data.url)} controls className='border-border/70 mt-3 max-h-48 w-auto rounded-md border object-cover dark:border-white/10' />
      ) : (
         <img
           src={getFullUrl(data.url)}
           alt={data.name || 'Design'}
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
                if (setFocusedGenerationId) {
                  setFocusedGenerationId(null);
                  setTimeout(() => {
                    setFocusedGenerationId(cleanId);
                  }, 10);
                }
              }}
              className='border-primary/30 text-primary hover:bg-primary/5 h-7 w-fit gap-1.5 px-2 text-xs flex'
            >
              <LayoutGrid className='h-3 w-3' />
              View
            </Button>
          )}
          <ExternalLinkInline href={getFullUrl(data.url)}>Open {isVideo ? "Video" : "Image"}</ExternalLinkInline>
        </div>
      )}
    </AgentCard>
  );
}

// ─── Design Inspiration List ───
export function DesignInspirationCard({ data }: { data: any }) {
  const items: any[] = Array.isArray(data) ? data : (data?.pins || data?.inspirations || []);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  return (
    <AgentCard
      icon={<TrendingUp className='h-3.5 w-3.5' />}
      title={`${items.length} internet search ${items.length === 1 ? "inspiration" : "inspirations"}`}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-[12.5px]'>No inspirations found.</div>
      ) : (
        <div className='mt-2'>
          <Carousel
            opts={{ align: "start", loop: false }}
            className='group/carousel w-full'
          >
            <CarouselContent className='-ml-2'>
              {items.map((item, i) => (
                <CarouselItem key={item.id || i} className='basis-1/2 sm:basis-1/3 pl-2'>
                  <div
                    onClick={() => {
                      setPreviewIndex(i);
                      setIsPreviewOpen(true);
                    }}
                    className='group relative block aspect-square cursor-pointer overflow-hidden rounded-md border border-border/50 dark:border-white/10'
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
                <CarouselPrevious className='static h-6 w-6 translate-y-0 rounded-full border-border/50 bg-background/50 hover:bg-background/80' />
                <CarouselNext className='static h-6 w-6 translate-y-0 rounded-full border-border/50 bg-background/50 hover:bg-background/80' />
              </div>
            )}
          </Carousel>

          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className='flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-black p-0 shadow-2xl'>
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
                      <div className='mt-3 flex w-full items-center justify-center gap-4'>
                        <CarouselPrevious className='static size-7 translate-y-0 rounded-full border-none bg-white/10 text-white hover:bg-white/20' />
                        <div className='text-center'>
                          <p className='line-clamp-1 text-[11px] text-white/60'>
                            {item.alt || "Design Concept"}
                          </p>
                          <p className='mt-0.5 font-mono text-[9px] tracking-widest text-white/25'>
                            {idx + 1} / {items.length}
                          </p>
                        </div>
                        <CarouselNext className='static size-7 translate-y-0 rounded-full border-none bg-white/10 text-white hover:bg-white/20' />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </DialogContent>
          </Dialog>
        </div>
      )}
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
    default:
      return null;
  }
}
