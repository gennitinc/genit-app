// "use client";

// import {
//   AIMessage,
//   UserMessage,
//   VersioningMessage,
//   AIThinkingContent,
// } from "@/components/chat/messages";
// import { useProjectContext } from "@/context/Chat-Context";
// import { EnvVariablesSection } from "@/components/chat/env";
// import { useEffect, useRef } from "react";

// export function TextChatContent() {
//   const {
//     generations,
//     toggleGeneration,
//     retryLoading,
//     projectInfo, // Access projectInfo from context
//     userAvatar,
//     userName,
//     isGenerating, // To show AIThinkingContent conditionally
//   } = useProjectContext();

//   const contentRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll to bottom when new content is added
//   useEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollTop = contentRef.current.scrollHeight;
//     }
//   }, [projectInfo?.messages, isGenerating]);

//   // Helper to format file size (can be moved to a utility file if used elsewhere)
//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return (
//       Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//     );
//   };

//   // Get current version's environment variables
//   const getCurrentVersionEnvVariables = () => {
//     if (!projectInfo) return [];

//     // If there are versions, get the active version's env variables
//     if (projectInfo.versions && projectInfo.versions.length > 0) {
//       const activeVersion = projectInfo.versions.find((v) => v.isCurrent);
//       if (activeVersion && activeVersion.metadata?.envVariables) {
//         return activeVersion.metadata.envVariables;
//       }
//     }

//     // Fallback to project-level env variables
//     return projectInfo.envVariables || [];
//   };

//   const getCurrentVersion = () => {
//     if (!projectInfo?.versions || projectInfo.versions.length === 0)
//       return null;
//     return (
//       projectInfo.versions.find((v) => v.isCurrent) ||
//       projectInfo.versions[projectInfo.versions.length - 1]
//     );
//   };

//   return (
//     <div ref={contentRef} className="space-y-6 h-full overflow-y-auto">
//       {projectInfo?.messages?.map((message, index) => {
//         if (message.type === "user") {
//           return (
//             <UserMessage
//               key={message.id || index}
//               content={message.content}
//               userAvatar={projectInfo.userAvatar || userAvatar}
//               userName={projectInfo.userName || userName}
//               imageAttachment={message.fileAttachments?.[0]?.url} // Assuming first image attachment for simplicity
//               fileName={message.fileAttachments?.[0]?.name}
//               fileSize={
//                 message.fileAttachments?.[0]?.size
//                   ? formatFileSize(message.fileAttachments[0].size)
//                   : undefined
//               }
//               fileType={message.fileAttachments?.[0]?.type?.split("/")[0]} // e.g., "image", "application"
//             />
//           );
//         } else if (message.type === "ai") {
//           // Render AI response, potentially from generationGroups
//           // For simplicity, if generationGroups exist, we'll render VersioningMessage
//           // Otherwise, we'll render a simple AIMessage with the content
//           if (message.generationGroups && message.generationGroups.length > 0) {
//             return message.generationGroups.map((group: any) => (
//               <VersioningMessage
//                 key={group.id}
//                 generation={group}
//                 onToggle={toggleGeneration}
//                 onRetry={retryLoading}
//               />
//             ));
//           } else {
//             return (
//               <AIMessage key={message.id || index} content={message.content} />
//             );
//           }
//         }
//         return null;
//       })}

//       {/* Conditionally show AI thinking content */}
//       {isGenerating && <AIThinkingContent />}

//       {/* EnvVariablesSection with version-specific data */}
//       <EnvVariablesSection
//         envVariables={getCurrentVersionEnvVariables()}
//         currentVersion={getCurrentVersion()}
//         projectInfo={projectInfo}
//       />
//     </div>
//   );   setShowScrollButton(!isAtBottom);
//     };

//     chatContent.addEventListener("scroll", handleScroll);
//     handleScroll(); // Check initial state

//     return () => chatContent.removeEventListener("scroll", handleScroll);
//   }, [setShowScrollButton]);

//   // Auto-resize effect
//   useEffect(() => {
//     autoResize();
//   }, [inputValue, autoResize]);

//   return {
//     // State from context
//     inputValue,
//     attachedFiles,
//     fileLoadingStates,
//     isDragOver,
//     showScrollButton,

//     // Refs
//     textareaRef,
//     chatContentRef,
//     inputSectionRef,
//     fileInputRef,

//     // Enhanced handlers
//     handleInput: handleInputWithResize,
//     handleKeyDown: handleKeyDownWithResize,
//     handlePaste: handlePasteWithResize,
//     handleFileSelect,
//     handleDragEnter,
//     handleDragLeave,
//     handleDragOver,
//     handleDrop,
//     scrollToBottom,
//     clearInput: clearInputWithResize,

//     // Direct setters for file management
//     setAttachedFiles,
//     setFileLoadingStates,
//   };
// }
