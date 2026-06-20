"use client";

import TemplateGrid from "../common/templateGrid";
import TemplateGridAll from "../common/templateGridAll";
import { Skeleton } from "../ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useUserContext } from "@/context/AuthenticatedContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommunityContent } from "@/types/inspire";
import GridLoading from "@/utils/girdLoading";
import { communityApi } from "@/utils/inspire-api";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Eye,
  Heart,
  Loader2,
  RefreshCw,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Socket, io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

export interface GenerationParamsCallback {
  // Common
  setPrompt: (prompt: string) => void;
  setAspectRatio?: (aspectRatio: string) => void;
  setResolution?: (resolution: string) => void;
  setModel?: (model: any) => void;

  // Image specific
  setStyle?: (style: string) => void;
  setImageCount?: (count: number) => void;
  setReferenceImages?: (images: File[]) => void;

  // Switch to preview tab
  onTabChange: (
    tab: "preview" | "community" | "templates" | "tutorial"
  ) => void;
}

interface DesignsCommunityTabProps {
  onPromptSelect: (prompt: string) => void;
  onTabChange: (
    tab: "preview" | "community" | "templates" | "tutorial"
  ) => void;
  onParamsRestore?: GenerationParamsCallback;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export function DesignsCommunityTab({
  onPromptSelect,
  onTabChange,
  onParamsRestore,
}: DesignsCommunityTabProps) {
  const { user } = useUserContext();
  const router = useRouter();
  const [images, setImages] = useState<CommunityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CommunityContent | null>(
    null
  );
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [likingImageId, setLikingImageId] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isCommunityPage, setIsCommunityPage] = useState(false);

  const pathname = usePathname();

  // Initialize socket connection
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        transports: ["websocket", "polling"],
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {});

    socket.on(
      "community:like-updated",
      (data: { contentId: string; likes: number; liked: boolean }) => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === data.contentId
              ? { ...img, likes: data.likes, isLiked: data.liked }
              : img
          )
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await communityApi.getContent({
          type: "image",
          page: 1,
          limit: 20,
          sort: "recent",
        });
        if (response.success && response.data) {
          const fetchedImages = response.data.content || [];
          setImages(fetchedImages);
          setHasMore(response.data.pagination?.hasNextPage || false);

          // Initialize liked images set from API response
          const liked = new Set<string>();
          fetchedImages.forEach((img) => {
            if (img.isLiked) {
              liked.add(img.id);
            }
          });
          setLikedImages(liked);
        } else {
          console.error("Failed to fetch images:", response);
          setImages([]);
        }
      } catch (error) {
        console.error("Error fetching community images:", error);
        toast({
          title: "Error",
          description: "Failed to load community images. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (pathname === "/community") {
      setIsCommunityPage(true);
    } else {
      setIsCommunityPage(false);
    }

    fetchImages();
  }, [pathname]);

  useEffect(() => {
    if (page === 1) return;

    const fetchMoreImages = async () => {
      try {
        setLoadingMore(true);
        const response = await communityApi.getContent({
          type: "image",
          page,
          limit: 20,
          sort: "recent",
        });
        if (response.success && response.data) {
          setImages((prev) => [...prev, ...response.data.content]);
          setHasMore(response.data.pagination.hasNextPage);
        }
      } catch (error) {
        console.error("Error fetching more images:", error);
      } finally {
        setLoadingMore(false);
      }
    };

    fetchMoreImages();
  }, [page]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore]);

  if (loading) {
    return <GridLoading />;
  }

  return <TemplateGridAll />;
}
