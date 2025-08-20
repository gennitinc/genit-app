"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Search,
  X,
  Trash2,
  Move,
  PenSquare,
  Plus,
  Copy,
  ClipboardPasteIcon as Paste,
  Loader2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useTheme } from "next-themes";
import { type FileNode, useFileSystem } from "@/context/FileSystem";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

const sortFiles = (files: FileNode[]): FileNode[] => {
  return files
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "folder" ? -1 : 1;
    })
    .map((file) => {
      if (file.type === "folder" && file.children) {
        return { ...file, children: sortFiles(file.children) };
      }
      return file;
    });
};

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return <File className="h-4 w-4 text-yellow-500" />;
    case "html":
      return <File className="h-4 w-4 text-orange-500" />;
    case "css":
      return <File className="h-4 w-4 text-blue-500" />;
    case "json":
      return <File className="h-4 w-4 text-green-500" />;
    case "md":
      return <File className="h-4 w-4 text-purple-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
};

interface FileTreeNodeProps {
  node: FileNode;
  path: string[];
  level: number;
  onSelectFile: (file: FileNode) => void;
  theme: string | undefined;
  onDragStart: (e: React.DragEvent, path: string[]) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, path: string[]) => void;
  clipboard: { type: "copy" | "cut"; items: string[] } | null;
  setClipboard: React.Dispatch<
    React.SetStateAction<{ type: "copy" | "cut"; items: string[] } | null>
  >;
  streamingFiles: Set<string>;
  generatingFiles: Set<string>;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  node,
  path,
  level,
  onSelectFile,
  theme,
  onDragStart,
  onDragOver,
  onDrop,
  clipboard,
  setClipboard,
  streamingFiles,
  generatingFiles,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoveIcon, setShowMoveIcon] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState<"file" | "folder" | null>(
    null
  );
  const {
    addFile,
    updateFile,
    deleteFile,
    renameFile,
    copyFile,
    moveFile,
    pasteFiles,
  } = useFileSystem();
  const inputRef = useRef<HTMLInputElement>(null);

  const filePath = path.join("/");
  const isStreaming = streamingFiles.has(filePath);
  const isGenerating = generatingFiles.has(filePath);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (node.type === "folder") {
        setIsOpen(!isOpen);
      }
    },
    [node.type, isOpen]
  );

  const handleFileClick = useCallback(() => {
    if (node.type === "file") {
      onSelectFile(node);
    }
  }, [node, onSelectFile]);

  const handleRename = useCallback(() => {
    setIsRenaming(true);
    setNewName(node.name);
  }, [node.name]);

  const handleRenameSubmit = useCallback(() => {
    if (newName && newName !== node.name) {
      renameFile(path, newName);
      toast({
        title: "File Renamed",
        description: `${node.name} has been renamed to ${newName}.`,
      });
    }
    setIsRenaming(false);
  }, [renameFile, path, node.name, newName]);

  const handleDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(() => {
    deleteFile(path);
    toast({
      title: "File Deleted",
      description: `${node.name} has been deleted.`,
    });
    setShowDeleteDialog(false);
  }, [deleteFile, path, node.name]);

  const handleCopy = useCallback(() => {
    setClipboard({ type: "copy", items: [path.join("/")] });
    toast({
      title: "Copied",
      description: `${node.name} has been copied to clipboard.`,
    });
  }, [setClipboard, path, node.name]);

  const handleCut = useCallback(() => {
    setClipboard({ type: "cut", items: [path.join("/")] });
    toast({
      title: "Cut",
      description: `${node.name} has been cut to clipboard.`,
    });
  }, [setClipboard, path, node.name]);

  const handlePaste = useCallback(() => {
    if (clipboard && clipboard.items.length > 0) {
      pasteFiles(clipboard, path);
      toast({
        title: "Pasted",
        description: `Item(s) have been pasted into ${node.name}.`,
      });
      setClipboard(null);
    }
  }, [clipboard, pasteFiles, path, node.name, setClipboard]);

  const handleNewFile = useCallback(() => {
    setIsCreatingNew("file");
    setIsOpen(true);
    setNewName("");
  }, []);

  const handleNewFolder = useCallback(() => {
    setIsCreatingNew("folder");
    setIsOpen(true);
    setNewName("");
  }, []);

  const handleCreateNewSubmit = useCallback(() => {
    if (newName && isCreatingNew) {
      addFile(path, newName, isCreatingNew);
      toast({
        title: `${isCreatingNew === "folder" ? "Folder" : "File"} Created`,
        description: `${newName} has been created.`,
      });
      setIsCreatingNew(null);
      setNewName("");
    }
  }, [addFile, isCreatingNew, newName, path]);

  const handleCreateNewCancel = useCallback(() => {
    setIsCreatingNew(null);
    setNewName("");
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isCreatingNew &&
        !(e.target as HTMLElement).closest(".new-item-input")
      ) {
        handleCreateNewSubmit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    if (isCreatingNew || isRenaming) {
      inputRef.current?.focus();
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreatingNew, handleCreateNewSubmit, isRenaming]);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            className={cn(
              "flex items-center py-1 px-2 cursor-pointer select-none hover:rounded-md relative",
              theme === "dark" ? "hover:bg-zinc-800/50" : "hover:bg-gray-100",
              "transition-colors duration-2007",
              isStreaming && "bg-blue-50 dark:bg-blue-900/20",
              isGenerating && "bg-yellow-50 dark:bg-yellow-900/20"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleFileClick();
            }}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, path)}
            animate={isStreaming ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div
              style={{ paddingLeft: `${level * 12}px` }}
              className="flex items-center flex-1"
              draggable
              onDragStart={(e: React.DragEvent) => {
                onDragStart(e, path);
                setShowMoveIcon(true);
              }}
              onDragEnd={() => setShowMoveIcon(false)}
            >
              {node.type === "folder" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-4 w-4 mr-1"
                  onClick={handleToggle}
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* File/Folder Icon with Status Indicators */}
              <div className="relative mr-2">
                {node.type === "folder" ? (
                  <Folder className="h-4 w-4 text-orange-600" />
                ) : (
                  getFileIcon(node.name)
                )}

                {/* Streaming Indicator */}
                {isStreaming && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Zap className="h-2 w-2 text-white" />
                  </motion.div>
                )}

                {/* Generating Indicator */}
                {isGenerating && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="h-2 w-2 text-white" />
                  </motion.div>
                )}
              </div>

              {isRenaming ? (
                <Input
                  ref={inputRef}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit();
                    if (e.key === "Escape") setIsRenaming(false);
                  }}
                  className="h-6 py-0 px-1 text-sm"
                  autoFocus
                />
              ) : (
                <span
                  className={cn(
                    "text-sm",
                    isStreaming &&
                      "text-blue-700 dark:text-blue-300 font-medium",
                    isGenerating &&
                      "text-yellow-700 dark:text-yellow-300 font-medium"
                  )}
                >
                  {node.name}
                  {isStreaming && (
                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                      streaming...
                    </span>
                  )}
                  {isGenerating && (
                    <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
                      generating...
                    </span>
                  )}
                </span>
              )}
              {showMoveIcon && <Move className="ml-2 h-4 w-4" />}
            </div>
          </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {node.type === "folder" && (
            <>
              <ContextMenuItem onClick={handleNewFile}>
                <Plus className="mr-2 h-4 w-4" />
                New File
              </ContextMenuItem>
              <ContextMenuItem onClick={handleNewFolder}>
                <Folder className="mr-2 h-4 w-4" />
                New Folder
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem onClick={handleRename}>
            <PenSquare className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
          <ContextMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </ContextMenuItem>
          <ContextMenuItem onClick={handleCut}>
            <Move className="mr-2 h-4 w-4" />
            Cut
          </ContextMenuItem>
          {node.type === "folder" && (
            <ContextMenuItem
              onClick={handlePaste}
              disabled={!clipboard || clipboard.items.length === 0}
            >
              <Paste className="mr-2 h-4 w-4" />
              Paste
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>

      {node.type === "folder" && isOpen && (
        <div>
          {isCreatingNew && (
            <div
              className="flex items-center py-1 px-2"
              style={{ paddingLeft: `${(level + 1) * 12}px` }}
            >
              <span className="mr-2">
                {isCreatingNew === "file" ? (
                  getFileIcon("newfile.txt")
                ) : (
                  <Folder className="h-4 w-4 text-orange-600" />
                )}
              </span>
              <Input
                ref={inputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleCreateNewSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateNewSubmit();
                  if (e.key === "Escape") handleCreateNewCancel();
                }}
                className="h-6 py-0 px-1 text-sm new-item-input"
                autoFocus
              />
            </div>
          )}
          {node.children &&
            sortFiles(node.children).map((child) => (
              <FileTreeNode
                key={child.name}
                node={child}
                path={[...path, child.name]}
                level={level + 1}
                onSelectFile={onSelectFile}
                theme={theme}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                clipboard={clipboard}
                setClipboard={setClipboard}
                streamingFiles={streamingFiles}
                generatingFiles={generatingFiles}
              />
            ))}
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {node.name}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface FileTreeProps {
  onSelectFile: (file: FileNode) => void;
  streamingFiles?: Set<string>;
  generatingFiles?: Set<string>;
}

export const FileTree: React.FC<FileTreeProps> = ({
  onSelectFile,
  streamingFiles = new Set(),
  generatingFiles = new Set(),
}) => {
  const { theme } = useTheme();
  const { files, setFiles, searchFiles, moveFile, addFile } = useFileSystem();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FileNode[]>([]);
  const [draggedItem, setDraggedItem] = useState<string[] | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<"file" | "folder" | null>(
    null
  );
  const [newName, setNewName] = useState("");
  const [clipboard, setClipboard] = useState<{
    type: "copy" | "cut";
    items: string[];
  } | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim()) {
        const results = searchFiles(query.trim());
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    },
    [searchFiles]
  );

  const handleDragStart = useCallback((e: React.DragEvent, path: string[]) => {
    setDraggedItem(path);
    e.dataTransfer.setData("text/plain", path.join("/"));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetPath: string[]) => {
      e.preventDefault();
      if (draggedItem) {
        moveFile(draggedItem, targetPath);
        toast({
          title: "File Moved",
          description: `File has been moved successfully.`,
        });
        setDraggedItem(null);
      }
    },
    [draggedItem, moveFile]
  );

  const handleNewFile = useCallback(() => {
    setIsCreatingNew("file");
    setIsOpen(true);
    setNewName("");
  }, []);

  const handleNewFolder = useCallback(() => {
    setIsCreatingNew("folder");
    setIsOpen(true);
    setNewName("");
  }, []);

  const handleCreateNewSubmit = useCallback(() => {
    if (newName && isCreatingNew) {
      addFile([], newName, isCreatingNew);
      toast({
        title: `${isCreatingNew === "folder" ? "Folder" : "File"} Created`,
        description: `${newName} has been created.`,
      });
      setIsCreatingNew(null);
      setNewName("");
    }
  }, [addFile, isCreatingNew, newName]);

  const handleCreateNewCancel = useCallback(() => {
    setIsCreatingNew(null);
    setNewName("");
  }, []);

  const handleRootFolderClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const contextMenu = document.querySelector(
      "[data-radix-context-menu-trigger]"
    );
    if (contextMenu instanceof HTMLElement) {
      contextMenu.click();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isCreatingNew &&
        !(e.target as HTMLElement).closest(".new-item-input")
      ) {
        handleCreateNewSubmit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreatingNew, handleCreateNewSubmit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-[90%]">
        <div className="h-full pb-20" onClick={handleRootFolderClick}>
          <div className="p-2 h-full flex flex-col overflow-hidden">
            <div className="mb-2 flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 pr-4 py-1 h-8 text-xs"
                  ref={searchInputRef}
                />
              </div>
            </div>

            {/* Generation Status Summary */}
            {(streamingFiles.size > 0 || generatingFiles.size > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">
                    {streamingFiles.size > 0 &&
                      `${streamingFiles.size} streaming`}
                    {streamingFiles.size > 0 &&
                      generatingFiles.size > 0 &&
                      ", "}
                    {generatingFiles.size > 0 &&
                      `${generatingFiles.size} generating`}
                  </span>
                </div>
              </motion.div>
            )}

            {searchResults.length > 0 && (
              <div className="mb-4 p-2 bg-secondary rounded">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold">Search Results:</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchResults([])}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-fit">
                  {searchResults.map((file) => (
                    <div
                      key={file.name}
                      className="ml-2 text-sm cursor-pointer hover:underline py-1"
                      onClick={() => onSelectFile(file)}
                    >
                      {file.name}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}

            <ScrollArea className="flex-grow overflow-y-auto">
              {isCreatingNew && (
                <div className="flex items-center py-1 px-2">
                  <span className="mr-2">
                    {isCreatingNew === "file" ? (
                      getFileIcon("newfile.txt")
                    ) : (
                      <Folder className="h-4 w-4 text-orange-600" />
                    )}
                  </span>
                  <Input
                    ref={searchInputRef}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleCreateNewSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateNewSubmit();
                      if (e.key === "Escape") handleCreateNewCancel();
                    }}
                    className="h-6 py-0 px-1 text-sm new-item-input"
                    autoFocus
                  />
                </div>
              )}
              {sortFiles(files).map((file) => (
                <FileTreeNode
                  key={file.name}
                  node={file}
                  path={[file.name]}
                  level={0}
                  onSelectFile={onSelectFile}
                  theme={theme}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  clipboard={clipboard}
                  setClipboard={setClipboard}
                  streamingFiles={streamingFiles}
                  generatingFiles={generatingFiles}
                />
              ))}
            </ScrollArea>
          </div>
        </div>
      </ContextMenuTrigger>
      <div className="">
        <ContextMenuContent>
          <ContextMenuItem onClick={handleNewFile}>
            <Plus className="mr-2 h-4 w-4" />
            New File
          </ContextMenuItem>
          <ContextMenuItem onClick={handleNewFolder}>
            <Folder className="mr-2 h-4 w-4" />
            New Folder
          </ContextMenuItem>
        </ContextMenuContent>
      </div>
    </ContextMenu>
  );
};
