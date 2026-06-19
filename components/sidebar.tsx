"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Search } from "lucide-react";
import { useState } from "react";

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
    <div className='bg-background border-border flex w-80 flex-col border-r'>
      {/* Header */}
      <div className='border-border border-b p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-500'>
              <span className='text-sm font-bold text-white'>🧠</span>
            </div>
            <span className='text-foreground font-semibold'>Boards</span>
          </div>
          <span className='text-muted-foreground text-sm'>Welcome</span>
        </div>

        {/* Navigation */}
        <div className='flex gap-4 text-sm'>
          <Button
            variant='ghost'
            size='sm'
            className='text-yellow-600 hover:text-yellow-700'
          >
            ⭐ Affiliate
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-foreground'
          >
            📚 Learn
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className='border-border border-b p-4'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Search knowledge...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Knowledge Items */}
      <div className='flex-1 overflow-y-auto p-4'>
        <div className='space-y-4'>
          {knowledgeItems.map((item) => (
            <div
              key={item.id}
              className={`cursor-pointer rounded-lg border p-3 transition-all ${
                selectedItems.includes(item.id)
                  ? "border-primary bg-indigo-600 hover:bg-indigo-700/5"
                  : "border-border hover:border-border/60"
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <div className='flex gap-3'>
                <div className='relative'>
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    className='bg-muted h-12 w-16 rounded-lg object-cover'
                  />
                  {item.type === "video" && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-black/70'>
                        <Play className='h-3 w-3 fill-current text-white' />
                      </div>
                    </div>
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <h3 className='text-foreground mb-1 line-clamp-2 text-sm font-medium'>
                    {item.title}
                  </h3>
                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                    <span className='capitalize'>{item.type}</span>
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
