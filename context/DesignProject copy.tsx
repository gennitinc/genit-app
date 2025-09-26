import React, { createContext, useContext, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "./AuthenticatedContext";
import { apiResponse } from "@/utils/apiResponse";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { demoMessages } from "../components/chat/dummyMessage";

// ====== ENUMS ======
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export enum GenerationStatus {
  PENDING = "pending",
  GENERATING = "generating",
  GENERATED = "generated",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum ProjectStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
  DELETED = "deleted",
}

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

// ====== INTERFACES ======
export interface IMessagePart {
  type: "text" | "media";
  text?: string;
  url?: string;
  mediaType?: MediaType;
}

export interface IFeedback {
  id: string;
  userId?: string;
  userName?: string;
  type: "like" | "dislike" | "comment";
  comment?: string;
  timestamp: Date;
}

export interface IGenerationItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  status: GenerationStatus;
  text?: string;
}

export interface IGenerationGroup {
  id: string;
  title: string;
  timestamp: Date;
  isLatest: boolean;
  isViewing: boolean;
  isCollapsed: boolean;
  items: IGenerationItem[];
}

export interface IMessage {
  id: string;
  role: MessageRole;
  type: "user" | "ai";
  text: string;
  analysis?: string;
  totalTime?: number;
  versionId?: string;
  metadata?: Record<string, any>;
  parts: IMessagePart[];
  generationGroups?: IGenerationGroup[];
  createdAt: Date;
}

export interface IProjectAnalytics {
  totalMessages: number;
  totalGenerations: number;
  totalFeedback: number;
  likes: number;
  dislikes: number;
  views: number;
}

export interface ICollaborator {
  userId: string;
  userName: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: Date;
  lastActiveAt?: Date;
}

export interface IDesignProject {
  _id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  userId: string;
  userName: string;
  collaborators: ICollaborator[];
  messages: IMessage[];
  analytics: IProjectAnalytics;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ====== CONTEXT TYPES ======
interface IProjectDesignContext {
  project: IDesignProject | null;
  setProject: React.Dispatch<React.SetStateAction<IDesignProject | null>>;

  generations: any[];
  setGenerations: React.Dispatch<React.SetStateAction<any[]>>;

  isGenerating: boolean;
  isLoadingProject: boolean;
  clearError: () => void;
  resetGenerationState: () => void;
  createProject: (
    value: string,
    attachedFile?: any
  ) => Promise<{ type: boolean; message: string; id?: string }>;
  fetchProject: (projectId: string) => Promise<{
    success: boolean;
    error?: "not_found" | "unauthorized" | "server_error";
  }>;

  toggleGeneration: (id: string) => void;
  retryLoading: (id: string) => void;
  handleLocalStorageDraft: () => void;
  editMessage: (
    messageId: string,
    updatedContent: string,
    files: File[] | null,
    projectId: string
  ) => Promise<void>;
  deleteMessage: (messageId: string) => void;
  addReaction: (
    messageId: string,
    type: "like" | "dislike" | "comment"
  ) => void;
  removeReaction: (
    messageId: string,
    type: "like" | "dislike" | "comment"
  ) => void;
  handleGenerationItemClick: (generationId: string) => void;

  generateMessage: (
    messageContent: string,
    files: File[] | null,
    projectId: string
  ) => Promise<void>;

  // UI states
  isLiveMode: boolean;
  isMobile: boolean;
  isDrawerOpen: boolean;

  userAvatar: string;
  userName: string;

  isUserPopoverOpen: boolean;
  setIsUserPopoverOpen: (open: boolean) => void;

  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;

  isVisibilityDialogOpen: boolean;
  setIsVisibilityDialogOpen: (open: boolean) => void;

  chatVisibility: string;
  setChatVisibility: (visibility: string) => void;

  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  setIsMobile: (isMobile: boolean) => void;

  inputValue: string;
  setInputValue: (value: string) => void;

  attachedFiles: any[];
  setAttachedFiles: React.Dispatch<React.SetStateAction<any[]>>;

  fileLoadingStates: { [key: string]: boolean };
  setFileLoadingStates: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;

  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;

  dragCounter: number;
  setDragCounter: (counter: number) => void;

  showScrollButton: boolean;
  setShowScrollButton: (show: boolean) => void;

