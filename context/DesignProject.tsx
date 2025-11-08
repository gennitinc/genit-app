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
  const [isTyping, setIsTyping] = useState(false);
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
  const lastFetchedProjectIdRef = useRef<string | null>(null);

  const transformMessages = useCallback((messages: any[]) => {
    if (!messages || !Array.isArray(messages)) {
      return [];
    }

    return messages.map((msg) => {
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
    });
  }, []);

  const dataURLtoFile = (dataUrl: string, filename: string) => {
    const [header, base64] = dataUrl.split(",");
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    const byteString = atob(base64);
    const u8arr = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      u8arr[i] = byteString.charCodeAt(i);

    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    const socket = io(`${serverUrlSocket}`);

    const handleConnect = () => {
      console.log("Socket connected");
    };

    // const handleNewMessage = (projectData: any) => {
    //   console.log("New message received", projectData);

    //   // Ignore messages from other projects
    //   const incomingProjectId = projectData?._id || projectData?.id;
    //   if (
    //     project?._id &&
    //     incomingProjectId &&
    //     incomingProjectId !== project._id
    //   ) {
    //     return;
    //   }

    //   // Update the project with the latest data from server
    //   if (projectData && Array.isArray(projectData.messages)) {
    //     setProject(projectData);
    //     // Merge server messages with any optimistic local messages
    //     const serverMessages = transformMessages(projectData.messages);
    //     setMessages((prev) => {
    //       // Create sets for both ID formats from server messages
    //       const serverIds = new Set(
    //         serverMessages.map((m: any) => String(m.id || m._id))
    //       );

    //       // Track server message content for duplicate detection
    //       const serverUserTexts = new Set<string>();
    //       const serverAiKeys = new Set<string>();
    //       serverMessages.forEach((m: any) => {
    //         const text =
    //           m.parts?.find((p: any) => p.type === "text")?.text?.trim() || "";
    //         if (m.type === "user" && text) serverUserTexts.add(text);
    //         if (m.type === "ai") {
    //           if (text) serverAiKeys.add(text);
    //           const g = m.generationGroups?.[0]?.id || "";
    //           if (g) serverAiKeys.add(g);
    //         }
    //       });

    //       // Drop optimistic that are now confirmed by server
    //       const stillOptimistic = prev.filter((m: any) => {
    //         const id = String(m.id || m._id || "");
    //         if (serverIds.has(id)) return false;
    //         const text =
    //           m.parts?.find((p: any) => p.type === "text")?.text?.trim() || "";
    //         if (m.type === "user" && text && serverUserTexts.has(text))
    //           return false;
    //         if (m.type === "ai") {
    //           const g = m.generationGroups?.[0]?.id || "";
    //           if (
    //             (text && serverAiKeys.has(text)) ||
    //             (g && serverAiKeys.has(g))
    //           )
    //             return false;
    //         }
    //         return true;
    //       });

    //       return [...stillOptimistic, ...serverMessages];
    //     });
    //     // Reset typing/streaming when final message arrives
    //     setStreamingContent("");
    //     setStreamingAnalysis("");
    //     setIsTyping(false);
    //   }
    // };

    const handleNewMessage = (projectData: any) => {
      console.log("New message received", projectData);

      // Ignore messages from other projects
      const incomingProjectId = projectData?._id || projectData?.id;
      if (
        project?._id &&
        incomingProjectId &&
        incomingProjectId !== project._id
      ) {
        return;
      }

      if (projectData && Array.isArray(projectData.messages)) {
        setProject(projectData);

        const serverMessages = transformMessages(projectData.messages);

        setMessages(() => {
          // Remove any local/demo messages (isOptimistic)
          // If you didn't set isOptimistic, you can filter by text instead
          return serverMessages;
        });

        // Reset typing/streaming when final message arrives
        setStreamingContent("");
        setStreamingAnalysis("");
        setIsTyping(false);
      }
    };

    const handleTextStart = (data: any) => {
      try {
        const incomingProjectId = data?.projectId || data?.project_id;
        if (
          incomingProjectId &&
          project?._id &&
          incomingProjectId !== project._id
        ) {
          return;
        }
        // Clear previous streaming content and start fresh
        setStreamingContent("");
        setStreamingAnalysis("");
        setIsTyping(true);
      } catch (e) {
        console.error("Error handling textStart event", e);
      }
    };

    const handleTextDelta = (data: any) => {
      // Handle streaming text deltas from server
      try {
        const incomingProjectId = data?.projectId || data?.project_id;
        if (
          incomingProjectId &&
          project?._id &&
          incomingProjectId !== project._id
        ) {
          return;
        }
        const delta = data?.delta || "";
        if (typeof delta === "string" && delta.length > 0) {
          setStreamingContent((prev) => prev + delta);
        }
        setIsTyping(true);
      } catch (e) {
        console.error("Error handling textDelta event", e);
      }
    };

    const handleTextCompleted = (data: any) => {
      try {
        const incomingProjectId = data?.projectId || data?.project_id;
        if (
          incomingProjectId &&
          project?._id &&
          incomingProjectId !== project._id
        ) {
          return;
        }
        // Final text is in data.text, but we'll wait for newMessage event for full project state
        // Keep typing true until newMessage arrives
      } catch (e) {
        console.error("Error handling textCompleted event", e);
      }
    };

    // Set up listeners (works whether already connected or not)
    socket.on("connect", handleConnect);
    socket.on("newMessage", handleNewMessage);
    socket.on("textStart", handleTextStart);
    socket.on("textDelta", handleTextDelta);
    socket.on("textCompleted", handleTextCompleted);

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      socket.off("connect", handleConnect);
      socket.off("newMessage", handleNewMessage);
      socket.off("textStart", handleTextStart);
      socket.off("textDelta", handleTextDelta);
      socket.off("textCompleted", handleTextCompleted);
      socket.disconnect();
    };
  }, [transformMessages, project?._id]);

  const handleLocalStorageDraft = useCallback(
    async (project: IDesignProject) => {
      if (
        !project ||
        project.messages.length > 0 ||
        isProcessingDraft ||
        hasProcessedDraftRef.current
      ) {
        return;
      }
      const draft = localStorage.getItem("newData");

      if (!draft) return;

      console.log("new d", draft);
      try {
        setIsProcessingDraft(true);
        hasProcessedDraftRef.current = true;
        const parsed = JSON.parse(draft);
        const prompt = parsed.prompt;

        const filesFromStorage = parsed.files || [];
        const selectedFiles = parsed.selectedFiles || [];

        if (!prompt) {
          localStorage.removeItem("newData");
          return;
        }

        // Convert data URLs back to File objects
        let restoredFiles: File[] = [];

        if (filesFromStorage.length > 0) {
          try {
            const newData = JSON.parse(draft);

            // handle single or nested arrays safely
            const fileArray = Array.isArray(newData.files?.[0])
              ? newData.files.flat()
              : newData.files || [];

            restoredFiles = fileArray
              .filter((f: any) => f.dataUrl) // skip invalid entries
              .map((f: any) => dataURLtoFile(f.dataUrl, f.name || "file"));
          } catch (err) {
            console.error("Error restoring files:", err);
          }
        }

        console.log("rest", restoredFiles);

        // Set restored files to attachedFiles state so they show in the UI
        if (restoredFiles.length > 0) {
          setAttachedFiles(restoredFiles);
        }

        // Show typing indicator while processing the initial draft
        setIsTyping(true);
        // Pass restored File objects to generateMessage
        await generateMessage(
          prompt,
          restoredFiles.length > 0 ? restoredFiles : null,
          project._id,
          selectedFiles
        );
        // Remove draft after successful generation
        localStorage.removeItem("newData");
      } catch (error) {
        console.error("Error processing localStorage draft:", error);
        localStorage.removeItem("newData");
      } finally {
        setIsProcessingDraft(false);
        clearInput();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isProcessingDraft, setAttachedFiles]
  );

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
    selectedFiles?: string[],
    designTypeId?: string
  ) => {
    const newProject = {
      title: value,
      status: ProjectStatus.ACTIVE,
      userId,
      userName,
      collaborators: [],
      messages: [],
      category: designTypeId || null,
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
        setProject(data.project);

        const projectId = data.project._id.toString();

        console.log("pcreated", data.project);

        const filesArray = Array.isArray(attachedFiles)
          ? attachedFiles
          : attachedFiles
            ? [attachedFiles]
            : [];

        // Convert File objects to data URLs for localStorage storage
        const filesForStorage = await Promise.all(
          filesArray.map(
            (file: File) =>
              new Promise<{
                name: string;
                type: string;
                size: number;
                dataUrl: string;
              }>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    dataUrl: reader.result as string,
                  });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
              })
          )
        );

        // 🧠 Save all data in localStorage
        localStorage.setItem(
          "newData",
          JSON.stringify({
            prompt: value,
            files: filesForStorage,
            selectedFiles: selectedFiles || [],
            designType: designTypeId || null,
            projectId,
          })
        );

        return {
          type: true,
          message: data.message || "project created successfully",
          id: projectId,
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

      // Reset draft processing flags when fetching a new project
      hasProcessedDraftRef.current = false;
      setIsProcessingDraft(false);

      setIsLoadingProject(true);
      setError(null);

      try {
        const response = await apiResponse.get(`/project/${projectId}`, {
          withCredentials: true,
        });

        if (response.status == 200) {
          console.log("suc", response.data.project);

          const projectData = response.data.project;

          // If switching to a different project, reset UI message state first
          if (lastFetchedProjectIdRef.current !== projectData._id) {
            lastFetchedProjectIdRef.current = projectData._id;
            setMessages([]);
            setStreamingContent("");
            setStreamingAnalysis("");
            setIsTyping(false);
          }

          setProject(projectData);

          // If server has messages, merge with any existing optimistic ones
          if (Array.isArray(projectData?.messages)) {
            if (projectData.messages.length >= 1) {
              const serverMessages = transformMessages(
                projectData.messages || []
              );
              setMessages((prev: any[]) => {
                const serverIds = new Set(
                  serverMessages.map((m: any) => String(m.id || m._id))
                );
                const serverUserTexts = new Set<string>();
                const serverAiKeys = new Set<string>();
                serverMessages.forEach((m: any) => {
                  const text =
                    m.parts
                      ?.find((p: any) => p.type === "text")
                      ?.text?.trim() || "";
                  if (m.type === "user" && text) serverUserTexts.add(text);
                  if (m.type === "ai") {
                    if (text) serverAiKeys.add(text);
                    const g = m.generationGroups?.[0]?.id || "";
                    if (g) serverAiKeys.add(g);
                  }
                });
                const optimistic = prev.filter((m: any) => {
                  const id = String(m.id || m._id || "");
                  if (serverIds.has(id)) return false;
                  const text =
                    m.parts
                      ?.find((p: any) => p.type === "text")
                      ?.text?.trim() || "";
                  if (m.type === "user" && text && serverUserTexts.has(text))
                    return false;
                  if (m.type === "ai") {
                    const g = m.generationGroups?.[0]?.id || "";
                    if (
                      (text && serverAiKeys.has(text)) ||
                      (g && serverAiKeys.has(g))
                    )
                      return false;
                  }
                  return true;
                });
                return [...optimistic, ...serverMessages];
              });
              setIsTyping(false);
            } else {
              // No server messages yet — keep optimistic UI and kick off draft processing
              handleLocalStorageDraft(projectData);
            }
          } else {
            // Unknown messages shape — keep current optimistic state and process draft
            setIsTyping(false);
            handleLocalStorageDraft(projectData);
          }

          console.log("Project fetched successfully:", projectData);

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
    [transformMessages, handleLocalStorageDraft]
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
      setIsTyping(true);

      console.log("⚡ Generating message...");

      const now = Date.now();
      const generateId = () =>
        `file-${now}-${Math.random().toString(36).substr(2, 9)}`;

      // Array to hold all attached file metadata
      const attachedFiles: {
        id: string;
        name: string;
        type: string;
        filePath: string;
        status: "uploaded";
      }[] = [];

      // Holds real File/Blob objects for upload
      const blobFilesToUpload: File[] = [];

      // --- 1. Handle raw File uploads from input[type="file"] ---
      if (files && files.length > 0) {
        for (const file of files as any[]) {
          const isBlob = typeof window !== "undefined" && file instanceof Blob;

          if (isBlob) {
            attachedFiles.push({
              id: generateId(),
              name: (file as File).name || "file",
              type: (file as File).type || "application/octet-stream",
              filePath: URL.createObjectURL(file as File),
              status: "uploaded",
            });
            blobFilesToUpload.push(file as File);
          } else if (file && (file.filePath || file.url)) {
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

      // --- 2. Handle selectedFiles (pre-stored URLs) ---
      if (selectedFiles && selectedFiles.length > 0) {
        for (const filePath of selectedFiles) {
          const name = filePath.split("/").pop() || "selected-file";
          const ext = name.split(".").pop()?.toLowerCase();
          let type = "application/octet-stream";

          if (ext) {
            if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
              type = `image/${ext === "jpg" ? "jpeg" : ext}`;
            } else if (["mp4", "mov", "avi", "mkv"].includes(ext)) {
              type = `video/${ext}`;
            } else if (ext === "pdf") {
              type = "application/pdf";
            }
          }

          attachedFiles.push({
            id: generateId(),
            name,
            type,
            filePath,
            status: "uploaded",
          });
        }
      }

      // --- 3. Create user message object ---
      const userMessageId = `msg-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

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
        fileAttachments: attachedFiles.length > 0 ? attachedFiles : undefined,
        createdAt: new Date(),
      };

      // Update UI immediately
      const transformedUserMessage = transformMessages([userMessage])[0];
      setMessages((prev) => [...prev, transformedUserMessage]);

      // --- 4. Build FormData for backend upload ---
      const formData = new FormData();
      formData.append("prompt", messageContent);
      formData.append("mediaType", "image");

      // Append actual binary files
      if (blobFilesToUpload.length > 0) {
        blobFilesToUpload.forEach((file) => {
          if (file instanceof Blob) {
            formData.append("files", file); // backend must expect `files`
          }
        });
      }

      // Append selected file URLs (references) as JSON string
      if (selectedFiles && selectedFiles.length > 0) {
        formData.append("selectedFiles", JSON.stringify(selectedFiles));
      }

      // Debugging — see what's really inside FormData
      console.group("📦 FormData Content");
      console.log("Files to upload:", blobFilesToUpload.length);
      console.log("Selected files:", selectedFiles?.length || 0);
      for (const [key, value] of formData.entries()) {
        // Fix: Use typeof for correct instanceof check in TS
        if (
          (typeof File !== "undefined" && value instanceof File) ||
          (typeof Blob !== "undefined" && value instanceof Blob)
        ) {
          console.log(
            key,
            `[File: ${(value as File).name}, size: ${(value as File).size}]`
          );
        } else {
          console.log(key, value);
        }
      }
      console.groupEnd();

      // --- 5. Send to backend ---
      // DO NOT set Content-Type header manually - axios will set it with boundary
      const response = await apiResponseFileUpload.post(
        `/project/generate/${projectId}`,
        formData,
        {
          withCredentials: true,
          // Remove manual Content-Type header - let axios set it automatically with boundary
        }
      );

      console.log("✅ Server response:", response.data);
    } catch (error) {
      console.error("❌ Error sending message:", error);
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

  const scrollToBottom = () => {
    // Dispatch event to trigger scroll in chat component
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("scroll-chat-to-bottom"));
    }
  };

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
