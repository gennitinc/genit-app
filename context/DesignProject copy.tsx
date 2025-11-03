import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "./AuthenticatedContext";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { demoMessages } from "../components/chat/dummyMessage";
import { io } from "socket.io-client";
import {
  IProjectDesignContext,
  IDesignProject,
  ProjectStatus,
} from "@/types/ProjectTypes";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
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
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
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
  const hasProcessedDraftRef = useRef(false);
  const [messages, setMessages] = useState<any[]>([]);

  const transformMessages = (messages: any[]) => {
    return (
      messages?.map((msg) => {
        if (msg.parts && Array.isArray(msg.parts)) {
          return {
            ...msg,
            // Normalize role and type
            role: (msg.type === "user" ? "user" : "assistant") as
              | "user"
              | "assistant",
            type: msg.type === "user" ? "user" : "ai",
            parts: msg.parts,
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

        return {
          ...msg,
          // Normalize role and type
          role: (msg.type === "user" ? "user" : "assistant") as
            | "user"
            | "assistant",
          type: msg.type === "user" ? "user" : "ai",
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

  useEffect(() => {
    const socket = io(`${serverUrlSocket}`);
    socket.on("connect", () => {
      console.log("Socket connected");

      socket.on("newMessage", (projectData: any) => {
        console.log("New message received", projectData);

        //Update the project with the latest data from server
        if (
          projectData &&
          Array.isArray(projectData.messages) &&
          projectData.messages.length > 0
        ) {
          setProject(projectData);
          setMessages(transformMessages(projectData.messages));
          setIsTyping(false); // Reset typing indicator when new message is received
        }
      });
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLocalStorageDraft = async (project: IDesignProject) => {
    console.log("hitting 1");
    if (
      !project ||
      project.messages.length > 0 ||
      isProcessingDraft ||
      hasProcessedDraftRef.current
    ) {
      console.log("hitting 2");
      return;
    }

    console.log("hit local");
    const draft = localStorage.getItem("newData");

    console.log("local 3");
    if (!draft) return;

    console.log("local 4", draft);

    try {
      setIsProcessingDraft(true);
      hasProcessedDraftRef.current = true;
      const parsed = JSON.parse(draft);
      const prompt = parsed.prompt;
      const attachedFile = parsed.files;
      const selectedFiles = parsed.selectedFiles || [];

      if (!prompt) {
        localStorage.removeItem("newData");
        return;
      }

      await generateMessage(prompt, attachedFile, project._id, selectedFiles);
      setIsTyping(true);
    } catch (error) {
      console.error("Error processing localStorage draft:", error);
      localStorage.removeItem("newData");
    } finally {
      setIsProcessingDraft(false);
      clearInput();
    }
  };

  const clearError = () => setError(null);

  const resetGenerationState = () => {
    setIsGenerating(false);
    setProgress(0);
    setGenerations([]);
    clearError();
  };

  const createProject = async (
    value: string,
    attachedFile?: any,
    selectedFiles?: string[]
  ) => {
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
        setProject(data.data);

        localStorage.setItem(
          "newData",
          JSON.stringify({
            prompt: value,
            files: attachedFile ? [attachedFile] : [],
            selectedFiles: selectedFiles || [],
          })
        );

        return {
          type: true,
          message: data.message || "project created successfully",
          id: data.data._id,
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

  const fetchProject = useCallback(
    async (
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

          console.log("bare m", response.data.data);
          if (response.data.data?.messages.length >= 1) {
            console.log("transf m", messages);
            setMessages(transformMessages(response.data.data?.messages || []));
          } else {
            handleLocalStorageDraft(response.data.data);
            console.log("Project fetched successfully:", response.data.data);
          }

          // setMessages(transformMessages(demoMessages || []));

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
    },
    []
  );

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
      setIsTyping(false);
    }
  };

  const generateMessage = async (
    messageContent: string,
    files: File[] | null,
    projectId: string,
    selectedFiles?: string[] // e.g., ["https://example.com/image1.png", "video.mp4"]
  ) => {
    try {
      setIsGenerating(true);

      const now = Date.now();
      const generateId = () =>
        `file-${now}-${Math.random().toString(36).substr(2, 9)}`;

      // Build attachedFiles array from BOTH sources
      const attachedFiles: {
        id: string;
        name: string;
        type: string;
        filePath: string;
        status: "uploaded";
      }[] = [];

      // 1. Handle raw File uploads (from input[type="file"]) or plain objects from storage
      const blobFilesToUpload: File[] = [];
      if (files && files.length > 0) {
        for (const file of files as any[]) {
          const isBlob = typeof window !== "undefined" && file instanceof Blob;

          if (isBlob) {
            // Safe to create preview URL
            attachedFiles.push({
              id: generateId(),
              name: (file as File).name || "file",
              type: (file as File).type || "application/octet-stream",
              filePath: URL.createObjectURL(file as File),
              status: "uploaded",
            });
            blobFilesToUpload.push(file as File);
          } else if (file && (file.filePath || file.url)) {
            // Non-Blob item coming from persisted storage; treat as reference
            const name =
              file.name ||
              String(file.filePath || file.url)
                .split("/")
                .pop() ||
              "file";
            const type = file.type || "application/octet-stream";
            attachedFiles.push({
              id: generateId(),
              name,
              type,
              filePath: file.filePath || file.url,
              status: "uploaded",
            });
          }
        }
      }

      // 2. Handle selectedFiles (pre-uploaded file paths or URLs)
      if (selectedFiles && selectedFiles.length > 0) {
        for (const filePath of selectedFiles) {
          // Infer name from URL/path
          const name = filePath.split("/").pop() || "selected-file";
          // Guess MIME type from extension (basic)
          const ext = name.split(".").pop()?.toLowerCase();
          let type = "application/octet-stream";
          if (ext) {
            if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
              type = `image/${ext}`;
            else if (["mp4", "mov", "avi", "mkv"].includes(ext))
              type = `video/${ext}`;
            else if (ext === "pdf") type = "application/pdf";
          }

          attachedFiles.push({
            id: generateId(),
            name,
            type,
            filePath, // direct URL or path
            status: "uploaded",
          });
        }
      }

      // Create user message in demoMessages format
      const userMessageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const userMessage = {
        id: userMessageId,
        role: "user" as const,
        type: "user" as const,
        parts: [
          {
            type: "text" as const,
            text: messageContent,
          },
        ],
        // Use fileAttachments so transformMessages can normalize to attachedFiles
        fileAttachments: attachedFiles.length > 0 ? attachedFiles : undefined,
        createdAt: new Date(),
      };

      // Transform and add to UI immediately
      const transformedUserMessage = transformMessages([userMessage])[0];
      setMessages((prev) => [...prev, transformedUserMessage]);

      // Prepare FormData for backend
      const formData = new FormData();
      formData.append("prompt", messageContent);
      formData.append("projectId", projectId);
      // Required by backend validation
      formData.append("mediaType", "image");

      // Append only real Blob/File objects for upload
      if (blobFilesToUpload.length > 0) {
        blobFilesToUpload.forEach((file) => {
          formData.append("files", file);
        });
      }

      // Append selected file paths (already stored, just reference them)
      if (selectedFiles && selectedFiles.length > 0) {
        formData.append("selectedFiles", JSON.stringify(selectedFiles));
      }

      // Call backend 
      await apiResponseFileUpload.post(
        `/project/generate/${projectId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // axios usually sets this automatically
          },
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsGenerating(false);
      setIsTyping(false);
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

  const handleInput = (event?: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!event) return;
    setInputValue(event.target.value);
  };

  const handleKeyDown = (
    _event?: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {};

  const handlePaste = () => {};

  const processFiles = (files: File[] = []) => {
    if (!files || files.length === 0) return;
    const allowedPrefixes = ["image/", "video/"];
    const maxFileSizeBytes = 10 * 1024 * 1024;

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
        next[key] = false;
      });
      return next;
    });
  };

  const handleFileSelect = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) return;
    const files = Array.from(e.target.files || []);
    processFiles(files as File[]);
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
        isTyping,
        setIsTyping,
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
        selectedFiles,
        setSelectedFiles,
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

export const useProjectDesign = () => {
  const context = useContext(ProjectDesignContext);
  if (!context) {
    throw new Error("useProjectDesign must be used within a ProjectProvider");
  }
  return context;
};
