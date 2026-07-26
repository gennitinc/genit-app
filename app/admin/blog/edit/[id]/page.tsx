"use client";

import { MediaPicker } from "@/components/admin/MediaPicker";
import { NotionEditor } from "@/components/admin/NotionEditor";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { ArrowLeft, Loader2, RefreshCw, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { use, useEffect, useState } from "react";

const CATEGORY_OPTIONS = [
  "Stories",
  "Announcements",
  "Changelog",
  "Inside Genit",
  "Marketing hacks",
  "Reports",
  "Tutorials",
];

const calculateReadTime = (htmlContent: string): string => {
  if (!htmlContent) return "1 min read";
  const text = htmlContent.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(true); // default true for existing post to prevent auto-overwriting loaded slug

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Stories");
  const [readTime, setReadTime] = useState("5 min read");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [publisherType, setPublisherType] = useState<"Platform" | "Author">(
    "Platform"
  );

  // Automatically update readTime based on article content length
  useEffect(() => {
    setReadTime(calculateReadTime(content));
  }, [content]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true);
      try {
        const res = await apiResponse.get(`/blog/id/${id}`);
        if (res.data && res.data.post) {
          const post = res.data.post;
          setTitle(post.title);
          setSlug(post.slug);
          setExcerpt(post.excerpt);
          setContent(post.content);
          setCoverImage(post.coverImage);
          setCategory(post.category);
          setReadTime(post.readTime);
          setIsActive(post.isActive);
          setIsFeatured(post.isFeatured);
          setTagsInput(post.tags?.join(", ") || "");
          setPublisherType(post.publisherType || "Platform");
        }
      } catch (err: any) {
        console.error("Failed to load blog post details", err);
        toast.error("Error loading blog post details");
        router.push("/admin/blog");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!title || !excerpt || !content || !coverImage || !readTime) {
      toast.error(
        "Please fill in all required fields (including Cover Photo and Excerpt)"
      );
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title,
      slug: slug || undefined,
      excerpt,
      content,
      coverImage,
      category,
      readTime,
      isActive,
      isFeatured,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      publisherType,
    };

    try {
      const res = await apiResponse.put(`/blog/${id}`, payload);
      if (res.data && res.data.post) {
        toast.success("Blog post updated successfully");
        setIsModalOpen(false);
        router.push("/admin/blog");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-[60vh] flex-col items-center justify-center gap-4'>
        <LoadingFileLoader size={16} />
        <p className='text-sm text-zinc-500'>Loading article details...</p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      {/* Navigation / Header */}
      <div className='flex items-center justify-between pb-4'>
        <div className='flex items-center gap-3'>
          <Link
            href='/admin/blog'
            className='cursor-pointer rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white'
          >
            <ArrowLeft className='h-5 w-5' />
          </Link>
          <div>
            <h1 className='text-xl font-bold text-white'>Edit Blog Article</h1>
            <p className='mt-0.5 text-xs text-zinc-400'>
              Modify article layout content and settings
            </p>
          </div>
        </div>
        <button
          type='button'
          onClick={handleSubmit}
          className='hover:shadow-primary/20 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white transition duration-200 hover:bg-indigo-700 hover:shadow-lg'
        >
          Save Changes <Save className='h-3.5 w-3.5' />
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='space-y-6'>
          {/* Title input */}
          <div className='space-y-2'>
            <label className='text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
              Article Title *
            </label>
            <input
              type='text'
              required
              value={title}
              onChange={(e) => {
                const val = e.target.value;
                setTitle(val);
                if (!isSlugEdited) {
                  setSlug(slugify(val));
                }
              }}
              className='w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none'
              placeholder='e.g. How Genit uses AI in marketing'
            />
          </div>

          {/* Custom Rich Text Editor */}
          <div className='flex flex-col space-y-2'>
            <label className='text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
              Content Body *
            </label>
            <NotionEditor value={content} onChange={setContent} />
          </div>
        </div>
      </form>

      {/* Finalize Edit Dialog Overlay */}
      {isModalOpen && (
        <div className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200'>
          <div className='animate-in zoom-in-95 max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-2xl duration-200'>
            {/* Modal Header */}
            <div className='flex items-center justify-between pb-3'>
              <div>
                <h3 className='text-lg font-bold text-white'>
                  Finalize Changes
                </h3>
                <p className='mt-0.5 text-xs font-medium text-zinc-400'>
                  Verify publication settings before saving
                </p>
              </div>
              <button
                type='button'
                onClick={() => setIsModalOpen(false)}
                className='rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-900 hover:text-white'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Modal Content Form */}
            <div className='space-y-4'>
              {/* Cover Photo */}
              <div className='space-y-2'>
                <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                  Cover Photo *
                </label>

                <MediaPicker
                  value={coverImage}
                  onChange={setCoverImage}
                  onUploadingChange={setIsUploading}
                />
              </div>

              {/* Excerpt */}
              <div className='space-y-2'>
                <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                  Excerpt *
                </label>
                <textarea
                  required
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className='w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                  placeholder='A brief summary for cards and search results...'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {/* Category Option */}
                <div className='space-y-2'>
                  <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div className='space-y-2'>
                  <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    Read Time (Auto-calculated)
                  </label>
                  <input
                    type='text'
                    required
                    readOnly
                    value={readTime}
                    className='w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-400 transition focus:outline-none'
                    placeholder='1 min read'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {/* Slug Override */}
                <div className='space-y-2'>
                  <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    Slug Override
                  </label>
                  <input
                    type='text'
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsSlugEdited(true);
                    }}
                    className='w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                    placeholder='custom-url-slug'
                  />
                </div>

                {/* Publisher Type */}
                <div className='space-y-2'>
                  <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    Published By *
                  </label>
                  <select
                    value={publisherType}
                    onChange={(e) =>
                      setPublisherType(e.target.value as "Platform" | "Author")
                    }
                    className='w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                  >
                    <option value='Platform'>Platform (Genit Official)</option>
                    <option value='Author'>Author (Your Admin Profile)</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className='space-y-2'>
                <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                  Tags (Comma separated)
                </label>
                <input
                  type='text'
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className='w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                  placeholder='e.g. AI, marketing, SaaS'
                />
              </div>

              {/* Checkboxes */}
              <div className='flex items-center gap-6 pt-2'>
                <label className='flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-300 select-none'>
                  <input
                    type='checkbox'
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className='rounded border-zinc-800 bg-zinc-900 text-cyan-500 focus:ring-cyan-500'
                  />
                  Publish status (Active)
                </label>

                <label className='flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-300 select-none'>
                  <input
                    type='checkbox'
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className='rounded border-zinc-800 bg-zinc-900 text-cyan-500 focus:ring-cyan-500'
                  />
                  Featured Article
                </label>
              </div>
            </div>

            {/* Modal Footer / Save Actions */}
            <div className='flex gap-3 border-t border-zinc-800 pt-4'>
              <button
                type='button'
                onClick={() => setIsModalOpen(false)}
                className='inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 py-2.5 text-xs font-semibold text-zinc-400 transition hover:border-zinc-700 hover:text-white'
              >
                Back to Editor
              </button>
              <button
                type='button'
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className='hover:shadow-primary/20 inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white transition duration-200 hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50'
              >
                {isSubmitting ? (
                  <>
                    <LoadingFileLoader size={16} />
                  </>
                ) : (
                  <>
                    <Save className='h-3.5 w-3.5' /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
