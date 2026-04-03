"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Trash2, VideoIcon, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiResponse } from "@/utils/apiResponse";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HistoryVideo {
  _id: string;
  videoData: {
    url: string;
    thumbnail: string;
    prompt: string;
    aspectRatio: string;
    resolution: string;
    duration?: number;
    startFrameUrl?: string;
    endFrameUrl?: string;
    referenceImageUrls?: string[];
  };
  createdAt: string;
}

interface VideoHistoryTabProps {
  onLoadToEditor: (video: HistoryVideo) => void;
  onTabChange?: (
    tab: "preview" | "history" | "community" | "templates" | "tutorial",
  ) => void;
}

export function VideoHistoryTab({
  onLoadToEditor,
  onTabChange,
}: VideoHistoryTabProps) {
  const [videos, setVideos] = useState<HistoryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<HistoryVideo | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiResponse.get(
        `/project/myprojects?type=ai-video-gen&limit=50`,
        { withCredentials: true },
      );

      if (response.status === 200) {
        const projects = response.data.projects || [];
        const historyVideos = projects
          .filter((p: any) => p.videoData)
          .map((p: any) => ({
            _id: p._id,
            videoData: p.videoData,
            createdAt: p.createdAt,
          }));
        setVideos(historyVideos);
      }
    } catch (error: any) {
      console.error("Error fetching video history:", error);
      toast({
        title: "Error",
        description: "Failed to load video history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;

    try {
      setDeletingId(videoToDelete._id);
      // Use the direct delete endpoint for generated videos
      const response = await apiResponse.delete(
        `/inspire/generate/video/${videoToDelete._id}`,
        { withCredentials: true },
      );

      if (response.status === 200 && response.data.success) {
        setVideos((prev) =>
          prev.filter((vid) => vid._id !== videoToDelete._id),
        );
        toast({
          title: "Deleted",
          description: "Video has been deleted successfully",
        });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error: any) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete video",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  const openDeleteDialog = (video: HistoryVideo, e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 text-neutral-400 dark:text-neutral-500 animate-spin mb-3" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading history videos
          </p>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="p-4">
        <div className="relative w-full rounded-xl overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <VideoIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No history yet
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Your generated videos will appear here
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="p-4">
        {/* Masonry Grid */}
        <div className="columns-2 lg:columns-4 gap-4">
          {videos.map((video, index) => (
            <VideoCard
              key={video._id}
              video={video}
              index={index}
              deletingId={deletingId}
              onLoadToEditor={onLoadToEditor}
              onTabChange={onTabChange}
              onDelete={(e) => openDeleteDialog(video, e)}
            />
          ))}
        </div>
      </section>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Video</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this video? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function VideoCard({
  video,
  index,
  deletingId,
  onLoadToEditor,
  onTabChange,
  onDelete,
}: {
  video: HistoryVideo;
  index: number;
  deletingId: string | null;
  onLoadToEditor: (video: HistoryVideo) => void;
  onTabChange?: (
    tab: "preview" | "history" | "community" | "templates" | "tutorial",
  ) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);

  // Use aspectRatio from video data or predefined array (same as community cards)
  const aspectRatios = ["1/1", "3/4", "4/5", "9/16", "16/9"];
  const aspectRatio =
    video.videoData.aspectRatio?.replace(":", "/") ||
    aspectRatios[index % aspectRatios.length];

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !video.videoData.url) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPlayingRef.current) {
            // Video is in viewport, start auto-play preview
            videoElement.currentTime = 0;
            isPlayingRef.current = true;
            videoElement
              .play()
              .then(() => {
                // Pause after 2 seconds
                timeoutRef.current = setTimeout(() => {
                  videoElement.pause();
                  videoElement.currentTime = 0; // Reset to beginning
                  isPlayingRef.current = false;
                }, 2000);
              })
              .catch((error) => {
                console.error("Error auto-playing video:", error);
                isPlayingRef.current = false;
              });
          } else if (!entry.isIntersecting) {
            // Video is out of viewport, pause and reset
            videoElement.pause();
            videoElement.currentTime = 0;
            isPlayingRef.current = false;
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of video is visible
      },
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [video.videoData.url]);

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer break-inside-avoid mb-4"
      onClick={() => {
        onLoadToEditor(video);
      }}
    >
      <div className="relative">
        {video.videoData.url ? (
          <video
            ref={videoRef}
            src={video.videoData.url}
            poster={video.videoData.thumbnail}
            muted
            playsInline
            preload="metadata"
            className="w-full object-cover"
            style={{ aspectRatio }}
            onError={(e) => {
              console.error("Video load error:", e);
            }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center bg-neutral-800 dark:bg-neutral-900"
            style={{ aspectRatio }}
          >
            <VideoIcon className="w-8 h-8 text-neutral-500 dark:text-neutral-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onLoadToEditor(video);
                onTabChange?.("preview");
              }}
              className="w-10 h-10 rounded-lg bg-black/70 hover:bg-black/80 flex items-center justify-center text-white transition-colors shadow-lg"
              title="Play"
            >
              <Play className="w-6 h-6 text-white ml-1" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="w-10 h-10 rounded-lg bg-black/70 hover:bg-black/80 flex items-center justify-center text-white transition-colors shadow-lg"
              title="Delete"
            >
              {deletingId === video._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      {video.videoData.prompt && (
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm font-medium line-clamp-2">
            {video.videoData.prompt}
          </p>
        </div>
      )}
    </div>
  );
}
