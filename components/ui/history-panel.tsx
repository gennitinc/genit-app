import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { GitBranch, GitCommit, Search } from "lucide-react";
import { useState } from "react";

interface VersionNode {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  codePreview: string;
  children?: VersionNode[];
}

interface HistoryPanelProps {
  id: string;
  versionTree?: VersionNode[];
}

function VersionTreeNode({
  node,
  depth = 0,
  onSelect,
}: {
  node: VersionNode;
  depth?: number;
  onSelect: (node: VersionNode) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(true);
    onSelect(node);
    // Deselect after animation
    setTimeout(() => setIsSelected(false), 300);
  };

  return (
    <div className='relative ml-1'>
      {/* Vertical connection line */}
      {node.children && node.children.length > 0 && (
        <div
          className='absolute top-8 left-[0.9rem] w-px bg-zinc-700/50'
          style={{
            height: isExpanded ? `${node.children.length * 4}rem` : "0",
          }}
        />
      )}

      <motion.div
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
          isSelected ? "bg-orange-500/10" : "hover:bg-zinc-800/50"
        )}
        onClick={handleSelect}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant='ghost'
          size='sm'
          className='h-4 w-4 p-0'
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <GitCommit className='h-4 w-4 text-zinc-400' />
        </Button>
        <div className='flex-1'>
          <div className='mb-1 flex flex-row items-center gap-2'>
            <GitBranch className='h-3 w-3 text-zinc-500' />
            <span className='text-sm font-medium text-zinc-200'>
              {node.title}
            </span>
          </div>
          <p className='text-xs text-zinc-400'>{node.description}</p>
          <span className='text-xs text-zinc-500'>{node.timestamp}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className='mt-2 ml-6 space-y-4'
          >
            {node.children.map((child) => (
              <VersionTreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HistoryPanel({ id, versionTree = [] }: HistoryPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState<VersionNode | null>(
    null
  );

  const handleVersionSelect = (node: VersionNode) => {
    setSelectedVersion(node);
    // Here you would update the preview panel with the selected version's code
  };

  return (
    <div className='flex h-full flex-col bg-zinc-900'>
      <div className='p-4'>
        <h2 className='mb-2 text-lg font-semibold text-zinc-100'>
          <LocalizedText text={"Version History"} />
        </h2>
        <div className='relative'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400' />
          <Input
            className='border-zinc-700 bg-zinc-800 pl-10 text-zinc-200 placeholder:text-zinc-500'
            placeholder='Search versions...'
          />
        </div>
      </div>
      <ScrollArea className='flex-1'>
        <div className='space-y-4 p-4'>
          {versionTree.map((rootNode) => (
            <div
              key={rootNode.id}
              className='rounded-lg border border-zinc-800 p-2'
            >
              <VersionTreeNode node={rootNode} onSelect={handleVersionSelect} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
