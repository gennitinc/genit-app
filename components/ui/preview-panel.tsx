// "use client";

// import * as React from "react";
// import { useState, useCallback, useEffect, useRef, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Bell,
//   BadgeCheck,
//   CreditCard,
//   Sparkles,
//   Moon,
//   Sun,
//   LogOut,
//   Loader2,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuGroup,
// } from "@/components/ui/dropdown-menu";
// import { Label } from "@/components/ui/label";
// import {
//   MonitorSmartphone,
//   Code,
//   GitFork,
//   Rocket,
//   Maximize2,
//   Minimize2,
//   Share2,
//   ChevronDown,
//   Globe,
//   Lock,
//   Download,
// } from "lucide-react";
// import dynamic from "next/dynamic";
// import { cn } from "@/lib/utils";
// import {
//   ResizablePanel,
//   ResizablePanelGroup,
//   ResizableHandle,
// } from "@/components/ui/resizable";
// import { BrowserBar, type DeviceType } from "./browser-bar";
// import { useTheme } from "next-themes";
// import { Spinner } from "@/components/ui/spinner";
// import { useMediaQuery } from "@/hooks/use-media-query";
// import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
// import JSZip from "jszip";
// import FileSaver from "file-saver";
// import { useToast } from "@/components/ui/use-toast";
// import { ToastAction } from "@/components/ui/toast";
// import { ErrorBoundary } from "react-error-boundary";
// import type { editor as monacoEditor } from "monaco-editor";
// import { Switch } from "@/components/ui/switch";
// import { FileHeader } from "./file-header";
// import { useFileSystem } from "@/context/FileSystem";
// import { useChat } from "@/context/ChatProjectContext";
// import { useUserContext } from "@/context/AuthenticatedContext";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { motion, AnimatePresence } from "framer-motion";
// import { FileTree } from "./file-tree";
// import { GenerationUI } from "./generation-ui";

// declare global {
//   interface Window {
//     monaco: typeof import("monaco-editor");
//   }
// }

// function ErrorFallback({ error, resetErrorBoundary }: any) {
//   const { toast } = useToast();

//   React.useEffect(() => {
//     toast({
//       title: "An error occurred in the preview panel",
//       description: error.message,
//       variant: "destructive",
//     });
//   }, [error, toast]);

//   return (
//     <div
//       role="alert"
//       className="p-4 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-md"
//     >
//       <p>Something went wrong in the preview panel:</p>
//       <pre className="text-sm">{error.message}</pre>
//       <button
//         onClick={resetErrorBoundary}
//         className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//       >
//         Try again
//       </button>
//     </div>
//   );
// }

// function EditorSpinner() {
//   return (
//     <div className="h-full w-full flex items-center justify-center bg-background">
//       <Spinner className="h-8 w-8 text-primary" />
//     </div>
//   );
// }

// // Dynamically import Monaco Editor with no SSR
// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
//   ssr: false,
//   loading: () => <EditorSpinner />,
// });

// type Tab = "code" | "preview";

// interface PreviewPanelProps {
//   streamingFiles?: Set<string>;
//   generatingFiles?: Set<string>;
//   id?: string;
//   initialFiles?: any[];
// }

// export function PreviewPanel({
//   streamingFiles = new Set(),
//   generatingFiles = new Set(),
//   id,
//   initialFiles,
// }: PreviewPanelProps) {
//   const {
//     messages,
//     setMessages,
//     setVersions,
//     chat,
//     setChat,
//     versions,
//     sendMessage,
//     fetchVersions,
//     isTyping,
//     handleTyping,
//     statusUpdate,
//     isAiTyping,
//   } = useChat();

