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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  useCreateConversation,
  useDeleteConversation,
  useDeleteInboxMessage,
  useInboxConversations,
  useInboxMessages,
  useInboxRealtime,
  useMarkAllConversationsAsRead,
  useMarkConversationAsRead,
  useRetryInboxMessage,
  useSendMessage,
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
  downloadInboxAttachment,
  generateInboxDraft,
  uploadInboxAttachment,
} from "@/lib/inbox-api";
import {
  type IntegrationConnection,
  type IntegrationPlatform,
  isMetaSurface,
} from "@/lib/integrations-api";
import { LoadingFileLoader } from "@/utils/Loading";
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
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

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
  telegram: "Telegram",
};

const QUICK_EMOJIS = [
  "😀",
  "😊",
  "🙏",
  "❤️",
  "👍",
  "🎉",
  "✨",
  "😂",
  "🤝",
  "✅",
  "🔥",
  "💡",
];

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
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [attachments, setAttachments] = useState<InboxAttachment[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InboxConversation | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [createdConversation, setCreatedConversation] =
    useState<InboxConversation | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Lock parent layout ancestors to viewport height so only the
     messages column scrolls – uses inline styles because dynamically
     added Tailwind classes aren't compiled into the CSS bundle. */
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");

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
          ["gmail", "email", "telegram"].includes(account.platform) ||
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
    }),
    [deferredSearch, selectedAccount, sort, status]
  );

  const {
    data: conversations = [],
    isLoading,
    isFetching,
  } = useInboxConversations(filters);
  const { data: messages = [], isLoading: messagesLoading } = useInboxMessages(
    activeId || undefined
  );
  useInboxRealtime(activeId || undefined);
  const sendMutation = useSendMessage();
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
    ? !["x", "twitter"].includes(activeConversation.platform)
    : true;
  const whatsappReplyWindowClosed = Boolean(
    activeConversation?.platform === "whatsapp" &&
    (!activeConversation.metadata?.lastInboundAt ||
      Date.now() -
        Date.parse(String(activeConversation.metadata.lastInboundAt)) >
        24 * 60 * 60 * 1000)
  );
  const providerReplyUnavailable = Boolean(
    activeConversation &&
    ["linkedin", "outlook"].includes(activeConversation.platform)
  );
  const syncableAccounts = accounts.filter((account) =>
    ["gmail", "instagram", "messenger", "whatsapp", "telegram", "x"].includes(
      account.platform
    )
  );
  const historyAccounts = syncableAccounts.filter((account) =>
    ["gmail", "instagram", "messenger", "x"].includes(account.platform)
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
    setReply("");
    setAttachments([]);
    setShowEmoji(false);
  }, [activeId]);

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

  return (
    <div
      className='animate-in fade-in slide-in-from-bottom-4 flex min-h-[calc(100vh-8rem)] w-full flex-col gap-5 duration-500'
      style={{ height: "100%", minHeight: 0, gap: "1rem", overflow: "hidden" }}
    >
      <header className='flex items-end justify-between lg:items-end'>
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
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
                <Link href='/integrations'>
                  <Settings className='mr-2 h-4 w-4' />
                  Manage integrations
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className='grid min-h-0 flex-1 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm lg:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(420px,1fr)_280px] dark:border-white/10 dark:bg-zinc-950'>
        <aside
          className={`${activeId ? "hidden lg:flex" : "flex"} min-h-0 flex-col border-r border-black/5 dark:border-white/10`}
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
                      <DropdownMenuItem
                        key={account._id}
                        // value={account._id}
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
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuRadioGroup>
                  {!integrationsLoading && accounts.length === 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href='/integrations'>
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
                    {(status !== "all" || sort !== "newest") && (
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

              {isFetching && (
                <div className=''>
                  <LoadingFileLoader size={16} />
                </div>
              )}
            </div>
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
              conversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => setActiveId(conversation._id)}
                  className={`mb-1 flex w-full gap-3 rounded-2xl p-3 text-left transition ${activeId === conversation._id ? "bg-zinc-100 dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]"}`}
                >
                  <div className='relative shrink-0'>
                    {conversation.customerAvatar ? (
                      <img
                        src={conversation.customerAvatar}
                        alt=''
                        className='h-11 w-11 rounded-full object-cover'
                      />
                    ) : (
                      <span className='flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800'>
                        {conversation.customerName.charAt(0).toUpperCase()}
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
                </button>
              ))
            )}
          </div>
        </aside>

        <main
          className={`${activeId ? "flex" : "hidden lg:flex"} min-h-0 min-w-0 flex-col bg-zinc-50/40 dark:bg-black/20`}
        >
          {activeConversation ? (
            <>
              <div className='flex h-14 shrink-0 items-center justify-between gap-3 border-b border-black/5 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-white/10 dark:bg-zinc-950/80'>
                <div className='flex min-w-0 items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='shrink-0 rounded-full lg:hidden'
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
                  <div className='min-w-0'>
                    <div className='flex flex-row items-center gap-2'>
                      <h2 className='truncate text-sm font-semibold'>
                        {activeConversation.customerName}
                      </h2>
                      <p className='text-muted-foreground flex items-center gap-1.5 truncate text-xs'>
                        <PlatformIcon
                          platform={activeConversation.platform}
                          className='h-3 w-3'
                        />
                        {PLATFORM_LABELS[activeConversation.platform]}
                        {activeConversation.customerHandle
                          ? ` · ${activeConversation.customerHandle}`
                          : ""}
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
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Loading messages
                  </div>
                ) : (
                  <div className='mx-auto max-w-3xl space-y-5'>
                    {messages.map((message) => {
                      const inbound = message.senderType === "customer";
                      return (
                        <div
                          key={message._id}
                          className={`flex flex-col ${inbound ? "items-start" : "items-end"}`}
                        >
                          <div
                            className={`group/message flex max-w-[90%] items-center gap-1 sm:max-w-[82%] ${inbound ? "flex-row" : "flex-row-reverse"}`}
                          >
                            <div
                              className={`rounded-2xl text-sm leading-6 shadow-sm ${inbound ? "rounded-tl-md bg-white ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10" : message.status === "failed" ? "rounded-tr-md bg-red-600 text-white" : "rounded-tr-md bg-indigo-600 text-white"}`}
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
                              {message.content && (
                                <div className='px-4 py-3 wrap-anywhere whitespace-pre-wrap'>
                                  {message.content}
                                </div>
                              )}
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
                                      onClick={() => {
                                        if (
                                          window.confirm("Delete this message?")
                                        )
                                          deleteMessageMutation.mutate(
                                            {
                                              messageId: message._id,
                                              conversationId:
                                                activeConversation._id,
                                            },
                                            {
                                              onError: (error: any) =>
                                                toast.error(
                                                  error?.response?.data
                                                    ?.message ||
                                                    "Message could not be deleted"
                                                ),
                                            }
                                          );
                                      }}
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
                                <Loader2 className='h-3 w-3 animate-spin' />
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

              <div className='shrink-0 border-t border-black/5 bg-white p-4 dark:border-white/10 dark:bg-zinc-950'>
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
                    Replies are not available for this provider connection yet.
                    You can still review, label, and resolve the conversation.
                  </div>
                ) : whatsappReplyWindowClosed ? (
                  <div className='text-muted-foreground mx-auto max-w-3xl rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'>
                    WhatsApp’s 24-hour reply window has closed. Send an approved
                    template through your WhatsApp campaign tools; normal
                    replies will become available after the customer responds.
                  </div>
                ) : (
                  <div className='relative mx-auto max-w-3xl rounded-2xl border border-black/10 bg-zinc-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-white/10 dark:bg-zinc-900'>
                    {attachments.length > 0 && (
                      <div className='flex gap-2 overflow-x-auto border-b border-black/5 p-3 dark:border-white/10'>
                        {attachments.map((attachment) => (
                          <div
                            key={attachment.url}
                            className='relative flex h-14 min-w-36 items-center gap-2 rounded-xl bg-white p-2 pr-8 text-xs shadow-sm dark:bg-zinc-800'
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
                            <span className='truncate'>{attachment.name}</span>
                            <button
                              onClick={() =>
                                setAttachments((current) =>
                                  current.filter(
                                    (item) => item.url !== attachment.url
                                  )
                                )
                              }
                              className='text-muted-foreground hover:text-foreground absolute top-1.5 right-1.5'
                              aria-label={`Remove ${attachment.name}`}
                            >
                              <XCircle className='h-4 w-4' />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <textarea
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          sendReply();
                        }
                      }}
                      placeholder={`Reply to ${activeConversation.customerName}…`}
                      maxLength={
                        ["x", "twitter"].includes(
                          activeConversation.platform
                        ) && activeConversation.metadata?.kind !== "dm"
                          ? 280
                          : undefined
                      }
                      className='min-h-20 w-full resize-none bg-transparent px-2 py-2 text-sm outline-none'
                    />
                    <div className='flex items-center justify-between gap-2 px-3 pb-3'>
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
                              : "Attachments are unavailable for X replies"
                          }
                        >
                          {isUploading ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Paperclip className='h-4 w-4' />
                          )}
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 rounded-full'
                          onClick={() => setShowEmoji((open) => !open)}
                          aria-label='Add emoji'
                        >
                          <Smile className='h-4 w-4' />
                        </Button>
                        {showEmoji && (
                          <div className='bg-popover text-popover-foreground absolute bottom-11 left-0 z-20 grid w-48 grid-cols-6 gap-1 rounded-xl border p-2 shadow-lg'>
                            {QUICK_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type='button'
                                className='hover:bg-muted rounded-md p-1 text-lg'
                                onClick={() => {
                                  setReply((current) => current + emoji);
                                  setShowEmoji(false);
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-8 rounded-full text-xs'
                          disabled={isWriting}
                          onClick={writeWithAi}
                        >
                          {isWriting ? (
                            <Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
                          ) : (
                            <Sparkles className='mr-1.5 h-3.5 w-3.5' />
                          )}
                          AI Write
                        </Button>
                      </div>
                      {/* <Button
                        size='icon'
                        onClick={sendReply}
                        disabled={
                          (!reply.trim() && attachments.length === 0) ||
                          sendMutation.isPending ||
                          isUploading
                        }
                        className='h-9 w-9 rounded-full bg-indigo-600 text-white hover:bg-indigo-700'
                      >
                        {sendMutation.isPending ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Send className='h-4 w-4' />
                        )}
                      </Button> */}
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
                            <Loader2 className='h-4 w-4 animate-spin text-white' />
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
              <span className='mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10'>
                <Image
                  src='/gennit2.png'
                  height='200'
                  width='200'
                  alt='logo'
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
