"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseMessageEditorProps {
  initialContent: string;
  onSave: (text: string, files?: File[]) => Promise<void>;
  onCancel: () => void;
}

interface UseMessageEditorReturn {
  isEditing: boolean;
  text: string;
  files: File[];
  isLoading: boolean;
  error: string | null;
  startEditing: () => void;
  cancelEditing: () => void;
  updateContent: (text: string) => void;
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  saveChanges: () => Promise<void>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  autoResize: () => void;
}

// Utility function to convert markdown to plain text
function markdownToPlainText(markdown: string): string {
  return (
    markdown
      // Remove headers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic new
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      // Remove links but keep text
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove blockquotes
      .replace(/^>\s+/gm, "")
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, "")
      .replace(/^[\s]*\d+\.\s+/gm, "")
      // Remove horizontal rules
      .replace(/^---+$/gm, "")
      // Clean up extra whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

export function useMessageEditor({
  initialContent,
  onSave,
  onCancel,
}: UseMessageEditorProps): UseMessageEditorReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialContent);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set height based on scrollHeight with min and max constraints
      const newHeight = Math.max(100, Math.min(400, textarea.scrollHeight));
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    // Convert markdown to plain text for editing
    const plainText = markdownToPlainText(initialContent);
    setText(plainText);
    setFiles([]);
    setError(null);
  }, [initialContent]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setText(initialContent);
    setFiles([]);
    setError(null);
    onCancel();
  }, [initialContent, onCancel]);

  const updateContent = useCallback(
    (newContent: string) => {
      setText(newContent);
      setError(null);
      // Auto-resize after text update
      setTimeout(autoResize, 0);
    },
    [autoResize]
  );

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const saveChanges = useCallback(async () => {
    if (!text.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(text, files);
      setIsEditing(false);
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  }, [text, files, onSave]);

  // Auto-focus and resize textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Set cursor to end of text
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
      // Initial resize
      setTimeout(autoResize, 0);
    }
  }, [isEditing, autoResize]);

  // Auto-resize on text change
  useEffect(() => {
    if (isEditing) {
      autoResize();
    }
  }, [text, isEditing, autoResize]);

  return {
    isEditing,
    text,
    files,
    isLoading,
    error,
    startEditing,
    cancelEditing,
    updateContent,
    addFiles,
    removeFile,
    saveChanges,
    textareaRef: textareaRef as React.RefObject<HTMLTextAreaElement>,
    autoResize,
  };
}
