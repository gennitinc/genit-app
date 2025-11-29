"use client";

import type React from "react";
import { Paperclip, Mic, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useCallback, useState } from "react";
import { useUserContext } from "@/context/AuthenticatedContext";
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
    generateMessage,
    isGenerating,
    project,
    error,
  } = useProjectDesign();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext();

  const hasEnoughCredits = (user?.creditsRemaining ?? 0) > 10;
  const validateInput = useCallback((value: string, files: File[]) => {
    if (!value.trim() && files.length === 0) {
      return "Please enter a prompt or attach files";
    }
    if (value.trim().length < 10) {
      return "Please provide a more detailed prompt (at least 10 characters)";
    }
    if (value.trim().length > 5000) {
      return "Prompt is too long (maximum 5000 characters)";
    }
    return null;
  }, []);
  // Restore idea draft (prompt + files) if present
  // useEffect(() => {
  //   try {
  //     const raw = localStorage.getItem("gennit_idea_draft");
  //     if (!raw) return;
  //     const parsed = JSON.parse(raw) as {
  //       prompt?: string;
  //       files?: { name: string; type: string; size: number; dataUrl: string }[];
  //     };
  //     if (parsed.prompt) setInputValue(parsed.prompt);
  //     if (Array.isArray(parsed.files) && parsed.files.length > 0) {
  //       // Reconstruct File objects from data URLs
  //       const reconstructed = parsed.files.map((f, idx) => {
  //         const arr = f.dataUrl.split(",");
  //         const mime =
  //           arr[0].match(/:(.*?);/)?.[1] ||
  //           f.type ||
  //           "application/octet-stream";
  //         const bstr = atob(arr[1] || "");
  //         let n = bstr.length;
  //         const u8arr = new Uint8Array(n);
  //         while (n--) {
  //           u8arr[n] = bstr.charCodeAt(n);
  //         }
  //         const file = new File([u8arr], f.name || `file-${idx}`, {
  //           type: mime,
  //         });
  //         (file as any).fileKey = `${file.name}-${Date.now()}-${idx}`;
  //         return file;
  //       });
  //       setAttachedFiles(reconstructed);
  //     }
  //     // Clear after restoring so it doesn't keep overwriting
  //     localStorage.removeItem("gennit_idea_draft");
  //   } catch {}
  // }, [setInputValue, setAttachedFiles]);

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
  const handlegenerateMessage = async () => {
    const validationError = validateInput(
      inputValue,
      attachedFiles as unknown as File[]
    );
    if (validationError) {
      console.error("Validation error:", validationError);
      return;
    }

    if (!project?._id) {
      console.error("No project ID available");
      return;
    }

    try {
      // Use projectId for proper server routing
      await generateMessage(inputValue, attachedFiles, project._id);

      clearInput();

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
      handlegenerateMessage();
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
      {/* <style jsx>{`
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
      `}</style> */}

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
              // Dispatch a global event so the conversation container scrolls
              window.dispatchEvent(new Event("scroll-chat-to-bottom"));
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const validationError = validateInput(
              inputValue,
              attachedFiles as unknown as File[]
            );
            if (validationError) {
              console.error("Validation error:", validationError);
              return;
            }
            if (!hasEnoughCredits) return;
            handlegenerateMessage();
          }}
          className="relative"
        >
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
                        type="button"
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
                    : "Enter a follow up prompt"
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
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-1.5 hover:bg-background/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  disabled={isGenerating}
                >
                  <Mic className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-1.5 hover:bg-background/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                >
                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <button
                type="submit"
                disabled={
                  isGenerating ||
                  (!inputValue.trim() && attachedFiles.length === 0) ||
                  !hasEnoughCredits
                }
                className={`flex items-center justify-center p-0.5 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-100 dark:from-[#292929] dark:via-[#555555] dark:to-[#292929] rounded-[10px] shadow-[inset_0_6px_2px_-4px_rgba(255,255,255,0.5)] cursor-pointer border-none outline-none transition-all duration-150 active:scale-[0.92] group ${
                  isGenerating ||
                  (!inputValue.trim() && attachedFiles.length === 0) ||
                  !hasEnoughCredits
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
        </form>
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 rounded-xl -z-10 translate-y-1 blur-sm"></div> */}
      </div>
    </div>
  );
}
