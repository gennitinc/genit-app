"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Sparkles, BarChart3, X } from "lucide-react";

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
    <div className="bg-white border-2 border-purple-200 rounded-[1.5rem] shadow-lg w-96 h-96">
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-400"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-400"
      />

      {/* Remove Button */}
      {data.onRemoveNode && data.nodeId && (
        <button
          onClick={() => data.onRemoveNode?.(data.nodeId as string)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg z-10"
          title="Remove node"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-purple-50 rounded-t-lg">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-sm text-gray-900">
            Previous Chats
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <Badge
            variant="secondary"
            className="text-xs bg-purple-100 text-purple-700"
          >
            Just now
          </Badge>
        </div>
      </div>

      {/* Summarize Section */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Summarize:</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-purple-700">Poppy</span>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-3 h-48">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm text-gray-700 leading-relaxed">
              {msg.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-2 mb-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs bg-transparent"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Summarize
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs bg-transparent"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Get Key Insights
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="text-sm"
          />
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
