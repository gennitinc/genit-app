import React, { createContext, useContext, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "./AuthenticatedContext";
import { apiResponse } from "@/utils/apiResponse";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";

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
  content?: string;
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
  content: string;
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
  clearError: () => void;
  resetGenerationState: () => void;
  createProject: (
    value: string,
    description?: string,
    attachedFile?: any
  ) => void;

  toggleGeneration: (id: string) => void;
  retryLoading: (id: string) => void;

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

  sendMessage: (
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

  // Socket state
  const [socket, setSocket] = useState<null>(null);
  const [currentProjectRoom, setCurrentProjectRoom] = useState<string | null>(
    null
  );
  const streamMessageIdRef = useRef<string | null>(null);
  const latestStreamContent = useRef<string>("");
  const streamUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // ====== Core Handlers ======
  const clearError = () => setError(null);

  const resetGenerationState = () => {
    setIsGenerating(false);
    setProgress(0);
    setGenerations([]);
    clearError();
  };

  const createProject = (
    value: string,
    description?: string,
    attachedFile?: any
  ) => {
    // const newProject: IDesignProject = {
    //   _id: Date.now().toString(),
    //   title,
    //   description,
    //   status: ProjectStatus.ACTIVE,
    //   userId,
    //   userName,
    //   collaborators: [],
    //   messages: [],
    //   analytics: {
    //     totalMessages: 0,
    //     totalGenerations: 0,
    //     totalFeedback: 0,
    //     likes: 0,
    //     dislikes: 0,
    //     views: 0,
    //   },
    //   tags: [],
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };
    // setProject(newProject);
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
        `/projects/${projectId}/messages/${messageId}`,
        {
          content: updatedContent,
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

  const sendMessage = async (
    messageContent: string,
    files: File[] | null,
    projectId: string
  ) => {
    try {
      setIsGenerating(true);
      await apiResponseFileUpload.post(`/projects/${projectId}/messages`, {
        content: messageContent,
        files,
      });
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
  const handleInput = () => {};
  const handleKeyDown = () => {};
  const handlePaste = () => {};
  const processFiles = () => {};
  const handleFileSelect = () => {};
  const handleDragEnter = () => {};
  const handleDragLeave = () => {};
  const handleDragOver = () => {};
  const handleDrop = () => {};
  const scrollToBottom = () => {};
  const autoResize = () => {};
  const clearInput = () => {};
  const removeAttachedFile = () => {};

  return (
    <ProjectDesignContext.Provider
      value={{
        project,
        setProject,
        generations,
        setGenerations,
        isGenerating,
        clearError,
        resetGenerationState,
        createProject,
        toggleGeneration,
        retryLoading,
        editMessage,
        deleteMessage,
        addReaction,
        removeReaction,
        handleGenerationItemClick,
        sendMessage,
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