//   const user = useUserContext().user;
//   const { theme, setTheme } = useTheme();
//   const [isPublic, setIsPublic] = useState(true);
//   const { files, setFiles, searchFiles, moveFile } = useFileSystem();
//   const isDesktop = useMediaQuery("(min-width: 1024px)");
//   const [activeTab, setActiveTab] = useState<Tab>("preview"); // Default to preview
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadError, setLoadError] = useState(false);
//   const [activeCodeTab, setActiveCodeTab] = useState<"editor" | "console">(
//     "editor"
//   );
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [currentDevice, setCurrentDevice] = useState<DeviceType>("desktop");
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1023px)");
//   const [selectedFile, setSelectedFile] = useState<any | null>(null);
//   const [currentUrl, setCurrentUrl] = useState("https://www.proliferate.ai/");
//   const { toast } = useToast();
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const [canGoBack, setCanGoBack] = useState(false);
//   const [canGoForward, setCanGoForward] = useState(false);
//   const [navigationHistory, setNavigationHistory] = useState<string[]>([
//     currentUrl,
//   ]);
//   const [historyIndex, setHistoryIndex] = useState(0);
//   const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generationComplete, setGenerationComplete] = useState(false);
//   const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);

//   // Check if generation is in progress or complete
//   useEffect(() => {
//     const hasGeneratingStatus =
//       statusUpdate &&
//       [
//         "processing",
//         "generating",
//         "creating_thread",
//         "initializing_ai",
//         "processing_response",
//         "finalizing",
//       ].includes(statusUpdate.type);

//     const hasCompletedStatus =
//       statusUpdate && statusUpdate.type === "completed";
//     const hasErrorStatus = statusUpdate && statusUpdate.type === "error";

//     setIsGenerating(
//       hasGeneratingStatus ||
//         (isAiTyping && !hasCompletedStatus && !hasErrorStatus)
//     );

//     if (hasCompletedStatus || hasErrorStatus) {
//       setGenerationComplete(true);
//       setIsGenerating(false);
//     }
//   }, [statusUpdate, isAiTyping]);

//   // Check for generated files in messages
//   useEffect(() => {
//     const latestMessage = messages[messages.length - 1];
//     if (latestMessage && latestMessage.type === "ai") {
//       try {
//         const content =
//           typeof latestMessage.content === "string"
//             ? JSON.parse(latestMessage.content)
//             : latestMessage.content;

//         if (
//           content.generatedFiles &&
//           Array.isArray(content.generatedFiles) &&
//           content.generatedFiles.length > 0
//         ) {
//           setGeneratedFiles(content.generatedFiles);
//           setGenerationComplete(true);
//           setIsGenerating(false);
//         }
//       } catch (error) {
//         console.error("Error parsing message content:", error);
//       }
//     }
//   }, [messages]);

//   const handleFileSelect = (file: any) => {
//     setSelectedFile(file);
//     if (isDesktop) {
//       setActiveTab("code");
//       setActiveCodeTab("editor");
//     }
//   };

//   const toggleMaximize = () => {
//     setIsMaximized(!isMaximized);
//   };

//   const handleDeviceChange = (device: DeviceType) => {
//     setCurrentDevice(device);
//   };

//   const handleUrlChange = useCallback((url: string) => {
//     setCurrentUrl(url);
//   }, []);

//   const handleIframeLoad = () => {
//     try {
//       if (!iframeRef.current) {
//         throw new Error("Iframe reference not available");
//       }

//       try {
//         const iframeWindow = iframeRef.current.contentWindow;
//         if (!iframeWindow) {
//           throw new Error("Iframe content window not available");
//         }

//         if (iframeWindow.location.origin === window.location.origin) {
//           const newUrl = iframeWindow.location.href;
//           if (newUrl !== currentUrl) {
//             setCurrentUrl(newUrl);
//             setNavigationHistory((prev) => [
//               ...prev.slice(0, historyIndex + 1),
//               newUrl,
//             ]);
//             setHistoryIndex((prev) => prev + 1);
//             setCanGoBack(true);
//             setCanGoForward(false);
//           }
//         }
//       } catch (corsError) {
//         console.log("Cross-origin access restricted:", corsError);
//       }
//     } catch (error) {
//       console.error("Error in handleIframeLoad:", error);
//       toast({
//         title: "Error loading preview",
//         description:
//           error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleNavigate = (action: "back" | "forward" | "refresh") => {
//     try {
//       if (iframeRef.current && iframeRef.current.contentWindow) {
//         const iframeWindow = iframeRef.current.contentWindow;
//         switch (action) {
//           case "back":
//             if (historyIndex > 0) {
//               setHistoryIndex((prev) => prev - 1);
//               setCurrentUrl(navigationHistory[historyIndex - 1]);
//               iframeWindow.history.back();
//             }
//             break;
//           case "forward":
//             if (historyIndex < navigationHistory.length - 1) {
//               setHistoryIndex((prev) => prev + 1);
//               setCurrentUrl(navigationHistory[historyIndex + 1]);
//               iframeWindow.history.forward();
//             }
//             break;
//           case "refresh":
//             iframeWindow.location.reload();
//             break;
//         }
//       }
//     } catch (error) {
//       console.error("Error in handleNavigate:", error);
//       toast({
//         title: "Navigation error",
//         description: "Navigation failed",
//         variant: "destructive",
//       });
//     }
//   };

