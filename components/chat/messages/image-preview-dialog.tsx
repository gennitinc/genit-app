"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  fileName: string;
  fileSize?: string;
}

export function ImagePreviewDialog({
  isOpen,
  onClose,
  imageSrc,
  fileName,
  fileSize,
}: ImagePreviewDialogProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-hidden p-0'>
        <DialogHeader className='border-b border-gray-200 p-4 pb-2'>
          <div className='flex items-center justify-between'>
            <div>
              <DialogTitle className='max-w-md truncate text-lg font-semibold text-gray-900'>
                {fileName}
              </DialogTitle>
              {fileSize && (
                <p className='mt-1 text-sm text-gray-500'>{fileSize}</p>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className='p-2'
              >
                <ZoomOut className='h-4 w-4' />
              </Button>
              <span className='min-w-[3rem] text-center text-sm text-gray-600'>
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className='p-2'
              >
                <ZoomIn className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleDownload}
                className='p-2'
              >
                <Download className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className='flex-1 overflow-auto bg-gray-50 p-4'>
          <div className='flex min-h-[400px] items-center justify-center'>
            <img
              src={imageSrc || "/placeholder.svg"}
              alt={fileName}
              className='max-h-full max-w-full rounded-lg object-contain shadow-lg transition-transform duration-200'
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center",
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
