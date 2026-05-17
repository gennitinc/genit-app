"use client";

import { ImagePreviewDialog, MessageEditor } from "@/components/chat/messages";
import { MessageContainer, MessageContent } from "@/components/chat/messages";
import { AvatarDisplay } from "@/components/ui/avatar-display";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HoverActions } from "@/components/ui/hover-actions";
import { Download, Eye, File, FileText, ImageIcon } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

interface UserMessageProps {
  message: any;
  userAvatar?: string;
  userName?: string;
  imageAttachment?: string;
  fileAttachment?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: "image" | "document" | "pdf" | "text" | "other";
  onEdit?: (newContent: string, files?: File[]) => Promise<void>;
  onCopy?: () => void;
  className?: string;
}

export function UserMessage({
  message,
  userAvatar,
  userName = "User",
  imageAttachment,
  fileAttachment,
  fileName = "file.jpg",
  fileSize = "2.4 MB",
  fileType = "image",
  onEdit,
  onCopy,
  className,
}: UserMessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setIsHovered(false);
  };

  const handleSave = async (newContent: string, files?: File[]) => {
    try {
      // Mock API call - simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate random failure for demo (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Network error: Failed to save message");
      }


      if (onEdit) {
        await onEdit(newContent, files);
      }

      setIsEditing(false);
    } catch (error) {
      // Re-throw to let MessageEditor handle the error display
      throw error;
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleCopy = () => {
    const textContent =
      message.parts?.find((part: any) => part.type === "text")?.text || "";
    navigator.clipboard.writeText(textContent);
    onCopy?.();

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateFileName = (name: string, maxLength = 25) => {
    if (name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf("."));
    const truncatedName =
      nameWithoutExt.substring(0, maxLength - extension!.length - 4) + "...";
    return `${truncatedName}.${extension}`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return {
          icon: ImageIcon,
          bgColor: "bg-muted-foreground/30",
          hoverColor: "group-hover:bg-muted-foreground/10",
          iconColor: "text-muted-foreground",
        };
      case "document":
      case "text":
        return {
          icon: FileText,
          bgColor: "bg-muted-foreground/30",
          hoverColor: "group-hover:bg-muted-foreground/10",
          iconColor: "text-muted-foreground",
        };
      case "pdf":
        return {
          icon: FileText,
          bgColor: "bg-muted-foreground/30",
          hoverColor: "group-hover:bg-muted-foreground/10",
          iconColor: "text-muted-foreground",
        };
      default:
        return {
          icon: File,
          bgColor: "bg-muted-foreground/30",
          hoverColor: "group-hover:bg-muted-foreground/10",
          iconColor: "text-muted-foreground",
        };
    }
  };

  if (isEditing) {
    return (
      <MessageContainer
        avatar={
          <AvatarDisplay
            variant='user'
            className='rounded-lg'
            src={userAvatar}
            alt={userName}
            fallback={userName.charAt(0).toUpperCase()}
          />
        }
        className={className}
      >
        <MessageEditor
          initialContent={
            message.parts?.find((part: any) => part.type === "text")?.text || ""
          }
          onSave={handleSave}
          onCancel={handleCancel}
          placeholder='Edit your message...'
        />
      </MessageContainer>
    );
  }

  return (
    <>
      <MessageContainer
        avatar={
          <AvatarDisplay
            variant='user'
            className='rounded-lg'
            src={userAvatar}
            alt={userName}
            fallback={userName.charAt(0).toUpperCase()}
          />
        }
        className={className}
      >
        <div
          className='relative'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <MessageContent variant='user'>
            <ReactMarkdown>
              {message.parts?.find((part: any) => part.type === "text")?.text ||
                ""}
            </ReactMarkdown>
          </MessageContent>

          {/* Attached Files from message level */}
          {message.attachedFiles?.length > 0 && (
            <div className='mt-3 space-y-2'>
              {message.attachedFiles.map((file: any, index: number) => (
                <AttachedFilePreview key={file.id || index} file={file} />
              ))}
            </div>
          )}

          {/* Legacy File/Image Attachment Preview (for backward compatibility) */}
          {(imageAttachment || fileAttachment) && (
            <div className='mt-3'>
              <div
                className='bg-background border-border hover:bg-muted-foreground/5 group flex max-w-sm cursor-pointer items-center gap-3 rounded-lg border p-2 transition-colors'
                onClick={() => setIsDialogOpen(true)}
              >
                {/* Small thumbnail or file icon */}
                <div className='flex-shrink-0'>
                  {imageAttachment ? (
                    <div className='bg-muted-foreground/5 h-12 w-12 overflow-hidden rounded-md border'>
                      <img
                        src={imageAttachment || "/placeholder.svg"}
                        alt='Attachment thumbnail'
                        className='h-full w-full object-cover transition-transform duration-200 group-hover:scale-105'
                      />
                    </div>
                  ) : (
                    <div className='bg-muted-foreground/5 flex h-12 w-12 items-center justify-center rounded-md border'>
                      {(() => {
                        const { icon: Icon } = getFileIcon(fileType);
                        return (
                          <Icon className='text-muted-foreground h-6 w-6' />
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <p className='text-muted-foreground w-30 truncate text-sm font-medium text-ellipsis lg:w-full'>
                      {truncateFileName(fileName)}
                    </p>
                  </div>
                  <p className='text-muted-foreground mt-0.5 text-xs'>
                    {fileSize} • Click to view
                  </p>
                </div>

                {/* View indicator */}
                <div className='flex-shrink-0'>
                  {(() => {
                    const {
                      icon: Icon,
                      bgColor,
                      hoverColor,
                      iconColor,
                    } = getFileIcon(fileType);
                    return (
                      <div
                        className={`h-6 w-6 rounded-full ${bgColor} flex items-center justify-center ${hoverColor} transition-colors`}
                      >
                        <Icon className={`h-3 w-3 ${iconColor}`} />
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          <HoverActions
            visible={isHovered}
            onEdit={handleEdit}
            onCopy={handleCopy}
            copied={copied}
          />
        </div>
      </MessageContainer>

      {/* Image Preview Dialog */}
      {imageAttachment && (
        <ImagePreviewDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          imageSrc={imageAttachment}
          fileName={fileName}
          fileSize={fileSize}
        />
      )}
    </>
  );
}

// AttachedFilePreview Component
function AttachedFilePreview({ file }: { file: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isImage = file.type?.startsWith("image/");
  const isVideo = file.type?.startsWith("video/");
  const fileSize = file.fileSize
    ? `${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`
    : "Unknown size";

  const handleDownload = async () => {
    try {
      if (!file.filePath) return;

      const response = await fetch(file.filePath, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = file.name || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("DOWNLOAD ERROR:", err);
    }
  };

  return (
    <>
      <div className='bg-background border-border hover:bg-muted-foreground/5 group flex max-w-md items-center gap-3 rounded-lg border p-3 transition-colors'>
        {/* File thumbnail or icon */}
        <div className='flex-shrink-0'>
          {isImage ? (
            <div className='bg-muted-foreground/5 h-12 w-12 overflow-hidden rounded-md border'>
              <Image
                src={file.filePath || "/placeholder.svg"}
                alt={file.name}
                width={48}
                height={48}
                className='h-full w-full object-cover transition-transform duration-200 group-hover:scale-105'
              />
            </div>
          ) : (
            <div className='bg-muted-foreground/5 flex h-12 w-12 items-center justify-center rounded-md border'>
              {isVideo ? (
                <FileText className='text-muted-foreground h-6 w-6' />
              ) : (
                <File className='text-muted-foreground h-6 w-6' />
              )}
            </div>
          )}
        </div>

        {/* File info */}
        <div className='min-w-0 flex-1'>
          <p className='text-foreground w-30 truncate text-sm font-medium text-ellipsis lg:w-full'>
            {file.name}
          </p>
          <p className='text-muted-foreground text-xs'>
            {fileSize} • {file.type}
          </p>
        </div>

        {/* Action buttons */}
        <div className='flex items-center gap-1'>
          {(isImage || isVideo) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 p-0'
                  title='View file'
                >
                  <Eye className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent className='h-auto w-fit max-w-[50vw] p-0'>
                <div className=''>
                  <div className='relative h-auto w-auto'>
                    {isImage ? (
                      <Image
                        src={file.filePath}
                        alt={file.name}
                        width={0}
                        height={0}
                        className='h-auto w-auto rounded-md object-contain'
                        unoptimized
                      />
                    ) : (
                      <video
                        src={file.filePath}
                        controls
                        className='max-h-[90vh] max-w-[90vw] rounded-md object-contain'
                      />
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {/* <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleDownload}
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </Button> */}
        </div>
      </div>
    </>
  );
}
