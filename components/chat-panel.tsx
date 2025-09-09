"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Plus, MessageSquare, User, Bot } from "lucide-react"

interface ChatPanelProps {
  workflowContext: string[]
  currentChat: string | null
  onChatChange: (chatId: string | null) => void
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

const previousChats = [
  { id: "chat-1", title: "Breathing Techniques", lastMessage: "How to practice box breathing?" },
  { id: "chat-2", title: "Stress Management", lastMessage: "What are the benefits of deep breathing?" },
]

const sampleMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content:
      "Dr. Jo demonstrates two simple breathing techniques to relieve stress and anxiety.\n\nThe first technique is called box breathing or square breathing, used by the military to relax before stressful situations.\n\nBox breathing involves inhaling for four seconds, holding the breath for four seconds, exhaling for four seconds.",
    timestamp: new Date(),
  },
]

export function ChatPanel({ workflowContext, currentChat, onChatChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Based on the breathing exercises in your workflow, I can help you understand the techniques better. The box breathing method is particularly effective for stress relief.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSummarize = () => {
    const summaryMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content:
        "**Summary:** The workflow demonstrates breathing techniques for stress relief, focusing on box breathing (4-4-4-4 pattern) and deep breathing exercises. These methods are scientifically proven to activate the parasympathetic nervous system and reduce anxiety.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, summaryMessage])
  }

  const handleGetInsights = () => {
    const insightMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content:
        "**Key Insights:**\n• Box breathing is used by military for stress management\n• 4-second intervals optimize nervous system response\n• Regular practice improves stress resilience\n• Can be done anywhere without equipment",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, insightMessage])
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            New Chat
          </Button>
        </div>

        {/* Previous Chats */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-2">Previous Chats</p>
          {previousChats.map((chat) => (
            <div
              key={chat.id}
              className="p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => onChatChange(chat.id)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{chat.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="font-medium text-gray-900">Poppy</span>
            <Badge variant="secondary" className="text-xs">
              AI Assistant
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Summarize:</p>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={handleSummarize}>
                  Summarize
                </Button>
                <Button size="sm" variant="outline" onClick={handleGetInsights}>
                  Get Key Insights
                </Button>
              </div>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "assistant" && (
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.type === "user" && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
