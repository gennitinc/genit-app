"use client";

import { LoadingFileLoader } from "./utils/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { apiResponse } from "@/utils/apiResponse";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import {
  CheckCircle,
  Crown,
  Database,
  FileText,
  FolderPlus,
  Globe,
  ImageIcon,
  Info,
  Loader2,
  MessageCircle,
  Mic,
  Mic2,
  Music,
  Network,
  Play,
  Plus,
  Search,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";

interface FloatingSidebarProps {
  onAddIntegration: (type: string, data?: any) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomToFit?: () => void;
  slug?: string;
}

export function FloatingSidebar({
  onAddIntegration,
  onUndo,
  onRedo,
  onZoomToFit,
  slug,
}: FloatingSidebarProps) {
  const [showModal, setShowModal] = useState(false);
  const [inputData, setInputData] = useState({
    url: "",
    title: "",
    description: "",
    content: "",
    videoId: "",
    thumbnail: "" as string | null,
    type: "",
    platform: "",
    transcript: "",
    instruction: "",
    status: "public" as "public" | "private",
    hasInstruction: false,
    duration: "",
    size: "",
    alreadyInBrain: false,
  });
  const [selectedIntegrationType, setSelectedIntegrationType] = useState<
    string | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [addSubTab, setAddSubTab] = useState("url");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<
    string | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  // User's uploaded files (empty by default)
  const [userFiles, setUserFiles] = useState<{
    audio: any[];
    video: any[];
    image: any[];
    document: any[];
  }>({
    audio: [],
    video: [],
    image: [],
    document: [],
  });

  const [historyItems, setHistoryItems] = useState<{
    [key: string]: any[];
  }>({
    all: [],
    image: [],
    video: [],
    audio: [],
    text: [],
    docs: [],
    social: [],
  });

  const [historyPagination, setHistoryPagination] = useState<{
    [key: string]: {
      page: number;
      hasMore: boolean;
      isLoading: boolean;
    };
  }>({
    all: { page: 1, hasMore: true, isLoading: false },
    image: { page: 1, hasMore: true, isLoading: false },
    video: { page: 1, hasMore: true, isLoading: false },
    audio: { page: 1, hasMore: true, isLoading: false },
    text: { page: 1, hasMore: true, isLoading: false },
    docs: { page: 1, hasMore: true, isLoading: false },
    social: { page: 1, hasMore: true, isLoading: false },
  });

  const lastLoadedPage = useRef<Record<string, number>>({});

  const fetchHistory = useCallback(
    async (category: string, isLoadMore = false) => {
      let page = 1;
      let currentIsLoading = false;
      let hasMore = true;

      setHistoryPagination((prev) => {
        currentIsLoading = prev[category].isLoading;
        page = isLoadMore ? prev[category].page + 1 : 1;
        hasMore = prev[category].hasMore;

        // GUARD: If already loading OR if this page was already successfully loaded, ABORT
        if (currentIsLoading || (!hasMore && isLoadMore)) return prev;
        if (isLoadMore && lastLoadedPage.current[category] >= page) return prev;

        return {
          ...prev,
          [category]: { ...prev[category], isLoading: true },
        };
      });

      if (
        currentIsLoading ||
        (isLoadMore && lastLoadedPage.current[category] >= page) ||
        (!hasMore && isLoadMore)
      ) {
        return;
      }

      try {
        const limit = 20;
        let items: any[] = [];
        let newHasMore = false;

        if (category === "image" || category === "all") {
          const res = await apiResponse.get(
            `/project/myprojects?type=ai-image-gen&page=${page}&limit=${limit}`,
            { withCredentials: true }
          );
          if (res.data?.success) {
            const fetchedItems = res.data.projects
              .filter((p: any) => p.imageData)
              .map((p: any) => ({
                id: p._id,
                _id: p._id,
                type: "image",
                url: p.imageData.url,
                thumbnail: p.imageData.thumbnail || p.imageData.url,
                prompt: p.imageData.prompt,
                createdAt: p.createdAt,
                name: p.title || "Generated Image",
              }));
            items = [...items, ...fetchedItems];
            newHasMore = res.data.pagination?.hasNextPage || false;
          }
        }

        if (category === "video" || category === "all") {
          const res = await apiResponse.get(
            `/project/myprojects?type=ai-video-gen&page=${page}&limit=${limit}`,
            { withCredentials: true }
          );
          if (res.data?.success) {
            const fetchedItems = res.data.projects
              .filter((p: any) => p.videoData)
              .map((p: any) => ({
                id: p._id,
                _id: p._id,
                type: "video",
                url: p.videoData.url,
                thumbnail: p.videoData.thumbnail || p.videoData.url,
                prompt: p.videoData.prompt,
                createdAt: p.createdAt,
                name: p.title || "Generated Video",
              }));
            items = [...items, ...fetchedItems];
            if (!newHasMore)
              newHasMore = res.data.pagination?.hasNextPage || false;
          }
        }

        if (category === "audio" || category === "all") {
          const res = await apiResponse.get(
            `/inspire/generate/audio/history?page=${page}&limit=${limit}`,
            { withCredentials: true }
          );
          if (res.data?.success) {
            const fetchedItems = res.data.data.map((p: any) => ({
              id: p._id,
              _id: p._id,
              type: "audio",
              url: p.url,
              prompt: p.prompt,
              createdAt: p.createdAt,
              name: "Generated Audio",
            }));
            items = [...items, ...fetchedItems];
            if (!newHasMore)
              newHasMore = res.data.pagination?.hasNextPage || false;
          }
        }

        if (
          category === "text" ||
          category === "all" ||
          category === "docs" ||
          category === "social"
        ) {
          const typeFilter = category === "all" ? undefined : category;
          const res = await apiResponse.get(
            `/inspire/generate/text/history?${typeFilter ? `type=${typeFilter}&` : ""}page=${page}&limit=${limit}`,
            { withCredentials: true }
          );
          if (res.data?.success) {
            const fetchedItems = res.data.data.map((p: any) => ({
              id: p._id,
              _id: p._id,
              type: p.type || "text",
              content: p.content,
              prompt: p.prompt,
              createdAt: p.createdAt,
              name:
                p.type === "social"
                  ? "Social Post"
                  : p.type === "docs"
                    ? "Document"
                    : "Generated Text",
            }));
            items = [...items, ...fetchedItems];
            if (!newHasMore)
              newHasMore = res.data.pagination?.hasNextPage || false;
          }
        }

        // Sort combined items by date
        if (category === "all") {
          items.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        // Atomic update for both items and page state
        setHistoryItems((prev) => ({
          ...prev,
          [category]: isLoadMore ? [...prev[category], ...items] : items,
        }));

        setHistoryPagination((prev) => ({
          ...prev,
          [category]: { page, hasMore: newHasMore, isLoading: false },
        }));

        // Update the red to track successful load
        lastLoadedPage.current[category] = page;
      } catch (error) {
        setHistoryPagination((prev) => ({
          ...prev,
          [category]: { ...prev[category], isLoading: false },
        }));
      }
    },
    []
  ); // Removed historyPagination dependency completely

  // sentinel component for infinite scroll
  const HistorySentinel = ({ category }: { category: string }) => {
    const sentinelRef = React.useRef<HTMLDivElement>(null);
    const pagination = historyPagination[category];

    useEffect(() => {
      if (!sentinelRef.current || !pagination.hasMore || pagination.isLoading)
        return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !pagination.isLoading) {
            fetchHistory(category, true);
          }
        },
        { rootMargin: "50px" }
      ); // Reduced margin to prevent premature triggers

      observer.observe(sentinelRef.current);
      return () => observer.disconnect();
    }, [category, pagination.hasMore, pagination.isLoading]);

    if (!pagination.hasMore && !pagination.isLoading) return null;

    return (
      <div
        ref={sentinelRef}
        className='flex min-h-fit w-full flex-col items-center justify-center py-4'
      >
        {pagination.isLoading && (
          <div className='flex flex-col items-center space-y-2 py-2'>
            <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
            <span className='text-muted-foreground animate-pulse text-[10px]'>
              Loading amazing content...
            </span>
          </div>
        )}
      </div>
    );
  };

  const [dbItems, setDbItems] = useState<any[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  const fetchDbItems = async (category?: string) => {
    setIsLoadingDb(true);
    try {
      const url = category
        ? `/apps/workflow/items?category=${category}${slug ? `&slug=${slug}` : ""}`
        : `/apps/workflow/items${slug ? `?slug=${slug}` : ""}`;
      const res = await apiResponse.get(url, { withCredentials: true });
      if (res.data.success) {
        setDbItems(res.data.data);
      }
    } catch (error) {
    } finally {
      setIsLoadingDb(false);
    }
  };

  const deleteDbItem = async (id: string) => {
    try {
      await apiResponse.delete(`/apps/workflow/items/${id}`, {
        withCredentials: true,
      });
      setDbItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {}
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiResponse.post("/apps/workflow/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        return res.data.data.url;
      }
      throw new Error(res.data.message || "Upload failed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleIntegrationAdd = () => {
    // For text content, require content or a selected item
    if (
      selectedIntegrationType === "text" &&
      !inputData.content.trim() &&
      !selectedItem
    )
      return;

    // For other types, require either:
    // 1. A URL (when on url tab)
    // 2. A selected item (when on all tab)
    // 3. Or allow if we're on the "all" tab (for future uploaded files)
    if (
      selectedIntegrationType !== "text" &&
      !inputData.url.trim() &&
      !selectedItem &&
      activeTab !== "all"
    )
      return;

    let processedData = { ...inputData };
    let nodeType = selectedIntegrationType;

    // If an item is selected from history (ALL tab), use its data
    if (activeTab === "all" && selectedItem) {
      if (selectedItem.type === "image") {
        nodeType = "image";
        processedData = {
          ...processedData,
          url: selectedItem.url,
          thumbnail: selectedItem.thumbnail,
          title: selectedItem.name,
        };
      } else if (selectedItem.type === "video") {
        nodeType = "video";
        processedData = {
          ...processedData,
          url: selectedItem.url,
          thumbnail: selectedItem.thumbnail,
          title: selectedItem.name,
        };
      } else if (selectedItem.type === "audio") {
        nodeType = "audio";
        processedData = {
          ...processedData,
          url: selectedItem.url,
          title: selectedItem.name,
        };
      } else if (
        selectedItem.type === "text" ||
        selectedItem.type === "social"
      ) {
        nodeType = selectedItem.type === "social" ? "social" : "text";
        processedData = {
          ...processedData,
          content: selectedItem.content,
          title: selectedItem.prompt || selectedItem.name || "Generated Text",
        };
      } else if (selectedItem.type === "doc" || selectedItem.type === "docs") {
        nodeType = "document";
        processedData = {
          ...processedData,
          content: selectedItem.content,
          title:
            selectedItem.prompt || selectedItem.name || "Generated Document",
          url: selectedItem.url || "",
        };
      }
    }

    // Map sidebar types to actual node types
    if (selectedIntegrationType === "mic") {
      nodeType = "audio";
    } else if (selectedIntegrationType === "image") {
      nodeType = "image";
    } else if (selectedIntegrationType === "video") {
      nodeType = "video";
    } else if (selectedIntegrationType === "file") {
      nodeType = "document";
    }
    // text and globe are handled separately below

    // Handle social media content
    if (selectedIntegrationType === "globe" && selectedSocialPlatform) {
      // Determine node type based on selected platform
      if (selectedSocialPlatform === "youtube") {
        nodeType = "youtube";
        const videoId = extractVideoId(inputData.url);
        processedData = {
          ...inputData,
          videoId: videoId || "",
          title:
            inputData.title ||
            `YouTube Video ${videoId ? videoId.substring(0, 8) : ""}`,
          thumbnail: videoId
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            : null,
          transcript: "", // Will be populated by transcription service
        };

        // Add to user files for future reference
        addFileToUserFiles(
          {
            name: processedData.title,
            url: inputData.url,
            type: "video",
            size: "YouTube Video",
          },
          "video"
        );
      } else if (selectedSocialPlatform === "instagram") {
        nodeType = "instagram";
        processedData = {
          ...inputData,
          instruction: inputData.hasInstruction ? inputData.title : "",
          status: inputData.status || "public",
          url: inputData.url,
          platform: "instagram",
        };
      } else if (selectedSocialPlatform === "twitter") {
        nodeType = "twitter";
        processedData = {
          ...inputData,
          instruction: inputData.hasInstruction ? inputData.title : "",
          status: inputData.status || "public",
          url: inputData.url,
          platform: "twitter",
        };
      } else if (selectedSocialPlatform === "facebook") {
        nodeType = "facebook";
        processedData = {
          ...inputData,
          instruction: inputData.hasInstruction ? inputData.title : "",
          status: inputData.status || "public",
          url: inputData.url,
          platform: "facebook",
        };
      } else if (selectedSocialPlatform === "linkedin") {
        nodeType = "linkedin";
        processedData = {
          ...inputData,
          instruction: inputData.hasInstruction ? inputData.title : "",
          status: inputData.status || "public",
          url: inputData.url,
          platform: "linkedin",
        };
      } else if (selectedSocialPlatform === "tiktok") {
        nodeType = "tiktok";
        processedData = {
          ...inputData,
          instruction: inputData.hasInstruction ? inputData.title : "",
          status: inputData.status || "public",
          url: inputData.url,
          platform: "tiktok",
        };
      }
    } else if (selectedIntegrationType === "youtube") {
      const videoId = extractVideoId(inputData.url);
      processedData = {
        ...inputData,
        videoId: videoId || "",
        title:
          inputData.title ||
          `YouTube Video ${videoId ? videoId.substring(0, 8) : ""}`,
        thumbnail: videoId
          ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          : null,
        transcript: "", // Will be populated by transcription service
      };

      // Add to user files for future reference
      addFileToUserFiles(
        {
          name: processedData.title,
          url: inputData.url,
          type: "video",
          size: "YouTube Video",
        },
        "video"
      );
    } else if (selectedIntegrationType === "text") {
      processedData = {
        ...inputData,
        instruction: inputData.hasInstruction ? inputData.title : "",
        status: "public",
        content: inputData.content,
      };
    } else if (selectedIntegrationType === "mic") {
      // For audio, use filename as title if no title provided
      const fileName =
        inputData.url.split("/").pop()?.split("?")[0] || "Audio File";
      processedData = {
        ...inputData,
        title: inputData.hasInstruction ? inputData.title : "",
        type: "audio",
      };

      // Add to user files for future reference
      addFileToUserFiles(
        {
          name: inputData.hasInstruction ? processedData.title : fileName,
          url: inputData.url,
          type: "audio",
          size: "Audio File",
        },
        "audio"
      );
    } else if (selectedIntegrationType === "image") {
      processedData = {
        ...inputData,
        title: inputData.hasInstruction ? inputData.title : "",
        type: "image",
      };

      // Add to user files for future reference
      const imageFileName =
        inputData.url.split("/").pop()?.split("?")[0] || "Image";
      addFileToUserFiles(
        {
          name: inputData.hasInstruction ? processedData.title : imageFileName,
          url: inputData.url,
          type: "image",
          size: "Image File",
        },
        "image"
      );
    } else if (selectedIntegrationType === "video") {
      processedData = {
        ...inputData,
        title: inputData.hasInstruction ? inputData.title : "",
        type: "video",
      };

      // Add to user files for future reference
      const videoFileName =
        inputData.url.split("/").pop()?.split("?")[0] || "Video";
      addFileToUserFiles(
        {
          name: inputData.hasInstruction ? processedData.title : videoFileName,
          url: inputData.url,
          type: "video",
          size: "Video File",
        },
        "video"
      );
    } else if (selectedIntegrationType === "file") {
      const documentUrl = selectedItem?.url || inputData.url;
      const documentFileName = documentUrl
        ? documentUrl.split("/").pop()?.split("?")[0] || "Document"
        : "Document";

      processedData = {
        ...inputData,
        title: inputData.hasInstruction ? inputData.title : "",
        type: "document",
        url: documentUrl,
      };

      // Add to user files for future reference
      addFileToUserFiles(
        {
          name: inputData.hasInstruction
            ? processedData.title
            : documentFileName,
          url: documentUrl,
          type: "document",
          size: "Document File",
        },
        "document"
      );
    }

    if (selectedIntegrationType && nodeType) {
      let finalData = { ...processedData };

      if (selectedItem) {
        // If an item is selected, merge its critical fields into fineData
        finalData = {
          ...finalData,
          title: selectedItem.name || selectedItem.title || finalData.title,
          url: selectedItem.url || finalData.url,
          content: selectedItem.content || finalData.content,
          instruction:
            selectedItem.prompt ||
            selectedItem.instruction ||
            finalData.instruction,
          duration: selectedItem.duration || finalData.duration,
          size: selectedItem.size || finalData.size,
          alreadyInBrain: true,
        };
      } else {
      }

      onAddIntegration(nodeType, finalData);
    }
    resetModal();
  };

  const resetModal = () => {
    setInputData({
      url: "",
      title: "",
      description: "",
      content: "",
      videoId: "",
      thumbnail: null as string | null,
      type: "",
      platform: "",
      transcript: "",
      instruction: "",
      status: "public",
      hasInstruction: false,
      duration: "",
      size: "",
      alreadyInBrain: false,
    });
    setSelectedIntegrationType(null);
    setShowModal(false);
    setActiveTab("all");
    setAddSubTab("url");
    setSearchQuery("");
    setSelectedSocialPlatform(null);
    setSelectedItem(null);

    // Clean up recording state
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const extractVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const getDocumentType = (url: string, fileName?: string) => {
    const file = fileName || url.split("/").pop()?.split("?")[0] || "";
    const extension = file.toLowerCase().split(".").pop();

    switch (extension) {
      case "pdf":
        return "PDF";
      case "doc":
      case "docx":
        return "Word";
      case "xls":
      case "xlsx":
        return "Excel";
      case "ppt":
      case "pptx":
        return "PowerPoint";
      case "txt":
        return "Text";
      default:
        return "Document";
    }
  };

  const handleIconClick = (type: string) => {
    setSelectedIntegrationType(type);
    setShowModal(true);
    // Clear search when switching to a new type
    setSearchQuery("");
    // Set first tab as active by default
    if (type === "mic") {
      setActiveTab("all");
    } else if (type === "image") {
      setActiveTab("all");
    } else if (type === "video") {
      setActiveTab("all");
    } else if (type === "text") {
      setActiveTab("create");
    } else if (type === "globe") {
      setActiveTab("socials");
    } else if (type === "database") {
      setActiveTab("all");
      fetchDbItems();
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  const handleFileSelect = (file: any) => {
    setSelectedItem(file);
  };

  const handleDeleteItem = (itemId: string, itemType: string) => {
    // Remove from user files
    setUserFiles((prev) => ({
      ...prev,
      [itemType]: prev[itemType as keyof typeof prev].filter(
        (file: any) => file.id !== itemId
      ),
    }));

    // If the deleted item was selected, clear the selection
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
  };

  const handleSocialPlatformSelect = (platform: string) => {
    setSelectedSocialPlatform(platform);
    setActiveTab("url");
  };

  const addFileToUserFiles = (file: any, type: string) => {
    const newFile = {
      id: `user-${Date.now()}`,
      name: file.name || file.title || `File ${Date.now()}`,
      type: type,
      url: file.url,
      duration: file.duration || "",
      size: file.size || "",
      date: "Just now",
    };

    setUserFiles((prev) => ({
      ...prev,
      [type]: [...prev[type as keyof typeof prev], newFile],
    }));

    return newFile;
  };

  const validateFileType = (file: File, expectedType: string): boolean => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    switch (expectedType) {
      case "audio":
        return (
          fileType.startsWith("audio/") ||
          fileName.endsWith(".mp3") ||
          fileName.endsWith(".wav") ||
          fileName.endsWith(".m4a") ||
          fileName.endsWith(".aac") ||
          fileName.endsWith(".ogg")
        );
      case "image":
        return (
          fileType.startsWith("image/") ||
          fileName.endsWith(".jpg") ||
          fileName.endsWith(".jpeg") ||
          fileName.endsWith(".png") ||
          fileName.endsWith(".gif") ||
          fileName.endsWith(".webp") ||
          fileName.endsWith(".svg")
        );
      case "video":
        return (
          fileType.startsWith("video/") ||
          fileName.endsWith(".mp4") ||
          fileName.endsWith(".mov") ||
          fileName.endsWith(".avi") ||
          fileName.endsWith(".mkv") ||
          fileName.endsWith(".webm") ||
          fileName.endsWith(".m4v")
        );
      case "document":
        return (
          fileName.endsWith(".pdf") ||
          fileName.endsWith(".doc") ||
          fileName.endsWith(".docx") ||
          fileName.endsWith(".xls") ||
          fileName.endsWith(".xlsx") ||
          fileName.endsWith(".ppt") ||
          fileName.endsWith(".pptx") ||
          fileName.endsWith(".txt")
        );
      default:
        return false;
    }
  };

  const handleFileUpload = async (file: File, type: string) => {
    if (!validateFileType(file, type)) {
      toast.error(`Please select a valid ${type} file.`);
      return null;
    }

    // Upload to storage (S3) instead of creating a blob URL
    const s3Url = await uploadFile(file);
    if (!s3Url) return null;

    const newFile = {
      id: `user-${Date.now()}`,
      name: file.name,
      type: type,
      url: s3Url,
      size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
      date: "Just now",
    };

    setUserFiles((prev) => ({
      ...prev,
      [type]: [...prev[type as keyof typeof prev], newFile],
    }));

    return newFile;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const fileName = `Recording_${new Date().toLocaleTimeString().replace(/:/g, "-")}.wav`;

        const recordedFile = {
          id: `user-${Date.now()}`,
          name: fileName,
          type: "audio",
          url: url,
          duration: "0:00", // Could calculate actual duration
          size: `${(blob.size / 1024 / 1024).toFixed(1)}MB`,
          date: "Just now",
        };

        setUserFiles((prev) => ({
          ...prev,
          audio: [...prev.audio, recordedFile],
        }));

        handleFileSelect(recordedFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecordedChunks(chunks);
      setIsRecording(true);
    } catch (error) {
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const uploadedFile = await handleFileUpload(file, type);
      if (uploadedFile) {
        handleFileSelect(uploadedFile);
      }
      event.target.value = ""; // Reset input
    }
  };

  const handleDrop = async (event: React.DragEvent, type: string) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const uploadedFile = await handleFileUpload(file, type);
      if (uploadedFile) {
        handleFileSelect(uploadedFile);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const renderModalContent = () => {
    if (!selectedIntegrationType) return null;

    const config =
      modalConfigs[selectedIntegrationType as keyof typeof modalConfigs];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <div className='space-y-4'>
        {config.tabs.map((tab) => (
          <div key={tab} className={activeTab === tab ? "block" : "hidden"}>
            {config.content[tab as keyof typeof config.content] &&
              typeof config.content[tab as keyof typeof config.content] ===
                "function" &&
              (
                config.content[tab as keyof typeof config.content] as Function
              )()}
          </div>
        ))}
      </div>
    );
  };

  const getPlatformConfig = (platformName: string) => {
    switch (platformName) {
      case "youtube":
        return {
          icon: (
            <svg
              className='h-6 w-6'
              viewBox='0 0 256 180'
              width='256'
              height='180'
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='xMidYMid'
            >
              <path
                d='M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z'
                fill='red'
              />
              <path
                fill='#FFF'
                d='m102.421 128.06 66.328-38.418-66.328-38.418z'
              />
            </svg>
          ),
          color: "text-red-600",
          bg: "bg-red-500/10",
        };
      case "instagram":
        return {
          icon: (
            <svg className='h-6 w-6' viewBox='0 0 24 24' fill='currentColor'>
              <defs>
                <linearGradient
                  id='instagram-gradient'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#f09433' />
                  <stop offset='25%' stopColor='#e6683c' />
                  <stop offset='50%' stopColor='#dc2743' />
                  <stop offset='75%' stopColor='#cc2366' />
                  <stop offset='100%' stopColor='#bc1888' />
                </linearGradient>
              </defs>
              <path
                fill='url(#instagram-gradient)'
                d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
              />
            </svg>
          ),
          color: "text-pink-600",
          bg: "bg-pink-500/10",
        };
      case "twitter":
        return {
          icon: (
            <svg className='h-6 w-6' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
            </svg>
          ),
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        };
      case "linkedin":
        return {
          icon: (
            <svg
              className='h-6 w-6'
              width='256'
              height='256'
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='xMidYMid'
              viewBox='0 0 256 256'
            >
              <path
                d='M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453'
                fill='#0A66C2'
              />
            </svg>
          ),
          color: "text-blue-700",
          bg: "bg-blue-500/10",
        };
      case "facebook":
        return {
          icon: (
            <svg
              className='h-6 w-6'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 36 36'
              fill='url(#facebook__a)'
              height='40'
              width='40'
            >
              <defs>
                <linearGradient
                  x1='50%'
                  x2='50%'
                  y1='97.078%'
                  y2='0%'
                  id='facebook__a'
                >
                  <stop offset='0%' stopColor='#0062E0' />
                  <stop offset='100%' stopColor='#19AFFF' />
                </linearGradient>
              </defs>
              <path d='M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z' />
              <path
                fill='#FFF'
                d='m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z'
              />
            </svg>
          ),
          color: "text-blue-600",
          bg: "bg-blue-500/10",
        };

      case "tiktok":
        return {
          icon: (
            <svg className='h-6 w-6' viewBox='0 0 24 24' fill='currentColor'>
              <defs>
                <linearGradient
                  id='tiktok-gradient'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#25F4EE' />
                  <stop offset='50%' stopColor='#FE2C55' />
                  <stop offset='100%' stopColor='#000000' />
                </linearGradient>
              </defs>
              <path
                fill='url(#tiktok-gradient)'
                d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z'
              />
            </svg>
          ),
          color: "text-foreground",
          bg: "bg-muted",
        };
      default:
        return null;
    }
  };

  const socialPlatforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: (
        <svg className='h-6 w-6' viewBox='0 0 24 24' fill='currentColor'>
          <defs>
            <linearGradient
              id='instagram-gradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#f09433' />
              <stop offset='25%' stopColor='#e6683c' />
              <stop offset='50%' stopColor='#dc2743' />
              <stop offset='75%' stopColor='#cc2366' />
              <stop offset='100%' stopColor='#bc1888' />
            </linearGradient>
          </defs>
          <path
            fill='url(#instagram-gradient)'
            d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
          />
        </svg>
      ),
      color: "text-pink-600",
      bg: "bg-pink-500/10",
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: (
        <svg className='h-6 w-6' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },

    {
      id: "linkedin",
      name: "LinkedIn",
      icon: (
        <svg
          className='h-6 w-6'
          width='256'
          height='256'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='xMidYMid'
          viewBox='0 0 256 256'
        >
          <path
            d='M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453'
            fill='#0A66C2'
          />
        </svg>
      ),
      color: "text-blue-800",
      bg: "bg-blue-700/10",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: (
        <svg
          className='h-6 w-6'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 36 36'
          fill='url(#facebook__a)'
          height='40'
          width='40'
        >
          <defs>
            <linearGradient
              x1='50%'
              x2='50%'
              y1='97.078%'
              y2='0%'
              id='facebook__a'
            >
              <stop offset='0%' stopColor='#0062E0' />
              <stop offset='100%' stopColor='#19AFFF' />
            </linearGradient>
          </defs>
          <path d='M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z' />
          <path
            fill='#FFF'
            d='m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z'
          />
        </svg>
      ),
      color: "text-blue-700",
      bg: "bg-blue-600/10",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: (
        <svg
          className='h-6 w-6'
          viewBox='0 0 256 180'
          width='256'
          height='180'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='xMidYMid'
        >
          <path
            d='M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z'
            fill='red'
          />
          <path fill='#FFF' d='m102.421 128.06 66.328-38.418-66.328-38.418z' />
        </svg>
      ),
      color: "text-red-600",
      bg: "bg-red-500/10",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: (
        <svg className='h-6 w-6' viewBox='0 0 24 24' fill='currentColor'>
          <defs>
            <linearGradient
              id='tiktok-gradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#25F4EE' />
              <stop offset='50%' stopColor='#FE2C55' />
              <stop offset='100%' stopColor='#000000' />
            </linearGradient>
          </defs>
          <path
            fill='url(#tiktok-gradient)'
            d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z'
          />
        </svg>
      ),
      color: "text-foreground",
      bg: "bg-muted",
    },
  ];

  useEffect(() => {
    if (showModal && selectedIntegrationType) {
      if (activeTab === "all") {
        // Map sidebar types to history categories
        const categoryMap: { [key: string]: string } = {
          mic: "audio",
          image: "image",
          video: "video",
          file: "docs",
          text: "text",
          globe: "social",
        };
        const category = categoryMap[selectedIntegrationType] || "all";
        fetchHistory(category);
      }
    }
  }, [showModal, selectedIntegrationType, activeTab, fetchHistory]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, category: string) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      fetchHistory(category, true);
    }
  };

  const modalConfigs = {
    mic: {
      title: "Audio & Voice",
      icon: Mic,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      tabs: ["all", "record", "add"],
      content: {
        all: () => (
          <div className='space-y-3'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search audio files...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-9 pr-10 pl-10'
              />
              {searchQuery && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                  onClick={() => setSearchQuery("")}
                  title='Clear Search'
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
            </div>

            <div className='scrollbar-thumb-muted h-60 scrollbar-thin scrollbar-track-transparent overflow-y-auto pr-2 pb-20'>
              <div className='flex flex-col gap-y-2'>
                {userFiles.audio.length === 0 &&
                historyItems.audio.length === 0 &&
                !historyPagination.audio.isLoading ? (
                  <div className='py-8 text-center'>
                    <Music className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                    <p className='text-muted-foreground text-sm'>
                      No audio files yet
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      Generate audio or upload files
                    </p>
                  </div>
                ) : (
                  <>
                    {/* User Uploaded Files */}
                    {userFiles.audio
                      .filter((file: any) =>
                        file.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((file: any) => (
                        <Card
                          key={file.id}
                          className={`border-border/50 cursor-pointer p-3 transition-colors ${
                            selectedItem?.id === file.id
                              ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => {
                            setSelectedItem(file);
                            // We don't necessarily want to toggle off selectedItem if we click it again
                          }}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-md'>
                              <Music className='text-muted-foreground h-5 w-5' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-foreground truncate text-sm font-medium'>
                                {file.name}
                              </p>
                              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                <span>{file.duration || "Audio"}</span>
                                <span>•</span>
                                <span>{file.size || "Upload"}</span>
                              </div>
                            </div>
                            {selectedItem?.id === file.id && (
                              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                <CheckCircle className='text-primary-foreground h-3 w-3' />
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}

                    {/* Generated History Items */}
                    {historyItems.audio
                      .filter((item: any) =>
                        (item.name || item.prompt || "")
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((item: any) => (
                        <Card
                          key={item.id}
                          className={`border-border/50 cursor-pointer p-3 transition-colors ${
                            selectedItem?.id === item.id
                              ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-md bg-green-500/10'>
                              <Music className='h-5 w-5 text-green-500' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-foreground truncate text-sm font-medium'>
                                {item.prompt || "Generated Audio"}
                              </p>
                              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                <Badge
                                  variant='outline'
                                  className='text-primary h-4 bg-indigo-600 px-1 py-0 text-[10px] hover:bg-indigo-700/5'
                                >
                                  Generated
                                </Badge>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    item.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {selectedItem?.id === item.id && (
                              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                <CheckCircle className='text-primary-foreground h-3 w-3' />
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}

                    <HistorySentinel category='audio' />

                    {!historyPagination.audio.hasMore &&
                      (userFiles.audio.length > 0 ||
                        historyItems.audio.length > 0) &&
                      !historyPagination.audio.isLoading && (
                        <div className='border-border/5 mt-4 mb-20 border-t py-10 text-center'>
                          <p className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase opacity-50'>
                            No more files found
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        ),
        record: () => (
          <div className='space-y-4'>
            <div className='py-4 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10'>
                <Mic2 className='h-8 w-8 text-red-500' />
              </div>
              <h3 className='text-foreground mb-2 text-sm font-semibold'>
                Record Audio
              </h3>
              <p className='text-muted-foreground mb-4 text-xs'>
                Capture voice notes, interviews, or audio content
              </p>
            </div>

            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-foreground text-xs font-medium'>
                  Label
                </label>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      hasInstruction: !prev.hasInstruction,
                      title: !prev.hasInstruction ? prev.title : "",
                    }))
                  }
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.hasInstruction
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                      inputData.hasInstruction
                        ? "translate-x-3.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {inputData.hasInstruction && (
                <Textarea
                  placeholder='Document your file so you can remember them'
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className='min-h-[80px] resize-none'
                />
              )}
            </div>

            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Status
              </label>
              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-xs'>Public</span>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      status: prev.status === "public" ? "private" : "public",
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.status === "private"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      inputData.status === "private"
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className='text-muted-foreground text-xs'>Private</span>
              </div>
            </div>

            <div className='text-center'>
              {!isRecording ? (
                <Button
                  className='w-full bg-red-500 text-white hover:bg-red-600'
                  onClick={startRecording}
                >
                  <Mic2 className='mr-2 h-8 w-8' />
                  Start Recording
                </Button>
              ) : (
                <Button
                  className='w-full bg-gray-500 text-white hover:bg-gray-600'
                  onClick={stopRecording}
                >
                  <div className='mr-2 h-8 w-8 animate-pulse rounded-full bg-red-500' />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
        ),
        add: () => (
          <div className='space-y-4'>
            <Tabs
              value={addSubTab}
              onValueChange={setAddSubTab}
              className='w-full'
            >
              <TabsList className='grid h-8 w-full grid-cols-2'>
                <TabsTrigger value='url' className='h-6 text-xs capitalize'>
                  URL
                </TabsTrigger>
                <TabsTrigger value='upload' className='h-6 text-xs capitalize'>
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value='url' className='space-y-3'>
                <div>
                  <div className='mt-4 mb-2 flex items-center justify-between'>
                    <label className='text-foreground text-xs font-medium'>
                      Label
                    </label>
                    <button
                      type='button'
                      onClick={() =>
                        setInputData((prev) => ({
                          ...prev,
                          hasInstruction: !prev.hasInstruction,
                          title: !prev.hasInstruction ? prev.title : "",
                        }))
                      }
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                        inputData.hasInstruction
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                          inputData.hasInstruction
                            ? "translate-x-3.5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  {inputData.hasInstruction && (
                    <Textarea
                      placeholder='Document your file so you can remember them'
                      value={inputData.title}
                      onChange={(e) =>
                        setInputData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className='min-h-[80px] resize-none'
                    />
                  )}
                </div>
                <div>
                  <label className='text-foreground mb-2 block text-xs font-medium'>
                    Status
                  </label>
                  <div className='flex items-center space-x-3'>
                    <span className='text-muted-foreground text-xs'>
                      Public
                    </span>
                    <button
                      type='button'
                      onClick={() =>
                        setInputData((prev) => ({
                          ...prev,
                          status:
                            prev.status === "public" ? "private" : "public",
                        }))
                      }
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                        inputData.status === "private"
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          inputData.status === "private"
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className='text-muted-foreground text-xs'>
                      Private
                    </span>
                  </div>
                </div>
                <div>
                  <label className='text-foreground mb-2 block text-xs font-medium'>
                    Audio URL
                  </label>
                  <div className='relative'>
                    <Input
                      placeholder='https://example.com/audio.mp3'
                      value={inputData.url}
                      onChange={(e) =>
                        setInputData((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                      className='h-9 pr-10'
                    />
                    {inputData.url && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                        onClick={() =>
                          setInputData((prev) => ({ ...prev, url: "" }))
                        }
                        title='Clear URL'
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='upload' className='space-y-3'>
                <div>
                  <div className='mb-2 flex items-center justify-between'>
                    <label className='text-foreground text-xs font-medium'>
                      Label
                    </label>
                    <button
                      type='button'
                      onClick={() =>
                        setInputData((prev) => ({
                          ...prev,
                          hasInstruction: !prev.hasInstruction,
                          title: !prev.hasInstruction ? prev.title : "",
                        }))
                      }
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                        inputData.hasInstruction
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                          inputData.hasInstruction
                            ? "translate-x-3.5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  {inputData.hasInstruction && (
                    <Textarea
                      placeholder='Document your file so you can remember them'
                      value={inputData.title}
                      onChange={(e) =>
                        setInputData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className='min-h-[80px] resize-none'
                    />
                  )}
                </div>

                <div>
                  <label className='text-foreground mb-2 block text-xs font-medium'>
                    Status
                  </label>
                  <div className='flex items-center space-x-3'>
                    <span className='text-muted-foreground text-xs'>
                      Public
                    </span>
                    <button
                      type='button'
                      onClick={() =>
                        setInputData((prev) => ({
                          ...prev,
                          status:
                            prev.status === "public" ? "private" : "public",
                        }))
                      }
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                        inputData.status === "private"
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          inputData.status === "private"
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className='text-muted-foreground text-xs'>
                      Private
                    </span>
                  </div>
                </div>

                <div
                  className={`border-border hover:border-primary/50 rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                    isUploading
                      ? "border-primary/30 pointer-events-none bg-indigo-600 hover:bg-indigo-700/5"
                      : ""
                  }`}
                  onDrop={(e) => handleDrop(e, "audio")}
                  onDragOver={handleDragOver}
                >
                  <input
                    type='file'
                    accept='.mp3,.wav,.m4a,.aac,.ogg,audio/*'
                    onChange={(e) => handleFileInputChange(e, "audio")}
                    className='hidden'
                    id='audio-upload'
                    disabled={isUploading}
                  />
                  <label htmlFor='audio-upload' className='cursor-pointer'>
                    {isUploading ? (
                      <div className='flex flex-col items-center'>
                        <LoadingFileLoader size={16} />
                        <p className='text-primary text-sm font-medium'>
                          Uploading audio...
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                        <p className='text-muted-foreground mb-2 text-sm'>
                          Drop audio files here or click to browse
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          MP3, WAV, M4A up to 50MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ),
      },
    },
    image: {
      title: "Images & Graphics",
      icon: ImageIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      tabs: ["all", "url", "upload"],
      content: {
        all: () => (
          <div className='space-y-3'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search image files...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-9 pr-10 pl-10'
              />
              {searchQuery && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                  onClick={() => setSearchQuery("")}
                  title='Clear Search'
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
            </div>

            <div className='scrollbar-thumb-muted h-60 scrollbar-thin scrollbar-track-transparent overflow-y-auto pr-2 pb-20'>
              <div className='space-y-4'>
                {userFiles.image.length === 0 &&
                historyItems.image.length === 0 &&
                !historyPagination.image.isLoading ? (
                  <div className='py-8 text-center'>
                    <ImageIcon className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                    <p className='text-muted-foreground text-sm'>
                      No images yet
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      Generate images or upload files
                    </p>
                  </div>
                ) : (
                  <>
                    <div className='grid grid-cols-2 gap-3'>
                      {/* User Uploaded Images */}
                      {userFiles.image
                        .filter((file: any) =>
                          file.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map((file: any) => (
                          <div
                            key={file.id}
                            className={`relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                              selectedItem?.id === file.id &&
                              selectedItem?.type === "image"
                                ? "border-primary shadow-md"
                                : "hover:border-primary/30 border-transparent"
                            }`}
                            onClick={() =>
                              setSelectedItem({ ...file, type: "image" })
                            }
                          >
                            <img
                              src={file.url}
                              alt={file.name}
                              className='h-full w-full object-cover'
                            />
                            {selectedItem?.id === file.id &&
                              selectedItem?.type === "image" && (
                                <div className='absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                  <CheckCircle className='text-primary-foreground h-3 w-3' />
                                </div>
                              )}
                            <div className='absolute right-0 bottom-0 left-0 bg-black/40 p-1 backdrop-blur-[2px]'>
                              <p className='truncate px-1 text-[10px] text-white'>
                                {file.name}
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* Generated History Images */}
                      {historyItems.image
                        .filter((item: any) =>
                          (item.prompt || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map((item: any) => (
                          <div
                            key={item.id}
                            className={`relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                              selectedItem?.id === item.id
                                ? "border-primary shadow-md"
                                : "hover:border-primary/30 border-transparent"
                            }`}
                            onClick={() => setSelectedItem(item)}
                          >
                            <img
                              src={item.thumbnail || item.url}
                              alt={item.prompt}
                              className='h-full w-full object-cover'
                            />
                            <div className='absolute top-1 left-1'>
                              <Badge className='h-3 border-none bg-indigo-600 px-1 py-0 text-[8px] leading-none hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/80'>
                                AI
                              </Badge>
                            </div>
                            {selectedItem?.id === item.id && (
                              <div className='absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                <CheckCircle className='text-primary-foreground h-3 w-3' />
                              </div>
                            )}
                            <div className='absolute right-0 bottom-0 left-0 bg-black/40 p-1 backdrop-blur-[2px]'>
                              <p className='truncate px-1 text-[10px] text-white'>
                                {item.prompt || "Generated"}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>

                    <HistorySentinel category='image' />

                    {!historyPagination.image.hasMore &&
                      (userFiles.image.length > 0 ||
                        historyItems.image.length > 0) &&
                      !historyPagination.image.isLoading && (
                        <div className='border-border/5 mt-4 mb-20 border-t py-10 text-center'>
                          <p className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase opacity-50'>
                            No more files found
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        ),
        url: () => (
          <div className='space-y-3'>
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-foreground text-xs font-medium'>
                  Label
                </label>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      hasInstruction: !prev.hasInstruction,
                      title: !prev.hasInstruction ? prev.title : "",
                    }))
                  }
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.hasInstruction
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                      inputData.hasInstruction
                        ? "translate-x-3.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {inputData.hasInstruction && (
                <Textarea
                  placeholder='Document your file so you can remember them'
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className='min-h-[80px] resize-none'
                />
              )}
            </div>
            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Status
              </label>
              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-xs'>Public</span>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      status: prev.status === "public" ? "private" : "public",
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.status === "private"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      inputData.status === "private"
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className='text-muted-foreground text-xs'>Private</span>
              </div>
            </div>
            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Image URL
              </label>
              <div className='relative'>
                <Input
                  placeholder='https://example.com/image.jpg'
                  value={inputData.url}
                  onChange={(e) =>
                    setInputData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className='h-9 pr-10'
                />
                {inputData.url && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                    onClick={() =>
                      setInputData((prev) => ({ ...prev, url: "" }))
                    }
                    title='Clear URL'
                  >
                    <X className='h-3 w-3' />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ),
        upload: () => (
          <div className='space-y-3'>
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-foreground text-xs font-medium'>
                  Label
                </label>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      hasInstruction: !prev.hasInstruction,
                      title: !prev.hasInstruction ? prev.title : "",
                    }))
                  }
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.hasInstruction
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                      inputData.hasInstruction
                        ? "translate-x-3.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {inputData.hasInstruction && (
                <Textarea
                  placeholder='Document your file so you can remember them'
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className='min-h-[80px] resize-none'
                />
              )}
            </div>

            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Status
              </label>
              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-xs'>Public</span>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      status: prev.status === "public" ? "private" : "public",
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.status === "private"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      inputData.status === "private"
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className='text-muted-foreground text-xs'>Private</span>
              </div>
            </div>

            <div
              className={`border-border hover:border-primary/50 rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                isUploading
                  ? "border-primary/30 pointer-events-none bg-indigo-600 hover:bg-indigo-700/5"
                  : ""
              }`}
              onDrop={(e) => handleDrop(e, "image")}
              onDragOver={handleDragOver}
            >
              <input
                type='file'
                accept='.jpg,.jpeg,.png,.gif,.webp,.svg,image/*'
                onChange={(e) => handleFileInputChange(e, "image")}
                className='hidden'
                id='image-upload'
                disabled={isUploading}
              />
              <label htmlFor='image-upload' className='cursor-pointer'>
                {isUploading ? (
                  <div className='flex flex-col items-center'>
                    <LoadingFileLoader size={16} />
                    <p className='text-primary text-sm font-medium'>
                      Uploading image...
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                    <p className='text-muted-foreground mb-2 text-sm'>
                      Drop image files here or click to browse
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      JPG, PNG, GIF up to 10MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
        ),
      },
    },
    video: {
      title: "Video Content",
      icon: Play,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      tabs: ["all", "url", "upload"],
      content: {
        all: () => (
          <div className='space-y-3'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search videos...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-9 pr-10 pl-10'
              />
              {searchQuery && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                  onClick={() => setSearchQuery("")}
                  title='Clear Search'
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
            </div>

            <div className='scrollbar-thumb-muted h-60 scrollbar-thin scrollbar-track-transparent overflow-y-auto pr-2 pb-20'>
              <div className='space-y-4'>
                {userFiles.video.length === 0 &&
                historyItems.video.length === 0 &&
                !historyPagination.video.isLoading ? (
                  <div className='py-8 text-center'>
                    <Play className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                    <p className='text-muted-foreground text-sm'>
                      No videos yet
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      Generate videos or upload files
                    </p>
                  </div>
                ) : (
                  <>
                    <div className='grid grid-cols-2 gap-3'>
                      {/* User Uploaded Videos */}
                      {userFiles.video
                        .filter((file: any) =>
                          file.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map((file: any) => (
                          <div
                            key={file.id}
                            className={`relative aspect-video cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                              selectedItem?.id === file.id &&
                              selectedItem?.type === "video"
                                ? "border-primary shadow-md"
                                : "hover:border-primary/30 border-transparent"
                            }`}
                            onClick={() =>
                              setSelectedItem({ ...file, type: "video" })
                            }
                          >
                            <video
                              src={file.url}
                              className='h-full w-full object-cover'
                              muted
                              playsInline
                              onLoadedData={(e) => {
                                const video = e.target as HTMLVideoElement;
                                video
                                  .play()
                                  .then(() => {
                                    setTimeout(() => {
                                      video.pause();
                                    }, 2000);
                                  })
                                  .catch(() => {
                                    // Auto-play might be blocked even if muted
                                    video.currentTime = 1;
                                  });
                              }}
                            />
                            <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                              <Play className='h-4 w-4 fill-white text-white' />
                            </div>
                            {selectedItem?.id === file.id &&
                              selectedItem?.type === "video" && (
                                <div className='absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                  <CheckCircle className='text-primary-foreground h-3 w-3' />
                                </div>
                              )}
                            <div className='absolute right-0 bottom-0 left-0 bg-black/40 p-1 backdrop-blur-[2px]'>
                              <p className='truncate px-1 text-[10px] text-white'>
                                {file.name}
                              </p>
                            </div>
                          </div>
                        ))}

                      {/* Generated History Videos */}
                      {historyItems.video
                        .filter((item: any) =>
                          (item.prompt || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map((item: any) => (
                          <div
                            key={item.id}
                            className={`relative aspect-video cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                              selectedItem?.id === item.id
                                ? "border-primary shadow-md"
                                : "hover:border-primary/30 border-transparent"
                            }`}
                            onClick={() => setSelectedItem(item)}
                          >
                            <video
                              src={item.url}
                              className='h-full w-full object-cover'
                              muted
                              playsInline
                              poster={item.thumbnail}
                              onLoadedData={(e) => {
                                const video = e.target as HTMLVideoElement;
                                video
                                  .play()
                                  .then(() => {
                                    setTimeout(() => {
                                      video.pause();
                                    }, 2000);
                                  })
                                  .catch(() => {
                                    video.currentTime = 1;
                                  });
                              }}
                            />
                            <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                              <Play className='h-4 w-4 fill-white text-white' />
                            </div>
                            <div className='absolute top-1 left-1'>
                              <Badge className='h-3 border-none bg-indigo-600 px-1 py-0 text-[8px] leading-none hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/80'>
                                AI
                              </Badge>
                            </div>
                            {selectedItem?.id === item.id && (
                              <div className='absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                <CheckCircle className='text-primary-foreground h-3 w-3' />
                              </div>
                            )}
                            <div className='absolute right-0 bottom-0 left-0 bg-black/40 p-1 backdrop-blur-[2px]'>
                              <p className='truncate px-1 text-[10px] text-white'>
                                {item.prompt || "Generated"}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>

                    <HistorySentinel category='video' />

                    {!historyPagination.video.hasMore &&
                      (userFiles.video.length > 0 ||
                        historyItems.video.length > 0) &&
                      !historyPagination.video.isLoading && (
                        <div className='border-border/5 mt-4 mb-20 border-t py-10 text-center'>
                          <p className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase opacity-50'>
                            No more files found
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        ),
        url: () => (
          <div className='space-y-3'>
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-foreground text-xs font-medium'>
                  Label
                </label>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      hasInstruction: !prev.hasInstruction,
                      title: !prev.hasInstruction ? prev.title : "",
                    }))
                  }
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.hasInstruction
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                      inputData.hasInstruction
                        ? "translate-x-3.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {inputData.hasInstruction && (
                <Textarea
                  placeholder='Document your file so you can remember them'
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className='min-h-[80px] resize-none'
                />
              )}
            </div>
            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Status
              </label>
              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-xs'>Public</span>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      status: prev.status === "public" ? "private" : "public",
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.status === "private"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      inputData.status === "private"
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className='text-muted-foreground text-xs'>Private</span>
              </div>
            </div>
            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Video URL
              </label>
              <div className='relative'>
                <Input
                  placeholder='https://example.com/video.mp4'
                  value={inputData.url}
                  onChange={(e) =>
                    setInputData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className='h-9 pr-10'
                />
                {inputData.url && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                    onClick={() =>
                      setInputData((prev) => ({ ...prev, url: "" }))
                    }
                    title='Clear URL'
                  >
                    <X className='h-3 w-3' />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ),
        upload: () => (
          <div className='space-y-3'>
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-foreground text-xs font-medium'>
                  Label
                </label>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      hasInstruction: !prev.hasInstruction,
                      title: !prev.hasInstruction ? prev.title : "",
                    }))
                  }
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.hasInstruction
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                      inputData.hasInstruction
                        ? "translate-x-3.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {inputData.hasInstruction && (
                <Textarea
                  placeholder='Document your file so you can remember them'
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className='min-h-[80px] resize-none'
                />
              )}
            </div>

            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Status
              </label>
              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-xs'>Public</span>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      status: prev.status === "public" ? "private" : "public",
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.status === "private"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      inputData.status === "private"
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className='text-muted-foreground text-xs'>Private</span>
              </div>
            </div>

            <div
              className={`border-border hover:border-primary/50 rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                isUploading
                  ? "border-primary/30 pointer-events-none bg-indigo-600 hover:bg-indigo-700/5"
                  : ""
              }`}
              onDrop={(e) => handleDrop(e, "video")}
              onDragOver={handleDragOver}
            >
              <input
                type='file'
                accept='.mp4,.mov,.avi,.mkv,.webm,.m4v,video/*'
                onChange={(e) => handleFileInputChange(e, "video")}
                className='hidden'
                id='video-upload'
                disabled={isUploading}
              />
              <label htmlFor='video-upload' className='cursor-pointer'>
                {isUploading ? (
                  <div className='flex flex-col items-center'>
                    <LoadingFileLoader size={16} />
                    <p className='text-primary text-sm font-medium'>
                      Uploading video...
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                    <p className='text-muted-foreground mb-2 text-sm'>
                      Drop video files here or click to browse
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      MP4, MOV, AVI up to 100MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
        ),
      },
    },
    text: {
      title: "Text & Documents",
      icon: Type,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      tabs: ["all", "create"],
      content: {
        all: () => (
          <div className='space-y-3'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search text/docs...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-9 pr-10 pl-10'
              />
              {searchQuery && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                  onClick={() => setSearchQuery("")}
                  title='Clear Search'
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
            </div>

            <div className='scrollbar-thumb-muted h-60 scrollbar-thin scrollbar-track-transparent overflow-y-auto pr-2 pb-20'>
              <div className='flex flex-col gap-y-2'>
                {historyItems.text.length === 0 &&
                !historyPagination.text.isLoading ? (
                  <div className='py-8 text-center'>
                    <FileText className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                    <p className='text-muted-foreground text-sm'>
                      No text history yet
                    </p>
                  </div>
                ) : (
                  <>
                    {historyItems.text
                      .filter((item: any) =>
                        (item.name || item.prompt || item.content || "")
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((item: any) => (
                        <Card
                          key={item.id}
                          className={`border-border/50 cursor-pointer p-3 transition-colors ${
                            selectedItem?.id === item.id
                              ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className='flex items-start gap-3'>
                            {/* <div className="w-10 h-10 rounded-md flex items-center justify-center bg-orange-500/10 mt-1">
                              <FileText className="w-5 h-5 text-orange-500" />
                            </div> */}
                            <div className='min-w-0 flex-1'>
                              <p className='text-foreground line-clamp-1 text-sm font-medium'>
                                {item.prompt || "Generated Text"}
                              </p>
                              <p className='text-muted-foreground mt-0.5 line-clamp-2 text-xs'>
                                {item.content}
                              </p>
                              <div className='text-muted-foreground mt-1 flex items-center gap-2 text-[10px]'>
                                <Badge
                                  variant='outline'
                                  className='text-primary h-3.5 bg-indigo-600 px-1 py-0 hover:bg-indigo-700/5'
                                >
                                  {item.type === "social"
                                    ? "Social"
                                    : item.type === "docs"
                                      ? "Doc"
                                      : "Text"}
                                </Badge>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    item.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {selectedItem?.id === item.id && (
                              <div className='mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                <CheckCircle className='text-primary-foreground h-3 w-3' />
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}

                    <HistorySentinel category='text' />

                    {!historyPagination.text.hasMore &&
                      historyItems.text.length > 0 &&
                      !historyPagination.text.isLoading && (
                        <div className='border-border/5 mt-4 mb-20 border-t py-10 text-center'>
                          <p className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase opacity-50'>
                            No more files found
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        ),
        create: () => (
          <div className='space-y-3'>
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-foreground text-xs font-medium'>
                  Label
                </label>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      hasInstruction: !prev.hasInstruction,
                      title: !prev.hasInstruction ? prev.title : "",
                    }))
                  }
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.hasInstruction
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                      inputData.hasInstruction
                        ? "translate-x-3.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {inputData.hasInstruction && (
                <Textarea
                  placeholder='Document your file so you can remember them'
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className='min-h-[80px] resize-none'
                />
              )}
            </div>
            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Status
              </label>
              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-xs'>Public</span>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      status: prev.status === "public" ? "private" : "public",
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.status === "private"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      inputData.status === "private"
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className='text-muted-foreground text-xs'>Private</span>
              </div>
            </div>
            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Content
              </label>
              <Textarea
                placeholder='Write your content here...'
                value={inputData.content}
                onChange={(e) =>
                  setInputData((prev) => ({ ...prev, content: e.target.value }))
                }
                className='min-h-[200px] resize-none'
              />
            </div>
          </div>
        ),
      },
    },
    globe: {
      title: "Social Media",
      icon: Globe,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      tabs: ["all", "socials", "added"],
      content: {
        all: () => (
          <div className='space-y-3'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search socials...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-9 pr-10 pl-10'
              />
              {searchQuery && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                  onClick={() => setSearchQuery("")}
                  title='Clear Search'
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
            </div>

            <div className='scrollbar-thumb-muted h-60 scrollbar-thin scrollbar-track-transparent overflow-y-auto pr-2 pb-20'>
              <div className='flex flex-col gap-y-2'>
                {historyItems.social.length === 0 &&
                !historyPagination.social.isLoading ? (
                  <div className='py-8 text-center'>
                    <Globe className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                    <p className='text-muted-foreground text-sm'>
                      No social history yet
                    </p>
                  </div>
                ) : (
                  <>
                    {historyItems.social
                      .filter((item: any) =>
                        (item.prompt || item.content || "")
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((item: any) => (
                        <Card
                          key={item.id}
                          className={`border-border/50 cursor-pointer p-3 transition-colors ${
                            selectedItem?.id === item.id
                              ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className='flex items-start gap-3'>
                            <div className='mt-1 flex h-10 w-10 items-center justify-center rounded-md bg-pink-500/10'>
                              <Globe className='h-5 w-5 text-pink-500' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-foreground line-clamp-1 text-sm font-medium'>
                                {item.prompt || "Social Content"}
                              </p>
                              <p className='text-muted-foreground mt-0.5 line-clamp-2 text-xs'>
                                {item.content}
                              </p>
                              <div className='text-muted-foreground mt-1 flex items-center gap-2 text-[10px]'>
                                <Badge
                                  variant='outline'
                                  className='text-primary h-3.5 bg-indigo-600 px-1 py-0 hover:bg-indigo-700/5'
                                >
                                  Social
                                </Badge>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    item.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {selectedItem?.id === item.id && (
                              <div className='mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                <CheckCircle className='text-primary-foreground h-3 w-3' />
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}

                    {!historyPagination.text.hasMore &&
                      historyItems.text.filter((item) => item.type === "social")
                        .length > 0 &&
                      !historyPagination.text.isLoading && (
                        <div className='border-border/5 mt-4 mb-20 border-t py-10 text-center'>
                          <p className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase opacity-50'>
                            No more files found
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        ),
        socials: () => (
          <div className='flex h-full flex-col'>
            {!selectedSocialPlatform ? (
              <>
                <div className='flex-shrink-0 space-y-3'>
                  <div className='relative'>
                    <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                    <Input
                      placeholder='Search images, videos, audio, social content...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='h-9 pr-10 pl-10'
                    />
                    {searchQuery && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                        onClick={() => setSearchQuery("")}
                        title='Clear Search'
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                </div>
                <div className='scrollbar-thumb-muted mt-3 max-h-60 flex-1 scrollbar-thin scrollbar-track-transparent overflow-y-auto pr-2'>
                  <div className='space-y-2'>
                    {/* Social Media Platforms */}
                    {!searchQuery && (
                      <div className='space-y-3'>
                        <div className='grid grid-cols-2 gap-2'>
                          {socialPlatforms.map((platform) => (
                            <Card
                              key={platform.id}
                              className={`border-border/50 cursor-pointer p-3 transition-colors ${
                                selectedSocialPlatform === platform.id
                                  ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() =>
                                setSelectedSocialPlatform(platform.id)
                              }
                            >
                              <div className='flex items-center gap-2'>
                                <div
                                  className={`h-8 w-8 ${platform.bg} flex items-center justify-center rounded-md`}
                                >
                                  {platform.icon}
                                </div>
                                <span className='text-foreground text-sm font-medium'>
                                  {platform.name}
                                </span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search Results - Show files from all categories */}
                    {searchQuery && (
                      <div className='space-y-2'>
                        {/* Search Results - Images */}
                        {userFiles.image
                          .filter((file: any) =>
                            file.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                          .map((file: any) => (
                            <Card
                              key={`search-image-${file.id}`}
                              className={`border-border/50 cursor-pointer p-3 transition-colors ${
                                selectedItem?.id === file.id &&
                                selectedItem?.type === "image"
                                  ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() => {
                                handleFileSelect({ ...file, type: "image" });
                                // Set the integration type to match the file type
                                setSelectedIntegrationType("image");
                                // Switch to the appropriate tab for the selected file type
                                setActiveTab("all");
                              }}
                            >
                              <div className='flex items-center gap-3'>
                                <div className='bg-muted relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md'>
                                  {file.url ? (
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className='h-full w-full object-cover'
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        target.nextElementSibling?.classList.remove(
                                          "hidden"
                                        );
                                      }}
                                    />
                                  ) : null}
                                  <ImageIcon className='text-muted-foreground absolute inset-0 m-auto h-5 w-5' />
                                </div>
                                <div className='min-w-0 flex-1'>
                                  <p className='text-foreground truncate text-sm font-medium'>
                                    {file.name}
                                  </p>
                                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                    <Badge
                                      variant='secondary'
                                      className='h-4 px-1 py-0 text-xs'
                                    >
                                      Image
                                    </Badge>
                                    <span>•</span>
                                    <span>{file.size}</span>
                                    <span>•</span>
                                    <span>{file.date}</span>
                                  </div>
                                </div>
                                <div className='flex items-center gap-1'>
                                  {selectedItem?.id === file.id &&
                                    selectedItem?.type === "image" && (
                                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                        <CheckCircle className='text-primary-foreground h-3 w-3' />
                                      </div>
                                    )}
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='hover:bg-destructive/10 hover:text-destructive h-6 w-6 p-0'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteItem(file.id, "image");
                                    }}
                                    title='Delete file'
                                  >
                                    <Trash2 className='h-3 w-3' />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}

                        {/* Search Results - Videos */}
                        {userFiles.video
                          .filter((file: any) =>
                            file.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                          .map((file: any) => (
                            <Card
                              key={`search-video-${file.id}`}
                              className={`border-border/50 cursor-pointer p-3 transition-colors ${
                                selectedItem?.id === file.id &&
                                selectedItem?.type === "video"
                                  ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() => {
                                handleFileSelect({ ...file, type: "video" });
                                // Set the integration type to match the file type
                                setSelectedIntegrationType("video");
                                // Switch to the appropriate tab for the selected file type
                                setActiveTab("all");
                              }}
                            >
                              <div className='flex items-center gap-3'>
                                <div className='bg-muted relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md'>
                                  {file.url ? (
                                    <video
                                      src={file.url}
                                      className='h-full w-full object-cover'
                                      onLoadedData={(e) => {
                                        const video =
                                          e.target as HTMLVideoElement;
                                        video.currentTime = 1;
                                      }}
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLVideoElement;
                                        target.style.display = "none";
                                        target.nextElementSibling?.classList.remove(
                                          "hidden"
                                        );
                                      }}
                                    />
                                  ) : null}
                                  <div className='absolute inset-0 flex items-center justify-center'>
                                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-black/50'>
                                      <Play className='h-3 w-3 text-white' />
                                    </div>
                                  </div>
                                </div>
                                <div className='min-w-0 flex-1'>
                                  <p className='text-foreground truncate text-sm font-medium'>
                                    {file.name}
                                  </p>
                                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                    <Badge
                                      variant='secondary'
                                      className='h-4 px-1 py-0 text-xs'
                                    >
                                      Video
                                    </Badge>
                                    <span>•</span>
                                    <span>{file.duration}</span>
                                    <span>•</span>
                                    <span>{file.size}</span>
                                    <span>•</span>
                                    <span>{file.date}</span>
                                  </div>
                                </div>
                                <div className='flex items-center gap-1'>
                                  {selectedItem?.id === file.id &&
                                    selectedItem?.type === "video" && (
                                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                        <CheckCircle className='text-primary-foreground h-3 w-3' />
                                      </div>
                                    )}
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='hover:bg-destructive/10 hover:text-destructive h-6 w-6 p-0'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteItem(file.id, "video");
                                    }}
                                    title='Delete file'
                                  >
                                    <Trash2 className='h-3 w-3' />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}

                        {/* Search Results - Audio */}
                        {userFiles.audio
                          .filter((file: any) =>
                            file.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                          .map((file: any) => (
                            <Card
                              key={`search-audio-${file.id}`}
                              className={`border-border/50 cursor-pointer p-3 transition-colors ${
                                selectedItem?.id === file.id &&
                                selectedItem?.type === "audio"
                                  ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() => {
                                handleFileSelect({ ...file, type: "audio" });
                                // Set the integration type to match the file type
                                setSelectedIntegrationType("mic");
                                // Switch to the appropriate tab for the selected file type
                                setActiveTab("all");
                              }}
                            >
                              <div className='flex items-center gap-3'>
                                <div className='flex h-10 w-10 items-center justify-center rounded-md bg-green-500/10'>
                                  <Music className='h-5 w-5 text-green-500' />
                                </div>
                                <div className='min-w-0 flex-1'>
                                  <p className='text-foreground truncate text-sm font-medium'>
                                    {file.name}
                                  </p>
                                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                    <Badge
                                      variant='secondary'
                                      className='h-4 px-1 py-0 text-xs'
                                    >
                                      Audio
                                    </Badge>
                                    <span>•</span>
                                    <span>{file.duration}</span>
                                    <span>•</span>
                                    <span>{file.size}</span>
                                    <span>•</span>
                                    <span>{file.date}</span>
                                  </div>
                                </div>
                                <div className='flex items-center gap-1'>
                                  {selectedItem?.id === file.id &&
                                    selectedItem?.type === "audio" && (
                                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                        <CheckCircle className='text-primary-foreground h-3 w-3' />
                                      </div>
                                    )}
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='hover:bg-destructive/10 hover:text-destructive h-6 w-6 p-0'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteItem(file.id, "audio");
                                    }}
                                    title='Delete file'
                                  >
                                    <Trash2 className='h-3 w-3' />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}

                        {/* No Results */}
                        {!userFiles.image.some((file: any) =>
                          file.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        ) &&
                          !userFiles.video.some((file: any) =>
                            file.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          ) &&
                          !userFiles.audio.some((file: any) =>
                            file.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          ) && (
                            <div className='py-8 text-center'>
                              <Search className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                              <p className='text-muted-foreground text-sm'>
                                No content found
                              </p>
                              <p className='text-muted-foreground text-xs'>
                                Upload files or add content to search through
                                them
                              </p>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Selected platform view
              <div className='space-y-4'>
                <div className='mb-4 flex items-center gap-3'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedSocialPlatform(null)}
                    className='hover:bg-muted h-8 w-8 p-0'
                  >
                    <X className='h-8 w-8' />
                  </Button>
                  <div
                    className={`h-8 w-8 ${getPlatformConfig(selectedSocialPlatform)?.bg} flex items-center justify-center rounded`}
                  >
                    {getPlatformConfig(selectedSocialPlatform)?.icon}
                  </div>
                  <div>
                    <h3 className='text-foreground text-sm font-semibold'>
                      Add{" "}
                      {selectedSocialPlatform?.charAt(0).toUpperCase() +
                        selectedSocialPlatform?.slice(1)}{" "}
                      Content
                    </h3>
                    <p className='text-muted-foreground text-xs'>
                      Enter your content url
                    </p>
                  </div>
                </div>
                <div>
                  <div className='mb-2 flex items-center justify-between'>
                    <label className='text-foreground text-xs font-medium'>
                      Label
                    </label>
                    <button
                      type='button'
                      onClick={() =>
                        setInputData((prev) => ({
                          ...prev,
                          hasInstruction: !prev.hasInstruction,
                          title: !prev.hasInstruction ? prev.title : "",
                        }))
                      }
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                        inputData.hasInstruction
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                          inputData.hasInstruction
                            ? "translate-x-3.5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  {inputData.hasInstruction && (
                    <Textarea
                      placeholder='Document your file so you can remember them'
                      value={inputData.title}
                      onChange={(e) =>
                        setInputData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className='min-h-[80px] resize-none'
                    />
                  )}
                </div>
                <div>
                  <label className='text-foreground mb-2 block text-xs font-medium'>
                    Status
                  </label>
                  <div className='flex items-center space-x-3'>
                    <span className='text-muted-foreground text-xs'>
                      Public
                    </span>
                    <button
                      type='button'
                      onClick={() =>
                        setInputData((prev) => ({
                          ...prev,
                          status:
                            prev.status === "public" ? "private" : "public",
                        }))
                      }
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                        inputData.status === "private"
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          inputData.status === "private"
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className='text-muted-foreground text-xs'>
                      Private
                    </span>
                  </div>
                </div>
                <div>
                  <label className='text-foreground mb-2 block text-xs font-medium'>
                    {selectedSocialPlatform?.charAt(0).toUpperCase() +
                      selectedSocialPlatform?.slice(1)}{" "}
                    URL
                  </label>
                  <div className='relative'>
                    <Input
                      placeholder={
                        selectedSocialPlatform === "whatsapp"
                          ? "WhatsApp URL or phone number"
                          : `https://${selectedSocialPlatform}.com/...`
                      }
                      value={inputData.url}
                      onChange={(e) =>
                        setInputData((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                      className='h-9 pr-10'
                    />
                    {inputData.url && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                        onClick={() =>
                          setInputData((prev) => ({ ...prev, url: "" }))
                        }
                        title='Clear URL'
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                </div>
                <div className='text-muted-foreground text-xs'>
                  <div className='flex items-center gap-2'>
                    <Info className='h-3 w-3' />
                    <span>
                      Content will be fetched and added to your workflow
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
        added: () => (
          <div className='space-y-3'>
            <div className='py-8 text-center'>
              <MessageCircle className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
              <p className='text-muted-foreground text-sm'>
                No social content added yet
              </p>
              <p className='text-muted-foreground text-xs'>
                Add content from social platforms to see it here
              </p>
            </div>
          </div>
        ),
      },
    },
    file: {
      title: "Documents & Files",
      icon: FileText,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      tabs: ["all", "upload", "url"],
      content: {
        all: () => (
          <div className='space-y-3'>
            {/* Search Bar */}
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search document files...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-9 pr-10 pl-10'
              />
              {searchQuery && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                  onClick={() => setSearchQuery("")}
                  title='Clear Search'
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
            </div>

            <div className='scrollbar-thumb-muted h-60 scrollbar-thin scrollbar-track-transparent overflow-y-auto pr-2 pb-20'>
              <div className='flex flex-col gap-y-2'>
                {userFiles.document.length === 0 &&
                historyItems.docs.length === 0 &&
                !historyPagination.docs.isLoading ? (
                  <div className='py-8 text-center'>
                    <FileText className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                    <p className='text-muted-foreground text-sm'>
                      No documents yet
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      Generate docs or upload files
                    </p>
                  </div>
                ) : (
                  <>
                    {/* User Uploaded Documents */}
                    {userFiles.document
                      .filter((file: any) =>
                        file.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((file: any) => (
                        <Card
                          key={file.id}
                          className={`border-border/50 cursor-pointer p-3 transition-colors ${
                            selectedItem?.id === file.id &&
                            selectedItem?.type === "document"
                              ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() =>
                            setSelectedItem({ ...file, type: "document" })
                          }
                        >
                          <div className='flex items-center gap-3'>
                            <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-md'>
                              <FileText className='text-muted-foreground h-5 w-5' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-foreground truncate text-sm font-medium'>
                                {file.name}
                              </p>
                              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                <span>{file.size || "File"}</span>
                                <span>•</span>
                                <span>{file.date || "Upload"}</span>
                              </div>
                            </div>
                            {selectedItem?.id === file.id && (
                              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                <CheckCircle className='text-primary-foreground h-3 w-3' />
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}

                    {/* Generated History Documents */}
                    {historyItems.docs
                      .filter((item: any) =>
                        (item.prompt || item.content || "")
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((item: any) => (
                        <Card
                          key={item.id}
                          className={`border-border/50 cursor-pointer p-3 transition-colors ${
                            selectedItem?.id === item.id
                              ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/10"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500/10'>
                              <FileText className='h-5 w-5 text-indigo-500' />
                            </div>
                            <div className='min-w-0 flex-1'>
                              <p className='text-foreground truncate text-sm font-medium'>
                                {item.prompt || "Generated Doc"}
                              </p>
                              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                <Badge
                                  variant='outline'
                                  className='text-primary h-4 bg-indigo-600 px-1 py-0 text-[10px] hover:bg-indigo-700/5'
                                >
                                  Generated
                                </Badge>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    item.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {selectedItem?.id === item.id && (
                              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700'>
                                <CheckCircle className='text-primary-foreground h-3 w-3' />
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}

                    <HistorySentinel category='docs' />

                    {!historyPagination.docs.hasMore &&
                      (userFiles.document.length > 0 ||
                        historyItems.docs.length > 0) &&
                      !historyPagination.docs.isLoading && (
                        <div className='border-border/5 mt-4 mb-20 border-t py-10 text-center'>
                          <p className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase opacity-50'>
                            No more files found
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        ),
        upload: () => (
          <div className='space-y-3'>
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-foreground text-xs font-medium'>
                  Instruction
                </label>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      hasInstruction: !prev.hasInstruction,
                      title: !prev.hasInstruction ? prev.title : "",
                    }))
                  }
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.hasInstruction
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                      inputData.hasInstruction
                        ? "translate-x-3.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {inputData.hasInstruction && (
                <Textarea
                  placeholder='document your file so you can remember them'
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className='min-h-[80px] resize-none'
                />
              )}
            </div>

            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Status
              </label>
              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-xs'>Public</span>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      status: prev.status === "public" ? "private" : "public",
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.status === "private"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      inputData.status === "private"
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className='text-muted-foreground text-xs'>Private</span>
              </div>
            </div>

            <div
              className='border-border hover:border-primary/50 rounded-md border-2 border-dashed p-6 text-center transition-colors'
              onDrop={(e) => handleDrop(e, "document")}
              onDragOver={handleDragOver}
            >
              <input
                type='file'
                accept='.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
                onChange={(e) => handleFileInputChange(e, "document")}
                className='hidden'
                id='document-upload'
              />
              <label htmlFor='document-upload' className='cursor-pointer'>
                <Upload className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                <p className='text-muted-foreground mb-2 text-sm'>
                  Drop files here or click to browse
                </p>
                <p className='text-muted-foreground text-xs'>
                  PDF, DOC, XLS, PPT up to 50MB
                </p>
              </label>
            </div>
          </div>
        ),
        url: () => (
          <div className='space-y-3'>
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-foreground text-xs font-medium'>
                  Label
                </label>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      hasInstruction: !prev.hasInstruction,
                      title: !prev.hasInstruction ? prev.title : "",
                    }))
                  }
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.hasInstruction
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                      inputData.hasInstruction
                        ? "translate-x-3.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {inputData.hasInstruction && (
                <Textarea
                  placeholder='document your file so you can remember them'
                  value={inputData.title}
                  onChange={(e) =>
                    setInputData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className='min-h-[80px] resize-none'
                />
              )}
            </div>
            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                Status
              </label>
              <div className='flex items-center space-x-3'>
                <span className='text-muted-foreground text-xs'>Public</span>
                <button
                  type='button'
                  onClick={() =>
                    setInputData((prev) => ({
                      ...prev,
                      status: prev.status === "public" ? "private" : "public",
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    inputData.status === "private"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      inputData.status === "private"
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>
                <span className='text-muted-foreground text-xs'>Private</span>
              </div>
            </div>
            <div>
              <label className='text-foreground mb-2 block text-xs font-medium'>
                File URL
              </label>
              <div className='relative'>
                <Input
                  placeholder='https://example.com/document.pdf'
                  value={inputData.url}
                  onChange={(e) =>
                    setInputData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className='h-9 pr-10'
                />
                {inputData.url && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='hover:bg-muted absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-full p-0'
                    onClick={() =>
                      setInputData((prev) => ({ ...prev, url: "" }))
                    }
                    title='Clear URL'
                  >
                    <X className='h-3 w-3' />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ),
      },
    },
  };

  return (
    <div className='fixed top-1/2 left-4 z-50 flex -translate-y-1/2 items-center'>
      {/* Main Sidebar */}
      <div className='bg-muted/50 border-border flex flex-col items-center space-y-2 rounded-md border p-2 shadow-lg backdrop-blur-sm'>
        {/* Media Section */}

        <div className='flex flex-col items-center space-y-1'>
          <Button
            variant='ghost'
            size='sm'
            className={`h-8 w-8 rounded-md p-0 transition-all duration-200 ${
              selectedIntegrationType === "mic"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-accent hover:bg-indigo-600 hover:bg-indigo-700/20"
            }`}
            title='Audio & Voice'
            onClick={() => handleIconClick("mic")}
          >
            <Mic className='h-8 w-8' />
          </Button>
          <span className='text-muted-foreground text-[10px]'>Audio</span>
        </div>

        <div className='flex flex-col items-center space-y-1'>
          <Button
            variant='ghost'
            size='sm'
            className={`h-8 w-8 rounded-md p-0 transition-all duration-200 ${
              selectedIntegrationType === "image"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-accent hover:bg-indigo-600 hover:bg-indigo-700/20"
            }`}
            title='Images'
            onClick={() => handleIconClick("image")}
          >
            <ImageIcon className='h-8 w-8' />
          </Button>
          <span className='text-muted-foreground text-[10px]'>Images</span>
        </div>

        <div className='flex flex-col items-center space-y-1'>
          <Button
            variant='ghost'
            size='sm'
            className={`h-8 w-8 rounded-md p-0 transition-all duration-200 ${
              selectedIntegrationType === "video"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-accent hover:bg-indigo-600 hover:bg-indigo-700/20"
            }`}
            title='Video'
            onClick={() => handleIconClick("video")}
          >
            <Play className='h-8 w-8' />
          </Button>
          <span className='text-muted-foreground text-[10px]'>Video</span>
        </div>

        <div className='flex flex-col items-center space-y-1'>
          <Button
            variant='ghost'
            size='sm'
            className={`h-8 w-8 rounded-md p-0 transition-all duration-200 ${
              selectedIntegrationType === "text"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-accent hover:bg-indigo-600 hover:bg-indigo-700/20"
            }`}
            title='Text'
            onClick={() => handleIconClick("text")}
          >
            <Type className='h-8 w-8' />
          </Button>
          <span className='text-muted-foreground text-[10px]'>Text</span>
        </div>

        {/* <div className="flex flex-col items-center space-y-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 rounded-md transition-all duration-200 ${
                selectedIntegrationType === "database"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-accent hover:bg-indigo-600 hover:bg-indigo-700/20"
              }`}
              title="Database (Coming Soon)"
              onClick={() => handleIconClick("database")}
            >
              <Database className="w-8 h-8" />
            </Button>
            <div className="absolute -top-1 -right-1">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground">Database</span>
        </div> */}

        <div className='flex flex-col items-center space-y-1'>
          <Button
            variant='ghost'
            size='sm'
            className={`h-8 w-8 rounded-md p-0 transition-all duration-200 ${
              selectedIntegrationType === "globe"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-accent hover:bg-indigo-600 hover:bg-indigo-700/20"
            }`}
            title='Social Media'
            onClick={() => handleIconClick("globe")}
          >
            <Globe className='h-8 w-8' />
          </Button>
          <span className='text-muted-foreground text-[10px]'>Social</span>
        </div>

        <div className='flex flex-col items-center space-y-1'>
          <Button
            variant='ghost'
            size='sm'
            className={`bg-accent h-8 w-8 rounded-md p-0 transition-all duration-200 hover:bg-indigo-600 hover:bg-indigo-700/20`}
            title='Add Prompt'
            onClick={() => onAddIntegration("prompt", {})}
          >
            <MessageCircle className='h-8 w-8' />
          </Button>
          <span className='text-muted-foreground text-[10px]'>Prompt</span>
        </div>

        <div className='flex flex-col items-center space-y-1'>
          <Button
            variant='ghost'
            size='sm'
            className={`h-8 w-8 rounded-md p-0 transition-all duration-200 ${
              selectedIntegrationType === "file"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-accent hover:bg-indigo-600 hover:bg-indigo-700/20"
            }`}
            title='Documents'
            onClick={() => handleIconClick("file")}
          >
            <FileText className='h-8 w-8' />
          </Button>
          <span className='text-muted-foreground text-[10px]'>Docs</span>
        </div>
      </div>

      {/* Sleek Modal */}
      {showModal && (
        <div className='bg-muted/20 border-border ml-3 flex max-h-[600px] w-80 flex-col rounded-xl border shadow-2xl backdrop-blur-sm'>
          <div className='flex-shrink-0 p-4 pb-0'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                {selectedIntegrationType && (
                  <>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-md ${
                        selectedIntegrationType === "mic"
                          ? "bg-muted/30"
                          : selectedIntegrationType === "image"
                            ? "bg-muted/30"
                            : selectedIntegrationType === "video"
                              ? "bg-muted/30"
                              : selectedIntegrationType === "text"
                                ? "bg-muted/30"
                                : selectedIntegrationType === "globe"
                                  ? "bg-muted/30"
                                  : selectedIntegrationType === "file"
                                    ? "bg-muted/30"
                                    : "bg-muted/30"
                      }`}
                    >
                      {selectedIntegrationType === "mic" && (
                        <Mic className='h-5 w-5 text-green-500' />
                      )}
                      {selectedIntegrationType === "image" && (
                        <ImageIcon className='h-5 w-5 text-purple-500' />
                      )}
                      {selectedIntegrationType === "video" && (
                        <Play className='h-5 w-5 text-blue-500' />
                      )}
                      {selectedIntegrationType === "text" && (
                        <Type className='h-5 w-5 text-orange-500' />
                      )}
                      {selectedIntegrationType === "globe" && (
                        <Globe className='h-5 w-5 text-pink-500' />
                      )}
                      {selectedIntegrationType === "file" && (
                        <FileText className='h-5 w-5 text-indigo-500' />
                      )}
                    </div>
                    <div>
                      <h3 className='text-foreground text-sm font-semibold'>
                        {selectedIntegrationType === "mic" && "Audio & Voice"}
                        {selectedIntegrationType === "image" &&
                          "Images & Graphics"}
                        {selectedIntegrationType === "video" && "Video Content"}
                        {selectedIntegrationType === "text" &&
                          "Text & Documents"}
                        {selectedIntegrationType === "globe" && "Social Media"}
                        {selectedIntegrationType === "file" &&
                          "Documents & Files"}
                      </h3>
                      <p className='text-muted-foreground line-clamp-1 w-40 truncate text-xs'>
                        {selectedIntegrationType === "mic" &&
                          (selectedItem
                            ? `Selected: ${selectedItem.name}`
                            : "Audio & Voice Content")}
                        {selectedIntegrationType === "image" &&
                          (selectedItem
                            ? `Selected: ${selectedItem.name}`
                            : "Images & Graphics")}
                        {selectedIntegrationType === "video" &&
                          (selectedItem
                            ? `Selected: ${selectedItem.name}`
                            : "Video Content")}
                        {selectedIntegrationType === "text" &&
                          "Text & Documents"}
                        {selectedIntegrationType === "globe" &&
                          "Social Media Content"}
                        {selectedIntegrationType === "file" &&
                          "Documents & Files"}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={resetModal}
                className='hover:bg-muted h-6 w-6 p-0'
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          </div>
          <div className='flex-1 overflow-hidden px-4'>
            {/* Tabs - Fixed at top, outside scroll section */}
            {selectedIntegrationType && (
              <div className='mb-4'>
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className='w-full'
                >
                  <TabsList className='grid h-8 w-full grid-cols-3'>
                    {modalConfigs[
                      selectedIntegrationType as keyof typeof modalConfigs
                    ]?.tabs.map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className='h-6 text-xs capitalize'
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            <div className='scrollbar-thumb-muted flex-1 scrollbar-thin scrollbar-track-transparent overflow-y-auto'>
              <div className='space-y-4'>{renderModalContent()}</div>
            </div>
          </div>
          {!(
            modalConfigs[
              selectedIntegrationType as keyof typeof modalConfigs
            ] as any
          )?.hideFooter && (
            <div className='flex-shrink-0 p-4 pt-0'>
              <div className='border-border flex space-x-2 border-t pt-3'>
                <Button
                  onClick={resetModal}
                  variant='outline'
                  size='sm'
                  className='h-8 flex-1 bg-transparent text-xs'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleIntegrationAdd}
                  disabled={
                    isUploading ||
                    (selectedIntegrationType === "text"
                      ? !inputData.content.trim() && !selectedItem
                      : !inputData.url.trim() &&
                        !selectedItem &&
                        activeTab !== "all")
                  }
                  size='sm'
                  className='text-primary-foreground h-8 flex-1 bg-indigo-600 text-xs hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90'
                >
                  {isUploading ? (
                    <>
                      <LoadingFileLoader size={16} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className='mr-1 h-3 w-3' />
                      Add to Canvas
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
