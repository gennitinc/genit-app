"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  parentId?: string;
  children?: FileNode[];
  isExpanded?: boolean;
  isLocked?: boolean;
  isLoading?: boolean;
  content?: string;
  size?: number;
  lastModified?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: {
    language?: string;
    encoding?: string;
    permissions?: string[];
  };
}

export interface FileTreeState {
  selectedFile: string | null;
  expandedFolders: string[];
  lockedItems: string[];
}

interface UseFileTreeOptions {
  projectId?: string;
  onFileSelect?: (filePath: string) => void;
  onError?: (error: Error) => void;
}

// Mock API functions that match backend schema
const fileTreeApi = {
  getFileTree: async (projectId: string): Promise<FileNode[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: "1",
        name: "app",
        type: "folder",
        path: "app",
        isExpanded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: "2",
            name: "page.tsx",
            type: "file",
            path: "app/page.tsx",
            parentId: "1",
            size: 2048,
            lastModified: new Date().toISOString(),
            metadata: { language: "typescript", encoding: "utf-8" },
          },
          {
            id: "3",
            name: "layout.tsx",
            type: "file",
            path: "app/layout.tsx",
            parentId: "1",
            isLocked: true,
            size: 1024,
            lastModified: new Date().toISOString(),
            metadata: { language: "typescript", encoding: "utf-8" },
          },
        ],
      },
      {
        id: "4",
        name: "components",
        type: "folder",
        path: "components",
        isExpanded: true,
        isLocked: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: "5",
            name: "ui",
            type: "folder",
            path: "components/ui",
            parentId: "4",
            isExpanded: false,
            children: [],
          },
        ],
      },
    ];
  },

  createFile: async (data: {
    name: string;
    type: "file" | "folder";
    parentPath: string;
    content?: string;
    template?: string;
  }): Promise<FileNode> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (Math.random() < 0.1) {
      throw new Error("Failed to create file. Name already exists.");
    }

    return {
      id: Date.now().toString(),
      name: data.name,
      type: data.type,
      path: `${data.parentPath}/${data.name}`,
      content: data.content || data.template || "",
      size: data.content?.length || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        language: data.name.split(".").pop() || "text",
        encoding: "utf-8",
      },
    };
  },

  updateFile: async (
    id: string,
    updates: Partial<FileNode>
  ): Promise<FileNode> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.05) {
      throw new Error("Failed to update file. Please try again.");
    }

    return {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    } as FileNode;
  },

  deleteFile: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (Math.random() < 0.05) {
      throw new Error("Failed to delete file. File may be in use.");
    }
  },

  moveFile: async (id: string, newPath: string): Promise<FileNode> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      id,
      path: newPath,
      updatedAt: new Date().toISOString(),
    } as FileNode;
  },

  duplicateFile: async (id: string, newName: string): Promise<FileNode> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      id: Date.now().toString(),
      name: newName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as FileNode;
  },

  toggleLock: async (id: string, isLocked: boolean): Promise<FileNode> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id,
      isLocked,
      updatedAt: new Date().toISOString(),
    } as FileNode;
  },

  bulkLockToggle: async (
    ids: string[],
    isLocked: boolean
  ): Promise<FileNode[]> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return ids.map(
      (id) =>
        ({
          id,
          isLocked,
          updatedAt: new Date().toISOString(),
        } as FileNode)
    );
  },

  getFileContent: async (id: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock content based on file type
    return `// File content for ${id}\nexport default function Component() {\n  return <div>Hello World</div>\n}`;
  },

  saveFileContent: async (id: string, content: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.05) {
      throw new Error("Failed to save file content.");
    }
  },
};

