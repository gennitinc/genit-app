"use client";

import { CallDialog } from "./_components/call-dialog";
import { ContactDetails } from "./_components/contact-details";
import { NewConversationDialog } from "./_components/new-conversation-dialog";
import {
  GmailBrand,
  InstagramBrand,
  LinkedinBrand,
  MessengerBrand,
  MicrosoftOutlookBrand,
  SlackBrand,
  TelegramBrand,
  WhatsAppBrand,
  XBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { ManageDialog } from "@/app/integrations/_components/manage-dialog";
import {
  INTEGRATIONS,
  type Integration,
  connectionsForIntegration,
  resolveStatus,
} from "@/app/integrations/integrations-explorer";
import { LocalizedText } from "@/components/localized-text";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useClearConversation,
  useCreateConversation,
  useDeleteConversation,
  useDeleteInboxMessage,
  useInboxMessages,
  useInboxRealtime,
  useInfiniteInboxConversations,
  useMarkAllConversationsAsRead,
  useMarkConversationAsRead,
  useRetryInboxMessage,
  useSendMessage,
  useSendWhatsAppTemplate,
  useSyncInbox,
  useUpdateConversation,
  useUpdateConversationStatus,
  useUpdateInboxMessage,
} from "@/hooks/use-inbox";
import { useIntegrations } from "@/hooks/use-integrations";
import {
  findQuotedTextStart,
  isOutlookQuoteHeader,
} from "@/lib/email-quoted-content";
import {
  type InboxAttachment,
  type InboxConversation,
  type InboxFilters,
  type UpdateConversationInput,
  type WhatsAppTemplate,
  downloadInboxAttachment,
  exportConversation,
  fetchConversationWhatsAppTemplates,
  generateInboxDraft,
  uploadInboxAttachment,
} from "@/lib/inbox-api";
import { supportsInboxCalling } from "@/lib/inbox-calling";
import {
  EMPTY_INBOX_DRAFT,
  type InboxDrafts,
  updateInboxDraft,
} from "@/lib/inbox-drafts";
import { inboxEmailPreview, isInboxEmailHtml } from "@/lib/inbox-email-content";
import {
  type IntegrationConnection,
  type IntegrationPlatform,
  isMetaSurface,
} from "@/lib/integrations-api";
import { LoadingFileLoader } from "@/utils/Loading";
import DOMPurify from "dompurify";
import type { EmojiClickData, Theme as EmojiTheme } from "emoji-picker-react";
import {
  Archive,
  Ban,
  BellOff,
  Cable,
  Check,
  CheckCheck,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  Circle,
  CircleFadingArrowUp,
  Clock3,
  Download,
  Eraser,
  Inbox,
  ListFilter,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  PanelRight,
  Paperclip,
  Pencil,
  Phone,
  Pin,
  PinOff,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Shapes,
  Smile,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

function ConversationListSkeleton() {
  return (
    <div role='status' aria-label='Loading conversations' className='space-y-1'>
      <span className='sr-only'>
        <LocalizedText text={"Loading conversations"} />
      </span>
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          aria-hidden='true'
          className='flex gap-3 rounded-lg p-3'
        >
          <Skeleton className='h-11 w-11 shrink-0 rounded-full motion-reduce:animate-none' />
          <div className='min-w-0 flex-1 space-y-2 pt-0.5'>
            <div className='flex items-center justify-between gap-3'>
              <Skeleton className='h-4 w-28 motion-reduce:animate-none' />
              <Skeleton className='h-3 w-8 motion-reduce:animate-none' />
            </div>
            <Skeleton className='h-3 w-4/5 motion-reduce:animate-none' />
            <Skeleton className='h-2.5 w-14 motion-reduce:animate-none' />
          </div>
        </div>
      ))}
    </div>
  );
}

