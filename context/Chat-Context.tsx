"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import { useUserContext } from "./AuthenticatedContext";

// Interfaces for generation state
export interface GenerationEvent {
  event: string;
  data: any;
}

export interface GeneratedFile {
  id: string;
  name: string;
  type: "file";
  filePath: string;
  language?: string;
  status: "generated" | "skipped" | "error";
  content: string;
}

export interface GenerationGroup {
  id: string;
  title: string;
  items: GeneratedFile[];
  timestamp: Date;
  isCollapsed?: boolean;
  isLatest?: boolean;
  isViewing?: boolean;
}

export interface ICollaborator {
  userId: any;
  userName: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: string;
  userAvatar?: string;
}

export interface ProjectInfo {
  projectId: string;
  title: string;
  description: string;
  tags: string[];
  deploymentUrl?: string;
  sandboxUrl?: string;
  isNewProject: boolean;
  createdAt: string;
  projectUsername?: string;
  userName?: string;
  userAvatar?: string;
  userId?: string;
  messages?: any[];
  collaborators?: ICollaborator[];
  isPublic?: boolean;
  viewCount?: number;
  starCount?: number;
  activeVersionId?: string;
  versions?: any[];
  completeCodebase?: any;
  containerStatus?: {
    taskArn: string;
    status: "PROVISIONING" | "PENDING" | "RUNNING" | "STOPPED" | "FAILED";
    publicUrl?: string;
    lastUpdated: Date;
    metadata?: Record<string, any>;
  };
}

interface GenerationState {
  isGenerating: boolean;
  isConnected: boolean;
  currentStep: string;
  progress: number;
  events: GenerationEvent[];
  projectInfo: ProjectInfo | null;
  error: string | null;
  deploymentUrl: string | null;
}

interface FileWithKey extends File {
  fileKey?: string;
}

export interface ChatInterfaceActions {
  setLiveMode: (isLive: boolean) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;
  toggleGeneration: (id: string) => void;
  retryLoading: (id: string) => void;
  setGenerations: React.Dispatch<React.SetStateAction<GenerationGroup[]>>;
  setIsUserPopoverOpen: (open: boolean) => void;
  setSelectedTheme: (theme: string) => void;
  setIsVisibilityDialogOpen: (open: boolean) => void;
  setChatVisibility: (visibility: string) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setInputValue: (value: string) => void;
  setAttachedFiles: React.Dispatch<React.SetStateAction<FileWithKey[]>>;
  setFileLoadingStates: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  setIsDragOver: (isDragOver: boolean) => void;
  setDragCounter: (counter: number) => void;
  setShowScrollButton: (show: boolean) => void;
  handleInput: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handlePaste: () => void;
  processFiles: (files: File[]) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  scrollToBottom: () => void;
  autoResize: () => void;
  clearInput: () => void;
  removeAttachedFile: (index: number) => void;
}

interface ChatInterfaceState {
  isLiveMode: boolean;
  isMobile: boolean;
  isDrawerOpen: boolean;
  generations: GenerationGroup[];
  userAvatar: string;
  userName: string;
  isUserPopoverOpen: boolean;
  selectedTheme: string;
  isVisibilityDialogOpen: boolean;
  chatVisibility: string;
  isMobileMenuOpen: boolean;
  inputValue: string;
  attachedFiles: FileWithKey[];
  fileLoadingStates: { [key: string]: boolean };
  isDragOver: boolean;
  dragCounter: number;
  showScrollButton: boolean;
  streamingFiles: Set<string>;
  streamingContent: string;
  streamingAnalysis: string;
}

// Socket-related interfaces
interface SocketActions {
  initializeSocket: (userId: string) => void;
  joinProjectRoom: (projectId: string) => void;
  leaveProjectRoom: () => void;
  disconnectSocket: () => void;
}

// Message interaction actions
interface MessageActions {
  sendMessage: (
    content: string,
    files: File[],
    projectId: string
  ) => Promise<void>;
  editMessage: (
    messageId: string,
    newContent: string,
    files?: File[]
  ) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, reaction: string) => Promise<void>;
  removeReaction: (messageId: string, reaction: string) => Promise<void>;
}

