"use client";

import type React from "react";
import { Paperclip, Mic, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useCallback, useState } from "react";
import { useProjectDesign } from "@/context/DesignProject";

const models = [
  {
    name: "GPT 4o",
    value: "openai/gpt-4o",
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1",
  },
];

interface ChatInterfaceProps {
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  children,
  placeholder = "Ask a follow up message...",
  className = "",
}: ChatInterfaceProps) {
  const {
    inputValue,
    attachedFiles,
    fileLoadingStates,
    isDragOver,
    showScrollButton,
    setInputValue,
    setAttachedFiles,
    setFileLoadingStates,
    setIsDragOver,
    setDragCounter,
    setShowScrollButton,
    handleInput,
    handleKeyDown,
    handlePaste,
    processFiles,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    scrollToBottom: contextScrollToBottom,
    autoResize: contextAutoResize,
    clearInput,
    removeAttachedFile,
    sendMessage,
    isGenerating,
    project,
    error,
  } = useProjectDesign();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track if user has manually scrolled up
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [hasInitiallyScrolled, setHasInitiallyScrolled] = useState(false);

  // Local autoResize implementation using textareaRef
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, []);

  // Enhanced scrollToBottom with force option for initial render
  const scrollToBottom = useCallback((force = false) => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTo({
        top: chatContentRef.current.scrollHeight,
        behavior: force ? "auto" : "smooth",
      });
    }
  }, []);

  // Function to check scroll position and update showScrollButton
  const checkScrollPosition = useCallback(() => {
    if (chatContentRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = chatContentRef.current;
      const threshold = 150;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isAtBottom = distanceFromBottom <= 5;
      const isNearBottomCheck = distanceFromBottom <= threshold;
      const isScrollable = scrollHeight > clientHeight;

      setIsNearBottom(isNearBottomCheck);
      setUserScrolledUp(!isNearBottomCheck);
      setShowScrollButton(isScrollable && distanceFromBottom > 50);
    }
  }, [setShowScrollButton]);

  // Effect to resize textarea on inputValue change
  useEffect(() => {
    autoResize();
  }, [inputValue, autoResize]);

  // Enhanced effect for initial auto-scroll on first render
  useEffect(() => {
    if (!hasInitiallyScrolled && chatContentRef.current) {
      const scrollAttempts = [0, 50, 100, 200, 500];
      scrollAttempts.forEach((delay) => {
        setTimeout(() => {
          if (chatContentRef.current) {
            scrollToBottom(true);
            checkScrollPosition();
          }
        }, delay);
      });

      const resizeObserver = new ResizeObserver(() => {
        if (chatContentRef.current && !hasInitiallyScrolled) {
          scrollToBottom(true);
          checkScrollPosition();
        }
      });

      if (chatContentRef.current) {
        resizeObserver.observe(chatContentRef.current);
      }

      const markScrolledTimer = setTimeout(() => {
        setHasInitiallyScrolled(true);
      }, 1000);

      return () => {
        resizeObserver.disconnect();
        clearTimeout(markScrolledTimer);
      };
    }
  }, [hasInitiallyScrolled, scrollToBottom, checkScrollPosition]);

  // Effect to scroll to bottom when messages or streaming content changes
  useEffect(() => {
    if (hasInitiallyScrolled && (isNearBottom || isGenerating)) {
      scrollToBottom();
    }
    const timer = setTimeout(checkScrollPosition, 150);
    return () => clearTimeout(timer);
  }, [
    project?.messages,
    isGenerating,
    hasInitiallyScrolled,
    isNearBottom,
    scrollToBottom,
    checkScrollPosition,
  ]);

  // Add scroll event listener to chat content area
  // useEffect(() => {
  //   const chatContentElement = chatContentRef.current;
  //   if (chatContentElement) {
  //     let scrollTimeout: NodeJS.Timeout;
  //     const handleScroll = () => {
  //       clearTimeout(scrollTimeout);
  //       scrollTimeout = setTimeout(() => {
  //         checkScrollPosition();
  //       }, 50);
  //     };

  //     chatContentElement.addEventListener("scroll", handleScroll, {
  //       passive: true,
  //     });
  //     checkScrollPosition();

  //     return () => {
  //       chatContentElement.removeEventListener("scroll", handleScroll);
  //       clearTimeout(scrollTimeout);
  //     };
  //   }
  // }, [checkScrollPosition]);

  // FIXED: Handle sending messages with proper project identification
  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;
   
    if (!project?._id) {
      console.error("No project ID available");
      return;
    }

    try {
      // Use projectId for proper server routing
      await sendMessage(inputValue, attachedFiles, project._id);

      // Force scroll to bottom when sending a new message
      setTimeout(() => {
        scrollToBottom();
        setUserScrolledUp(false);
        setIsNearBottom(true);
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Enhanced key down handler
  const handleEnhancedKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
    handleKeyDown(event);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className={`h-full flex flex-col bg-transparent  ${className}`}>
      <style jsx>{`
        @keyframes gentle-bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-2px);
          }
          60% {
            transform: translateY(-1px);
          }
        }
      `}</style>

      {/* Chat Content Area with hover-only scrollbar */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {children}
      </div>

      {/* Bottom Input Area - with drag and drop handlers */}
      <div
        ref={inputSectionRef}
        className="sticky bottom-0 p-2 backdrop-blur-sm z-10"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Scroll to Bottom Button */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 -top-12 z-20 transition-opacity duration-300 ${
            showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={() => {
              scrollToBottom();
              setUserScrolledUp(false);
              setIsNearBottom(true);
            }}
            className="bg-background/80 backdrop-blur-sm border border-border rounded-full p-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              animation: showScrollButton
                ? "gentle-bounce 2s infinite"
                : "none",
            }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="relative">
          {/* File Attachments or Drag Drop Zone */}
          {isDragOver ? (
            <div className="mb-3">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-background/50 transition-all duration-200 hover:border-border hover:bg-background">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                    <Plus className="w-3 h-3" />
                  </div>
                  <span className="text-sm">
                    Drop files here to add to your message.
                  </span>
                </div>
              </div>
            </div>
          ) : attachedFiles.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3 custom-scrollbar-horizontal">
              {attachedFiles.map((file, index) => {
                const fileKey = file.fileKey || `${file.name}-${index}`;
                const isLoading = fileLoadingStates[fileKey];
                return (
                  <div
                    key={fileKey}
                    className="relative group bg-muted-foreground/5 border border-border rounded-lg p-2 flex items-center gap-2 hover:bg-background/50 transition-colors max-w-[200px]"
                  >
                    <div className="w-8 h-8 bg-background border border-border rounded flex items-center justify-center flex-shrink-0 relative">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : file.type && file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover rounded"
                          onLoad={(e) =>
                            URL.revokeObjectURL(
                              (e.target as HTMLImageElement).src
                            )
                          }
                        />
                      ) : (
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          isLoading
                            ? "text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {isLoading
                          ? "Loading..."
                          : file.name && file.name.length > 15
                            ? `${file.name.substring(0, 15)}...`
                            : file.name || "Unknown file"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isLoading
                          ? "Processing..."
                          : formatFileSize(file.size)}
                      </p>
                    </div>
                    {!isLoading && (
                      <button
                        onClick={() => removeAttachedFile(index)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-muted-foreground hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        &times;
                      </button>
                    )}
                    {!isLoading &&
                      file.type &&
                      file.type.startsWith("image/") && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          <div className="bg-background border border-border rounded-lg shadow-lg p-2">
                            <img
                              src={
                                URL.createObjectURL(file) || "/placeholder.svg"
                              }
                              alt={file.name}
                              className="max-w-[200px] max-h-[150px] object-contain rounded"
                              onLoad={(e) =>
                                URL.revokeObjectURL(
                                  (e.target as HTMLImageElement).src
                                )
                              }
                            />
                            <div className="mt-1 text-xs text-muted-foreground text-center">
                              {file.name} • {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 bg-muted-foreground/5 border border-border rounded-xl p-3 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleEnhancedKeyDown}
                onPaste={handlePaste}
                placeholder={
                  isGenerating
                    ? "AI is generating..."
                    : ""
                }
                disabled={isGenerating}
                className="w-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-sm resize-none overflow-y-auto custom-scrollbar disabled:opacity-50"
                style={{
                  lineHeight: "1.5",
                  fontFamily: "inherit",
                  minHeight: "40px",
                  maxHeight: "300px",
                }}
                rows={1}
              />
            </div>

            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 justify-start">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 hover:bg-background/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  disabled={isGenerating }
                >
                  <Mic className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 hover:bg-background/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating }
                >
                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.js,.jsx,.ts,.css,.html,.json,.xml,.yaml,.yml"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 hover:bg-background/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  disabled={isGenerating }
                >
                  <svg
                    width="14"
                    height="20"
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
                        <rect width="53.3333" height="80" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </Button>
              </div>

              <button
                type="submit"
                onClick={handleSendMessage}
                disabled={
                  isGenerating ||
                  (!inputValue.trim() && attachedFiles.length === 0)
                }
                className={`flex items-center justify-center p-0.5 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-100 dark:from-[#292929] dark:via-[#555555] dark:to-[#292929] rounded-[10px] shadow-[inset_0_6px_2px_-4px_rgba(255,255,255,0.5)] cursor-pointer border-none outline-none transition-all duration-150 active:scale-[0.92] group ${
                  isGenerating ||
                  (!inputValue.trim() && attachedFiles.length === 0)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md"
                }`}
              >
                <div className="w-[34px] h-[34px] flex items-center justify-center bg-gray-100/50 dark:bg-black/10 rounded-[10px] backdrop-blur-[3px] text-gray-500 dark:text-[#8b8b8b] group-hover:text-gray-700 dark:group-hover:text-white transition-colors">
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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

          {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 rounded-xl -z-10 translate-y-1 blur-sm"></div> */}
        </div>

        
      </div>
    </div>
  );
}
