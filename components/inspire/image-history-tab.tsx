"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, ImageIcon, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiResponse } from "@/utils/apiResponse";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HistoryImage {
  _id: string;
  imageData: {
    url: string;
    thumbnail: string;
    prompt: string;
    aspectRatio: string;
    resolution: string;
    style?: string;
    referenceImageUrls?: string[];
  };
  createdAt: string;
}

interface ImageHistoryTabProps {
  onLoadToEditor: (image: HistoryImage) => void;
  onTabChange?: (
    tab: "preview" | "history" | "community" | "templates" | "tutorial",
  ) => void;
}

export function ImageHistoryTab({
  onLoadToEditor,
  onTabChange,
}: ImageHistoryTabProps) {
  const [images, setImages] = useState<HistoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<HistoryImage | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiResponse.get(
        `/project/myprojects?type=ai-image-gen&limit=50`,
        { withCredentials: true },
      );

      if (response.status === 200) {
        const projects = response.data.projects || [];
        const historyImages = projects
          .filter((p: any) => p.imageData)
          .map((p: any) => ({
            _id: p._id,
            imageData: p.imageData,
            createdAt: p.createdAt,
          }));
        setImages(historyImages);
      }
    } catch (error: any) {
      console.error("Error fetching image history:", error);
      toast({
        title: "Error",
        description: "Failed to load image history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;

    try {
      setDeletingId(imageToDelete._id);
      // Use the direct delete endpoint for generated images
      const response = await apiResponse.delete(
        `/inspire/generate/image/${imageToDelete._id}`,
        { withCredentials: true },
      );

      if (response.status === 200 && response.data.success) {
        setImages((prev) =>
          prev.filter((img) => img._id !== imageToDelete._id),
        );
        toast({
          title: "Deleted",
          description: "Image has been deleted successfully",
        });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete image",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const openDeleteDialog = (image: HistoryImage, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 text-neutral-400 dark:text-neutral-500 animate-spin mb-3" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading history images
          </p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="p-4">
        <div className="relative w-full rounded-xl overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No history yet
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Your generated images will appear here
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
        <div className="columns-2 lg:columns-3 gap-4">
          {images.map((image, index) => {
            // Use aspectRatio from image data or predefined array (same as community cards)
            const aspectRatios = ["1/1", "3/4", "4/5", "9/16", "3/2"];
            const aspectRatio =
              image.imageData.aspectRatio?.replace(":", "/") ||
              aspectRatios[index % aspectRatios.length];

            return (
              <div
                key={image._id}
                className="group relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer break-inside-avoid mb-4"
                onClick={(e) => {
                  e.stopPropagation()
                  onTabChange?.("preview");
                  onLoadToEditor(image);
                }}
              >
                <div className="relative">
                  <img
                    src={image.imageData.thumbnail || image.imageData.url}
                    alt={image.imageData.prompt || "Generated image"}
                    className="w-full object-cover"
                    style={{ aspectRatio }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => openDeleteDialog(image, e)}
                      className="w-10 h-10 rounded-lg bg-black/70 hover:bg-black/80 flex items-center justify-center text-white transition-colors shadow-lg"
                      title="Delete"
                    >
                      {deletingId === image._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {image.imageData.prompt && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {image.imageData.prompt}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
