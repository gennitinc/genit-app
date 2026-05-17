"use client";

import { ChatInput } from "../chat/chat-input";
import { PreviewPanel } from "../chat/preview-panel";
import { TextChatContent } from "../chat/text-chat-content";
import { LandingNavbar } from "../landing/landing-navbar";
import { AppSidebar } from "./app-sidebar";
import TopNavWithAurora from "./top-nav-with-aurora";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef } from "react";
import React from "react";

export function ChatLayout() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;


  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-[#09090b]'>
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className='relative flex h-full min-w-0 flex-1 flex-col overflow-hidden'
      >
        <div className='flex-none'>
          <TopNavWithAurora
            scrollContainerRef={
              scrollContainerRef as React.RefObject<HTMLDivElement>
            }
          />
        </div>

        {isDesktop ? (
          <ResizablePanelGroup
            id='chat-canvas-split'
            orientation='horizontal'
            className='min-h-0 w-full flex-1'
          >
            <ResizablePanel
              defaultSize={30}
              minSize={20}
              maxSize={35}
              className='group/panel relative z-20 flex min-w-0 flex-col overflow-hidden backdrop-blur-xl'
            >
              <div className='custom-scrollbar h-full min-w-0 flex-1'>
                <div className='flex h-full w-full flex-col'>
                  <TextChatContent />
                </div>
              </div>
            </ResizablePanel>

            {/* <ResizableHandle
              className="w-0.5 bg-border/50 hover:bg-primary/20 transition-colors z-30"
            /> */}

            <ResizablePanel
              defaultSize={70}
              minSize={20}
              maxSize={65}
              className='block'
            >
              <div className='relative h-full overflow-hidden bg-[#fafafa] p-4 dark:bg-[#09090b]'>
                <PreviewPanel />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className='flex min-h-0 w-full flex-1 flex-col overflow-hidden'>
            <div className='flex-1 overflow-hidden'>
              <TextChatContent />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
