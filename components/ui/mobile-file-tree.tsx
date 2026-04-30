"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Code,
  File,
  Folder,
  Image,
  Settings,
} from "lucide-react";
import * as React from "react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
}

const initialFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          {
            name: "Button.tsx",
            type: "file",
            content: "// Button component code",
          },
          {
            name: "Input.tsx",
            type: "file",
            content: "// Input component code",
          },
        ],
      },
      {
        name: "pages",
        type: "folder",
        children: [
          { name: "index.tsx", type: "file", content: "// Home page code" },
          { name: "about.tsx", type: "file", content: "// About page code" },
        ],
      },
      {
        name: "styles",
        type: "folder",
        children: [
          { name: "globals.css", type: "file", content: "/* Global styles */" },
        ],
      },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "favicon.ico", type: "file", content: "// Favicon file content" },
    ],
  },
  {
    name: "package.json",
    type: "file",
    content: '{ "name": "my-project", "version": "1.0.0" }',
  },
  {
    name: "tsconfig.json",
    type: "file",
    content: '{ "compilerOptions": { "target": "es5" } }',
  },
];

const FileIcon = ({ name }: { name: string }) => {
  const extension = name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "tsx":
    case "ts":
    case "jsx":
    case "js":
      return <Code className='h-4 w-4 text-blue-500' />;
    case "css":
      return <Code className='h-4 w-4 text-purple-500' />;
    case "json":
      return <Settings className='h-4 w-4 text-yellow-500' />;
    case "ico":
    case "png":
    case "jpg":
    case "svg":
      return <Image className='h-4 w-4 text-green-500' />;
    default:
      return <File className='h-4 w-4 text-gray-500' />;
  }
};

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onSelectFile: (file: FileNode) => void;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  node,
  level,
  onSelectFile,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node);
    }
  };

  return (
    <div>
      <Button
        variant='ghost'
        size='sm'
        className={cn(
          "w-full justify-start px-2 py-1 text-sm",
          level > 0 && "ml-4",
          node.type === "folder" && "font-semibold"
        )}
        onClick={handleClick}
      >
        {node.type === "folder" && (
          <ChevronRight
            className={cn(
              "mr-1 h-4 w-4 transition-transform",
              isOpen && "rotate-90 transform"
            )}
          />
        )}
        {node.type === "folder" ? (
          <Folder className='mr-2 h-4 w-4 text-blue-500' />
        ) : (
          <FileIcon name={node.name} />
        )}
        {node.name}
      </Button>
      <AnimatePresence>
        {isOpen && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child, index) => (
              <FileTreeNode
                key={index}
                node={child}
                level={level + 1}
                onSelectFile={onSelectFile}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MobileFileTreeProps {
  onSelectFile: (file: FileNode) => void;
}

export const MobileFileTree: React.FC<MobileFileTreeProps> = ({
  onSelectFile,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className='border-b border-gray-200 dark:border-gray-700'>
      <Button
        variant='ghost'
        size='sm'
        className='w-full justify-start px-4 py-2 text-sm font-semibold'
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronRight
          className={cn(
            "mr-2 h-4 w-4 transition-transform",
            isOpen && "rotate-90 transform"
          )}
        />
        Project Files
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ScrollArea className='h-64'>
              <div className='p-2'>
                {initialFiles.map((file, index) => (
                  <FileTreeNode
                    key={index}
                    node={file}
                    level={0}
                    onSelectFile={onSelectFile}
                  />
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
