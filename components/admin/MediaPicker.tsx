"use client";

import { apiResponse } from "@/utils/apiResponse";
import {
  Check,
  Image as ImageIcon,
  Library,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

export type MediaAsset = {
  _id: string;
  name: string;
  url: string;
  mimeType: string;
  source: "upload" | "generated";
  createdAt: string;
  size?: number;
};

type Props = {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  accept?: "image" | "media";
};

export function MediaPicker({
  value,
  onChange,
  onUploadingChange,
  accept = "image",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedMimeType, setSelectedMimeType] = useState("");
  const acceptsVideo = accept === "media";

  const loadAssets = async () => {
    setLoading(true);
    try {
      const response = await apiResponse.get(
        acceptsVideo ? "/blog/library?type=visual" : "/blog/library?type=image"
      );
      setAssets(response.data.assets || []);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Could not load your library"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadAssets();
  }, [open]);

  const uploadFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    onUploadingChange?.(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await apiResponse.post("/blog/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSelectedMimeType(response.data.asset?.mimeType || file.type);
      onChange(response.data.url);
      setOpen(false);
      toast.success("Media uploaded to your library");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload media");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type='file'
        accept={
          acceptsVideo
            ? "image/*,video/*"
            : "image/png,image/jpeg,image/webp,image/gif"
        }
        className='hidden'
        onChange={(event) => uploadFile(event.target.files?.[0])}
      />
      <div className='space-y-3'>
        <div className='relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40'>
          {value && selectedMimeType.startsWith("video/") ? (
            <video
              src={value}
              controls
              className='h-full w-full object-contain'
            />
          ) : value ? (
            <img
              src={value}
              alt='Selected cover'
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex flex-col items-center gap-2 text-zinc-500'>
              <ImageIcon className='h-7 w-7' />
              <span className='text-xs'>
                {acceptsVideo
                  ? "Choose an image or video"
                  : "Choose a cover image"}
              </span>
            </div>
          )}
          {uploading && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/70'>
              <Loader2 className='h-6 w-6 animate-spin text-cyan-400' />
            </div>
          )}
          {value && !uploading && (
            <button
              type='button'
              aria-label='Remove selected media'
              onClick={() => {
                setSelectedMimeType("");
                onChange("");
              }}
              className='absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white shadow-lg transition hover:bg-black'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className='flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50'
          >
            <Upload className='h-4 w-4' /> Upload
          </button>
          <button
            type='button'
            onClick={() => setOpen(true)}
            className='flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:border-zinc-600'
          >
            <Library className='h-4 w-4' /> Choose from library
          </button>
        </div>
      </div>

      {open && (
        <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm'>
          <div className='max-h-[82vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl'>
            <div className='flex items-center justify-between p-5'>
              <div>
                <h3 className='font-bold text-white'>Media library</h3>
                <p className='text-xs text-zinc-500'>
                  {acceptsVideo
                    ? "Your organization’s images and videos"
                    : "Your uploads and generated images"}
                </p>
              </div>
              <button
                type='button'
                onClick={() => setOpen(false)}
                className='rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
            <div className='max-h-[65vh] overflow-y-auto p-5'>
              {loading ? (
                <div className='flex h-48 items-center justify-center'>
                  <Loader2 className='h-7 w-7 animate-spin text-cyan-400' />
                </div>
              ) : assets.length === 0 ? (
                <div className='flex h-48 flex-col items-center justify-center gap-2 text-zinc-500'>
                  <Library className='h-8 w-8' />
                  <p className='text-sm'>Your library is empty</p>
                </div>
              ) : (
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
                  {assets.map((asset) => (
                    <button
                      key={asset._id}
                      type='button'
                      onClick={() => {
                        setSelectedMimeType(asset.mimeType);
                        onChange(asset.url);
                        setOpen(false);
                      }}
                      className='group relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-left hover:border-cyan-500'
                    >
                      {asset.mimeType.startsWith("video/") ? (
                        <video
                          src={asset.url}
                          muted
                          playsInline
                          preload='metadata'
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className='h-full w-full object-cover'
                        />
                      )}
                      <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 p-2 pt-8'>
                        <p className='truncate text-[11px] text-white'>
                          {asset.name}
                        </p>
                      </div>
                      {value === asset.url && (
                        <span className='absolute top-2 right-2 rounded-full bg-cyan-500 p-1 text-black'>
                          <Check className='h-3 w-3' />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
