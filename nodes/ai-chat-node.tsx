"use client";

import { useState, useCallback } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Send, Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIChatNodeData {
  title?: string;
  messages?: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  onRemoveNode?: (nodeId: string) => void;
  nodeId?: string;
}

export function AIChatNode({
  data,
  isConnectable,
  selected,
}: NodeProps<AIChatNodeData>) {
  const [message, setMessage] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);

  const { title = "AI Chat Assistant", messages = [] } = data;

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  }, [message]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  return (
    <div
      className={`bg-background border-2 rounded-lg shadow-lg transition-all duration-200 ${
        isMaximized ? "fixed inset-4 z-50" : "w-full h-full"
      } ${selected ? "ring-2 ring-primary ring-offset-2" : ""}`}
      style={{ minWidth: "300px", minHeight: "250px" }}
    >
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
      />

      {/* Remove Button */}
      {data.onRemoveNode && data.nodeId && (
        <button
          onClick={() => data.onRemoveNode!(data.nodeId!)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg z-10"
          title="Remove node"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMaximized(!isMaximized)}
            className="h-6 w-6 p-0 hover:bg-muted"
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3">
        <ScrollArea className="h-48 w-full">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send className="w-4 h-4" />
                </div>
                <p>Start a conversation with AI</p>
                <p className="text-xs">Type your message below</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="px-3"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
