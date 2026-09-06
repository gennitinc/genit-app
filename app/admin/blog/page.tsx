"use client";

import { LocalizedText } from "@/components/localized-text";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  CheckCircle2,
  Edit2,
  Eye,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";

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
        setPosts(
          posts.map((p) =>
            p._id === post._id ? { ...p, isActive: updatedActive } : p
          )
        );
        toast.success(
          updatedActive
            ? "Post published successfully"
            : "Post reverted to draft"
        );
      }
    } catch (err: any) {
      toast.error("Failed to update post status");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await apiResponse.delete(`/blog/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
      toast.success("Blog post deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete blog post");
    }
  };

  const triggerSeed = async () => {
    if (
      !confirm(
        "This will reset all blog articles to initial seeded data. Continue?"
      )
    )
      return;
    try {
      await apiResponse.post("/blog/seed");
      toast.success("Articles seeded successfully");
      fetchPosts();
    } catch {
      toast.error("Failed to seed articles");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between pb-4'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight text-white'>
            <FileText className='h-6 w-6 text-cyan-500' />{" "}
            <LocalizedText text={"Blog Management"} />
          </h1>
          <p className='text-sm text-zinc-400'>
            <LocalizedText
              text={
                "Create, moderate, and publish articles across the platform"
              }
            />
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={triggerSeed}
            className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-semibold text-zinc-300 transition duration-200 hover:border-zinc-700'
          >
            <RefreshCw className='h-3.5 w-3.5' />{" "}
            <LocalizedText text={"Seed Defaults"} />
          </button>
          <Link
            href='/admin/blog/new'
            className='hover:shadow-primary/20 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition duration-200 hover:bg-indigo-700 hover:shadow-lg'
          >
            <Plus className='h-4 w-4' /> <LocalizedText text={"Add Article"} />
          </Link>
        </div>
      </div>

      {/* Main Panel table list */}
      {isLoading ? (
        <div className='flex items-center justify-center py-20'>
          <LoadingFileLoader size={20} />
        </div>
      ) : posts.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-zinc-800 py-20 text-center'>
          <FileText className='mx-auto mb-3 h-10 w-10 text-zinc-600' />
          <h3 className='font-medium text-white'>
            <LocalizedText text={"No posts found"} />
          </h3>
          <p className='mt-1 text-xs text-zinc-500'>
            <LocalizedText
              text={"Get started by creating your first article above."}
            />
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/40 shadow-xl'>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse text-left text-sm'>
              <thead>
                <tr className='bg-zinc-900/60 font-medium text-zinc-400'>
                  <th className='px-6 py-4'>
                    <LocalizedText text={"Title"} />
                  </th>
                  <th className='px-6 py-4'>
                    <LocalizedText text={"Category"} />
                  </th>
                  <th className='px-6 py-4'>
                    <LocalizedText text={"Read Time"} />
                  </th>
                  <th className='px-6 py-4'>
                    <LocalizedText text={"Status"} />
                  </th>
                  <th className='px-6 py-4'>
                    <LocalizedText text={"Published Date"} />
                  </th>
                  <th className='px-6 py-4 text-right'>
                    <LocalizedText text={"Actions"} />
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-800/60 text-zinc-300'>
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className='transition duration-150 hover:bg-zinc-800/20'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='relative h-10 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-800'>
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div>
                          <div className='line-clamp-1 font-semibold text-white'>
                            {post.title}
                          </div>
                          <div className='mt-0.5 line-clamp-1 text-xs text-zinc-500'>
                            /{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400'>
                        {post.category}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-zinc-400'>{post.readTime}</td>
                    <td className='px-6 py-4'>
                      <button
                        onClick={() => handleToggleActive(post)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition duration-150 ${
                          post.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {post.isActive ? (
                          <>
                            <CheckCircle2 className='h-3.5 w-3.5' />{" "}
                            <LocalizedText text={"Published"} />
                          </>
                        ) : (
                          <>
                            <XCircle className='h-3.5 w-3.5' />{" "}
                            <LocalizedText text={"Draft"} />
                          </>
                        )}
                      </button>
                    </td>
                    <td className='px-6 py-4 text-zinc-400'>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link
                          href={`/blog/${post.slug}`}
                          target='_blank'
                          className='rounded-xl p-2 text-zinc-400 transition duration-150 hover:bg-zinc-800 hover:text-white'
                          title='Preview'
                        >
                          <Eye className='h-4 w-4' />
                        </Link>
                        <Link
                          href={`/admin/blog/edit/${post._id}`}
                          className='cursor-pointer rounded-xl p-2 text-zinc-400 transition duration-150 hover:bg-zinc-800 hover:text-cyan-400'
                          title='Edit'
                        >
                          <Edit2 className='h-4 w-4' />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className='cursor-pointer rounded-xl p-2 text-zinc-400 transition duration-150 hover:bg-zinc-800 hover:text-rose-400'
                          title='Delete'
                        >
                          <Trash2 className='h-4 w-4' />
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
