import { demoMessages } from "../components/chat/dummyMessage";
import { useUserContext } from "./AuthenticatedContext";
import { toast } from "@/hooks/use-toast";
import { startAgentRun, classifyPrompt } from "@/lib/agents-api";
import {
  IDesignProject,
  IProjectDesignContext,
  ProjectStatus,
} from "@/types/ProjectTypes";
import { apiResponse, serverUrlSocket } from "@/utils/apiResponse";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatingForMessageId, setGeneratingForMessageId] = useState<
    string | null
  >(null);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);
  const currentOrg = user?.currentOrganization && typeof user.currentOrganization === "object"
    ? (user.currentOrganization as any)
    : ((user?.allOrganizations || [])[0] || user?.business || null);
  const orgLogo = currentOrg?.businessLogo || null;

  const userAvatar =
    orgLogo ||
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
  const socketRef = useRef<any>(null);
  const projectIdRef = useRef<string | null>(null);
  const isHydratingRef = useRef<boolean>(false);
  const messagesRef = useRef<any[]>([]);
  const [focusedGenerationId, setFocusedGenerationId] = useState<string | null>(
    null
  );
  const [selectedColorScales, setSelectedColorScales] = useState<
    Array<{
      base: string;
      shades: { [key: number]: string };
    }>
  >([]);
  const [activeGenerationId, setActiveGenerationId] = useState<string | null>(
    null
  );
  const [inputMode, setInputMode] = useState<"text" | "color" | "file">("text");
  const [generationMode, setGenerationMode] = useState<"auto" | "custom">(
    "custom"
  );
  const [primaryFont, setPrimaryFont] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const [brandSaveStatus, setBrandSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [imageModel, setImageModel] = useState<string>(
    "gemini-3.1-flash-image-preview"
  );
  const [liveNodes, setLiveNodes] = useState<
    Array<{ id: string; filePath: string; name: string; prompt: string }>
  >([]);

  const addLiveNode = useCallback(
    (node: { id: string; filePath: string; name: string; prompt: string }) => {
      setLiveNodes((prev) => {
        // Avoid duplicates
        if (prev.find((n) => n.id === node.id)) return prev;
        return [...prev, node];
      });
    },
    []
  );

  const transformMessages = useCallback((messages: any[]) => {
    if (!messages || !Array.isArray(messages)) {
      return [];
    }

    return messages
      .map((msg, index) => {
        if (!msg) {
          console.warn(
            `[DesignProject] msg at index ${index} is null/undefined`
          );
          return null;
        }

        if (msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0) {
          return {
            ...msg,
            id: msg.id || msg._id || `msg-${index}-${Date.now()}`,
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
                  name: file.name || "Untitled",
                  type: file.type || "unknown",
                  filePath: file.url || file.filePath || "",
                  status: "uploaded" as const,
                })),
              }),
          };
        }

        // Fallback for older message format or missing parts
        return {
          ...msg,
          id: msg.id || msg._id || `msg-${index}-${Date.now()}`,
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
                    text: msg.text || "",
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
                name: file.name || "Untitled",
                type: file.type || "unknown",
                filePath: file.url || file.filePath || "",
                status: "uploaded" as const,
              })),
            }),
        };
      })
      .filter(Boolean);
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

  // Update project ID ref and hydrate brand identity when project changes
  useEffect(() => {
    const newProjectIdStr = project?._id ? String(project._id) : null;

    // If project has changed, reset project-specific states to ensure isolation
    if (newProjectIdStr !== projectIdRef.current) {
      setMessages([]);
      setLiveNodes([]);
      setAiStatus(null);
      setStreamingContent("");
      setStreamingAnalysis("");
      setIsGenerating(false);
      setIsGeneratingImage(false);
      setGeneratingForMessageId(null);

      // Update the processed draft ref so new project can process its own draft
      hasProcessedDraftRef.current = false;

      // Update the refractory ref immediately to signal we've processed this switch
      projectIdRef.current = newProjectIdStr;

      // Update imageModel if present in the new project
      if (project?.imageModel) {
        setImageModel(project.imageModel);
      }
    }

    // Hydrate brand identity from project metadata if available
    if (project?.metadata?.finalizedSelections) {
      const selections = project.metadata.finalizedSelections;
      
      if (selections.selectedColorScales && selections.selectedColorScales.length > 0) {
        // Only set if different to avoid unnecessary re-renders
        const currentHexes = selectedColorScales.map(s => s.base).join(',');
        const newHexes = selections.selectedColorScales.map((s: any) => s.base).join(',');
        
        if (currentHexes !== newHexes) {
          setSelectedColorScales(selections.selectedColorScales);
        }
      }
      
      if (selections.primaryFont && selections.primaryFont !== primaryFont) {
        setPrimaryFont(selections.primaryFont);
      }
    }
  }, [project?._id, project?.imageModel, project?.metadata?.finalizedSelections]);

  const isGeneratingImageRef = useRef(isGeneratingImage);
  
  useEffect(() => {
    isGeneratingImageRef.current = isGeneratingImage;
  }, [isGeneratingImage]);

  // Update messages ref when messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Initialize socket connection once on mount
  useEffect(() => {
    // Only create socket if it doesn't exist
    if (socketRef.current) {
      return;
    }

    const socket = io(`${serverUrlSocket}`);
    socketRef.current = socket;

    const handleConnect = () => {
    };

    const handleNewMessage = (projectData: any) => {

      // Ignore messages from other projects
      const incomingProjectId = projectData?._id || projectData?.id;
      const currentProjectId = projectIdRef.current;
      if (
        currentProjectId &&
        incomingProjectId &&
        incomingProjectId !== currentProjectId
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
        setIsGenerating(false);
        setIsGeneratingImage(false); // Force clear image loading too
        
        // Only clear status if we aren't generating an image in the background
        if (!isGeneratingImageRef.current) {
          setAiStatus(null);
        }
      }
    };

    const handleTextStart = (data: any) => {
      try {
        const incomingProjectId = data?.projectId || data?.project_id;
        const currentProjectId = projectIdRef.current;
        if (
          incomingProjectId &&
          currentProjectId &&
          incomingProjectId !== currentProjectId
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
        const currentProjectId = projectIdRef.current;
        if (
          incomingProjectId &&
          currentProjectId &&
          incomingProjectId !== currentProjectId
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
        const currentProjectId = projectIdRef.current;
        if (
          incomingProjectId &&
          currentProjectId &&
          incomingProjectId !== currentProjectId
        ) {
          return;
        }
        // Final text is in data.text, but we'll wait for newMessage event for full project state
        // Keep typing true until newMessage arrives
        setIsGenerating(false);
        setIsGeneratingImage(false);
        setIsTyping(false);
      } catch (e) {
        console.error("Error handling textCompleted event", e);
      }
    };

    const handleGeneratingImage = (data: any) => {
      try {
        const incomingProjectId = data?.projectId || data?.project_id;
        const currentProjectId = projectIdRef.current;
        if (
          incomingProjectId &&
          currentProjectId &&
          incomingProjectId !== currentProjectId
        ) {
          return;
        }

        // Skip global skeleton for inpaint operations
        if (data?.isInpaint) {
          return;
        }

        // Try to attach the skeleton to the most recent user message
        setIsGeneratingImage(true);
        try {
          const lastUserMessage = [...messagesRef.current]
            .reverse()
            .find((m: any) => m?.type === "user");
          if (lastUserMessage && lastUserMessage.id) {
            setGeneratingForMessageId(String(lastUserMessage.id));
          } else {
            setGeneratingForMessageId(null);
          }
        } catch (err) {
          setGeneratingForMessageId(null);
        }
      } catch (e) {
        console.error("Error handling generatingimage event", e);
      }
    };

    // Set up listeners (works whether already connected or not)
    socket.on("connect", handleConnect);
    socket.on("newMessage", handleNewMessage);
    socket.on("textStart", handleTextStart);
    socket.on("textDelta", handleTextDelta);
    socket.on("textCompleted", handleTextCompleted);
    socket.on("generatingimage", handleGeneratingImage);

    const handleBrandUpdate = (response: { success: boolean }) => {
      if (response.success) {
        setBrandSaveStatus("saved");
        setTimeout(() => setBrandSaveStatus("idle"), 2000);
      } else {
        setBrandSaveStatus("idle");
      }
    };

    socket.on("brand-identity-updated", handleBrandUpdate);

    // Real-time canvas node creation
    const handleWorkflowNodeNew = (data: any) => {
      const incomingProjectId = data?.projectId;
      const currentProjectId = projectIdRef.current;
      if (
        incomingProjectId &&
        currentProjectId &&
        incomingProjectId !== currentProjectId
      )
        return;
      if (data?.id && data?.filePath) {
        addLiveNode({
          id: data.id,
          filePath: data.filePath,
          name: data.name || "Design",
          prompt: data.prompt || "",
        });
      }
    };
    socket.on("workflow:node:new", handleWorkflowNodeNew);

    const handleGeneratingImageStop = (data: any) => {
      try {
        const incomingProjectId = data?.projectId || data?.project_id;
        const currentProjectId = projectIdRef.current;
        if (
          incomingProjectId &&
          currentProjectId &&
          incomingProjectId !== currentProjectId
        ) {
          return;
        }
        setIsGeneratingImage(false);
        setGeneratingForMessageId(null);
      } catch (e) {
        console.error("Error handling generatingimage:stop event", e);
      }
    };
    socket.on("generatingimage:stop", handleGeneratingImageStop);

    const handleWorkflowAIStatus = (data: any) => {
      const incomingProjectId = data?.projectId;
      const currentProjectId = projectIdRef.current;
      if (
        incomingProjectId &&
        currentProjectId &&
        incomingProjectId !== currentProjectId
      )
        return;
      if (data?.text) {
        setAiStatus(data.text);
      }
      if (data?.done) {
        setIsGeneratingImage(false);
        setGeneratingForMessageId(null);
        setTimeout(() => setAiStatus(null), 2000);
      }
    };
    socket.on("workflow:ai:status", handleWorkflowAIStatus);

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect", handleConnect);
        socketRef.current.off("newMessage", handleNewMessage);
        socketRef.current.off("textStart", handleTextStart);
        socketRef.current.off("textDelta", handleTextDelta);
        socketRef.current.off("textCompleted", handleTextCompleted);
        socketRef.current.off("generatingimage", handleGeneratingImage);
        socketRef.current.off("generatingimage:stop", handleGeneratingImageStop);
        socketRef.current.off("workflow:node:new");
        socketRef.current.off("workflow:ai:status");
        socketRef.current.off("brand-identity-updated", handleBrandUpdate);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [transformMessages]);

  // Auto-save brand identity when it changes (Debounced)
  useEffect(() => {
    if (
      project?._id &&
      socketRef.current &&
      !isHydratingRef.current &&
      (selectedColorScales.length > 0 || primaryFont)
    ) {
      const timer = setTimeout(() => {
        setBrandSaveStatus("saving");
        socketRef.current.emit("update-brand-identity", {
          projectId: project._id,
          brandIdentity: {
            selectedColorScales,
            primaryFont,
          },
        });
      }, 800); // 800ms debounce

      return () => clearTimeout(timer);
    }
  }, [selectedColorScales, primaryFont, project?._id]);

  const generateMessage = useCallback(
    async (
      messageContent: string,
      files: File[] | null,
      projectId: string,
      selectedFiles?: string[], // e.g., ["https://example.com/image1.png", "video.mp4"]
      metadata?: Record<string, any>
    ) => {
      try {
        setIsGenerating(true);
        setIsTyping(true);
        setAiStatus(null);
        setStreamingContent("");


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
            const isBlob =
              typeof window !== "undefined" && file instanceof Blob;

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
          metadata: metadata || {},
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

        // Append metadata as JSON string
        if (metadata) {
          formData.append("metadata", JSON.stringify(metadata));
        }

        // Debugging — see what's really inside FormData
        console.group("📦 FormData Content");
        for (const [key, value] of formData.entries()) {
          // Fix: Use typeof for correct instanceof check in TS
          if (
            (typeof File !== "undefined" && value instanceof File) ||
            (typeof Blob !== "undefined" && value instanceof Blob)
          ) {
          } else {
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

      } catch (error) {
        console.error("❌ Error sending message:", error);
        setError(
          error instanceof Error ? error.message : "Failed to send message"
        );
      } finally {
        setIsGenerating(false);
        setIsTyping(false);
      }
    },
    [transformMessages]
  );

  const updateProjectModel = useCallback(
    async (projectId: string, model: string) => {
      try {
        const response = await apiResponse.patch(
          `/project/${projectId}/model`,
          { imageModel: model },
          { withCredentials: true }
        );
        if (response.data?.success) {
          setProject((prev) => (prev ? { ...prev, imageModel: model } : null));
          setImageModel(model);
          toast({
            title: "Model updated",
            description: `Project is now using ${model}`,
          });
        }
      } catch (err) {
        console.error("Failed to update model:", err);
        toast({
          title: "Error",
          description: "Failed to update model",
          variant: "destructive",
        });
      }
    },
    []
  );

  const handleLocalStorageDraft = useCallback(
    async (project: IDesignProject) => {
      // Use a local guard to prevent concurrent execution even if state hasn't updated yet
      if (
        !project ||
        (project.messages && project.messages.length > 0) ||
        isProcessingDraft ||
        hasProcessedDraftRef.current
      ) {
        return;
      }
      const draft = localStorage.getItem("newData");

      if (!draft) return;

      try {
        setIsProcessingDraft(true);
        hasProcessedDraftRef.current = true;
        const parsed = JSON.parse(draft);
        const prompt = parsed.prompt;
        const metadata = parsed.metadata || {};

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


        // Set restored files to attachedFiles state so they show in the UI
        if (restoredFiles.length > 0) {
          setAttachedFiles(restoredFiles);
        }

        // Use backend AI classifier to decide routing — handles typos + follow-ups correctly
        const isAgenticPrompt = await classifyPrompt(prompt);

        if (isAgenticPrompt) {
          try {
            let agentFiles: any[] = [];
            
            if (restoredFiles.length > 0) {
              const formData = new FormData();
              let hasUploads = false;
              for (const file of restoredFiles as any[]) {
                if (file instanceof File || file instanceof Blob) {
                  formData.append("files", file);
                  hasUploads = true;
                }
              }
              
              if (hasUploads) {
                const res = await apiResponseFileUpload.post("/agents/upload", formData);
                agentFiles = res.data.files || [];
              } else {
                agentFiles = restoredFiles.map((f: any) => ({
                  name: f.name || "file",
                  type: f.type || "application/octet-stream",
                  url: f.filePath || f.url
                }));
              }
            }

            if (selectedFiles && selectedFiles.length > 0) {
              const selectedAgentFiles = selectedFiles.map((url: string) => ({
                name: url.split("/").pop() || "selected-file",
                type: url.endsWith(".png") ? "image/png" : "image/jpeg",
                url: url
              }));
              agentFiles = [...agentFiles, ...selectedAgentFiles];
            }

            await startAgentRun({
              projectId: project._id,
              prompt,
              attachedFiles: agentFiles.length > 0 ? agentFiles : undefined,
            });
          } catch (err) {
            console.error("Failed to start agent run", err);
          }
        } else {
          // Pass restored File objects to generateMessage
          await generateMessage(
            prompt,
            restoredFiles.length > 0 ? restoredFiles : null,
            project._id,
            selectedFiles,
            metadata
          );
        }
        // Remove draft after successful generation
        localStorage.removeItem("newData");
      } catch (error) {
        console.error("Error processing localStorage draft:", error);
        localStorage.removeItem("newData");
      } finally {
        setIsProcessingDraft(false);
        clearInput();
      }
    },
    [setAttachedFiles, generateMessage]
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
    designTypeId?: string,
    orientation?: string | null,
    customSize?: { width: string; height: string } | null,
    metadata?: Record<string, any>
  ) => {
    let category;

    if (selectedFiles && selectedFiles?.length >= 1) {
      category = "auto";
    } else {
      category = designTypeId;
    }

    const newProject = {
      title: value,
      status: ProjectStatus.ACTIVE,
      userId,
      userName,
      collaborators: [],
      messages: [],
      category: category,
      orientation: orientation || undefined,
      customSize: customSize || undefined,
      metadata: metadata || undefined,
      imageModel: imageModel || undefined,
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
            metadata: metadata || {},
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

      // Reset draft processing flags only when switching to a DIFFERENT project
      if (projectId !== lastFetchedProjectIdRef.current) {
        hasProcessedDraftRef.current = false;
        setIsProcessingDraft(false);
      }

      setIsLoadingProject(true);
      setError(null);

      try {
        const response = await apiResponse.get(`/project/${projectId}`, {
          withCredentials: true,
        });

        if (response.status == 200) {
          const projectData = response.data.project;

          // Use string normalization for safer comparisons with Object IDs
          const currentIdStr = String(
            projectData?._id || projectData?.id || ""
          );

          // If switching to a different project, reset UI message state first
          if (lastFetchedProjectIdRef.current !== currentIdStr) {
            // Update the ref immediately to prevent the isolation useEffect from wiping out these messages
            projectIdRef.current = currentIdStr;
            lastFetchedProjectIdRef.current = currentIdStr;
            setMessages([]);
            setStreamingContent("");
            setStreamingAnalysis("");
            setIsTyping(false);
          }

          if (projectData.imageModel) {
            setImageModel(projectData.imageModel);
          }

          if (projectData.metadata?.finalizedSelections) {
            const selections = projectData.metadata.finalizedSelections;
            isHydratingRef.current = true;
            if (selections.selectedColorScales) {
              setSelectedColorScales(selections.selectedColorScales);
            }
            if (selections.primaryFont) {
              setPrimaryFont(selections.primaryFont);
            }
            // Briefly wait for state updates to propagate
            setTimeout(() => {
              isHydratingRef.current = false;
            }, 100);
          }

          setProject(projectData);

          if (Array.isArray(projectData?.messages)) {
            if (projectData.messages.length > 0) {
            }
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

  const deleteMessage = async (messageId: string) => {
    try {
      if (!project?._id) {
        console.error("No project ID available");
        return;
      }

      // Find the message index
      const messageIndex = messagesRef.current.findIndex(
        (msg: any) => msg.id === messageId || msg._id === messageId
      );

      if (messageIndex === -1) {
        console.error(`Message ${messageId} not found`);
        return;
      }

      const message = messagesRef.current[messageIndex];
      let deleteFromIndex = messageIndex;

      // If deleting an AI message, also delete the preceding user message
      if (message.type === "ai" && messageIndex > 0) {
        const precedingMessage = messagesRef.current[messageIndex - 1];
        if (precedingMessage.type === "user") {
          deleteFromIndex = messageIndex - 1;
        }
      }

      // Delete the message(s) and all subsequent messages
      const updatedMessages = messagesRef.current.slice(0, deleteFromIndex);

      // Update local state
      setMessages(updatedMessages);

      // Update on server
      try {
        const projectId = project._id;
        const response = await apiResponse.delete(
          `/project/${projectId}/messages`,
          {
            data: { messageId },
            withCredentials: true,
          }
        );

        if (response.data?.success) {
          toast({
            title: "Success",
            description: "Messages deleted successfully",
          });
        } else {
          throw new Error(
            response.data?.message || "Failed to delete from server"
          );
        }
      } catch (apiError: any) {
        console.error("Error updating messages on server:", apiError);
        toast({
          title: "Deletion error",
          description:
            apiError?.message ||
            "Local messages cleared, but server update failed.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: error?.message || "Could not delete message",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addReaction = async (
    messageId: string,
    type: "like" | "dislike" | "comment"
  ) => {
    try {
      if (!project?._id) {
        console.error("No project ID available");
        return;
      }


      // Update local state optimistically
      setMessages((prev: any[]) =>
        prev.map((msg: any) => {
          if (msg.id === messageId || msg._id === messageId) {
            return {
              ...msg,
              feedback: {
                ...msg.feedback,
                [type]: (msg.feedback?.[type] || 0) + 1,
                userReaction:
                  type === "like"
                    ? "like"
                    : type === "dislike"
                      ? "dislike"
                      : msg.feedback?.userReaction,
              },
            };
          }
          return msg;
        })
      );

      // Update on server
      await apiResponse.post(
        `/project/${project._id}/messages/${messageId}/reactions`,
        { type },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error adding reaction:", error);
      throw error;
    }
  };

  const removeReaction = async (
    messageId: string,
    type: "like" | "dislike" | "comment"
  ) => {
    try {
      if (!project?._id) {
        console.error("No project ID available");
        return;
      }

      // Update local state optimistically
      setMessages((prev: any[]) =>
        prev.map((msg: any) => {
          if (msg.id === messageId || msg._id === messageId) {
            const currentCount = msg.feedback?.[type] || 0;
            return {
              ...msg,
              feedback: {
                ...msg.feedback,
                [type]: Math.max(0, currentCount - 1),
                userReaction:
                  type === "like" || type === "dislike"
                    ? null
                    : msg.feedback?.userReaction,
              },
            };
          }
          return msg;
        })
      );

      // Update on server
      await apiResponse.delete(
        `/project/${project._id}/messages/${messageId}/reactions/${type}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error removing reaction:", error);
      throw error;
    }
  };

  const handleGenerationItemClick = (generationId: string) => {
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
    setSelectedFiles([]);
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
        isGeneratingImage,
        generatingForMessageId,
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
        isProcessingDraft,
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
        focusedGenerationId,
        setFocusedGenerationId,
        selectedColorScales,
        setSelectedColorScales,
        activeGenerationId,
        setActiveGenerationId,
        inputMode,
        setInputMode,
        generationMode,
        setGenerationMode,
        primaryFont,
        setPrimaryFont,
        brandSaveStatus,
        liveNodes,
        addLiveNode,
        aiStatus,
        setAiStatus,
        imageModel,
        setImageModel,
        updateProjectModel,
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
