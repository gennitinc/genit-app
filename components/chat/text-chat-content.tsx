"use client";

import {
  AIMessage,
  UserMessage,
  VersioningMessage,
  type GenerationGroup,
  AIThinkingContent,
} from "@/components/chat/messages";
import { useState, useEffect, useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/ai-elements/loader";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { useProjectDesign } from "@/context/DesignProject";
import { ChatInput } from "./chat-input";

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
  } = useProjectDesign();

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
            block: "center",
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
    const atBottom = distance <= 8;
    setIsAtBottom(atBottom);
    setShowButton(!atBottom);
    try {
      setShowScrollButton(!atBottom);
    } catch {}
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const external = document.querySelector<HTMLElement>(".scroll-container");
      if (external) {
        scrollElRef.current = external;
        external.addEventListener("scroll", onScroll, { passive: true });
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            doScrollToBottom({ behavior: "auto" });
          })
        );
      } else if (localConversationRef.current) {
        scrollElRef.current = localConversationRef.current;
        const el = localConversationRef.current;
        el.addEventListener("scroll", onScroll, { passive: true });
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            doScrollToBottom({ behavior: "auto" });
          })
        );
      }
    }, 0);

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
    const curr = messages?.length || 0;
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
    messages,
    streamingContent,
    isGeneratingImage,
    generatingForMessageId,
    isAtBottom,
    scrollSkeleton,
    doScrollToBottom,
  ]);

  useEffect(() => {
    const handler = () => doScrollToBottom({ behavior: "smooth" });
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
      await addReaction(messageId, "like");
    } catch {}
  };

  const handleDislikeToggle = async (messageId: string) => {
    try {
      await addReaction(messageId, "dislike");
    } catch {}
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).catch(() => {});
  };

  return (
    <div className="flex flex-col h-[50vh] lg:h-full">
      <div ref={localConversationRef} className="flex-1 px-2 md:px-6">
        <Conversation className="px-0 m-0">
          <ConversationContent className="px-0 m-0 space-y-4 pb-2">
            {messages?.map((message: any, index: number) => {
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
                      onDelete={() => handleDeleteMessage(message.id)}
                      onCopy={() =>
                        handleCopyMessage(
                          message.parts?.find(
                            (part: any) => part.type === "text"
                          )?.text || ""
                        )
                      }
                    />

                    {isGeneratingImage &&
                      String(generatingForMessageId) === String(message.id) && (
                        <div
                          ref={skeletonRef}
                          className="flex justify-center mt-2"
                        >
                          <Skeleton className="h-[500px] w-[500px] rounded-md" />
                        </div>
                      )}
                  </div>
                );
              }

              if (message.type === "ai") {
                return (
                  <div key={message.id || index} className="space-y-4">
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
                      onReload={() => retryLoading(message.id)}
                      generation={message.generationGroups}
                    />

                    {message.generationGroups?.map((group: GenerationGroup) => (
                      <VersioningMessage
                        key={group._id || group.id}
                        generation={group}
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
                                        ? { ...g, isCollapsed: !g.isCollapsed }
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
                        onReload={() => retryLoading(message.id)}
                      />
                    ))}
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
                (!messages ||
                  messages.length === 0 ||
                  messages[messages.length - 1]?.type !== "ai") && (
                  <AIThinkingContent />
                )
              ))}

            {(!messages || messages.length === 0) && !isTyping && (
              <div className="flex-1 min-h-[60vh] flex items-end justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400 mb-8">
                  <p className="text-lg font-medium mb-2">
                    Start a conversation
                  </p>
                  <p className="text-sm">
                    Ask me anything or describe what you'd like to create
                  </p>
                </div>
              </div>
            )}
          </ConversationContent>
        </Conversation>
      </div>

      <div className="sticky bottom-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur">
        <ChatInput placeholder="Ask a follow up message..." />
      </div>
    </div>
  );
}
