"use client";

import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import { useCallback, useRef, useState } from "react";

export interface GenerationEvent {
  event: string;
  data: any;
}

export interface ProjectInfo {
  projectId: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  deploymentUrl?: string;
  isNewProject: boolean;
  createdAt: string;
}

export interface GenerationState {
  isGenerating: boolean;
  isConnected: boolean;
  currentStep: string;
  progress: number;
  events: GenerationEvent[];
  projectInfo: ProjectInfo | null;
  error: string | null;
  generatedContent: string;
  deploymentUrl: string | null;
}

export function useChatGeneration() {
  console.log("🎣 [HOOK_INIT] useChatGeneration hook initialized");

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    isConnected: false,
    currentStep: "",
    progress: 0,
    events: [],
    projectInfo: null,
    error: null,
    generatedContent: "",
    deploymentUrl: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateState = useCallback((updates: Partial<GenerationState>) => {
    console.log("🔄 [STATE_UPDATE] Updating state:", updates);
    setState((prev) => {
      const newState = { ...prev, ...updates };
      console.log("📊 [STATE_CURRENT] Current state:", {
        isGenerating: newState.isGenerating,
        isConnected: newState.isConnected,
        currentStep: newState.currentStep,
        progress: newState.progress,
        eventsCount: newState.events.length,
        hasProjectInfo: !!newState.projectInfo,
        hasError: !!newState.error,
        contentLength: newState.generatedContent.length,
        deploymentUrl: newState.deploymentUrl,
      });
      return newState;
    });
  }, []);

  const addEvent = useCallback((event: GenerationEvent) => {
    console.log("📨 [EVENT_ADD] Adding new event:", event);
    setState((prev) => {
      const newEvents = [...prev.events, event];
      console.log("📋 [EVENTS_TOTAL] Total events:", newEvents.length);
      return {
        ...prev,
        events: newEvents,
      };
    });
  }, []);

  const generateProject = useCallback(
    async (prompt: string, files: File[] = [], projectId?: string) => {
      const startTime = Date.now();
      console.log("🚀 [GENERATE_START] Starting project generation");
      console.log("📝 [GENERATE_PARAMS] Parameters:", {
        promptLength: prompt.length,
        filesCount: files.length,
        projectId: projectId || "new project",
        timestamp: new Date().toISOString(),
      });

      // Reset state
      console.log("🔄 [STATE_RESET] Resetting generation state");
      updateState({
        isGenerating: true,
        isConnected: false,
        currentStep: "Initializing...",
        progress: 0,
        events: [],
        error: null,
        generatedContent: "",
        deploymentUrl: null,
        projectInfo: null,
      });

      try {
        // Create abort controller for cancellation
        console.log("🛑 [ABORT_CONTROLLER] Creating abort controller");
        abortControllerRef.current = new AbortController();

        // Prepare form data
        console.log("📦 [FORM_DATA] Preparing form data");
        const formData = new FormData();
        formData.append("prompt", prompt);

        if (projectId) {
          console.log("📁 [PROJECT_ID] Using existing project ID:", projectId);
          formData.append("projectId", projectId);
        } else {
          console.log("🆕 [NEW_PROJECT] Creating new project");
        }

        // Add files to form data
        console.log("📎 [FILES_PROCESSING] Processing files for upload");
        files.forEach((file, index) => {
          console.log(`📄 [FILE_${index + 1}] Adding file:`, {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified).toISOString(),
          });
          formData.append("files", file);
        });

        updateState({
          currentStep: "Uploading files and starting generation...",
          progress: 5,
        });

        console.log("📤 [UPLOAD_START] Starting file upload to /chat/generate");

        // Use your custom axios instance for file upload
        const response = await apiResponseFileUpload.post(
          "/chat/generate",
          formData,
          {
            signal: abortControllerRef.current.signal,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const uploadProgress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log("📊 [UPLOAD_PROGRESS] Upload progress:", {
                  loaded: progressEvent.loaded,
                  total: progressEvent.total,
                  percentage: uploadProgress,
                });
                updateState({
                  currentStep: `Uploading files... ${uploadProgress}%`,
                  progress: Math.min(5 + uploadProgress * 0.15, 20),
                });
              }
            },
          }
        );

        console.log("✅ [UPLOAD_COMPLETE] File upload completed");
        console.log("📋 [RESPONSE_STATUS] Response status:", response.status);
        console.log("📄 [RESPONSE_DATA] Response data:", response.data);

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the SSE endpoint from response
        const { sseEndpoint, sessionId } = response.data;
        console.log("🔗 [SSE_INFO] SSE connection info:", {
          sseEndpoint,
          sessionId,
        });

        updateState({
          currentStep: "Connecting to generation stream...",
          progress: 25,
        });

        // Connect to SSE stream with authentication
        console.log("🌐 [SSE_URL] Building SSE URL");
        const sseUrl = new URL(sseEndpoint, window.location.origin);

        // Add authentication to SSE connection
        console.log("🔐 [AUTH_TOKEN] Extracting authentication token");
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("gennituToken="))
          ?.split("=")[1];

        if (token) {
          console.log("✅ [AUTH_TOKEN] Token found, adding to SSE URL");
          sseUrl.searchParams.append("token", token);
        } else {
          console.log("⚠️ [AUTH_TOKEN] No token found in cookies");
        }

        console.log("🔗 [SSE_CONNECT] Connecting to SSE:", sseUrl.toString());
        eventSourceRef.current = new EventSource(sseUrl.toString());

        eventSourceRef.current.onopen = () => {
          console.log("✅ [SSE_OPEN] SSE connection opened successfully");
          updateState({
            isConnected: true,
            currentStep: "Connected to generation stream",
            progress: 30,
          });
        };

        eventSourceRef.current.onmessage = (event) => {
          console.log("📨 [SSE_MESSAGE] Raw SSE message received:", {
            data: event.data,
            lastEventId: event.lastEventId,
            origin: event.origin,
            type: event.type,
            timestamp: new Date().toISOString(),
          });

          try {
            const data = JSON.parse(event.data);
            console.log("📊 [SSE_PARSED] Parsed SSE data:", data);

            const generationEvent: GenerationEvent = {
              event: data.event || "message",
              data: data.data || data,
            };

            console.log(
              "🎯 [EVENT_PROCESSED] Processed generation event:",
              generationEvent
            );
            addEvent(generationEvent);

            // Handle different event types
            console.log(
              "🔀 [EVENT_SWITCH] Processing event type:",
              generationEvent.event
            );

            switch (generationEvent.event) {
              case "connected":
                console.log("🔗 [EVENT_CONNECTED] Connection confirmed");
                updateState({
                  currentStep: "Connected",
                  progress: 35,
                });
                break;

              case "generating_project_info":
                console.log(
                  "📝 [EVENT_PROJECT_INFO] Generating project information"
                );
                updateState({
                  currentStep: "Generating project information...",
                  progress: 40,
                });
                break;

              case "project_created":
                console.log(
                  "🎉 [EVENT_PROJECT_CREATED] Project created:",
                  generationEvent.data
                );
                updateState({
                  projectInfo: generationEvent.data,
                  currentStep: `Project created: ${generationEvent.data.title}`,
                  progress: 45,
                });
                break;

              case "processing_files":
                console.log(
                  "📎 [EVENT_FILES] Processing files:",
                  generationEvent.data
                );
                updateState({
                  currentStep: `Processing ${
                    generationEvent.data.count || generationEvent.data.fileCount
                  } files...`,
                  progress: 50,
                });
                break;

              case "image_analyzed":
                console.log(
                  "🖼️ [EVENT_IMAGE] Image analyzed:",
                  generationEvent.data
                );
                break;

              case "checking_cache":
                console.log(
                  "💾 [EVENT_CACHE_CHECK] Checking cache:",
                  generationEvent.data
                );
                updateState({
                  currentStep: "Checking cache for similar projects...",
                  progress: 55,
                });
                break;

              case "cache_hit":
                console.log("✅ [EVENT_CACHE_HIT] Cache hit found");
                updateState({
                  currentStep: "Found cached result!",
                  progress: 90,
                });
                break;

              case "cache_miss":
                console.log("❌ [EVENT_CACHE_MISS] No cache found");
                updateState({
                  currentStep: "No cache found, generating fresh content...",
                  progress: 60,
                });
                break;

              case "generating_embedding":
                console.log("🧠 [EVENT_EMBEDDING] Generating embedding");
                updateState({
                  currentStep: "Generating semantic embedding...",
                  progress: 62,
                });
                break;

              case "searching_boilerplates":
                console.log(
                  "🔍 [EVENT_BOILERPLATE_SEARCH] Searching boilerplates"
                );
                updateState({
                  currentStep: "Finding similar boilerplates...",
                  progress: 65,
                });
                break;

              case "boilerplates_found":
                console.log(
                  "📋 [EVENT_BOILERPLATES] Boilerplates found:",
                  generationEvent.data
                );
                updateState({
                  currentStep: `Found ${generationEvent.data.count} similar templates`,
                  progress: 67,
                });
                break;

              case "ai_generation_started":
                console.log("🤖 [EVENT_AI_START] AI generation started");
                updateState({
                  currentStep: "AI is generating your code...",
                  progress: 70,
                });
                break;

              case "ai_chunk":
                const chunkContent = generationEvent.data.content || "";
                console.log("📝 [EVENT_AI_CHUNK] AI chunk received:", {
                  chunkLength: chunkContent.length,
                  chunk:
                    chunkContent.slice(0, 100) +
                    (chunkContent.length > 100 ? "..." : ""),
                });
                setState((prev) => {
                  const newContent = prev.generatedContent + chunkContent;
                  const newProgress = Math.min(prev.progress + 0.5, 85);
                  console.log("📊 [CONTENT_UPDATE] Content updated:", {
                    totalLength: newContent.length,
                    progress: newProgress,
                  });
                  return {
                    ...prev,
                    generatedContent: newContent,
                    progress: newProgress,
                  };
                });
                break;

              case "files_generated":
                console.log(
                  "📁 [EVENT_FILES_GENERATED] Files generated:",
                  generationEvent.data
                );
                updateState({
                  currentStep: `Generated ${generationEvent.data.fileCount} files`,
                  progress: 88,
                });
                break;

              case "cached_result":
                console.log("💾 [EVENT_CACHED] Result cached");
                break;

              case "deployment_started":
                console.log("🚀 [EVENT_DEPLOY_START] Deployment started");
                updateState({
                  currentStep: "Deploying to Vercel...",
                  progress: 90,
                });
                break;

              case "deployment_progress":
                console.log(
                  "📊 [EVENT_DEPLOY_PROGRESS] Deployment progress:",
                  generationEvent.data
                );
                updateState({
                  currentStep: `Deployment: ${generationEvent.data.status}`,
                  progress: 92 + (generationEvent.data.progress || 0) * 0.05,
                });
                break;

              case "deployment_complete":
                console.log(
                  "✅ [EVENT_DEPLOY_COMPLETE] Deployment complete:",
                  generationEvent.data
                );
                updateState({
                  currentStep: "Deployment complete!",
                  deploymentUrl: generationEvent.data.url,
                  progress: 98,
                });
                break;

              case "deployment_failed":
                console.log(
                  "❌ [EVENT_DEPLOY_FAILED] Deployment failed:",
                  generationEvent.data
                );
                updateState({
                  currentStep: "Deployment failed",
                  progress: 90,
                });
                break;

              case "generation_complete":
                console.log(
                  "🎉 [EVENT_COMPLETE] Generation complete:",
                  generationEvent.data
                );
                const endTime = Date.now();
                console.log(
                  "⏱️ [GENERATION_TIME] Total generation time:",
                  endTime - startTime,
                  "ms"
                );
                updateState({
                  isGenerating: false,
                  currentStep: "Generation complete!",
                  progress: 100,
                  projectInfo: generationEvent.data,
                  deploymentUrl: generationEvent.data.deploymentUrl,
                });
                break;

              case "error":
                console.error(
                  "❌ [EVENT_ERROR] Error event received:",
                  generationEvent.data
                );
                updateState({
                  isGenerating: false,
                  error: generationEvent.data.message || "An error occurred",
                  currentStep: "Error occurred",
                });
                break;

              case "warning":
                console.warn(
                  "⚠️ [EVENT_WARNING] Warning event:",
                  generationEvent.data
                );
                addEvent({
                  event: "warning",
                  data: {
                    message: generationEvent.data.message,
                    timestamp: new Date().toISOString(),
                  },
                });
                break;

              case "info":
                console.log(
                  "ℹ️ [EVENT_INFO] Info event:",
                  generationEvent.data
                );
                updateState({
                  currentStep: generationEvent.data.message || "Processing...",
                });
                break;

              default:
                console.log(
                  "❓ [EVENT_UNKNOWN] Unknown event type:",
                  generationEvent.event,
                  generationEvent.data
                );
                updateState({
                  currentStep: generationEvent.data.message || "Processing...",
                });
            }
          } catch (error) {
            console.error(
              "❌ [SSE_PARSE_ERROR] Error parsing SSE data:",
              error
            );
            console.error(
              "📄 [SSE_RAW_DATA] Raw data that failed to parse:",
              event.data
            );
            addEvent({
              event: "parse_error",
              data: {
                error: error instanceof Error ? error.message : "Unknown error",
                rawData: event.data,
                timestamp: new Date().toISOString(),
              },
            });
          }
        };

        eventSourceRef.current.onerror = (error) => {
          console.error("❌ [SSE_ERROR] SSE connection error:", error);
          console.error("🔍 [SSE_ERROR_DETAILS] Error details:", {
            readyState: eventSourceRef.current?.readyState,
            url: eventSourceRef.current?.url,
            timestamp: new Date().toISOString(),
          });
          updateState({
            isGenerating: false,
            isConnected: false,
            error: "Connection error occurred. Please try again.",
          });
        };

        // Handle connection timeout
        console.log("⏰ [TIMEOUT_SET] Setting connection timeout (30s)");
        const connectionTimeout = setTimeout(() => {
          if (eventSourceRef.current && !state.isConnected) {
            console.error("⏰ [TIMEOUT_REACHED] Connection timeout reached");
            eventSourceRef.current.close();
            updateState({
              isGenerating: false,
              error: "Connection timeout. Please try again.",
            });
          }
        }, 30000); // 30 second timeout

        // Clear timeout when connected
        if (state.isConnected) {
          console.log("✅ [TIMEOUT_CLEAR] Clearing connection timeout");
          clearTimeout(connectionTimeout);
        }
      } catch (error: any) {
        const endTime = Date.now();
        console.error(
          "❌ [GENERATE_ERROR] Generation error after",
          endTime - startTime,
          "ms:",
          error
        );
        console.error("🔍 [ERROR_STACK] Error stack:", error.stack);

        if (error.name === "AbortError") {
          console.log("🛑 [GENERATE_CANCELLED] Generation cancelled by user");
          updateState({
            isGenerating: false,
            currentStep: "Generation cancelled",
            error: null,
          });
        } else if (error.response) {
          // Axios error with response
          console.error("📡 [HTTP_ERROR] HTTP error response:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers,
          });
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
          updateState({
            isGenerating: false,
            error: errorMessage,
            currentStep: "Error occurred",
          });
        } else if (error.request) {
          // Network error
          console.error("🌐 [NETWORK_ERROR] Network error:", error.request);
          updateState({
            isGenerating: false,
            error: "Network error. Please check your connection and try again.",
            currentStep: "Network error",
          });
        } else {
          // Other error
          console.error("❓ [UNKNOWN_ERROR] Unknown error:", error.message);
          updateState({
            isGenerating: false,
            error: error.message || "Failed to start generation",
            currentStep: "Error occurred",
          });
        }
      }
    },
    [updateState, addEvent, state.isConnected]
  );

  const cancelGeneration = useCallback(() => {
    console.log("🛑 [CANCEL_START] Cancelling generation");

    if (abortControllerRef.current) {
      console.log("🛑 [ABORT_CONTROLLER] Aborting HTTP request");
      abortControllerRef.current.abort();
    }

    if (eventSourceRef.current) {
      console.log("🔌 [SSE_CLOSE] Closing SSE connection");
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    console.log("✅ [CANCEL_COMPLETE] Generation cancelled successfully");
    updateState({
      isGenerating: false,
      isConnected: false,
      currentStep: "Cancelled",
      error: null,
    });
  }, [updateState]);

  const clearError = useCallback(() => {
    console.log("🧹 [CLEAR_ERROR] Clearing error state");
    updateState({ error: null });
  }, [updateState]);

  const resetState = useCallback(() => {
    console.log("🔄 [RESET_STATE] Resetting all state");
    setState({
      isGenerating: false,
      isConnected: false,
      currentStep: "",
      progress: 0,
      events: [],
      projectInfo: null,
      error: null,
      generatedContent: "",
      deploymentUrl: null,
    });
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    console.log("🧹 [CLEANUP] Cleaning up resources");
    if (eventSourceRef.current) {
      console.log("🔌 [CLEANUP_SSE] Closing SSE connection");
      eventSourceRef.current.close();
    }
    if (abortControllerRef.current) {
      console.log("🛑 [CLEANUP_ABORT] Aborting HTTP request");
      abortControllerRef.current.abort();
    }
  }, []);

  // Auto-cleanup on component unmount
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  console.log("📊 [HOOK_STATE] Current hook state:", {
    isGenerating: state.isGenerating,
    isConnected: state.isConnected,
    currentStep: state.currentStep,
    progress: state.progress,
    eventsCount: state.events.length,
    hasProjectInfo: !!state.projectInfo,
    hasError: !!state.error,
    contentLength: state.generatedContent.length,
    deploymentUrl: state.deploymentUrl,
  });

  return {
    ...state,
    generateProject,
    cancelGeneration,
    clearError,
    resetState,
    cleanup,
  };
}
