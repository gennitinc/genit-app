"use client";

import { AgentMessage } from "./agent/agent-message";
import { ChatInput } from "./chat-input";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
  AIMessage,
  AIThinkingContent,
  type GenerationGroup,
  UserMessage,
  VersioningMessage,
} from "@/components/chat/messages";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentRunsContext } from "@/context/AgentRunsContext";
import { useProjectDesign } from "@/context/DesignProject";
import { useCallback, useEffect, useRef, useState } from "react";

export function TextChatContent() {
  const {
    userName,
    retryLoading,
    isGenerating,
    editMessage,
    deleteMessage,
    addReaction,
    status,
    removeReaction,
    handleLocalStorageDraft,
    streamingContent,
    streamingAnalysis,
    project,
    isTyping,
    userAvatar,
    messages,
    setMessages,
    setShowScrollButton,
    isGeneratingImage,
    generatingForMessageId,
    generateMessage,
    aiStatus,
    isLoadingProject,
  } = useProjectDesign();

  const { runs: agentRuns } = useAgentRunsContext();

  // We filter out regular messages that exactly match AgentRun prompts or final texts.
  // This cleans up historical database records from before we stopped duplicating AgentRuns as plain messages.
  const agentPrompts = new Set(agentRuns.map(r => r.prompt?.trim()).filter(Boolean));
  const agentTexts = new Set(agentRuns.map(r => r.text?.trim()).filter(Boolean));

  // Merge regular messages and agent runs into a single chronologically-sorted list.
  const allItems: { type: "message" | "agent"; createdAt: number; data: any }[] = [
    ...(messages || [])
      .filter((m: any) => {
        const text = m.parts?.find((p: any) => p.type === "text")?.text?.trim() || m.text?.trim() || "";
        if (!text) return true;
        if (m.type === "user" || m.role === "user") {
          if (agentPrompts.has(text)) return false;
        } else if (m.type === "ai" || m.role === "assistant") {
          if (agentTexts.has(text)) return false;
        }
        return true;
      })
      .map((m: any) => ({
        type: "message" as const,
        createdAt: m.createdAt ? new Date(m.createdAt).getTime() : 0,
        data: m,
      })),
    ...agentRuns
      .map((r) => ({
        type: "agent" as const,
        createdAt: r.createdAt,
        data: r,
      })),
  ].sort((a, b) => a.createdAt - b.createdAt);

  // Don't show empty state while the project is still loading — it causes a
  // 'Start a conversation' flash on redirect to a chat URL.
  const isEmpty = allItems.length === 0 && !isTyping && !isLoadingProject;

  const skeletonRef = useRef<HTMLDivElement | null>(null);
  const scrollElRef = useRef<HTMLElement | null>(null);
  const localConversationRef = useRef<HTMLDivElement | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const previousMessagesLengthRef = useRef(messages?.length || 0);
  const firstRenderRef = useRef(true);

  const doScrollToBottom = useCallback(
    (opts?: { behavior?: ScrollBehavior }) => {
      const el = scrollElRef.current;
      if (!el) return;

      const behavior = opts?.behavior || "auto";

      // Multiple AFs to ensure DOM is settled after state updates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            el.scrollTo({ top: el.scrollHeight, behavior });
          } catch {
            el.scrollTop = el.scrollHeight;
          }
          setIsAtBottom(true);
          setShowButton(false);
          try {
            setShowScrollButton(false);
          } catch {}
        });
      });
    },
    []
  );

  const scrollSkeleton = useCallback(() => {
    if (!skeletonRef.current) return false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          skeletonRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end",
          });
        } catch {
          doScrollToBottom({ behavior: "auto" });
        }
      });
    });
    return true;
  }, [doScrollToBottom]);

  const onScroll = useCallback(() => {
    const el = scrollElRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    // Increased threshold for better auto-scroll persistence
    const atBottom = distance <= 150;
    setIsAtBottom(atBottom);
    setShowButton(!atBottom);
    try {
      setShowScrollButton(!atBottom);
    } catch {}
  }, []);

  useEffect(() => {
    // We favor our local ref as the primary scroll element now
    if (localConversationRef.current) {
      scrollElRef.current = localConversationRef.current;
      const el = localConversationRef.current;
      el.addEventListener("scroll", onScroll, { passive: true });

      // Auto scroll on first mount
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          doScrollToBottom({ behavior: "auto" });
        })
      );
    }

    return () => {
      if (scrollElRef.current) {
        scrollElRef.current.removeEventListener("scroll", onScroll);
      }
    };
  }, [onScroll, doScrollToBottom]);

  useEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;

    const prev = previousMessagesLengthRef.current;
    const curr = allItems.length;
    const isNew = curr !== prev;

    if (firstRenderRef.current) {
      if (isGeneratingImage && skeletonRef.current) {
        if (!scrollSkeleton()) doScrollToBottom({ behavior: "auto" });
      } else {
        doScrollToBottom({ behavior: "auto" });
      }
    } else {
      const should =
        (isNew && isAtBottom) ||
        (streamingContent && streamingContent.length > 0 && isAtBottom) ||
        (isGeneratingImage && isAtBottom);

      if (should) {
        if (isGeneratingImage && skeletonRef.current) {
          if (!scrollSkeleton()) doScrollToBottom({ behavior: "smooth" });
        } else {
          doScrollToBottom({ behavior: "smooth" });
        }
      }
    }

    previousMessagesLengthRef.current = curr;
    firstRenderRef.current = false;
  }, [
    allItems.length,
    streamingContent,
    isGeneratingImage,
    generatingForMessageId,
    isAtBottom,
    aiStatus,
    scrollSkeleton,
    doScrollToBottom,
  ]);

  // Force scroll when AI starts thinking/typing
  useEffect(() => {
    if (isTyping && isAtBottom) {
      doScrollToBottom({ behavior: "smooth" });
    }
  }, [isTyping, isAtBottom, doScrollToBottom]);

  useEffect(() => {
    const el = localConversationRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      if (isAtBottom) {
        doScrollToBottom({ behavior: "smooth" });
      }
    });

    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [isAtBottom, doScrollToBottom]);

  useEffect(() => {
    const handler = () => {
      doScrollToBottom({ behavior: "smooth" });
    };
    window.addEventListener("scroll-chat-to-bottom", handler as EventListener);
    return () =>
      window.removeEventListener(
        "scroll-chat-to-bottom",
        handler as EventListener
      );
  }, [doScrollToBottom]);

  const handleEditMessage = async (
    messageId: string,
    newContent: string,
    files?: File[]
  ) => {
    try {
      const projectId = project?._id || "";
      await editMessage(messageId, newContent, files ?? null, projectId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeToggle = async (messageId: string) => {
    try {
      const message = messages?.find(
        (m: any) => m.id === messageId || m._id === messageId
      );
      const isLiked = message?.feedback?.userReaction === "like";

      if (isLiked) {
        await removeReaction(messageId, "like");
      } else {
        // Remove dislike if present
        if (message?.feedback?.userReaction === "dislike") {
          await removeReaction(messageId, "dislike");
        }
        await addReaction(messageId, "like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDislikeToggle = async (messageId: string) => {
    try {
      const message = messages?.find(
        (m: any) => m.id === messageId || m._id === messageId
      );
      const isDisliked = message?.feedback?.userReaction === "dislike";

      if (isDisliked) {
        await removeReaction(messageId, "dislike");
      } else {
        // Remove like if present
        if (message?.feedback?.userReaction === "like") {
          await removeReaction(messageId, "like");
        }
        await addReaction(messageId, "dislike");
      }
    } catch (error) {
      console.error("Error toggling dislike:", error);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).catch(() => {});
  };

  const handleOptionSelect = async (option: string) => {
    try {
      const projectId = project?._id || "";
      await generateMessage(option, [], projectId);
    } catch (error) {
      console.error("Error selecting option:", error);
    }
  };

  return (
    <ChatInput placeholder='Ask a follow up message...' className='h-full'>
      <div
        ref={localConversationRef}
        className='scroll-container custom-scrollbar min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-2 md:px-6'
      >
        <Conversation className='m-0 px-0'>
          <ConversationContent className='m-0 min-h-full space-y-4 overflow-x-hidden px-0 pb-10'>
            {allItems.map((item, index) => {
              if (item.type === "agent") {
                return (
                  <AgentMessage
                    key={item.data.runId}
                    run={item.data}
                    userAvatar={userAvatar}
                    userName={userName}
                  />
                );
              }

              const message = item.data;

              if (message.type === "user") {
                const imageAttachment = message.fileAttachments?.find(
                  (f: any) => f.type?.startsWith("image/")
                )?.url;

                const fileAttachment = message.fileAttachments?.find(
                  (f: any) => !f.type?.startsWith("image/")
                )?.url;

                return (
                  <div key={message.id || index}>
                    <UserMessage
                      message={message}
                      userAvatar={userAvatar}
                      userName={userName}
                      imageAttachment={imageAttachment}
                      fileAttachment={fileAttachment}
                      fileName={message.fileAttachments?.[0]?.name}
                      fileSize={
                        message.fileAttachments?.[0]?.size
                          ? `${(
                              message.fileAttachments[0].size /
                              (1024 * 1024)
                            ).toFixed(2)} MB`
                          : undefined
                      }
                      fileType={
                        message.fileAttachments?.[0]?.type?.split("/")[0]
                      }
                      onEdit={(newContent: any, files: any) =>
                        handleEditMessage(message.id, newContent, files)
                      }
                      onCopy={() =>
                        handleCopyMessage(
                          message.parts?.find(
                            (part: any) => part.type === "text"
                          )?.text || ""
                        )
                      }
                    />
                  </div>
                );
              }

              if (message.type === "ai") {
                return (
                  <div key={message.id || index} className='space-y-4'>
                    <AIMessage
                      message={message}
                      totalTime={message.totalTime}
                      versionId={message.versionId}
                      isStreaming={message.metadata?.isStreaming || false}
                      streamingContent={
                        message.metadata?.isStreaming
                          ? streamingContent
                          : undefined
                      }
                      streamingAnalysis={
                        message.metadata?.isStreaming
                          ? streamingAnalysis
                          : undefined
                      }
                      onCopy={() =>
                        handleCopyMessage(
                          message.parts?.find(
                            (part: any) => part.type === "text"
                          )?.text || ""
                        )
                      }
                      onLike={() => handleLikeToggle(message.id)}
                      onDislike={() => handleDislikeToggle(message.id)}
                      onDelete={() => handleDeleteMessage(message.id)}
                      onOptionClick={handleOptionSelect}
                      generation={message.generationGroups}
                    />

                    {message.generationGroups?.map((group: GenerationGroup) => {
                      const originalPrompt = message.parts?.find(
                        (part: any) => part.type === "text"
                      )?.text;

                      return (
                        <VersioningMessage
                          key={group._id || group.id}
                          generation={group}
                          projectId={project?._id?.toString()}
                          designType={project?.category || undefined}
                          originalPrompt={originalPrompt}
                          onToggle={(groupId: string) => {
                            setMessages((prev: any[]) =>
                              prev.map((msg: any) => {
                                if (
                                  msg.id === message.id &&
                                  msg.generationGroups
                                ) {
                                  return {
                                    ...msg,
                                    generationGroups: msg.generationGroups.map(
                                      (g: GenerationGroup) =>
                                        g._id === groupId || g.id === groupId
                                          ? {
                                              ...g,
                                              isCollapsed: !g.isCollapsed,
                                            }
                                          : g
                                    ),
                                  };
                                }
                                return msg;
                              })
                            );
                          }}
                          onRetry={retryLoading}
                          onCopy={() =>
                            handleCopyMessage(
                              JSON.stringify(group.items, null, 2)
                            )
                          }
                          onLike={() => handleLikeToggle(message.id)}
                          onDislike={() => handleDislikeToggle(message.id)}
                          onDelete={() => handleDeleteMessage(message.id)}
                        />
                      );
                    })}
                  </div>
                );
              }

              return null;
            })}

            {status === "submitted" && <Loader />}

            {isTyping &&
              (streamingContent && streamingContent.length > 0 ? (
                <AIMessage
                  message={{
                    id: "streaming-temp",
                    role: "assistant",
                    type: "ai",
                    parts: [
                      { type: "reasoning", text: streamingAnalysis || "" },
                      { type: "text", text: streamingContent },
                    ],
                  }}
                  generation={{ id: "streaming" }}
                  isStreaming
                  streamingContent={streamingContent}
                  streamingAnalysis={streamingAnalysis}
                />
              ) : (
                <AIThinkingContent status={aiStatus} />
              ))}

            {isEmpty && (
              <div className='flex min-h-[40vh] flex-1 flex-col items-center justify-center'>
                <div className='mb-8 text-center text-gray-500 dark:text-gray-400'>
                  <p className='mb-2 text-lg font-medium'>
                    Start a conversation
                  </p>
                  <p className='text-sm'>
                    Ask me anything or describe what you'd like to create
                  </p>
                </div>
              </div>
            )}

            {/* Loading skeleton while project is fetching on first redirect */}
            {isLoadingProject && allItems.length === 0 && (
              <div className='flex min-h-[40vh] flex-1 flex-col items-center justify-center gap-3'>
                <div className='flex flex-col items-center gap-4 w-full max-w-md px-6'>
                  <div className='h-4 w-3/4 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800' />
                  <div className='h-4 w-1/2 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800' />
                  <div className='h-4 w-5/6 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800' />
                </div>
              </div>
            )}
          </ConversationContent>
        </Conversation>
      </div>
    </ChatInput>
  );
}
