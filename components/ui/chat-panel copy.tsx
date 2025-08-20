"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PricingDialog } from "../common/pricing-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpIcon, PaperclipIcon, Mic, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo"; // Updated import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { io } from "socket.io-client";
import { useChat, useUserContext } from "@/context";
import cn from "classnames";
import { useRouter } from "next/navigation";
import appLogo from "@/resources/images/gennit2.png";
import parse from "html-react-parser"; // Import HTML parser
import Image from "next/image";
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
  const router = useRouter();
  const user = useUserContext().user;
  const socket = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    Prism.highlightAll(); // Automatically apply syntax highlighting on mount
  }, []);

  useEffect(() => {}, [messages]);

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

      const chatId = chat?._id.toString(); // This should be fetched from your app's state/context

      sendMessage(input, chatId);

      setInput("");
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-100 dark:bg-black">
      <Tabs defaultValue="chat" className="flex flex-col flex-1">
        <div
          ref={tabRef}
          className="border-b border-zinc-200 dark:border-zinc-800 py-[2px] px-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo className="w-12 h-12 flex-shrink-0" />
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
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
              <TabsList className="justify-end">
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
            className={cn(
              "flex-1 px-4",
              isMobile
                ? "max-h-[calc(100vh-20rem)]"
                : isTablet
                ? "max-h-[calc(100vh-16rem)]"
                : "max-h-[calc(100vh-13rem)]"
            )}
          >
            <div className="space-y-4 py-4">
              {messages.map((message: any, index: number) => {
                let content = message.content;
                let parsedContent;

                // Attempt to parse AI-generated messages
                if (message.type === "ai") {
                  try {
                    parsedContent = JSON.parse(content);

                    // Check for specific properties in the parsed JSON
                    if (
                      parsedContent?.responseText &&
                      typeof parsedContent.responseText === "string"
                    ) {
                      content = parsedContent.responseText; // Use responseText if available
                    } else if (typeof parsedContent === "object") {
                      // Handle other JSON structures gracefully
                      content = JSON.stringify(parsedContent, null, 2); // Pretty-print JSON
                    }
                  } catch (error) {
                    console.error("Invalid AI response JSON:", error);
                  }
                }

                return (
                  <div
                    key={message.id}
                    className="flex items-start gap-3 pb-4 mb-4"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          message.type === "ai"
                            ? appLogo.src
                            : user?.userdp || "/user-avatar.png"
                        }
                        alt={message.role}
                        className="rounded-md"
                      />
                      <AvatarFallback className="rounded-md">
                        {message.type === "ai"
                          ? "AI"
                          : user?.username?.[0]?.toLowerCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-sm text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed whitespace-pre-wrap mt-1">
                      {parse(content)}
                    </div>
                  </div>
                );
              })}
            </div>

            {isTyping && (
              <div className="flex items-start gap-3 pb-4 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={appLogo.src} alt="ai" />
                  <AvatarFallback>{"ai"}</AvatarFallback>
                </Avatar>
                <div className="flex items-start mt-1">
                  <div className="chat chat-start p-0 m-0 w-full">
                    <div className="chat-bubble text-sm flex flex-row  gap-2 items-center text-gray-900">
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
          <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="text-muted-foreground dark:text-zinc-400">
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
                  className="h-20 resize-none pr-12 text-sm bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-600 rounded-lg placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white"
                  >
                    <svg
                      width={20}
                      height={30}
                      viewBox="0 0 54 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_912_3)">
                        <path
                          d="M13.3333 80.0002C20.6933 80.0002 26.6667 74.0268 26.6667 66.6668V53.3335H13.3333C5.97333 53.3335 0 59.3068 0 66.6668C0 74.0268 5.97333 80.0002 13.3333 80.0002Z"
                          fill="#0ACF83"
                        />
                        <path
                          d="M0 39.9998C0 32.6398 5.97333 26.6665 13.3333 26.6665H26.6667V53.3332H13.3333C5.97333 53.3332 0 47.3598 0 39.9998Z"
                          fill="#A259FF"
                        />
                        <path
                          d="M0 13.3333C0 5.97333 5.97333 0 13.3333 0H26.6667V26.6667H13.3333C5.97333 26.6667 0 20.6933 0 13.3333Z"
                          fill="#F24E1E"
                        />
                        <path
                          d="M26.6667 0H40.0001C47.3601 0 53.3334 5.97333 53.3334 13.3333C53.3334 20.6933 47.3601 26.6667 40.0001 26.6667H26.6667V0Z"
                          fill="#FF7262"
                        />
                        <path
                          d="M53.3334 39.9998C53.3334 47.3598 47.3601 53.3332 40.0001 53.3332C32.6401 53.3332 26.6667 47.3598 26.6667 39.9998C26.6667 32.6398 32.6401 26.6665 40.0001 26.6665C47.3601 26.6665 53.3334 32.6398 53.3334 39.9998Z"
                          fill="#1ABCFE"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_912_3">
                          <rect width="53.3333" height={80} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 text-white rounded-full px-3 focus:ring-offset-2 dark:focus:ring-transparent"
                    type="submit"
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                  </Button>
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
