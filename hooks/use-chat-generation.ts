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
    setState((prev) => {
      const newState = { ...prev, ...updates };
      return newState;
    });
  }, []);

  const addEvent = useCallback((event: GenerationEvent) => {
    setState((prev) => {
      const newEvents = [...prev.events, event];
      return {
        ...prev,
        events: newEvents,
      };
    });
  }, []);

  const generateProject = useCallback(
    async (prompt: string, files: File[] = [], projectId?: string) => {
      const startTime = Date.now();

      // Reset state
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
        abortControllerRef.current = new AbortController();

        // Prepare form data
        const formData = new FormData();
        formData.append("prompt", prompt);

        if (projectId) {
          formData.append("projectId", projectId);
        } else {
        }

        // Add files to form data
        files.forEach((file, index) => {
          formData.append("files", file);
        });

        updateState({
          currentStep: "Uploading files and starting generation...",
          progress: 5,
        });

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
                updateState({
                  currentStep: `Uploading files... ${uploadProgress}%`,
                  progress: Math.min(5 + uploadProgress * 0.15, 20),
                });
              }
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the SSE endpoint from response
        const { sseEndpoint, sessionId } = response.data;

        updateState({
          currentStep: "Connecting to generation stream...",
          progress: 25,
        });

        // Connect to SSE stream with authentication
        const sseUrl = new URL(sseEndpoint, window.location.origin);

        // Add authentication to SSE connection
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("genituToken="))
          ?.split("=")[1];

        if (token) {
          sseUrl.searchParams.append("token", token);
        } else {
        }

        eventSourceRef.current = new EventSource(sseUrl.toString());

        eventSourceRef.current.onopen = () => {
          updateState({
            isConnected: true,
            currentStep: "Connected to generation stream",
            progress: 30,
          });
        };

        eventSourceRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            const generationEvent: GenerationEvent = {
              event: data.event || "message",
              data: data.data || data,
            };

            addEvent(generationEvent);

            // Handle different event types

            switch (generationEvent.event) {
              case "connected":
                updateState({
                  currentStep: "Connected",
                  progress: 35,
                });
                break;

              case "generating_project_info":
                updateState({
                  currentStep: "Generating project information...",
                  progress: 40,
                });
                break;

              case "project_created":
                updateState({
                  projectInfo: generationEvent.data,
                  currentStep: `Project created: ${generationEvent.data.title}`,
                  progress: 45,
                });
                break;

              case "processing_files":
                updateState({
                  currentStep: `Processing ${
                    generationEvent.data.count || generationEvent.data.fileCount
                  } files...`,
                  progress: 50,
                });
                break;

              case "image_analyzed":
                break;

              case "checking_cache":
                updateState({
                  currentStep: "Checking cache for similar projects...",
                  progress: 55,
                });
                break;

              case "cache_hit":
                updateState({
                  currentStep: "Found cached result!",
                  progress: 90,
                });
                break;

              case "cache_miss":
                updateState({
                  currentStep: "No cache found, generating fresh content...",
                  progress: 60,
                });
                break;

              case "generating_embedding":
                updateState({
                  currentStep: "Generating semantic embedding...",
                  progress: 62,
                });
                break;

              case "searching_boilerplates":
                updateState({
                  currentStep: "Finding similar boilerplates...",
                  progress: 65,
                });
                break;

              case "boilerplates_found":
                updateState({
                  currentStep: `Found ${generationEvent.data.count} similar templates`,
                  progress: 67,
                });
                break;

              case "ai_generation_started":
                updateState({
                  currentStep: "AI is generating your code...",
                  progress: 70,
                });
                break;

              case "ai_chunk":
                const chunkContent = generationEvent.data.content || "";
                setState((prev) => {
                  const newContent = prev.generatedContent + chunkContent;
                  const newProgress = Math.min(prev.progress + 0.5, 85);
                  return {
                    ...prev,
                    generatedContent: newContent,
                    progress: newProgress,
                  };
                });
                break;

              case "files_generated":
                updateState({
                  currentStep: `Generated ${generationEvent.data.fileCount} files`,
                  progress: 88,
                });
                break;

              case "cached_result":
                break;

              case "deployment_started":
                updateState({
                  currentStep: "Deploying to Vercel...",
                  progress: 90,
                });
                break;

              case "deployment_progress":
                updateState({
                  currentStep: `Deployment: ${generationEvent.data.status}`,
                  progress: 92 + (generationEvent.data.progress || 0) * 0.05,
                });
                break;

              case "deployment_complete":
                updateState({
                  currentStep: "Deployment complete!",
                  deploymentUrl: generationEvent.data.url,
                  progress: 98,
                });
                break;

              case "deployment_failed":
                updateState({
                  currentStep: "Deployment failed",
                  progress: 90,
                });
                break;

              case "generation_complete":
                const endTime = Date.now();
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
                updateState({
                  currentStep: generationEvent.data.message || "Processing...",
                });
                break;

              default:
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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    updateState({
      isGenerating: false,
      isConnected: false,
      currentStep: "Cancelled",
      error: null,
    });
  }, [updateState]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const resetState = useCallback(() => {
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
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Auto-cleanup on component unmount
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  return {
    ...state,
    generateProject,
    cancelGeneration,
    clearError,
    resetState,
    cleanup,
  };
}
