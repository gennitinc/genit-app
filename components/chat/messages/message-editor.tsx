"use client";

import { FileUpload } from "@/components/chat/messages";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { useMessageEditor } from "@/hooks/message/use-message-editor";
import Loading from "@/utils/Loading";
import { AlertCircle } from "lucide-react";
import type React from "react";

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
      <div className='relative'>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          className='border-border scrollbar-hover max-h-[400px] min-h-[100px] w-full resize-none overflow-y-auto rounded-lg border p-3 transition-all duration-200 focus:outline-none'
          disabled={isLoading}
          style={{
            lineHeight: "1.5",
            fontFamily: "inherit",
          }}
        />

        {/* Character count */}
        <div className='text-muted-foreground bg-background absolute right-2 bottom-2 rounded px-1 text-xs'>
          {text.length} <LocalizedText text={"characters"} />
        </div>

        {/* Resize indicator */}
        <div className='text-muted-foreground bg-background absolute bottom-2 left-2 rounded px-1 text-xs'>
          {text.split("\n").length} <LocalizedText text={"lines"} />
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
        <div className='bg-background flex items-center gap-2 rounded-lg border border-red-200 p-3 text-red-700'>
          <AlertCircle className='h-4 w-4 flex-shrink-0' />
          <span className='text-sm'>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex items-center justify-between'>
        <div className='text-muted-foreground text-xs'>
          <LocalizedText text={"Press"} />{" "}
          <kbd className='bg-muted-foreground/10 rounded px-1 py-0.5 text-xs'>
            <LocalizedText text={"Esc"} />
          </kbd>{" "}
          <LocalizedText text={"to cancel, or"} />{" "}
          <kbd className='bg-muted-foreground/10 rounded px-1 py-0.5 text-xs'>
            <LocalizedText text={"Cmd+Enter"} />
          </kbd>{" "}
          <LocalizedText text={"to save"} />
        </div>

        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={cancelEditing}
            disabled={isLoading}
            className='from-muted-foreground/10 to-muted-foreground/20 hover:from-muted-foreground/20 hover:to-muted-foreground/30 text-muted-foreground border-border hover:border-border relative rounded-lg border bg-gradient-to-b px-4 py-2.5 text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg'
          >
            <div className='from-muted-foreground/30 pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-b to-transparent'></div>
            <div className='relative flex items-center gap-2'>
              <span className='text-muted-foreground font-medium'>
                <LocalizedText text={"Cancel"} />
              </span>
            </div>
            <div className='via-muted-foreground/40 absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent'></div>
            <div className='via-muted-foreground/60 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent'></div>
          </Button>

          <Button
            type='button'
            size='sm'
            onClick={saveChanges}
            disabled={isLoading || !text.trim()}
            className='from-muted-foreground/10 to-muted-foreground/20 hover:from-muted-foreground/20 hover:to-muted-foreground/30 text-muted-foreground border-border hover:border-border relative rounded-lg border bg-gradient-to-b px-5 py-2.5 text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-xl'
          >
            <div className='from-muted-foreground/10 pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-b to-transparent'></div>
            <div className='relative flex items-center gap-2'>
              {isLoading ? (
                <>
                  <Loading size={12} />
                  <span className='font-medium'>
                    <LocalizedText text={"Saving..."} />
                  </span>
                </>
              ) : (
                <span className='font-medium'>
                  <LocalizedText text={"Save"} />
                </span>
              )}
            </div>
            <div className='via-muted-foreground/20 absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent'></div>
          </Button>
        </div>
      </div>

      {/* Helper text for expandable textarea */}
      <div className='text-muted-foreground bg-background rounded p-2 text-xs'>
        💡{" "}
        <strong>
          <LocalizedText text={"Smart Editor:"} />
        </strong>{" "}
        <LocalizedText
          text={
            "Textarea auto-expands as you type • Markdown formatting is converted to plain text for editing"
          }
        />
      </div>
    </div>
  );
}
