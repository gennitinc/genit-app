import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, GitBranch, GitCommit } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface VersionNode {
  id: number
  title: string
  description: string
  timestamp: string
  codePreview: string
  children?: VersionNode[]
}

interface HistoryPanelProps {
  id: string
  versionTree?: VersionNode[]
}

function VersionTreeNode({
  node,
  depth = 0,
  onSelect,
}: {
  node: VersionNode
  depth?: number
  onSelect: (node: VersionNode) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const handleSelect = () => {
    setIsSelected(true)
    onSelect(node)
    // Deselect after animation
    setTimeout(() => setIsSelected(false), 300)
  }

  return (
    <div className="relative ml-1">
      {/* Vertical connection line */}
      {node.children && node.children.length > 0 && (
        <div
          className="absolute left-[0.9rem] top-8 w-px bg-zinc-700/50"
          style={{ height: isExpanded ? `${node.children.length * 4}rem` : "0" }}
        />
      )}

      <motion.div
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-lg transition-colors",
          isSelected ? "bg-orange-500/10" : "hover:bg-zinc-800/50",
        )}
        onClick={handleSelect}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-4 w-4"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          <GitCommit className="h-4 w-4 text-zinc-400" />
        </Button>
        <div className="flex-1">
          <div className="flex flex-row items-center gap-2 mb-1">
            <GitBranch className="h-3 w-3 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-200">{node.title}</span>
          </div>
          <p className="text-xs text-zinc-400">{node.description}</p>
          <span className="text-xs text-zinc-500">{node.timestamp}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 mt-2 space-y-4"
          >
            {node.children.map((child) => (
              <VersionTreeNode key={child.id} node={child} depth={depth + 1} onSelect={onSelect} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function HistoryPanel({ id, versionTree = [] }: HistoryPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState<VersionNode | null>(null)

  const handleVersionSelect = (node: VersionNode) => {
    setSelectedVersion(node)
    // Here you would update the preview panel with the selected version's code
  }

  return (
    <div className="flex h-full flex-col bg-zinc-900">
      <div className="border-b border-zinc-800 p-4">
        <h2 className="text-lg font-semibold mb-2 text-zinc-100">Version History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500"
            placeholder="Search versions..."
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {versionTree.map((rootNode) => (
            <div key={rootNode.id} className="border border-zinc-800 rounded-lg p-2">
              <VersionTreeNode node={rootNode} onSelect={handleVersionSelect} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

