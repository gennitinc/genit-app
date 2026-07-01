"use client";

import { MediaPicker } from "@/components/admin/MediaPicker";
import { NotionEditor } from "@/components/admin/NotionEditor";
import { useUserContext } from "@/context/AuthenticatedContext";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  ArrowLeft,
  CircleFadingArrowUp,
  Image as ImageIcon,
  ImageOff,
  Loader2,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";

const CATEGORY_OPTIONS = [
  "Stories",
  "Announcements",
  "Changelog",
  "Inside Genit",
  "Marketing hacks",
  "Reports",
  "Tutorials",
];

const AI_TOPICS = [
  {
    id: "design-automation",
    label: "The Future of Design Automation",
    description:
      "How startups can scale visual production without an in-house designer using Genit's automated brand design tools.",
  },
  {
    id: "ai-video-marketing",
    label: "AI Video Marketing for Bootstrapped SaaS",
    description:
      "Creating professional product demos, promo videos, and brand assets to drive growth on a budget.",
  },
  {
    id: "build-with-url",
    label: "From Figma to Live App in Seconds (Build with URL)",
    description:
      "How Genit's 'Build with URL' ingestion engine allows rapid conversational prototyping of web interfaces.",
  },
  {
    id: "startup-marketing-constraints",
    label: "Solving Startup Marketing Constraints with AI",
    description:
      "Breaking visual content bottlenecks, visual asset fatigue, and developer queues with AI-driven content generation.",
  },
  {
    id: "genit-integrations-guide",
    label: "A Complete Guide to Genit Integrations",
    description:
      "How connecting Genit to X, Facebook, LinkedIn, Google Ads, TikTok, and Brevo automates distribution channels.",
  },
  {
    id: "ai-search-engine-visibility",
    label: "Optimizing Brand Assets for AI Search Visibility",
    description:
      "Designing graphic content and copy so search bots (ChatGPT, Perplexity, Claude) index and recommend your brand.",
  },
];

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

