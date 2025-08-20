"use client";

import * as React from "react";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WebContainer } from "@webcontainer/api";
// import { WritableStream } from "node:stream/web";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Bell,
  Search,
  BadgeCheck,
  CreditCard,
  Sparkles,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  MonitorSmartphone,
  Code,
  TerminalIcon,
  GitFork,
  Rocket,
  Maximize2,
  Minimize2,
  Share2,
  Zap,
  ChevronDown,
  Download,
} from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { FileTree } from "./file-tree";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { BrowserBar, type DeviceType } from "./browser-bar";
import { useTheme } from "next-themes";
import { Spinner } from "@/components/ui/spinner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ErrorBoundary } from "react-error-boundary";
import type { editor as monacoEditor } from "monaco-editor";
import { FileHeader } from "./file-header";
import { FileNode, useFileSystem } from "@/context/FileSystem";
import { useChat, useUserContext } from "@/context";
import { PricingDialog } from "../layout/pricing-dialog";

declare global {
  interface Window {
    monaco: typeof import("monaco-editor");
  }
}

// Global variable to track the WebContainer instance

function ErrorFallback({ error, resetErrorBoundary }: any) {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "An error occurred in the preview panel",
      description: error.message,
      variant: "destructive",
    });
  }, [error, toast]);

  return (
    <div
      role="alert"
      className="p-4 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-md"
    >
      <p>Something went wrong in the preview panel:</p>
      <pre className="text-sm">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Try again
      </button>
    </div>
  );
}

function EditorSpinner() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );
}

// Dynamically import Monaco Editor with no SSR
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <EditorSpinner />,
});

type Tab = "code" | "preview" | "console";

