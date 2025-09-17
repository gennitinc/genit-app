"use client";

import {
  AIMessage,
  UserMessage,
  VersioningMessage,
  type GenerationGroup,
  AIThinkingContent,
} from "@/components/chat/messages";
import { useChat } from "@ai-sdk/react";
// import {
//   Source,
//   Sources,
//   SourcesContent,
//   SourcesTrigger,
// } from "@/components/ai-elements/source";
import { useState } from "react";
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

interface messageType {
  type: string;
  content: string;
  role: string;
  id: string;
  parts: {
    type: string;
    text: string;
  }[];
}

export const demoMessages: any[] = [
  {
    id: "msg-1",
    role: "user",
    type: "user",
    content:
      "Explain the difference between streaming and non-streaming AI responses.",
    parts: [
      {
        type: "text",
        text: "Explain the difference between streaming and non-streaming AI responses.",
      },
    ],
  },
  {
    id: "msg-2",
    role: "assistant",
    type: "ai",
    content: `### Streaming vs Non-Streaming

- **Streaming**: Sends partial results as they are generated, feels real-time.
- **Non-streaming**: Waits until the full response is ready before sending.

Streaming is ideal for chat-like experiences, non-streaming is better for quick, short results.`,
    analysis: `User wants a conceptual comparison. I'll break it into bullet points for clarity and highlight the pros of each approach.`,
    totalTime: 2450,
    versionId: "v1",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "reasoning",
        text: "First, I need to define both terms in simple words, then contrast them. I'll use bullet points so it's scannable.",
      },
      {
        type: "text",
        text: `### Streaming vs Non-Streaming

- **Streaming**: Sends partial results as they are generated, feels real-time.
- **Non-streaming**: Waits until the full response is ready before sending.

Streaming is ideal for chat-like experiences, non-streaming is better for quick, short results.`,
      },
    ],
    generationGroups: [
      {
        id: "v1",
        title: "Version 1",
        timestamp: new Date("2024-01-15T10:30:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v1-item1",
            name: "streaming-explanation.md",
            type: "file",
            filePath: "responses/streaming-explanation.md",
            language: "markdown",
            status: "generated",
            content: `### Streaming vs Non-Streaming

- **Streaming**: Sends partial results as they are generated, feels real-time.
- **Non-streaming**: Waits until the full response is ready before sending.

Streaming is ideal for chat-like experiences, non-streaming is better for quick, short results.`,
          },
        ],
      },
    ],
  },
  {
    id: "msg-3",
    role: "user",
    type: "user",
    content: "Write me a friendly email to reschedule a meeting with a client.",
    parts: [
      {
        type: "text",
        text: "Write me a friendly email to reschedule a meeting with a client.",
      },
    ],
  },
  {
    id: "msg-4",
    role: "assistant",
    type: "ai",
    content: `Hi [Client Name],

I hope you're doing well! Something has come up and I'll need to reschedule our meeting. Would next Wednesday at 2 PM work for you?

Thanks for your understanding,  
[Your Name]`,
    analysis: `User requested a polite but friendly tone. I'll keep it short, warm, and professional.`,
    totalTime: 1870,
    versionId: "v2",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "reasoning",
        text: "Decide on a warm greeting, a clear reason for rescheduling without oversharing, and a specific alternative time.",
      },
      {
        type: "text",
        text: `Hi [Client Name],

I hope you're doing well! Something has come up and I'll need to reschedule our meeting. Would next Wednesday at 2 PM work for you?

Thanks for your understanding,  
[Your Name]`,
      },
    ],
    generationGroups: [
      {
        id: "v2",
        title: "Version 2",
        timestamp: new Date("2024-01-15T11:15:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v2-item1",
            name: "reschedule-email.txt",
            type: "file",
            filePath: "emails/reschedule-email.txt",
            status: "generated",
            content: `Hi [Client Name],

I hope you're doing well! Something has come up and I'll need to reschedule our meeting. Would next Wednesday at 2 PM work for you?

Thanks for your understanding,  
[Your Name]`,
          },
        ],
      },
    ],
  },
  {
    id: "msg-5",
    role: "user",
    type: "user",
    content: "Give me three slogan ideas for eco-friendly water bottles.",
    parts: [
      {
        type: "text",
        text: "Give me three slogan ideas for eco-friendly water bottles.",
      },
    ],
  },
  {
    id: "msg-6",
    role: "assistant",
    type: "ai",
    content: `1. "Sip Smart, Save the Planet"  
2. "Hydrate. Reuse. Repeat."  
3. "Drink Green, Live Clean"`,
    analysis: `Brainstorming short, catchy, eco-conscious slogans that emphasize sustainability and action.`,
    totalTime: 940,
    versionId: "v3",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "reasoning",
        text: "Focus on brevity, alliteration, and eco-friendly keywords. Create 3 varied but cohesive options.",
      },
      {
        type: "text",
        text: `1. "Sip Smart, Save the Planet"  
2. "Hydrate. Reuse. Repeat."  
3. "Drink Green, Live Clean"`,
      },
    ],
    generationGroups: [
      {
        id: "v3",
        title: "Version 3",
        timestamp: new Date("2024-01-15T14:22:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v3-item1",
            name: "eco-slogans.txt",
            type: "file",
            filePath: "marketing/eco-slogans.txt",
            status: "generated",
            content: `1. "Sip Smart, Save the Planet"  
2. "Hydrate. Reuse. Repeat."  
3. "Drink Green, Live Clean"`,
          },
        ],
      },
    ],
  },
  {
    id: "msg-7",
    role: "user",
    type: "user",
    content:
      "Summarize these team notes:\n- Marketing will finalize designs by Friday\n- Dev team is testing new features\n- Launch date is September 15",
    parts: [
      {
        type: "text",
        text: "Summarize these team notes:\n- Marketing will finalize designs by Friday\n- Dev team is testing new features\n- Launch date is September 15",
      },
    ],
  },
  {
    id: "msg-8",
    role: "assistant",
    type: "ai",
    content: `Marketing is finalizing designs by Friday, development is testing new features, and the product launches on September 15.`,
    analysis: `The request is a direct summarization. Maintain accuracy, remove bullet formatting, and condense to one sentence.`,
    totalTime: 640,
    versionId: "v4",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "reasoning",
        text: "Combine all points into a concise sentence while preserving the original meaning and deadlines.",
      },
      {
        type: "text",
        text: `Marketing is finalizing designs by Friday, development is testing new features, and the product launches on September 15.`,
      },
    ],
    generationGroups: [
      {
        id: "v4",
        title: "Version 4",
        timestamp: new Date("2024-01-15T16:45:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v4-item1",
            name: "team-summary.md",
            type: "file",
            filePath: "notes/team-summary.md",
            language: "markdown",
            status: "generated",
            content: `Marketing is finalizing designs by Friday, development is testing new features, and the product launches on September 15.`,
          },
        ],
      },
    ],
  },
  {
    id: "msg-9",
    role: "user",
    type: "user",
    content: "What's the weather in Lagos right now?",
    parts: [
      {
        type: "text",
        text: "What's the weather in Lagos right now?",
      },
    ],
  },
  {
    id: "msg-10",
    role: "assistant",
    type: "ai",
    content: `It's currently 29°C in Lagos, partly cloudy, with light winds.`,
    analysis: `User asked for real-time weather. I'm providing a clear, single-sentence update.`,
    totalTime: 450,
    versionId: "v5",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "reasoning",
        text: "Retrieve current weather data for Lagos, format it in a concise, friendly style.",
      },
      {
        type: "text",
        text: `It's currently 29°C in Lagos, partly cloudy, with light winds.`,
      },
    ],
    generationGroups: [
      {
        id: "v5",
        title: "Version 5",
        timestamp: new Date("2024-01-15T18:30:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v5-item1",
            name: "lagos-weather.txt",
            type: "file",
            filePath: "weather/lagos-weather.txt",
            status: "generated",
            content: `It's currently 29°C in Lagos, partly cloudy, with light winds.`,
          },
        ],
      },
    ],
  },
];

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
    removeReaction,
    handleGenerationItemClick,
    streamingContent,
    streamingAnalysis,
    project,
    userAvatar,
  } = useProjectDesign();

  // Transform project messages to include role and parts for compatibility with demoMessages
  const transformMessages = (messages: any[]) => {
    return (
      messages?.map((msg) => ({
        ...msg,
        role: msg.type === "user" ? "user" : "assistant",
        parts:
          msg.type === "user"
            ? [{ type: "text", text: msg.content }]
            : [
                { type: "reasoning", text: msg.analysis || "" },
                { type: "text", text: msg.content || "" },
              ],
      })) || []
    );
  };

  // Use projectInfo?.messages if available, otherwise fallback to demoMessages
  const { messages, sendMessage, status } = useChat({
    messages: transformMessages(demoMessages),
  });
  // const { messages, sendMessage, status } = useChat({
  //   messages: demoMessages,
  // });

  const [reactionStates, setReactionStates] = useState<{
    [key: string]: { liked: boolean; disliked: boolean };
  }>({});

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
      await addReaction(messageId, reaction);
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
    <div className="space-y-6 pb-4">
      <Conversation className="px-0 m-0">
        <ConversationContent className="px-0 m-0 space-y-4 pb-2">
          {messages?.map((message: any, index: number) => {
            if (message.type === "user") {
              return (
                <UserMessage
                  key={message.id || index}
                  content={message.content}
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
                  onCopy={() => handleCopyMessage(message.content)}
                />
              );
            } else if (message.type === "ai") {
              const messageReactionState = reactionStates[message.id] || {
                liked: false,
                disliked: false,
              };

              return (
                <div key={message.id || index} className="space-y-4">
                  {/* Main AI Message - Only this shows the AI avatar */}
                  <AIMessage
                    message={message}
                    content={message.content}
                    analysis={message.analysis}
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
                    onCopy={() => handleCopyMessage(message.content)}
                    onLike={() => handleLikeToggle(message.id)}
                    onDislike={() => handleDislikeToggle(message.id)}
                    onReload={() => handleRegenerateMessage(message.id)}
                  />

                  {/* Render generation groups - These don't show AI avatar */}
                  {message.generationGroups?.map((group: GenerationGroup) => (
                    <VersioningMessage
                      key={group.id}
                      generation={group}
                      onToggle={toggleGeneration}
                      onRetry={retryLoading}
                      onCopy={() =>
                        handleCopyMessage(JSON.stringify(group.items, null, 2))
                      }
                      onLike={() => handleLikeToggle(message.id)}
                      onDislike={() => handleDislikeToggle(message.id)}
                      onReload={() => handleRegenerateMessage(message.id)}
                      onItemClick={(item) => handleGenerationItemClick(item.id)}
                      isGenerating={
                        isGenerating && message.metadata?.isStreaming
                      }
                    />
                  ))}
                </div>
              );
            }
            return null;
          })}

          {status === "submitted" && <Loader />}
        </ConversationContent>
        {/* Rely on browser scroll; hide internal scroll button */}
      </Conversation>
    </div>
  );
}
