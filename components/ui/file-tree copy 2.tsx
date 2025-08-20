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
  ListCollapseIcon as CollapseIcon,
  Check,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

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
  selectedItems: Set<string>;
  toggleSelection: (path: string) => void;
  expandedFolders: Set<string>;
  toggleExpand: (path: string) => void;
  searchQuery: string;
  clipboard: { type: "copy" | "cut"; items: string[] } | null;
  handlePaste: (destinationPath: string[]) => void;
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
  selectedItems,
  toggleSelection,
  expandedFolders,
  toggleExpand,
  searchQuery,
  clipboard,
  handlePaste,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoveIcon, setShowMoveIcon] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState<"file" | "folder" | null>(
    null
  );
  const { addFile, updateFile, deleteFile, renameFile, copyFile, moveFile } =
    useFileSystem();
  const inputRef = useRef<HTMLInputElement>(null);

  const isExpanded = expandedFolders.has(path.join("/"));
  const isSelected = selectedItems.has(path.join("/"));

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (node.type === "folder") {
        toggleExpand(path.join("/"));
      }
    },
    [node.type, path, toggleExpand]
  );

  const handleFileClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.ctrlKey || e.metaKey) {
        toggleSelection(path.join("/"));
      } else {
        if (node.type === "file") {
          onSelectFile(node);
        }
      }
    },
    [node, onSelectFile, path, toggleSelection]
  );

  const handleRename = useCallback(() => {
    setIsRenaming(true);
    setNewName(node.name);
    setTimeout(() => inputRef.current?.focus(), 0);
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

  const handleNewFile = useCallback(() => {
    setIsCreatingNew("file");
    if (node.type === "folder" && !expandedFolders.has(path.join("/"))) {
      toggleExpand(path.join("/"));
    }
    setNewName("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [node.type, path, toggleExpand, expandedFolders]);

  const handleNewFolder = useCallback(() => {
    setIsCreatingNew("folder");
    if (node.type === "folder" && !expandedFolders.has(path.join("/"))) {
      toggleExpand(path.join("/"));
    }
    setNewName("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [node.type, path, toggleExpand, expandedFolders]);

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

  const handleCopy = useCallback(() => {
    copyFile(path, []);
    toast({
      title: "File Copied",
      description: `${node.name} has been copied to clipboard.`,
    });
  }, [copyFile, path, node.name]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isCreatingNew &&
        !(e.target as HTMLElement).closest(".new-item-input")
      ) {
        handleCreateNewCancel();
      }
      if (isRenaming && !(e.target as HTMLElement).closest(".rename-input")) {
        handleRenameSubmit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreatingNew, isRenaming, handleCreateNewCancel, handleRenameSubmit]);

  const highlightSearchMatch = (text: string) => {
    if (!searchQuery) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 dark:bg-yellow-800">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex items-center py-1 px-2 cursor-pointer select-none hover:rounded-md",
              isSelected ? "bg-blue-100 dark:bg-blue-800" : "",
              theme === "dark" ? "hover:bg-zinc-800/50" : "hover:bg-gray-100",
              "transition-colors duration-200"
            )}
            onClick={(e) => {
              handleToggle(e);
              handleFileClick(e);
            }}
            onDragStart={(e) => {
              onDragStart(e, path);
              setShowMoveIcon(true);
            }}
            onDragEnd={() => setShowMoveIcon(false)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, path)}
            draggable
          >
            <div
              style={{ paddingLeft: `${level * 12}px` }}
              className="flex items-center flex-1"
            >
              {node.type === "folder" && (
                <Button variant="ghost" size="sm" className="p-0 h-4 w-4 mr-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {node.type === "folder" ? (
                <Folder className="h-4 w-4 mr-2 text-orange-600" />
              ) : (
                <span className="mr-2">{getFileIcon(node.name)}</span>
              )}
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
                  className="h-6 py-0 px-1 text-sm rename-input"
                  autoFocus
                />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm truncate max-w-[150px]">
                        {highlightSearchMatch(node.name)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{node.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {showMoveIcon && <Move className="ml-2 h-4 w-4" />}
            </div>
          </div>
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
          {/* <ContextMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </ContextMenuItem>
          {node.type === "folder" && (
            <ContextMenuItem
              onClick={() => handlePaste(path)}
              disabled={!clipboard || clipboard.items.length === 0}
            >
              <Paste className="mr-2 h-4 w-4" />
              Paste
            </ContextMenuItem>
          )} */}
        </ContextMenuContent>
      </ContextMenu>
      {node.type === "folder" && isExpanded && (
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateNewSubmit();
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    handleCreateNewCancel();
                  }
                }}
                className="h-6 py-0 px-1 text-sm new-item-input mr-2"
                autoFocus
              />

              {/* <div className="flex flex-row items-center gap-1">
                <Check className="h-4 w-4 cursor-pointer" onClick={handleCreateNewSubmit} />

                <X className="h-4 w-4 cursor-pointer" onClick={handleCreateNewCancel} />
              </div> */}
            </div>
          )}
          {node.children &&
            node.children.map((child) => (
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
                selectedItems={selectedItems}
                toggleSelection={toggleSelection}
                expandedFolders={expandedFolders}
                toggleExpand={toggleExpand}
                searchQuery={searchQuery}
                clipboard={clipboard}
                handlePaste={handlePaste}
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
}

export const FileTree: React.FC<FileTreeProps> = ({ onSelectFile }) => {
  const { theme } = useTheme();
  const { files, setFiles, searchFiles, moveFile, copyFile, pasteFiles } =
    useFileSystem();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FileNode[]>([]);
  const [draggedItem, setDraggedItem] = useState<string[] | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [clipboard, setClipboard] = useState<{
    type: "copy" | "cut";
    items: string[];
  } | null>(null);
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

  const toggleSelection = useCallback((path: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  const toggleExpand = useCallback((path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  const handleCopy = useCallback(() => {
    if (selectedItems.size > 0) {
      setClipboard({ type: "copy", items: Array.from(selectedItems) });
      toast({
        title: "Copied",
        description: `${selectedItems.size} item(s) copied to clipboard.`,
      });
    } else if (files.length > 0) {
      setClipboard({ type: "copy", items: [files[0].name] }); // Updated line
      toast({
        title: "Copied",
        description: `${files[0].name} copied to clipboard.`,
      });
    }
  }, [selectedItems, files]);

  const handleCut = useCallback(() => {
    setClipboard({ type: "cut", items: Array.from(selectedItems) });
    toast({
      title: "Cut",
      description: `${selectedItems.size} item(s) cut to clipboard.`,
    });
  }, [selectedItems]);

  const handlePaste = useCallback(
    (destinationPath: string[]) => {
      if (clipboard && clipboard.items.length > 0) {
        // Updated condition
        pasteFiles(clipboard, destinationPath);
        toast({
          title: "Pasted",
          description: `${clipboard.items.length} item(s) pasted successfully.`,
        });
        setClipboard(null);
      }
    },
    [clipboard, pasteFiles]
  );

  const handleExpandAll = useCallback(() => {
    const allFolders = new Set<string>();
    const addFolders = (node: FileNode, path: string[] = []) => {
      if (node.type === "folder") {
        allFolders.add(path.join("/"));
        node.children?.forEach((child) =>
          addFolders(child, [...path, child.name])
        );
      }
    };
    files.forEach((file) => addFolders(file));
    setExpandedFolders(allFolders);
  }, [files]);

  const handleCollapseAll = useCallback(() => {
    setExpandedFolders(new Set());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        handleCopy();
      }
      if (e.ctrlKey && e.key === "x") {
        e.preventDefault();
        handleCut();
      }
      if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        // Use the root path for now, you might want to update this to use the current selected folder
        handlePaste(["root"]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy, handleCut, handlePaste]);

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="relative flex-grow mr-2">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8 pr-4 py-1 text-xs h-8"
            ref={searchInputRef}
          />
        </div>
        {/* <Button variant="outline" size="sm" onClick={handleExpandAll}>
          <ChevronDown className="h-4 w-4 mr-2" />
          Expand All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCollapseAll}
          className="ml-2"
        >
          <CollapseIcon className="h-4 w-4 mr-2" />
          Collapse All
        </Button> */}
      </div>
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
          <ScrollArea className="h-40">
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
      <ScrollArea className="flex-grow">
        {/* <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Root</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
        {files.map((file) => (
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
            selectedItems={selectedItems}
            toggleSelection={toggleSelection}
            expandedFolders={expandedFolders}
            toggleExpand={toggleExpand}
            searchQuery={searchQuery}
            clipboard={clipboard}
            handlePaste={handlePaste}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
