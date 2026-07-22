"use client";

import { MediaAsset } from "@/components/admin/MediaPicker";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { GradientFrame } from "@/utils/gradient-frame";
import {
  Download,
  Eye,
  File,
  Grid2X2,
  Image as ImageIcon,
  Library,
  List,
  Trash2,
  UploadIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

const formatFileSize = (bytes?: number) => {
  if (bytes === undefined) return "Unknown";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  return `${(bytes / 1024 ** unitIndex).toFixed(unitIndex ? 1 : 0)} ${units[unitIndex]}`;
};

export default function BlogLibraryPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [scope, setScope] = useState<"organization" | "personal">("personal");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [storage, setStorage] = useState<{
    plan: string;
    scope: "organization" | "personal";
    billedTo: "organization-owner" | "user";
    shared: boolean;
    usedBytes: number;
    limitBytes: number;
    remainingBytes: number;
    usagePercent: number;
  } | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [deleteAsset, setDeleteAsset] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
    duration?: number;
  } | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const closePreview = () => {
    setSelectedAsset(null);
    setDimensions(null);
  };

  const loadAssets = async () => {
    setLoading(true);
    try {
      const response = await apiResponse.get("/blog/library");
      setAssets(response.data.assets || []);
      setScope(response.data.scope || "personal");
      setStorage(response.data.storage || null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Could not load media library"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const upload = async (files?: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const selectedFiles = Array.from(files);
      let uploadedCount = 0;
      let uploadError = "";
      for (const file of selectedFiles) {
        try {
          const data = new FormData();
          data.append("file", file);
          await apiResponse.post("/blog/upload", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          uploadedCount += 1;
        } catch (error: any) {
          uploadError = error.response?.data?.message || "Upload failed";
          if (error.response?.status === 413) break;
        }
      }
      const failedCount = selectedFiles.length - uploadedCount;
      if (uploadedCount) {
        toast.success(
          `${uploadedCount} media ${uploadedCount === 1 ? "item" : "items"} added`
        );
      }
      if (failedCount) {
        toast.error(uploadError || `${failedCount} uploads failed`);
      }
      await loadAssets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async (asset: MediaAsset) => {
    try {
      const response = await apiResponse.delete(`/blog/library/${asset._id}`);
      setAssets((current) => current.filter((item) => item._id !== asset._id));
      if (response.data.storage) setStorage(response.data.storage);
      toast.success("Media item deleted");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
      return false;
    }
  };

  const download = async (asset: MediaAsset) => {
    try {
      const response = await apiResponse.get(
        `/blog/library/${encodeURIComponent(asset._id)}/download`,
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = asset.name;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  const previewContent = selectedAsset ? (
    <div className='group relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl p-2 ring-1 ring-black/5 lg:p-6 lg:px-0 dark:bg-white/[0.04] dark:ring-white/10'>
      <GradientFrame />

      <div className='relative z-10 flex flex-col gap-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:flex-row dark:bg-[#0a0a0a] dark:ring-white/10'>
        <div className='relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl bg-black/[0.02] ring-1 ring-black/5 md:w-1/2 dark:bg-white/[0.04] dark:ring-white/10'>
          {selectedAsset.mimeType.startsWith("image") ? (
            <img
              src={selectedAsset.url}
              alt={selectedAsset.name}
              className='h-auto max-h-[60vh] w-auto object-contain'
              onLoad={(event) =>
                setDimensions({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })
              }
            />
          ) : selectedAsset.mimeType.startsWith("video") ? (
            <video
              src={selectedAsset.url}
              controls
              autoPlay
              className='h-auto max-h-[60vh] w-auto object-contain'
              onLoadedMetadata={(event) =>
                setDimensions({
                  width: event.currentTarget.videoWidth,
                  height: event.currentTarget.videoHeight,
                  duration: event.currentTarget.duration,
                })
              }
            />
          ) : (
            <div className='flex flex-col items-center gap-3 text-zinc-500'>
              <File className='h-14 w-14' />
              <span className='max-w-48 truncate text-xs font-medium uppercase'>
                {selectedAsset.mimeType.split("/")[1] || "File"}
              </span>
            </div>
          )}
        </div>

        <div className='flex w-full flex-col justify-between md:w-1/2 md:py-2'>
          <div>
            <div className='flex items-center justify-between gap-4 border-b border-black/5 pb-4 dark:border-white/10'>
              <span className='text-muted-foreground flex items-center gap-2 text-sm dark:text-white/80'>
                <ImageIcon className='h-4 w-4' />
                <span className='font-medium capitalize'>
                  {selectedAsset.source} {selectedAsset.mimeType.split("/")[0]}
                </span>
              </span>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => download(selectedAsset)}
                  className='flex h-8 items-center justify-center gap-1.5 rounded-full bg-indigo-500/10 px-3 text-xs font-medium text-indigo-600 transition hover:bg-indigo-500/20 dark:text-indigo-300'
                >
                  <Download className='h-3.5 w-3.5' /> Download
                </button>
                <button
                  type='button'
                  onClick={() => setDeleteAsset(selectedAsset)}
                  className='flex h-8 items-center justify-center gap-1.5 rounded-full bg-red-500/10 px-3 text-xs font-medium text-red-600 transition hover:bg-red-500/20 dark:text-red-400'
                >
                  <Trash2 className='h-3.5 w-3.5' /> Delete
                </button>
              </div>
            </div>
            <p className='text-foreground mt-4 text-xl font-semibold tracking-tight break-words dark:text-white'>
              {selectedAsset.name}
            </p>

            <div className='mt-6 space-y-3 rounded-xl bg-black/[0.02] p-4 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground dark:text-white/60'>
                  Size
                </span>
                <span className='text-foreground font-medium dark:text-white/90'>
                  {formatFileSize(selectedAsset.size)}
                </span>
              </div>
              {(selectedAsset.mimeType.startsWith("image") ||
                selectedAsset.mimeType.startsWith("video")) && (
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-muted-foreground dark:text-white/60'>
                    Dimensions
                  </span>
                  <span className='text-foreground font-medium dark:text-white/90'>
                    {dimensions
                      ? `${dimensions.width} × ${dimensions.height}px`
                      : "Loading…"}
                  </span>
                </div>
              )}
              {selectedAsset.mimeType.startsWith("video") && (
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-muted-foreground dark:text-white/60'>
                    Duration
                  </span>
                  <span className='text-foreground font-medium dark:text-white/90'>
                    {dimensions?.duration &&
                    Number.isFinite(dimensions.duration)
                      ? `${Math.floor(dimensions.duration / 60)}:${Math.floor(
                          dimensions.duration % 60
                        )
                          .toString()
                          .padStart(2, "0")}`
                      : "Loading…"}
                  </span>
                </div>
              )}
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground dark:text-white/60'>
                  Date added
                </span>
                <span className='text-foreground font-medium dark:text-white/90'>
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                  }).format(new Date(selectedAsset.createdAt))}
                </span>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground dark:text-white/60'>
                  Library
                </span>
                <span className='text-foreground font-medium capitalize dark:text-white/90'>
                  {scope}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className='mx-auto max-w-6xl space-y-6'>
      <div className='flex flex-wrap items-end justify-between gap-4 pb-2'>
        <div>
          <h1 className='text-foreground text-xl font-bold'>Media Library</h1>
          <p className='mt-1 text-xs text-zinc-400'>
            {scope === "organization"
              ? "Shared uploads and generated media for the active organization"
              : "Your personal uploads and generated media"}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex rounded-md bg-zinc-100 p-1 dark:bg-zinc-900'>
            <button
              type='button'
              onClick={() => setView("grid")}
              aria-label='Grid view'
              aria-pressed={view === "grid"}
              className={`rounded p-1.5 ${view === "grid" ? "bg-white shadow-sm dark:bg-zinc-800" : "text-zinc-500"}`}
            >
              <Grid2X2 className='h-4 w-4' />
            </button>
            <button
              type='button'
              onClick={() => setView("list")}
              aria-label='List view'
              aria-pressed={view === "list"}
              className={`rounded p-1.5 ${view === "list" ? "bg-white shadow-sm dark:bg-zinc-800" : "text-zinc-500"}`}
            >
              <List className='h-4 w-4' />
            </button>
          </div>
          <input
            ref={inputRef}
            type='file'
            accept='image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip'
            multiple
            className='hidden'
            onChange={(event) => upload(event.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className='flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50'
          >
            {uploading ? (
              <LoadingFileLoader size={16} />
            ) : (
              <UploadIcon className='h-4 w-4 font-bold' />
            )}{" "}
            <span className='hidden lg:flex'>Upload</span>
          </button>
        </div>
      </div>
      {storage && (
        <div className='rounded-xl border border-black/5 bg-zinc-50 p-3 dark:border-white/10 dark:bg-zinc-900/60'>
          <div className='mb-2 flex items-center justify-between gap-3 text-xs'>
            <span className='font-medium'>
              {storage.plan} {storage.shared ? "organization" : "personal"}{" "}
              storage
            </span>
            <span className='text-muted-foreground'>
              {formatFileSize(storage.usedBytes)} of{" "}
              {formatFileSize(storage.limitBytes)}
            </span>
          </div>
          <div className='h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800'>
            <div
              className='h-full rounded-full bg-indigo-500 transition-[width]'
              style={{ width: `${storage.usagePercent}%` }}
            />
          </div>
          {storage.shared && (
            <p className='text-muted-foreground mt-2 text-xs'>
              Shared by all organization members and billed to the organization
              owner.
            </p>
          )}
        </div>
      )}
      {loading ? (
        <div className='flex h-64 items-center justify-center'>
          <LoadingFileLoader />
        </div>
      ) : assets.length === 0 ? (
        <div className='flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-zinc-500'>
          <Library className='mb-3 h-9 w-9' />
          <p className='text-sm'>No media yet</p>
        </div>
      ) : (
        <section
          aria-labelledby='media-gallery-heading'
          className='mt-6 px-1 md:px-2'
        >
          <h2 id='media-gallery-heading' className='sr-only'>
            Media Gallery
          </h2>
          <div className='mx-auto max-w-7xl'>
            {view === "grid" ? (
              <div className='columns-2 space-y-4 md:columns-3 lg:columns-4'>
                {assets.map((asset) => (
                  <div
                    key={asset._id}
                    className='group relative block w-full break-inside-avoid overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900'
                  >
                    {asset.mimeType.startsWith("image") ? (
                      <img
                        src={asset.url}
                        alt={asset.name}
                        loading='lazy'
                        className='h-auto max-w-full object-cover object-top transition-transform duration-300 group-hover:scale-105'
                      />
                    ) : asset.mimeType.startsWith("video") ? (
                      <div className='relative aspect-video overflow-hidden'>
                        <video
                          src={asset.url}
                          muted
                          playsInline
                          preload='metadata'
                          className='h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105'
                        />
                        <span className='absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm'>
                          Video
                        </span>
                      </div>
                    ) : (
                      <div className='flex aspect-square flex-col items-center justify-center gap-2 p-4 text-center'>
                        <File className='h-9 w-9 text-zinc-400' />
                        <span className='line-clamp-2 text-xs font-medium text-zinc-600 dark:text-zinc-300'>
                          {asset.name}
                        </span>
                      </div>
                    )}
                    <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition duration-200 group-focus-within:bg-black/45 group-focus-within:opacity-100 group-hover:bg-black/45 group-hover:opacity-100'>
                      <button
                        type='button'
                        aria-label={`Preview ${asset.name}`}
                        onClick={() => {
                          setDimensions(null);
                          setSelectedAsset(asset);
                        }}
                        className='rounded-full bg-white/95 p-2.5 text-zinc-900 shadow-lg transition hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:outline-none'
                      >
                        <Eye className='h-4 w-4' />
                      </button>
                      <button
                        type='button'
                        aria-label={`Delete ${asset.name}`}
                        onClick={() => setDeleteAsset(asset)}
                        className='rounded-full bg-white/95 p-2.5 text-red-600 shadow-lg transition hover:scale-105 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='overflow-hidden rounded-xl border border-black/5 dark:border-white/10'>
                {assets.map((asset) => (
                  <div
                    key={asset._id}
                    className='flex items-center gap-3 border-b border-black/5 p-3 last:border-b-0 dark:border-white/10'
                  >
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900'>
                      {asset.mimeType.startsWith("image") ? (
                        <img
                          src={asset.url}
                          alt=''
                          loading='lazy'
                          className='h-full w-full object-cover'
                        />
                      ) : asset.mimeType.startsWith("video") ? (
                        <video
                          src={asset.url}
                          muted
                          playsInline
                          preload='metadata'
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <File className='h-5 w-5 text-zinc-400' />
                      )}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>
                        {asset.name}
                      </p>
                      <p className='text-muted-foreground mt-0.5 text-xs'>
                        {asset.mimeType} · {formatFileSize(asset.size)} ·{" "}
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                        }).format(new Date(asset.createdAt))}
                      </p>
                    </div>
                    <button
                      type='button'
                      aria-label={`Preview ${asset.name}`}
                      onClick={() => {
                        setDimensions(null);
                        setSelectedAsset(asset);
                      }}
                      className='rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    >
                      <Eye className='h-4 w-4' />
                    </button>
                    <button
                      type='button'
                      aria-label={`Download ${asset.name}`}
                      onClick={() => download(asset)}
                      className='rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    >
                      <Download className='h-4 w-4' />
                    </button>
                    <button
                      type='button'
                      aria-label={`Delete ${asset.name}`}
                      onClick={() => setDeleteAsset(asset)}
                      className='rounded-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {isDesktop ? (
        <Dialog
          open={Boolean(selectedAsset)}
          onOpenChange={(open) => !open && closePreview()}
        >
          <DialogContent className='max-h-[94vh] max-w-3xl overflow-y-auto border-0 bg-transparent p-0 shadow-none'>
            <DialogTitle className='sr-only'>
              {selectedAsset?.name || "Media"}
            </DialogTitle>
            {previewContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={Boolean(selectedAsset)}
          onOpenChange={(open) => !open && closePreview()}
        >
          <DrawerContent className='max-h-[96vh] overflow-y-auto border-0 bg-transparent px-3 pb-3 shadow-none'>
            <DrawerTitle className='sr-only'>
              {selectedAsset?.name || "Media"}
            </DrawerTitle>
            {previewContent}
          </DrawerContent>
        </Drawer>
      )}

      <Dialog
        open={Boolean(deleteAsset)}
        onOpenChange={(open) => !open && setDeleteAsset(null)}
      >
        <DialogContent className='max-w-md overflow-hidden rounded-3xl border-0 bg-black/[0.02] p-5 shadow-none ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10'>
          <GradientFrame />
          <div className='relative z-10 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10'>
            <div className='flex items-start gap-4'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-neutral-100 dark:bg-neutral-800'>
                <Trash2 className='h-5 w-5' />
              </div>
              <div>
                <DialogTitle className='text-foreground text-lg font-semibold tracking-tight dark:text-white'>
                  Delete Media
                </DialogTitle>
                <p className='text-muted-foreground mt-2 text-sm dark:text-white/70'>
                  Are you sure you want to delete{" "}
                  <span className='text-foreground font-medium dark:text-white'>
                    {deleteAsset?.name}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className='mt-2 flex justify-end gap-3 border-t border-black/5 pt-4 dark:border-white/10'>
              <button
                type='button'
                disabled={isDeleting}
                onClick={() => setDeleteAsset(null)}
                className='text-foreground px-4 py-2 text-sm font-medium ring-1 ring-black/10 transition'
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={isDeleting}
                onClick={async () => {
                  if (deleteAsset) {
                    setIsDeleting(true);
                    await remove(deleteAsset);
                    setIsDeleting(false);
                    setDeleteAsset(null);
                    closePreview();
                  }
                }}
                className='flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50'
              >
                {isDeleting ? <LoadingFileLoader size={16} /> : "Delete"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