export function useFileTree(options: UseFileTreeOptions = {}) {
  const { projectId = "default", onFileSelect, onError } = options;
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  // Query for file tree
  const {
    data: fileTree = [],
    isLoading: isLoadingTree,
    error: treeError,
    refetch: refetchTree,
  } = useQuery({
    queryKey: ["file-tree", projectId],
    queryFn: () => fileTreeApi.getFileTree(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createFileMutation = useMutation({
    mutationFn: fileTreeApi.createFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-tree", projectId] });
    },
    onError: onError,
  });

  const updateFileMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FileNode> }) =>
      fileTreeApi.updateFile(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-tree", projectId] });
    },
    onError: onError,
  });

  const deleteFileMutation = useMutation({
    mutationFn: fileTreeApi.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-tree", projectId] });
    },
    onError: onError,
  });

  const moveFileMutation = useMutation({
    mutationFn: ({ id, newPath }: { id: string; newPath: string }) =>
      fileTreeApi.moveFile(id, newPath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-tree", projectId] });
    },
    onError: onError,
  });

  const duplicateFileMutation = useMutation({
    mutationFn: ({ id, newName }: { id: string; newName: string }) =>
      fileTreeApi.duplicateFile(id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-tree", projectId] });
    },
    onError: onError,
  });

  const toggleLockMutation = useMutation({
    mutationFn: ({ id, isLocked }: { id: string; isLocked: boolean }) =>
      fileTreeApi.toggleLock(id, isLocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-tree", projectId] });
    },
    onError: onError,
  });

  const bulkLockMutation = useMutation({
    mutationFn: ({ ids, isLocked }: { ids: string[]; isLocked: boolean }) =>
      fileTreeApi.bulkLockToggle(ids, isLocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-tree", projectId] });
    },
    onError: onError,
  });

  // File content queries
  const getFileContentQuery = useCallback(
    (fileId: string) => {
      return queryClient.fetchQuery({
        queryKey: ["file-content", fileId],
        queryFn: () => fileTreeApi.getFileContent(fileId),
        staleTime: 2 * 60 * 1000, // 2 minutes
      });
    },
    [queryClient]
  );

  const saveFileContentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      fileTreeApi.saveFileContent(id, content),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["file-tree", projectId] });
    },
    onError: onError,
  });

  // Computed values
  const computedValues = useMemo(() => {
    const flattenFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.reduce((acc, node) => {
        acc.push(node);
        if (node.children) {
          acc.push(...flattenFiles(node.children));
        }
        return acc;
      }, [] as FileNode[]);
    };

    const allFiles = flattenFiles(fileTree);
    const lockedFiles = allFiles.filter((f) => f.isLocked);
    const totalSize = allFiles.reduce((sum, f) => sum + (f.size || 0), 0);

    return {
      allFiles,
      lockedFiles,
      totalFiles: allFiles.filter((f) => f.type === "file").length,
      totalFolders: allFiles.filter((f) => f.type === "folder").length,
      totalSize,
      isLoading:
        isLoadingTree ||
        createFileMutation.isPending ||
        updateFileMutation.isPending ||
        deleteFileMutation.isPending ||
        moveFileMutation.isPending ||
        duplicateFileMutation.isPending ||
        toggleLockMutation.isPending ||
        bulkLockMutation.isPending ||
        saveFileContentMutation.isPending,
      error:
        treeError ||
        createFileMutation.error ||
        updateFileMutation.error ||
        deleteFileMutation.error ||
        moveFileMutation.error ||
        duplicateFileMutation.error ||
        toggleLockMutation.error ||
        bulkLockMutation.error ||
        saveFileContentMutation.error,
    };
  }, [
    fileTree,
    isLoadingTree,
    createFileMutation.isPending,
    createFileMutation.error,
    updateFileMutation.isPending,
    updateFileMutation.error,
    deleteFileMutation.isPending,
    deleteFileMutation.error,
    moveFileMutation.isPending,
    moveFileMutation.error,
    duplicateFileMutation.isPending,
    duplicateFileMutation.error,
    toggleLockMutation.isPending,
    toggleLockMutation.error,
    bulkLockMutation.isPending,
    bulkLockMutation.error,
    saveFileContentMutation.isPending,
    saveFileContentMutation.error,
    treeError,
  ]);

  // Actions
  const selectFile = useCallback(
    (filePath: string) => {
      setSelectedFile(filePath);
      onFileSelect?.(filePath);
    },
    [onFileSelect]
  );

  const toggleFolder = useCallback((folderPath: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderPath)
        ? prev.filter((p) => p !== folderPath)
        : [...prev, folderPath]
    );
  }, []);

  const createFile = useCallback(
    (data: Parameters<typeof fileTreeApi.createFile>[0]) => {
      return createFileMutation.mutateAsync(data);
    },
    [createFileMutation]
  );

  const updateFile = useCallback(
    (id: string, updates: Partial<FileNode>) => {
      return updateFileMutation.mutateAsync({ id, updates });
    },
    [updateFileMutation]
  );

  const deleteFile = useCallback(
    (id: string) => {
      return deleteFileMutation.mutateAsync(id);
    },
    [deleteFileMutation]
  );

  const moveFile = useCallback(
    (id: string, newPath: string) => {
      return moveFileMutation.mutateAsync({ id, newPath });
    },
    [moveFileMutation]
  );

  const duplicateFile = useCallback(
    (id: string, newName: string) => {
      return duplicateFileMutation.mutateAsync({ id, newName });
    },
    [duplicateFileMutation]
  );

  const toggleLock = useCallback(
    (id: string, isLocked: boolean) => {
      return toggleLockMutation.mutateAsync({ id, isLocked });
    },
    [toggleLockMutation]
  );

  const bulkToggleLock = useCallback(
    (ids: string[], isLocked: boolean) => {
      return bulkLockMutation.mutateAsync({ ids, isLocked });
    },
    [bulkLockMutation]
  );

  const saveFileContent = useCallback(
    (id: string, content: string) => {
      return saveFileContentMutation.mutateAsync({ id, content });
    },
    [saveFileContentMutation]
  );

  return {
    // Data
    fileTree,
    selectedFile,
    expandedFolders,

    // Computed values
    ...computedValues,

    // Actions
    selectFile,
    toggleFolder,
    createFile,
    updateFile,
    deleteFile,
    moveFile,
    duplicateFile,
    toggleLock,
    bulkToggleLock,
    getFileContent: getFileContentQuery,
    saveFileContent,
    refetchTree,

    // Loading states
    isCreating: createFileMutation.isPending,
    isUpdating: updateFileMutation.isPending,
    isDeleting: deleteFileMutation.isPending,
    isMoving: moveFileMutation.isPending,
    isDuplicating: duplicateFileMutation.isPending,
    isTogglingLock: toggleLockMutation.isPending,
    isBulkLocking: bulkLockMutation.isPending,
    isSavingContent: saveFileContentMutation.isPending,
  };
}
