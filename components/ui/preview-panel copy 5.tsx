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
  RefreshCw,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
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
  Globe,
  Lock,
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
import { Switch } from "@/components/ui/switch";
import { FileHeader } from "./file-header";
import { FileNode, useFileSystem } from "@/context/FileSystem";
import { useChat, useUserContext } from "@/context";
import { PricingDialog } from "../layout/pricing-dialog";
import BrowserConsole from "./browser-console";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

declare global {
  interface Window {
    monaco: typeof import("monaco-editor");
    setCurrentUrlAttachment?: (fileName: string, url: string) => void;
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
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  const [isPublic, setIsPublic] = useState(true);
  const { files, setFiles, searchFiles, moveFile } = useFileSystem();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeTab, setActiveTab] = useState<Tab>(
    isDesktop ? "code" : "preview"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [finalUrl, setFinalUrl] = useState(
    "https://proliferate-client.vercel.app/"
  );
  const retryCount = useRef(0);
  const maxRetries = 5;
  const [loadError, setLoadError] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<"editor" | "console">(
    "editor"
  );
  const PORT = 3333; // Specific unique port
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<DeviceType>("desktop");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1023px)");
  const [code, setCode] = React.useState("");
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [currentUrl, setCurrentUrl] = useState("https://www.proliferate.ai/");
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

  // const buildFileSystem = (items: FileNode[], basePath = "") => {

  //   console.log("Building file", items);
  //   return items.reduce((acc, item) => {
  //     const path = basePath ? `${basePath}/${item.name}` : item.name;
  //     if (item.type === "file") {
  //       acc[path] = { file: { contents: item.content || "" } };
  //     } else if (item.type === "folder") {
  //       acc[path] = { directory: {} };
  //       Object.assign(acc, buildFileSystem(item.children || [], path));
  //     }
  //     return acc;
  //   }, {} as Record<string, any>);
  // };

  // Function to reset the app
  const handleReset = () => {
    setLogs([
      `[S] - Reset the Gennit app`,
      "Waiting for device connections...",
    ]);
    setBuildStatus("idle");
    setCurrentUrl("");
    initializedRef.current = false;
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

  const buildFileSystem = (items: FileNode[], basePath = "") => {
    console.log("Building file", items);

    return items.reduce((acc, item) => {
      const path = basePath ? `${basePath}/${item.name}` : item.name;

      if (item.type === "file") {
        acc[path] = { type: "file", content: item.content || "" };
      } else if (item.type === "folder") {
        acc[path] = { type: "directory", children: {} };
        acc[path].children = buildFileSystem(item.children || [], path); // Recursively add children
      }

      return acc;
    }, {} as Record<string, any>);
  };

  //   useEffect(() => {
  //     if (!files || files.length === 0) {
  //       console.log("🚨 No files found or files array is empty.");
  //       return; // Ensure files are loaded
  //     }

  //     if (initializedRef.current) {
  //       console.log("⚠️ Gennit has already been initialized. Skipping...");
  //       return; // Prevent multiple runs
  //     }
  //     initializedRef.current = true;

  //     const startGennit = async () => {
  //       try {
  //         console.log("✅ Initializing Gennit environment...");
  //         setLogs((prev) => [...prev, "✅ Initializing Gennit environment..."]);

  //         // Get WebContainer instance and build file system
  //         const webContainer = await getWebContainerInstance();
  //         const fileSystem = buildFileSystem(files);

  //         // Debugging: Log the file system structure
  //         console.log("📂 File system structure:", fileSystem);

  //         // Normalize file paths to ensure compatibility

  //         // const normalizedFileSystem = normalizeFileSystem(fileSystem);
  //         // console.log("📂 Normalized file system:", normalizedFileSystem);

  //         // Mount the file system

  //         const files2 = {
  //           "package.json": {
  //             file: {
  //               contents: JSON.stringify(
  //                 {
  //                   name: "nextjs-starter",
  //                   version: "0.1.0",
  //                   private: true,
  //                   scripts: {
  //                     dev: "next dev",
  //                     build: "next build",
  //                     start: "next start",
  //                   },
  //                   dependencies: {
  //                     next: "^14.0.0",
  //                     react: "^18.2.0",
  //                     "react-dom": "^18.2.0",
  //                   },
  //                 },
  //                 null,
  //                 2
  //               ),
  //             },
  //           },
  //           "next.config.js": {
  //             file: {
  //               contents: `/** @type {import('next').NextConfig} */
  // const nextConfig = {
  //   reactStrictMode: true,
  // }

  // module.exports = nextConfig`,
  //             },
  //           },
  //           "jsconfig.json": {
  //             file: {
  //               contents: JSON.stringify(
  //                 {
  //                   compilerOptions: {
  //                     paths: {
  //                       "@/*": ["./*"],
  //                     },
  //                   },
  //                 },
  //                 null,
  //                 2
  //               ),
  //             },
  //           },
  //           app: {
  //             directory: {
  //               "page.js": {
  //                 file: {
  //                   contents: `export default function Home() {
  //   return (
  //     <main className="flex min-h-screen flex-col items-center justify-center p-24">
  //       <h1 className="text-4xl font-bold mb-6">
  //         Welcome to Next.js in WebContainer!
  //       </h1>
  //       <p className="text-xl">
  //         Edit <code className="font-mono bg-gray-100 p-1 rounded">app/page.js</code> and save to see your changes.
  //       </p>
  //     </main>
  //   )
  // }`,
  //                 },
  //               },
  //               "layout.js": {
  //                 file: {
  //                   contents: `export const metadata = {
  //   title: 'Next.js in WebContainer',
  //   description: 'Running Next.js inside WebContainer',
  // }

  // export default function RootLayout({ children }) {
  //   return (
  //     <html lang="en">
  //       <body>{children}</body>
  //     </html>
  //   )
  // }`,
  //                 },
  //               },
  //               "globals.css": {
  //                 file: {
  //                   contents: `@tailwind base;
  // @tailwind components;
  // @tailwind utilities;

  // :root {
  //   --foreground-rgb: 0, 0, 0;
  //   --background-rgb: 255, 255, 255;
  // }

  // body {
  //   color: rgb(var(--foreground-rgb));
  //   background: rgb(var(--background-rgb));
  // }
  // `,
  //                 },
  //               },
  //             },
  //           },
  //           "tailwind.config.js": {
  //             file: {
  //               contents: `/** @type {import('tailwindcss').Config} */
  // module.exports = {
  //   content: [
  //     './pages/**/*.{js,ts,jsx,tsx,mdx}',
  //     './components/**/*.{js,ts,jsx,tsx,mdx}',
  //     './app/**/*.{js,ts,jsx,tsx,mdx}',
  //   ],
  //   theme: {
  //     extend: {},
  //   },
  //   plugins: [],
  // }`,
  //             },
  //           },
  //           "postcss.config.js": {
  //             file: {
  //               contents: `module.exports = {
  //   plugins: {
  //     tailwindcss: {},
  //     autoprefixer: {},
  //   },
  // }`,
  //             },
  //           },
  //         };
  //         try {
  //           await webContainer.mount(files2);
  //           console.log("✅ File system mounted successfully.");
  //           setLogs((prev) => [...prev, "✅ File system mounted successfully."]);
  //         } catch (error) {
  //           console.error("❌ Failed to mount file system:", error);
  //           setLogs((prev) => [...prev, "❌ Failed to mount file system."]);
  //           return;
  //         }

  //         // Determine the package manager
  //         const packageManager = fileSystem["pnpm-lock.yaml"]
  //           ? "pnpm"
  //           : fileSystem["yarn.lock"]
  //           ? "yarn"
  //           : "npm"; // Default to npm

  //         console.log(`📦 Using package manager: ${packageManager}`);
  //         setLogs((prev) => [
  //           ...prev,
  //           `📦 Using package manager: ${packageManager}`,
  //         ]);

  //         // Check if the package manager is installed
  //         const isPackageManagerInstalled = await checkPackageManagerInstallation(
  //           webContainer,
  //           packageManager
  //         );

  //         if (!isPackageManagerInstalled) {
  //           console.error(
  //             `❌ ${packageManager} is not installed. Attempting to install...`
  //           );
  //           setLogs((prev) => [
  //             ...prev,
  //             `❌ ${packageManager} is not installed. Attempting to install...`,
  //           ]);

  //           const installSuccess = await installPackageManager(
  //             webContainer,
  //             packageManager
  //           );

  //           if (!installSuccess) {
  //             console.error(`❌ Failed to install ${packageManager}.`);
  //             setLogs((prev) => [
  //               ...prev,
  //               `❌ Failed to install ${packageManager}.`,
  //             ]);
  //             return;
  //           }
  //         }

  //         // Install dependencies with --legacy-peer-deps
  //         console.log("📦 Installing dependencies...");
  //         setLogs((prev) => [...prev, "📦 Installing dependencies..."]);

  //         let installComplete = false;
  //         const installProcess = await webContainer.spawn(packageManager, [
  //           "install",
  //           "--legacy-peer-deps", // Add this flag to bypass peer dependency conflicts
  //         ]);

  //         // Suppress detailed logs during installation
  //         installProcess.output.pipeTo(
  //           new WritableStream({
  //             write(chunk) {
  //               console.debug("📜 Install Log (suppressed):", chunk.trim());
  //             },
  //           })
  //         );

  //         // Wait for installation to finish and check exit code
  //         const installExitCode = await installProcess.exit;
  //         if (installExitCode === 0) {
  //           installComplete = true;
  //           console.log("✅ Installation complete.");
  //           setLogs((prev) => [...prev, "✅ Installation complete."]);
  //         } else {
  //           console.error("❌ Failed to install dependencies.");
  //           setLogs((prev) => [...prev, "❌ Failed to install dependencies."]);
  //           return;
  //         }

  //         if (installComplete) {
  //           console.log("✅ Starting Gennit app...");
  //           setLogs((prev) => [...prev, "✅ Starting Gennit app..."]);

  //           // Start the development server
  //           const startProcess = await webContainer.spawn("npm", ["run", "dev"], {
  //             env: { PORT: "3000" },
  //           });

  //           startProcess.output.pipeTo(
  //             new WritableStream({
  //               write(chunk) {
  //                 console.log("🖥️ App Log:", chunk.trim());
  //                 setLogs((prev) => [...prev, chunk.trim()]);
  //               },
  //             })
  //           );
  //         }
  //       } catch (error) {
  //         console.error("❌ Error starting Gennit:", error);
  //         setLogs((prev) => [...prev, "❌ Error: Failed to start Gennit app"]);
  //       }
  //     };

  //     // Function to check if the package manager is installed
  //     const checkPackageManagerInstallation = async (
  //       webContainer: any,
  //       packageManager: string
  //     ): Promise<boolean> => {
  //       try {
  //         const versionProcess = await webContainer.spawn(packageManager, ["-v"]);
  //         versionProcess.output.pipeTo(
  //           new WritableStream({
  //             write(chunk) {
  //               console.log(
  //                 `✅ Detected ${packageManager} version: ${chunk.trim()}`
  //               );
  //             },
  //           })
  //         );

  //         await versionProcess.exit;
  //         return true; // Package manager is installed
  //       } catch (error) {
  //         console.error(`❌ ${packageManager} is not installed.`);
  //         return false; // Package manager is not installed
  //       }
  //     };

  //     // Function to install the package manager if missing
  //     const installPackageManager = async (
  //       webContainer: any,
  //       packageManager: string
  //     ): Promise<boolean> => {
  //       try {
  //         let installCommand: string[] = [];

  //         if (packageManager === "pnpm") {
  //           installCommand = ["npm", "install", "-g", "pnpm"];
  //         } else if (packageManager === "yarn") {
  //           installCommand = ["npm", "install", "-g", "yarn"];
  //         } else if (packageManager === "npm") {
  //           installCommand = ["npm", "install", "-g", "npm"];
  //         }

  //         const installProcess = await webContainer.spawn(installCommand[0], [
  //           ...installCommand.slice(1),
  //         ]);

  //         installProcess.output.pipeTo(
  //           new WritableStream({
  //             write(chunk) {
  //               console.log("📜 Installation Log:", chunk.trim());
  //             },
  //           })
  //         );

  //         const installExitCode = await installProcess.exit;
  //         if (installExitCode !== 0) {
  //           console.error(`❌ Failed to install ${packageManager}.`);
  //           return false;
  //         }

  //         console.log(`✅ ${packageManager} installed successfully.`);
  //         return true;
  //       } catch (error) {
  //         console.error(`❌ Failed to install ${packageManager}:`, error);
  //         return false;
  //       }
  //     };

  //     // Normalize file system structure for compatibility
  //     const normalizeFileSystem = (fs: Record<string, any>) => {
  //       const normalizedFS: Record<string, any> = {};
  //       for (const [key, value] of Object.entries(fs)) {
  //         if ((value as { type: string }).type === "file") {
  //           normalizedFS[key] = {
  //             type: "file",
  //             content: value.content || "", // Ensure content is always a string
  //           };
  //         } else if (value.type === "directory") {
  //           normalizedFS[key] = {
  //             type: "directory",
  //           };
  //         }
  //       }
  //       return normalizedFS;
  //     };

  //     // Initial logs
  //     setLogs([
  //       "[R] - Restart the Gennit app",
  //       "[S] - Reset the Gennit app",
  //       "Waiting for device connections...",
  //     ]);

  //     // Delay execution to allow file system to fully load
  //     setTimeout(() => {
  //       startGennit();
  //     }, 5000); // Increased timeout to 5 seconds

  //     return destroyWebContainerInstance;
  //   }, [files]);

  // Function to check if the package manager is installed

  const checkPackageManagerInstallation = async (
    webContainer: any,
    packageManager: string
  ): Promise<boolean> => {
    try {
      const versionProcess = await webContainer.spawn(packageManager, ["-v"]);
      versionProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log(
              `✅ Detected ${packageManager} version: ${chunk.trim()}`
            );
          },
        })
      );

      await versionProcess.exit;
      return true; // Package manager is installed
    } catch (error) {
      console.error(`❌ ${packageManager} is not installed.`);
      return false; // Package manager is not installed
    }
  };

  // Function to install the package manager if missing
  const installPackageManager = async (
    webContainer: any,
    packageManager: string
  ): Promise<boolean> => {
    try {
      let installCommand: string[] = [];

      if (packageManager === "pnpm") {
        installCommand = ["npm", "install", "-g", "pnpm"];
      } else if (packageManager === "yarn") {
        installCommand = ["npm", "install", "-g", "yarn"];
      } else if (packageManager === "npm") {
        installCommand = ["npm", "install", "-g", "npm"];
      }

      const installProcess = await webContainer.spawn(installCommand[0], [
        ...installCommand.slice(1),
      ]);

      installProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log("📜 Installation Log:", chunk.trim());
          },
        })
      );

      const installExitCode = await installProcess.exit;
      if (installExitCode !== 0) {
        console.error(`❌ Failed to install ${packageManager}.`);
        return false;
      }

      console.log(`✅ ${packageManager} installed successfully.`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to install ${packageManager}:`, error);
      return false;
    }
  };

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
      `[R] - Restart the Gennit app (Port: ${PORT})`,
      "[S] - Reset the Gennit app",
      "Waiting for device connections...",
    ]);

    // Delay execution to allow file system to fully load
    // setTimeout(() => {
    //   startGennit();
    // }, 5000); // Increased timeout to 5 seconds

    return destroyWebContainerInstance;
  }, [files]);

  // Scroll to bottom of logs when they update
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  useEffect(() => {
    if (!currentUrl) return;

    // Reset state when URL changes
    setIsLoading(false);
    setLoadError(false);
    retryCount.current = 0;

    // Process the URL to ensure it's properly formatted
    const processUrl = (inputUrl: string) => {
      // Make sure URL is properly formatted
      let processedUrl = inputUrl.trim();

      // Check if URL is a local WebContainer URL
      if (processedUrl.includes("local-corp.webcontainer-api.io")) {
        // Ensure URL is using https
        if (!processedUrl.startsWith("https://")) {
          processedUrl = "https://" + processedUrl.replace(/^https?:\/\//, "");
        }

        // Remove any trailing slashes
        processedUrl = processedUrl.replace(/\/+$/, "");

        // Add a timestamp parameter to bypass caching
        processedUrl = `${processedUrl}?t=${Date.now()}`;

        console.log(`Processed WebContainer URL: ${processedUrl}`);
      }

      return processedUrl;
    };

    // Create a direct link to open in new tab as fallback
    const directLinkElement = document.createElement("a");
    directLinkElement.href = currentUrl;
    directLinkElement.target = "_blank";
    directLinkElement.rel = "noopener noreferrer";
    directLinkElement.textContent = "Open in new tab";

    const checkIframeLoaded = () => {
      try {
        // Try to access the iframe content to see if it's loaded
        const iframeWindow = iframeRef.current?.contentWindow;
        const iframeDoc = iframeRef.current?.contentDocument;

        if (
          iframeWindow &&
          (iframeWindow.document.readyState === "complete" ||
            iframeDoc?.readyState === "complete")
        ) {
          console.log("✅ iframe loaded successfully");
          setIsLoading(false);
          return true;
        }
      } catch (error) {
        console.warn("⚠️ CORS error or iframe not loaded yet:", error);
      }

      retryCount.current++;

      if (retryCount.current <= maxRetries) {
        console.log(
          `⚠️ Retry ${retryCount.current}/${maxRetries} loading iframe...`
        );
        setTimeout(checkIframeLoaded, 2000); // Retry after 2 seconds
        return false;
      } else {
        console.error("❌ Failed to load iframe after multiple attempts");
        setIsLoading(false); // Stop showing loading state
        setLoadError(true); // Show error state
        return false;
      }
    };

    // Initial check after a delay to allow the server to start
    setTimeout(checkIframeLoaded, 3000);

    // Set up message listener for communication from iframe
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from our iframe
      if (event.data === "iframe-loaded") {
        console.log("✅ Received loaded message from iframe");
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [currentUrl]);

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
            "flex h-full flex-col transition-all duration-300 rounded-l-xl",
            theme === "dark" ? "bg-[#000001]" : "bg-white",
            isMaximized ? "fixed inset-0 z-50" : "relative"
          )}
        >
          <div className="px-4 py-2 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center space-x-3">
              {/* Repository Visibility Toggle */}
              <TooltipProvider>
                <div className="flex items-center mr-2 pr-3 border-r border-zinc-200 dark:border-zinc-800">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="repo-visibility"
                          checked={isPublic}
                          onCheckedChange={setIsPublic}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <Label
                          htmlFor="repo-visibility"
                          className="flex items-center gap-1.5 text-sm font-medium cursor-pointer"
                        >
                          {isPublic ? (
                            <>
                              <Globe className="h-3.5 w-3.5 text-green-500" />
                              <span>Public</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3.5 w-3.5 text-amber-500" />
                              <span>Private</span>
                            </>
                          )}
                        </Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>
                        {isPublic
                          ? "Anyone can view this project"
                          : "Only you can view this project"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              {/* Preview/Code Toggle */}
              <TooltipProvider>
                <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("preview")}
                        disabled={isLoading}
                        className={cn(
                          "h-8 px-3 rounded-none border-r border-zinc-200 dark:border-zinc-800",
                          activeTab === "preview"
                            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                            : "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          <MonitorSmartphone className="h-4 w-4" />
                        )}
                        <span className="ml-2 text-xs font-medium">
                          Preview
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>View the rendered output</p>
                    </TooltipContent>
                  </Tooltip>

                  {(isDesktop || isMobile || isTablet) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab("code")}
                          className={cn(
                            "h-8 px-3 rounded-none",
                            activeTab === "code"
                              ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                              : "bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
                          )}
                        >
                          <Code className="h-4 w-4" />
                          <span className="ml-2 text-xs font-medium">Code</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>View and edit the source code</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TooltipProvider>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      onClick={toggleMaximize}
                    >
                      {isMaximized ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>
                      {isMaximized ? "Exit fullscreen" : "Enter fullscreen"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-zinc-200 dark:border-zinc-800"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
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
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <Rocket className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-md border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
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
                        fillOpacity="0.2"
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
                          <stop stopColor="#249361" />
                          <stop offset="1" stopColor="#3ECF8E" />
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
                          <stop offset="1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span>Supabase</span>
                  </Button>

                  <Button
                    size="sm"
                    className="gap-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
                  >
                    <Rocket className="h-4 w-4" />
                    <span>Deploy</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
                          <AvatarImage
                            src={user?.userdp}
                            alt={user?.username}
                          />
                          <AvatarFallback className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                            {user?.username[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex items-center gap-3 p-1">
                          <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-700">
                            <AvatarImage
                              src={user?.userdp}
                              alt={user?.username}
                            />
                            <AvatarFallback className="text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                              {user?.username[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user?.username}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
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
                            className="cursor-pointer"
                          >
                            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
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
                            <span>Light mode</span>
                          </>
                        ) : (
                          <>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark mode</span>
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
          <div className="flex-1 overflow-hidden p-2 mb-3">
            <ResizablePanelGroup
              direction={isMobile ? "vertical" : "horizontal"}
            >
              {activeTab === "code" ? (
                <div className="flex flex-row w-full h-full border border-zinc-200 dark:border-zinc-800 rounded-2xl lg:mx-4">
                  <ResizablePanel defaultSize={20} minSize={15}>
                    <ScrollArea className="h-full border-r border-zinc-200 dark:border-zinc-800">
                      <FileTree onSelectFile={handleFileSelect} />
                    </ScrollArea>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={80}>
                    <div className="h-full flex flex-col">
                      <Tabs
                        value={activeCodeTab}
                        onValueChange={(value) =>
                          setActiveCodeTab(value as "editor" | "console")
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
                              value="console"
                              className={cn(
                                "relative rounded-none border-b border-transparent data-[state=active]:border-none",
                                "data-[state=active]:bg-transparent data-[state=active]:text-foreground",
                                "data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0",
                                "data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-[2px]", // Reduced height for thinner border
                                "data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-blue-500 data-[state=active]:after:to-sky-300"
                              )}
                            >
                              {/* <TerminalIcon className="h-4 w-4 mr-2" /> */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-4 w-4 mr-2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
                                />
                              </svg>
                              Console
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
                          value="console"
                          className="flex-1 h-40 overflow-y-auto"
                        >
                          <div className="h-full bg-white dark:bg-black text-black dark:text-white font-mono text-sm p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span className="text-yellow-500">console</span>
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
                              ref={consoleRef}
                            >
                              {logs.map((log, i) => (
                                <div key={i}>{log}</div>
                              ))}
                            </div>
                          </div>
                        </TabsContent> */}

                        <TabsContent value="console" className="flex-1 min-h-0">
                          <div className="h-full bg-white dark:bg-black dark:text-white text-gray-800 font-mono text-sm">
                            {/* <ScrollArea className="h-[80vh] lg:h-[87vh]">
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                  <Zap className="h-4 w-4 text-yellow-500" />
                                  <span className="text-yellow-500">
                                    Console
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
                              
                               

                              {logs.map((log, index) => (
                                <div
                                  key={index}
                                  className={`mb-1 ${
                                    log.includes("❌")
                                      ? "text-red-400"
                                      : log.includes("✅")
                                      ? "text-green-400"
                                      : log.includes("⚠️")
                                      ? "text-yellow-400"
                                      : log.includes("🚀")
                                      ? "text-cyan-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {log}
                                </div>
                              ))}
                              <div ref={logsEndRef} />
                            </ScrollArea> */}
                            <BrowserConsole />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </ResizablePanel>
                </div>
              ) : (
                <ResizablePanel defaultSize={100}>
                  <div className="h-full flex flex-col mx-3 rounded-2xl">
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
                    {activeTab === "preview" && (
                      <div
                        className={cn(
                          "h-full w-full overflow-hidden bg-white mx-auto transition-all rounded-b-xl",
                          getPreviewWidth()
                        )}
                      >
                        {isLoading && (
                          <div className="flex items-center justify-center bg-gray-100 bg-opacity-50 h-full w-full">
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
                              <p className="text-sm text-gray-600">
                                Browser preview...
                              </p>
                            </div>
                          </div>
                        )}

                        {loadError && (
                          <div className="flex flex-col items-center justify-center bg-gray-100 h-full w-full">
                            <div className="text-center p-4 max-w-md">
                              <p className="text-red-500 font-medium mb-2">
                                Failed to load preview in iframe
                              </p>
                              <p className="text-sm text-gray-600 mb-4">
                                This may be due to CORS restrictions or Gennit
                                is not being fully initialized.
                              </p>
                              <a
                                href={currentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
                              >
                                Fix Error
                              </a>
                            </div>
                          </div>
                        )}

                        {currentUrl && (
                          <iframe
                            ref={iframeRef}
                            src={currentUrl}
                            className={cn("w-full h-full border-none", {
                              "max-w-[375px] mx-auto":
                                currentDevice === "mobile",
                              "max-w-[768px] mx-auto":
                                currentDevice === "tablet",
                            })}
                            allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking"
                            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                            title="Preview"
                            allowFullScreen
                            onLoad={handleIframeLoad}
                            // onError={handleIframeError}
                          ></iframe>
                        )}
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