  streamingFiles: Set<string>;
  streamingContent: string;
  streamingAnalysis: string;

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
  messages: any[];
  sendMessage: any;
  status: any;
  setMessages: any;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

// ====== CONTEXT ======
const ProjectDesignContext = createContext<IProjectDesignContext | undefined>(
  undefined
);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [project, setProject] = useState<IDesignProject | null>(null);
  const router = useRouter();
  const user = useUserContext().user;
  const userId = String(user?._id);
  const [currentProjectRoom, setCurrentProjectRoom] = useState<string | null>(
    null
  );

  // General state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  // Chat interface state
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);
  const userAvatar =
    user?.userdp ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";
  const userName = user?.username || "User";
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("system");
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const [chatVisibility, setChatVisibility] = useState("private");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [fileLoadingStates, setFileLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(true);
  const [streamingFiles] = useState<Set<string>>(new Set());
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingAnalysis, setStreamingAnalysis] = useState<string>("");
  const [isProcessingDraft, setIsProcessingDraft] = useState(false);

  // Transform project messages to include role and parts for compatibility with useChat
  const transformMessages = (messages: any[]) => {
    return (
      messages?.map((msg) => {
        // If message already has parts (like demoMessages), use them as-is
        if (msg.parts && Array.isArray(msg.parts)) {
          return {
            ...msg,
            role: (msg.type === "user" ? "user" : "assistant") as
              | "user"
              | "assistant",
            // Keep existing parts structure
            parts: msg.parts,
            // Move attachedFiles to message level for user messages
            ...(msg.type === "user" &&
              msg.fileAttachments && {
                attachedFiles: msg.fileAttachments.map((file: any) => ({
                  id: file.id || `file-${Date.now()}`,
                  name: file.name,
                  type: file.type,
                  filePath: file.url || file.filePath,
                  status: "uploaded" as const,
                })),
              }),
          };
        }

        // Otherwise, transform from project message format (with text at root level)
        return {
          ...msg,
          role: (msg.type === "user" ? "user" : "assistant") as
            | "user"
            | "assistant",
          parts:
            msg.type === "user"
              ? [
                  {
                    type: "text" as const,
                    text: msg.text,
                  },
                ]
              : [
                  { type: "reasoning" as const, text: msg.analysis || "" },
                  { type: "text" as const, text: msg.text || "" },
                ],
          // Move attachedFiles to message level for user messages
          ...(msg.type === "user" &&
            msg.fileAttachments && {
              attachedFiles: msg.fileAttachments.map((file: any) => ({
                id: file.id || `file-${Date.now()}`,
                name: file.name,
                type: file.type,
                filePath: file.url || file.filePath,
                status: "uploaded" as const,
              })),
            }),
        };
      }) || []
    );
  };

  const { messages, sendMessage, status, setMessages } = useChat({
    messages: transformMessages(project?.messages || []),
    transport: new DefaultChatTransport({
      api: `/project/generate/${project?._id}`,
    }),
  });

  const handleLocalStorageDraft = async () => {
    // Only process if project is loaded and messages array is empty (new project)

    console.log("hit 1");
    console.log("id project", project);
    if (
      !project ||
      (project.messages && project.messages.length > 0) ||
      isProcessingDraft
    ) {
      console.log("hit 2");
      return;
    }

    console.log("hit 3");

    try {
      const draftData = localStorage.getItem("newData");
      if (draftData) {
        const { prompt, files } = JSON.parse(draftData);

        console.log("check", prompt);

        if (prompt) {
          setIsProcessingDraft(true);

          // Create user message immediately for engagement
          const userMessage = {
            id: `user-${Date.now()}`,
            role: "user" as const,
            type: "user",
            parts: [
              {
                type: "text" as const,
                text: prompt,
              },
            ],
            ...(files &&
              files.length > 0 && {
                attachedFiles: files.map((file: any) => ({
                  id: file.id || `file-${Date.now()}`,
                  name: file.name,
                  type: file.type,
                  filePath:
                    file.url || file.filePath || URL.createObjectURL(file),
                  status: "uploaded" as const,
                })),
              }),
            createdAt: new Date(),
          };

          // Create temporary AI typing message
          const aiTypingMessage = {
            id: `ai-typing-${Date.now()}`,
            role: "assistant" as const,
            type: "ai",
            parts: [{ type: "text" as const, text: "" }],
            createdAt: new Date(),
            metadata: { isStreaming: true, isTyping: true },
          };

          // Add both messages to the chat immediately
          setMessages([userMessage, aiTypingMessage]);

          // Start AI generation - this will replace the typing message with real response
          // await sendMessage(prompt, {
          //   body: {
          //     mediaType: "image",
          //     files: files || [],
          //     projectId: project._id,
          //   },
          // });

          generateMessage(prompt, files, project._id);
          // Clear localStorage and input state after processing
          localStorage.removeItem("draftData");
          clearInput(); // Clear input value and attached files from context
          setIsProcessingDraft(false);
        }
      }
    } catch (error) {
      console.error("Error processing localStorage draft:", error);
      // Clear corrupted localStorage data and input state
      localStorage.removeItem("draftData");
      clearInput(); // Clear input value and attached files from context
      setIsProcessingDraft(false);
    }
  };