//   useEffect(() => {
//     setCanGoBack(historyIndex > 0);
//     setCanGoForward(historyIndex < navigationHistory.length - 1);
//   }, [historyIndex, navigationHistory]);

//   useEffect(() => {
//     const handleEsc = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         setIsMaximized(false);
//       }
//     };
//     if (typeof window !== "undefined") {
//       window.addEventListener("keydown", handleEsc);
//       return () => {
//         window.removeEventListener("keydown", handleEsc);
//       };
//     }
//   }, []);

//   useEffect(() => {
//     if (editorRef.current) {
//       editorRef.current.updateOptions({
//         theme: theme === "dark" ? "nextjsProTheme" : "nextjsProLightTheme",
//       });
//     }
//   }, [theme]);

//   const getPreviewWidth = () => {
//     switch (currentDevice) {
//       case "mobile":
//         return "max-w-[375px]";
//       case "tablet":
//         return "max-w-[768px]";
//       default:
//         return "w-full";
//     }
//   };

//   const downloadAsZip = async (files: any[]) => {
//     try {
//       const zip = new JSZip();

//       const addFilesToZip = (nodes: any[], currentPath = "") => {
//         nodes.forEach((node) => {
//           if (node.type === "file") {
//             zip.file(currentPath + node.name, node.content || "");
//           } else if (node.type === "folder" && node.children) {
//             addFilesToZip(node.children, currentPath + node.name + "/");
//           }
//         });
//       };

//       addFilesToZip(files);

//       const content = await zip.generateAsync({ type: "blob" });
//       FileSaver.saveAs(content, "project-files.zip");

//       toast({
//         title: "Files downloaded",
//         description: "Your project files have been downloaded as a zip file.",
//       });
//     } catch (error) {
//       console.error("Error in downloadAsZip:", error);
//       toast({
//         title: "Download error",
//         description: "Failed to download files",
//         variant: "destructive",
//       });
//     }
//   };

//   useEffect(() => {
//     if (window.monaco) {
//       defineCustomThemes(window.monaco);
//     }
//   }, []);

//   function defineCustomThemes(monaco: typeof import("monaco-editor")) {
//     const nextjsProTheme = {
//       base: "vs-dark" as monacoEditor.BuiltinTheme,
//       inherit: true,
//       rules: [
//         { token: "comment", foreground: "6A9955", fontStyle: "italic" },
//         { token: "keyword", foreground: "C586C0" },
//         { token: "string", foreground: "CE9178" },
//         { token: "number", foreground: "B5CEA8" },
//         { token: "regexp", foreground: "D16969" },
//         { token: "type", foreground: "4EC9B0" },
//         { token: "class-name", foreground: "4EC9B0" },
//         { token: "function", foreground: "DCDCAA" },
//         { token: "variable", foreground: "9CDCFE" },
//         { token: "variable.predefined", foreground: "4FC1FF" },
//         { token: "variable.parameter", foreground: "9CDCFE" },
//         { token: "interface", foreground: "4EC9B0" },
//         { token: "constructor", foreground: "4EC9B0" },
//         { token: "tag", foreground: "569CD6" },
//         { token: "attribute.name", foreground: "9CDCFE" },
//         { token: "attribute.value", foreground: "CE9178" },
//         { token: "meta", foreground: "D4D4D4" },
//         { token: "meta.tag", foreground: "569CD6" },
//       ],
//       colors: {
//         "editor.background": "#000000",
//         "editor.foreground": "#ffffff",
//         "editor.lineHighlightBackground": "#2F3542",
//         "editor.selectionBackground": "#264F78",
//         "editor.inactiveSelectionBackground": "#3A3D41",
//         "editorIndentGuide.background": "#404040",
//         "editorIndentGuide.activeBackground": "#707070",
//         "editor.selectionHighlightBorder": "#222218",
//         "activityBar.background": "#333333",
//         "sideBar.background": "#252526",
//         "sideBar.foreground": "#CCCCCC",
//         "list.activeSelectionBackground": "#094771",
//         "list.hoverBackground": "#2A2D2E",
//         "input.background": "#3C3C3C",
//         "dropdown.background": "#3C3C3C",
//         "editorWidget.background": "#252526",
//         "editorWidget.border": "#454545",
//         "pickerGroup.foreground": "#3794FF",
//         "diffEditor.insertedTextBackground": "#37415180",
//         "diffEditor.removedTextBackground": "#37415180",
//         "list.dropBackground": "#383B3D",
//         "tree.indentGuidesStroke": "#585858",
//       },
//     };

