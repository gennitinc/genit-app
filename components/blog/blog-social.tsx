"use client";

import { BlogComments } from "./blog-comments";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { apiResponse } from "@/utils/apiResponse";
import { Eye, Heart, MessageSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Socket, io } from "socket.io-client";
import React, { useEffect, useState } from "react";

interface BlogSocialProps {
  postId: string;
  initialViews: number;
  initialLikes: number;
  initialComments: number;
  initialHasLiked: boolean;
  recordView?: boolean;
}

export function BlogSocial({
  postId,
  initialViews,
  initialLikes,
  initialComments,
  initialHasLiked,
  recordView = true,
}: BlogSocialProps) {
  const { user } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [views, setViews] = useState(initialViews);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    // Generate a unique visitor ID for anonymous views if not exists
    let visitorId = localStorage.getItem("gennit_blog_visitor_id");
    if (!visitorId) {
      visitorId =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("gennit_blog_visitor_id", visitorId);
    }

    if (recordView) {
      // Record view
      apiResponse
        .post(`/blog/${postId}/view`, { visitorId })
        .then((res) => {
          // If it was a new view (or we could assume the backend increments it)
          // For simplicity, we just rely on initialViews, but we could optimistic increment if needed.
          // Actually, let's fetch social stats if we want to be highly accurate, or just stick to initial.
        })
        .catch((err) => console.error("Failed to record view:", err));
    }
  }, [postId, recordView]);

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        transports: ["websocket", "polling"],
      }
    );

    socket.emit("join-blog", postId);

    socket.on(
      "blog:stats",
      (data: {
        viewsCount: number;
        likesCount: number;
        commentsCount: number;
      }) => {
        setViews(data.viewsCount);
        setCommentsCount(data.commentsCount);
        setLikes(data.likesCount);
      }
    );

    return () => {
      socket.emit("leave-blog", postId);
      socket.disconnect();
    };
  }, [postId]);

  const toggleLike = async () => {
    if (!user) {
      router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI
    setHasLiked(!hasLiked);
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));

    try {
      const res = await apiResponse.post(`/blog/${postId}/like`);
      if (res.data) {
        setHasLiked(res.data.liked);
        // We could also sync the exact like count if backend returned it,
        // but optimistic is usually fine.
      }
    } catch (err) {
      // Revert on error
      setHasLiked(hasLiked);
      setLikes(initialLikes);
      console.error("Failed to toggle like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const scrollToComments = () => {
    if (isDesktop) {
      const el = document.getElementById("blog-comments-desktop");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className='my-2 flex w-full max-w-3xl items-center gap-6 border-y border-zinc-200 py-4 dark:border-zinc-800/60'>
      <button
        onClick={toggleLike}
        disabled={isLiking}
        className='group flex items-center gap-2 text-zinc-600 transition-colors hover:text-cyan-500 dark:text-zinc-400 dark:hover:text-cyan-400'
      >
        <Heart
          className={`h-5 w-5 transition-transform group-hover:scale-110 ${
            hasLiked ? "fill-cyan-500 text-cyan-500" : ""
          }`}
        />
        <span className='text-sm font-medium'>{likes}</span>
      </button>

      <button
        onClick={scrollToComments}
        className='group flex items-center gap-2 text-zinc-600 transition-colors hover:text-cyan-500 dark:text-zinc-400 dark:hover:text-cyan-400'
      >
        <MessageSquare className='h-5 w-5 transition-transform group-hover:scale-110' />
        <span className='text-sm font-medium'>{commentsCount}</span>
      </button>

      <div className='flex items-center gap-2 text-zinc-600 dark:text-zinc-400'>
        <Eye className='h-5 w-5' />
        <span className='text-sm font-medium'>{views}</span>
      </div>

      {!isDesktop && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className='max-h-[85vh] bg-white dark:bg-zinc-950'>
            <DrawerHeader className='sr-only text-left'>
              <DrawerTitle>Comments</DrawerTitle>
            </DrawerHeader>
            <div className='scrollbar-hide mx-auto w-full max-w-3xl overflow-y-auto px-4 pb-8'>
              <BlogComments postId={postId} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
