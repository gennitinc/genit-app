"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter, usePathname } from "next/navigation";
import { apiResponse } from "@/utils/apiResponse";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MoreVertical, Edit2, Trash2, CornerDownRight } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Socket, io } from "socket.io-client";

interface UserInfo {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  userdp: string;
}

export interface BlogCommentType {
  _id: string;
  blogPostId: string;
  userId: UserInfo;
  parentId?: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: BlogCommentType[];
}

interface BlogCommentsProps {
  postId: string;
}

export function BlogComments({ postId }: BlogCommentsProps) {
  const { user } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  const [comments, setComments] = useState<BlogCommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For replies and editing
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = async () => {
    try {
      const res = await apiResponse.get(`/blog/${postId}/comments`);
      if (res.data && res.data.comments) {
        setComments(buildCommentTree(res.data.comments));
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    socket.emit("join-blog", postId);

    socket.on("blog:comments", () => {
      fetchComments();
    });

    return () => {
      socket.emit("leave-blog", postId);
      socket.disconnect();
    };
  }, [postId]);

  const buildCommentTree = (flatComments: any[]) => {
    const map = new Map<string, BlogCommentType>();
    const roots: BlogCommentType[] = [];

    flatComments.forEach((c) => {
      map.set(c._id, { ...c, replies: [] });
    });

    flatComments.forEach((c) => {
      const node = map.get(c._id);
      if (!node) return;

      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.replies!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const handlePostComment = async (parentId?: string) => {
    if (!user) {
      router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await apiResponse.post(`/blog/${postId}/comments`, {
        content: content.trim(),
        parentId,
      });
      if (res.data && res.data.comment) {
        if (parentId) {
          setReplyingTo(null);
          setReplyContent("");
        } else {
          setNewComment("");
        }
        await fetchComments(); // Re-fetch to reconstruct tree
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    setIsSubmitting(true);
    try {
      await apiResponse.put(`/blog/comments/${commentId}`, { content: editContent.trim() });
      setEditingId(null);
      setEditContent("");
      await fetchComments();
    } catch (err) {
      console.error("Failed to edit comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await apiResponse.delete(`/blog/comments/${commentId}`);
      await fetchComments();
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const renderComment = (comment: BlogCommentType, depth = 0) => {
    const isOwner = user && (user._id === comment.userId?._id);
    const isAdmin = user && user.role === "admin";
    const canManage = isOwner || isAdmin;

    return (
      <div key={comment._id} className={`flex gap-4 ${depth > 0 ? "mt-4" : "mt-6"}`}>
        <div className="shrink-0">
          <Image
            src={comment.userId?.userdp || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"}
            alt={comment.userId?.username || "User"}
            width={40}
            height={40}
            className="rounded-full size-10 object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800/60 relative">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black dark:text-white text-sm">
                  {comment.userId?.firstName || comment.userId?.username || "User"}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.isEdited && (
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
                    Edited
                  </span>
                )}
              </div>

              {canManage && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      className="min-w-[120px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 shadow-lg shadow-black/5 z-50 animate-in fade-in zoom-in-95"
                    >
                      {isOwner && (
                        <DropdownMenu.Item
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditContent(comment.content);
                          }}
                          className="flex items-center gap-2 px-2 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer outline-none"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </DropdownMenu.Item>
                      )}
                      <DropdownMenu.Item
                        onClick={() => handleDeleteComment(comment._id)}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer outline-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}
            </div>

            {editingId === comment._id ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500 dark:text-white resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs px-3 py-1.5 text-zinc-500 hover:text-black dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    disabled={isSubmitting || !editContent.trim()}
                    className="text-xs px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center gap-4 pl-2">
            <button
              onClick={() => {
                if (!user) {
                  router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
                  return;
                }
                setReplyingTo(replyingTo === comment._id ? null : comment._id);
                setReplyContent("");
              }}
              className="text-xs font-medium text-zinc-500 hover:text-cyan-500 transition-colors flex items-center gap-1"
            >
              <CornerDownRight className="w-3.5 h-3.5" />
              Reply
            </button>
          </div>

          {replyingTo === comment._id && (
            <div className="mt-4 flex gap-3">
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500 dark:text-white resize-none"
                  rows={2}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-xs px-3 py-1.5 text-zinc-500 hover:text-black dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePostComment(comment._id)}
                    disabled={isSubmitting || !replyContent.trim()}
                    className="text-xs px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Render Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-zinc-100 dark:border-zinc-800/60">
              {comment.replies.map((reply) => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 lg:mt-12 w-full max-w-3xl">
      <h3 className="text-2xl font-bold text-black dark:text-white mb-8">Comments</h3>

      {/* Main Comment Input */}
      <div className="flex gap-4 mb-10">
        <div className="shrink-0">
          <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
            {user ? (
              <Image
                src={user.userdp || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"}
                alt={user.username || "User"}
                width={40}
                height={40}
                className="object-cover size-10"
              />
            ) : (
              <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Add to the discussion..." : "Sign in to join the discussion..."}
            onClick={() => {
              if (!user) router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
            }}
            className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-black dark:text-white resize-none transition-colors"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={() => handlePostComment()}
              disabled={isSubmitting || !newComment.trim() || !user}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 dark:text-zinc-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
