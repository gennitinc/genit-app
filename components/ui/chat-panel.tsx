"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PricingDialog } from "../common/pricing-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/context/ChatProjectContext";
import { useUserContext } from "@/context/AuthenticatedContext";
import cn from "classnames";
import { useRouter } from "next/navigation";
import appLogo from "@/resources/images/gennit2.png";
import { motion } from "framer-motion";
import Prism from "prismjs";
import { PaperclipIcon, XIcon, PlusIcon, Mic, Loader2 } from "lucide-react";
import "prismjs/themes/prism.css";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

interface ChatHistoryItem {
  id: number;
  title: string;
  timestamp: string;
  preview: string;
}

interface ChatPanelProps {
  id?: string;
  messages?: Message[];
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
  onNewChat?: () => void;
  isMobile: boolean;
  isTablet: boolean;
  history?: ChatHistoryItem[];
  onFileGenerated?: (
    fileName: string,
    content: string,
    isComplete: boolean
  ) => void;
  onGenerationComplete?: () => void;
}

export function ChatPanel({
  isMobile,
  isTablet,
  history = [],
  onFileGenerated,
  onGenerationComplete,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [tabHeight, setTabHeight] = useState(0);
  const tabRef = useRef<HTMLDivElement>(null);
  const [beamPosition, setBeamPosition] = useState({ x: 50, y: 50 });
  const router = useRouter();
  const user = useUserContext().user;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("chat");

  const {
    messages,
    setMessages,
    setVersions,
    chat,
    setChat,
    versions,
    sendMessage,
    startMessage,
    fetchVersions,
    isTyping,
    handleTyping,
    streamingText,
    isAiTyping,
    isConnected,
  } = useChat();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      tabRef.current ? `${tabRef.current.offsetHeight}px` : "60px"
    );
    document.documentElement.style.setProperty("--input-height", "160px");

    const handleResize = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        tabRef.current ? `${tabRef.current.offsetHeight}px` : "60px"
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (tabRef.current) {
      setTabHeight(tabRef.current.offsetHeight);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isAiTyping]);

  useEffect(() => {
    setTimeout(() => {
      Prism.highlightAll();
    }, 100);
  }, [messages]);

  // Simulate the beam movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBeamPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      console.log("Empty input, not sending");
      return;
    }

    if (!isConnected) {
      console.error("Socket not connected");
      return;
    }

    const messageContent = input.trim();
    setInput(""); // Clear input immediately

    try {
      if (chat?._id) {
        // Existing chat
        console.log("Sending to existing chat:", chat._id);
        await sendMessage(chat._id, messageContent);
      } else {
        // New chat
        console.log("Starting new chat");
        const newChatId = await startMessage(messageContent);
        console.log("New chat created:", newChatId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Re-add the input if there was an error
      setInput(messageContent);
    }
  };

  const formatContent = (text: string) => {
    if (typeof text !== "string") return text;

    return (
      text
        // Convert markdown-style headers
        .replace(
          /### (.*?)(\n|$)/g,
          '<h3 class="text-lg font-semibold mt-4 mb-2 text-zinc-800 dark:text-zinc-200">$1</h3>'
        )
        .replace(
          /## (.*?)(\n|$)/g,
          '<h2 class="text-xl font-semibold mt-4 mb-2 text-zinc-800 dark:text-zinc-200">$1</h2>'
        )
        .replace(
          /# (.*?)(\n|$)/g,
          '<h1 class="text-2xl font-bold mt-4 mb-2 text-zinc-800 dark:text-zinc-200">$1</h1>'
        )
        // Convert markdown-style bold and italic
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-zinc-800 dark:text-zinc-200">$1</strong>'
        )
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Convert numbered lists
        .replace(
          /^\d+\.\s+(.*)$/gm,
          '<div class="ml-4 mb-1"><span class="font-medium text-zinc-700 dark:text-zinc-300">• $1</span></div>'
        )
        // Convert bullet points
        .replace(
          /^[-•]\s+(.*)$/gm,
          '<div class="ml-4 mb-1"><span class="text-zinc-700 dark:text-zinc-300">• $1</span></div>'
        )
        // Convert line breaks to proper spacing
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>")
        // Add spacing around sections
        .replace(/(<h[1-3][^>]*>)/g, '<div class="mt-4">$1')
        .replace(/(<\/h[1-3]>)/g, "$1</div>")
    );
  };

  return (
    <div className="flex h-full flex-col bg-zinc-100 dark:bg-black">
      <Tabs defaultValue="chat" className="flex flex-col flex-1">
        <div ref={tabRef} className="py-[2px] px-2 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <Logo className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                Gennit
              </h2>
            </div>
            <div className="flex flex-row items-center gap-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/")}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <PlusIcon className="size-5" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <TabsList className="bg-zinc-800/50 border border-zinc-700 rounded-full p-1">
                  <TabsTrigger
                    value="chat"
                    className={cn(
                      "relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-rose-500/20 data-[state=active]:text-white text-zinc-400 rounded-full"
                    )}
                  >
                    {activeTab === "chat" && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/10 to-rose-500/10"
                        layoutId="tab-background"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className={cn(
                      "relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-rose-500/20 data-[state=active]:text-white text-zinc-400 rounded-full"
                    )}
                  >
                    {activeTab === "history" && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/10 to-rose-500/10"
                        layoutId="tab-background"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    History
                  </TabsTrigger>
                </TabsList>
              </motion.div>
            </div>
          </div>
        </div>

        <TabsContent
          value="chat"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <ScrollArea
            className="flex-1 px-2 sm:px-4 overflow-y-auto"
            style={{
              maxHeight:
                "calc(99vh - (var(--header-height) + var(--input-height)))",
              height: "100%",
            }}
          >
            <div className="space-y-2 py-4">
              {messages.map((message: any, index: number) => {
                let content = message.content;

                if (message.type === "ai" && content) {
                  try {
                    if (typeof content === "string") {
                      if (
                        content.trim().startsWith("{") &&
                        content.trim().endsWith("}")
                      ) {
                        const parsedContent = JSON.parse(content);
                        if (
                          parsedContent?.responseText &&
                          typeof parsedContent.responseText === "string"
                        ) {
                          content = parsedContent.responseText;
                        }
                      }
                    } else if (typeof content === "object") {
                      if (
                        content.responseText &&
                        typeof content.responseText === "string"
                      ) {
                        content = content.responseText;
                      } else {
                        content = JSON.stringify(content, null, 2);
                      }
                    }
                  } catch (error) {
                    console.error("Error processing AI message:", error);
                  }
                }

                const formattedContent =
                  message.type === "ai" ? formatContent(content) : content;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-2 sm:gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4"
                  >
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                      <AvatarImage
                        src={
                          message.type === "ai"
                            ? appLogo.src
                            : user?.userdp || "/user-avatar.png"
                        }
                        alt={message.type}
                        className="rounded-md"
                      />
                      <AvatarFallback className="rounded-md">
                        {message.type === "ai"
                          ? "AI"
                          : user?.username?.[0]?.toLowerCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed">
                        {message.type === "ai" ? (
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{
                              __html: formattedContent,
                            }}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">{content}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Show streaming text if available */}
              {streamingText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 sm:gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4"
                >
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                    <AvatarImage
                      src={appLogo.src || "/placeholder.svg"}
                      alt="ai"
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed">
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{
                          __html: formatContent(streamingText),
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Simple typing indicator */}
            {(isTyping || isAiTyping) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 pb-4 mb-4"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={appLogo.src || "/placeholder.svg"}
                    alt="ai"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex items-start mt-1">
                  <div className="p-0 m-0 w-full">
                    <div className="text-sm flex flex-row gap-2 items-center text-gray-900">
                      <p className="text-sm text-muted-foreground dark:text-zinc-400">
                        Gennit is thinking
                      </p>
                      <div className="flex space-x-2 justify-center items-center h-fit mt-0.5">
                        <div className="h-2 w-2 bg-muted-foreground dark:bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 bg-muted-foreground dark:bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 bg-muted-foreground dark:bg-zinc-400 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-zinc-200 dark:border-zinc-800 px-2 py-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="text-muted-foreground dark:text-zinc-400 ml-2">
                0 Credit left.
              </div>
              <div className="flex items-center gap-2">
                <PricingDialog>
                  <a className="text-primary dark:text-teal-400 hover:text-primary/80 dark:hover:text-teal-300 transition-colors cursor-pointer">
                    Upgrade
                  </a>
                </PricingDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <Textarea
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!isConnected || isTyping}
                  className="h-28 resize-none pr-12 text-sm bg-white dark:bg-[#141415] border-zinc-300 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-600 rounded-2xl placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-zinc-700"
                  >
                    <PaperclipIcon className="h-4 w-4 text-zinc-400" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-zinc-700"
                  >
                    <Mic className="h-4 w-4 text-zinc-400" />
                  </Button>
                  <button
                    type="submit"
                    disabled={!isConnected || isTyping || !input.trim()}
                    className={`flex items-center justify-center p-0.5 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-100 dark:from-[#292929] dark:via-[#555555] dark:to-[#292929] rounded-[10px] shadow-[inset_0_6px_2px_-4px_rgba(255,255,255,0.5)] cursor-pointer border-none outline-none transition-all duration-150 active:scale-[0.92] group ${
                      !isConnected || isTyping || !input.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md"
                    }`}
                  >
                    <div className="w-[34px] h-[34px] flex items-center justify-center bg-gray-100/50 dark:bg-black/10 rounded-[10px] backdrop-blur-[3px] text-gray-500 dark:text-[#8b8b8b] group-hover:text-gray-700 dark:group-hover:text-white transition-colors">
                      {isTyping ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <svg
                          viewBox="0 0 512 512"
                          className="w-5 h-5 transition-all duration-300"
                        >
                          <path
                            fill="currentColor"
                            d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="history" className="p-4 h-full">
          <h3 className="text-lg font-semibold mb-4">Chat History</h3>
          {versions && versions.length > 0 ? (
            <ScrollArea className={cn("flex-1 px-4 h-full")}>
              <div className="space-y-4">
                {versions.map((item: any) => (
                  <div
                    key={item.id}
                    className="border-b border-zinc-200 dark:border-zinc-700 border-opacity-10 pb-4"
                  >
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {item.timestamp}
                    </p>
                    <p className="text-sm mt-1">{item.preview}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your chat history is empty.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
