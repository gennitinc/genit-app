"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, RefreshCw, Upload, X } from "lucide-react";
import { NotionEditor } from "@/components/admin/NotionEditor";
import { apiResponse } from "@/utils/apiResponse";
import { toast } from "sonner";
import Image from "next/image";

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
  const [isUploading, setIsUploading] = useState(false);
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
  const [publisherType, setPublisherType] = useState<"Platform" | "Author">("Platform");

  // Automatically update readTime based on article content length
  useEffect(() => {
    setReadTime(calculateReadTime(content));
  }, [content]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiResponse.post("/blog/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data && res.data.url) {
        setCoverImage(res.data.url);
        toast.success("Cover image uploaded successfully");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload cover image");
    } finally {
      setIsUploading(false);
    }
  };

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
      toast.error("Please fill in all required fields (including Cover Photo and Excerpt)");
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
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
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
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        <p className="text-zinc-500 text-sm">Loading article details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation / Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Edit Blog Article</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Modify article layout content and settings
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {/* Title input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                const val = e.target.value;
                setTitle(val);
                if (!isSlugEdited) {
                  setSlug(slugify(val));
                }
              }}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-base focus:outline-none focus:border-cyan-500 transition focus:ring-1 focus:ring-cyan-500/20"
              placeholder="e.g. How Gennit uses AI in marketing"
            />
          </div>

          {/* Custom Rich Text Editor */}
          <div className="space-y-2 flex flex-col">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Content Body *
            </label>
            <NotionEditor value={content} onChange={setContent} />
          </div>

          {/* Save Trigger Button */}
          <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between gap-4">
            <Link
              href="/admin/blog"
              className="inline-flex items-center justify-center border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition duration-200 cursor-pointer"
            >
              Save Changes <Save className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Finalize Edit Dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Finalize Changes</h3>
                <p className="text-xs text-zinc-400 mt-0.5 font-medium">Verify publication settings before saving</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content Form */}
            <div className="space-y-4">
              {/* Cover Photo */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Cover Photo *
                </label>
                
                <div className="relative group border border-zinc-850 rounded-xl overflow-hidden bg-zinc-900/20 aspect-video flex flex-col items-center justify-center transition hover:border-zinc-700">
                  {coverImage ? (
                    <>
                      <Image
                        src={coverImage}
                        alt="Cover Preview"
                        fill
                        className="object-cover group-hover:scale-102 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                        <label className="cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-zinc-750 px-3.5 py-1.5 rounded-xl text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-lg">
                          <Upload className="h-3.5 w-3.5 text-cyan-400" />
                          Replace Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-center h-full w-full">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin text-cyan-400 mb-2" />
                          <span className="text-zinc-400 text-xs font-medium">Uploading cover...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-zinc-500 group-hover:text-cyan-400 transition mb-2" />
                          <span className="text-white text-xs font-semibold">Upload cover photo</span>
                          <span className="text-zinc-500 text-[10px] mt-1">PNG, JPG, WEBP up to 5MB</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  )}
                  {isUploading && coverImage && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Excerpt *
                </label>
                <textarea
                  required
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 transition resize-none"
                  placeholder="A brief summary for cards and search results..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category Option */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 transition"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Read Time (Auto-calculated)
                  </label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={readTime}
                    className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-400 text-xs cursor-not-allowed focus:outline-none transition"
                    placeholder="1 min read"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Slug Override */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Slug Override
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsSlugEdited(true);
                    }}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 transition"
                    placeholder="custom-url-slug"
                  />
                </div>

                {/* Publisher Type */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Published By *
                  </label>
                  <select
                    value={publisherType}
                    onChange={(e) => setPublisherType(e.target.value as "Platform" | "Author")}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="Platform">Platform (Gennit Official)</option>
                    <option value="Author">Author (Your Admin Profile)</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 transition"
                  placeholder="e.g. AI, marketing, SaaS"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-zinc-800 text-cyan-500 focus:ring-cyan-500 bg-zinc-900"
                  />
                  Publish status (Active)
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-zinc-800 text-cyan-500 focus:ring-cyan-500 bg-zinc-900"
                  />
                  Featured Article
                </label>
              </div>
            </div>

            {/* Modal Footer / Save Actions */}
            <div className="pt-4 border-t border-zinc-800 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 inline-flex items-center justify-center border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-400 hover:text-white text-xs font-semibold py-2.5 rounded-xl transition cursor-pointer"
              >
                Back to Editor
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold py-2.5 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition duration-200 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" /> Save Changes
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
