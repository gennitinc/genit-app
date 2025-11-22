"use client";

import {
  AIMessage,
  UserMessage,
  VersioningMessage,
  type GenerationGroup,
  AIThinkingContent,
} from "@/components/chat/messages";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/ai-elements/loader";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import { useProjectDesign } from "@/context/DesignProject";
import { ChatInput } from "./chat-input";

interface messageType {
  type: string;
  text: string;
  role: string;
  id: string;
  parts: {
    type: string;
    text: string;
  }[];
}

export function TextChatContent() {
  const {
    generations,
    userName,
    toggleGeneration,
    retryLoading,
    isGenerating,
    editMessage,
    deleteMessage,
    addReaction,
    status,
    removeReaction,
    handleGenerationItemClick,
    handleLocalStorageDraft,
    streamingContent,
    streamingAnalysis,
    project,
    isTyping,
    userAvatar,
    messages,
    setMessages,
    clearInput,
    setShowScrollButton,
    isGeneratingImage,
    generatingForMessageId,
  } = useProjectDesign();

  // Use project messages for real data
  const [reactionStates, setReactionStates] = useState<{
    [key: string]: { liked: boolean; disliked: boolean };
  }>({});

  const [isProcessingDraft, setIsProcessingDraft] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);
  const skeletonRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const previousMessagesLengthRef = useRef<number>(messages?.length || 0);
  const firstRenderRef = useRef<boolean>(true);

  // Attach scroll listener to toggle scroll-to-bottom button visibility
  useEffect(() => {
    const el = conversationRef.current;
    if (!el) return;

    const onScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      const atBottom = distanceFromBottom <= 2;
      setIsAtBottom(atBottom);
      // Hide the bouncing icon when at bottom
      setShowScrollButton(!atBottom);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    // Initialize state
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [setShowScrollButton]);

  // Consolidated auto-scroll behavior:
  // - On first render: scroll to bottom
  // - When messages change (new message arrives): auto-scroll to bottom
  // - When streaming content or image generation starts: auto-scroll (prefers skeleton if available)
  useEffect(() => {
    const el = conversationRef.current;
    if (!el) return;

    const prevLen = previousMessagesLengthRef.current || 0;
    const currLen = messages?.length || 0;
    const isNewMessage = currLen !== prevLen;

    if (
      firstRenderRef.current ||
      isNewMessage ||
      (streamingContent && streamingContent.length > 0) ||
      isGeneratingImage
    ) {
      // If there's a target skeleton for a specific message, scroll to it
      if (isGeneratingImage && generatingForMessageId && skeletonRef.current) {
        try {
          skeletonRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } catch (e) {
          el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        }
      } else {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }

      setIsAtBottom(true);
      setShowScrollButton(false);
    }

    previousMessagesLengthRef.current = currLen;
    firstRenderRef.current = false;
  }, [
    messages,
    streamingContent,
    isGeneratingImage,
    generatingForMessageId,
    setShowScrollButton,
  ]);

  // Listen for global scroll-to-bottom events (triggered from ChatInput button)
  useEffect(() => {
    const handler = () => {
      const el = conversationRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
      setIsAtBottom(true);
      setShowScrollButton(false);
    };
    window.addEventListener("scroll-chat-to-bottom", handler as EventListener);
    return () =>
      window.removeEventListener(
        "scroll-chat-to-bottom",
        handler as EventListener
      );
  }, [setShowScrollButton]);

  // Handle message editing
  const handleEditMessage = async (
    messageId: string,
    newContent: string,
    files?: File[]
  ) => {
    try {
      const projectId = project?._id || "";
      await editMessage(messageId, newContent, files ?? null, projectId);
    } catch (error) {
      console.error("Failed to edit message:", error);
      throw error;
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  // Handle message reactions with state management
  const handleAddReaction = async (
    messageId: string,
    reaction: "like" | "dislike" | "comment"
  ) => {
    try {
      addReaction(messageId, reaction);
      setReactionStates((prev) => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          liked: reaction === "like" ? true : prev[messageId]?.liked || false,
          disliked:
            reaction === "dislike" ? true : prev[messageId]?.disliked || false,
        },
      }));
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const handleRemoveReaction = async (
    messageId: string,
    reaction: "like" | "dislike" | "comment"
  ) => {
    try {
      await removeReaction(messageId, reaction);
      setReactionStates((prev) => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          liked: reaction === "like" ? false : prev[messageId]?.liked || false,
          disliked:
            reaction === "dislike" ? false : prev[messageId]?.disliked || false,
        },
      }));
    } catch (error) {
      console.error("Failed to remove reaction:", error);
    }
  };

  // Handle like/dislike toggle
  const handleLikeToggle = async (messageId: string) => {
    const currentState = reactionStates[messageId];
    if (currentState?.liked) {
      await handleRemoveReaction(messageId, "like");
    } else {
      await handleAddReaction(messageId, "like");
      if (currentState?.disliked) {
        await handleRemoveReaction(messageId, "dislike");
      }
    }
  };

  const handleDislikeToggle = async (messageId: string) => {
    const currentState = reactionStates[messageId];
    if (currentState?.disliked) {
      await handleRemoveReaction(messageId, "dislike");
    } else {
      await handleAddReaction(messageId, "dislike");
      if (currentState?.liked) {
        await handleRemoveReaction(messageId, "like");
      }
    }
  };

  // Handle message copy
  const handleCopyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log("Message copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy message:", err);
      });
  };

  // Handle message regeneration
  const handleRegenerateMessage = (messageId: string) => {
    console.log("Regenerating message:", messageId);
    // You would implement the actual regeneration logic here
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={conversationRef} className="flex-1 px-2 md:px-6">
        <Conversation className="px-0 m-0">
          <ConversationContent className="px-0 m-0 space-y-4 pb-2">
            {messages?.map((message: any, index: number) => {
              if (message.type === "user") {
                return (
                  <div key={message.id || index}>
                    <UserMessage
                      key={message.id || index}
                      message={message}
                      userAvatar={userAvatar}
                      userName={userName}
                      imageAttachment={
                        message.fileAttachments?.find((f: any) =>
                          f.type?.startsWith("image/")
                        )?.url
                      }
                      fileAttachment={
                        message.fileAttachments?.find(
                          (f: any) => !f.type?.startsWith("image/")
                        )?.url
                      }
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
                        message.fileAttachments?.[0]?.type?.split("/")[0] as any
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

                    {/* If this user message is the one currently generating an image, show skeleton under it */}
                    {isGeneratingImage &&
                      generatingForMessageId === String(message.id) && (
                        <div
                          ref={skeletonRef}
                          className="flex justify-center pl-10"
                        >
                          <Skeleton className="h-[500px] w-[500px] rounded-md" />
                        </div>
                      )}
                  </div>
                );
              } else if (message.type === "ai") {
                const messageReactionState = reactionStates[message.id] || {
                  liked: false,
                  disliked: false,
                };

                return (
                  <div key={message.id || index} className="space-y-4">
                    {/* Show typing indicator for new projects */}

                    <AIMessage
                      message={message}
                      totalTime={message.totalTime}
                      versionId={message.versionId} // NEW: Pass version ID
                      isStreaming={message.metadata?.isStreaming || false} // NEW: Pass streaming state
                      streamingContent={
                        message.metadata?.isStreaming
                          ? streamingContent
                          : undefined
                      } // Only pass if streaming
                      streamingAnalysis={
                        message.metadata?.isStreaming
                          ? streamingAnalysis
                          : undefined
                      } // Only pass if streaming
                      onCopy={() =>
                        handleCopyMessage(
                          message.parts?.find(
                            (part: any) => part.type === "text"
                          )?.text || ""
                        )
                      }
                      onLike={() => handleLikeToggle(message.id)}
                      onDislike={() => handleDislikeToggle(message.id)}
                      onReload={() => handleRegenerateMessage(message.id)}
                      generation={message.generationGroups}
                    />

                    {/* Render generation groups - These don't show AI avatar */}
                    {message.generationGroups?.map((group: GenerationGroup) => (
                      <VersioningMessage
                        key={group._id || group.id}
                        generation={group}
                        onToggle={(groupId: string) => {
                          // Update the message's generationGroups in messages state
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
                        onReload={() => handleRegenerateMessage(message.id)}
                      />
                    ))}

                    {isGeneratingImage && (
                      <div className="flex justify-center pl-10">
                        <Skeleton className="h-[500px] w-[500px] rounded-md" />
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}

            {status === "submitted" && <Loader />}

            {/* Show large image skeleton while server is generating an image */}

            {/* Realtime typing: render streaming content if present; otherwise, show thinking indicator */}
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

            {/* Ensure chat is positioned at bottom when messages array is empty */}
            {(!messages || messages.length === 0) &&
              !isProcessingDraft &&
              !isTyping && (
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
          {/* Rely on browser scroll; hide internal scroll button */}
        </Conversation>
      </div>

      {/* Only show ChatInput when not processing localStorage draft */}
      {!isProcessingDraft && (
        <div className="sticky bottom-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60">
          <ChatInput placeholder="Ask a follow up message..." />
        </div>
      )}
    </div>
  );
}
