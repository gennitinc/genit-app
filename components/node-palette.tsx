"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Plus,
  Database,
  Settings,
  FileOutput,
  GitBranch,
  Code,
  MessageCircle,
  Youtube,
  FileText,
  FolderOpen,
} from "lucide-react";

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
    <div className="w-80 bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">Node Palette</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Drag or click to add nodes to your workflow
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Node Types */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredNodes.map((node) => {
            const IconComponent = node.icon;
            return (
              <div
                key={node.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md group ${
                  node.bgColor
                } border-border hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98]`}
                onClick={() => handleAddNode(node.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${node.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <IconComponent className={`w-5 h-5 ${node.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground mb-1">
                      {node.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {node.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-all duration-200 bg-primary/10 hover:bg-primary/20"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {filteredNodes.length} node types available
        </div>
      </div>
    </div>
  );
}
