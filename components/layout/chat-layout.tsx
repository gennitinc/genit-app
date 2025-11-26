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
        className="flex-1 flex flex-col h-screen overflow-auto will-change-scroll scroll-container relative"
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <div className="w-full lg:max-w-[600px] lg:mx-auto h-full flex flex-col">
          <TextChatContent />
        </div>
      </div>
    </div>
  );
}