//     monaco.editor.defineTheme("nextjsProTheme", nextjsProTheme);

//     const nextjsProLightTheme = {
//       ...nextjsProTheme,
//       base: "vs" as monacoEditor.BuiltinTheme,
//       colors: {
//         ...nextjsProTheme.colors,
//         "editor.background": "#ffffff",
//         "editor.foreground": "#000000",
//         "editor.lineHighlightBackground": "#F0F0F0",
//         "editor.selectionBackground": "#ADD6FF",
//         "editor.inactiveSelectionBackground": "#E5EBF1",
//         "editorIndentGuide.background": "#D3D3D3",
//         "editorIndentGuide.activeBackground": "#939393",
//         "activityBar.background": "#2C2C2C",
//         "sideBar.background": "#F3F3F3",
//         "sideBar.foreground": "#333333",
//         "list.activeSelectionBackground": "#0060C0",
//         "list.hoverBackground": "#E8E8E8",
//         "input.background": "#FFFFFF",
//         "dropdown.background": "#FFFFFF",
//         "editorWidget.background": "#F3F3F3",
//         "editorWidget.border": "#C8C8C8",
//         "diffEditor.insertedTextBackground": "#C3E88D30",
//         "diffEditor.removedTextBackground": "#FF526630",
//       },
//     };

//     monaco.editor.defineTheme("nextjsProLightTheme", nextjsProLightTheme);
//   }

//   const getLanguageFromFileName = useCallback((fileName: string): string => {
//     const extension = fileName.split(".").pop()?.toLowerCase();

//     switch (extension) {
//       case "js":
//       case "jsx":
//         return "javascript";
//       case "ts":
//       case "tsx":
//         return "typescript";
//       case "json":
//         return "json";
//       case "html":
//         return "html";
//       case "css":
//         return "css";
//       default:
//         return "plaintext";
//     }
//   }, []);

//   const editorLanguage = useMemo(() => {
//     return selectedFile
//       ? getLanguageFromFileName(selectedFile.name)
//       : "plaintext";
//   }, [selectedFile, getLanguageFromFileName]);

//   const handleNavigateToCode = () => {
//     setActiveTab("code");
//     setActiveCodeTab("editor");
//   };

