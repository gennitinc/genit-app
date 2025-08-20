"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";

interface Message {
  sender: string;
  content: string;
  userId: string;
  avatar?: string;
  createdAt?: string;
  chatId: string;
  type: "user" | "ai";
}

interface Version {
  version: string;
  url?: string;
  gitCommit: string;
  status: "pending" | "building" | "failed" | "success";
  timestamp: string;
}

interface StatusUpdate {
  type: string;
  message: string;
  progress: number;
}

interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: number;
}

interface StreamChunk {
  chatId: string;
  chunk: string;
  fullText: string;
  isComplete: boolean;
  timestamp: number;
}

interface ChatContextType {
  messages: Message[];
  versions: Version[];
  chat: any;
  startMessage: (content: string) => Promise<string>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
  fetchVersions: () => Promise<void>;
  setChat: React.Dispatch<React.SetStateAction<{ _id: string } | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setVersions: React.Dispatch<React.SetStateAction<Version[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isTyping: boolean;
  handleTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  statusUpdate: StatusUpdate | null;
  streamingText: string;
  isAiTyping: boolean;
  typingUsers: TypingIndicator[];
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useUserContext().user;
  const userId = user?._id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chat, setChat] = useState<{ _id: string } | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

 
  const startMessage = useCallback(
    async (content: string): Promise<string> => {
      if (!content || !content.trim()) {
        return Promise.reject("Message content is required");
      }

      if (!socket || !isConnected) {
        return Promise.reject("Socket not connected");
      }

      if (!userId) {
        return Promise.reject("User ID missing");
      }

      console.log("Starting new message:", content);

      setIsTyping(true);
      setStreamingText("");
      setStatusUpdate(null);
      setIsAiTyping(false);

      return new Promise<string>((resolve, reject) => {
        const messageData = {
          content: content.trim(),
          userId,
          chatId: undefined, // New chat
          threadId: undefined, // New thread
        };

        console.log("Emitting user_message for new chat:", messageData);
        socket.emit("user_message", messageData);

        // Listen for the response with chat ID
        const handleServerMessage = (chatData: any) => {
          console.log("Received response for new chat:", chatData);

          if (chatData && chatData._id) {
            setChat({ _id: chatData._id });
            socket.off("server_message", handleServerMessage);
            socket.off("error", handleError);
            resolve(chatData._id);
          }
        };

        const handleError = (error: any) => {
          console.error("Error in startMessage:", error);
          socket.off("server_message", handleServerMessage);
          socket.off("error", handleError);
          setIsTyping(false);
          reject(error.message || "Failed to start chat");
        };

        socket.on("server_message", handleServerMessage);
        socket.on("error", handleError);

        // Timeout after 30 seconds
        setTimeout(() => {
          socket.off("server_message", handleServerMessage);
          socket.off("error", handleError);
          setIsTyping(false);
          reject("Timeout waiting for response");
        }, 30000);
      });
    },
    [socket, isConnected, userId, user]
  );

  const sendMessage = useCallback(
    async (chatId: string, content: string) => {
      // Enhanced validation
      if (!content || typeof content !== "string" || !content.trim()) {
        console.error("Invalid content provided to sendMessage:", content);
        return Promise.reject(
          "Message content is required and must be a non-empty string"
        );
      }

      if (!chatId || typeof chatId !== "string") {
        console.error("Invalid chatId provided to sendMessage:", chatId);
        return Promise.reject("Chat ID is required and must be a string");
      }

      if (!socket || !isConnected) {
        console.error("Socket not connected");
        return Promise.reject("Socket not connected");
      }

      if (!userId) {
        return Promise.reject("User ID missing");
      }

      console.log("Sending message to existing chat:", {
        chatId,
        content: content.trim(),
      });

      setIsTyping(true);
      setStreamingText("");
      setStatusUpdate(null);
      setIsAiTyping(false);

      // Join the chat room for real-time updates
      socket.emit("join_chat", { chatId });

      const messageData = {
        content: content.trim(),
        userId,
        chatId,
        threadId: undefined, // Will be handled by backend
      };

      // Optimistically add user message to UI
      const userMessage: Message = {
        type: "user",
        content: content.trim(),
        userId,
        avatar: user?.metadata?.userdp,
        sender: user?.username || "User",
        chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);

      return new Promise<void>((resolve, reject) => {
        console.log("Emitting user_message to socket:", messageData);
        socket.emit("user_message", messageData);

        // Listen for completion
        const handleStatusUpdate = (status: StatusUpdate) => {
          console.log("Status update in sendMessage:", status);

          if (status.type === "completed") {
            socket.off("status_update", handleStatusUpdate);
            socket.off("error", handleError);
            resolve();
          } else if (status.type === "error") {
            socket.off("status_update", handleStatusUpdate);
            socket.off("error", handleError);
            reject(status.message);
          }
        };

        const handleError = (error: any) => {
          console.error("Error in sendMessage:", error);
          socket.off("status_update", handleStatusUpdate);
          socket.off("error", handleError);
          setIsTyping(false);
          reject(error.message || "Failed to send message");
        };

        socket.on("status_update", handleStatusUpdate);
        socket.on("error", handleError);

        // Timeout after 60 seconds
        setTimeout(() => {
          socket.off("status_update", handleStatusUpdate);
          socket.off("error", handleError);
          setIsTyping(false);
          reject("Timeout waiting for response");
        }, 60000);
      });
    },
    [socket, isConnected, userId, user]
  );

  const handleTyping = useCallback(
    (chatId: string) => {
      if (!socket || !isConnected || !userId || !chatId) return;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Start typing
      socket.emit("start_typing", { userId, chatId });
      setIsTyping(true);

      // Auto-stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        if (socket && isConnected) {
          socket.emit("stop_typing", { userId, chatId });
        }
        setIsTyping(false);
      }, 3000);
    },
    [socket, isConnected, userId]
  );

  const stopTyping = useCallback(
    (chatId: string) => {
      if (!socket || !isConnected || !userId || !chatId) return;

      // Clear timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      socket.emit("stop_typing", { userId, chatId });
      setIsTyping(false);
    },
    [socket, isConnected, userId]
  );

  const fetchVersions = useCallback(async () => {
    if (!socket || !isConnected || !userId) {
      return Promise.reject("Socket not connected or User ID missing");
    }

    return new Promise<void>((resolve, reject) => {
      socket.emit("get_versions", { userId }, (response: any) => {
        if (response?.status === "ok") {
          setVersions(response.data);
          resolve();
        } else {
          reject(response?.error || "Unknown error");
        }
      });
    });
  }, [socket, isConnected, userId]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        startMessage,
        sendMessage,
        setMessages,
        setVersions,
        versions,
        chat,
        setChat,
        fetchVersions,
        isTyping,
        setIsTyping,
        handleTyping,
        stopTyping,
        statusUpdate,
        streamingText,
        isAiTyping,
        typingUsers,
        isConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