const calculateReadTime = (htmlContent: string): string => {
  if (!htmlContent) return "1 min read";
  const text = htmlContent.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

export default function NewBlogPostPage() {
  const router = useRouter();
  const { user, fetchCurrentUser } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  // AI Generator states
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(AI_TOPICS[0].label);
  const [customInstructions, setCustomInstructions] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Inline body generator states
  const [withAiImage, setWithAiImage] = useState(true);
  const [isGeneratingBody, setIsGeneratingBody] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(""); // default empty or placeholder
  const [category, setCategory] = useState("Stories");
  const [readTime, setReadTime] = useState("1 min read");
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
      const res = await apiResponse.post("/blog", payload);
      if (res.data && res.data.post) {
        toast.success("Blog post created successfully");
        setIsModalOpen(false);
        router.push("/admin/blog");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateBlogAI = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await apiResponse.post("/blog/generate-ai", {
        topic: selectedTopic,
        instructions: customInstructions,
      });

      if (res.data && res.data.post) {
        const post = res.data.post;
        setTitle(post.title);
        setSlug(slugify(post.title));
        setExcerpt(post.excerpt);
        setContent(post.content);
        setCoverImage(post.coverImage);
        setCategory(post.category);
        setReadTime(post.readTime);
        setTagsInput(post.tags.join(", "));
        setIsAiModalOpen(false);
        toast.success("Blog post generated successfully by Genit AI!");
        fetchCurrentUser();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to generate AI blog post"
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleGenerateBodyAI = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    setIsGeneratingBody(true);
    try {
      const res = await apiResponse.post("/blog/generate-ai", {
        topic: title,
        instructions: "",
        withImage: withAiImage,
      });

      if (res.data && res.data.post) {
        const post = res.data.post;
        // Don't overwrite the title the user typed
        setSlug(slugify(title));
        setExcerpt(post.excerpt);
        setContent(post.content);
        if (post.coverImage) setCoverImage(post.coverImage);
        setCategory(post.category);
        setReadTime(post.readTime);
        setTagsInput(post.tags.join(", "));
        toast.success("Blog body generated successfully!");
        fetchCurrentUser();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to generate blog body"
      );
    } finally {
      setIsGeneratingBody(false);
    }
  };

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
            <h1 className='text-xl font-bold text-white'>New Blog Article</h1>
            <p className='mt-0.5 text-xs text-zinc-400'>
              Draft and publish a new Medium-style article with dynamic
              formatting
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setIsAiModalOpen(true)}
            className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/10 transition duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-600/20'
          >
            <Sparkles className='h-4 w-4' /> Write with AI
          </button>
          <button
            type='button'
            onClick={handleSubmit}
            className='hover:shadow-primary/20 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white transition duration-200 hover:bg-indigo-700 hover:shadow-lg'
          >
            Publish Article <Save className='h-3.5 w-3.5' />
          </button>
        </div>
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

            {/* Inline AI Generate Controls */}
            <div className='mt-2 flex items-center gap-3'>
              <label className='group flex cursor-pointer items-center gap-2 text-xs font-medium text-zinc-400 select-none'>
                <input
                  type='checkbox'
                  checked={withAiImage}
                  onChange={(e) => setWithAiImage(e.target.checked)}
                  className='cursor-pointer rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500'
                />
                <span className='flex items-center gap-1.5'>
                  {withAiImage ? (
                    <ImageIcon className='h-3.5 w-3.5 text-purple-400' />
                  ) : (
                    <ImageOff className='h-3.5 w-3.5 text-zinc-500' />
                  )}
                  <span
                    className={withAiImage ? "text-zinc-300" : "text-zinc-500"}
                  >
                    Generate cover image
                  </span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                      withAiImage
                        ? "border border-purple-800/40 bg-purple-950/40 text-purple-400"
                        : "border border-zinc-800 bg-zinc-900 text-zinc-500"
                    }`}
                  >
                    {withAiImage ? "+10 credits" : "No image"}
                  </span>
                </span>
              </label>

              <div className='flex-1' />

              <button
                type='button'
                disabled={!title.trim() || isGeneratingBody}
                onClick={handleGenerateBodyAI}
                className='inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600/90 to-indigo-600/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-purple-600/10 transition duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-600/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none'
              >
                {isGeneratingBody ? (
                  <>
                    <LoadingFileLoader size={16} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className='h-3.5 w-3.5' />
                    Generate Body
                    <span className='ml-0.5 text-[10px] font-semibold opacity-75'>
                      ({withAiImage ? "15" : "5"} credits)
                    </span>
                  </>
                )}
              </button>
            </div>
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

      {/* Finalize Publish Dialog Overlay */}
      {isModalOpen && (
        <div className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200'>
          <div className='animate-in zoom-in-95 max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl duration-200'>
            {/* Modal Header */}
            <div className='flex items-center justify-between pb-3'>
              <div>
                <h3 className='text-lg font-bold text-white'>
                  Finalize Blog Post
                </h3>
                <p className='mt-0.5 text-xs font-medium text-zinc-400'>
                  Configure publication metadata before publishing
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
                    Slug Override (Optional)
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
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className='h-3.5 w-3.5' /> Publish Blog Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Writer Modal Dialog */}
      {isAiModalOpen && (
        <div className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200'>
          <div className='animate-in zoom-in-95 max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl duration-200'>
            {/* Modal Header */}
            <div className='flex items-center justify-between pb-3'>
              <div className='flex items-center gap-2'>
                <Sparkles className='h-5 w-5 text-purple-400' />
                <div>
                  <h3 className='text-lg font-bold text-white'>
                    AI Blog Article Writer
                  </h3>
                  <p className='mt-0.5 text-xs font-medium text-zinc-400'>
                    Generate a complete SEO-optimized article instantly
                  </p>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setIsAiModalOpen(false)}
                className='rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-900 hover:text-white'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Modal Content */}
            <div className='space-y-4'>
              <p className='text-xs leading-relaxed text-zinc-300'>
                Genit AI will research entrepreneurial pain points, insert
                relevant code scripts, align with Genit's business
                features/integrations, and generate a custom futuristic DALL-E
                cover photo.
              </p>

              {/* Curated Topics List */}
              <div className='space-y-2'>
                <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                  Select Article Topic *
                </label>
                <div className='custom-scrollbar grid max-h-[200px] grid-cols-1 gap-2 overflow-y-auto pr-1'>
                  {AI_TOPICS.map((topic) => {
                    const isSelected = selectedTopic === topic.label;
                    return (
                      <button
                        key={topic.id}
                        type='button'
                        onClick={() => setSelectedTopic(topic.label)}
                        className={`cursor-pointer rounded-xl border p-3 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-purple-500 bg-purple-950/20 shadow-lg"
                            : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700/80"
                        }`}
                      >
                        <p
                          className={`text-xs font-bold ${isSelected ? "text-purple-400" : "text-white"}`}
                        >
                          {topic.label}
                        </p>
                        <p className='mt-1 text-[10px] leading-normal text-zinc-400'>
                          {topic.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom instructions input */}
              <div className='space-y-2'>
                <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                  Custom Instructions (Optional)
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className='w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-purple-500 focus:outline-none'
                  rows={2}
                  placeholder='e.g. Focus on early-stage bootstrapped SaaS builders, include code in TypeScript...'
                />
              </div>

              {/* Balance Check */}
              <div className='flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 text-xs'>
                <span className='font-medium text-zinc-400'>
                  Generation Cost
                </span>
                <span className='font-bold text-white'>15 Credits</span>
                <span className='text-zinc-500'>|</span>
                <span className='text-zinc-400'>Your Balance</span>
                <span
                  className={`font-bold ${user?.creditsRemaining && user.creditsRemaining >= 15 ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {user?.creditsRemaining ?? 0} Credits
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className='flex gap-3 border-t border-zinc-800 pt-4'>
              <button
                type='button'
                disabled={isGeneratingAi}
                onClick={() => setIsAiModalOpen(false)}
                className='inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40 py-2.5 text-xs font-semibold text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={isGeneratingAi || (user?.creditsRemaining ?? 0) < 15}
                onClick={handleGenerateBlogAI}
                className='inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-xs font-bold text-white transition duration-200 hover:shadow-lg hover:shadow-purple-600/20 disabled:opacity-50'
              >
                {isGeneratingAi ? (
                  <>
                    <LoadingFileLoader size={16} />
                    Writing Article...
                  </>
                ) : (
                  <>
                    <Sparkles className='h-3.5 w-3.5' /> Generate Post
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
