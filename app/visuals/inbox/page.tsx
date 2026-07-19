"use client";

import { ContactDetails } from "./_components/contact-details";
import { NewConversationDialog } from "./_components/new-conversation-dialog";
import {
  GmailBrand,
  InstagramBrand,
  LinkedinBrand,
  MessengerBrand,
  MicrosoftOutlookBrand,
  TelegramBrand,
  WhatsAppBrand,
  XBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { ManageDialog } from "@/app/integrations/_components/manage-dialog";
import {
  INTEGRATIONS,
  type Integration,
  resolveStatus,
} from "@/app/integrations/integrations-explorer";
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
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
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
  type InboxAttachment,
  type InboxConversation,
  type InboxFilters,
  type WhatsAppTemplate,
  downloadInboxAttachment,
  fetchConversationWhatsAppTemplates,
  generateInboxDraft,
  uploadInboxAttachment,
} from "@/lib/inbox-api";
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
  Check,
  CheckCheck,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  Circle,
  CircleFadingArrowUp,
  Clock3,
  Inbox,
  ListFilter,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  PanelRight,
  Paperclip,
  Pencil,
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
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

function EmailMessageBody({
  html,
  fallback,
}: {
  html: string;
  fallback: string;
}) {
  const [safeHtml, setSafeHtml] = useState("");
  const [height, setHeight] = useState(120);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const sanitized = DOMPurify.sanitize(html, {
      ADD_ATTR: ["target"],
      FORBID_TAGS: ["base", "form", "iframe", "object", "embed"],
    });
    const parsed = new DOMParser().parseFromString(sanitized, "text/html");
    parsed.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (!/^(https?:|mailto:|tel:)/i.test(href)) link.removeAttribute("href");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
    setSafeHtml(parsed.body.innerHTML);
  }, [html]);

  useEffect(() => () => resizeObserverRef.current?.disconnect(), []);

  const srcDoc = safeHtml
    ? `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: http: data:; style-src 'unsafe-inline'; font-src https: http: data:;"><base target="_blank"><style>html{background:#fff;color:#18181b}html,body{overflow:hidden}body{box-sizing:border-box;margin:0;padding:20px;font:14px/1.55 Arial,sans-serif;overflow-wrap:anywhere}img{max-width:100%;height:auto}table{max-width:100%}a{color:#4f46e5}</style></head><body>${safeHtml}</body></html>`
    : "";

  if (!safeHtml)
    return (
      <div className='px-4 py-3 wrap-anywhere whitespace-pre-wrap'>
        {fallback}
      </div>
    );

  return (
    <div className='min-w-0 overflow-hidden bg-white text-zinc-900'>
      <iframe
        title='Email message body'
        srcDoc={srcDoc}
        sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin'
        referrerPolicy='no-referrer'
        scrolling='no'
        className='block w-full border-0 bg-white'
        style={{ height }}
        onLoad={(event) => {
          const document = event.currentTarget.contentDocument;
          if (!document) return;
          const resize = () => {
            const body = document.body;
            setHeight(
              Math.max(
                120,
                document.documentElement.scrollHeight,
                body.scrollHeight,
                body.offsetHeight
              )
            );
          };
          resizeObserverRef.current?.disconnect();
          resizeObserverRef.current = new ResizeObserver(resize);
          resizeObserverRef.current.observe(document.documentElement);
          resizeObserverRef.current.observe(document.body);
          resize();
        }}
      />
    </div>
  );
}

const INBOX_PLATFORMS = new Set<IntegrationPlatform>([
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
};

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
          {account.accountName?.charAt(0).toUpperCase() || "?"}
        </div>
      )}
      <span className='absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white dark:bg-zinc-950 dark:ring-zinc-950'>
        <PlatformIcon platform={account.platform} className='h-3 w-3' />
      </span>
    </div>
  );
}