function MessageThreadSkeleton() {
  return (
    <div
      role='status'
      aria-label='Loading messages'
      className='mx-auto max-w-3xl space-y-5'
    >
      <span className='sr-only'>
        <LocalizedText text={"Loading messages"} />
      </span>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          aria-hidden='true'
          className={`flex ${index % 2 ? "justify-end" : "justify-start"}`}
        >
          <div className={`space-y-2 ${index % 2 ? "w-2/3" : "w-3/4"}`}>
            <Skeleton
              className={`h-16 w-full rounded-lg motion-reduce:animate-none ${index % 2 ? "bg-indigo-200 dark:bg-indigo-950" : "bg-zinc-200 dark:bg-zinc-800"}`}
            />
            <Skeleton
              className={`h-2.5 w-14 bg-zinc-300 motion-reduce:animate-none dark:bg-zinc-700 ${index % 2 ? "ml-auto" : ""}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmailMessageBody({
  html,
  fallback,
}: {
  html: string;
  fallback: string;
}) {
  const [safeHtml, setSafeHtml] = useState("");
  const [height, setHeight] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const initializedDocumentRef = useRef<Document | null>(null);
  const restoreImagesFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setHeight(null);
    initializedDocumentRef.current = null;
    resizeObserverRef.current?.disconnect();
    if (restoreImagesFrameRef.current !== null)
      cancelAnimationFrame(restoreImagesFrameRef.current);

    const sanitized = DOMPurify.sanitize(html, {
      ADD_ATTR: ["target"],
      FORBID_TAGS: ["base", "form", "iframe", "object", "embed"],
    });
    const parsed = new DOMParser().parseFromString(sanitized, "text/html");
    const collapseQuote = (nodes: Element[]) => {
      const first = nodes[0];
      if (!first || first.closest("details[data-email-quote]")) return;
      const details = parsed.createElement("details");
      details.setAttribute("data-email-quote", "");
      const summary = parsed.createElement("summary");
      summary.textContent = "Show quoted text";
      first.before(details);
      details.append(summary, ...nodes);
    };
    const quoteSelector = ".gmail_quote, blockquote[type='cite']";
    Array.from(parsed.querySelectorAll(quoteSelector))
      .filter((quote) => !quote.parentElement?.closest(quoteSelector))
      .forEach((quote) => collapseQuote([quote]));

    const outlookMarker = parsed.querySelector(
      "#divRplyFwdMsg, .OutlookMessageHeader"
    );
    const outlookDivider = outlookMarker?.previousElementSibling?.matches("hr")
      ? outlookMarker.previousElementSibling
      : Array.from(parsed.querySelectorAll("hr")).find((divider) =>
          isOutlookQuoteHeader(
            Array.from(divider.parentElement?.children || [])
              .slice(
                Array.from(divider.parentElement?.children || []).indexOf(
                  divider
                ) + 1
              )
              .map((node) => node.textContent || "")
              .join("\n")
              .slice(0, 1_000)
          )
        );
    const outlookStart = outlookDivider || outlookMarker;
    if (outlookStart?.parentElement) {
      const siblings = Array.from(outlookStart.parentElement.children);
      collapseQuote(siblings.slice(siblings.indexOf(outlookStart)));
    }

    parsed.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (!/^(https?:|mailto:|tel:)/i.test(href)) link.removeAttribute("href");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
    parsed.querySelectorAll("img").forEach((image) => {
      const src = image.getAttribute("src");
      const srcset = image.getAttribute("srcset");
      if (src) image.setAttribute("data-email-src", src);
      if (srcset) image.setAttribute("data-email-srcset", srcset);
      image.removeAttribute("src");
      image.removeAttribute("srcset");
      image.decoding = "async";
      if (src || srcset) image.setAttribute("data-email-image-pending", "");
    });
    parsed.querySelectorAll("picture source[srcset]").forEach((source) => {
      source.setAttribute("data-email-srcset", source.getAttribute("srcset")!);
      source.removeAttribute("srcset");
    });
    setSafeHtml(parsed.body.innerHTML);
  }, [html]);

  const initializeFrame = useCallback((iframe: HTMLIFrameElement) => {
    const document = iframe.contentDocument;
    if (!document?.body || initializedDocumentRef.current === document) return;

    initializedDocumentRef.current = document;
    const resize = () => {
      const body = document.body;
      setHeight(Math.max(1, Math.ceil(body.getBoundingClientRect().height)));
    };

    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = new ResizeObserver(resize);
    resizeObserverRef.current.observe(document.documentElement);
    resizeObserverRef.current.observe(document.body);
    document
      .querySelectorAll("details[data-email-quote]")
      .forEach((details) => details.addEventListener("toggle", resize));
    resize();

    restoreImagesFrameRef.current = requestAnimationFrame(() => {
      document
        .querySelectorAll<HTMLSourceElement>("source[data-email-srcset]")
        .forEach((source) => {
          source.srcset = source.dataset.emailSrcset || "";
          source.removeAttribute("data-email-srcset");
        });
      document
        .querySelectorAll<HTMLImageElement>(
          "img[data-email-src], img[data-email-srcset]"
        )
        .forEach((image) => {
          const finish = () =>
            image.removeAttribute("data-email-image-pending");
          image.addEventListener("load", finish, { once: true });
          image.addEventListener("error", finish, { once: true });
          if (image.dataset.emailSrcset) {
            image.srcset = image.dataset.emailSrcset;
            image.removeAttribute("data-email-srcset");
          }
          if (image.dataset.emailSrc) {
            image.src = image.dataset.emailSrc;
            image.removeAttribute("data-email-src");
          }
          if (image.complete) finish();
        });
    });
  }, []);

  useEffect(() => {
    if (!safeHtml) return;
    const revealTimer = window.setTimeout(() => {
      if (iframeRef.current) initializeFrame(iframeRef.current);
    }, 200);
    return () => window.clearTimeout(revealTimer);
  }, [initializeFrame, safeHtml]);

  useEffect(
    () => () => {
      resizeObserverRef.current?.disconnect();
      if (restoreImagesFrameRef.current !== null)
        cancelAnimationFrame(restoreImagesFrameRef.current);
    },
    []
  );

  const srcDoc = safeHtml
    ? `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: http: data:; style-src 'unsafe-inline'; font-src https: http: data:;"><base target="_blank"><style>html{background:#fff;color:#18181b}html,body{max-width:100%;overflow-x:hidden}body{box-sizing:border-box;margin:0;padding:20px;font:14px/1.55 Arial,sans-serif;overflow-wrap:anywhere}body *{box-sizing:border-box}img{max-width:100%!important;height:auto!important}img[data-email-image-pending]{background:#f4f4f5}table,div{max-width:100%!important}p,td,th{max-width:100%!important;white-space:normal!important;overflow-wrap:anywhere}pre{max-width:100%;white-space:pre-wrap;overflow-wrap:anywhere}a{color:#4f46e5;overflow-wrap:anywhere}details[data-email-quote]{margin-top:12px;border-top:1px solid #e4e4e7;padding-top:8px}details[data-email-quote]>summary{cursor:pointer;color:#71717a;font-size:12px;font-weight:600;user-select:none}details[data-email-quote][open]>summary{margin-bottom:8px}</style></head><body>${safeHtml}</body></html>`
    : "";

  if (!safeHtml) {
    const quotedTextStart = findQuotedTextStart(fallback);
    const visibleText =
      quotedTextStart >= 0
        ? fallback.slice(0, quotedTextStart).trim()
        : fallback;
    const quotedText =
      quotedTextStart >= 0 ? fallback.slice(quotedTextStart).trim() : "";
    return (
      <div className='px-4 py-3 wrap-anywhere whitespace-pre-wrap'>
        {visibleText}
        {quotedText && (
          <details className='text-muted-foreground mt-3 border-t pt-2 text-xs'>
            <summary className='cursor-pointer font-semibold'>
              <LocalizedText text={"Show quoted text"} />
            </summary>
            <div className='text-foreground mt-2 whitespace-pre-wrap'>
              {quotedText}
            </div>
          </details>
        )}
      </div>
    );
  }

  return (
    <div className='relative min-w-0 overflow-hidden bg-white text-zinc-900'>
      {height === null && (
        <div
          role='status'
          aria-label='Loading email content'
          className='absolute inset-0 z-10 space-y-4 bg-white p-5'
        >
          <Skeleton className='h-6 w-1/3 motion-reduce:animate-none' />
          <Skeleton className='h-4 w-4/5 motion-reduce:animate-none' />
          <Skeleton className='h-48 w-full motion-reduce:animate-none' />
          <Skeleton className='h-4 w-2/3 motion-reduce:animate-none' />
        </div>
      )}
      <iframe
        ref={iframeRef}
        title='Email message body'
        srcDoc={srcDoc}
        sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin'
        referrerPolicy='no-referrer'
        scrolling='no'
        aria-hidden={height === null}
        tabIndex={height === null ? -1 : undefined}
        className={`block w-full border-0 bg-white ${height === null ? "invisible" : "visible"}`}
        style={{ height: height ?? 1 }}
        onLoad={(event) => initializeFrame(event.currentTarget)}
      />
    </div>
  );
}

const INBOX_PLATFORMS = new Set<string>([
  "instagram",
  "linkedin",
  "x",
  "gmail",
  "outlook",
  "whatsapp",
  "messenger",
  "telegram",
]);

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X",
  twitter: "X",
  gmail: "Gmail",
  email: "Email",
  outlook: "Outlook",
  whatsapp: "WhatsApp",
  messenger: "Messenger",
  telegram: "Telegram Business",
  slack: "Slack",
};

function inboxPlatform(account: IntegrationConnection): string {
  return String(
    account.platform === "composio"
      ? account.metadata?.nativePlatform ||
          account.metadata?.toolkitSlug ||
          "composio"
      : account.platform
  ).toLowerCase();
}

function accountDisplayName(account: IntegrationConnection): string {
  const platform = inboxPlatform(account);
  const name = account.accountName?.trim();
  return !name ||
    [account.platform, platform, account.metadata?.toolkitSlug].some(
      (value) => String(value || "").toLowerCase() === name.toLowerCase()
    )
    ? PLATFORM_LABELS[platform] || name || "Channel"
    : name;
}

function PlatformIcon({
  platform,
  className = "h-4 w-4",
}: {
  platform: string;
  className?: string;
}) {
  switch (platform) {
    case "instagram":
      return <InstagramBrand className={className} />;
    case "x":
    case "twitter":
      return <XBrand className={className} />;
    case "linkedin":
      return <LinkedinBrand className={className} />;
    case "gmail":
    case "email":
      return <GmailBrand className={className} />;
    case "outlook":
      return <MicrosoftOutlookBrand className={className} />;
    case "whatsapp":
      return <WhatsAppBrand className={className} />;
    case "messenger":
      return <MessengerBrand className={className} />;
    case "telegram":
      return <TelegramBrand className={className} />;
    case "slack":
      return <SlackBrand className={className} />;
    default:
      return <MessageSquare className={className} />;
  }
}

function relativeTime(value: string) {
  const date = new Date(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function whatsappTemplateBody(template?: WhatsAppTemplate) {
  return (
    template?.components?.find(
      (component) => component.type?.toUpperCase() === "BODY"
    )?.text || ""
  );
}

function templateVariableCount(text: string) {
  return Math.max(
    0,
    ...Array.from(text.matchAll(/\{\{(\d+)\}\}/g), (match) => Number(match[1]))
  );
}

function whatsappTemplateVariableSections(template?: WhatsAppTemplate) {
  return (template?.components || [])
    .map((component) => ({
      type: component.type?.toLowerCase() || "body",
      count: templateVariableCount(component.text || ""),
    }))
    .filter((component) => component.count > 0);
}

function AccountAvatar({ account }: { account: IntegrationConnection }) {
  return (
    <div className='relative h-10 w-10 shrink-0'>
      {account.accountAvatar ? (
        <img
          src={account.accountAvatar}
          alt=''
          className='h-10 w-10 rounded-xl object-cover ring-1 ring-black/10 dark:ring-white/10'
        />
      ) : (
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-sm font-semibold text-zinc-600 ring-1 ring-black/5 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-white/10'>
          {accountDisplayName(account).charAt(0).toUpperCase()}
        </div>
      )}
      <span className='absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white dark:bg-zinc-950 dark:ring-zinc-950'>
        <PlatformIcon platform={inboxPlatform(account)} className='h-3 w-3' />
      </span>
    </div>
  );
}

function CustomerAvatar({
  conversation,
  className,
}: {
  conversation: InboxConversation;
  className: string;
}) {
  return (
    <Avatar className={className}>
      {conversation.customerAvatar && (
        <AvatarImage
          src={conversation.customerAvatar}
          alt={conversation.customerName}
          className='object-cover'
        />
      )}
      <AvatarFallback className='bg-zinc-100 text-sm font-semibold dark:bg-zinc-800'>
        {conversation.customerName.charAt(0).toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
  );
}

export default function InboxPage() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const [selectedAccountId, setSelectedAccountIdState] = useState("all");
  const [urlStateReady, setUrlStateReady] = useState(false);
  const [status, setStatus] = useState<InboxFilters["status"]>("all");
  const [sort, setSort] = useState<NonNullable<InboxFilters["sort"]>>("newest");
  const [folder, setFolder] = useState("inbox");
  const [search, setSearch] = useState("");
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const setActiveId = useCallback((conversationId: string | null) => {
    setActiveIdState(conversationId);
    const url = new URL(window.location.href);
    if (conversationId) url.searchParams.set("conversation", conversationId);
    else url.searchParams.delete("conversation");
    window.history.replaceState(window.history.state, "", url);
  }, []);
  const setSelectedAccountId = useCallback((accountId: string) => {
    setSelectedAccountIdState(accountId);
    setActiveIdState(null);
    const url = new URL(window.location.href);
    if (accountId === "all") url.searchParams.delete("account");
    else url.searchParams.set("account", accountId);
    url.searchParams.delete("conversation");
    window.history.replaceState(window.history.state, "", url);
  }, []);
  const [drafts, setDrafts] = useState<InboxDrafts>({});
  const { reply, attachments } = activeId
    ? (drafts[activeId] ?? EMPTY_INBOX_DRAFT)
    : EMPTY_INBOX_DRAFT;
  const setReply = (reply: string) => {
    const conversationId = activeId;
    if (!conversationId) return;
    setDrafts((current) =>
      updateInboxDraft(current, conversationId, { reply })
    );
  };
  const setAttachments = (
    next:
      | InboxAttachment[]
      | ((attachments: InboxAttachment[]) => InboxAttachment[])
  ) => {
    const conversationId = activeId;
    if (!conversationId) return;
    setDrafts((current) => {
      const attachments = current[conversationId]?.attachments ?? [];
      return updateInboxDraft(current, conversationId, {
        attachments: typeof next === "function" ? next(attachments) : next,
      });
    });
  };
  const [showEmoji, setShowEmoji] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [whatsappTemplates, setWhatsAppTemplates] = useState<
    WhatsAppTemplate[]
  >([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateValues, setTemplateValues] = useState<string[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InboxConversation | null>(
    null
  );
  const [clearTarget, setClearTarget] = useState<InboxConversation | null>(
    null
  );
  const [deleteMessageTarget, setDeleteMessageTarget] = useState<{
    messageId: string;
    conversationId: string;
  } | null>(null);
  const [selectedConversationIds, setSelectedConversationIds] = useState(
    () => new Set<string>()
  );
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [createdConversation, setCreatedConversation] =
    useState<InboxConversation | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const requestedHistoryKeyRef = useRef("");
  const initialSyncOrgRef = useRef("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    void import("emoji-picker-react");
  }, []);

  /* Lock parent layout ancestors to viewport height so only the
     messages column scrolls – uses inline styles because dynamically
     added Tailwind classes aren't compiled into the CSS bundle. */
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1280px)");

    const targets = () => ({
      scrollContainer: document.querySelector(
        ".scroll-container"
      ) as HTMLElement | null,
      mainContent: document.querySelector(
        "#main-content"
      ) as HTMLElement | null,
      mainContentChild: document.querySelector(
        "#main-content > div"
      ) as HTMLElement | null,
      mainContentFlex: document.querySelector(
        "#main-content > div > div"
      ) as HTMLElement | null,
      childrenWrapper: document.querySelector(
        "#main-content > div > div > div:last-child"
      ) as HTMLElement | null,
    });

    const apply = () => {
      if (!mql.matches) return remove();
      const t = targets();
      if (t.scrollContainer) t.scrollContainer.style.overflow = "hidden";
      if (t.mainContent) {
        Object.assign(t.mainContent.style, {
          height: "calc(100vh - 4rem)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        });
      }
      if (t.mainContentChild) {
        Object.assign(t.mainContentChild.style, {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "0",
        });
      }
      if (t.mainContentFlex) {
        Object.assign(t.mainContentFlex.style, {
          height: "100%",
          minHeight: "0",
        });
      }
      if (t.childrenWrapper) {
        Object.assign(t.childrenWrapper.style, {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: "0",
        });
      }
    };

    const remove = () => {
      const t = targets();
      if (t.scrollContainer) t.scrollContainer.style.overflow = "";
      if (t.mainContent) {
        t.mainContent.style.height = "";
        t.mainContent.style.display = "";
        t.mainContent.style.flexDirection = "";
        t.mainContent.style.overflow = "";
      }
      if (t.mainContentChild) {
        t.mainContentChild.style.height = "";
        t.mainContentChild.style.display = "";
        t.mainContentChild.style.flexDirection = "";
        t.mainContentChild.style.paddingBottom = "";
      }
      if (t.mainContentFlex) {
        t.mainContentFlex.style.height = "";
        t.mainContentFlex.style.minHeight = "";
      }
      if (t.childrenWrapper) {
        t.childrenWrapper.style.height = "";
        t.childrenWrapper.style.display = "";
        t.childrenWrapper.style.flexDirection = "";
        t.childrenWrapper.style.overflow = "";
        t.childrenWrapper.style.minHeight = "";
      }
    };

    apply();
    mql.addEventListener("change", apply);
    return () => {
      mql.removeEventListener("change", apply);
      remove();
    };
  }, []);

  const {
    orgId,
    integrations,
    byPlatform,
    identityBySurface,
    isLoading: integrationsLoading,
  } = useIntegrations();
  const inboxIntegrations = useMemo(
    () =>
      INTEGRATIONS.filter(
        (integration) =>
          INBOX_PLATFORMS.has(integration.platform) ||
          integration.appSlug === "slack"
      ),
    []
  );
  const manageConnections = manageFor
    ? connectionsForIntegration(manageFor, byPlatform)
    : [];
  const accounts = useMemo(
    () =>
      integrations
        .filter(
          (item) =>
            INBOX_PLATFORMS.has(inboxPlatform(item)) && item.status === "active"
        )
        .sort((a, b) => {
          const order = (account: IntegrationConnection) =>
            inboxIntegrations.findIndex(
              (integration) =>
                (integration.appSlug || integration.platform) ===
                inboxPlatform(account)
            );
          return order(a) - order(b);
        }),
    [inboxIntegrations, integrations]
  );
  const startableAccounts = useMemo(
    () =>
      accounts.filter((account) => {
        const platform = inboxPlatform(account);
        return (
          ["gmail", "email", "outlook", "instagram", "messenger"].includes(
            platform
          ) ||
          (platform === "telegram" &&
            account.metadata?.telegramMode !== "business_bot") ||
          platform === "whatsapp" ||
          (platform === "x" && account.scopes.includes("dm.write"))
        );
      }),
    [accounts]
  );
  const selectedAccount = accounts.find(
    (account) => account._id === selectedAccountId
  );
  const filtersReady =
    urlStateReady &&
    Boolean(orgId) &&
    !integrationsLoading &&
    (selectedAccountId === "all" || Boolean(selectedAccount));
  const filters = useMemo<InboxFilters>(
    () => ({
      integrationId: selectedAccount?._id,
      platform:
        selectedAccount && selectedAccount.platform === "composio"
          ? undefined
          : selectedAccount
            ? inboxPlatform(selectedAccount)
            : undefined,
      status,
      search: deferredSearch || undefined,
      sort,
      folder:
        selectedAccount &&
        ["gmail", "email", "outlook"].includes(inboxPlatform(selectedAccount))
          ? folder
          : undefined,
    }),
    [deferredSearch, folder, selectedAccount, sort, status]
  );

  const {
    data: conversationPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteInboxConversations(filters, filtersReady);
  const conversations = useMemo(
    () => conversationPages?.pages.flatMap((page) => page.conversations) ?? [],
    [conversationPages]
  );
  const conversationsLoading = !filtersReady || isLoading;
  const { data: messages = [], isLoading: messagesLoading } = useInboxMessages(
    activeId || undefined
  );
  useInboxRealtime(activeId || undefined);
  const sendMutation = useSendMessage();
  const sendLockRef = useRef(false);
  const sendTemplateMutation = useSendWhatsAppTemplate();
  const retryMutation = useRetryInboxMessage();
  const markReadMutation = useMarkConversationAsRead();
  const markAllMutation = useMarkAllConversationsAsRead();
  const statusMutation = useUpdateConversationStatus();
  const deleteMutation = useDeleteConversation();
  const clearMutation = useClearConversation();
  const createConversationMutation = useCreateConversation();
  const syncMutation = useSyncInbox();
  const updateConversationMutation = useUpdateConversation();
  const updateMessageMutation = useUpdateInboxMessage();
  const deleteMessageMutation = useDeleteInboxMessage();
  const activeConversation =
    conversations.find((conversation) => conversation._id === activeId) ||
    (createdConversation?._id === activeId ? createdConversation : null);
  const unreadTotal = conversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0
  );
  const supportsAttachments = activeConversation
    ? !["x", "twitter", "linkedin"].includes(activeConversation.platform)
    : true;
  const replyMaxLength =
    activeConversation &&
    ["x", "twitter"].includes(activeConversation.platform) &&
    activeConversation.metadata?.kind !== "dm"
      ? 280
      : undefined;
  const whatsappReplyWindowClosed = Boolean(
    activeConversation?.platform === "whatsapp" &&
    (!activeConversation.metadata?.lastInboundAt ||
      Date.now() -
        Date.parse(String(activeConversation.metadata.lastInboundAt)) >
        24 * 60 * 60 * 1000)
  );
  const telegramBusinessReplyWindowClosed = Boolean(
    activeConversation?.platform === "telegram" &&
    activeConversation.metadata?.telegramBusiness &&
    (!activeConversation.metadata?.lastInboundAt ||
      Date.now() -
        Date.parse(String(activeConversation.metadata.lastInboundAt)) >
        24 * 60 * 60 * 1000)
  );
  const selectedTemplate = whatsappTemplates.find(
    (template) => template.id === selectedTemplateId
  );
  const selectedTemplateBody = whatsappTemplateBody(selectedTemplate);
  const selectedTemplateVariableSections =
    whatsappTemplateVariableSections(selectedTemplate);
  const selectedTemplateVariableCount = selectedTemplateVariableSections.reduce(
    (total, section) => total + section.count,
    0
  );
  const activeConversationAccount = accounts.find(
    (account) => account._id === activeConversation?.integration
  );
  const activeTelegramBusinessConnection = (
    activeConversationAccount?.metadata?.businessConnections || []
  ).find(
    (connection: any) =>
      connection.id === activeConversation?.metadata?.businessConnectionId
  );
  const providerReplyUnavailable = Boolean(
    activeConversation?.metadata?.telegramBusiness &&
    (!activeTelegramBusinessConnection?.isEnabled ||
      !activeTelegramBusinessConnection?.rights?.can_reply)
  );
  const syncableAccounts = accounts.filter((account) =>
    [
      "gmail",
      "outlook",
      "instagram",
      "linkedin",
      "messenger",
      "whatsapp",
      "telegram",
      "x",
      "composio",
    ].includes(account.platform)
  );
  const historyAccounts = syncableAccounts.filter((account) =>
    ["gmail", "outlook", "instagram", "linkedin", "messenger", "x"].includes(
      inboxPlatform(account)
    )
  );

  useEffect(() => {
    if (
      !orgId ||
      integrationsLoading ||
      !syncableAccounts.length ||
      initialSyncOrgRef.current === orgId
    )
      return;
    initialSyncOrgRef.current = orgId;
    syncMutation.mutate({ continueHistory: false });
  }, [integrationsLoading, orgId, syncableAccounts.length]);

  const providerHistoryKey = (
    selectedAccount
      ? historyAccounts.filter((account) => account._id === selectedAccount._id)
      : historyAccounts
  )
    .map((account) => {
      const metadata = account.metadata || {};
      const cursor =
        metadata.composioInboxNextPageToken ||
        metadata.gmailNextPageToken ||
        metadata.outlookNextPageToken ||
        metadata.metaNextPageToken ||
        metadata.xMentionNextPageToken ||
        metadata.xDmNextPageToken;
      return cursor ? `${account._id}:${cursor}` : "";
    })
    .filter(Boolean)
    .join("|");

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    setSelectedAccountIdState(params.get("account") || "all");
    setActiveIdState(params.get("conversation"));
    setUrlStateReady(true);
  }, []);

  useEffect(() => {
    if (
      urlStateReady &&
      orgId &&
      !integrationsLoading &&
      selectedAccountId !== "all" &&
      !selectedAccount
    )
      setSelectedAccountId("all");
  }, [
    integrationsLoading,
    orgId,
    selectedAccount,
    selectedAccountId,
    setSelectedAccountId,
    urlStateReady,
  ]);

  const syncChannels = (continueHistory = false) => {
    const selectedIsSyncable = Boolean(
      selectedAccount &&
      syncableAccounts.some((account) => account._id === selectedAccount._id)
    );
    const selectedSupportsHistory = Boolean(
      selectedAccount &&
      historyAccounts.some((account) => account._id === selectedAccount._id)
    );
    const integrationId = continueHistory
      ? selectedSupportsHistory
        ? selectedAccount?._id
        : undefined
      : selectedIsSyncable
        ? selectedAccount?._id
        : undefined;
    syncMutation.mutate(
      {
        integrationId,
        platform: continueHistory
          ? selectedSupportsHistory
            ? selectedAccount?.platform
            : undefined
          : selectedIsSyncable
            ? selectedAccount?.platform
            : undefined,
        continueHistory,
      },
      {
        onSuccess: (results) => {
          const threads = results.reduce(
            (total, result) => total + result.threadsProcessed,
            0
          );
          const hasMore = results.some((result) => result.nextPageToken);
          const failures = results.filter((result) => result.error);
          const warnings = results.filter((result) => result.warning);
          const failureMessage = failures
            .map((result) => `${result.accountName}: ${result.error}`)
            .join(" · ");
          if (failures.length === results.length) toast.error(failureMessage);
          else {
            toast.success(
              continueHistory
                ? `${threads} older conversations imported${hasMore ? ". Import again to continue." : ". History is up to date."}`
                : `Inbox synchronized: ${threads} conversations checked`
            );
            if (failures.length) toast.error(failureMessage);
            if (warnings.length)
              toast.warning(
                warnings
                  .map((result) => `${result.accountName}: ${result.warning}`)
                  .join(" · ")
              );
          }
        },
        onError: (error: any) =>
          toast.error(
            error?.response?.data?.message ||
              "Inbox channels could not be synchronized"
          ),
      }
    );
  };

  useEffect(() => {
    if (!conversationsLoading && activeId && !activeConversation)
      setActiveId(null);
  }, [activeConversation, activeId, conversationsLoading, setActiveId]);

  useEffect(() => {
    if (
      createdConversation &&
      conversations.some(
        (conversation) => conversation._id === createdConversation._id
      )
    ) {
      setCreatedConversation(null);
    }
  }, [conversations, createdConversation]);

  useEffect(() => {
    if (activeConversation?.unreadCount)
      markReadMutation.mutate(activeConversation._id);
  }, [activeConversation?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || (!hasNextPage && !providerHistoryKey)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || isFetchingNextPage || syncMutation.isPending)
        return;
      if (hasNextPage) fetchNextPage();
      else if (requestedHistoryKeyRef.current !== providerHistoryKey) {
        requestedHistoryKeyRef.current = providerHistoryKey;
        syncChannels(true);
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    providerHistoryKey,
    syncMutation.isPending,
  ]);

  useEffect(() => {
    setShowEmoji(false);
  }, [activeId]);

  useEffect(() => {
    setWhatsAppTemplates([]);
    setSelectedTemplateId("");
    setTemplateValues([]);
    if (!activeId || !whatsappReplyWindowClosed) return;
    let cancelled = false;
    setTemplatesLoading(true);
    fetchConversationWhatsAppTemplates(activeId)
      .then((templates) => {
        if (cancelled) return;
        setWhatsAppTemplates(templates);
        setSelectedTemplateId(templates[0]?.id || "");
      })
      .catch((error: any) => {
        if (!cancelled)
          toast.error(
            error?.response?.data?.message ||
              "WhatsApp templates could not be loaded"
          );
      })
      .finally(() => {
        if (!cancelled) setTemplatesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeId, whatsappReplyWindowClosed]);

  const sendReply = () => {
    if (sendLockRef.current) return;
    const content = reply.trim();
    if ((!content && attachments.length === 0) || !activeId) return;
    sendLockRef.current = true;
    sendMutation.mutate(
      { conversationId: activeId, content, attachments },
      {
        onSuccess: () => {
          setReply("");
          setAttachments([]);
        },
        onError: (error: any) =>
          toast.error(
            error?.response?.data?.message || "Your reply could not be sent"
          ),
        onSettled: () => {
          sendLockRef.current = false;
        },
      }
    );
  };

  const insertEmoji = ({ emoji }: EmojiClickData) => {
    const input = replyInputRef.current;
    const start = input?.selectionStart ?? reply.length;
    const end = input?.selectionEnd ?? start;
    const next = reply.slice(0, start) + emoji + reply.slice(end);
    if (replyMaxLength && next.length > replyMaxLength) return;
    setReply(next);
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const sendWhatsAppTemplate = () => {
    if (!activeId || !selectedTemplate) return;
    const values = templateValues
      .slice(0, selectedTemplateVariableCount)
      .map((value) => value.trim());
    if (values.some((value) => !value)) {
      toast.error("Complete every template variable before sending");
      return;
    }
    sendTemplateMutation.mutate(
      {
        conversationId: activeId,
        name: selectedTemplate.name,
        language: selectedTemplate.language || "en_US",
        components: values.length
          ? selectedTemplateVariableSections.map((section, index) => {
              const offset = selectedTemplateVariableSections
                .slice(0, index)
                .reduce((total, item) => total + item.count, 0);
              return {
                type: section.type,
                parameters: values
                  .slice(offset, offset + section.count)
                  .map((text) => ({ type: "text", text })),
              };
            })
          : undefined,
      },
      {
        onSuccess: () => toast.success("WhatsApp template sent"),
        onError: (error: any) =>
          toast.error(
            error?.response?.data?.message ||
              "WhatsApp template could not be sent"
          ),
      }
    );
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setIsUploading(true);
    try {
      const room = Math.max(0, 4 - attachments.length);
      const uploaded = await Promise.all(
        Array.from(files).slice(0, room).map(uploadInboxAttachment)
      );
      setAttachments((current) => [...current, ...uploaded]);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "The attachment could not be uploaded"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const writeWithAi = async () => {
    if (!activeId) return;
    setIsWriting(true);
    try {
      const draft = await generateInboxDraft(activeId, reply || undefined);
      setReply(draft);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "AI could not write a reply"
      );
    } finally {
      setIsWriting(false);
    }
  };

  const changeStatus = (nextStatus: InboxConversation["status"]) => {
    if (!activeId) return;
    statusMutation.mutate(
      { conversationId: activeId, status: nextStatus },
      {
        onSuccess: () =>
          toast.success(
            nextStatus === "resolved"
              ? "Conversation resolved"
              : nextStatus === "snoozed"
                ? "Conversation snoozed"
                : "Conversation reopened"
          ),
        onError: () => toast.error("Conversation could not be updated"),
      }
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => {
        if (activeId === deleteTarget._id) setActiveId(null);
        setDeleteTarget(null);
        toast.success("Conversation deleted");
      },
      onError: () => toast.error("Conversation could not be deleted"),
    });
  };

  const updateConversationFlag = (
    conversation: InboxConversation,
    flag: "isPinned" | "isMuted" | "isBlocked",
    label: string
  ) => {
    const enabled = !conversation[flag];
    const input: UpdateConversationInput = { [flag]: enabled };
    updateConversationMutation.mutate(
      { conversationId: conversation._id, input },
      {
        onSuccess: () =>
          toast.success(`${label} ${enabled ? "enabled" : "disabled"}`),
        onError: () => toast.error(`${label} could not be updated`),
      }
    );
  };

  const exportChat = async (conversation: InboxConversation) => {
    try {
      const blob = await exportConversation(conversation._id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${conversation.customerName.replace(/[^a-z0-9_-]+/gi, "-") || "conversation"}-chat.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      toast.success("Conversation exported");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Conversation could not be exported"
      );
    }
  };

  const confirmClear = () => {
    if (!clearTarget) return;
    clearMutation.mutate(clearTarget._id, {
      onSuccess: () => {
        setClearTarget(null);
        toast.success("Conversation cleared");
      },
      onError: () => toast.error("Conversation could not be cleared"),
    });
  };

  const confirmDeleteMessage = () => {
    if (!deleteMessageTarget) return;
    deleteMessageMutation.mutate(deleteMessageTarget, {
      onSuccess: () => {
        setDeleteMessageTarget(null);
        toast.success("Message deleted");
      },
      onError: (error: any) =>
        toast.error(
          error?.response?.data?.message || "Message could not be deleted"
        ),
    });
  };

  const toggleConversationSelection = (conversationId: string) => {
    setSelectedConversationIds((current) => {
      const next = new Set(current);
      if (next.has(conversationId)) next.delete(conversationId);
      else next.add(conversationId);
      return next;
    });
  };

  const runBulkAction = async (
    action: "read" | InboxConversation["status"] | "delete"
  ) => {
    const ids = [...selectedConversationIds];
    if (!ids.length) return;
    setBulkBusy(true);
    try {
      if (action === "read")
        await Promise.all(ids.map((id) => markReadMutation.mutateAsync(id)));
      else if (action === "delete")
        await Promise.all(ids.map((id) => deleteMutation.mutateAsync(id)));
      else
        await Promise.all(
          ids.map((conversationId) =>
            statusMutation.mutateAsync({ conversationId, status: action })
          )
        );
      if (
        action === "delete" &&
        activeId &&
        selectedConversationIds.has(activeId)
      )
        setActiveId(null);
      toast.success(
        action === "read"
          ? "Selected conversations marked as read"
          : action === "delete"
            ? "Selected conversations deleted"
            : `Selected conversations marked ${action}`
      );
      setSelectedConversationIds(new Set());
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Some selected conversations could not be updated"
      );
    } finally {
      setBulkBusy(false);
      setBulkDeleteOpen(false);
    }
  };

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 max-xl:bg-background flex h-full min-h-[calc(100dvh-8rem)] w-full min-w-0 flex-col gap-4 overflow-hidden duration-500 max-xl:fixed max-xl:inset-0 max-xl:z-50 max-xl:h-dvh max-xl:min-h-0 max-xl:animate-none max-xl:gap-0 max-xl:pt-[env(safe-area-inset-top)] max-xl:pb-[env(safe-area-inset-bottom)]'>
      <header className='flex flex-wrap items-end justify-between gap-3 max-xl:h-14 max-xl:shrink-0 max-xl:flex-nowrap max-xl:items-center max-xl:border-b max-xl:border-black/5 max-xl:px-3 dark:max-xl:border-white/10'>
        <div className='flex min-w-0 items-center gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='shrink-0 rounded-full active:scale-[0.97]'
            onClick={() => router.back()}
            aria-label='Go back'
            title='Go back'
          >
            <ChevronLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            <LocalizedText text={"Inbox"} />
          </h1>
        </div>
        <div className='flex flex-nowrap gap-2 max-xl:gap-1'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='relative rounded-md'
                aria-label='Select connected brand'
                title='Connected brand'
              >
                {selectedAccount ? (
                  <PlatformIcon
                    platform={inboxPlatform(selectedAccount)}
                    className='h-4 w-4'
                  />
                ) : (
                  <Shapes className='h-4 w-4' />
                )}
                {selectedAccountId !== "all" && (
                  <CheckCircle className='absolute top-1 right-1 size-[12px] rounded-full bg-indigo-500' />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-64'>
              <DropdownMenuLabel>
                <LocalizedText text={"Connected brand"} />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
              >
                <DropdownMenuRadioItem value='all'>
                  <Inbox className='mr-2 h-4 w-4' />
                  <span className='flex min-w-0 flex-col'>
                    <span>
                      <LocalizedText text={"All accounts"} />
                    </span>
                    <span className='text-muted-foreground text-[10px]'>
                      <LocalizedText text={"Every connected channel"} />
                    </span>
                  </span>
                </DropdownMenuRadioItem>
                {accounts.map((account) => (
                  <DropdownMenuRadioItem key={account._id} value={account._id}>
                    <PlatformIcon
                      platform={inboxPlatform(account)}
                      className='mr-2 h-4 w-4'
                    />
                    <span className='min-w-0 flex-1 truncate'>
                      {accountDisplayName(account)}
                    </span>
                    {account.isPrimary && (
                      <span className='text-muted-foreground text-[9px]'>
                        <LocalizedText text={"Primary"} />
                      </span>
                    )}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              {!integrationsLoading && accounts.length === 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href='/plugins'>
                      <Plus className='mr-2 h-4 w-4' />
                      <LocalizedText text={"Connect a channel"} />
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='relative rounded-md'
                aria-label='Conversation view options'
                title='View options'
              >
                <ListFilter className='h-4 w-4' />
                {(status !== "all" ||
                  sort !== "newest" ||
                  folder !== "inbox") && (
                  <span className='absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-indigo-500' />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-52'>
              <DropdownMenuLabel>
                <LocalizedText text={"Show conversations"} />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={status || "all"}
                onValueChange={(value) =>
                  setStatus(value as InboxFilters["status"])
                }
              >
                <DropdownMenuRadioItem value='all'>
                  <LocalizedText text={"All conversations"} />
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='open'>
                  <LocalizedText text={"Open"} />
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='resolved'>
                  <LocalizedText text={"Resolved"} />
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='snoozed'>
                  <LocalizedText text={"Snoozed"} />
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              {selectedAccount &&
                ["gmail", "email", "outlook"].includes(
                  selectedAccount.platform
                ) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>
                      <LocalizedText text={"Mailbox"} />
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={folder}
                      onValueChange={setFolder}
                    >
                      {[
                        ["inbox", "Inbox"],
                        ["primary", "Primary"],
                        ["promotions", "Promotions"],
                        ["social", "Social"],
                        ["updates", "Updates"],
                        ["forums", "Forums"],
                        ["sent", "Sent"],
                        ["archive", "Archive"],
                        ["spam", "Spam"],
                        ["trash", "Trash"],
                        ["drafts", "Drafts"],
                      ].map(([value, label]) => (
                        <DropdownMenuRadioItem key={value} value={value}>
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </>
                )}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <LocalizedText text={"Sort by"} />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(value) =>
                  setSort(value as NonNullable<InboxFilters["sort"]>)
                }
              >
                <DropdownMenuRadioItem value='newest'>
                  <LocalizedText text={"Newest first"} />
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='oldest'>
                  <LocalizedText text={"Oldest first"} />
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='unread'>
                  <LocalizedText text={"Unread first"} />
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='rounded-md'
                aria-label='Inbox settings'
                title='Inbox settings'
              >
                <Settings className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-52'>
              <DropdownMenuLabel>
                <LocalizedText text={"Inbox settings"} />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!unreadTotal || markAllMutation.isPending}
                onSelect={() =>
                  markAllMutation.mutate(undefined, {
                    onSuccess: () =>
                      toast.success("Everything is marked as read"),
                    onError: () => toast.error("Messages could not be updated"),
                  })
                }
              >
                {markAllMutation.isPending ? (
                  <LoadingFileLoader size={20} />
                ) : (
                  <CheckCheck className='mr-2 h-4 w-4' />
                )}
                <LocalizedText text={"Mark all read"} />
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!syncableAccounts.length || syncMutation.isPending}
                onSelect={() => syncChannels(false)}
              >
                {syncMutation.isPending ? (
                  <LoadingFileLoader size={20} />
                ) : (
                  <RefreshCw className='mr-2 h-4 w-4' />
                )}
                <LocalizedText text={"Sync connected channels"} />
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!historyAccounts.length || syncMutation.isPending}
                onSelect={() => syncChannels(true)}
              >
                <Archive className='mr-2 h-4 w-4' />
                <LocalizedText text={"Import older channel history"} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/plugins'>
                  <Settings className='mr-2 h-4 w-4' />
                  <LocalizedText text={"Manage plugins"} />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='rounded-md bg-indigo-600 px-3 text-white hover:bg-indigo-700 max-sm:size-9 max-sm:p-0'>
                <Cable className='h-4 w-4 sm:hidden' />
                <span className='max-sm:sr-only'>
                  <LocalizedText text={"Channel"} />
                </span>
                <ChevronDown className='h-4 w-4 max-sm:hidden' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-64'>
              <DropdownMenuLabel>
                <LocalizedText text={"Inbox channels"} />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {inboxIntegrations.map((integration) => {
                const hasIdentityForSurface = isMetaSurface(
                  integration.platform
                )
                  ? identityBySurface.has(integration.platform)
                  : false;
                const integrationStatus = resolveStatus(
                  integration,
                  connectionsForIntegration(integration, byPlatform),
                  hasIdentityForSurface
                );
                const isConnected =
                  integrationStatus === "connected" ||
                  integrationStatus === "partial";
                const Icon = integration.icon;

                return (
                  <DropdownMenuItem
                    key={integration.platform}
                    className='flex cursor-pointer items-center gap-1 py-1'
                    onSelect={() =>
                      isConnected
                        ? setManageFor(integration)
                        : setConnectFor(integration)
                    }
                  >
                    <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10'>
                      <Icon className='h-4 w-4' />
                    </span>
                    <span className='min-w-0 flex-1 truncate font-medium'>
                      {integration.name}
                    </span>
                    {isConnected ? (
                      <Settings className='text-muted-foreground h-4 w-4 shrink-0' />
                    ) : (
                      <Plus className='text-muted-foreground h-4 w-4 shrink-0' />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className='grid min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm max-xl:rounded-none max-xl:border-0 max-xl:shadow-none xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(420px,1fr)_280px] dark:border-white/10 dark:bg-zinc-950'>
        <aside
          className={`${activeId ? "hidden xl:flex" : "flex"} relative min-h-0 min-w-0 flex-col border-r border-black/5 dark:border-white/10`}
        >
          <div className='border-b border-black/5 px-4 py-2 dark:border-white/10'>
            <div className='flex items-center gap-2'>
              <div className='relative min-w-0 flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder='Search people or messages'
                  className='h-10 rounded-xl border-black/10 bg-zinc-50 pl-9 hover:border-black/10 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/10 dark:hover:bg-zinc-900'
                />
              </div>

              <Button
                variant='outline'
                size='icon'
                className='h-10 w-10 shrink-0 rounded-xl'
                onClick={() => setShowNewConversation(true)}
                disabled={!startableAccounts.length}
                aria-label='Start a conversation'
                title='Start a conversation'
              >
                <Plus className='h-4 w-4' />
              </Button>

              {/* {isFetching && (
                <div className=''>
                  <LoadingFileLoader size={20} />
                </div>
              )} */}
            </div>
            {selectedConversationIds.size > 0 && (
              <div className='mt-2 flex min-w-0 items-center gap-2 border-t border-black/5 pt-2 dark:border-white/10'>
                <label className='flex min-w-0 cursor-pointer items-center gap-2 text-xs font-medium'>
                  <Checkbox
                    checked={
                      selectedConversationIds.size === conversations.length
                        ? true
                        : "indeterminate"
                    }
                    onCheckedChange={(checked) =>
                      setSelectedConversationIds(
                        checked
                          ? new Set(conversations.map(({ _id }) => _id))
                          : new Set()
                      )
                    }
                    aria-label='Select all loaded conversations'
                  />
                  <span className='truncate'>
                    <LocalizedText text={"Select all"} />
                  </span>
                  <span className='bg-muted text-muted-foreground shrink-0 rounded-full px-2 py-0.5 text-[10px] tabular-nums'>
                    {selectedConversationIds.size}
                  </span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='ml-auto shrink-0 rounded-xl'
                      disabled={bulkBusy}
                    >
                      <MoreHorizontal className='mr-1.5 h-4 w-4' />
                      <LocalizedText text={"More"} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <DropdownMenuItem onSelect={() => runBulkAction("read")}>
                      <CheckCheck className='mr-2 h-4 w-4' />
                      <LocalizedText text={"Mark as read"} />
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => runBulkAction("open")}>
                      <Inbox className='mr-2 h-4 w-4' />
                      <LocalizedText text={"Mark open"} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => runBulkAction("resolved")}
                    >
                      <CheckCircle className='mr-2 h-4 w-4' />
                      <LocalizedText text={"Resolve"} />
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => runBulkAction("snoozed")}>
                      <Clock3 className='mr-2 h-4 w-4' />
                      <LocalizedText text={"Snooze"} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => setSelectedConversationIds(new Set())}
                    >
                      <XCircle className='mr-2 h-4 w-4' />
                      <LocalizedText text={"Cancel selection"} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='text-red-600 focus:text-red-600'
                      onSelect={() => setBulkDeleteOpen(true)}
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      <LocalizedText text={"Delete selected"} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className='flex-1 overflow-y-auto p-2'>
            {conversationsLoading ? (
              <ConversationListSkeleton />
            ) : conversations.length === 0 ? (
              <div className='flex h-full min-h-72 flex-col items-center justify-center px-8 text-center'>
                <span className='mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900'>
                  <Inbox className='text-muted-foreground h-6 w-6' />
                </span>
                <h3 className='text-sm font-semibold'>
                  <LocalizedText text={"No conversations here"} />
                </h3>
                <p className='text-muted-foreground mt-1 text-xs leading-5'>
                  <LocalizedText
                    text={
                      "Try another account or filter. Connected Gmail accounts sync recent threads automatically; use Inbox settings to import older mail."
                    }
                  />
                </p>
              </div>
            ) : (
              <>
                {conversations.map((conversation) => (
                  <ContextMenu key={conversation._id}>
                    <ContextMenuTrigger asChild>
                      <div
                        role='button'
                        tabIndex={0}
                        onClick={() =>
                          selectedConversationIds.size
                            ? toggleConversationSelection(conversation._id)
                            : setActiveId(conversation._id)
                        }
                        onKeyDown={(event) => {
                          if (event.key !== "Enter" && event.key !== " ")
                            return;
                          event.preventDefault();
                          selectedConversationIds.size
                            ? toggleConversationSelection(conversation._id)
                            : setActiveId(conversation._id);
                        }}
                        className={`mb-1 flex w-full cursor-pointer gap-3 rounded-lg p-3 text-left transition ${selectedConversationIds.has(conversation._id) || activeId === conversation._id ? "bg-zinc-100 dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]"}`}
                      >
                        {selectedConversationIds.size > 0 && (
                          <Checkbox
                            checked={selectedConversationIds.has(
                              conversation._id
                            )}
                            onClick={(event) => event.stopPropagation()}
                            onCheckedChange={() =>
                              toggleConversationSelection(conversation._id)
                            }
                            aria-label={`Select conversation with ${conversation.customerName}`}
                            className='mt-3'
                          />
                        )}
                        <div className='relative shrink-0 cursor-pointer'>
                          <CustomerAvatar
                            conversation={conversation}
                            className='h-11 w-11'
                          />
                          <span className='absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white dark:bg-zinc-950 dark:ring-zinc-950'>
                            <PlatformIcon
                              platform={conversation.platform}
                              className='h-3 w-3'
                            />
                          </span>
                        </div>
                        <span className='min-w-0 flex-1'>
                          <span className='flex items-center justify-between gap-2'>
                            <span
                              className={`truncate text-sm ${conversation.unreadCount ? "font-bold" : "font-medium"}`}
                            >
                              {conversation.customerName}
                            </span>
                            <span
                              className={`text-[10px] ${conversation.unreadCount ? "font-semibold text-indigo-600" : "text-muted-foreground"}`}
                            >
                              {relativeTime(conversation.lastMessageAt)}
                            </span>
                          </span>
                          <span className='mt-0.5 flex items-center gap-2'>
                            <span
                              className={`min-w-0 flex-1 truncate text-xs ${conversation.unreadCount ? "text-foreground font-medium" : "text-muted-foreground"}`}
                            >
                              {inboxEmailPreview(conversation.lastMessage)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white'>
                                {conversation.unreadCount}
                              </span>
                            )}
                          </span>
                          <span className='text-muted-foreground mt-1.5 flex items-center gap-1 text-[10px] capitalize'>
                            <Circle
                              className={`h-1.5 w-1.5 fill-current ${conversation.status === "open" ? "text-indigo-500" : conversation.status === "snoozed" ? "text-amber-500" : "text-zinc-400"}`}
                            />
                            {conversation.status}
                            {conversation.isPinned && (
                              <Pin
                                className='ml-1 h-3 w-3'
                                aria-label='Pinned'
                              />
                            )}
                            {conversation.isMuted && (
                              <BellOff
                                className='ml-1 h-3 w-3'
                                aria-label='Muted'
                              />
                            )}
                            {conversation.isBlocked && (
                              <Ban
                                className='ml-1 h-3 w-3 text-red-500'
                                aria-label='Blocked'
                              />
                            )}
                          </span>
                        </span>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className='w-56'>
                      <ContextMenuItem
                        onSelect={() =>
                          toggleConversationSelection(conversation._id)
                        }
                      >
                        <CheckCircle className='mr-2 h-4 w-4' />
                        {selectedConversationIds.has(conversation._id)
                          ? "Deselect"
                          : "Select"}
                      </ContextMenuItem>
                      <ContextMenuItem
                        disabled={!conversation.unreadCount}
                        onSelect={() =>
                          markReadMutation.mutate(conversation._id)
                        }
                      >
                        <CheckCheck className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Mark as read"} />
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onSelect={() =>
                          statusMutation.mutate(
                            {
                              conversationId: conversation._id,
                              status:
                                conversation.status === "resolved"
                                  ? "open"
                                  : "resolved",
                            },
                            {
                              onError: () =>
                                toast.error(
                                  "Conversation could not be archived"
                                ),
                            }
                          )
                        }
                      >
                        <Archive className='mr-2 h-4 w-4' />
                        {conversation.status === "resolved"
                          ? "Unarchive"
                          : "Archive"}
                      </ContextMenuItem>
                      <ContextMenuItem
                        onSelect={() =>
                          updateConversationFlag(
                            conversation,
                            "isPinned",
                            "Pin"
                          )
                        }
                      >
                        {conversation.isPinned ? (
                          <PinOff className='mr-2 h-4 w-4' />
                        ) : (
                          <Pin className='mr-2 h-4 w-4' />
                        )}
                        {conversation.isPinned ? "Unpin" : "Pin"}
                      </ContextMenuItem>
                      <ContextMenuItem
                        onSelect={() =>
                          updateConversationFlag(
                            conversation,
                            "isBlocked",
                            "Block"
                          )
                        }
                      >
                        <Ban className='mr-2 h-4 w-4' />
                        <span className='truncate'>
                          {conversation.isBlocked ? "Unblock" : "Block"}{" "}
                          {conversation.customerName}
                        </span>
                      </ContextMenuItem>
                      <ContextMenuItem
                        onSelect={() =>
                          updateConversationFlag(
                            conversation,
                            "isMuted",
                            "Mute"
                          )
                        }
                      >
                        <BellOff className='mr-2 h-4 w-4' />
                        {conversation.isMuted ? "Unmute" : "Mute"}
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onSelect={() => {
                          setActiveId(conversation._id);
                          setShowDetails(true);
                        }}
                      >
                        <PanelRight className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Contact details"} />
                      </ContextMenuItem>
                      <ContextMenuItem
                        onSelect={() => void exportChat(conversation)}
                      >
                        <Download className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Export chat"} />
                      </ContextMenuItem>
                      <ContextMenuItem
                        onSelect={() => setClearTarget(conversation)}
                      >
                        <Eraser className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Clear chat"} />
                      </ContextMenuItem>
                      <ContextMenuItem
                        className='text-red-600 focus:text-red-600'
                        onSelect={() => setDeleteTarget(conversation)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Delete conversation"} />
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
                <div
                  ref={loadMoreRef}
                  className='flex h-10 items-center justify-center'
                >
                  {isFetchingNextPage && <LoadingFileLoader size={20} />}
                </div>
              </>
            )}
          </div>
          <NewConversationDialog
            open={showNewConversation}
            onOpenChange={setShowNewConversation}
            accounts={startableAccounts}
            pending={
              createConversationMutation.isPending || sendMutation.isPending
            }
            onCreate={(input, message) =>
              createConversationMutation.mutate(input, {
                onSuccess: (conversation) => {
                  setShowNewConversation(false);
                  setCreatedConversation(conversation);
                  setActiveId(conversation._id);
                  if (input.platform === "whatsapp") {
                    toast.success("Choose an approved template to send");
                    return;
                  }
                  sendMutation.mutate(
                    { conversationId: conversation._id, content: message },
                    {
                      onSuccess: () => {
                        toast.success("Message sent");
                      },
                      onError: (error: any) =>
                        toast.error(
                          error?.response?.data?.message ||
                            "Message could not be sent"
                        ),
                    }
                  );
                },
                onError: (error: any) =>
                  toast.error(
                    error?.response?.data?.message ||
                      "Conversation could not be created"
                  ),
              })
            }
          />
        </aside>

        <main
          className={`${activeId ? "flex" : "hidden xl:flex"} relative min-h-0 min-w-0 flex-col bg-zinc-50/40 dark:bg-black/20`}
        >
          {activeConversation ? (
            <>
              <div className='flex h-14 shrink-0 items-center justify-between gap-3 border-b border-black/5 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-white/10 dark:bg-zinc-950/80'>
                <div className='flex min-w-0 flex-1 items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='shrink-0 rounded-full xl:hidden'
                    onClick={() => setActiveId(null)}
                  >
                    <ChevronLeft className='h-5 w-5' />
                  </Button>
                  <button
                    type='button'
                    className='shrink-0 rounded-full'
                    onClick={() => {
                      setActiveId(activeConversation._id);
                      setShowDetails(true);
                    }}
                    aria-label={`View ${activeConversation.customerName}`}
                  >
                    <CustomerAvatar
                      conversation={activeConversation}
                      className='h-9 w-9'
                    />
                  </button>
                  <div className='min-w-0 flex-1'>
                    <div className='flex min-w-0 items-center gap-2'>
                      <h2 className='max-w-28 truncate text-sm font-semibold sm:max-w-48'>
                        {activeConversation.customerName}
                      </h2>
                      <p className='text-muted-foreground hidden min-w-0 flex-1 items-center gap-1.5 text-xs sm:flex'>
                        <PlatformIcon
                          platform={activeConversation.platform}
                          className='h-3 w-3 flex-shrink-0'
                        />

                        <span className='truncate'>
                          {PLATFORM_LABELS[activeConversation.platform]}
                          {activeConversation.customerHandle
                            ? ` · ${activeConversation.customerHandle}`
                            : ""}
                        </span>
                      </p>
                    </div>
                    {activeConversation.subject && (
                      <p className='text-muted-foreground mt-0.5 line-clamp-1 truncate text-xs'>
                        {activeConversation.subject}
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-1'>
                  {supportsInboxCalling(activeConversation.platform) && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='rounded-full'
                      onClick={() => setShowCallDialog(true)}
                      aria-label={`Call ${activeConversation.customerName}`}
                    >
                      <Phone className='h-5 w-5' />
                    </Button>
                  )}
                  <Button
                    variant='ghost'
                    size='icon'
                    className='rounded-full 2xl:hidden'
                    onClick={() => setShowDetails(true)}
                    aria-label='View contact details'
                  >
                    <PanelRight className='h-5 w-5' />
                  </Button>
                  {activeConversation.status === "resolved" ? (
                    <Button
                      variant='outline'
                      size='sm'
                      className='hidden rounded-full sm:flex'
                      disabled={statusMutation.isPending}
                      onClick={() => changeStatus("open")}
                    >
                      <Archive className='mr-2 h-4 w-4' />
                      <LocalizedText text={"Reopen"} />
                    </Button>
                  ) : (
                    <Button
                      variant='outline'
                      size='sm'
                      className='hidden rounded-full sm:flex'
                      disabled={statusMutation.isPending}
                      onClick={() => changeStatus("resolved")}
                    >
                      <Check className='mr-2 h-4 w-4' />
                      <LocalizedText text={"Resolve"} />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='rounded-full'
                      >
                        <MoreHorizontal className='h-5 w-5' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-56'>
                      <DropdownMenuItem onSelect={() => changeStatus("open")}>
                        <Inbox className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Mark open"} />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => changeStatus("snoozed")}
                      >
                        <Clock3 className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Snooze"} />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => changeStatus("resolved")}
                      >
                        <Check className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Resolve"} />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() =>
                          updateConversationFlag(
                            activeConversation,
                            "isPinned",
                            "Pin"
                          )
                        }
                      >
                        {activeConversation.isPinned ? (
                          <PinOff className='mr-2 h-4 w-4' />
                        ) : (
                          <Pin className='mr-2 h-4 w-4' />
                        )}
                        {activeConversation.isPinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          updateConversationFlag(
                            activeConversation,
                            "isBlocked",
                            "Block"
                          )
                        }
                      >
                        <Ban className='mr-2 h-4 w-4' />
                        {activeConversation.isBlocked ? "Unblock" : "Block"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          updateConversationFlag(
                            activeConversation,
                            "isMuted",
                            "Mute"
                          )
                        }
                      >
                        <BellOff className='mr-2 h-4 w-4' />
                        {activeConversation.isMuted ? "Unmute" : "Mute"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => setShowDetails(true)}>
                        <PanelRight className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Contact details"} />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => void exportChat(activeConversation)}
                      >
                        <Download className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Export chat"} />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setClearTarget(activeConversation)}
                      >
                        <Eraser className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Clear chat"} />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-red-600 focus:text-red-600'
                        onSelect={() => setDeleteTarget(activeConversation)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        <LocalizedText text={"Delete conversation"} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className='inbox-chat-background min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
                {messagesLoading ? (
                  <MessageThreadSkeleton />
                ) : (
                  <div className='mx-auto max-w-3xl space-y-5'>
                    {messages.map((message) => {
                      const inbound = message.senderType === "customer";
                      const isEmail = ["gmail", "email", "outlook"].includes(
                        activeConversation.platform
                      );
                      const emailHtml = isEmail
                        ? typeof message.metadata?.contentHtml === "string"
                          ? message.metadata.contentHtml
                          : isInboxEmailHtml(message.content)
                            ? message.content
                            : ""
                        : "";
                      return (
                        <div
                          key={message._id}
                          className={`flex flex-col ${inbound ? "items-start" : "items-end"}`}
                        >
                          <div
                            className={`group/message flex items-center gap-1 ${emailHtml ? "w-full max-w-full" : "max-w-[90%] sm:max-w-[82%]"} ${inbound ? "flex-row" : "flex-row-reverse"}`}
                          >
                            {inbound && !emailHtml && (
                              <CustomerAvatar
                                conversation={activeConversation}
                                className='h-7 w-7 self-end'
                              />
                            )}
                            <div
                              className={`min-w-0 overflow-hidden rounded-lg text-sm leading-6 shadow-sm ${emailHtml ? "w-full max-w-3xl bg-white ring-1 ring-black/5 dark:ring-white/10" : inbound ? "rounded-tl-md bg-white ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10" : message.status === "failed" ? "rounded-tr-md bg-red-50 text-zinc-900 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-zinc-100 dark:ring-red-900" : "rounded-tr-md bg-indigo-600 text-white"}`}
                            >
                              {message.attachments?.map((attachment) => (
                                <div
                                  key={attachment.url}
                                  className='border-b border-black/10 last:border-b-0'
                                >
                                  {attachment.providerAttachmentId ? (
                                    <button
                                      type='button'
                                      onClick={() =>
                                        downloadInboxAttachment(
                                          attachment
                                        ).catch((error: any) =>
                                          toast.error(
                                            error?.response?.data?.message ||
                                              "Attachment could not be downloaded"
                                          )
                                        )
                                      }
                                      className='flex w-full items-center gap-2 px-4 py-3 text-left font-medium underline underline-offset-2'
                                    >
                                      <Paperclip className='h-4 w-4' />
                                      {attachment.name}
                                    </button>
                                  ) : attachment.mimeType ===
                                    "text/uri-list" ? (
                                    <a
                                      href={attachment.url}
                                      target='_blank'
                                      rel='noreferrer'
                                      className='flex items-center gap-3 bg-black/[0.03] px-4 py-3 font-medium dark:bg-white/[0.05]'
                                    >
                                      <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-black/10 dark:bg-zinc-900 dark:ring-white/10'>
                                        <PlatformIcon
                                          platform={activeConversation.platform}
                                          className='h-4 w-4'
                                        />
                                      </span>
                                      <span className='min-w-0 truncate'>
                                        {attachment.name}
                                      </span>
                                    </a>
                                  ) : attachment.kind === "image" ? (
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className='max-h-[28rem] w-full bg-black/[0.03] object-contain dark:bg-white/[0.03]'
                                    />
                                  ) : attachment.kind === "video" ? (
                                    <video
                                      src={attachment.url}
                                      controls
                                      className='max-h-[28rem] w-full bg-black'
                                    />
                                  ) : attachment.kind === "audio" ? (
                                    <audio
                                      src={attachment.url}
                                      controls
                                      className='m-3 max-w-[260px]'
                                    />
                                  ) : (
                                    <a
                                      href={attachment.url}
                                      target='_blank'
                                      rel='noreferrer'
                                      className='flex items-center gap-2 px-4 py-3 font-medium underline underline-offset-2'
                                    >
                                      <Paperclip className='h-4 w-4' />
                                      {attachment.name}
                                    </a>
                                  )}
                                </div>
                              ))}
                              {message.content &&
                                (emailHtml ? (
                                  <EmailMessageBody
                                    html={emailHtml}
                                    fallback={inboxEmailPreview(
                                      message.content
                                    )}
                                  />
                                ) : (
                                  <div className='px-4 py-3 wrap-anywhere whitespace-pre-wrap'>
                                    {message.content}
                                  </div>
                                ))}
                            </div>
                            {!inbound &&
                              (!message.platformMessageId ||
                                message.status === "failed") && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant='ghost'
                                      size='icon'
                                      className='h-7 w-7 shrink-0 rounded-full opacity-100 sm:opacity-0 sm:group-hover/message:opacity-100'
                                      aria-label='Message actions'
                                    >
                                      <MoreHorizontal className='h-4 w-4' />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align={inbound ? "start" : "end"}
                                  >
                                    <DropdownMenuItem
                                      onClick={() => {
                                        const content = window.prompt(
                                          "Edit message",
                                          message.content
                                        );
                                        if (content !== null && content.trim())
                                          updateMessageMutation.mutate(
                                            {
                                              messageId: message._id,
                                              conversationId:
                                                activeConversation._id,
                                              content: content.trim(),
                                            },
                                            {
                                              onError: (error: any) =>
                                                toast.error(
                                                  error?.response?.data
                                                    ?.message ||
                                                    "Message could not be edited"
                                                ),
                                            }
                                          );
                                      }}
                                    >
                                      <Pencil className='mr-2 h-4 w-4' />{" "}
                                      <LocalizedText text={"Edit"} />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className='text-red-600 focus:text-red-600'
                                      onClick={() =>
                                        setDeleteMessageTarget({
                                          messageId: message._id,
                                          conversationId:
                                            activeConversation._id,
                                        })
                                      }
                                    >
                                      <Trash2 className='mr-2 h-4 w-4' />{" "}
                                      <LocalizedText text={"Delete"} />
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                          </div>
                          <span className='text-muted-foreground mt-1.5 flex items-center gap-1 px-1 text-[10px]'>
                            {relativeTime(message.createdAt)}
                            {!inbound &&
                              (message.status === "sending" ? (
                                <LoadingFileLoader size={20} />
                              ) : message.status === "failed" ? (
                                <button
                                  className='flex items-center gap-1 text-red-600 hover:underline'
                                  onClick={() =>
                                    retryMutation.mutate({
                                      messageId: message._id,
                                      conversationId: activeConversation._id,
                                    })
                                  }
                                >
                                  <RefreshCw className='h-3 w-3' />
                                  <LocalizedText text={"Retry"} />
                                </button>
                              ) : (
                                <>
                                  <CheckCheck className='h-3 w-3' />
                                  {message.status}
                                </>
                              ))}
                          </span>
                          {message.status === "failed" && message.error && (
                            <span
                              className='max-w-xs truncate px-1 text-right text-[10px] text-red-600'
                              title={message.error}
                            >
                              Message wasn&apos;t sent
                            </span>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className='bg-background/85 border-border/60 relative z-20 shrink-0 border-t p-2 backdrop-blur-xl'>
                {activeConversation.isBlocked ? (
                  <div className='text-muted-foreground flex items-center justify-center gap-2 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900'>
                    <Ban className='h-4 w-4 text-red-500' />
                    <LocalizedText text={"This contact is blocked."} />{" "}
                    <button
                      className='font-semibold text-indigo-700 hover:underline dark:text-indigo-400'
                      onClick={() =>
                        updateConversationFlag(
                          activeConversation,
                          "isBlocked",
                          "Block"
                        )
                      }
                    >
                      <LocalizedText text={"Unblock to reply"} />
                    </button>
                  </div>
                ) : activeConversation.status === "resolved" ? (
                  <div className='text-muted-foreground flex items-center justify-center gap-2 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900'>
                    <Check className='h-4 w-4' />
                    <LocalizedText
                      text={"This conversation is resolved."}
                    />{" "}
                    <button
                      className='font-semibold text-indigo-700 hover:underline dark:text-indigo-400'
                      onClick={() => changeStatus("open")}
                    >
                      <LocalizedText text={"Reopen to reply"} />
                    </button>
                  </div>
                ) : providerReplyUnavailable ? (
                  <div className='text-muted-foreground mx-auto max-w-3xl rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900'>
                    <LocalizedText
                      text={
                        "Telegram Business reply access is not active. Reauthorize the Business Bot with permission to read and reply to messages. You can still review, label, and resolve this conversation."
                      }
                    />
                  </div>
                ) : whatsappReplyWindowClosed ? (
                  <div className='mx-auto max-w-3xl space-y-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100'>
                    <p>
                      <LocalizedText
                        text={
                          "WhatsApp’s 24-hour reply window has closed. Send an approved template here; normal replies become available after the customer responds."
                        }
                      />
                    </p>
                    {templatesLoading ? (
                      <div className='flex items-center gap-2'>
                        <LoadingFileLoader size={20} />{" "}
                        <LocalizedText text={"Loading templates…"} />
                      </div>
                    ) : whatsappTemplates.length ? (
                      <div className='space-y-3'>
                        <select
                          className='bg-background text-foreground h-10 w-full rounded-md border px-3'
                          value={selectedTemplateId}
                          onChange={(event) => {
                            setSelectedTemplateId(event.target.value);
                            setTemplateValues([]);
                          }}
                        >
                          {whatsappTemplates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.name} · {template.language}
                            </option>
                          ))}
                        </select>
                        {selectedTemplateBody && (
                          <p className='rounded-lg bg-white/70 p-3 whitespace-pre-wrap dark:bg-black/20'>
                            {selectedTemplateBody}
                          </p>
                        )}
                        {Array.from(
                          { length: selectedTemplateVariableCount },
                          (_, index) => (
                            <Input
                              key={index}
                              value={templateValues[index] || ""}
                              onChange={(event) =>
                                setTemplateValues((current) => {
                                  const next = [...current];
                                  next[index] = event.target.value;
                                  return next;
                                })
                              }
                              placeholder={`Value for {{${index + 1}}}`}
                              className='bg-background text-foreground'
                            />
                          )
                        )}
                        <Button
                          onClick={sendWhatsAppTemplate}
                          disabled={sendTemplateMutation.isPending}
                        >
                          {sendTemplateMutation.isPending && (
                            <LoadingFileLoader size={20} />
                          )}
                          <LocalizedText text={"Send template"} />
                        </Button>
                      </div>
                    ) : (
                      <p>
                        <LocalizedText
                          text={"No approved WhatsApp templates are available."}
                        />
                      </p>
                    )}
                  </div>
                ) : telegramBusinessReplyWindowClosed ? (
                  <div className='mx-auto max-w-3xl rounded-lg bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100'>
                    <LocalizedText
                      text={
                        "Telegram Business replies are available for 24 hours after the customer&apos;s latest message. Wait for the customer to message the business account again before replying."
                      }
                    />
                  </div>
                ) : (
                  <div className='bg-background/80 border-border/70 focus-within:border-foreground/20 relative mx-auto max-w-3xl rounded-2xl border shadow-lg shadow-black/5 backdrop-blur-xl transition-[border-color,box-shadow] duration-200 ease-out focus-within:shadow-xl focus-within:shadow-black/10 dark:shadow-black/20'>
                    {attachments.length > 0 && (
                      <div className='bg-background/70 border-border/60 absolute bottom-[calc(100%+8px)] left-0 z-30 flex max-w-full gap-2 overflow-x-auto rounded-2xl border p-1.5 shadow-lg shadow-black/10 backdrop-blur-xl dark:shadow-black/30'>
                        {attachments.map((attachment) => (
                          <div
                            key={attachment.url}
                            className='bg-background/75 border-border/60 relative flex h-14 min-w-14 shrink-0 items-center gap-2 overflow-hidden rounded-xl border p-1.5'
                          >
                            {attachment.kind === "image" ? (
                              <img
                                src={attachment.url}
                                alt=''
                                className='h-full w-12 rounded-lg object-cover'
                              />
                            ) : (
                              <>
                                <span className='bg-muted/70 text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                                  <Paperclip className='h-4 w-4' />
                                </span>
                                <span className='text-muted-foreground max-w-28 truncate pr-5 text-[11px]'>
                                  {attachment.name}
                                </span>
                              </>
                            )}
                            <button
                              onClick={() =>
                                setAttachments((current) =>
                                  current.filter(
                                    (item) => item.url !== attachment.url
                                  )
                                )
                              }
                              className='absolute top-1 right-1 rounded-full bg-black/60 text-white shadow-sm backdrop-blur-md transition-transform duration-150 ease-out active:scale-95'
                              aria-label={`Remove ${attachment.name}`}
                            >
                              <XCircle className='h-4 w-4' strokeWidth={2} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <textarea
                      ref={replyInputRef}
                      rows={1}
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          sendReply();
                        }
                      }}
                      placeholder={`Reply to ${activeConversation.customerName}…`}
                      maxLength={replyMaxLength}
                      className='placeholder:text-muted-foreground/70 field-sizing-content max-h-32 min-h-11 w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[13px] leading-5 outline-none'
                    />
                    <div className='flex items-end justify-between gap-2 px-2 pb-1'>
                      <div className='relative flex items-center gap-1'>
                        <input
                          ref={fileInputRef}
                          type='file'
                          multiple
                          className='hidden'
                          accept='image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip'
                          onChange={(event) => uploadFiles(event.target.files)}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='text-muted-foreground hover:bg-muted hover:text-foreground h-8 w-8 rounded-full'
                          disabled={
                            !supportsAttachments ||
                            isUploading ||
                            attachments.length >= 4
                          }
                          onClick={() => fileInputRef.current?.click()}
                          aria-label={
                            supportsAttachments
                              ? "Attach files"
                              : "Attachments are unavailable for this provider"
                          }
                        >
                          {isUploading ? (
                            <LoadingFileLoader size={20} />
                          ) : (
                            <Paperclip className='h-4 w-4' />
                          )}
                        </Button>
                        <Popover open={showEmoji} onOpenChange={setShowEmoji}>
                          <PopoverTrigger asChild>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='text-muted-foreground hover:bg-muted hover:text-foreground h-8 w-8 rounded-full'
                              aria-label='Add emoji'
                            >
                              <Smile className='h-4 w-4' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side='top'
                            align='start'
                            collisionPadding={12}
                            onInteractOutside={() => setShowEmoji(false)}
                            className='w-auto max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border-0 bg-transparent p-0 shadow-xl'
                          >
                            <EmojiPicker
                              onEmojiClick={insertEmoji}
                              autoFocusSearch
                              searchPlaceholder='Search emojis'
                              theme={
                                (resolvedTheme === "dark"
                                  ? "dark"
                                  : "light") as EmojiTheme
                              }
                              width='min(350px, calc(100vw - 1.5rem))'
                              height='min(420px, calc(100dvh - 7rem))'
                              previewConfig={{ showPreview: false }}
                            />
                          </PopoverContent>
                        </Popover>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='text-muted-foreground hover:bg-muted hover:text-foreground h-8 gap-1.5 rounded-full px-2.5 text-[11px] font-medium'
                          disabled={isWriting}
                          onClick={writeWithAi}
                        >
                          {isWriting ? (
                            <LoadingFileLoader size={20} />
                          ) : (
                            <CircleFadingArrowUp className='h-3.5 w-3.5' />
                          )}
                          <LocalizedText text={"AI"} />
                        </Button>
                      </div>

                      <button
                        type='submit'
                        onClick={sendReply}
                        disabled={
                          (!reply.trim() && attachments.length === 0) ||
                          sendMutation.isPending ||
                          isUploading
                        }
                        className='b-2 relative cursor-pointer rounded-[10px] bg-[linear-gradient(to_top,#292929,#555555,#292929)] p-[2px] shadow-[inset_0_6px_2px_-4px_rgba(255,255,255,.5)] transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {/* Border effects behind content */}
                        <div className='absolute inset-0 overflow-hidden rounded-[10px]'>
                          <BorderBeam
                            duration={6}
                            size={40}
                            className='from-transparent via-red-500 to-transparent'
                          />
                          <BorderBeam
                            duration={6}
                            delay={10}
                            size={40}
                            borderWidth={2}
                            className='from-transparent via-blue-500 to-transparent'
                          />
                        </div>

                        {/* Button content */}
                        <div className='relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-black/10 backdrop-blur-[3px] transition-all duration-300 hover:drop-shadow-[0_0_5px_white]'>
                          {sendMutation.isPending || isUploading ? (
                            <LoadingFileLoader size={20} />
                          ) : (
                            <svg
                              className='h-4 w-4 text-white'
                              viewBox='0 0 512 512'
                              fill='currentColor'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path d='M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05' />
                            </svg>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='flex h-full flex-col items-center justify-center p-8 text-center'>
              <span className='mb-5 flex h-52 w-auto items-center justify-center rounded-3xl bg-zinc-200 shadow-sm ring-1 ring-black/5 dark:ring-white/10'>
                <Image
                  src='/chat.svg'
                  height='200'
                  width='200'
                  alt='chat logo'
                  className=''
                />
              </span>
              <h2 className='text-muted-foreground text-lg font-medium'>
                <LocalizedText text={"Multi Channel As One"} />
              </h2>
            </div>
          )}
          {showDetails && activeConversation && (
            <div
              role='dialog'
              aria-modal='true'
              aria-label='Contact details'
              className='bg-background animate-in slide-in-from-top-4 absolute inset-0 z-30 min-h-0 duration-200'
            >
              <ContactDetails
                conversation={activeConversation}
                saving={updateConversationMutation.isPending}
                onCancel={() => setShowDetails(false)}
                onSave={(input) =>
                  updateConversationMutation.mutate(
                    { conversationId: activeConversation._id, input },
                    {
                      onSuccess: () => {
                        toast.success("Contact details updated");
                        setShowDetails(false);
                      },
                      onError: () =>
                        toast.error("Contact details could not be updated"),
                    }
                  )
                }
              />
            </div>
          )}
        </main>
        <aside className='hidden min-h-0 border-l 2xl:block'>
          {activeConversation &&
            supportsInboxCalling(activeConversation.platform) && (
              <CallDialog
                conversation={activeConversation}
                open={showCallDialog}
                onOpenChange={setShowCallDialog}
              />
            )}
          {activeConversation && (
            <ContactDetails
              conversation={activeConversation}
              saving={updateConversationMutation.isPending}
              onSave={(input) =>
                updateConversationMutation.mutate(
                  { conversationId: activeConversation._id, input },
                  {
                    onSuccess: () => toast.success("Contact details updated"),
                    onError: () =>
                      toast.error("Contact details could not be updated"),
                  }
                )
              }
            />
          )}
        </aside>
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <LocalizedText text={"Delete this conversation?"} />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <LocalizedText
                text={"This permanently removes the conversation with"}
              />{" "}
              {deleteTarget?.customerName}{" "}
              <LocalizedText
                text={"and its message history. This cannot be undone."}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <LocalizedText text={"Cancel"} />
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-600 text-white hover:bg-red-700'
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete conversation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(clearTarget)}
        onOpenChange={(open) => !open && setClearTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <LocalizedText text={"Clear this conversation?"} />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <LocalizedText
                text={"This removes the current message history with"}
              />{" "}
              {clearTarget?.customerName}{" "}
              <LocalizedText
                text={
                  "from Genit. New messages will still appear normally. This cannot be undone."
                }
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearMutation.isPending}>
              <LocalizedText text={"Cancel"} />
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClear}
              disabled={clearMutation.isPending}
              className='bg-red-600 text-white hover:bg-red-700'
            >
              {clearMutation.isPending ? "Clearing…" : "Clear chat"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <LocalizedText text={"Delete selected conversations?"} />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <LocalizedText text={"This permanently removes"} />
              {selectedConversationIds.size}{" "}
              <LocalizedText
                text={
                  "conversations and their message history. This cannot be undone."
                }
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkBusy}>
              <LocalizedText text={"Cancel"} />
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => runBulkAction("delete")}
              disabled={bulkBusy}
              className='bg-red-600 text-white hover:bg-red-700'
            >
              {bulkBusy ? "Deleting…" : "Delete selected"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(deleteMessageTarget)}
        onOpenChange={(open) => !open && setDeleteMessageTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <LocalizedText text={"Delete this message?"} />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <LocalizedText
                text={
                  "This permanently removes the message from Genit. This cannot be undone."
                }
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <LocalizedText text={"Cancel"} />
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMessage}
              disabled={deleteMessageMutation.isPending}
              className='bg-red-600 text-white hover:bg-red-700'
            >
              {deleteMessageMutation.isPending ? "Deleting…" : "Delete message"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ConnectDialog
        open={Boolean(connectFor)}
        onOpenChange={(open) => !open && setConnectFor(null)}
        platform={connectFor?.platform ?? null}
        platformName={connectFor?.name ?? ""}
        platformDescription={connectFor?.description ?? ""}
        Icon={connectFor?.icon ?? (() => null)}
        glow={connectFor?.glow ?? "rgba(113,113,122,0.4)"}
        appSlug={connectFor?.appSlug}
      />

      <ManageDialog
        open={Boolean(manageFor)}
        onOpenChange={(open) => !open && setManageFor(null)}
        connections={manageConnections}
        platform={manageFor?.platform ?? null}
        platformName={manageFor?.name ?? ""}
        Icon={manageFor?.icon ?? (() => null)}
        glow={manageFor?.glow ?? "rgba(113,113,122,0.4)"}
      />
    </div>
  );
}