//   return (
//     <ErrorBoundary
//       FallbackComponent={ErrorFallback}
//       onReset={() => {
//         // Reset the state of your app here
//       }}
//     >
//       <TooltipProvider>
//         <div
//           className={cn(
//             "flex h-full flex-col transition-all duration-300 rounded-l-xl",
//             theme === "dark" ? "bg-[#000001]" : "bg-white",
//             isMaximized ? "fixed inset-0 z-50" : "relative"
//           )}
//         >
//           <div className="px-4 py-2 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
//             <div className="flex items-center space-x-3">
//               <TooltipProvider>
//                 <div className="flex items-center mr-2 pr-3 border-r border-zinc-200 dark:border-zinc-800">
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <div className="flex items-center gap-2">
//                         <Switch
//                           id="repo-visibility"
//                           checked={isPublic}
//                           onCheckedChange={setIsPublic}
//                           className="data-[state=checked]:bg-green-500"
//                         />
//                         <Label
//                           htmlFor="repo-visibility"
//                           className="flex items-center gap-1.5 text-sm font-medium cursor-pointer"
//                         >
//                           {isPublic ? (
//                             <>
//                               <Globe className="h-3.5 w-3.5 text-green-500" />
//                               {/* <span>Public</span> */}
//                             </>
//                           ) : (
//                             <>
//                               <Lock className="h-3.5 w-3.5 text-amber-500" />
//                               {/* <span>Private</span> */}
//                             </>
//                           )}
//                         </Label>
//                       </div>
//                     </TooltipTrigger>
//                     <TooltipContent side="bottom">
//                       <p>
//                         {isPublic
//                           ? "Anyone can view this project"
//                           : "Only you can view this project"}
//                       </p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </div>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setActiveTab("preview")}
//                         disabled={isLoading}
//                         className={cn(
//                           "h-8 px-3 rounded-none border-r border-zinc-200 dark:border-zinc-800",
//                           activeTab === "preview"
//                             ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
//                             : "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
//                         )}
//                       >
//                         {isLoading ? (
//                           <Loader2 className="animate-spin h-4 w-4" />
//                         ) : (
//                           <MonitorSmartphone className="h-4 w-4" />
//                         )}
//                         {/* <span className="ml-2 text-xs font-medium">
//                           Preview
//                         </span> */}
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent side="bottom">
//                       <p>View the rendered output</p>
//                     </TooltipContent>
//                   </Tooltip>

//                   {(isDesktop || isMobile || isTablet) && (
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => setActiveTab("code")}
//                           className={cn(
//                             "h-8 px-3 rounded-none",
//                             activeTab === "code"
//                               ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
//                               : "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
//                           )}
//                         >
//                           <Code className="h-4 w-4" />
//                           {/* <span className="ml-2 text-xs font-medium">Code</span> */}
//                           {streamingFiles.size > 0 && (
//                             <motion.div
//                               className="ml-2 w-2 h-2 bg-blue-500 rounded-full"
//                               animate={{ scale: [1, 1.2, 1] }}
//                               transition={{
//                                 duration: 1,
//                                 repeat: Number.POSITIVE_INFINITY,
//                               }}
//                             />
//                           )}
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent side="bottom">
//                         <p>View and edit the source code</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   )}
//                 </div>
//               </TooltipProvider>
//             </div>

