"use client";

import { useUserContext } from "@/context/AuthenticatedContext";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import {
  CornerDownRight,
  Edit2,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Socket, io } from "socket.io-client";
import React, { useEffect, useState } from "react";

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

    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        transports: ["websocket", "polling"],
      }
    );

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
      await apiResponse.put(`/blog/comments/${commentId}`, {
        content: editContent.trim(),
      });
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
    const isOwner = user && user._id === comment.userId?._id;
    const isAdmin = user && user.role === "admin";
    const canManage = isOwner || isAdmin;

    return (
      <div
        key={comment._id}
        className={`flex gap-4 ${depth > 0 ? "mt-4" : "mt-6"}`}
      >
        <div className='shrink-0'>
          <Image
            src={
              comment.userId?.userdp ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
            }
            alt={comment.userId?.username || "User"}
            width={40}
            height={40}
            className='size-10 rounded-full object-cover'
          />
        </div>
        <div className='flex-1'>
          <div className='relative rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800/60 dark:bg-zinc-900'>
            <div className='mb-2 flex items-start justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-semibold text-black dark:text-white'>
                  {comment.userId?.firstName ||
                    comment.userId?.username ||
                    "User"}
                </span>
                <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                {comment.isEdited && (
                  <span className='rounded-md bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'>
                    Edited
                  </span>
                )}
              </div>

              {canManage && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className='text-zinc-400 transition-colors hover:text-black dark:hover:text-white'>
                      <MoreVertical className='h-4 w-4' />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align='end'
                      className='animate-in fade-in zoom-in-95 z-50 min-w-[120px] rounded-xl border border-zinc-200 bg-white p-1 shadow-lg shadow-black/5 dark:border-zinc-800 dark:bg-zinc-900'
                    >
                      {isOwner && (
                        <DropdownMenu.Item
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditContent(comment.content);
                          }}
                          className='flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-700 outline-none hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                        >
                          <Edit2 className='h-3.5 w-3.5' /> Edit
                        </DropdownMenu.Item>
                      )}
                      <DropdownMenu.Item
                        onClick={() => handleDeleteComment(comment._id)}
                        className='flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30'
                      >
                        <Trash2 className='h-3.5 w-3.5' /> Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}
            </div>

            {editingId === comment._id ? (
              <div className='mt-2'>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className='w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm focus:border-cyan-500 focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white'
                  rows={3}
                />
                <div className='mt-2 flex justify-end gap-2'>
                  <button
                    onClick={() => setEditingId(null)}
                    className='px-3 py-1.5 text-xs text-zinc-500 hover:text-black dark:hover:text-white'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    disabled={isSubmitting || !editContent.trim()}
                    className='rounded-lg bg-cyan-500 px-3 py-1.5 text-xs text-white hover:bg-cyan-600 disabled:opacity-50'
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className='text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300'>
                {comment.content}
              </p>
            )}
          </div>

          <div className='mt-2 flex items-center gap-4 pl-2'>
            <button
              onClick={() => {
                if (!user) {
                  router.push(
                    `/signin?redirect=${encodeURIComponent(pathname)}`
                  );
                  return;
                }
                setReplyingTo(replyingTo === comment._id ? null : comment._id);
                setReplyContent("");
              }}
              className='flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-cyan-500'
            >
              <CornerDownRight className='h-3.5 w-3.5' />
              Reply
            </button>
          </div>

          {replyingTo === comment._id && (
            <div className='mt-4 flex gap-3'>
              <div className='flex-1'>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder='Write a reply...'
                  className='w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm focus:border-cyan-500 focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white'
                  rows={2}
                />
                <div className='mt-2 flex justify-end gap-2'>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className='px-3 py-1.5 text-xs text-zinc-500 hover:text-black dark:hover:text-white'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePostComment(comment._id)}
                    disabled={isSubmitting || !replyContent.trim()}
                    className='rounded-lg bg-cyan-500 px-4 py-1.5 text-xs text-white hover:bg-cyan-600 disabled:opacity-50'
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Render Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className='mt-4 border-l-2 border-zinc-100 pl-4 dark:border-zinc-800/60'>
              {comment.replies.map((reply) => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='mt-4 w-full max-w-3xl lg:mt-12'>
      <h3 className='mb-8 text-2xl font-bold text-black dark:text-white'>
        Comments
      </h3>

      {/* Main Comment Input */}
      <div className='mb-10 flex gap-4'>
        <div className='shrink-0'>
          <div className='flex size-10 items-center justify-center overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800'>
            {user ? (
              <Image
                src={
                  user.userdp ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                }
                alt={user.username || "User"}
                width={40}
                height={40}
                className='size-10 object-cover'
              />
            ) : (
              <div className='h-full w-full bg-zinc-200 dark:bg-zinc-800' />
            )}
          </div>
        </div>
        <div className='flex-1'>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              user
                ? "Add to the discussion..."
                : "Sign in to join the discussion..."
            }
            onClick={() => {
              if (!user)
                router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
            }}
            className='w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm transition-colors focus:border-cyan-500 focus:bg-white focus:outline-none dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-black'
            rows={3}
          />
          <div className='mt-3 flex justify-end'>
            <button
              onClick={() => handlePostComment()}
              disabled={isSubmitting || !newComment.trim() || !user}
              className='flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-600 disabled:opacity-50'
            >
              {isSubmitting && <LoadingFileLoader size={20} />}
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className='flex justify-center py-12'>
          <LoadingFileLoader size={20} />
        </div>
      ) : comments.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-800'>
          <p className='text-zinc-500 dark:text-zinc-400'>
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
