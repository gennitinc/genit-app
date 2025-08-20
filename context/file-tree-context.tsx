"use client";

import { createContext, useContext, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFileTree, type FileNode } from "@/hooks/filetree/use-file-tree";

interface FileTreeContextType {
  // Data
  fileTree: FileNode[];
  selectedFile: string | null;
  expandedFolders: string[];
  allFiles: FileNode[];
  lockedFiles: FileNode[];
  totalFiles: number;
  totalFolders: number;
  totalSize: number;

  // States
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isMoving: boolean;
  isDuplicating: boolean;
  isTogglingLock: boolean;
  isBulkLocking: boolean;
  isSavingContent: boolean;
  error: Error | null;

  // Actions
  selectFile: (filePath: string) => void;
  toggleFolder: (folderPath: string) => void;
  createFile: (data: {
    name: string;
    type: "file" | "folder";
    parentPath: string;
    content?: string;
    template?: string;
  }) => Promise<FileNode>;
  updateFile: (id: string, updates: Partial<FileNode>) => Promise<FileNode>;
  deleteFile: (id: string) => Promise<void>;
  moveFile: (id: string, newPath: string) => Promise<FileNode>;
  duplicateFile: (id: string, newName: string) => Promise<FileNode>;
  toggleLock: (id: string, isLocked: boolean) => Promise<FileNode>;
  bulkToggleLock: (ids: string[], isLocked: boolean) => Promise<FileNode[]>;
  getFileContent: (fileId: string) => Promise<string>;
  saveFileContent: (id: string, content: string) => Promise<void>;
  refetchTree: () => void;
}

const FileTreeContext = createContext<FileTreeContextType | undefined>(
  undefined
);

// Create a query client instance for file tree
const fileTreeQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface FileTreeProviderProps {
  children: ReactNode;
  projectId?: string;
  onFileSelect?: (filePath: string) => void;
  onError?: (error: Error) => void;
}

function FileTreeProviderInner({
  children,
  projectId,
  onFileSelect,
  onError,
}: Omit<FileTreeProviderProps, "children"> & { children: ReactNode }) {
  const fileTreeData = useFileTree({ projectId, onFileSelect, onError });

  return (
    <FileTreeContext.Provider value={fileTreeData}>
      {children}
    </FileTreeContext.Provider>
  );
}

export function FileTreeProvider({
  children,
  projectId = "default",
  onFileSelect,
  onError,
}: FileTreeProviderProps) {
  return (
    <QueryClientProvider client={fileTreeQueryClient}>
      <FileTreeProviderInner
        projectId={projectId}
        onFileSelect={onFileSelect}
        onError={onError}
      >
        {children}
      </FileTreeProviderInner>
    </QueryClientProvider>
  );
}

export function useFileTreeContext() {
  const context = useContext(FileTreeContext);
  if (context === undefined) {
    throw new Error(
      "useFileTreeContext must be used within a FileTreeProvider"
    );
  }
  return context;
}
