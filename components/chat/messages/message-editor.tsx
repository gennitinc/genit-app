"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/chat/messages";
import { AlertCircle, Loader } from "lucide-react";
import { useMessageEditor } from "@/hooks/message/use-message-editor";

interface MessageEditorProps {
  initialContent: string;
  onSave: (text: string, files?: File[]) => Promise<void>;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
}

export function MessageEditor({
  initialContent,
  onSave,
  onCancel,
  placeholder = "Edit your message...",
  className = "",
}: MessageEditorProps) {
  const {
    text,
    files,
    isLoading,
    error,
    updateContent,
    addFiles,
    removeFile,
    saveChanges,
    cancelEditing,
    textareaRef,
    autoResize,
  } = useMessageEditor({
    initialContent,
    onSave,
    onCancel,
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      cancelEditing();
    } else if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      saveChanges();
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateContent(event.target.value);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    // Allow normal paste behavior, auto-resize will handle the text change
    setTimeout(autoResize, 0);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="w-full min-h-[100px] max-h-[400px] p-3 border border-border rounded-lg resize-none focus:outline-none transition-all duration-200 overflow-y-auto scrollbar-hover"
          disabled={isLoading}
          style={{
            lineHeight: "1.5",
            fontFamily: "inherit",
          }}
        />

        {/* Character count */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1 rounded">
          {text.length} characters
        </div>

        {/* Resize indicator */}
        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background px-1 rounded">
          {text.split("\n").length} lines
        </div>
      </div>

      {/* File Upload */}
      <FileUpload
        files={files}
        onFilesAdd={addFiles}
        onFileRemove={removeFile}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 border border-red-200 rounded-lg text-red-700 bg-background">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Press{" "}
          <kbd className="px-1 py-0.5 bg-muted-foreground/10 rounded text-xs">
            Esc
          </kbd>{" "}
          to cancel, or{" "}
          <kbd className="px-1 py-0.5 bg-muted-foreground/10 rounded text-xs">
            Cmd+Enter
          </kbd>{" "}
          to save
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={cancelEditing}
            disabled={isLoading}
            className="relative bg-gradient-to-b from-muted-foreground/10 to-muted-foreground/20 hover:from-muted-foreground/20 hover:to-muted-foreground/30 text-muted-foreground px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 border border-border hover:border-border"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-muted-foreground/30 to-transparent rounded-lg pointer-events-none"></div>
            <div className="relative flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Cancel</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-muted-foreground/40 to-transparent"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-muted-foreground/60 to-transparent"></div>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={saveChanges}
            disabled={isLoading || !text.trim()}
            className="relative bg-gradient-to-b from-muted-foreground/10 to-muted-foreground/20 hover:from-muted-foreground/20 hover:to-muted-foreground/30 text-muted-foreground px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-border hover:border-border"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-muted-foreground/10 to-transparent rounded-lg pointer-events-none"></div>
            <div className="relative flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="font-medium">Saving...</span>
                </>
              ) : (
                <span className="font-medium">Save</span>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent"></div>
          </Button>
        </div>
      </div>

      {/* Helper text for expandable textarea */}
      <div className="text-xs text-muted-foreground bg-background rounded p-2">
        💡 <strong>Smart Editor:</strong> Textarea auto-expands as you type •
        Markdown formatting is converted to plain text for editing
      </div>
    </div>
  );
}
