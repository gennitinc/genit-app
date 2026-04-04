"use client";

import { useState, useCallback } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Send, Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiResponse } from "@/utils/apiResponse";

interface AIChatNodeData {
  title?: string;
  messages?: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  onRemoveNode?: (nodeId: string) => void;
  onAIAction?: (nodeId: string, actions: any[]) => void;
  nodeId?: string;
  projectId?: string;
}

export function AIChatNode({
  data,
  isConnectable,
  selected,
}: NodeProps<AIChatNodeData>) {
  const [message, setMessage] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { title = "AI Chat Assistant", messages: initialMessages = [] } = data;
  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !data.nodeId || !data.projectId) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await apiResponse.post(
        "/apps/workflow/ai/process",
        {
          projectId: data.projectId,
          nodeId: data.nodeId,
          prompt: message,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        const { text, actions } = res.data.data;

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: text || "Processing your request...",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (actions && actions.length > 0 && data.onAIAction) {
          data.onAIAction(data.nodeId, actions);
        }
      }
    } catch (error) {
      console.error("Failed to process AI request:", error);
    } finally {
      setIsTyping(false);
    }
  }, [message, data.nodeId, data.projectId, data.onAIAction]);

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
      className={`bg-background border-2 rounded-[1.5rem] shadow-lg transition-all duration-200 ${
        isMaximized ? "fixed inset-4 z-50" : "w-full h-full"
      } ${selected ? "ring-2 ring-primary ring-offset-2" : ""}`}
      style={{ minWidth: "300px", minHeight: "250px" }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500 border-2 border-background"
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
      <div className="flex-1 p-3 overflow-hidden">
        <ScrollArea className="h-48 w-full">
          <div className="space-y-3">
            {messages.length === 0 && !isTyping ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send className="w-4 h-4" />
                </div>
                <p>Start a conversation with AI</p>
                <p className="text-xs">Type your message below</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted text-foreground rounded-tl-none border border-border/50"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground rounded-2xl rounded-tl-none px-4 py-2 text-sm border border-border/50 shadow-sm">
                      <div className="flex space-x-1 items-center h-4">
                        <div
                          className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
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
