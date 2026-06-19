"use client";

import {
  FacebookBrand,
  GmailBrand,
  InstagramBrand,
  LinkedinBrand,
  MessengerBrand,
  TelegramBrand,
  WhatsAppBrand,
  XBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
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
import {
  useDeleteConversation,
  useInboxConversations,
  useInboxMessages,
  useMarkAllConversationsAsRead,
  useMarkConversationAsRead,
  useSendMessage,
  useUpdateConversationStatus,
} from "@/hooks/use-inbox";
import { useIntegrations } from "@/hooks/use-integrations";
import type { InboxConversation, InboxFilters } from "@/lib/inbox-api";
import type { IntegrationConnection, IntegrationPlatform } from "@/lib/integrations-api";
import {
  Archive,
  ArrowUpDown,
  Check,
  CheckCheck,
  ChevronLeft,
  Circle,
  Clock3,
  Inbox,
  Loader2,
  ListFilter,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Shapes,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const INBOX_PLATFORMS = new Set<IntegrationPlatform>([
  "facebook", "instagram", "linkedin", "x", "gmail", "outlook",
  "whatsapp", "messenger", "telegram",
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

function PlatformIcon({ platform, className = "h-4 w-4" }: { platform: string; className?: string }) {
  switch (platform) {
    case "instagram": return <InstagramBrand className={className} />;
    case "facebook": return <FacebookBrand className={className} />;
    case "x":
    case "twitter": return <XBrand className={className} />;
    case "linkedin": return <LinkedinBrand className={className} />;
    case "gmail":
    case "email":
    case "outlook": return <GmailBrand className={className} />;
    case "whatsapp": return <WhatsAppBrand className={className} />;
    case "messenger": return <MessengerBrand className={className} />;
    case "telegram": return <TelegramBrand className={className} />;
    default: return <MessageSquare className={className} />;
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
    <div className="relative h-10 w-10 shrink-0">
      {account.accountAvatar ? (
        <img src={account.accountAvatar} alt="" className="h-10 w-10 rounded-xl object-cover ring-1 ring-black/10 dark:ring-white/10" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-sm font-semibold text-zinc-600 ring-1 ring-black/5 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-white/10">
          {account.accountName?.charAt(0).toUpperCase() || "?"}
        </div>
      )}
      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white dark:bg-zinc-950 dark:ring-zinc-950">
        <PlatformIcon platform={account.platform} className="h-3 w-3" />
      </span>
    </div>
  );
}

export default function InboxPage() {
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [status, setStatus] = useState<InboxFilters["status"]>("all");
  const [sort, setSort] = useState<NonNullable<InboxFilters["sort"]>>("newest");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<InboxConversation | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { integrations, isLoading: integrationsLoading } = useIntegrations();
  const accounts = useMemo(
    () => integrations.filter((item) => INBOX_PLATFORMS.has(item.platform) && item.status === "active"),
    [integrations]
  );
  const selectedAccount = accounts.find((account) => account._id === selectedAccountId);
  const filters = useMemo<InboxFilters>(() => ({
    integrationId: selectedAccount?._id,
    platform: selectedAccount?.platform,
    status,
    search: deferredSearch || undefined,
    sort,
  }), [deferredSearch, selectedAccount, sort, status]);

  const { data: conversations = [], isLoading, isFetching } = useInboxConversations(filters);
  const { data: messages = [], isLoading: messagesLoading } = useInboxMessages(activeId || undefined);
  const sendMutation = useSendMessage();
  const markReadMutation = useMarkConversationAsRead();
  const markAllMutation = useMarkAllConversationsAsRead();
  const statusMutation = useUpdateConversationStatus();
  const deleteMutation = useDeleteConversation();
  const activeConversation = conversations.find((conversation) => conversation._id === activeId) || null;
  const unreadTotal = conversations.reduce((total, conversation) => total + conversation.unreadCount, 0);

  useEffect(() => {
    if (activeId && !activeConversation) setActiveId(null);
  }, [activeConversation, activeId]);

  useEffect(() => {
    if (activeConversation?.unreadCount) markReadMutation.mutate(activeConversation._id);
  }, [activeConversation?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = () => {
    const content = reply.trim();
    if (!content || !activeId) return;
    sendMutation.mutate({ conversationId: activeId, content }, {
      onSuccess: () => setReply(""),
      onError: () => toast.error("Your reply could not be sent"),
    });
  };

  const changeStatus = (nextStatus: InboxConversation["status"]) => {
    if (!activeId) return;
    statusMutation.mutate({ conversationId: activeId, status: nextStatus }, {
      onSuccess: () => toast.success(nextStatus === "resolved" ? "Conversation resolved" : nextStatus === "snoozed" ? "Conversation snoozed" : "Conversation reopened"),
      onError: () => toast.error("Conversation could not be updated"),
    });
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
    <div className="flex min-h-[calc(100vh-8rem)] w-full animate-in flex-col gap-5 fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {/* <div className="mb-2 flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {accounts.length} connected {accounts.length === 1 ? "account" : "accounts"}
          </div> */}
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Unified Inbox</h1>
          <p className="mt-1 text-sm text-muted-foreground">Read and respond across every connected brand channel.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            disabled={!unreadTotal || markAllMutation.isPending}
            onClick={() => markAllMutation.mutate(undefined, {
              onSuccess: () => toast.success("Everything is marked as read"),
              onError: () => toast.error("Messages could not be updated"),
            })}
          >
            {markAllMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCheck className="mr-2 h-4 w-4" />}
            Mark all read
          </Button>
          <Button asChild className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
            <Link href="/integrations"><Plus className="mr-2 h-4 w-4" />Connect channel</Link>
          </Button>
        </div>
      </header>

      <div className="grid min-h-[650px] flex-1 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950 lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className={`${activeId ? "hidden lg:flex" : "flex"} min-h-0 flex-col border-r border-black/5 dark:border-white/10`}>
          <div className="border-b border-black/5 p-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people or messages" className="h-10 rounded-xl border-black/10 bg-zinc-50 pl-9 dark:border-white/10 dark:bg-zinc-900" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative h-10 w-10 shrink-0 rounded-xl" aria-label="Select connected brand" title="Connected brand">
                    {selectedAccount ? <PlatformIcon platform={selectedAccount.platform} className="h-4 w-4" /> : <Shapes className="h-4 w-4" />}
                    {selectedAccountId !== "all" && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Connected brand</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={selectedAccountId} onValueChange={setSelectedAccountId}>
                    <DropdownMenuRadioItem value="all">
                      <Inbox className="mr-2 h-4 w-4" />
                      <span className="flex min-w-0 flex-col"><span>All accounts</span><span className="text-[10px] text-muted-foreground">Every connected channel</span></span>
                    </DropdownMenuRadioItem>
                    {accounts.map((account) => (
                      <DropdownMenuRadioItem key={account._id} value={account._id}>
                        <PlatformIcon platform={account.platform} className="mr-2 h-4 w-4" />
                        <span className="min-w-0 flex-1 truncate">{account.accountName || PLATFORM_LABELS[account.platform]}</span>
                        {account.isPrimary && <span className="text-[9px] text-muted-foreground">Primary</span>}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                  {!integrationsLoading && accounts.length === 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href="/integrations"><Plus className="mr-2 h-4 w-4" />Connect a channel</Link></DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative h-10 w-10 shrink-0 rounded-xl" aria-label="Filter conversations" title="Conversation filter">
                    <ListFilter className="h-4 w-4" />
                    {status !== "all" && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Conversations</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={status || "all"} onValueChange={(value) => setStatus(value as InboxFilters["status"])}>
                    <DropdownMenuRadioItem value="all">All conversations</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="open">Open</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="resolved">Resolved</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="snoozed">Snoozed</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative h-10 w-10 shrink-0 rounded-xl" aria-label="Sort conversations" title="Sort conversations">
                    <ArrowUpDown className="h-4 w-4" />
                    {sort !== "newest" && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value as NonNullable<InboxFilters["sort"]>)}>
                    <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="unread">Unread first</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {isFetching && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" aria-label="Syncing inbox" />}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading inbox</div>
            ) : conversations.length === 0 ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center px-8 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900"><Inbox className="h-6 w-6 text-muted-foreground" /></span>
                <h3 className="text-sm font-semibold">No conversations here</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Try another account or filter. New incoming messages will appear automatically.</p>
              </div>
            ) : conversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => setActiveId(conversation._id)}
                className={`mb-1 flex w-full gap-3 rounded-2xl p-3 text-left transition ${activeId === conversation._id ? "bg-zinc-100 dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]"}`}
              >
                <div className="relative shrink-0">
                  {conversation.customerAvatar ? <img src={conversation.customerAvatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800">{conversation.customerName.charAt(0).toUpperCase()}</span>}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white dark:bg-zinc-950 dark:ring-zinc-950"><PlatformIcon platform={conversation.platform} className="h-3 w-3" /></span>
                </div>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${conversation.unreadCount ? "font-bold" : "font-medium"}`}>{conversation.customerName}</span>
                    <span className={`text-[10px] ${conversation.unreadCount ? "font-semibold text-emerald-600" : "text-muted-foreground"}`}>{relativeTime(conversation.lastMessageAt)}</span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span className={`min-w-0 flex-1 truncate text-xs ${conversation.unreadCount ? "font-medium text-foreground" : "text-muted-foreground"}`}>{conversation.lastMessage}</span>
                    {conversation.unreadCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">{conversation.unreadCount}</span>}
                  </span>
                  <span className="mt-1.5 flex items-center gap-1 text-[10px] capitalize text-muted-foreground"><Circle className={`h-1.5 w-1.5 fill-current ${conversation.status === "open" ? "text-emerald-500" : conversation.status === "snoozed" ? "text-amber-500" : "text-zinc-400"}`} />{conversation.status}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <main className={`${activeId ? "flex" : "hidden lg:flex"} min-w-0 flex-col bg-zinc-50/40 dark:bg-black/20`}>
          {activeConversation ? (
            <>
              <div className="flex h-16 items-center justify-between gap-3 border-b border-black/5 bg-white/80 px-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/80 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <Button variant="ghost" size="icon" className="shrink-0 rounded-full lg:hidden" onClick={() => setActiveId(null)}><ChevronLeft className="h-5 w-5" /></Button>
                  {activeConversation.customerAvatar ? <img src={activeConversation.customerAvatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold dark:bg-zinc-800">{activeConversation.customerName.charAt(0)}</span>}
                  <div className="min-w-0"><h2 className="truncate text-sm font-semibold">{activeConversation.customerName}</h2><p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground"><PlatformIcon platform={activeConversation.platform} className="h-3 w-3" />{PLATFORM_LABELS[activeConversation.platform]}{activeConversation.customerHandle ? ` · ${activeConversation.customerHandle}` : ""}</p></div>
                </div>
                <div className="flex items-center gap-1">
                  {activeConversation.status === "resolved" ? (
                    <Button variant="outline" size="sm" className="hidden rounded-full sm:flex" disabled={statusMutation.isPending} onClick={() => changeStatus("open")}><Archive className="mr-2 h-4 w-4" />Reopen</Button>
                  ) : (
                    <Button variant="outline" size="sm" className="hidden rounded-full sm:flex" disabled={statusMutation.isPending} onClick={() => changeStatus("resolved")}><Check className="mr-2 h-4 w-4" />Resolve</Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-5 w-5" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => changeStatus("open")}><Inbox className="mr-2 h-4 w-4" />Mark open</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeStatus("snoozed")}><Clock3 className="mr-2 h-4 w-4" />Snooze</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeStatus("resolved")}><Check className="mr-2 h-4 w-4" />Resolve</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeleteTarget(activeConversation)}><Trash2 className="mr-2 h-4 w-4" />Delete conversation</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {messagesLoading ? <div className="flex h-40 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading messages</div> : (
                  <div className="mx-auto max-w-3xl space-y-5">
                    {messages.map((message) => {
                      const inbound = message.senderType === "customer";
                      return <div key={message._id} className={`flex flex-col ${inbound ? "items-start" : "items-end"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${inbound ? "rounded-tl-md bg-white ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10" : "rounded-tr-md bg-emerald-600 text-white"}`}>{message.content}</div><span className="mt-1.5 flex items-center gap-1 px-1 text-[10px] text-muted-foreground">{relativeTime(message.createdAt)}{!inbound && <CheckCheck className="h-3 w-3" />}</span></div>;
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="border-t border-black/5 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
                {activeConversation.status === "resolved" ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-100 p-4 text-sm text-muted-foreground dark:bg-zinc-900"><Check className="h-4 w-4" />This conversation is resolved. <button className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400" onClick={() => changeStatus("open")}>Reopen to reply</button></div>
                ) : (
                  <div className="relative mx-auto max-w-3xl">
                    <textarea value={reply} onChange={(event) => setReply(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendReply(); } }} placeholder={`Reply to ${activeConversation.customerName}…`} className="min-h-24 w-full resize-none rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 pr-14 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-zinc-900" />
                    <Button size="icon" onClick={sendReply} disabled={!reply.trim() || sendMutation.isPending} className="absolute bottom-3 right-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">{sendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center"><span className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10"><Inbox className="h-8 w-8 text-emerald-600" /></span><h2 className="text-lg font-semibold">Your conversations, in one place</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Choose a conversation to read, reply, snooze, resolve, or delete it.</p></div>
          )}
        </main>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this conversation?</AlertDialogTitle><AlertDialogDescription>This permanently removes the conversation with {deleteTarget?.customerName} and its message history. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">{deleteMutation.isPending ? "Deleting…" : "Delete conversation"}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