//             <div className="flex items-center gap-2">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 rounded-full hover:bg-muted-foreground/5  dark:hover:bg-muted-foreground/5"
//                       onClick={toggleMaximize}
//                     >
//                       {isMaximized ? (
//                         <Minimize2 className="h-4 w-4" />
//                       ) : (
//                         <Maximize2 className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent side="bottom">
//                     <p>
//                       {isMaximized ? "Exit fullscreen" : "Enter fullscreen"}
//                     </p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     className="h-8 w-8 rounded-full border-border"
//                   >
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48">
//                   <DropdownMenuItem onClick={() => {}}>
//                     <GitFork className="h-4 w-4 mr-2" />
//                     Fork
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => {
//                       navigator.clipboard.writeText(window.location.href);
//                       toast({
//                         title: "Link copied",
//                         description:
//                           "The URL has been copied to your clipboard.",
//                         action: <ToastAction altText="OK">OK</ToastAction>,
//                       });
//                     }}
//                   >
//                     <Share2 className="h-4 w-4 mr-2" />
//                     Share
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => downloadAsZip(files)}>
//                     <Download className="h-4 w-4 mr-2" />
//                     Download
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               {isMobile || isTablet ? (
//                 <Button
//                   variant="secondary"
//                   size="icon"
//                   className="h-8 w-8 rounded-full"
//                 >
//                   <Rocket className="h-4 w-4" />
//                 </Button>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="gap-2 rounded-md border-border hover:bg-muted-foreground/5 dark:hover:bg-muted-foreground/5"
//                   >
//                     <svg
//                       viewBox="0 0 109 113"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                     >
//                       <path
//                         d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
//                         fill="url(#paint0_linear)"
//                       />
//                       <path
//                         d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
//                         fill="url(#paint1_linear)"
//                         fillOpacity="0.2"
//                       />
//                       <path
//                         d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
//                         fill="#3ECF8E"
//                       />
//                       <defs>
//                         <linearGradient
//                           id="paint0_linear"
//                           x1="53.9738"
//                           y1="54.974"
//                           x2="94.1635"
//                           y2="71.8295"
//                           gradientUnits="userSpaceOnUse"
//                         >
//                           <stop stopColor="#249361" />
//                           <stop offset="1" stopColor="#3ECF8E" />
//                         </linearGradient>
//                         <linearGradient
//                           id="paint1_linear"
//                           x1="36.1558"
//                           y1="30.578"
//                           x2="54.4844"
//                           y2="65.0806"
//                           gradientUnits="userSpaceOnUse"
//                         >
//                           <stop />
//                           <stop offset="1" stopOpacity="0" />
//                         </linearGradient>
//                       </defs>
//                     </svg>
//                     {/* <span>Supabase</span> */}
//                   </Button>

//                   <Button
//                     size="sm"
//                     className="gap-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
//                   >
//                     <Rocket className="h-4 w-4" />
//                     <span>Deploy</span>
//                   </Button>

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 rounded-full hover:bg-muted-foreground/5 dark:hover:bg-muted-foreground/5"
//                       >
//                         <Avatar className="h-8 w-8 border border-border">
//                           <AvatarImage
//                             src={user?.metadata?.userdp || "/placeholder.svg"}
//                             alt={user?.username}
//                           />
//                           <AvatarFallback className="text-xs bg-muted-foreground/5 dark:bg-muted-foreground/5 text-muted-foreground dark:text-muted-foreground">
//                             {user?.username?.[0]?.toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-56">
//                       <DropdownMenuLabel className="font-normal">
//                         <div className="flex items-center gap-3 p-1">
//                           <Avatar className="h-10 w-10 border border-border">
//                             <AvatarImage
//                               src={user?.metadata?.userdp || "/placeholder.svg"}
//                               alt={user?.username}
//                             />
//                             <AvatarFallback className="text-sm bg-muted-foreground/5 dark:bg-muted-foreground/5 text-muted-foreground dark:text-muted-foreground">
//                               {user?.username?.[0]?.toUpperCase()}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="flex flex-col">
//                             <span className="font-medium">
//                               {user?.username}
//                             </span>
//                             <span className="text-xs text-muted-foreground/50 dark:text-muted-foreground/50">
//                               {user?.email}
//                             </span>
//                           </div>
//                         </div>
//                       </DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuGroup>
//                         <DropdownMenuItem
//                           onSelect={(e) => e.preventDefault()}
//                           className="cursor-pointer"
//                         >
//                           <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
//                           <span>Upgrade to Pro</span>
//                         </DropdownMenuItem>
//                       </DropdownMenuGroup>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuGroup>
//                         <DropdownMenuItem>
//                           <BadgeCheck className="mr-2 h-4 w-4" />
//                           <span>Account</span>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <CreditCard className="mr-2 h-4 w-4" />
//                           <span>Billing</span>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem>
//                           <Bell className="mr-2 h-4 w-4" />
//                           <span>Notifications</span>
//                         </DropdownMenuItem>
//                       </DropdownMenuGroup>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem
//                         onClick={() =>
//                           setTheme(theme === "dark" ? "light" : "dark")
//                         }
//                       >
//                         {theme === "dark" ? (
//                           <>
//                             <Sun className="mr-2 h-4 w-4" />
//                             <span>Light mode</span>
//                           </>
//                         ) : (
//                           <>
//                             <Moon className="mr-2 h-4 w-4" />
//                             <span>Dark mode</span>
//                           </>
//                         )}
//                       </DropdownMenuItem>
//                       <DropdownMenuItem>
//                         <LogOut className="mr-2 h-4 w-4" />
//                         <span>Log out</span>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="flex-1 overflow-hidden p-2 mb-3">
//             <ResizablePanelGroup
//               direction={isMobile ? "vertical" : "horizontal"}
//             >
//               {activeTab === "code" ? (
//                 <div className="flex flex-row w-full h-full border border-border rounded-2xl lg:mx-4">
//                   <ResizablePanel defaultSize={28} minSize={15}>
//                     <ScrollArea className="h-full border-r border-border">
//                       <FileTree
//                         onSelectFile={handleFileSelect}
//                         streamingFiles={streamingFiles}
//                         generatingFiles={generatingFiles}
//                       />
//                     </ScrollArea>
//                   </ResizablePanel>
//                   <ResizableHandle />
//                   <ResizablePanel defaultSize={72}>
//                     <div className="h-full flex flex-col">
//                       <Tabs
//                         value={activeCodeTab}
//                         onValueChange={(value) =>
//                           setActiveCodeTab(value as "editor" | "console")
//                         }
//                         className="flex-1 flex flex-col"
//                       >
//                         <div className="border-b border-border">
//                           <TabsList className="w-full justify-start h-10 p-0 bg-transparent">
//                             <TabsTrigger
//                               value="editor"
//                               className={cn(
//                                 "relative rounded-none border-b border-transparent data-[state=active]:border-none",
//                                 "data-[state=active]:bg-transparent data-[state=active]:text-foreground",
//                                 "data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0",
//                                 "data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[2px]",
//                                 "data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-blue-500 data-[state=active]:after:to-sky-300"
//                               )}
//                             >
//                               <Code className="h-4 w-4 mr-2" />
//                               Editor
//                               {selectedFile &&
//                                 streamingFiles.has(selectedFile.name) && (
//                                   <motion.div
//                                     className="ml-2 w-2 h-2 bg-blue-500 rounded-full"
//                                     animate={{ scale: [1, 1.2, 1] }}
//                                     transition={{
//                                       duration: 1,
//                                       repeat: Number.POSITIVE_INFINITY,
//                                     }}
//                                   />
//                                 )}
//                             </TabsTrigger>
//                           </TabsList>
//                         </div>
//                         <TabsContent value="editor" className="flex-1 h-full">
//                           {selectedFile && (
//                             <FileHeader
//                               fileName={selectedFile.name}
//                               content={selectedFile.content || ""}
//                             />
//                           )}
//                           {selectedFile ? (
//                             <div className="relative h-full">
//                               {/* Streaming Overlay */}
//                               <AnimatePresence>
//                                 {streamingFiles.has(selectedFile.name) && (
//                                   <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     exit={{ opacity: 0 }}
//                                     className="absolute top-0 right-0 z-10 m-4 p-2 bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 rounded-md flex items-center gap-2"
//                                   >
//                                     <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
//                                     <span className="text-sm text-blue-700 dark:text-blue-300">
//                                       Streaming content...
//                                     </span>
//                                   </motion.div>
//                                 )}
//                               </AnimatePresence>

//                               <React.Suspense fallback={<EditorSpinner />}>
//                                 <MonacoEditor
//                                   beforeMount={(monaco) => {
//                                     monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
//                                       {
//                                         jsx: monaco.languages.typescript.JsxEmit
//                                           .React,
//                                         jsxFactory: "React.createElement",
//                                         reactNamespace: "React",
//                                         allowNonTsExtensions: true,
//                                         allowJs: true,
//                                         target:
//                                           monaco.languages.typescript
//                                             .ScriptTarget.Latest,
//                                       }
//                                     );

//                                     monaco.languages.typescript.typescriptDefaults.addExtraLib(
//                                       `
//                                 declare module JSX {
//                                   interface Element {}
//                                   interface IntrinsicElements {
//                                     [elemName: string]: any;
//                                   }
//                                   interface IntrinsicElements {
//                                     [elemName: string]: any;
//                                   }
//                                 }
//                                 declare module React {
//                                   export function createElement(type: any, props?: any, ...children: any[]): JSX.Element;
//                                 }
//                                 `,
//                                       "react.d.ts"
//                                     );

//                                     defineCustomThemes(monaco);
//                                   }}
//                                   height="calc(100vh - 60px)"
//                                   language={editorLanguage}
//                                   theme={
//                                     theme === "dark"
//                                       ? "nextjsProTheme"
//                                       : "nextjsProLightTheme"
//                                   }
//                                   value={
//                                     selectedFile ? selectedFile.content : ""
//                                   }
//                                   onChange={(value) => {
//                                     if (selectedFile && value !== undefined) {
//                                       setSelectedFile({
//                                         ...selectedFile,
//                                         content: value,
//                                       });
//                                     }
//                                   }}
//                                   onMount={(editor, monaco) => {
//                                     editorRef.current = editor;
//                                   }}
//                                   options={{
//                                     minimap: { enabled: false },
//                                     fontSize: 12,
//                                     lineNumbers: "on",
//                                     scrollBeyondLastLine: false,
//                                     automaticLayout: true,
//                                     tabSize: 2,
//                                     fontFamily: "'JetBrains Mono', monospace",
//                                     padding: { top: 16 },
//                                     renderLineHighlight: "all",
//                                     mouseWheelZoom: true,
//                                     scrollbar: {
//                                       useShadows: false,
//                                       verticalHasArrows: true,
//                                       horizontalHasArrows: true,
//                                       vertical: "visible",
//                                       horizontal: "visible",
//                                       verticalScrollbarSize: 10,
//                                       horizontalScrollbarSize: 10,
//                                       arrowSize: 30,
//                                     },
//                                     selectOnLineNumbers: true,
//                                     quickSuggestions: true,
//                                   }}
//                                 />
//                               </React.Suspense>
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-center h-full text-muted-foreground">
//                               <div className="h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto main-canvas">
//                                 <p className="text-base text-muted-foreground flex w-[10vw] flex-grow items-center font-normal">
//                                   Select a file to edit
//                                 </p>
//                               </div>
//                             </div>
//                           )}
//                         </TabsContent>
//                       </Tabs>
//                     </div>
//                   </ResizablePanel>
//                 </div>
//               ) : (
//                 <ResizablePanel defaultSize={100}>
//                   <div className="h-full flex flex-col mx-3 rounded-2xl">
//                     {/* Show Generation UI when generating, Browser UI when complete */}
//                     {isGenerating ||
//                     (!generationComplete && messages.length === 0) ? (
//                       <GenerationUI
//                         statusUpdate={statusUpdate}
//                         isGenerating={isGenerating}
//                         generatedFiles={generatedFiles}
//                         onNavigateToCode={handleNavigateToCode}
//                       />
//                     ) : (
//                       <>
//                         <BrowserBar
//                           onDeviceChange={handleDeviceChange}
//                           currentUrl={currentUrl}
//                           onUrlChange={handleUrlChange}
//                           onNavigate={handleNavigate}
//                           canGoBack={canGoBack}
//                           canGoForward={canGoForward}
//                         />
//                         <div
//                           className={cn(
//                             "h-full w-full overflow-hidden bg-background mx-auto transition-all rounded-b-xl",
//                             getPreviewWidth()
//                           )}
//                         >
//                           {isLoading && (
//                             <div className="flex items-center justify-center bg-muted-foreground/10 h-full w-full">
//                               <div className="flex flex-col items-center gap-2">
//                                 <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//                                 <p className="text-sm text-muted-foreground">
//                                   Loading preview...
//                                 </p>
//                               </div>
//                             </div>
//                           )}

//                           {loadError && (
//                             <div className="flex flex-col items-center justify-center bg-muted-foreground/10 h-full w-full">
//                               <div className="text-center p-4 max-w-md">
//                                 <p className="text-red-500 font-medium mb-2">
//                                   Failed to load preview
//                                 </p>
//                                 <p className="text-sm text-muted-foreground mb-4">
//                                   This may be due to CORS restrictions or the
//                                   URL is not accessible.
//                                 </p>
//                                 <a
//                                   href={currentUrl}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="px-4 py-2 bg-primary text-muted-foreground  rounded-md hover:bg-primary-600 transition-colors"
//                                 >
//                                   Open in new tab
//                                 </a>
//                               </div>
//                             </div>
//                           )}

//                           {currentUrl && !isLoading && !loadError && (
//                             <iframe
//                               ref={iframeRef}
//                               src={currentUrl}
//                               className={cn("w-full h-full border-none", {
//                                 "max-w-[375px] mx-auto":
//                                   currentDevice === "mobile",
//                                 "max-w-[768px] mx-auto":
//                                   currentDevice === "tablet",
//                               })}
//                               allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking"
//                               sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
//                               title="Preview"
//                               allowFullScreen
//                               onLoad={handleIframeLoad}
//                             />
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </ResizablePanel>
//               )}
//             </ResizablePanelGroup>
//           </div>
//         </div>
//       </TooltipProvider>
//     </ErrorBoundary>
//   );
// }
