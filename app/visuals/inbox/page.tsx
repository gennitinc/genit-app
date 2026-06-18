"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Send, CheckCircle2, Clock, MoreVertical, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientFrame } from "@/utils/gradient-frame";
import { 
  InstagramBrand, 
  FacebookBrand, 
  XBrand, 
  LinkedinBrand, 
  GmailBrand 
} from "@/app/(auth)/onboarding/_components/social-icons";
import { 
  useInboxConversations, 
  useInboxMessages, 
  useSendMessage, 
  useMarkConversationAsRead,
  useSeedMockInbox 
} from "@/hooks/use-inbox";

const PlatformIcon = ({ platform, className }: { platform: string, className?: string }) => {
  switch (platform) {
    case 'instagram': return <InstagramBrand className={className} />;
    case 'facebook': return <FacebookBrand className={className} />;
    case 'twitter': return <XBrand className={className} />;
    case 'linkedin': return <LinkedinBrand className={className} />;
    case 'email': return <GmailBrand className={className} />;
    default: return <MessageSquare className={className} />;
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

export default function InboxPage() {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: conversations, isLoading: isLoadingConvs } = useInboxConversations();
  const { data: messages, isLoading: isLoadingMessages } = useInboxMessages(activeConvId || undefined);
  
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkConversationAsRead();
  const seedMockMutation = useSeedMockInbox();

  const activeConversation = conversations?.find((c: any) => c._id === activeConvId);

  useEffect(() => {
    if (activeConvId) {
      markAsReadMutation.mutate(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!replyText.trim() || !activeConvId) return;
    sendMessageMutation.mutate({ conversationId: activeConvId, content: replyText });
    setReplyText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full min-h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white tracking-tight">Unified Inbox</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage all social interactions and emails in one place.</p>
        </div>
        <div className="flex gap-2">
          {conversations?.length === 0 && (
             <Button variant="outline" className="rounded-full gap-2" onClick={() => seedMockMutation.mutate()} disabled={seedMockMutation.isPending}>
               <RefreshCcw className={`w-4 h-4 ${seedMockMutation.isPending ? 'animate-spin' : ''}`} />
               Seed Demo Data
             </Button>
          )}
          <Button className="rounded-full">Mark all as read</Button>
        </div>
      </div>

      {/* Main Container with Gradient Frame */}
      <div className='group relative overflow-hidden bg-black/[0.02] p-4 ring-1 ring-black/5 md:p-5 dark:bg-white/[0.04] dark:ring-white/10 flex-grow rounded-3xl flex flex-col'>
        <GradientFrame />
        <div className='relative z-10 flex h-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10 overflow-hidden flex-col md:flex-row'>
          
          {/* Left Sidebar: Conversations List */}
          <div className="w-full md:w-[350px] border-r border-black/5 dark:border-white/10 flex flex-col bg-white dark:bg-[#0a0a0a] z-10 h-full">
            {/* Search */}
            <div className="p-4 border-b border-black/5 dark:border-white/10">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="w-full h-10 pl-9 pr-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-white transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-2 scrollbar-hide space-y-1">
              {isLoadingConvs ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Loading conversations...</div>
              ) : conversations?.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No messages found.</div>
              ) : (
                conversations?.map((conv: any) => {
                  const isActive = activeConvId === conv._id;
                  const isUnread = conv.unreadCount > 0;
                  
                  return (
                    <div 
                      key={conv._id} 
                      onClick={() => setActiveConvId(conv._id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 relative ${
                        isActive 
                          ? 'bg-black/5 dark:bg-white/10 shadow-sm' 
                          : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar with Platform Badge */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${isUnread ? 'ring-emerald-500' : 'ring-black/5 dark:ring-white/10'}`}>
                            {conv.customerAvatar ? (
                              <img src={conv.customerAvatar} alt={conv.customerName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">
                                {conv.customerName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-[#0a0a0a] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#0a0a0a]">
                            <PlatformIcon platform={conv.platform} className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className={`text-sm truncate pr-2 ${isUnread ? 'font-bold text-foreground dark:text-white' : 'font-medium text-foreground dark:text-white/90'}`}>
                              {conv.customerName}
                            </span>
                            <span className={`text-[10px] whitespace-nowrap ${isUnread ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-muted-foreground'}`}>
                              {formatTime(conv.lastMessageAt)}
                            </span>
                          </div>
                          <p className={`text-xs line-clamp-1 ${isUnread ? 'text-foreground dark:text-white font-medium' : 'text-muted-foreground'}`}>
                            {conv.lastMessage}
                          </p>
                        </div>
                        
                        {isUnread && (
                          <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Message Thread */}
          <div className="flex-grow flex flex-col h-full bg-black/[0.01] dark:bg-white/[0.01]">
            {activeConvId && activeConversation ? (
              <>
                {/* Thread Header */}
                <div className="h-16 border-b border-black/5 dark:border-white/10 flex items-center justify-between px-6 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                       <img src={activeConversation.customerAvatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground dark:text-white leading-tight">
                        {activeConversation.customerName}
                      </h3>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <PlatformIcon platform={activeConversation.platform} className="w-3 h-3 grayscale opacity-70" />
                        Via {activeConversation.platform.charAt(0).toUpperCase() + activeConversation.platform.slice(1)}
                        {activeConversation.customerHandle && ` • ${activeConversation.customerHandle}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {isLoadingMessages ? (
                    <div className="text-center text-sm text-muted-foreground mt-10">Loading messages...</div>
                  ) : (
                    messages?.map((msg: any, index: number) => {
                      const isCustomer = msg.senderType === 'customer';
                      
                      return (
                        <div key={msg._id} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-2`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            isCustomer 
                              ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white ring-1 ring-black/5 dark:ring-white/10 rounded-tl-sm' 
                              : 'bg-emerald-600 text-white rounded-tr-sm'
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-1.5 px-1 flex items-center gap-1">
                            {formatTime(msg.createdAt)}
                            {!isCustomer && <CheckCircle2 className="w-3 h-3 text-emerald-500 opacity-70" />}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area */}
                <div className="p-4 bg-white dark:bg-[#0a0a0a] border-t border-black/5 dark:border-white/10 mt-auto">
                  <div className="relative">
                    {/* Fake AI Suggestion Tag */}
                    <div className="absolute -top-7 right-2 flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-semibold border border-indigo-100 dark:border-indigo-500/20 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                      <MessageSquare className="w-3 h-3" /> AI Draft Available
                    </div>
                    
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Reply to ${activeConversation.customerName}...`}
                      className="w-full h-20 pt-3 pb-3 pl-4 pr-14 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-white resize-none"
                    />
                    <Button 
                      onClick={handleSend}
                      disabled={sendMessageMutation.isPending || !replyText.trim()}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full p-0 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-transform active:scale-95"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">Press Enter to send, Shift + Enter for new line</p>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 ring-8 ring-black/[0.02] dark:ring-white/[0.02]">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Choose a message from the list to view the conversation history and start replying.
                </p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
