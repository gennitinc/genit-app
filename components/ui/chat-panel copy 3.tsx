"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PricingDialog } from "../common/pricing-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaperclipIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo"; // Updated import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChat, useUserContext } from "@/context";
import cn from "classnames";
import { useRouter } from "next/navigation";
import appLogo from "@/resources/images/gennit2.png";
import parse from "html-react-parser"; // Import HTML parser
import { motion } from "framer-motion";
import Prism from "prismjs";
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
  id: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onNewChat?: () => void;
  isMobile: boolean;
  isTablet: boolean;
  history?: ChatHistoryItem[];
}

export function ChatPanel({ isMobile, isTablet, history = [] }: any) {
  const [input, setInput] = useState("");
  const [tabHeight, setTabHeight] = useState(0);
  const tabRef = useRef<HTMLDivElement>(null);
  const [beamPosition, setBeamPosition] = useState({ x: 50, y: 50 });
  const router = useRouter();
  const user = useUserContext().user;
  const socket = useRef<any>(null);
  const placeholderText = "Imagine Something...✦˚";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set CSS variables for responsive heights
    document.documentElement.style.setProperty(
      "--header-height",
      tabRef.current ? `${tabRef.current.offsetHeight}px` : "60px"
    );
    document.documentElement.style.setProperty("--input-height", "160px"); // Adjust based on your input area height

    // Update on resize
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

  const {
    messages,
    setMessages,
    setVersions,
    chat,
    setChat,
    versions,
    sendMessage,
    fetchVersions,
    isTyping,
    handleTyping,
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Apply syntax highlighting whenever messages change
    setTimeout(() => {
      Prism.highlightAll();
    }, 100); // Small delay to ensure DOM is updated
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = {
        type: "user",
        content: input,
        name: user?.username,
        userId: user?._id,
        avatar: "https://cdn-icons-png.flaticon.com/512/1090/1090675.png",
      };

      console.log("userMessage", userMessage);

      // Get chat ID safely
      const chatId = chat?._id?.toString() || "";

      // Send message and clear input
      sendMessage(input, chatId);
      setInput("");
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-100 dark:bg-black">
      <Tabs defaultValue="chat" className="flex flex-col flex-1">
        <div
          ref={tabRef}
          className=" py-[2px] px-2 sm:px-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <Logo className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                Gennit
              </h2>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </Button>
              <TabsList className="justify-end rounded-full">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
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
            <div className="space-y-4 py-4">
              {messages.map((message: any, index: number) => {
                let content = message.content;

                // Process AI message content more safely
                if (message.type === "ai" && content) {
                  try {
                    // Check if content is already a string
                    if (typeof content === "string") {
                      // Try to parse if it looks like JSON
                      if (
                        content.trim().startsWith("{") &&
                        content.trim().endsWith("}")
                      ) {
                        const parsedContent = JSON.parse(content);

                        // Extract responseText if available
                        if (
                          parsedContent?.responseText &&
                          typeof parsedContent.responseText === "string"
                        ) {
                          content = parsedContent.responseText;
                        }
                      }
                    } else if (typeof content === "object") {
                      // If content is already an object, extract responseText or stringify it
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
                    // If parsing fails, use the original content
                    console.error("Error processing AI message:", error);
                  }
                }

                return (
                  <div
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4"
                  >
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
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

                    <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed whitespace-pre-wrap mt-1">
                      {typeof content === "string"
                        ? parse(content)
                        : String(content)}
                    </div>
                  </div>
                );
              })}
            </div>

            {isTyping && (
              <div className="flex items-start gap-3 pb-4 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={appLogo.src} alt="ai" />
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
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
         
          <motion.div
            className="flex flex-col relative w-full max-w-full md:max-w-2xl mx-auto px-2 md:px-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative flex bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100 dark:from-[#7e7e7e] dark:via-[#363636] dark:to-[#363636] rounded-2xl p-[1.5px] overflow-hidden before:absolute before:content-[''] before:top-[-10px] before:left-[-10px] before:bg-radial-gradient before:w-[40vh] before:h-[30px] before:blur-[1px] w-full shadow-lg">
   
              <motion.div
                className="absolute w-36 h-30 rounded-full bg-blue-400/20 dark:bg-blue-500/20 blur-3xl pointer-events-none z-0"
                animate={{
                  left: `${beamPosition.x}%`,
                  top: `${beamPosition.y}%`,
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                }}
                style={{
                  transform: "translate(-50%, -50%)",
                }}
              />

              <div className="flex flex-col bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-[15px] w-full overflow-hidden z-10 shadow-inner">
                {/* Credit info and typing indicator */}
                <div className="flex items-center mx-4 justify-between text-sm mt-3 mb-2">
                  {!isTyping && (
                    <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      0 Credit left
                    </div>
                  )}
                  {isTyping && (
                    <div className="text-muted-foreground dark:text-zinc-400 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      0 Credit left
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <PricingDialog>
                      <a className="text-primary dark:text-teal-400 hover:text-primary/80 dark:hover:text-teal-300 transition-colors cursor-pointer text-sm font-medium">
                        Upgrade
                      </a>
                    </PricingDialog>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="relative w-full">
                  <div className="relative flex">
                    <textarea
                      id="chat_bot"
                      name="chat_bot"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        isTyping
                          ? "Prompt is being processed..."
                          : placeholderText
                      }
                      disabled={isTyping}
                      className="bg-transparent rounded-2xl border-none w-full h-[60px] text-gray-800 dark:text-white font-sans font-normal p-4 pr-16 sm:pr-24 resize-none outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:transition-all placeholder:duration-300 focus:placeholder:text-gray-400 dark:focus:placeholder:text-[#363636] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#888] scrollbar-thumb-rounded hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-[#555] text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3">
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        type="button"
                        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-gray-400 dark:text-white/30 bg-transparent rounded-full hover:bg-gray-100 dark:hover:bg-white/5 border-none cursor-pointer transition-all duration-200"
                      >
                        <PaperclipIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-gray-400 dark:text-white/30 bg-transparent rounded-full hover:bg-gray-100 dark:hover:bg-white/5 border-none cursor-pointer transition-all duration-200"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          height={16}
                          width={16}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm0-8h6m-3-3v6"
                            strokeWidth={2}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-gray-400 dark:text-white/30 bg-transparent rounded-full hover:bg-gray-100 dark:hover:bg-white/5 border-none cursor-pointer transition-all duration-200"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          height={16}
                          width={16}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.01 8.01 0 0 0 5.648 6.667M10.03 13c.151 2.439.848 4.73 1.97 6.752A15.9 15.9 0 0 0 13.97 13zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.01 8.01 0 0 0 19.938 13M4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.01 8.01 0 0 0 4.062 11m5.969 0h3.938A15.9 15.9 0 0 0 12 4.248A15.9 15.9 0 0 0 10.03 11m4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.01 8.01 0 0 0-5.648-6.667"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={isTyping || !input.trim()}
                      className={`flex items-center justify-center p-0.5 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-100 dark:from-[#292929] dark:via-[#555555] dark:to-[#292929] rounded-[10px] shadow-[inset_0_6px_2px_-4px_rgba(255,255,255,0.5)] cursor-pointer border-none outline-none transition-all duration-150 active:scale-[0.92] group ${
                        isTyping || !input.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-md"
                      }`}
                    >
                      <div className="w-[34px] h-[34px] flex items-center justify-center bg-gray-100/50 dark:bg-black/10 rounded-[10px] backdrop-blur-[3px] text-gray-500 dark:text-[#8b8b8b] group-hover:text-gray-700 dark:group-hover:text-white transition-colors">
                        <svg
                          viewBox="0 0 512 512"
                          className="w-5 h-5 transition-all duration-300"
                        >
                          <path
                            fill="currentColor"
                            d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
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
