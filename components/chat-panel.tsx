"use client";

import { LocalizedText } from "@/components/localized-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, MessageSquare, Plus, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatPanelProps {
  workflowContext: string[];
  currentChat: string | null;
  onChatChange: (chatId: string | null) => void;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const previousChats = [
  {
    id: "chat-1",
    title: "Breathing Techniques",
    lastMessage: "How to practice box breathing?",
  },
  {
    id: "chat-2",
    title: "Stress Management",
    lastMessage: "What are the benefits of deep breathing?",
  },
];

const sampleMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    text: "Dr. Jo demonstrates two simple breathing techniques to relieve stress and anxiety.\n\nThe first technique is called box breathing or square breathing, used by the military to relax before stressful situations.\n\nBox breathing involves inhaling for four seconds, holding the breath for four seconds, exhaling for four seconds.",
    timestamp: new Date(),
  },
];

export function ChatPanel({
  workflowContext,
  currentChat,
  onChatChange,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        text: "Based on the breathing exercises in your workflow, I can help you understand the techniques better. The box breathing method is particularly effective for stress relief.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSummarize = () => {
    const summaryMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      text: "**Summary:** The workflow demonstrates breathing techniques for stress relief, focusing on box breathing (4-4-4-4 pattern) and deep breathing exercises. These methods are scientifically proven to activate the parasympathetic nervous system and reduce anxiety.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, summaryMessage]);
  };

  const handleGetInsights = () => {
    const insightMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      text: "**Key Insights:**\n• Box breathing is used by military for stress management\n• 4-second intervals optimize nervous system response\n• Regular practice improves stress resilience\n• Can be done anywhere without equipment",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, insightMessage]);
  };

  return (
    <div className='flex w-96 flex-col border-l border-gray-200 bg-white'>
      {/* Header */}
      <div className='border-b border-gray-200 p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='font-semibold text-gray-900'>
            <LocalizedText text={"AI Assistant"} />
          </h3>
          <Button size='sm' variant='outline'>
            <Plus className='mr-1 h-4 w-4' />
            <LocalizedText text={"New Chat"} />
          </Button>
        </div>

        {/* Previous Chats */}
        <div className='space-y-2'>
          <p className='mb-2 text-sm text-gray-600'>
            <LocalizedText text={"Previous Chats"} />
          </p>
          {previousChats.map((chat) => (
            <div
              key={chat.id}
              className='cursor-pointer rounded-lg border border-gray-200 p-2 hover:bg-gray-50'
              onClick={() => onChatChange(chat.id)}
            >
              <div className='flex items-center gap-2'>
                <MessageSquare className='h-4 w-4 text-gray-400' />
                <span className='text-sm font-medium text-gray-900'>
                  {chat.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Chat */}
      <div className='flex flex-1 flex-col'>
        {/* Chat Header */}
        <div className='border-b border-gray-200 p-4'>
          <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-purple-500'>
              <span className='text-xs font-bold text-white'>
                <LocalizedText text={"P"} />
              </span>
            </div>
            <span className='font-medium text-gray-900'>
              <LocalizedText text={"Poppy"} />
            </span>
            <Badge variant='secondary' className='text-xs'>
              <LocalizedText text={"AI Assistant"} />
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className='flex-1 p-4'>
          <div className='space-y-4'>
            <div className='text-center'>
              <p className='mb-2 text-sm text-gray-600'>
                <LocalizedText text={"Summarize:"} />
              </p>
              <div className='flex justify-center gap-2'>
                <Button size='sm' variant='outline' onClick={handleSummarize}>
                  <LocalizedText text={"Summarize"} />
                </Button>
                <Button size='sm' variant='outline' onClick={handleGetInsights}>
                  <LocalizedText text={"Get Key Insights"} />
                </Button>
              </div>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "assistant" && (
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500'>
                    <Bot className='h-4 w-4 text-white' />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className='text-sm whitespace-pre-wrap'>{message.text}</p>
                </div>
                {message.type === "user" && (
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-400'>
                    <User className='h-4 w-4 text-white' />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className='flex gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-500'>
                  <Bot className='h-4 w-4 text-white' />
                </div>
                <div className='rounded-lg bg-gray-100 p-3'>
                  <div className='flex gap-1'>
                    <div className='h-2 w-2 animate-bounce rounded-full bg-gray-400'></div>
                    <div
                      className='h-2 w-2 animate-bounce rounded-full bg-gray-400'
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className='h-2 w-2 animate-bounce rounded-full bg-gray-400'
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className='border-t border-gray-200 p-4'>
          <div className='flex gap-2'>
            <Input
              placeholder='Type your message...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className='flex-1'
            />
            <Button onClick={handleSendMessage} size='sm'>
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
