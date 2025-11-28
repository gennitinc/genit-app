"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LandingNavbar } from "../landing/landing-navbar";
import { ChatInput } from "../chat/chat-input";
import { TextChatContent } from "../chat/text-chat-content";
import { AppSidebar } from "./app-sidebar";
import TopNavWithAurora from "./top-nav-with-aurora";
import { useRef } from "react";

export function ChatLayout() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex relative w-full h-[100dvh] overflow-hidden bg-white dark:bg-black">
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col h-[100dvh] overflow-auto will-change-scroll scroll-container relative w-auto"
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <div className="w-full lg:max-w-[600px] lg:mx-auto flex-1 flex flex-col min-h-0">
          <TextChatContent />
        </div>
        <div className="sticky bottom-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur">
          <ChatInput placeholder="Ask a follow up message..." />
        </div>
      </div>
    </div>
  );
}