interface ProjectContextType
  extends ChatInterfaceState,
    ChatInterfaceActions,
    GenerationState,
    MessageActions,
    SocketActions {
  createProject: (prompt: string, files?: File[]) => Promise<void>;
  generateProject: (
    prompt: string,
    files: File[],
    projectId: string,
    fileUrls?: string[]
  ) => Promise<void>;
  cancelGeneration: () => void;
  clearError: () => void;
  resetGenerationState: () => void;
  setProjectInfo: React.Dispatch<React.SetStateAction<ProjectInfo | null>>;
  initializeChatSession: (slug: string, userId: string) => Promise<void>;
  fetchProjectDetails: (slug: string, userId: string) => Promise<void>;
  currentProjectRoom: string | null;
  socket: Socket | null;
  isLoadingProject: boolean;
  completeCodebase: any;
  // Dev mode properties
  isDevModeOpen: boolean;
  setIsDevModeOpen: (open: boolean) => void;
  selectedDevFile: string;
  setSelectedDevFile: (filePath: string) => void;
  handleGenerationItemClick: (item: any) => void;
  // Generation mode control
  forcePreviewModeDuringGeneration: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

// Helper function to update file tree with new content
const updateFileTreeWithNewContent = (
  fileTree: any[],
  filePath: string,
  content: string
): any[] => {
  const pathParts = filePath.split("/");
  const updateNode = (nodes: any[], currentPath: string[] = []): any[] => {
    return nodes.map((node) => {
      const nodePath = [...currentPath, node.name].join("/");
      if (node.type === "file" && nodePath === filePath) {
        return {
          ...node,
          content: content,
          lastModified: new Date(),
          status: "generated",
        };
      }
      if (node.type === "folder" && node.children) {
        return {
          ...node,
          children: updateNode(node.children, [...currentPath, node.name]),
        };
      }
      return node;
    });
  };
  return updateNode(fileTree);
};

export function ProjectProvider({ children }: ProjectProviderProps) {
  const router = useRouter();
  const user = useUserContext().user;
  const userId = String(user?._id);

  // Socket state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentProjectRoom, setCurrentProjectRoom] = useState<string | null>(
    null
  );
  const socketRef = useRef<Socket | null>(null);
  const streamMessageIdRef = useRef<string | null>(null);
  const latestStreamContent = useRef<string>("");
  const streamUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [events, setEvents] = useState<GenerationEvent[]>([]);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  // Chat interface state
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [generations, setGenerations] = useState<GenerationGroup[]>([]);
  const userAvatar =
    user?.metadata?.userdp ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";
  const userName = user?.username || "User";
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("system");
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const [chatVisibility, setChatVisibility] = useState("private");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<FileWithKey[]>([]);
  const [fileLoadingStates, setFileLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const [streamingFiles, setStreamingFiles] = useState<Set<string>>(new Set());
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingAnalysis, setStreamingAnalysis] = useState<string>("");
  const [completeCodebase, setCompleteCodebase] = useState<any>(null);
  const [isDevModeOpen, setIsDevModeOpen] = useState(false);
  const [selectedDevFile, setSelectedDevFile] = useState<string>("");
  const [
    forcePreviewModeDuringGeneration,
    setForcePreviewModeDuringGeneration,
  ] = useState(false);

  // Socket initialization
  const initializeSocket = useCallback(
    (userId: string) => {
      if (socketRef.current?.connected) {
        console.log(
          "🔌 [SOCKET_INIT] Socket already connected, reusing connection"
        );
        return socketRef.current;
      }
      console.log(
        "🚀 [SOCKET_INIT] Initializing socket connection for user:",
        userId
      );
      const newSocket = io(
        process.env.NEXT_PUBLIC_LOCAL_SOCKET_URL || "http://localhost:8000",
        {
          transports: ["websocket", "polling"],
          timeout: 20000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          query: { userId },
        }
      );

      // Connection event handlers
      newSocket.on("connect", () => {
        console.log(
          "✅ [SOCKET_CONNECT] Socket connected successfully:",
          newSocket.id
        );
        setIsConnected(true);
        setSocket(newSocket);
        socketRef.current = newSocket;
        newSocket.emit("join_user", { userId });
      });
      newSocket.on("disconnect", (reason) => {
        console.log("❌ [SOCKET_DISCONNECT] Socket disconnected:", reason);
        setIsConnected(false);
      });
      newSocket.on("connect_error", (error) => {
        console.error("❌ [SOCKET_ERROR] Socket connection error:", error);
        setIsConnected(false);
        setError("Failed to connect to server");
      });
      socketRef.current = newSocket;
      setSocket(newSocket);
      return newSocket;
    },
    [userId]
  );

  // Fetch project details function
  const fetchProjectDetails = useCallback(
    async (slug: string, userId: string) => {
      console.log(
        "📡 [FETCH_PROJECT_DETAILS] Fetching project details for slug:",
        slug
      );
      if (!slug || !userId) {
        console.error("❌ [FETCH_PROJECT_DETAILS] Missing slug or userId");
        setError("Missing project information");
        return;
      }
      setIsLoadingProject(true);
      setError(null);
      try {
        let currentSocket = socketRef.current;
        if (!currentSocket?.connected) {
          console.log(
            "🔌 [FETCH_PROJECT_DETAILS] Socket not connected, initializing..."
          );
          currentSocket = initializeSocket(userId);
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Socket connection timeout"));
            }, 10000);
            const checkConnection = () => {
              if (currentSocket?.connected) {
                clearTimeout(timeout);
                resolve();
              } else {
                setTimeout(checkConnection, 100);
              }
            };
            checkConnection();
          });
        }
        console.log("📤 [FETCH_PROJECT_DETAILS] Emitting get_project_details");
        currentSocket.emit("get_project_details", { slug, userId });
      } catch (error) {
        console.error("❌ [FETCH_PROJECT_DETAILS] Exception:", error);
        setError("Failed to fetch project details");
        setIsLoadingProject(false);
      }
    },
    [initializeSocket]
  );

  // Join project room
  const joinProjectRoom = useCallback(
    (projectId: string) => {
      if (!socketRef.current?.connected) {
        console.warn(
          "⚠️ [JOIN_PROJECT_ROOM] Cannot join project room: socket not connected"
        );
        return;
      }
      console.log("🏠 [JOIN_PROJECT_ROOM] Joining project room:", projectId);
      if (currentProjectRoom && currentProjectRoom !== projectId) {
        socketRef.current.emit("leave_project", {
          projectId: currentProjectRoom,
        });
      }
      socketRef.current.emit("join_project", { projectId });
      setCurrentProjectRoom(projectId);
    },
    [currentProjectRoom]
  );

  // Leave project room
  const leaveProjectRoom = useCallback(() => {
    if (!socketRef.current?.connected || !currentProjectRoom) return;
    console.log(
      "🚪 [LEAVE_PROJECT_ROOM] Leaving project room:",
      currentProjectRoom
    );
    socketRef.current.emit("leave_project", { projectId: currentProjectRoom });
    setCurrentProjectRoom(null);
  }, [currentProjectRoom]);

  // Disconnect socket
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("🔌 [DISCONNECT_SOCKET] Disconnecting socket");
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setCurrentProjectRoom(null);
    }
  }, []);

  // Initialize chat session
  const initializeChatSession = useCallback(
    async (slug: string, userId: string) => {
      console.log(
        "🚀 [INIT_CHAT_SESSION] Initializing chat session for slug:",
        slug
      );
      if (!slug || !userId) {
        console.error("❌ [INIT_CHAT_SESSION] Missing slug or userId");
        setError("Missing session information");
        return;
      }
      try {
        setError(null);
        setIsLoadingProject(true);
        let currentSocket = socketRef.current;
        if (!currentSocket?.connected) {
          console.log("🔌 [INIT_CHAT_SESSION] Initializing socket...");
          currentSocket = initializeSocket(userId);
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Socket connection timeout"));
            }, 10000);
            const checkConnection = () => {
              if (currentSocket?.connected) {
                clearTimeout(timeout);
                resolve();
              } else {
                setTimeout(checkConnection, 100);
              }
            };
            checkConnection();
          });
        }
        joinProjectRoom(slug);
        await fetchProjectDetails(slug, userId);
        console.log(
          "✅ [INIT_CHAT_SESSION] Chat session initialized successfully"
        );
      } catch (err) {
        console.error(
          "❌ [INIT_CHAT_SESSION] Failed to initialize chat session:",
          err
        );
        setError("Failed to initialize chat session");
        setIsLoadingProject(false);
      }
    },
    [initializeSocket, joinProjectRoom, fetchProjectDetails]
  );

  // Project creation function
  const createProject = useCallback(
    async (prompt: string, files: File[] = []) => {
      console.log("🚀 [CREATE_PROJECT] Starting project creation");
      console.log("📝 [CREATE_PROJECT] Prompt:", prompt.slice(0, 100) + "...");
      console.log("📎 [CREATE_PROJECT] Files:", files.length);
      if (!prompt.trim()) {
        throw new Error("Prompt cannot be empty");
      }
      setError(null);
      setIsGenerating(true);
      setCurrentStep("Creating project from your prompt...");
      setProgress(5);
      try {
        if (!socketRef.current?.connected) {
          console.log(
            "🔌 [CREATE_PROJECT] Initializing socket for project creation"
          );
          setCurrentStep("Connecting to server...");
          setProgress(10);
          initializeSocket(userId);
          const connectionTimeout = 15000;
          const startTime = Date.now();
          await new Promise<void>((resolve, reject) => {
            const checkConnection = () => {
              if (socketRef.current?.connected) {
                console.log(
                  "✅ [CREATE_PROJECT] Socket connected successfully"
                );
                resolve();
              } else if (Date.now() - startTime > connectionTimeout) {
                reject(
                  new Error("Failed to connect to server. Please try again.")
                );
              } else {
                setTimeout(checkConnection, 100);
              }
            };
            checkConnection();
          });
        }

        setCurrentStep("Preparing files...");
        setProgress(20);
        let fileUrls: string[] = [];
        if (files.length > 0) {
          console.log("📤 [CREATE_PROJECT] Uploading", files.length, "files");
          setCurrentStep(
            `Uploading ${files.length} file${files.length > 1 ? "s" : ""}...`
          );
          setProgress(30);
          const formData = new FormData();
          files.forEach((file) => formData.append("files", file));
          try {
            const uploadResponse = await apiResponseFileUpload.post(
              "/upload",
              formData
            );
            fileUrls = uploadResponse.data.fileUrls || [];
            console.log(
              "✅ [CREATE_PROJECT] Files uploaded successfully:",
              fileUrls.length
            );
          } catch (uploadError) {
            console.error(
              "❌ [CREATE_PROJECT] File upload failed:",
              uploadError
            );
            throw new Error("Failed to upload files. Please try again.");
          }
        }

        // Store the original prompt and files for background processing
        if (typeof window !== "undefined") {
          sessionStorage.setItem("originalPrompt", prompt);
          sessionStorage.setItem("originalFiles", JSON.stringify(fileUrls));
        }

        setCurrentStep("Creating project...");
        setProgress(40);
        console.log("📡 [CREATE_PROJECT] Emitting create_project event");

        // Send the original prompt for project creation
        socketRef.current?.emit("create_project", {
          prompt,
          fileUrls,
          userId,
        });

        // The project_created event will handle the redirect automatically
      } catch (err: any) {
        console.error("❌ [CREATE_PROJECT] Error creating project:", err);
        setIsGenerating(false);
        setError(err.message || "Failed to create project");
        setCurrentStep("Project creation failed");
        throw err;
      }
    },
    [initializeSocket, userId]
  );

  // AI generation function
  const generateProject = useCallback(
    async (
      prompt: string,
      files: File[] = [],
      projectId: string,
      fileUrls?: string[]
    ) => {
      console.log(
        "🚀 [GENERATE_PROJECT] Starting AI generation for project:",
        projectId
      );
      if (!socketRef.current?.connected) {
        throw new Error("Socket not connected");
      }
      setIsGenerating(true);
      setCurrentStep("Initializing AI generation...");
      setProgress(0);
      setError(null);
      try {
        let uploadedFileUrls: string[] = fileUrls || [];
        // Only upload files if we don't already have URLs
        if (files.length > 0 && !fileUrls) {
          const formData = new FormData();
          files.forEach((file) => formData.append("files", file));
          const uploadResponse = await apiResponseFileUpload.post(
            "/upload",
            formData
          );
          uploadedFileUrls = uploadResponse.data.fileUrls || [];
        }
        console.log("📤 [GENERATE_PROJECT] Emitting generate_project with:", {
          prompt: prompt.slice(0, 50) + "...",
          fileUrls: uploadedFileUrls.length,
          projectId,
          userId,
        });
        socketRef.current.emit("generate_project", {
          prompt,
          fileUrls: uploadedFileUrls,
          projectId,
          userId,
          isInitialGeneration: false,
        });
      } catch (err: any) {
        console.error("❌ [GENERATE_PROJECT] Generation error:", err);
        setIsGenerating(false);
        setError(err.message || "Failed to start generation");
        setCurrentStep("Error occurred");
      }
    },
    [userId]
  );

  // Send message function
  const sendMessage = useCallback(
    async (content: string, files: File[] = [], projectId: string) => {
      console.log("📤 [SEND_MESSAGE] Sending message to project:", projectId);
      if (!socketRef.current?.connected) {
        throw new Error("Socket not connected");
      }
      if (!content.trim() && files.length === 0) {
        throw new Error("Message cannot be empty");
      }

      // Auto-switch to preview mode for follow-up prompts
      if (projectInfo && !projectInfo.isNewProject) {
        console.log(
          "🔄 [AUTO_PREVIEW_MODE] Switching to preview mode for follow-up prompt"
        );
        setIsLiveMode(true);
        setForcePreviewModeDuringGeneration(true);
      }

      try {
        let fileUrls: string[] = [];
        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((file) => formData.append("files", file));
          const uploadResponse = await apiResponseFileUpload.post(
            "/upload",
            formData
          );
          fileUrls = uploadResponse.data.fileUrls || [];
        }

        // Create a temporary message ID for immediate display
        const tempMessageId = `temp_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Add message to local state immediately for real-time display
        const newMessage = {
          id: tempMessageId,
          type: "user",
          content: content,
          status: "sending",
          timestamp: new Date(),
          fileAttachments: fileUrls.map((url) => ({ url, type: "file" })),
          reactions: [],
          userId: userId,
          userName: userName,
          userAvatar: userAvatar,
        };

        setProjectInfo((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...(prev.messages || []), newMessage],
          };
        });

        // Clear input immediately for better UX
        setInputValue("");
        setAttachedFiles([]);

        console.log("📤 [SEND_MESSAGE] Emitting send_message with:", {
          content: content.slice(0, 50) + "...",
          fileUrls: fileUrls.length,
          projectId,
          userId,
        });

        socketRef.current.emit("send_message", {
          content,
          fileUrls,
          projectId,
          userId,
        });
      } catch (error) {
        console.error("❌ [SEND_MESSAGE] Failed to send message:", error);
        throw error;
      }
    },
    [userId, projectInfo, userName, userAvatar]
  );

  // Other message actions
  const editMessage = useCallback(
    async (messageId: string, newContent: string, files?: File[]) => {
      console.log("✏️ [EDIT_MESSAGE] Editing message:", messageId);
      if (!socketRef.current?.connected) {
        throw new Error("Socket not connected");
      }
      try {
        let fileUrls: string[] = [];
        if (files && files.length > 0) {
          const formData = new FormData();
          files.forEach((file) => formData.append("files", file));
          const uploadResponse = await apiResponseFileUpload.post(
            "/upload",
            formData
          );
          fileUrls = uploadResponse.data.fileUrls || [];
        }
        socketRef.current.emit("edit_message", {
          messageId,
          content: newContent,
          fileUrls,
          userId,
        });
      } catch (error) {
        console.error("❌ [EDIT_MESSAGE] Failed to edit message:", error);
        throw error;
      }
    },
    [userId]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      console.log("🗑️ [DELETE_MESSAGE] Deleting message:", messageId);
      if (!socketRef.current?.connected) {
        throw new Error("Socket not connected");
      }
      try {
        socketRef.current.emit("delete_message", {
          messageId,
          userId,
        });
      } catch (error) {
        console.error("❌ [DELETE_MESSAGE] Failed to delete message:", error);
        throw error;
      }
    },
    [userId]
  );

  const addReaction = useCallback(
    async (messageId: string, reaction: string) => {
      console.log(
        "👍 [ADD_REACTION] Adding reaction to message:",
        messageId,
        reaction
      );
      if (!socketRef.current?.connected) {
        throw new Error("Socket not connected");
      }
      try {
        socketRef.current.emit("add_reaction", {
          messageId,
          reaction,
          userId,
        });
      } catch (error) {
        console.error("❌ [ADD_REACTION] Failed to add reaction:", error);
        throw error;
      }
    },
    [userId]
  );

  const removeReaction = useCallback(
    async (messageId: string, reaction: string) => {
      console.log(
        "👎 [REMOVE_REACTION] Removing reaction from message:",
        messageId,
        reaction
      );
      if (!socketRef.current?.connected) {
        throw new Error("Socket not connected");
      }
      try {
        socketRef.current.emit("remove_reaction", {
          messageId,
          reaction,
          userId,
        });
      } catch (error) {
        console.error("❌ [REMOVE_REACTION] Failed to remove reaction:", error);
        throw error;
      }
    },
    [userId]
  );

  const cancelGeneration = useCallback(() => {
    console.log("🛑 [CANCEL_GENERATION] Cancelling generation");
    if (socketRef.current?.connected) {
      socketRef.current.emit("cancel_generation", { userId });
    }
    setIsGenerating(false);
    setCurrentStep("Cancelled");
    setError(null);
    setStreamingFiles(new Set());
  }, [userId]);

  const clearError = useCallback(() => {
    console.log("🧹 [CLEAR_ERROR] Clearing error state");
    setError(null);
  }, []);

  const resetGenerationState = useCallback(() => {
    console.log("🔄 [RESET_STATE] Resetting all generation state");
    setIsGenerating(false);
    setCurrentStep("");
    setProgress(0);
    setEvents([]);
    setError(null);
    setDeploymentUrl(null);
    setInputValue("");
    setAttachedFiles([]);
    setFileLoadingStates({});
    setIsLoadingProject(false);
    setStreamingFiles(new Set());
  }, []);

  // Chat interface handlers
  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const toggleGeneration = useCallback((id: string) => {
    setGenerations((prev) =>
      prev.map((gen) => {
        if (gen.id === id) {
          if (gen.isCollapsed) {
            return { ...gen, isCollapsed: false };
          } else {
            return { ...gen, isCollapsed: true };
          }
        }
        return gen;
      })
    );
  }, []);

  const retryLoading = useCallback((id: string) => {
    console.log("🔄 Retrying generation:", id);
  }, []);

  const autoResize = useCallback(() => {
    // This will be handled by the component with refs
  }, []);

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
      setTimeout(autoResize, 0);
    },
    [autoResize]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      setTimeout(autoResize, 0);
    },
    [autoResize]
  );

  const handlePaste = useCallback(() => {
    setTimeout(autoResize, 0);
  }, [autoResize]);

  const processFiles = useCallback((files: File[]) => {
    files.forEach((file, index) => {
      const fileKey = `${file.name}-${Date.now()}-${index}`;
      const fileWithKey: FileWithKey = Object.assign(file, { fileKey });
      setFileLoadingStates((prev) => ({ ...prev, [fileKey]: true }));
      setAttachedFiles((prev) => [...prev, fileWithKey]);
      const processingTime = Math.random() * 2000 + 2000;
      setTimeout(() => {
        setFileLoadingStates((prev) => {
          const newState = { ...prev };
          delete newState[fileKey];
          return newState;
        });
      }, processingTime);
    });
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      processFiles(files);
      e.target.value = "";
    },
    [processFiles]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => prev - 1);
      if (dragCounter <= 1) {
        setIsDragOver(false);
      }
    },
    [dragCounter]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      setDragCounter(0);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const scrollToBottom = useCallback(() => {
    // This will be handled by the component with refs
  }, []);

  const clearInput = useCallback(() => {
    setInputValue("");
    setAttachedFiles([]);
    setFileLoadingStates({});
    setTimeout(autoResize, 0);
  }, [autoResize]);

  const removeAttachedFile = useCallback((index: number) => {
    setAttachedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated;
    });
  }, []);

  // Handle generation item click to open dev mode
  const handleGenerationItemClick = useCallback((item: any) => {
    console.log("🖱️ [GENERATION_ITEM_CLICK] Item clicked:", item);
    if (item.filePath) {
      setSelectedDevFile(item.filePath);
      setIsDevModeOpen(true);
      console.log("🚀 [DEV_MODE] Opening dev mode with file:", item.filePath);
    } else {
      console.warn(
        "⚠️ [GENERATION_ITEM_CLICK] No filePath found in item:",
        item
      );
    }
  }, []);

  // Sandbox management functions
  const startSandbox = useCallback(
    async (environment: "local" | "cloud") => {
      if (!socket || !projectInfo?.projectId) return;

      console.log(
        `🏖️ [START_SANDBOX] Starting ${environment} sandbox for project:`,
        projectInfo.projectId
      );

      socket.emit("start_sandbox", {
        projectId: projectInfo.projectId,
        environment,
        userId: projectInfo.userId,
      });
    },
    [socket, projectInfo]
  );

  const stopSandbox = useCallback(async () => {
    if (!socket || !projectInfo?.projectId) return;

    console.log(
      "🛑 [STOP_SANDBOX] Stopping sandbox for project:",
      projectInfo.projectId
    );

    socket.emit("stop_sandbox", {
      projectId: projectInfo.projectId,
      userId: projectInfo.userId,
    });
  }, [socket, projectInfo]);

  const refreshSandbox = useCallback(async () => {
    if (!socket || !projectInfo?.projectId) return;

    console.log(
      "📊 [REFRESH_SANDBOX] Refreshing sandbox status for project:",
      projectInfo.projectId
    );

    socket.emit("get_sandbox_status", {
      projectId: projectInfo.projectId,
      userId: projectInfo.userId,
    });
  }, [socket, projectInfo]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Live mode auto-switching logic
  const prevIsGeneratingRef = useRef(false);
  useEffect(() => {
    if (isGenerating && !prevIsGeneratingRef.current) {
      if (!isLiveMode) {
        console.log(
          "🔄 [LIVE_MODE_AUTO] Generation started, switching to Live Mode."
        );
        setIsLiveMode(true);
      }
    }
    if (!isGenerating && prevIsGeneratingRef.current) {
      if (!isLiveMode) {
        console.log(
          "🔄 [LIVE_MODE_AUTO] Generation ended, switching to Live Mode."
        );
        setIsLiveMode(true);
      }
    }
    prevIsGeneratingRef.current = isGenerating;
  }, [isGenerating, isLiveMode]);

  // Effect to manage all socket event listeners
  useEffect(() => {
    // Use the 'socket' state directly as the dependency
    if (!socket) {
      return;
    }
    console.log(
      "🔗 [SOCKET_LISTENERS] Attaching comprehensive socket listeners..."
    );

    // Project creation event - Immediate redirect
    const handleProjectCreated = (data: any) => {
      console.log("🎉 [PROJECT_CREATED] Project created successfully:", data);
      const { projectId, redirectUrl, projectData } = data;
      try {
        setProjectInfo(projectData);
        setIsGenerating(false);
        setCurrentStep("Project created successfully!");
        setProgress(100);
        setError(null);

        // Immediate redirect to the project
        const navigationUrl = redirectUrl || `/chat/${projectId}`;
        console.log("🔄 [NAVIGATION_IMMEDIATE] Redirecting to:", navigationUrl);

        // Use router.push for immediate navigation
        router.push(navigationUrl);

        // Join the project room immediately
        joinProjectRoom(projectId);
      } catch (error) {
        console.error(
          "❌ [PROJECT_CREATED_ERROR] Failed to process project creation:",
          error
        );
        setError("Project created but failed to process");
      }
    };
    socket.on("project_created", handleProjectCreated);

    // Project details updated event (background processing)
    const handleProjectDetailsUpdated = (data: any) => {
      console.log(
        "📝 [PROJECT_DETAILS_UPDATED] Project details updated:",
        data
      );
      setProjectInfo((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          title: data.title,
          description: data.description,
          projectUsername: data.projectUsername,
        };
      });
      // Removed slug update and URL change - keeping only ID
    };
    socket.on("project_details_updated", handleProjectDetailsUpdated);

    // Project details event
    const handleProjectDetails = (projectData: any) => {
      console.log(
        "📋 [PROJECT_DETAILS] Received project details:",
        projectData
      );
      try {
        // Ensure userId is included in project data
        const projectWithUserId = {
          ...projectData,
          userId: userId || projectData.userId,
        };
        setProjectInfo(projectWithUserId);
        setIsLoadingProject(false);
        setError(null);
        const hasInitialAIMessage = projectData.messages?.some(
          (msg: any) =>
            msg.type === "ai" &&
            msg.generationGroups &&
            msg.generationGroups.length > 0
        );
        const isFirstUserMessageOnly =
          projectData.messages?.length === 1 &&
          projectData.messages[0].type === "user";

        // Check if we have the original prompt from project creation
        const originalPrompt =
          typeof window !== "undefined"
            ? sessionStorage.getItem("originalPrompt")
            : null;
        const originalFiles =
          typeof window !== "undefined"
            ? sessionStorage.getItem("originalFiles")
            : null;

        // Auto-trigger generation for new projects with original prompt
        if (isFirstUserMessageOnly && !hasInitialAIMessage && originalPrompt) {
          console.log(
            "🤖 [AUTO_GENERATION] Auto-starting generation with original prompt from project creation"
          );
          setIsGenerating(true);
          setCurrentStep("Starting AI generation with your original prompt...");
          setProgress(10);
          // Parse original files if they exist
          let fileUrls: string[] = [];
          try {
            fileUrls = originalFiles ? JSON.parse(originalFiles) : [];
          } catch (e) {
            console.warn("Failed to parse original files:", e);
          }
          // Clear session storage after use
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("originalPrompt");
            sessionStorage.removeItem("originalFiles");
          }
          setTimeout(() => {
            // Convert file URLs back to File objects if needed, or pass as URLs
            const filesArray: File[] = []; // We'll pass fileUrls instead
            generateProject(
              originalPrompt,
              filesArray,
              projectData.projectId,
              fileUrls
            );
          }, 500);
        }
        console.log(
          "✅ [PROJECT_DETAILS] Project details processed successfully",
          projectData
        );
      } catch (error) {
        console.error(
          "❌ [PROJECT_DETAILS_ERROR] Failed to process project details:",
          error
        );
        setError("Failed to load project details");
        setIsLoadingProject(false);
      }
    };
    socket.on("project_details", handleProjectDetails);

    // Generation events
    const handleGenerationStarted = (data: any) => {
      console.log("🚀 [GENERATION_STARTED] Generation started:", data);
      setIsGenerating(true);
      setCurrentStep(data.message || "AI generation started...");
      setProgress(data.progress || 10);
      setError(null);
    };
    socket.on("generation_started", handleGenerationStarted);

    const handleGenerationProgress = (data: any) => {
      console.log("📈 [GENERATION_PROGRESS] Generation progress:", data);
      setCurrentStep(data.message || "Processing...");
      setProgress(data.progress || 0);
    };
    socket.on("generation_progress", handleGenerationProgress);

    const handleAITyping = (data: any) => {
      if (data.isTyping) {
        console.log("⌨️ [AI_TYPING] AI started typing");
        setCurrentStep("AI is analyzing and generating...");
      } else {
        console.log("⌨️ [AI_TYPING] AI stopped typing");
      }
    };
    socket.on("ai_typing", handleAITyping);

    // Handle structured AI stream data from streamObject
    const handleAIStreamData = (data: {
      chatId: string;
      messageId: string;
      versionId: string;
      thinking: number;
      analysis: string;
      content: string;
      totalTime: number;
      metadata: any;
      timestamp: number;
    }) => {
      console.log("📊 [AI_STREAM_DATA] Received structured stream data:", data);
      console.log("📊 [AI_STREAM_DATA] Content:", data.content);
      console.log("📊 [AI_STREAM_DATA] Analysis:", data.analysis);
      console.log("📊 [AI_STREAM_DATA] Message ID:", data.messageId);

      // Set AI thinking state to true
      setIsGenerating(true);

      setCurrentStep(data.analysis || "AI is processing...");
      setProgress(Math.min(40 + (data.thinking || 0) / 2, 85));
      setStreamingContent(data.content);
      setStreamingAnalysis(data.analysis);

      // Update the streaming message with structured content
      setProjectInfo((prev) => {
        if (!prev) {
          console.log("📊 [AI_STREAM_DATA] No project info available");
          return null;
        }
        console.log(
          "📊 [AI_STREAM_DATA] Updating project info with stream data"
        );
        console.log(
          "📊 [AI_STREAM_DATA] Current messages count:",
          prev.messages?.length || 0
        );

        const updatedMessages =
          prev.messages?.map((msg) => {
            console.log(
              "📊 [AI_STREAM_DATA] Checking message:",
              msg.id,
              "vs",
              data.messageId
            );
            if (msg.id === data.messageId) {
              console.log(
                "📊 [AI_STREAM_DATA] Found matching message, updating content"
              );
              const updatedMessage = {
                ...msg,
                content: data.content,
                analysis: data.analysis,
                metadata: {
                  ...msg.metadata,
                  thinking: data.thinking,
                  totalTime: data.totalTime,
                  isStreaming: true,
                  lastStreamUpdate: Date.now(),
                },
              };
              console.log(
                "📊 [AI_STREAM_DATA] Updated message content:",
                updatedMessage.content
              );
              return updatedMessage;
            }
            return msg;
          }) || [];

        console.log(
          "📊 [AI_STREAM_DATA] Updated messages count:",
          updatedMessages.length
        );
        const updatedProject = { ...prev, messages: updatedMessages };
        console.log("📊 [AI_STREAM_DATA] Project updated successfully");
        return updatedProject;
      });
    };
    socket.on("ai_stream_data", handleAIStreamData);

    // Handle real-time thinking updates from NDJSON streaming
    const handleAIThinkingUpdate = (data: {
      chatId: string;
      messageId: string;
      versionId: string;
      content: string;
      progress: number;
      timestamp: number;
    }) => {
      console.log(
        "🧠 [AI_THINKING_UPDATE] Real-time thinking update:",
        data.content
      );
      console.log("🧠 [AI_THINKING_UPDATE] Full data:", data);

      // Set AI thinking state to true
      setIsGenerating(true);

      // Update current step with thinking content
      setCurrentStep(data.content);
      setProgress(Math.min(20 + (data.progress || 0) / 2, 40));

      // Add thinking content to streaming content
      setStreamingContent((prev) => prev + "\n" + data.content);

      // Update the streaming message with thinking content
      setProjectInfo((prev) => {
        if (!prev) return null;
        console.log(
          "🧠 [AI_THINKING_UPDATE] Updating project info with thinking content"
        );
        const updatedMessages =
          prev.messages?.map((msg) => {
            if (msg.id === data.messageId) {
              console.log(
                "🧠 [AI_THINKING_UPDATE] Found matching message, updating content"
              );
              return {
                ...msg,
                content: (msg.content || "") + "\n" + data.content,
                analysis: data.content,
                metadata: {
                  ...msg.metadata,
                  isStreaming: true,
                  lastStreamUpdate: Date.now(),
                  thinkingProgress: data.progress,
                },
              };
            }
            return msg;
          }) || [];
        console.log(
          "🧠 [AI_THINKING_UPDATE] Updated messages count:",
          updatedMessages.length
        );
        return { ...prev, messages: updatedMessages };
      });
    };
    socket.on("ai_thinking_update", handleAIThinkingUpdate);

    // Handle container status updates
    const handleContainerStatusUpdate = (data: {
      taskArn: string;
      projectId: string;
      versionId: string;
      status: "PROVISIONING" | "PENDING" | "RUNNING" | "STOPPED" | "FAILED";
      containers: Array<{
        name: string;
        status: string;
        reason?: string;
        exitCode?: number;
      }>;
      publicUrl?: string;
      createdAt: Date;
      lastUpdated: Date;
      metadata?: Record<string, any>;
    }) => {
      console.log(
        "🐳 [CONTAINER_STATUS] Container status update:",
        data.status,
        data.taskArn
      );

      // Update current step with container status
      const statusMessages = {
        PROVISIONING: "Creating container...",
        PENDING: "Starting container...",
        RUNNING: "Container is running",
        STOPPED: "Container stopped",
        FAILED: "Container failed to start",
      };

      setCurrentStep(
        statusMessages[data.status] || "Container status: " + data.status
      );

      // Update progress based on container status
      const progressMap = {
        PROVISIONING: 60,
        PENDING: 75,
        RUNNING: 90,
        STOPPED: 100,
        FAILED: 100,
      };

      setProgress(progressMap[data.status] || 60);

      // Update project info with container status
      setProjectInfo((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          containerStatus: {
            taskArn: data.taskArn,
            status: data.status,
            publicUrl: data.publicUrl,
            lastUpdated: data.lastUpdated,
            metadata: data.metadata,
          },
        };
      });
    };
    socket.on("container_status_update", handleContainerStatusUpdate);

    // Handle container events
    const handleContainerEvent = (data: {
      type: "created" | "started" | "running" | "stopped" | "failed";
      taskArn: string;
      projectId: string;
      versionId: string;
      status: string;
      timestamp: Date;
      metadata?: Record<string, any>;
    }) => {
      console.log(
        "🐳 [CONTAINER_EVENT] Container event:",
        data.type,
        data.taskArn
      );

      // Show notification for important events
      if (data.type === "running") {
        console.log("🎉 [CONTAINER_READY] Container is ready for use!");
        setCurrentStep(
          "Container is ready! You can now interact with your application."
        );
      } else if (data.type === "failed") {
        console.error("❌ [CONTAINER_FAILED] Container failed to start");
        setCurrentStep("Container failed to start. Please try again.");
      }
    };
    socket.on("container_event", handleContainerEvent);

    // Handle structured file generation updates from streamObject
    const handleFileGenerationUpdate = (data: {
      chatId: string;
      filePath: string;
      content: string;
      action: string;
      fileName: string;
      language?: string;
      status: string;
      groupId: string;
      groupTitle: string;
      timestamp: number;
    }) => {
      console.log(
        "📁 [FILE_GENERATION_UPDATE] Structured file generation update:",
        data.filePath
      );

      // Add file to streaming files set
      setStreamingFiles((prev) => new Set(prev).add(data.filePath));
      setCurrentStep(`Generating ${data.fileName}...`);
      setProgress((prev) => Math.min(prev + 1, 85));

      // Update the complete codebase in real-time
      setCompleteCodebase((prev: any) => {
        if (!prev) return prev;
        const updatedFiles = {
          ...prev.files,
          [data.filePath]: data.content,
        };
        return {
          ...prev,
          files: updatedFiles,
          totalFiles: Object.keys(updatedFiles).length,
          lastUpdated: new Date(),
        };
      });

      // Update project info with real-time file changes
      setProjectInfo((prev) => {
        if (!prev) return null;
        const updatedVersions =
          prev.versions?.map((version: any) => {
            if (version.isCurrent || version.id === prev.activeVersionId) {
              const updatedFileTree = updateFileTreeWithNewContent(
                version.fileTree || [],
                data.filePath,
                data.content
              );
              return {
                ...version,
                fileTree: updatedFileTree,
                lastModified: new Date(),
              };
            }
            return version;
          }) || [];
        return {
          ...prev,
          versions: updatedVersions,
        };
      });
    };
    socket.on("file_generation_update", handleFileGenerationUpdate);

    // Handle structured generation group updates from streamObject
    const handleAIGenerationGroupUpdate = (data: {
      chatId: string;
      messageId: string;
      versionId: string;
      groupId: string;
      groupTitle: string;
      file: {
        id: string;
        name: string;
        filePath: string;
        content: string;
        language?: string;
        status: string;
        action: string;
      };
      timestamp: number;
    }) => {
      console.log(
        "📁 [AI_GENERATION_GROUP_UPDATE] Structured generation group update:",
        data.file.name
      );
      console.log("📁 [AI_GENERATION_GROUP_UPDATE] Full data:", data);
      console.log(
        "📁 [AI_GENERATION_GROUP_UPDATE] File path:",
        data.file.filePath
      );
      console.log(
        "📁 [AI_GENERATION_GROUP_UPDATE] File content length:",
        data.file.content?.length || 0
      );

      // Set AI thinking state to true
      setIsGenerating(true);

      setCurrentStep(`Generating ${data.file.name}...`);
      setProgress((prev) => Math.min(prev + 1, 85));

      // Update the complete codebase in real-time
      setCompleteCodebase((prev: any) => {
        if (!prev) {
          console.log(
            "📁 [AI_GENERATION_GROUP_UPDATE] No complete codebase available"
          );
          return prev;
        }
        console.log(
          "📁 [AI_GENERATION_GROUP_UPDATE] Updating complete codebase"
        );
        const updatedFiles = {
          ...prev.files,
          [data.file.filePath]: data.file.content,
        };
        const updatedCodebase = {
          ...prev,
          files: updatedFiles,
          totalFiles: Object.keys(updatedFiles).length,
          lastUpdated: new Date(),
        };
        console.log(
          "📁 [AI_GENERATION_GROUP_UPDATE] Updated codebase files count:",
          updatedCodebase.totalFiles
        );
        return updatedCodebase;
      });

      // Update project info with real-time file changes
      setProjectInfo((prev) => {
        if (!prev) {
          console.log(
            "📁 [AI_GENERATION_GROUP_UPDATE] No project info available"
          );
          return null;
        }
        console.log(
          "📁 [AI_GENERATION_GROUP_UPDATE] Updating project info with file changes"
        );
        console.log(
          "📁 [AI_GENERATION_GROUP_UPDATE] Current versions count:",
          prev.versions?.length || 0
        );

        // Update versions with file tree changes
        const updatedVersions =
          prev.versions?.map((version: any) => {
            if (version.isCurrent || version.id === prev.activeVersionId) {
              console.log(
                "📁 [AI_GENERATION_GROUP_UPDATE] Updating version:",
                version.id
              );
              const updatedFileTree = updateFileTreeWithNewContent(
                version.fileTree || [],
                data.file.filePath,
                data.file.content
              );
              const updatedVersion = {
                ...version,
                fileTree: updatedFileTree,
                lastModified: new Date(),
              };
              console.log(
                "📁 [AI_GENERATION_GROUP_UPDATE] Updated version file tree count:",
                updatedFileTree.length
              );
              return updatedVersion;
            }
            return version;
          }) || [];

        // Update messages with generation group changes
        const updatedMessages =
          prev.messages?.map((msg) => {
            if (msg.id === data.messageId) {
              console.log(
                "📁 [AI_GENERATION_GROUP_UPDATE] Updating message generation groups"
              );

              // Find or create the generation group
              let generationGroups = msg.generationGroups || [];
              let targetGroup = generationGroups.find(
                (g: any) => g.id === data.groupId
              );

              if (!targetGroup) {
                // Create new generation group
                targetGroup = {
                  id: data.groupId,
                  title: data.groupTitle || "Version 1",
                  timestamp: new Date(),
                  isLatest: true,
                  isViewing: false,
                  isCollapsed: false,
                  items: [],
                  feedback: [],
                  feedbackSummary: {
                    totalFeedback: 0,
                    likes: 0,
                    dislikes: 0,
                    helpful: 0,
                    notHelpful: 0,
                    score: 0,
                    categories: {},
                    lastUpdated: new Date(),
                  },
                };
                generationGroups.push(targetGroup);
              }

              // Add or update the file item
              const existingItemIndex = targetGroup.items.findIndex(
                (item: any) => item.id === data.file.id
              );
              const fileItem = {
                id: data.file.id,
                name: data.file.name,
                type: "file",
                filePath: data.file.filePath,
                language: data.file.language,
                status: data.file.status,
                content: data.file.content,
                timestamp: new Date(),
              };

              if (existingItemIndex >= 0) {
                targetGroup.items[existingItemIndex] = fileItem;
              } else {
                targetGroup.items.push(fileItem);
              }

              console.log(
                "📁 [AI_GENERATION_GROUP_UPDATE] Updated generation group with",
                targetGroup.items.length,
                "items"
              );

              return {
                ...msg,
                generationGroups: generationGroups,
              };
            }
            return msg;
          }) || [];

        console.log(
          "📁 [AI_GENERATION_GROUP_UPDATE] Updated versions count:",
          updatedVersions.length
        );
        const updatedProject = {
          ...prev,
          versions: updatedVersions,
          messages: updatedMessages,
        };
        console.log(
          "📁 [AI_GENERATION_GROUP_UPDATE] Project updated successfully"
        );
        return updatedProject;
      });
    };
    socket.on("ai_generation_group_update", handleAIGenerationGroupUpdate);

    // AI message start to set the streaming message ID
    const handleAIMessageStarted = (data: {
      messageId: string;
      chatId: string;
      versionId: string;
      timestamp: number;
    }) => {
      console.log(
        "💬 [AI_MESSAGE_STARTED] AI message placeholder received:",
        data.messageId
      );
      console.log("💬 [AI_MESSAGE_STARTED] Full data:", data);

      // Set AI thinking state to true
      setIsGenerating(true);

      streamMessageIdRef.current = data.messageId;
      latestStreamContent.current = "";
      // Clear previous streaming content
      setStreamingContent("");
      setStreamingAnalysis("");

      setProjectInfo((prev) => {
        if (!prev) {
          console.log("💬 [AI_MESSAGE_STARTED] No project info available");
          return null;
        }
        console.log("💬 [AI_MESSAGE_STARTED] Creating AI message placeholder");
        console.log(
          "💬 [AI_MESSAGE_STARTED] Current messages count:",
          prev.messages?.length || 0
        );

        const newMessages = [...(prev.messages || [])];
        if (!newMessages.some((msg) => msg.id === data.messageId)) {
          const aiMessage = {
            id: data.messageId,
            type: "ai",
            content: "AI is thinking...",
            analysis: "Starting AI generation...",
            status: "sending",
            timestamp: new Date(data.timestamp),
            fileAttachments: [],
            reactions: [],
            generationGroups: [],
            versionId: data.versionId,
            metadata: { isStreaming: true },
          };
          newMessages.push(aiMessage);
          console.log(
            "💬 [AI_MESSAGE_STARTED] Added AI message placeholder:",
            aiMessage
          );
        } else {
          console.log("💬 [AI_MESSAGE_STARTED] AI message already exists");
        }

        console.log(
          "💬 [AI_MESSAGE_STARTED] Final messages count:",
          newMessages.length
        );
        return { ...prev, messages: newMessages };
      });
    };
    socket.on("ai_message_started", handleAIMessageStarted);

    // AI streaming chunk for structured content
    const handleAIStreamChunk = (data: {
      chatId: string;
      messageId: string;
      versionId: string;
      chunk: string;
      fullText: string;
      isComplete: boolean;
      timestamp: number;
    }) => {
      console.log("📡 [AI_STREAM_CHUNK] Received stream chunk:", data.chunk);
      console.log("📡 [AI_STREAM_CHUNK] Full data:", data);
      console.log("📡 [AI_STREAM_CHUNK] Message ID:", data.messageId);
      console.log("📡 [AI_STREAM_CHUNK] Is complete:", data.isComplete);

      if (!streamMessageIdRef.current) {
        console.warn("⚠️ [AI_STREAM] No active stream message ID");
        return;
      }

      // Set AI thinking state to true
      setIsGenerating(true);

      // Update streaming content
      setStreamingContent(data.fullText);

      // Update message with structured content
      setProjectInfo((prev) => {
        if (!prev) {
          console.log("📡 [AI_STREAM_CHUNK] No project info available");
          return null;
        }
        console.log(
          "📡 [AI_STREAM_CHUNK] Updating project info with stream chunk"
        );
        console.log(
          "📡 [AI_STREAM_CHUNK] Current messages count:",
          prev.messages?.length || 0
        );

        const updatedMessages =
          prev.messages?.map((msg) => {
            console.log(
              "📡 [AI_STREAM_CHUNK] Checking message:",
              msg.id,
              "vs",
              data.messageId
            );
            if (msg.id === data.messageId) {
              console.log(
                "📡 [AI_STREAM_CHUNK] Found matching message, updating content"
              );
              const updatedMessage = {
                ...msg,
                content: data.fullText,
                status: data.isComplete ? "sent" : "sending",
                metadata: {
                  ...msg.metadata,
                  isStreaming: !data.isComplete,
                  lastStreamUpdate: Date.now(),
                },
              };
              console.log(
                "📡 [AI_STREAM_CHUNK] Updated message content:",
                updatedMessage.content
              );
              return updatedMessage;
            }
            return msg;
          }) || [];

        console.log(
          "📡 [AI_STREAM_CHUNK] Updated messages count:",
          updatedMessages.length
        );
        const updatedProject = { ...prev, messages: updatedMessages };
        console.log("📡 [AI_STREAM_CHUNK] Project updated successfully");
        return updatedProject;
      });

      if (data.isComplete) {
        console.log("📡 [AI_STREAM_CHUNK] Stream complete, clearing state");
        streamMessageIdRef.current = null;
        setStreamingContent("");
        setStreamingAnalysis("");
        setIsGenerating(false);
      } else {
        setProgress((prev) => Math.min(prev + 0.5, 85));
      }
    };
    socket.on("ai_stream_chunk", handleAIStreamChunk);

    // Generation complete with comprehensive version information
    const handleGenerationComplete = (data: any) => {
      console.log(
        "✅ [GENERATION_COMPLETE] Comprehensive generation complete:",
        data
      );
      setIsGenerating(false);
      setCurrentStep("Generation complete!");
      setProgress(100);
      // Clear all streaming files and content
      setStreamingFiles(new Set());
      setStreamingContent("");
      setStreamingAnalysis("");
      if (streamUpdateTimeout.current) {
        clearTimeout(streamUpdateTimeout.current);
        streamUpdateTimeout.current = null;
      }

      // Update project info with comprehensive data
      setProjectInfo((prev) => {
        if (!prev) return null;

        const updatedMessages =
          prev.messages?.map((msg) => {
            if (msg.id === data.messageId) {
              console.log(
                "✅ [GENERATION_COMPLETE] Updating final message with generation groups"
              );
              return {
                ...msg,
                content: data.content || msg.content,
                analysis: data.analysis || msg.analysis,
                status: "sent",
                generationGroups: data.generationGroups || [],
                versionId: data.versionId,
                metadata: {
                  ...msg.metadata,
                  analysis: data.analysis,
                  totalTime: data.totalTime,
                  thinking: data.thinking,
                  enhancedPrompt: data.enhancedPrompt,
                  originalPrompt: data.originalPrompt,
                  ...data.metadata,
                  isStreaming: false,
                },
              };
            }
            return msg;
          }) || [];

        const updatedProject = {
          ...prev,
          messages: updatedMessages,
          activeVersionId: data.activeVersionId,
        };

        console.log(
          "✅ [GENERATION_COMPLETE] Project updated with final message"
        );
        return updatedProject;
      });

      // Set the complete codebase
      if (data.completeCodebase) {
        setCompleteCodebase(data.completeCodebase);
      } else {
        // If no complete codebase provided, generate it from the current version
        const currentVersion = projectInfo?.versions?.find(
          (v: any) => v.isCurrent
        );
        if (currentVersion?.fileTree) {
          const codebase = generateCodebaseFromFileTree(
            currentVersion.fileTree
          );
          setCompleteCodebase(codebase);
          console.log(
            "📁 [GENERATION_COMPLETE] Generated codebase from file tree:",
            codebase.totalFiles,
            "files"
          );
        }
      }
      if (data.deploymentUrl) {
        setDeploymentUrl(data.deploymentUrl);
      }
      streamMessageIdRef.current = null;
      latestStreamContent.current = "";

      // Reset force preview mode after generation completes
      setForcePreviewModeDuringGeneration(false);

      // Automatically start sandbox after generation is complete
      if (projectInfo?.projectId) {
        console.log(
          "🏖️ [AUTO_SANDBOX] Starting sandbox automatically after generation"
        );
        setTimeout(() => {
          startSandbox("local");
        }, 1000); // Small delay to ensure generation is fully complete
      }
    };
    socket.on("generation_complete", handleGenerationComplete);

    // Generation error handling
    const handleGenerationError = (data: any) => {
      console.error("❌ [GENERATION_ERROR] Generation error:", data);
      setIsGenerating(false);
      setError(data.message || "Generation failed");
      setCurrentStep("Error occurred");
      setProgress(0);
      // Reset force preview mode on error
      setForcePreviewModeDuringGeneration(false);
      // Clear streaming files on error
      setStreamingFiles(new Set());
      if (streamUpdateTimeout.current) {
        clearTimeout(streamUpdateTimeout.current);
        streamUpdateTimeout.current = null;
      }
      if (streamMessageIdRef.current) {
        setProjectInfo((prev) => {
          if (!prev) return null;
          const updatedMessages =
            prev.messages?.map((msg) => {
              if (msg.id === streamMessageIdRef.current) {
                return {
                  ...msg,
                  content:
                    msg.content +
                    "\n\n**Error:** " +
                    (data.message || "Generation failed."),
                  status: "failed",
                  metadata: {
                    ...msg.metadata,
                    isStreaming: false,
                    error: data.error,
                  },
                };
              }
              return msg;
            }) || [];
          return { ...prev, messages: updatedMessages };
        });
      }
      streamMessageIdRef.current = null;
      latestStreamContent.current = "";
    };
    socket.on("generation_error", handleGenerationError);

    // Message events
    const handleNewMessage = (messageData: any) => {
      console.log("💬 [NEW_MESSAGE] New message received:", messageData);
      setProjectInfo((prev) => {
        if (!prev) return null;

        // Check if we have a temporary message that should be replaced
        const existingMessages = prev.messages || [];
        const tempMessageIndex = existingMessages.findIndex(
          (msg) => msg.id.startsWith("temp_") && msg.type === "user"
        );

        if (tempMessageIndex !== -1) {
          // Replace the temporary message with the real one
          const updatedMessages = [...existingMessages];
          updatedMessages[tempMessageIndex] = {
            ...messageData,
            status: "sent", // Ensure status is sent
          };
          return { ...prev, messages: updatedMessages };
        } else {
          // Add as new message if no temporary message found
          return { ...prev, messages: [...existingMessages, messageData] };
        }
      });
    };
    socket.on("new_message", handleNewMessage);

    const handleMessageUpdated = (messageData: any) => {
      console.log("✏️ [MESSAGE_UPDATED] Message updated:", messageData);
      setProjectInfo((prev) =>
        prev
          ? {
              ...prev,
              messages:
                prev.messages?.map((msg) =>
                  msg.id === messageData.id ? messageData : msg
                ) || [],
            }
          : null
      );
    };
    socket.on("message_updated", handleMessageUpdated);

    const handleMessageDeleted = (data: any) => {
      console.log("🗑️ [MESSAGE_DELETED] Message deleted:", data);
      setProjectInfo((prev) =>
        prev
          ? {
              ...prev,
              messages:
                prev.messages?.filter((msg) => msg.id !== data.messageId) || [],
            }
          : null
      );
    };
    socket.on("message_deleted", handleMessageDeleted);

    // Version events with comprehensive file tree handling
    const handleVersionCreated = (data: any) => {
      console.log("📦 [VERSION_CREATED] New version created:", data);
      setProjectInfo((prev) => {
        if (!prev) return null;
        const updatedVersions = [...(prev.versions || []), data.version];
        return {
          ...prev,
          versions: updatedVersions,
          activeVersionId: data.version.id,
        };
      });
      // If this version has a file tree, update the complete codebase immediately
      if (data.version.fileTree) {
        const codebase = generateCodebaseFromFileTree(data.version.fileTree);
        setCompleteCodebase(codebase);
      }
    };
    socket.on("version_created", handleVersionCreated);

    const handleVersionSwitched = (data: any) => {
      console.log("🔄 [VERSION_SWITCHED] Version switched:", data);
      setProjectInfo((prev) =>
        prev
          ? {
              ...prev,
              activeVersionId: data.activeVersionId,
            }
          : null
      );
      // Update complete codebase
      if (data.completeCodebase) {
        setCompleteCodebase(data.completeCodebase);
      }
    };
    socket.on("version_switched", handleVersionSwitched);

    // Handle file tree updates
    const handleFileTreeUpdated = (data: {
      projectId: string;
      versionId: string;
      fileTree: any[];
      newFile: {
        id: string;
        name: string;
        path: string;
        content: string;
        language: string;
      };
    }) => {
      console.log(
        "📁 [FILE_TREE_UPDATED] File tree updated:",
        data.newFile.path
      );

      setProjectInfo((prev) => {
        if (!prev) return null;

        const updatedVersions =
          prev.versions?.map((version: any) => {
            if (version.id === data.versionId) {
              console.log("📁 [FILE_TREE_UPDATED] Updating version file tree");
              return {
                ...version,
                fileTree: data.fileTree,
                lastModified: new Date(),
              };
            }
            return version;
          }) || [];

        const updatedProject = {
          ...prev,
          versions: updatedVersions,
        };

        console.log(
          "📁 [FILE_TREE_UPDATED] Project updated with new file tree"
        );
        return updatedProject;
      });
    };
    socket.on("file_tree_updated", handleFileTreeUpdated);

    // General error handling
    const handleError = (error: any) => {
      console.error("❌ [SOCKET_ERROR] Socket error:", error);
      setError(error.message || "An error occurred");
      setIsGenerating(false);
      setIsLoadingProject(false);
    };
    socket.on("error", handleError);

    // Handle sandbox ready events
    const handleSandboxReady = (data: {
      projectId: string;
      versionId: string;
      sandboxUrl: string;
      taskArn: string;
    }) => {
      console.log("🏖️ [SANDBOX_READY] Sandbox is ready:", data.sandboxUrl);

      setProjectInfo((prev) => {
        if (!prev) return null;

        const updatedProject = {
          ...prev,
          sandboxUrl: data.sandboxUrl,
          containerStatus: {
            taskArn: data.taskArn,
            status: "RUNNING" as const,
            publicUrl: data.sandboxUrl,
            lastUpdated: new Date(),
          },
        };

        console.log("🏖️ [SANDBOX_READY] Project updated with sandbox URL");
        return updatedProject;
      });
    };
    socket.on("sandbox_ready", handleSandboxReady);

    // Handle sandbox unavailable events
    const handleSandboxUnavailable = (data: {
      projectId: string;
      versionId: string;
      reason: string;
    }) => {
      console.log(
        "⚠️ [SANDBOX_UNAVAILABLE] Sandbox not available:",
        data.reason
      );

      // Show a notification to the user
      setProjectInfo((prev) => {
        if (!prev) return null;

        const updatedProject = {
          ...prev,
          sandboxUrl: undefined,
          containerStatus: {
            taskArn: "",
            status: "FAILED" as const,
            publicUrl: undefined,
            lastUpdated: new Date(),
            metadata: {
              error: data.reason,
              unavailable: true,
            },
          },
        };

        console.log(
          "⚠️ [SANDBOX_UNAVAILABLE] Project updated with unavailable status"
        );
        return updatedProject;
      });
    };
    socket.on("sandbox_unavailable", handleSandboxUnavailable);

    // Handle analysis complete events
    const handleAnalysisComplete = (data: {
      chatId: string;
      messageId: string;
      versionId: string;
      analysis: string;
      timestamp: number;
    }) => {
      console.log("🧠 [ANALYSIS_COMPLETE] Analysis completed:", data.analysis);

      setProjectInfo((prev) => {
        if (!prev) return null;

        const updatedMessages =
          prev.messages?.map((msg) => {
            if (msg.id === data.messageId) {
              return {
                ...msg,
                analysis: data.analysis,
                content: data.analysis, // Set content to analysis for display
                metadata: {
                  ...msg.metadata,
                  analysisComplete: true,
                  lastUpdate: Date.now(),
                },
              };
            }
            return msg;
          }) || [];

        return {
          ...prev,
          messages: updatedMessages,
        };
      });
    };
    socket.on("analysis_complete", handleAnalysisComplete);

    // Handle summary streaming chunks
    const handleSummaryStreamChunk = (data: {
      chatId: string;
      messageId: string;
      versionId: string;
      chunk: string;
      fullText: string;
      isComplete: boolean;
      timestamp: number;
    }) => {
      console.log("📝 [SUMMARY_STREAM_CHUNK] Summary chunk:", data.chunk);

      setProjectInfo((prev) => {
        if (!prev) return null;

        const updatedMessages =
          prev.messages?.map((msg) => {
            if (msg.id === data.messageId) {
              return {
                ...msg,
                content: data.fullText,
                metadata: {
                  ...msg.metadata,
                  isSummaryStreaming: true,
                  lastUpdate: Date.now(),
                },
              };
            }
            return msg;
          }) || [];

        return {
          ...prev,
          messages: updatedMessages,
        };
      });
    };
    socket.on("summary_stream_chunk", handleSummaryStreamChunk);

    // Handle summary complete events
    const handleSummaryComplete = (data: {
      chatId: string;
      messageId: string;
      versionId: string;
      summary: string;
      timestamp: number;
    }) => {
      console.log("📝 [SUMMARY_COMPLETE] Summary completed:", data.summary);

      setProjectInfo((prev) => {
        if (!prev) return null;

        const updatedMessages =
          prev.messages?.map((msg) => {
            if (msg.id === data.messageId) {
              return {
                ...msg,
                content: data.summary,
                metadata: {
                  ...msg.metadata,
                  summaryComplete: true,
                  isSummaryStreaming: false,
                  lastUpdate: Date.now(),
                },
              };
            }
            return msg;
          }) || [];

        return {
          ...prev,
          messages: updatedMessages,
        };
      });
    };
    socket.on("summary_complete", handleSummaryComplete);

    // Cleanup function
    return () => {
      console.log("🧹 [SOCKET_LISTENERS] Cleaning up socket listeners...");
      socket.off("project_created", handleProjectCreated);
      socket.off("project_details", handleProjectDetails);
      socket.off("generation_started", handleGenerationStarted);
      socket.off("generation_progress", handleGenerationProgress);
      socket.off("ai_typing", handleAITyping);
      socket.off("ai_stream_data", handleAIStreamData);
      socket.off("ai_thinking_update", handleAIThinkingUpdate);
      socket.off("container_status_update", handleContainerStatusUpdate);
      socket.off("container_event", handleContainerEvent);
      socket.off("file_generation_update", handleFileGenerationUpdate);
      socket.off("ai_generation_group_update", handleAIGenerationGroupUpdate);
      socket.off("ai_message_started", handleAIMessageStarted);
      socket.off("ai_stream_chunk", handleAIStreamChunk);
      socket.off("generation_complete", handleGenerationComplete);
      socket.off("generation_error", handleGenerationError);
      socket.off("new_message", handleNewMessage);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("version_created", handleVersionCreated);
      socket.off("version_switched", handleVersionSwitched);
      socket.off("file_tree_updated", handleFileTreeUpdated);
      socket.off("error", handleError);
      socket.off("sandbox_ready", handleSandboxReady);
      socket.off("sandbox_unavailable", handleSandboxUnavailable);
      socket.off("analysis_complete", handleAnalysisComplete);
      socket.off("summary_stream_chunk", handleSummaryStreamChunk);
      socket.off("summary_complete", handleSummaryComplete);
    };
  }, [socket, router, generateProject]); // Socket event listeners

  // Helper function to generate codebase from file tree
  const generateCodebaseFromFileTree = (fileTree: any[]): any => {
    const files: Record<string, string> = {};
    const extractFiles = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.type === "file" && node.content) {
          files[node.path] = node.content;
        }
        if (node.type === "folder" && node.children) {
          extractFiles(node.children);
        }
      }
    };
    extractFiles(fileTree);
    return {
      files,
      fileTree,
      totalFiles: Object.keys(files).length,
      lastUpdated: new Date(),
      deploymentReady: true,
      structure: {
        folders: [],
        fileTypes: {},
        totalSize: Object.values(files).reduce(
          (sum, content) => sum + content.length,
          0
        ),
      },
    };
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value: ProjectContextType = useMemo(
    () => ({
      isLiveMode,
      isMobile,
      isDrawerOpen,
      forcePreviewModeDuringGeneration, // <-- Add missing required property
      setLiveMode: setIsLiveMode,
      setDrawerOpen: setIsDrawerOpen,
      toggleDrawer,
      generations,
      setGenerations,
      toggleGeneration,
      retryLoading,
      userAvatar,
      userName,
      isUserPopoverOpen,
      setIsUserPopoverOpen,
      selectedTheme,
      setSelectedTheme,
      isVisibilityDialogOpen,
      setIsVisibilityDialogOpen,
      chatVisibility,
      setChatVisibility,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      setIsMobile,
      inputValue,
      setInputValue,
      attachedFiles,
      setAttachedFiles,
      fileLoadingStates,
      setFileLoadingStates,
      isDragOver,
      setIsDragOver,
      dragCounter,
      setDragCounter,
      showScrollButton,
      setShowScrollButton,
      streamingFiles,
      streamingContent,
      streamingAnalysis,
      handleInput,
      handleKeyDown,
      handlePaste,
      processFiles,
      handleFileSelect,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      scrollToBottom,
      autoResize,
      clearInput,
      isGenerating,
      isConnected,
      currentStep,
      progress,
      events,
      projectInfo,
      error,
      deploymentUrl,
      createProject,
      generateProject,
      cancelGeneration,
      clearError,
      resetGenerationState,
      removeAttachedFile,
      setProjectInfo,
      // Socket actions
      initializeSocket,
      joinProjectRoom,
      leaveProjectRoom,
      disconnectSocket,
      initializeChatSession,
      fetchProjectDetails,
      currentProjectRoom,
      socket,
      isLoadingProject,
      // Message actions
      sendMessage,
      editMessage,
      deleteMessage,
      addReaction,
      removeReaction,
      completeCodebase,
      // Dev mode actions
      isDevModeOpen,
      setIsDevModeOpen,
      selectedDevFile,
      setSelectedDevFile,
      handleGenerationItemClick,
    }),
    [
      isLiveMode,
      isMobile,
      isDrawerOpen,
      generations,
      userAvatar,
      userName,
      isUserPopoverOpen,
      selectedTheme,
      isVisibilityDialogOpen,
      chatVisibility,
      isMobileMenuOpen,
      inputValue,
      attachedFiles,
      fileLoadingStates,
      isDragOver,
      dragCounter,
      showScrollButton,
      streamingFiles,
      streamingContent,
      streamingAnalysis,
      isGenerating,
      isConnected,
      currentStep,
      progress,
      events,
      projectInfo,
      error,
      deploymentUrl,
      isLoadingProject,
      completeCodebase,
      isDevModeOpen,
      selectedDevFile,
      setIsLiveMode,
      setIsDrawerOpen,
      toggleDrawer,
      setGenerations,
      toggleGeneration,
      retryLoading,
      setIsUserPopoverOpen,
      setSelectedTheme,
      setIsVisibilityDialogOpen,
      setChatVisibility,
      setIsMobileMenuOpen,
      setIsMobile,
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
      scrollToBottom,
      autoResize,
      clearInput,
      removeAttachedFile,
      createProject,
      generateProject,
      cancelGeneration,
      clearError,
      resetGenerationState,
      setProjectInfo,
      initializeSocket,
      joinProjectRoom,
      leaveProjectRoom,
      disconnectSocket,
      initializeChatSession,
      fetchProjectDetails,
      currentProjectRoom,
      socket,
      sendMessage,
      editMessage,
      deleteMessage,
      addReaction,
      removeReaction,
      setIsDevModeOpen,
      setSelectedDevFile,
      handleGenerationItemClick,
      forcePreviewModeDuringGeneration,
    ]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}
