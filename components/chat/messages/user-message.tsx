"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { HoverActions } from "@/components/ui/hover-actions";
import { AvatarDisplay } from "@/components/ui/avatar-display";
import { MessageEditor, ImagePreviewDialog } from "@/components/chat/messages";
import { ImageIcon, FileText, File } from "lucide-react";

import { MessageContainer, MessageContent } from "@/components/chat/messages";
interface UserMessageProps {
  content: string;
  userAvatar?: string;
  userName?: string;
  imageAttachment?: string;
  fileAttachment?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: "image" | "document" | "pdf" | "text" | "other";
  onEdit?: (newContent: string, files?: File[]) => Promise<void>;
  onDelete?: () => void;
  onCopy?: () => void;
  className?: string;
}

export function UserMessage({
  content,
  userAvatar,
  userName = "User",
  imageAttachment,
  fileAttachment,
  fileName = "file.jpg",
  fileSize = "2.4 MB",
  fileType = "image",
  onEdit,
  onDelete,
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

      console.log("Saving message:", { newContent, files });

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
    navigator.clipboard.writeText(content);
    onCopy?.();

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      onDelete?.();
    }
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
            variant="user"
            className="rounded-lg"
            src={userAvatar}
            alt={userName}
            fallback={userName.charAt(0).toUpperCase()}
          />
        }
        className={className}
      >
        <MessageEditor
          initialContent={content}
          onSave={handleSave}
          onCancel={handleCancel}
          placeholder="Edit your message..."
        />
      </MessageContainer>
    );
  }

  return (
    <>
      <MessageContainer
        avatar={
          <AvatarDisplay
            variant="user"
            className="rounded-lg"
            src={userAvatar}
            alt={userName}
            fallback={userName.charAt(0).toUpperCase()}
          />
        }
        className={className}
      >
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <MessageContent variant="user">
            <ReactMarkdown>{content}</ReactMarkdown>
          </MessageContent>

          {/* Compact File/Image Attachment Preview */}
          {(imageAttachment || fileAttachment) && (
            <div className="mt-3">
              <div
                className="flex items-center gap-3 p-2 bg-background border border-border rounded-lg hover:bg-muted-foreground/5 transition-colors cursor-pointer group max-w-sm"
                onClick={() => setIsDialogOpen(true)}
              >
                {/* Small thumbnail or file icon */}
                <div className="flex-shrink-0">
                  {imageAttachment ? (
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted-foreground/5 border">
                      <img
                        src={imageAttachment || "/placeholder.svg"}
                        alt="Attachment thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-muted-foreground/5 border flex items-center justify-center">
                      {(() => {
                        const { icon: Icon } = getFileIcon(fileType);
                        return (
                          <Icon className="w-6 h-6 text-muted-foreground" />
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground truncate">
                      {truncateFileName(fileName)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {fileSize} • Click to view
                  </p>
                </div>

                {/* View indicator */}
                <div className="flex-shrink-0">
                  {(() => {
                    const {
                      icon: Icon,
                      bgColor,
                      hoverColor,
                      iconColor,
                    } = getFileIcon(fileType);
                    return (
                      <div
                        className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center ${hoverColor} transition-colors`}
                      >
                        <Icon className={`w-3 h-3 ${iconColor}`} />
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
            onDelete={handleDelete}
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
