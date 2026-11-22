"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, BubbleChatIcon, SparklesIcon, ChartColumnIcon, SentIcon } from "@hugeicons/core-free-icons";
import { Handle, Position } from "reactflow";
import { useState } from "react";

interface ChatNodeProps {
  data: {
    label: string;
    description?: string;
    onRemoveNode?: (nodeId: string) => void;
    nodeId?: string;
  };
}

export function ChatNode({ data }: ChatNodeProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Dr. Jo demonstrates two simple breathing techniques to relieve stress and anxiety.",
    },
    {
      id: 2,
      type: "ai",
      content:
        "The first technique is called box breathing or square breathing, used by the military to relax before stressful situations.",
    },
    {
      id: 3,
      type: "ai",
      content:
        "Box breathing involves inhaling for four seconds, holding the breath for four seconds, exhaling for four seconds...",
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), type: "user", content: message },
      ]);
      setMessage("");
    }
  };

  return (
    <div className='h-96 w-96 rounded-[1.5rem] border-2 border-purple-200 bg-white shadow-lg'>
      <Handle
        type='source'
        position={Position.Right}
        className='h-3 w-3 bg-purple-400'
      />
      <Handle
        type='target'
        position={Position.Left}
        className='h-3 w-3 bg-purple-400'
      />

      {/* Remove Button */}
      {data.onRemoveNode && data.nodeId && (
        <button
          onClick={() => data.onRemoveNode?.(data.nodeId as string)}
          className='absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg transition-colors duration-200 hover:bg-red-600'
          title='Remove node'
        >
          <HugeiconsIcon icon={Cancel01Icon} className='h-3 w-3' />
        </button>
      )}

      {/* Header */}
      <div className='rounded-t-lg border-b border-gray-200 bg-purple-50 p-3'>
        <div className='mb-2 flex items-center gap-2'>
          <HugeiconsIcon icon={BubbleChatIcon} className='h-4 w-4 text-purple-600' />
          <span className='text-sm font-medium text-gray-900'>
            Previous Chats
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1'>
            <div className='h-2 w-2 rounded-full bg-green-400'></div>
            <div className='h-2 w-2 rounded-full bg-gray-300'></div>
            <div className='h-2 w-2 rounded-full bg-gray-300'></div>
          </div>
          <Badge
            variant='secondary'
            className='bg-purple-100 text-xs text-purple-700'
          >
            Just now
          </Badge>
        </div>
      </div>

      {/* Summarize Section */}
      <div className='border-b border-gray-200 p-3'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-sm font-medium text-gray-700'>Summarize:</span>
        </div>
        <div className='mb-2 flex items-center gap-2'>
          <HugeiconsIcon icon={SparklesIcon} className='h-4 w-4 text-purple-500' />
          <span className='text-sm font-medium text-purple-700'>Poppy</span>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className='h-48 flex-1 p-3'>
        <div className='space-y-3'>
          {messages.map((msg) => (
            <div key={msg.id} className='text-sm leading-relaxed text-gray-700'>
              {msg.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className='border-t border-gray-200 p-3'>
        <div className='mb-2 flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            className='bg-transparent text-xs'
          >
            <HugeiconsIcon icon={SparklesIcon} className='mr-1 h-3 w-3' />
            Summarize
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='bg-transparent text-xs'
          >
            <HugeiconsIcon icon={ChartColumnIcon} className='mr-1 h-3 w-3' />
            Get Key Insights
          </Button>
        </div>
        <div className='flex gap-2'>
          <Input
            placeholder='Type your message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className='text-sm'
          />
          <Button size='sm' onClick={handleSendMessage}>
            <HugeiconsIcon icon={SentIcon} className='h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
}
