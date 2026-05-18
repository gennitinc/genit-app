"use client";

import {
  BarChart3,
  CheckCircle2,
  ExternalLink,
  File as FileIcon,
  FileText,
  Folder,
  Mail,
  MessageSquare,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";

// Shared "card" frame so every result has consistent chrome.
function CardFrame({
  icon,
  title,
  account,
  children,
  accent = "text-blue-500",
}: {
  icon: React.ReactNode;
  title: string;
  account?: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className='border-border bg-card/40 my-2 overflow-hidden rounded-md border dark:border-white/10 dark:bg-white/[0.02]'>
      <div className='border-border bg-card/60 flex items-center gap-2 border-b px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]'>
        <span className={`h-3.5 w-3.5 ${accent}`}>{icon}</span>
        <span className='text-xs font-medium'>{title}</span>
        {account && (
          <span className='text-muted-foreground ml-auto text-[10px]'>
            {account}
          </span>
        )}
      </div>
      <div className='px-3 py-2.5'>{children}</div>
    </div>
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
    <CardFrame
      icon={<CheckCircle2 className='h-3.5 w-3.5' />}
      title={item?.name || "Post published"}
      account={data?.account}
      accent='text-emerald-500'
    >
      {item?.text && (
        <div className='text-foreground line-clamp-3 text-sm'>{item.text}</div>
      )}
      {item?.data?.mediaUrl && (
        <img
          src={item.data.mediaUrl}
          alt=''
          className='mt-2 max-h-48 w-auto rounded-md object-cover'
        />
      )}
      {url && (
        <a
          href={url}
          target='_blank'
          rel='noreferrer'
          className='mt-2 inline-flex items-center gap-1 text-xs text-blue-500 hover:underline'
        >
          Open <ExternalLink className='h-3 w-3' />
        </a>
      )}
    </CardFrame>
  );
}

// ─── Post list (recent posts from a connected social) ───
export function PostListCard({ data }: { data: any }) {
  const items: any[] =
    data?.posts || data?.media || data?.tweets || data?.videos || data?.pins || [];
  return (
    <CardFrame
      icon={<FileText className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "post" : "posts"}`}
      account={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-xs'>No posts found.</div>
      ) : (
        <ul className='divide-border divide-y dark:divide-white/10'>
          {items.slice(0, 5).map((p, i) => (
            <li key={p.id || i} className='py-1.5'>
              <div className='text-foreground line-clamp-2 text-xs'>
                {p.message || p.caption || p.text || p.title || "(no caption)"}
              </div>
              {(p.permalink_url || p.permalink || p.url) && (
                <a
                  href={p.permalink_url || p.permalink || p.url}
                  target='_blank'
                  rel='noreferrer'
                  className='text-[10px] text-blue-500 hover:underline'
                >
                  Open
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}

// ─── Comments list ───
export function CommentsListCard({ data }: { data: any }) {
  const items: any[] = data?.comments || data?.replies || [];
  return (
    <CardFrame
      icon={<MessageSquare className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "comment" : "comments"}`}
      account={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-xs'>No comments.</div>
      ) : (
        <ul className='divide-border space-y-1.5 divide-y dark:divide-white/10'>
          {items.slice(0, 5).map((c, i) => (
            <li key={c.id || i} className='pt-1.5 first:pt-0'>
              <div className='text-foreground text-xs font-medium'>
                {c.from?.name || c.username || c.author || "User"}
              </div>
              <div className='text-muted-foreground line-clamp-2 text-xs'>
                {c.message || c.text}
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}

// ─── Insights / analytics ───
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
    <CardFrame
      icon={<TrendingUp className='h-3.5 w-3.5' />}
      title='Insights'
      account={data?.account}
      accent='text-violet-500'
    >
      {entries.length === 0 ? (
        <div className='text-muted-foreground text-xs'>No metrics returned.</div>
      ) : (
        <dl className='grid grid-cols-2 gap-2'>
          {entries.map(([k, v]) => (
            <div key={k}>
              <dt className='text-muted-foreground text-[10px] uppercase tracking-wide'>
                {k}
              </dt>
              <dd className='text-foreground text-sm font-medium'>
                {typeof v === "number"
                  ? v.toLocaleString()
                  : typeof v === "string"
                    ? v
                    : JSON.stringify(v).slice(0, 40)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </CardFrame>
  );
}

// ─── Email sent ───
export function EmailSentCard({ data }: { data: any }) {
  const item = data?.actionItem;
  const d = item?.data || {};
  return (
    <CardFrame
      icon={<Send className='h-3.5 w-3.5' />}
      title={`Email sent · ${d.to || data?.to || "recipient"}`}
      account={data?.account}
      accent='text-emerald-500'
    >
      {(d.subject || data?.subject) && (
        <div className='text-foreground text-sm font-medium'>
          {d.subject || data?.subject}
        </div>
      )}
      {(d.snippet || d.body) && (
        <div className='text-muted-foreground mt-1 line-clamp-3 text-xs'>
          {d.snippet || d.body}
        </div>
      )}
    </CardFrame>
  );
}

// ─── Email list ───
export function EmailListCard({ data }: { data: any }) {
  const items: any[] = data?.messages || data?.emails || [];
  return (
    <CardFrame
      icon={<Mail className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "email" : "emails"}`}
      account={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-xs'>Inbox is clear.</div>
      ) : (
        <ul className='divide-border divide-y dark:divide-white/10'>
          {items.slice(0, 5).map((m, i) => (
            <li key={m.id || i} className='py-1.5'>
              <div className='text-foreground line-clamp-1 text-xs font-medium'>
                {m.subject || "(no subject)"}
              </div>
              <div className='text-muted-foreground line-clamp-1 text-[11px]'>
                {m.from || m.sender} · {m.snippet || ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}

// ─── Message sent (WhatsApp / Telegram) ───
export function MessageSentCard({ data }: { data: any }) {
  const item = data?.actionItem;
  const d = item?.data || {};
  return (
    <CardFrame
      icon={<Send className='h-3.5 w-3.5' />}
      title={`Sent · ${d.recipient || d.chat || d.to || "chat"}`}
      account={data?.account}
      accent='text-emerald-500'
    >
      {(d.message || d.text) && (
        <div className='text-foreground line-clamp-3 text-sm'>
          {d.message || d.text}
        </div>
      )}
    </CardFrame>
  );
}

// ─── Drive files ───
export function DriveFilesCard({ data }: { data: any }) {
  const items: any[] = data?.files || [];
  return (
    <CardFrame
      icon={<Folder className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "file" : "files"}`}
      account={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-xs'>No files.</div>
      ) : (
        <ul className='divide-border divide-y dark:divide-white/10'>
          {items.slice(0, 6).map((f, i) => (
            <li key={f.id || i} className='flex items-center gap-2 py-1.5'>
              <FileIcon className='text-muted-foreground h-3 w-3' />
              <span className='text-foreground line-clamp-1 flex-1 text-xs'>
                {f.name}
              </span>
              {f.webViewLink && (
                <a
                  href={f.webViewLink}
                  target='_blank'
                  rel='noreferrer'
                  className='text-muted-foreground hover:text-foreground'
                  aria-label='Open'
                >
                  <ExternalLink className='h-3 w-3' />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}

// ─── Campaign list (Meta Ads / Google Ads / TikTok Ads / Snapchat / Brevo) ───
export function CampaignListCard({ data }: { data: any }) {
  const items: any[] = data?.campaigns || [];
  return (
    <CardFrame
      icon={<BarChart3 className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "campaign" : "campaigns"}`}
      account={data?.account}
      accent='text-amber-500'
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-xs'>No campaigns.</div>
      ) : (
        <ul className='divide-border divide-y dark:divide-white/10'>
          {items.slice(0, 6).map((c, i) => (
            <li key={c.id || i} className='py-1.5'>
              <div className='text-foreground line-clamp-1 text-xs font-medium'>
                {c.name || c.campaign_name || "Untitled"}
              </div>
              {c.status && (
                <span className='text-muted-foreground text-[10px]'>
                  {String(c.status).toLowerCase()}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}

// ─── Contact list (Brevo) ───
export function ContactListCard({ data }: { data: any }) {
  const items: any[] = data?.contacts || [];
  return (
    <CardFrame
      icon={<Users className='h-3.5 w-3.5' />}
      title={`${items.length} ${items.length === 1 ? "contact" : "contacts"}`}
      account={data?.account}
    >
      {items.length === 0 ? (
        <div className='text-muted-foreground text-xs'>No contacts.</div>
      ) : (
        <ul className='divide-border divide-y dark:divide-white/10'>
          {items.slice(0, 6).map((c, i) => (
            <li key={c.id || i} className='py-1.5'>
              <div className='text-foreground line-clamp-1 text-xs'>
                {c.email || c.name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
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
    default:
      return null;
  }
}
