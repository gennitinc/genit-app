"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { DatabaseIcon, FileExportIcon, Settings01Icon, GitBranchIcon, CodeIcon, Mail01Icon, FilterIcon, WorkflowSquare10Icon, TableIcon } from "@hugeicons/core-free-icons";
import type React from "react";

const nodeTypes = [
  {
    type: "input",
    label: "Input",
    description: "Data input node",
    icon: <HugeiconsIcon icon={DatabaseIcon} className='mr-2 h-4 w-4' />,
  },
  {
    type: "output",
    label: "Output",
    description: "Data output node",
    icon: <HugeiconsIcon icon={FileExportIcon} className='mr-2 h-4 w-4' />,
  },
  {
    type: "process",
    label: "Process",
    description: "Data processing node",
    icon: <HugeiconsIcon icon={Settings01Icon} className='mr-2 h-4 w-4' />,
  },
  {
    type: "conditional",
    label: "Conditional",
    description: "Conditional branching",
    icon: <HugeiconsIcon icon={GitBranchIcon} className='mr-2 h-4 w-4' />,
  },
  {
    type: "code",
    label: "Code",
    description: "Custom code execution",
    icon: <HugeiconsIcon icon={CodeIcon} className='mr-2 h-4 w-4' />,
  },
  {
    type: "email",
    label: "Email",
    description: "Send email notification",
    icon: <HugeiconsIcon icon={Mail01Icon} className='mr-2 h-4 w-4' />,
    disabled: true,
  },
  {
    type: "filter",
    label: "Filter",
    description: "Filter data",
    icon: <HugeiconsIcon icon={FilterIcon} className='mr-2 h-4 w-4' />,
    disabled: true,
  },
  {
    type: "workflow",
    label: "Sub-workflow",
    description: "Nested workflow",
    icon: <HugeiconsIcon icon={WorkflowSquare10Icon} className='mr-2 h-4 w-4' />,
    disabled: true,
  },
  {
    type: "table",
    label: "Table",
    description: "Database table operation",
    icon: <HugeiconsIcon icon={TableIcon} className='mr-2 h-4 w-4' />,
    disabled: true,
  },
];

export default function NodeLibrary() {
  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className='flex flex-col gap-2'>
      {nodeTypes.map((node) => (
        <Button
          key={node.type}
          variant='outline'
          className={`justify-start text-left ${node.disabled ? "cursor-not-allowed opacity-50" : ""}`}
          draggable={!node.disabled}
          onDragStart={(e) => onDragStart(e, node.type)}
          disabled={node.disabled}
        >
          {node.icon}
          <div className='flex flex-col items-start'>
            <span>{node.label}</span>
            <span className='text-xs text-gray-500'>{node.description}</span>
          </div>
        </Button>
      ))}
      <div className='mt-4 text-xs text-gray-500'>
        <LocalizedText
          text={"Drag and drop nodes onto the canvas to build your workflow"}
        />
      </div>
    </div>
  );
}