  // ====== Core Handlers ======
  const clearError = () => setError(null);

  const resetGenerationState = () => {
    setIsGenerating(false);
    setProgress(0);
    setGenerations([]);
    clearError();
  };

  const createProject = async (value: string, attachedFile?: any) => {
    const newProject = {
      title: value,
      status: ProjectStatus.ACTIVE,
      userId,
      userName,
      collaborators: [],
      messages: [],
      analytics: {
        totalMessages: 0,
        totalGenerations: 0,
        totalFeedback: 0,
        likes: 0,
        dislikes: 0,
        views: 0,
      },
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Creating project...");

    try {
      const response = await apiResponseFileUpload.post(
        "/project/create",
        newProject,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        const data = response.data;
        setProject(data.data); // Set the project data

        // Store value and attachedFile as a JSON string in localStorage
        localStorage.setItem(
          "newData",
          JSON.stringify({
            value,
            attachedFile,
          })
        );

        return {
          type: true,
          message: data.message || "project created successfully",
          id: data.data._id, // Use _id from the nested data object
        };
      }
    } catch (error) {
      console.error("Error creating project:", error);
      return {
        type: false,
        message: "unable to create project",
      };
    }

    return {
      type: false,
      message: "unexpected error occurred",
    };
  };

  const fetchProject = async (
    projectId: string
  ): Promise<{
    success: boolean;
    error?: "not_found" | "unauthorized" | "server_error";
  }> => {
    
    if (!projectId) {
      console.error("No project ID provided");
      return { success: false, error: "not_found" };
    }

    setIsLoadingProject(true);
    setError(null);

    try {
      const response = await apiResponse.get(`/project/${projectId}`, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.success) {
        setProject(response.data.data);
        console.log("Project fetched successfully:", response.data.data);

        handleLocalStorageDraft();
        return { success: true };
      } else {
        return { success: false, error: "server_error" };
      }
    } catch (error: any) {
      console.error("Error fetching project:", error);

      // Handle different error types based on response status
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setError("Project not found");
          return { success: false, error: "not_found" };
        } else if (status === 400) {
          setError("You don't have permission to access this project");
          return { success: false, error: "unauthorized" };
        } else {
          setError("Server error occurred");
          return { success: false, error: "server_error" };
        }
      } else {
        setError("Network error occurred");
        return { success: false, error: "server_error" };
      }
    } finally {
      setIsLoadingProject(false);
    }
  };

  const toggleGeneration = (id: string) => {
    setGenerations((prev) =>
      prev.map((gen) =>
        gen.id === id ? { ...gen, isCollapsed: !gen.isCollapsed } : gen
      )
    );
  };

  const retryLoading = (id: string) => {
    console.log(`Retrying generation with ID: ${id}`);
  };

  const editMessage = async (
    messageId: string,
    updatedContent: string,
    files: File[] | null,
    projectId: string
  ) => {
    try {
      setIsGenerating(true);
      await apiResponseFileUpload.put(
        `/project/${projectId}/messages/${messageId}`,
        {
          text: updatedContent,
          files,
        }
      );
    } catch (error) {
      console.error("Error editing message:", error);
      if (error instanceof Error) {
        setError(error.message || "Failed to edit message");
      } else {
        setError("Failed to edit message");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMessage = async (
    messageContent: string,
    files: File[] | null,
    projectId: string
  ) => {
    try {
      setIsGenerating(true);

      const formData = new FormData();
      formData.append("prompt", messageContent);
      formData.append("mediaType", "image");
      files?.forEach((file) => formData.append("files", file));

      console.log("formData", formData);

      await apiResponseFileUpload.post(
        `/project/generate/${projectId}`,
        formData,
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      if (error instanceof Error) {
        setError(error.message || "Failed to send message");
      } else {
        setError("Failed to send message");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteMessage = (messageId: string) => {
    console.log(`Deleting message ${messageId}`);
  };

  const addReaction = (
    messageId: string,
    type: "like" | "dislike" | "comment"
  ) => {
    console.log(`Adding ${type} reaction to message ${messageId}`);
  };

  const removeReaction = (
    messageId: string,
    type: "like" | "dislike" | "comment"
  ) => {
    console.log(`Removing ${type} reaction from message ${messageId}`);
  };

  const handleGenerationItemClick = (generationId: string) => {
    console.log(`Clicked generation item: ${generationId}`);
  };

  // ====== Placeholder UI handlers ======
  const handleInput = (event?: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!event) return;
    setInputValue(event.target.value);
  };

  const handleKeyDown = (_event?: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Reserved for future shortcuts
  };

  const handlePaste = () => {
    // Reserved: paste handler (e.g., paste images)
  };

  const processFiles = (files: File[] = []) => {
    if (!files || files.length === 0) return;
    const allowedPrefixes = ["image/", "video/"];
    const maxFileSizeBytes = 10 * 1024 * 1024; // 10MB

    const filtered = files.filter((file) => {
      const isAllowedType =
        !!file.type && allowedPrefixes.some((p) => file.type.startsWith(p));
      const isAllowedSize = file.size <= maxFileSizeBytes;
      return isAllowedType && isAllowedSize;
    });

    if (filtered.length === 0) return;

    setAttachedFiles((prev) => [...prev, ...filtered]);
    setFileLoadingStates((prev) => {
      const next = { ...prev };
      filtered.forEach((f, idx) => {
        const key = (f as any).fileKey || `${f.name}-${Date.now()}-${idx}`;
        (f as any).fileKey = key;
        next[key] = false; // not loading by default
      });
      return next;
    });
  };

  const handleFileSelect = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) return;
    const files = Array.from(e.target.files || []);
    processFiles(files as File[]);
    // reset input value so same file can be re-selected
    e.target.value = "";
  };

  const handleDragEnter = (e?: React.DragEvent) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((c) => c + 1);
    setIsDragOver(true);
  };

  const handleDragLeave = (e?: React.DragEvent) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((c) => Math.max(0, c - 1));
    setIsDragOver((prev) => (dragCounter - 1 <= 0 ? false : prev));
  };

  const handleDragOver = (e?: React.DragEvent) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e?: React.DragEvent) => {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer?.files || []);
    processFiles(files as File[]);
    setDragCounter(0);
    setIsDragOver(false);
  };

  const scrollToBottom = () => {};
  const autoResize = () => {};
  const clearInput = () => {
    setInputValue("");
    setAttachedFiles([]);
  };
  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ProjectDesignContext.Provider
      value={{
        project,
        setProject,
        generations,
        setGenerations,
        isGenerating,
        isLoadingProject,
        clearError,
        messages,
        sendMessage,
        status,
        setMessages,
        resetGenerationState,
        createProject,
        fetchProject,
        toggleGeneration,
        retryLoading,
        editMessage,
        deleteMessage,
        addReaction,
        removeReaction,
        handleGenerationItemClick,
        generateMessage,
        isLiveMode,
        isMobile,
        isDrawerOpen,
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
        removeAttachedFile,
        handleLocalStorageDraft,
        error,
        setError,
      }}
    >
      {children}
    </ProjectDesignContext.Provider>
  );
};

// ====== HOOK ======
export const useProjectDesign = () => {
  const context = useContext(ProjectDesignContext);
  if (!context) {
    throw new Error("useProjectDesign must be used within a ProjectProvider");
  }
  return context;
};
