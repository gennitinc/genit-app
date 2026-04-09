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
import { PreviewPanel } from "../chat/preview-panel";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function ChatLayout() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  
  console.log("[ChatLayout] Rendering. isMobile:", isMobile, "isDesktop:", isDesktop);

  return (
    <div className="flex relative w-full h-[100vh] overflow-hidden bg-white dark:bg-[#09090b]">
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className="relative flex-1 flex flex-col h-full overflow-hidden min-w-0"
      >
        <div className="flex-none">
          <TopNavWithAurora
            scrollContainerRef={
              scrollContainerRef as React.RefObject<HTMLDivElement>
            }
          />
        </div>

        {isDesktop ? (
          <ResizablePanelGroup
            id="chat-canvas-split"
            orientation="horizontal"
            className="flex w-full h-full"
          >

            <ResizablePanel
              defaultSize={30}
              minSize={20}
              maxSize={35}
              className="group/panel relative flex flex-col backdrop-blur-xl z-20 min-w-0 overflow-hidden"
            >
              <div className="flex-1 h-full custom-scrollbar min-w-0">
                <div className="w-full h-full flex flex-col">
                  <TextChatContent />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle
              className="w-0.5 bg-border/50 hover:bg-primary/20 transition-colors z-30"
            />

            <ResizablePanel
              defaultSize={70}
              minSize={20}
              maxSize={65}
              className="block"
            >
              <div className="h-full relative overflow-hidden bg-[#fafafa] dark:bg-[#09090b] p-4 ">
                <PreviewPanel />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <TextChatContent />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