export default function InboxPage() {
  const [connectFor, setConnectFor] = useState<Integration | null>(null);
  const [manageFor, setManageFor] = useState<Integration | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [status, setStatus] = useState<InboxFilters["status"]>("all");
  const [sort, setSort] = useState<NonNullable<InboxFilters["sort"]>>("newest");
  const [folder, setFolder] = useState("inbox");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [attachments, setAttachments] = useState<InboxAttachment[]>([]);
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
  const [createdConversation, setCreatedConversation] =
    useState<InboxConversation | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

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
    integrations,
    byPlatform,
    identityBySurface,
    isLoading: integrationsLoading,
  } = useIntegrations();
  const inboxIntegrations = useMemo(
    () =>
      INTEGRATIONS.filter((integration) =>
        INBOX_PLATFORMS.has(integration.platform)
      ),
    []
  );
  const manageConnections = manageFor
    ? (byPlatform.get(manageFor.platform) ?? [])
    : [];
  const accounts = useMemo(
    () =>
      integrations.filter(
        (item) => INBOX_PLATFORMS.has(item.platform) && item.status === "active"
      ),
    [integrations]
  );
  const startableAccounts = useMemo(
    () =>
      accounts.filter(
        (account) =>
          ["gmail", "email", "outlook"].includes(account.platform) ||
          (account.platform === "telegram" &&
            account.metadata?.telegramMode !== "business_bot") ||
          account.platform === "whatsapp" ||
          (account.platform === "x" && account.scopes.includes("dm.write"))
      ),
    [accounts]
  );
  const selectedAccount = accounts.find(
    (account) => account._id === selectedAccountId
  );
  const filters = useMemo<InboxFilters>(
    () => ({
      integrationId: selectedAccount?._id,
      platform: selectedAccount?.platform,
      status,
      search: deferredSearch || undefined,
      sort,
      folder:
        selectedAccount &&
        ["gmail", "email", "outlook"].includes(selectedAccount.platform)
          ? folder
          : undefined,
    }),
    [deferredSearch, folder, selectedAccount, sort, status]
  );

  const {
    data: conversationPages,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteInboxConversations(filters);
  const conversations = useMemo(
    () => conversationPages?.pages.flatMap((page) => page.conversations) ?? [],
    [conversationPages]
  );
  const { data: messages = [], isLoading: messagesLoading } = useInboxMessages(
    activeId || undefined
  );
  useInboxRealtime(activeId || undefined);
  const sendMutation = useSendMessage();
  const sendTemplateMutation = useSendWhatsAppTemplate();
  const retryMutation = useRetryInboxMessage();
  const markReadMutation = useMarkConversationAsRead();
  const markAllMutation = useMarkAllConversationsAsRead();
  const statusMutation = useUpdateConversationStatus();
  const deleteMutation = useDeleteConversation();
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
    ].includes(account.platform)
  );
  const historyAccounts = syncableAccounts.filter((account) =>
    ["gmail", "outlook", "instagram", "linkedin", "messenger", "x"].includes(
      account.platform
    )
  );

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
    if (activeId && !activeConversation) setActiveId(null);
  }, [activeConversation, activeId]);

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
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    setReply("");
    setAttachments([]);
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
    const content = reply.trim();
    if ((!content && attachments.length === 0) || !activeId) return;
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
    setShowEmoji(false);
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
    <div
      className='animate-in fade-in slide-in-from-bottom-4 flex min-h-[calc(100dvh-8rem)] w-full min-w-0 flex-col gap-5 duration-500'
      style={{ height: "100%", minHeight: 0, gap: "1rem", overflow: "hidden" }}
    >
      <header className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Unified Inbox
          </h1>
        </div>
        <div className='flex flex-wrap gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='rounded-md bg-indigo-600 text-white hover:bg-indigo-700'>
                Channel <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-64'>
              <DropdownMenuLabel>Inbox channels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {inboxIntegrations.map((integration) => {
                const hasIdentityForSurface = isMetaSurface(
                  integration.platform
                )
                  ? identityBySurface.has(integration.platform)
                  : false;
                const integrationStatus = resolveStatus(
                  integration,
                  byPlatform.get(integration.platform),
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
              <DropdownMenuLabel>Inbox settings</DropdownMenuLabel>
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
                  <LoadingFileLoader size={16} />
                ) : (
                  <CheckCheck className='mr-2 h-4 w-4' />
                )}
                Mark all read
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!syncableAccounts.length || syncMutation.isPending}
                onSelect={() => syncChannels(false)}
              >
                {syncMutation.isPending ? (
                  <LoadingFileLoader size={16} />
                ) : (
                  <RefreshCw className='mr-2 h-4 w-4' />
                )}
                Sync connected channels
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!historyAccounts.length || syncMutation.isPending}
                onSelect={() => syncChannels(true)}
              >
                <Archive className='mr-2 h-4 w-4' />
                Import older channel history
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/plugin'>
                  <Settings className='mr-2 h-4 w-4' />
                  Manage plugins
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className='grid min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(420px,1fr)_280px] dark:border-white/10 dark:bg-zinc-950'>
        <aside
          className={`${activeId ? "hidden xl:flex" : "flex"} min-h-0 min-w-0 flex-col border-r border-black/5 dark:border-white/10`}
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='relative h-10 w-10 shrink-0 rounded-xl'
                    aria-label='Select connected brand'
                    title='Connected brand'
                  >
                    {selectedAccount ? (
                      <PlatformIcon
                        platform={selectedAccount.platform}
                        className='h-4 w-4'
                      />
                    ) : (
                      <Shapes className='h-4 w-4' />
                    )}
                    {selectedAccountId !== "all" && (
                      <CheckCircle className='absolute top-1.5 right-1 size-[12px] rounded-full bg-indigo-500' />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-64'>
                  <DropdownMenuLabel>Connected brand</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={selectedAccountId}
                    onValueChange={setSelectedAccountId}
                  >
                    <DropdownMenuRadioItem value='all'>
                      <Inbox className='mr-2 h-4 w-4' />
                      <span className='flex min-w-0 flex-col'>
                        <span>All accounts</span>
                        <span className='text-muted-foreground text-[10px]'>
                          Every connected channel
                        </span>
                      </span>
                    </DropdownMenuRadioItem>
                    {accounts.map((account) => (
                      <DropdownMenuRadioItem
                        key={account._id}
                        value={account._id}
                      >
                        <PlatformIcon
                          platform={account.platform}
                          className='mr-2 h-4 w-4'
                        />
                        <span className='min-w-0 flex-1 truncate'>
                          {account.accountName ||
                            PLATFORM_LABELS[account.platform]}
                        </span>
                        {account.isPrimary && (
                          <span className='text-muted-foreground text-[9px]'>
                            Primary
                          </span>
                        )}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                  {!integrationsLoading && accounts.length === 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href='/plugin'>
                          <Plus className='mr-2 h-4 w-4' />
                          Connect a channel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='relative h-10 w-10 shrink-0 rounded-xl'
                    aria-label='Conversation view options'
                    title='View options'
                  >
                    <ListFilter className='h-4 w-4' />
                    {(status !== "all" ||
                      sort !== "newest" ||
                      folder !== "inbox") && (
                      <span className='absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500' />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-52'>
                  <DropdownMenuLabel>Show conversations</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={status || "all"}
                    onValueChange={(value) =>
                      setStatus(value as InboxFilters["status"])
                    }
                  >
                    <DropdownMenuRadioItem value='all'>
                      All conversations
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='open'>
                      Open
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='resolved'>
                      Resolved
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='snoozed'>
                      Snoozed
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  {selectedAccount &&
                    ["gmail", "email", "outlook"].includes(
                      selectedAccount.platform
                    ) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Mailbox</DropdownMenuLabel>
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
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) =>
                      setSort(value as NonNullable<InboxFilters["sort"]>)
                    }
                  >
                    <DropdownMenuRadioItem value='newest'>
                      Newest first
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='oldest'>
                      Oldest first
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='unread'>
                      Unread first
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* {isFetching && (
                <div className=''>
                  <LoadingFileLoader size={16} />
                </div>
              )} */}
            </div>
            {selectedConversationIds.size > 0 && (
              <div className='mt-2 flex flex-wrap items-center gap-2 border-t border-black/5 pt-2 dark:border-white/10'>
                <label className='flex cursor-pointer items-center gap-2 text-xs font-medium'>
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
                  Select all · {selectedConversationIds.size} selected
                </label>
                <span className='flex-1' />
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={bulkBusy}
                  onClick={() => runBulkAction("read")}
                  title='Mark as read'
                  aria-label='Mark selected conversations as read'
                >
                  <CheckCheck className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={bulkBusy}
                  onClick={() => runBulkAction("resolved")}
                  title='Resolve'
                  aria-label='Resolve selected conversations'
                >
                  <CheckCircle className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={bulkBusy}
                  onClick={() => runBulkAction("snoozed")}
                  title='Snooze'
                  aria-label='Snooze selected conversations'
                >
                  <Clock3 className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={bulkBusy}
                  onClick={() => setBulkDeleteOpen(true)}
                  className='text-red-600 hover:text-red-700'
                  title='Delete'
                  aria-label='Delete selected conversations'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={bulkBusy}
                  onClick={() => setSelectedConversationIds(new Set())}
                  title='Cancel selection'
                  aria-label='Cancel conversation selection'
                >
                  <XCircle className='h-4 w-4' />
                </Button>
              </div>
            )}
          </div>

          <div className='flex-1 overflow-y-auto p-2'>
            {isLoading ? (
              <div className='text-muted-foreground mt-40 flex h-40 items-center justify-center text-sm'>
                <LoadingFileLoader size={16} />
              </div>
            ) : conversations.length === 0 ? (
              <div className='flex h-full min-h-72 flex-col items-center justify-center px-8 text-center'>
                <span className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900'>
                  <Inbox className='text-muted-foreground h-6 w-6' />
                </span>
                <h3 className='text-sm font-semibold'>No conversations here</h3>
                <p className='text-muted-foreground mt-1 text-xs leading-5'>
                  Try another account or filter. Connected Gmail accounts sync
                  recent threads automatically; use Inbox settings to import
                  older mail.
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
                        className={`mb-1 flex w-full cursor-pointer gap-3 rounded-2xl p-3 text-left transition ${selectedConversationIds.has(conversation._id) || activeId === conversation._id ? "bg-zinc-100 dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]"}`}
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
                        <div className='relative shrink-0'>
                          {conversation.customerAvatar ? (
                            <img
                              src={conversation.customerAvatar}
                              alt=''
                              className='h-11 w-11 rounded-full object-cover'
                            />
                          ) : (
                            <span className='flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800'>
                              {conversation.customerName
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
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
                              {conversation.lastMessage}
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
                          </span>
                        </span>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className='w-48'>
                      <ContextMenuCheckboxItem
                        checked={selectedConversationIds.has(conversation._id)}
                        onSelect={(event) => event.preventDefault()}
                        onCheckedChange={() =>
                          toggleConversationSelection(conversation._id)
                        }
                      >
                        Select
                      </ContextMenuCheckboxItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
                <div
                  ref={loadMoreRef}
                  className='flex h-10 items-center justify-center'
                >
                  {isFetchingNextPage && <LoadingFileLoader size={16} />}
                </div>
              </>
            )}
          </div>
        </aside>

        <main
          className={`${activeId ? "flex" : "hidden xl:flex"} min-h-0 min-w-0 flex-col bg-zinc-50/40 dark:bg-black/20`}
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
                  {activeConversation.customerAvatar ? (
                    <img
                      src={activeConversation.customerAvatar}
                      alt=''
                      className='h-9 w-9 rounded-full object-cover'
                    />
                  ) : (
                    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800'>
                      {activeConversation.customerName.charAt(0)}
                    </span>
                  )}
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
                      Reopen
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
                      Resolve
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
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => changeStatus("open")}>
                        <Inbox className='mr-2 h-4 w-4' />
                        Mark open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeStatus("snoozed")}>
                        <Clock3 className='mr-2 h-4 w-4' />
                        Snooze
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => changeStatus("resolved")}
                      >
                        <Check className='mr-2 h-4 w-4' />
                        Resolve
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='text-red-600 focus:text-red-600'
                        onClick={() => setDeleteTarget(activeConversation)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
                {messagesLoading ? (
                  <div className='text-muted-foreground flex h-40 items-center justify-center text-sm'>
                    <div className='mr-2'>
                      <LoadingFileLoader size={16} />
                    </div>
                    Loading messages
                  </div>
                ) : (
                  <div className='mx-auto max-w-3xl space-y-5'>
                    {messages.map((message) => {
                      const inbound = message.senderType === "customer";
                      const emailHtml =
                        ["gmail", "email", "outlook"].includes(
                          activeConversation.platform
                        ) && typeof message.metadata?.contentHtml === "string"
                          ? message.metadata.contentHtml
                          : "";
                      return (
                        <div
                          key={message._id}
                          className={`flex flex-col ${inbound ? "items-start" : "items-end"}`}
                        >
                          <div
                            className={`group/message flex items-center gap-1 ${emailHtml ? "w-full max-w-full" : "max-w-[90%] sm:max-w-[82%]"} ${inbound ? "flex-row" : "flex-row-reverse"}`}
                          >
                            <div
                              className={`min-w-0 overflow-hidden rounded-2xl text-sm leading-6 shadow-sm ${emailHtml ? "w-full max-w-3xl bg-white ring-1 ring-black/5 dark:ring-white/10" : inbound ? "rounded-tl-md bg-white ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10" : message.status === "failed" ? "rounded-tr-md bg-red-600 text-white" : "rounded-tr-md bg-indigo-600 text-white"}`}
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
                                  ) : attachment.kind === "image" ? (
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className='max-h-72 w-full object-cover'
                                    />
                                  ) : attachment.kind === "video" ? (
                                    <video
                                      src={attachment.url}
                                      controls
                                      className='max-h-72 w-full'
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
                                    fallback={message.content}
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
                                      <Pencil className='mr-2 h-4 w-4' /> Edit
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
                                      <Trash2 className='mr-2 h-4 w-4' /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                          </div>
                          <span className='text-muted-foreground mt-1.5 flex items-center gap-1 px-1 text-[10px]'>
                            {relativeTime(message.createdAt)}
                            {!inbound &&
                              (message.status === "sending" ? (
                                <LoadingFileLoader size={16} />
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
                                  Retry
                                </button>
                              ) : (
                                <>
                                  <CheckCheck className='h-3 w-3' />
                                  {message.status}
                                </>
                              ))}
                          </span>
                          {message.status === "failed" && message.error && (
                            <span className='max-w-xs px-1 text-right text-[10px] text-red-600'>
                              {message.error}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className='shrink-0 border-t border-black/5 bg-white p-2 dark:border-white/10 dark:bg-zinc-950'>
                {activeConversation.status === "resolved" ? (
                  <div className='text-muted-foreground flex items-center justify-center gap-2 rounded-2xl bg-zinc-100 p-4 text-sm dark:bg-zinc-900'>
                    <Check className='h-4 w-4' />
                    This conversation is resolved.{" "}
                    <button
                      className='font-semibold text-indigo-700 hover:underline dark:text-indigo-400'
                      onClick={() => changeStatus("open")}
                    >
                      Reopen to reply
                    </button>
                  </div>
                ) : providerReplyUnavailable ? (
                  <div className='text-muted-foreground mx-auto max-w-3xl rounded-2xl bg-zinc-100 p-4 text-sm dark:bg-zinc-900'>
                    Telegram Business reply access is not active. Reauthorize
                    the Business Bot with permission to read and reply to
                    messages. You can still review, label, and resolve this
                    conversation.
                  </div>
                ) : whatsappReplyWindowClosed ? (
                  <div className='mx-auto max-w-3xl space-y-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100'>
                    <p>
                      WhatsApp’s 24-hour reply window has closed. Send an
                      approved template here; normal replies become available
                      after the customer responds.
                    </p>
                    {templatesLoading ? (
                      <div className='flex items-center gap-2'>
                        <Loader2 className='h-4 w-4 animate-spin' /> Loading
                        templates…
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
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          )}
                          Send template
                        </Button>
                      </div>
                    ) : (
                      <p>No approved WhatsApp templates are available.</p>
                    )}
                  </div>
                ) : telegramBusinessReplyWindowClosed ? (
                  <div className='mx-auto max-w-3xl rounded-2xl bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100'>
                    Telegram Business replies are available for 24 hours after
                    the customer&apos;s latest message. Wait for the customer to
                    message the business account again before replying.
                  </div>
                ) : (
                  <div className='relative mx-auto max-w-3xl rounded-2xl border border-black/10 bg-zinc-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-white/10 dark:bg-zinc-900'>
                    {attachments.length > 0 && (
                      <div className='flex gap-2 overflow-x-auto border-b border-black/5 p-3 dark:border-white/10'>
                        {attachments.map((attachment) => (
                          <div
                            key={attachment.url}
                            className='relative flex h-14 min-w-fit items-center gap-2 rounded-xl bg-white p-2 text-xs shadow-sm dark:bg-zinc-800'
                          >
                            {attachment.kind === "image" ? (
                              <img
                                src={attachment.url}
                                alt=''
                                className='h-10 w-10 rounded-lg object-cover'
                              />
                            ) : (
                              <Paperclip className='h-5 w-5 shrink-0' />
                            )}
                            {/* <span className='truncate line-clamp-1 w-[20px]'>{attachment.name}</span> */}
                            <button
                              onClick={() =>
                                setAttachments((current) =>
                                  current.filter(
                                    (item) => item.url !== attachment.url
                                  )
                                )
                              }
                              className='text-muted-foreground bg-foreground absolute top-1.5 right-1.5 rounded-full'
                              aria-label={`Remove ${attachment.name}`}
                            >
                              <XCircle className='h-4 w-4' />
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
                      className='field-sizing-content max-h-32 min-h-10 w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-5 outline-none'
                    />
                    <div className='flex items-baseline justify-between gap-2 px-3 pb-3'>
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
                          className='h-8 w-8 rounded-full'
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
                            <LoadingFileLoader size={16} />
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
                              className='h-8 w-8 rounded-full'
                              aria-label='Add emoji'
                            >
                              <Smile className='h-4 w-4' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side='top'
                            align='start'
                            collisionPadding={12}
                            className='w-auto max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border-0 bg-transparent p-0 shadow-xl'
                          >
                            <EmojiPicker
                              onEmojiClick={insertEmoji}
                              autoFocusSearch
                              lazyLoadEmojis
                              searchPlaceholder='Search emojis'
                              theme={"auto" as EmojiTheme}
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
                          className='h-fit rounded-full border py-1 text-xs'
                          disabled={isWriting}
                          onClick={writeWithAi}
                        >
                          {isWriting ? <LoadingFileLoader size={16} /> : <></>}
                          AI Write
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
                        className='relative cursor-pointer rounded-[10px] bg-[linear-gradient(to_top,#292929,#555555,#292929)] p-[2px] shadow-[inset_0_6px_2px_-4px_rgba(255,255,255,.5)] transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
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
                            <LoadingFileLoader size={16} />
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
              <span className='mb-5 flex h-52 w-auto items-center justify-center rounded-3xl shadow-sm ring-1 ring-black/5 bg-zinc-200 dark:ring-white/10'>
                <Image
                  src='/chat.svg'
                  height='200'
                  width='200'
                  alt='chat logo'
                  className=''
                />
              </span>
              <h2 className='text-muted-foreground text-lg font-medium'>
                Multi Channel As One
              </h2>
            </div>
          )}
        </main>
        <aside className='hidden min-h-0 border-l 2xl:block'>
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

      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side='right' className='w-[92vw] p-0 sm:max-w-sm'>
          {activeConversation && (
            <ContactDetails
              conversation={activeConversation}
              saving={updateConversationMutation.isPending}
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
          )}
        </SheetContent>
      </Sheet>

      <NewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
        accounts={startableAccounts}
        pending={createConversationMutation.isPending}
        onCreate={(input) =>
          createConversationMutation.mutate(input, {
            onSuccess: (conversation) => {
              setShowNewConversation(false);
              setCreatedConversation(conversation);
              setActiveId(conversation._id);
              toast.success("Conversation created");
            },
            onError: (error: any) =>
              toast.error(
                error?.response?.data?.message ||
                  "Conversation could not be created"
              ),
          })
        }
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the conversation with{" "}
              {deleteTarget?.customerName} and its message history. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-600 text-white hover:bg-red-700'
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete conversation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected conversations?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {selectedConversationIds.size}{" "}
              conversations and their message history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkBusy}>Cancel</AlertDialogCancel>
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
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the message from Genit. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
