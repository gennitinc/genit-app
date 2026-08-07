"use client";

import { LocalizedText } from "@/components/localized-text";
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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { ImageIcon, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

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
    tab: "preview" | "history" | "community" | "templates" | "tutorial"
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
        { withCredentials: true }
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
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.success) {
        setImages((prev) =>
          prev.filter((img) => img._id !== imageToDelete._id)
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
      <section className='p-4'>
        <div className='flex min-h-[60vh] flex-col items-center justify-center'>
          <LoadingFileLoader size={16} />
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            <LocalizedText text={"Loading history images"} />
          </p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className='p-4'>
        <div className='relative min-h-[400px] w-full overflow-hidden rounded-xl'>
          <div className='absolute inset-0 flex flex-col items-center justify-center p-8 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800'>
              <ImageIcon className='h-8 w-8 text-neutral-400 dark:text-neutral-500' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-neutral-900 dark:text-white'>
              <LocalizedText text={"No history yet"} />
            </h3>
            <p className='text-sm text-neutral-500 dark:text-neutral-400'>
              <LocalizedText text={"Your generated images will appear here"} />
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className='p-4 px-0'>
        {/* Masonry Grid */}
        <div className='columns-2 gap-4 lg:columns-4'>
          {images.map((image, index) => {
            // Use aspectRatio from image data or predefined array (same as community cards)
            const aspectRatios = ["1/1", "3/4", "4/5", "9/16", "3/2"];
            const aspectRatio =
              image.imageData.aspectRatio?.replace(":", "/") ||
              aspectRatios[index % aspectRatios.length];

            return (
              <div
                key={image._id}
                className='group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800'
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange?.("preview");
                  onLoadToEditor(image);
                }}
              >
                <div className='relative'>
                  <img
                    src={image.imageData.thumbnail || image.imageData.url}
                    alt={image.imageData.prompt || "Generated image"}
                    className='w-full object-cover'
                    style={{ aspectRatio }}
                    loading='lazy'
                  />
                  <div className='absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100' />
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
                    <button
                      type='button'
                      onClick={(e) => openDeleteDialog(image, e)}
                      className='flex h-10 w-10 items-center justify-center rounded-lg bg-black/70 text-white shadow-lg transition-colors hover:bg-black/80'
                      title='Delete'
                    >
                      {deletingId === image._id ? (
                        <LoadingFileLoader size={16} />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>
                {image.imageData.prompt && (
                  <div className='absolute right-0 bottom-0 left-0 p-3 opacity-0 transition-opacity group-hover:opacity-100'>
                    <p className='line-clamp-2 text-sm font-medium text-white'>
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
            <AlertDialogTitle>
              <LocalizedText text={"Delete Image"} />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <LocalizedText
                text={
                  "Are you sure you want to delete this image? This action cannot be undone."
                }
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <LocalizedText text={"Cancel"} />
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
            >
              <LocalizedText text={"Delete"} />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
