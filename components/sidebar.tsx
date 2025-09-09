"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play } from "lucide-react";

interface SidebarProps {
  selectedItems: string[];
  onItemSelect: (items: string[]) => void;
}

const knowledgeItems = [
  {
    id: "stress-relief",
    title: "Relieve Stress & Anxiety with Simple...",
    type: "video",
    thumbnail: "/stress-relief-video-thumbnail.png",
    duration: "8:42",
  },
  {
    id: "breathing-exercises",
    title: "Breathing Exercises for Anxiety - Bre...",
    type: "video",
    thumbnail: "/breathing-exercises-video-thumbnail.png",
    duration: "12:15",
  },
  {
    id: "neuroscience-take",
    title: "#107 Dr Mark Allen | Neuroscience TAKE",
    type: "article",
    thumbnail: "/neuroscience-article-thumbnail.png",
    readTime: "15 min",
  },
];

export function Sidebar({ selectedItems, onItemSelect }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onItemSelect(selectedItems.filter((id) => id !== itemId));
    } else {
      onItemSelect([...selectedItems, itemId]);
    }
  };

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🧠</span>
            </div>
            <span className="font-semibold text-foreground">Boards</span>
          </div>
          <span className="text-sm text-muted-foreground">Welcome</span>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="text-yellow-600 hover:text-yellow-700"
          >
            ⭐ Affiliate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            📚 Learn
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Knowledge Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {knowledgeItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedItems.includes(item.id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/60"
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex gap-3">
                <div className="relative">
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-12 object-cover rounded-lg bg-muted"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-black/70 rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-white fill-current" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{item.type}</span>
                    <span>•</span>
                    <span>{item.duration || item.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
