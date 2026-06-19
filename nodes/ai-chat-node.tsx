"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiResponse } from "@/utils/apiResponse";
import { Maximize2, Minimize2, Send, X } from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import { useCallback, useState } from "react";

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
        { withCredentials: true }
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
    [handleSendMessage]
  );

  return (
    <div
      className={`bg-background rounded-[1.5rem] border-2 shadow-lg transition-all duration-200 ${
        isMaximized ? "fixed inset-4 z-50" : "h-full w-full"
      } ${selected ? "ring-primary ring-2 ring-offset-2" : ""}`}
      style={{ minWidth: "300px", minHeight: "250px" }}
    >
      <Handle
        type='target'
        position={Position.Left}
        isConnectable={isConnectable}
        className='border-background h-3 w-3 border-2 bg-blue-500'
      />
      <Handle
        type='source'
        position={Position.Right}
        isConnectable={isConnectable}
        className='border-background h-3 w-3 border-2 bg-green-500'
      />

      {/* Remove Button */}
      {data.onRemoveNode && data.nodeId && (
        <button
          onClick={() => data.onRemoveNode!(data.nodeId!)}
          className='absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg transition-colors duration-200 hover:bg-red-600'
          title='Remove node'
        >
          <X className='h-3 w-3' />
        </button>
      )}

      {/* Header */}
      <div className='border-border bg-muted/50 flex items-center justify-between rounded-t-lg border-b p-3'>
        <div className='flex items-center space-x-2'>
          <div className='h-3 w-3 rounded-full bg-green-500'></div>
          <h3 className='text-foreground text-sm font-semibold'>{title}</h3>
        </div>
        <div className='flex items-center space-x-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsMaximized(!isMaximized)}
            className='hover:bg-muted h-6 w-6 p-0'
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 className='h-3 w-3' />
            ) : (
              <Maximize2 className='h-3 w-3' />
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-hidden p-3'>
        <ScrollArea className='h-48 w-full'>
          <div className='space-y-3'>
            {messages.length === 0 && !isTyping ? (
              <div className='text-muted-foreground py-8 text-center text-sm'>
                <div className='bg-muted mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full'>
                  <Send className='h-4 w-4' />
                </div>
                <p>Start a conversation with AI</p>
                <p className='text-xs'>Type your message below</p>
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
                          ? "bg-indigo-600 hover:bg-indigo-700 text-primary-foreground rounded-tr-none"
                          : "bg-muted text-foreground border-border/50 rounded-tl-none border"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className='flex justify-start'>
                    <div className='bg-muted text-foreground border-border/50 rounded-2xl rounded-tl-none border px-4 py-2 text-sm shadow-sm'>
                      <div className='flex h-4 items-center space-x-1'>
                        <div
                          className='bg-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full'
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className='bg-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full'
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className='bg-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full'
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
      <div className='border-border border-t p-3'>
        <div className='flex space-x-2'>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Type your message...'
            className='flex-1 text-sm'
          />
          <Button
            onClick={handleSendMessage}
            size='sm'
            className='px-3'
            disabled={!message.trim()}
          >
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
