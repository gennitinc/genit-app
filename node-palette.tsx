"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Code,
  Database,
  FileOutput,
  FileText,
  FolderOpen,
  GitBranch,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Youtube,
} from "lucide-react";
import { useState } from "react";

interface NodePaletteProps {
  onAddNode: (nodeType: string, position: { x: number; y: number }) => void;
}

const nodeTypes = [
  {
    id: "input",
    name: "Input",
    description: "Data input node",
    icon: Database,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    id: "process",
    name: "Process",
    description: "Data processing node",
    icon: Settings,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  {
    id: "output",
    name: "Output",
    description: "Data output node",
    icon: FileOutput,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    id: "conditional",
    name: "Conditional",
    description: "Conditional branching",
    icon: GitBranch,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
  {
    id: "code",
    name: "Code",
    description: "Custom code execution",
    icon: Code,
    color: "text-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-950",
  },
  {
    id: "aiChat",
    name: "AI Chat",
    description: "AI conversation node",
    icon: MessageCircle,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950",
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "YouTube video content",
    icon: Youtube,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
  {
    id: "pdf",
    name: "PDF",
    description: "PDF document content",
    icon: FileText,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
  {
    id: "folder",
    name: "Folder",
    description: "Content organization",
    icon: FolderOpen,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
  },
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNodes = nodeTypes.filter(
    (node) =>
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNode = (nodeType: string) => {
    // Add node at a default position (center of canvas)
    onAddNode(nodeType, { x: 400, y: 300 });
  };

  return (
    <div className='bg-background border-border flex w-80 flex-col border-r'>
      {/* Header */}
      <div className='border-border border-b p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600'>
              <Plus className='h-4 w-4 text-white' />
            </div>
            <span className='text-foreground font-semibold'>Node Palette</span>
          </div>
        </div>
        <p className='text-muted-foreground text-sm'>
          Drag or click to add nodes to your workflow
        </p>
      </div>

      {/* Search */}
      <div className='border-border border-b p-4'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Search nodes...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Node Types */}
      <ScrollArea className='flex-1 p-4'>
        <div className='space-y-3'>
          {filteredNodes.map((node) => {
            const IconComponent = node.icon;
            return (
              <div
                key={node.id}
                className={`group cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                  node.bgColor
                } border-border hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98]`}
                onClick={() => handleAddNode(node.id)}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`h-10 w-10 rounded-lg ${node.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    <IconComponent className={`h-5 w-5 ${node.color}`} />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 className='text-foreground mb-1 text-sm font-medium'>
                      {node.name}
                    </h3>
                    <p className='text-muted-foreground text-xs'>
                      {node.description}
                    </p>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='bg-primary/10 hover:bg-primary/20 h-auto p-1 opacity-0 transition-all duration-200 group-hover:opacity-100'
                  >
                    <Plus className='text-primary h-4 w-4' />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className='border-border border-t p-4'>
        <div className='text-muted-foreground text-center text-xs'>
          {filteredNodes.length} node types available
        </div>
      </div>
    </div>
  );
}
