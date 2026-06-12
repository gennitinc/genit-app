"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiResponse } from "@/utils/apiResponse";
import { 
  Loader2, Plus, Edit2, Trash2, FileText, CheckCircle2, XCircle, 
  Eye, RefreshCw
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Author {
  name: string;
  avatar: string;
  title?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: Author;
  publishedAt: string;
  readTime: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
}

const CATEGORY_OPTIONS = [
  "Stories",
  "Announcements",
  "Changelog",
  "Inside Genit",
  "Marketing hacks",
  "Reports",
  "Tutorials",
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await apiResponse.get("/blog?adminView=true");
      if (res.data && res.data.posts) {
        setPosts(res.data.posts);
      }
    } catch (err: any) {
      console.error("Failed to load admin blog posts", err);
      toast.error("Error loading blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleToggleActive = async (post: BlogPost) => {
    try {
      const updatedActive = !post.isActive;
      const res = await apiResponse.put(`/blog/${post._id}`, {
        isActive: updatedActive,
      });
      if (res.data && res.data.post) {
        setPosts(posts.map(p => p._id === post._id ? { ...p, isActive: updatedActive } : p));
        toast.success(updatedActive ? "Post published successfully" : "Post reverted to draft");
      }
    } catch (err: any) {
      toast.error("Failed to update post status");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await apiResponse.delete(`/blog/${id}`);
      setPosts(posts.filter(p => p._id !== id));
      toast.success("Blog post deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete blog post");
    }
  };

  const triggerSeed = async () => {
    if (!confirm("This will reset all blog articles to initial seeded data. Continue?")) return;
    try {
      await apiResponse.post("/blog/seed");
      toast.success("Articles seeded successfully");
      fetchPosts();
    } catch {
      toast.error("Failed to seed articles");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-cyan-500" /> Blog Management
          </h1>
          <p className="text-sm text-zinc-400">
            Create, moderate, and publish articles across the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={triggerSeed}
            className="inline-flex items-center gap-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-300 text-xs font-semibold px-4 py-2 rounded-xl transition duration-200 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Seed Defaults
          </button>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition duration-200 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Article
          </Link>
        </div>
      </div>

      {/* Main Panel table list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
          <FileText className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-white font-medium">No posts found</h3>
          <p className="text-xs text-zinc-500 mt-1">Get started by creating your first article above.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-medium">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Read Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-zinc-800/20 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white line-clamp-1">{post.title}</div>
                          <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1">/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{post.readTime}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(post)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition duration-150 ${
                          post.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {post.isActive ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition duration-150"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/blog/edit/${post._id}`}
                          className="p-2 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800 rounded-xl transition duration-150 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-xl transition duration-150 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