export function PreviewPanel({ id, initialFiles }: any) {
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

  const user = useUserContext().user;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { files, setFiles, searchFiles, moveFile } = useFileSystem();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeTab, setActiveTab] = useState<Tab>(
    isDesktop ? "code" : "preview"
  );
  const [activeCodeTab, setActiveCodeTab] = useState<"editor" | "terminal">(
    "editor"
  );
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<DeviceType>("desktop");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1023px)");
  const [code, setCode] = React.useState("");
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [currentUrl, setCurrentUrl] = useState(
    "https://proliferate-client.vercel.app/"
  );
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([
    currentUrl,
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  const initializedRef = useRef(false);
  const [isRunning, setIsRunning] = useState(false);
  const [buildOutput, setBuildOutput] = useState("");
  const [buildStatus, setBuildStatus] = useState<
    "idle" | "building" | "success" | "error"
  >("idle");
  const [buildError, setBuildError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(["Booting Gennit app..."]);

  const webContainerRef = useRef<WebContainer | null>(null);

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    if (isDesktop) {
      setActiveTab("code");
      setActiveCodeTab("editor");
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleDeviceChange = (device: DeviceType) => {
    setCurrentDevice(device);
  };

  const handleUrlChange = useCallback((url: string) => {
    setCurrentUrl(url);
  }, []);

  const handleIframeLoad = () => {
    try {
      if (!iframeRef.current) {
        throw new Error("Iframe reference not available");
      }

      // Add a try-catch specifically for cross-origin access attempts
      try {
        const iframeWindow = iframeRef.current.contentWindow;
        if (!iframeWindow) {
          throw new Error("Iframe content window not available");
        }

        // Only try to access location if same origin
        if (iframeWindow.location.origin === window.location.origin) {
          const newUrl = iframeWindow.location.href;
          if (newUrl !== currentUrl) {
            setCurrentUrl(newUrl);
            setNavigationHistory((prev) => [
              ...prev.slice(0, historyIndex + 1),
              newUrl,
            ]);
            setHistoryIndex((prev) => prev + 1);
            setCanGoBack(true);
            setCanGoForward(false);
          }
        }
      } catch (corsError) {
        // Handle cross-origin errors silently - this is expected behavior
        console.log("Cross-origin access restricted:", corsError);
      }
    } catch (error) {
      console.error("Error in handleIframeLoad:", error);
      toast({
        title: "Error loading preview",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleIframeError = (error: ErrorEvent) => {
    console.error("Iframe error:", error);
    toast({
      title: "Preview Error",
      description:
        "Failed to load the preview. Please check the URL and try again.",
      variant: "destructive",
    });
  };

  const handleNavigate = (action: "back" | "forward" | "refresh") => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframeWindow = iframeRef.current.contentWindow;
        switch (action) {
          case "back":
            if (historyIndex > 0) {
              setHistoryIndex((prev) => prev - 1);
              setCurrentUrl(navigationHistory[historyIndex - 1]);
              iframeWindow.history.back();
            }
            break;
          case "forward":
            if (historyIndex < navigationHistory.length - 1) {
              setHistoryIndex((prev) => prev + 1);
              setCurrentUrl(navigationHistory[historyIndex + 1]);
              iframeWindow.history.forward();
            }
            break;
          case "refresh":
            iframeWindow.location.reload();
            break;
        }
      }
    } catch (error) {
      console.error("Error in handleNavigate:", error);
      toast({
        title: "Navigation error",
        description: "error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setCanGoBack(historyIndex > 0);
    setCanGoForward(historyIndex < navigationHistory.length - 1);
  }, [historyIndex, navigationHistory]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMaximized(false);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleEsc);
      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, []);

  useEffect(() => {
    setActiveTab(isDesktop ? "code" : "preview");
  }, [isDesktop]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        theme: theme === "dark" ? "nextjsProTheme" : "nextjsProLightTheme",
      });
    }
  }, [theme]);

  const getPreviewWidth = () => {
    switch (currentDevice) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "w-full";
    }
  };

  const downloadAsZip = async (files: any[]) => {
    try {
      const zip = new JSZip();

      const addFilesToZip = (nodes: any[], currentPath = "") => {
        nodes.forEach((node) => {
          if (node.type === "file") {
            zip.file(currentPath + node.name, node.content || "");
          } else if (node.type === "folder" && node.children) {
            addFilesToZip(node.children, currentPath + node.name + "/");
          }
        });
      };

      addFilesToZip(files);

      const content = await zip.generateAsync({ type: "blob" });
      FileSaver.saveAs(content, "project-files.zip");

      toast({
        title: "Files downloaded",
        description: "Your project files have been downloaded as a zip file.",
      });
    } catch (error) {
      console.error("Error in downloadAsZip:", error);
      toast({
        title: "Download error",
        description: "error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (window.monaco) {
      defineCustomThemes(window.monaco);
    }
  }, []);

  function defineCustomThemes(monaco: typeof import("monaco-editor")) {
    const nextjsProTheme = {
      base: "vs-dark" as monacoEditor.BuiltinTheme,
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "keyword", foreground: "C586C0" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "regexp", foreground: "D16969" },
        { token: "type", foreground: "4EC9B0" },
        { token: "class-name", foreground: "4EC9B0" },
        { token: "function", foreground: "DCDCAA" },
        { token: "variable", foreground: "9CDCFE" },
        { token: "variable.predefined", foreground: "4FC1FF" },
        { token: "variable.parameter", foreground: "9CDCFE" },
        { token: "interface", foreground: "4EC9B0" },
        { token: "constructor", foreground: "4EC9B0" },
        { token: "tag", foreground: "569CD6" },
        { token: "attribute.name", foreground: "9CDCFE" },
        { token: "attribute.value", foreground: "CE9178" },
        { token: "meta", foreground: "D4D4D4" },
        { token: "meta.tag", foreground: "569CD6" },
      ],
      colors: {
        "editor.background": "#000000",
        "editor.foreground": "#ffffff",
        "editor.lineHighlightBackground": "#2F3542",
        "editor.selectionBackground": "#264F78",
        "editor.inactiveSelectionBackground": "#3A3D41",
        "editorIndentGuide.background": "#404040",
        "editorIndentGuide.activeBackground": "#707070",
        "editor.selectionHighlightBorder": "#222218",
        "activityBar.background": "#333333",
        "sideBar.background": "#252526",
        "sideBar.foreground": "#CCCCCC",
        "list.activeSelectionBackground": "#094771",
        "list.hoverBackground": "#2A2D2E",
        "input.background": "#3C3C3C",
        "dropdown.background": "#3C3C3C",
        "editorWidget.background": "#252526",
        "editorWidget.border": "#454545",
        "pickerGroup.foreground": "#3794FF",
        "diffEditor.insertedTextBackground": "#37415180",
        "diffEditor.removedTextBackground": "#37415180",
        "list.dropBackground": "#383B3D",
        "tree.indentGuidesStroke": "#585858",
      },
    };

    monaco.editor.defineTheme("nextjsProTheme", nextjsProTheme);

    // Create a light version of the theme
    const nextjsProLightTheme = {
      ...nextjsProTheme,
      base: "vs" as monacoEditor.BuiltinTheme,
      colors: {
        ...nextjsProTheme.colors,
        "editor.background": "#ffffff",
        "editor.foreground": "#000000",
        "editor.lineHighlightBackground": "#F0F0F0",
        "editor.selectionBackground": "#ADD6FF",
        "editor.inactiveSelectionBackground": "#E5EBF1",
        "editorIndentGuide.background": "#D3D3D3",
        "editorIndentGuide.activeBackground": "#939393",
        "activityBar.background": "#2C2C2C",
        "sideBar.background": "#F3F3F3",
        "sideBar.foreground": "#333333",
        "list.activeSelectionBackground": "#0060C0",
        "list.hoverBackground": "#E8E8E8",
        "input.background": "#FFFFFF",
        "dropdown.background": "#FFFFFF",
        "editorWidget.background": "#F3F3F3",
        "editorWidget.border": "#C8C8C8",
        "diffEditor.insertedTextBackground": "#C3E88D30",
        "diffEditor.removedTextBackground": "#FF526630",
      },
    };

    monaco.editor.defineTheme("nextjsProLightTheme", nextjsProLightTheme);
  }

  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "js":
      case "jsx": // Support for JavaScript JSX
        return "javascript";
      case "ts":
      case "tsx": // Support for TypeScript JSX as TypeScript
        return "typescript";
      case "json":
        return "json";
      case "html":
        return "html";
      case "css":
        return "css";
      default:
        return "plaintext";
    }
  };

  // Get the language based on filename
  const editorLanguage = useMemo(() => {
    return selectedFile
      ? getLanguageFromFileName(selectedFile.name)
      : "plaintext";
  }, [selectedFile, getLanguageFromFileName]);

  const buildFileSystem = (items: FileNode[], basePath = "") => {
    return items.reduce((acc, item) => {
      const path = basePath ? `${basePath}/${item.name}` : item.name;
      if (item.type === "file") {
        acc[path] = { file: { contents: item.content || "" } };
      } else if (item.type === "folder") {
        acc[path] = { directory: {} };
        Object.assign(acc, buildFileSystem(item.children || [], path));
      }
      return acc;
    }, {} as Record<string, any>);
  };

  const getWebContainerInstance = useCallback(async () => {
    if (webContainerRef.current) return webContainerRef.current;

    setLogs((prev) => [...prev, " Booting Gennit app..."]);
    try {
      webContainerRef.current = await WebContainer.boot();
      return webContainerRef.current;
    } catch (error) {
      setLogs((prev) => [
        ...prev,
        "Failed to start Gennit app. Please try again.",
      ]);
      console.error("WebContainer boot error:", error);
      throw error;
    }
  }, []);

  const destroyWebContainerInstance = useCallback(() => {
    if (webContainerRef.current) {
      console.log("Destroying WebContainer instance...");
      webContainerRef.current.teardown();
      webContainerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!files || files.length === 0) {
      console.log("🚨 No files found or files array is empty.");
      return; // Ensure files are loaded
    }

    if (initializedRef.current) {
      console.log("⚠️ Gennit has already been initialized. Skipping...");
      return; // Prevent multiple runs
    }
    initializedRef.current = true;

    const startGennit = async () => {
      try {
        console.log("✅ Initializing Gennit environment...");
        setLogs((prev) => [...prev, "✅ Initializing Gennit environment..."]);

        const webContainer = await getWebContainerInstance();
        const fileSystem = buildFileSystem(files);

        // Debugging: Log the file system structure
        console.log("📂 File system structure:", fileSystem);

        // Ensure src/lib/utils.ts exists in the file system
        if (!fileSystem["src/lib/utils.ts"]) {
          console.warn(
            "⚠️ src/lib/utils.ts is missing. Creating a fallback file..."
          );

          // Create a fallback file with minimal content
          fileSystem["src/lib/utils.ts"] = {
            type: "file",
            content:
              "export function cn(...inputs: any[]) { return inputs.join(' '); }", // Minimal fallback content
          };

          console.log("✅ Created src/lib/utils.ts as a fallback file.");
        }

        // Normalize file paths to ensure compatibility
        const normalizedFileSystem = normalizeFileSystem(fileSystem);

        // Mount the file system
        try {
          await webContainer.mount(normalizedFileSystem);
          console.log("✅ File system mounted successfully.");
          setLogs((prev) => [...prev, "✅ File system mounted successfully."]);
        } catch (error) {
          console.error("❌ Failed to mount file system:", error);

          // Attempt to debug the error by logging the problematic file
          if (
            error instanceof Error &&
            error.message.includes("src/lib/utils.ts")
          ) {
            console.error(
              "❌ Error related to src/lib/utils.ts. File details:",
              normalizedFileSystem["src/lib/utils.ts"]
            );
          }

          setLogs((prev) => [...prev, "❌ Failed to mount file system."]);
          return;
        }

        // Determine the package manager
        const packageManager = fileSystem["package-lock.json"]
          ? "npm"
          : fileSystem["yarn.lock"]
          ? "yarn"
          : fileSystem["pnpm-lock.yaml"]
          ? "pnpm"
          : "npm";

        console.log(`📦 Using package manager: ${packageManager}`);
        setLogs((prev) => [
          ...prev,
          `📦 Using package manager: ${packageManager}`,
        ]);

        // Install dependencies
        console.log("📦 Installing dependencies...");
        setLogs((prev) => [...prev, "📦 Installing dependencies..."]);

        const installProcess = await webContainer.spawn(packageManager, [
          "install",
        ]);

        installProcess.output.pipeTo(
          new WritableStream({
            write(chunk) {
              console.log("📜 Install Log:", chunk.trim());
              setLogs((prev) => [...prev, chunk.trim()]);
            },
          })
        );

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          console.error("❌ Dependency installation failed.");
          setLogs((prev) => [...prev, "❌ Dependency installation failed."]);
          return;
        }

        console.log("✅ Starting Gennit app...");
        setLogs((prev) => [...prev, "✅ Starting Gennit app..."]);

        // Start the development server
        const startProcess = await webContainer.spawn("npm", ["run", "dev"], {
          env: { PORT: "3000" },
        });

        startProcess.output.pipeTo(
          new WritableStream({
            write(chunk) {
              console.log("🖥️ App Log:", chunk.trim());
              setLogs((prev) => [...prev, chunk.trim()]);
            },
          })
        );
      } catch (error) {
        console.error("❌ Error starting Gennit:", error);
        setLogs((prev) => [...prev, "❌ Error: Failed to start Gennit app"]);
      }
    };

    // Normalize file system structure for compatibility
    const normalizeFileSystem = (fs: Record<string, any>) => {
      const normalizedFS: Record<string, any> = {};
      for (const [key, value] of Object.entries(fs)) {
        if ((value as { type: string }).type === "file") {
          normalizedFS[key] = {
            type: "file",
            content: value.content || "", // Ensure content is always a string
          };
        } else if (value.type === "directory") {
          normalizedFS[key] = {
            type: "directory",
          };
        }
      }
      return normalizedFS;
    };

    // Initial logs
    setLogs([
      "[R] - Restart the Gennit app",
      "[S] - Reset the Gennit app",
      "Waiting for device connections...",
    ]);

    // Delay execution to allow file system to fully load
    setTimeout(() => {
      startGennit();
    }, 5000); // Increased timeout to 5 seconds

    return destroyWebContainerInstance;
  }, [files]);
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
      }}
    >
      <TooltipProvider>
        <div
          className={cn(
            "flex h-full flex-col transition-all duration-300",
            theme === "dark" ? "bg-[#000001]" : "bg-white",
            isMaximized ? "fixed inset-0 z-50" : "relative"
          )}
        >
          <div
            className={cn(
              "border-b px-4 py-2 flex items-center justify-between",
              theme === "dark" ? "border-zinc-700" : "border-zinc-200"
            )}
          >
            <div className="flex items-center space-x-1 overflow-x-auto">
              <Button
                variant={activeTab === "preview" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "gap-2 whitespace-nowrap",
                  activeTab === "preview" &&
                    "bg-gray-400 text-gray-900 hover:bg-gray-500 dark:bg-[#27272A] dark:text-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <MonitorSmartphone className="h-4 w-4" />
                Preview
              </Button>
              {(isDesktop || isMobile || isTablet) && (
                <Button
                  variant={activeTab === "code" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("code")}
                  className={cn(
                    "gap-2 whitespace-nowrap",
                    activeTab === "code" &&
                      "bg-gray-400 text-gray-900 hover:bg-gray-500 dark:bg-[#27272A] dark:text-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Code className="h-4 w-4" />
                  Code
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleMaximize}
              >
                {isMaximized ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {}}>
                    <GitFork className="h-4 w-4 mr-2" />
                    Fork
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied",
                        description:
                          "The URL has been copied to your clipboard.",
                        action: <ToastAction altText="OK">OK</ToastAction>,
                      });
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadAsZip(files)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isMobile || isTablet ? (
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <Rocket className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex flex-row items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    // className="gap-2 whitespace-nowrap"
                    className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
                  >
                    {/* <Rocket className="h-4 w-4" /> */}
                    <svg
                      viewBox="0 0 109 113"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
                        fill="url(#paint0_linear)"
                      />
                      <path
                        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
                        fill="url(#paint1_linear)"
                        fill-opacity="0.2"
                      />
                      <path
                        d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
                        fill="#3ECF8E"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear"
                          x1="53.9738"
                          y1="54.974"
                          x2="94.1635"
                          y2="71.8295"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#249361" />
                          <stop offset="1" stop-color="#3ECF8E" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear"
                          x1="36.1558"
                          y1="30.578"
                          x2="54.4844"
                          y2="65.0806"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop />
                          <stop offset="1" stop-opacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <span>Connect to superbase</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    // className="gap-2 whitespace-nowrap"
                    className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    <Rocket className="h-4 w-4" />
                    <span>Deploy</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user?.userdp}
                            alt={user?.username}
                          />
                          <AvatarFallback>{user?.username[0]}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex items-center gap-2 pz-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user?.userdp}
                              alt={user?.username}
                            />
                            <AvatarFallback>{user?.username[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user?.username}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {user?.email}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <PricingDialog>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span>Upgrade to Pro</span>
                          </DropdownMenuItem>
                        </PricingDialog>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheck className="mr-2 h-4 w-4" />
                          <span>Account</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Billing</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          <span>Notifications</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Switch to light mode</span>
                          </>
                        ) : (
                          <>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Switch to dark mode</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {activeTab === "preview" && (
              <BrowserBar
                onDeviceChange={handleDeviceChange}
                currentUrl={currentUrl}
                onUrlChange={handleUrlChange}
                onNavigate={handleNavigate}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
              />
            )}
            <ResizablePanelGroup
              direction={isMobile ? "vertical" : "horizontal"}
            >
              {activeTab === "code" ? (
                <>
                  <ResizablePanel defaultSize={20} minSize={15}>
                    <ScrollArea className="h-full">
                      <FileTree onSelectFile={handleFileSelect} />
                    </ScrollArea>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={80}>
                    <div className="h-full flex flex-col">
                      <Tabs
                        value={activeCodeTab}
                        onValueChange={(value) =>
                          setActiveCodeTab(value as "editor" | "terminal")
                        }
                        className="flex-1 flex flex-col"
                      >
                        <div className="border-b border-zinc-200 dark:border-zinc-700">
                          <TabsList className="w-full justify-start h-10 p-0 bg-transparent">
                            <TabsTrigger
                              value="editor"
                              className={cn(
                                "relative rounded-none border-b border-transparent data-[state=active]:border-none",
                                "data-[state=active]:bg-transparent data-[state=active]:text-foreground",
                                "data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0",
                                "data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[2px]", // Reduced height for thinner border
                                "data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-blue-500 data-[state=active]:after:to-sky-300"
                              )}
                            >
                              <Code className="h-4 w-4 mr-2" />
                              Editor
                            </TabsTrigger>
                            <TabsTrigger
                              value="terminal"
                              className={cn(
                                "relative rounded-none border-b border-transparent data-[state=active]:border-none",
                                "data-[state=active]:bg-transparent data-[state=active]:text-foreground",
                                "data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0",
                                "data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[2px]", // Reduced height for thinner border
                                "data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-blue-500 data-[state=active]:after:to-sky-300"
                              )}
                            >
                              <TerminalIcon className="h-4 w-4 mr-2" />
                              Terminal
                            </TabsTrigger>
                          </TabsList>
                        </div>
                        <TabsContent value="editor" className="flex-1 h-full">
                          {selectedFile && (
                            <FileHeader
                              fileName={selectedFile.name}
                              content={selectedFile.content || ""}
                            />
                          )}
                          {selectedFile ? (
                            <React.Suspense fallback={<EditorSpinner />}>
                              <MonacoEditor
                                beforeMount={(monaco) => {
                                  // Configure JSX support
                                  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
                                    {
                                      jsx: monaco.languages.typescript.JsxEmit
                                        .React,
                                      jsxFactory: "React.createElement",
                                      reactNamespace: "React",
                                      allowNonTsExtensions: true,
                                      allowJs: true,
                                      target:
                                        monaco.languages.typescript.ScriptTarget
                                          .Latest,
                                    }
                                  );

                                  // Add React types
                                  monaco.languages.typescript.typescriptDefaults.addExtraLib(
                                    `
                              declare module JSX {
                                interface Element {}
                                interface IntrinsicElements {
                                  [elemName: string]: any;
                                }
                              }
                              declare module React {
                                export function createElement(type: any, props?: any, ...children: any[]): JSX.Element;
                              }
                              `,
                                    "react.d.ts"
                                  );

                                  // ✅ Register Tailwind config syntax highlighting
                                  monaco.languages.register({ id: "tailwind" });
                                  monaco.languages.setMonarchTokensProvider(
                                    "tailwind",
                                    {
                                      tokenizer: {
                                        root: [
                                          [/module\.exports/, "keyword"],
                                          [/require\(.+\)/, "string"],
                                          [/[{}()\[\]]/, "delimiter"],
                                          [/(\b[a-zA-Z0-9_-]+):/, "variable"],
                                        ],
                                      },
                                    }
                                  );

                                  // ✅ Register .env syntax support
                                  monaco.languages.register({ id: "dotenv" });
                                  monaco.languages.setMonarchTokensProvider(
                                    "dotenv",
                                    {
                                      tokenizer: {
                                        root: [
                                          [/^#.*$/, "comment"],
                                          [
                                            /^(\w+)=(".*?"|'.*?'|[^#\s]*)/,
                                            ["variable", "string"],
                                          ],
                                        ],
                                      },
                                    }
                                  );

                                  // ✅ Register HTML syntax highlighting
                                  monaco.languages.register({ id: "html" });
                                  monaco.languages.setMonarchTokensProvider(
                                    "html",
                                    {
                                      tokenizer: {
                                        root: [
                                          [/<\w+>/, "tag"],
                                          [/<\/\w+>/, "tag"],
                                          [/".*?"/, "string"],
                                          [/'.*?'/, "string"],
                                        ],
                                      },
                                    }
                                  );

                                  // ✅ Register CSS syntax highlighting
                                  monaco.languages.register({ id: "css" });
                                  monaco.languages.setMonarchTokensProvider(
                                    "css",
                                    {
                                      tokenizer: {
                                        root: [
                                          [
                                            /\b[a-zA-Z-]+\b(?=\s*:)/,
                                            "attribute",
                                          ],
                                          [/[{}()\[\]]/, "delimiter"],
                                          [/#[a-fA-F0-9]{3,6}/, "color"],
                                        ],
                                      },
                                    }
                                  );

                                  // ✅ Register JavaScript syntax highlighting
                                  monaco.languages.register({
                                    id: "javascript",
                                  });
                                  monaco.languages.setMonarchTokensProvider(
                                    "javascript",
                                    {
                                      tokenizer: {
                                        root: [
                                          [/function/, "keyword"],
                                          [/var|let|const/, "keyword"],
                                          [/\b\d+\b/, "number"],
                                          [/".*?"/, "string"],
                                          [/'.*?'/, "string"],
                                        ],
                                      },
                                    }
                                  );

                                  // ✅ Add support for custom components in the editor
                                  monaco.languages.registerCompletionItemProvider(
                                    editorLanguage,
                                    {
                                      provideCompletionItems: (
                                        model,
                                        position
                                      ) => {
                                        const word =
                                          model.getWordUntilPosition(position);
                                        const range = {
                                          startLineNumber: position.lineNumber,
                                          endLineNumber: position.lineNumber,
                                          startColumn: word.startColumn,
                                          endColumn: word.endColumn,
                                        };
                                        return {
                                          suggestions: [
                                            {
                                              label: "CustomComponent",
                                              kind: monaco.languages
                                                .CompletionItemKind.Function,
                                              insertText: "<CustomComponent />",
                                              range: range,
                                            },
                                          ],
                                        };
                                      },
                                    }
                                  );
                                }}
                                // height="100%"
                                // language={
                                //   editorLanguage === "typescript"
                                //     ? "typescript"
                                //     : "javascript"
                                // }
                                height="calc(100vh - 60px)"
                                language={editorLanguage} // Dynamic language based on filename
                                theme={theme === "dark" ? "vs-dark" : "light"}
                                value={selectedFile ? selectedFile.content : ""}
                                onChange={(value) => {
                                  if (selectedFile && value !== undefined) {
                                    setSelectedFile({
                                      ...selectedFile,
                                      content: value,
                                    });
                                  }
                                }}
                                onMount={(editor, monaco) => {
                                  defineCustomThemes(monaco);
                                  monaco.editor.setTheme(
                                    theme === "dark"
                                      ? "nextjsProTheme"
                                      : "nextjsProLightTheme"
                                  );

                                  editorRef.current = editor;
                                }}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 12,
                                  lineNumbers: "on",
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                  tabSize: 1,
                                  fontFamily: "'JetBrains Mono', monospace",
                                  padding: { top: 16 },
                                  renderLineHighlight: "all",
                                  mouseWheelZoom: true,
                                  scrollbar: {
                                    useShadows: false,
                                    verticalHasArrows: true,
                                    horizontalHasArrows: true,
                                    vertical: "visible",
                                    horizontal: "visible",
                                    verticalScrollbarSize: 10,
                                    horizontalScrollbarSize: 10,
                                    arrowSize: 30,
                                  },
                                  selectOnLineNumbers: true,
                                  quickSuggestions: true,
                                  // wordBasedSuggestions: true,
                                  // jsx: true,
                                }}
                              />
                            </React.Suspense>
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              {/* Select a file to edit */}

                              <div className="h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto main-canvas">
                                <p className="text-base text-neutral-900 dark:text-gray-300 text-muted-foreground flex w-[10vw] flex-grow items-center font-normal">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <path
                                        d="M8 16H5.43C3.14 16 2 14.86 2 12.57V5.43C2 3.14 3.14 2 5.43 2H10C12.29 2 13.43 3.14 13.43 5.43"
                                        stroke="#292D32"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />{" "}
                                      <path
                                        d="M18.57 22H14C11.71 22 10.57 20.86 10.57 18.57V11.43C10.57 9.14 11.71 8 14 8H18.57C20.86 8 22 9.14 22 11.43V18.57C22 20.86 20.86 22 18.57 22Z"
                                        stroke="#292D32"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />{" "}
                                      <path
                                        d="M14.87 15H18.13"
                                        stroke="#292D32"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />{" "}
                                      <path
                                        d="M16.5 16.6301V13.3701"
                                        stroke="#292D32"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />{" "}
                                    </g>
                                  </svg>
                                  <span />
                                </p>
                              </div>
                            </div>
                          )}
                        </TabsContent>
                        {/* <TabsContent
                          value="terminal"
                          className="flex-1 h-40 overflow-y-auto"
                        >
                          <div className="h-full bg-white dark:bg-black text-black dark:text-white font-mono text-sm p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span className="text-yellow-500">Terminal</span>
                            </div>
                            <span className="my-2 text-gray-600 dark:text-gray-400">
                              [R] - restart the Preview app on all connected
                              devices
                              <br />
                              [S] - reset the Preview app on all connected
                              devices
                              <br />
                              <br />
                              Waiting for device connections...
                            </span>
                            <div
                              className="text-gray-600 dark:text-gray-400 mt-2"
                              ref={terminalRef}
                            >
                              {logs.map((log, i) => (
                                <div key={i}>{log}</div>
                              ))}
                            </div>
                          </div>
                        </TabsContent> */}

                        <TabsContent
                          value="terminal"
                          className="flex-1 min-h-0"
                        >
                          <div className="h-full bg-black text-white font-mono text-sm">
                            <ScrollArea className="h-[40vh] lg:h-[80vh]">
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                  <Zap className="h-4 w-4 text-yellow-500" />
                                  <span className="text-yellow-500">
                                    Terminal
                                  </span>
                                </div>
                                <div className="text-gray-400">
                                  [R] - restart the Preview app on all connected
                                  devices
                                  <br />
                                  [S] - reset the Preview app on all connected
                                  devices
                                  <br />
                                  <br />
                                  Waiting for device connections...
                                  <br />
                                  <br />
                                  {logs.map((log, i) => (
                                    <div key={i}>{log}</div>
                                  ))}
                                </div>
                              </div>
                            </ScrollArea>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </ResizablePanel>
                </>
              ) : (
                <ResizablePanel defaultSize={100}>
                  <div className="h-full flex flex-col">
                    {activeTab === "preview" && (
                      <div
                        className={cn(
                          "h-full w-full overflow-hidden bg-white mx-auto transition-all",
                          getPreviewWidth()
                        )}
                      >
                        <iframe
                          ref={iframeRef}
                          src={currentUrl}
                          className={cn("w-full h-full border-none", {
                            "max-w-[375px] mx-auto": currentDevice === "mobile",
                            "max-w-[768px] mx-auto": currentDevice === "tablet",
                          })}
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          title="Preview"
                          allowFullScreen
                          onLoad={handleIframeLoad}
                          // onError={handleIframeError}
                        ></iframe>
                      </div>
                    )}
                  </div>
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </div>
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
