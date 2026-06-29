"use client";

import { NotionEditor } from "@/components/admin/NotionEditor";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";

export type DocPage = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  section: string;
  order: number;
  readTime: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
};

const SECTION_OPTIONS = [
  "Get started",
  "Learn",
  "Guides",
  "API Reference",
  "Knowledge Base",
  "Troubleshooting",
];

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

const calculateReadTime = (htmlContent: string): string => {
  if (!htmlContent) return "1 min read";
  const text = htmlContent.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

type DocsEditorFormProps = {
  mode: "new" | "edit";
  initialDoc?: DocPage;
};

export function DocsEditorForm({ mode, initialDoc }: DocsEditorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(mode === "edit");

  const [title, setTitle] = useState(initialDoc?.title || "");
  const [slug, setSlug] = useState(initialDoc?.slug || "");
  const [excerpt, setExcerpt] = useState(initialDoc?.excerpt || "");
  const [content, setContent] = useState(initialDoc?.content || "");
  const [section, setSection] = useState(initialDoc?.section || "Get started");
  const [order, setOrder] = useState(initialDoc?.order || 0);
  const [readTime, setReadTime] = useState(
    initialDoc?.readTime || "1 min read"
  );
  const [isActive, setIsActive] = useState(initialDoc?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialDoc?.isFeatured ?? false);
  const [tagsInput, setTagsInput] = useState(
    initialDoc?.tags?.join(", ") || ""
  );

  useEffect(() => {
    setReadTime(calculateReadTime(content));
  }, [content]);

  const submitLabel = mode === "new" ? "Publish Doc" : "Save Changes";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!title || !excerpt || !content || !section || !readTime) {
      toast.error("Please fill in the title, summary, section, and content");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      title,
      slug: slug || undefined,
      excerpt,
      content,
      section,
      order,
      readTime,
      isActive,
      isFeatured,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const response =
        mode === "new"
          ? await apiResponse.post("/docs", payload)
          : await apiResponse.put(`/docs/${initialDoc?._id}`, payload);

      if (response.data?.doc) {
        toast.success(
          mode === "new"
            ? "Documentation page created"
            : "Documentation page updated"
        );
        setIsModalOpen(false);
        router.push("/admin/docs");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to save documentation page"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      <div className='flex items-center justify-between pb-4'>
        <div className='flex items-center gap-3'>
          <Link
            href='/admin/docs'
            className='cursor-pointer rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white'
          >
            <ArrowLeft className='h-5 w-5' />
          </Link>
          <div>
            <h1 className='text-xl font-bold text-white'>
              {mode === "new" ? "New Documentation Page" : "Edit Documentation"}
            </h1>
            <p className='mt-0.5 text-xs text-zinc-400'>
              Write docs with the same rich editor used for blog publishing
            </p>
          </div>
        </div>

        <button
          type='button'
          onClick={handleSubmit}
          className='hover:shadow-primary/20 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white transition duration-200 hover:bg-indigo-700 hover:shadow-lg'
        >
          {submitLabel} <Save className='h-3.5 w-3.5' />
        </button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
              Page Title *
            </label>
            <input
              type='text'
              required
              value={title}
              onChange={(event) => {
                const value = event.target.value;
                setTitle(value);
                if (!isSlugEdited) setSlug(slugify(value));
              }}
              className='w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none'
              placeholder='e.g. Managing Domains'
            />
          </div>

          <div className='flex flex-col space-y-2'>
            <label className='text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
              Content Body *
            </label>
            <NotionEditor value={content} onChange={setContent} />
          </div>
        </div>
      </form>

      {isModalOpen && (
        <div className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200'>
          <div className='animate-in zoom-in-95 max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl duration-200'>
            <div className='flex items-center justify-between pb-3'>
              <div>
                <h3 className='text-lg font-bold text-white'>
                  Finalize Documentation
                </h3>
                <p className='mt-0.5 text-xs font-medium text-zinc-400'>
                  Set navigation and publishing details before saving
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

            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                  Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  className='w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                  placeholder='A short description used in search and previews...'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    Section *
                  </label>
                  <input
                    list='doc-sections'
                    value={section}
                    onChange={(event) => setSection(event.target.value)}
                    className='w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                    placeholder='Get started'
                  />
                  <datalist id='doc-sections'>
                    {SECTION_OPTIONS.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </div>

                <div className='space-y-2'>
                  <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    Sidebar Order
                  </label>
                  <input
                    type='number'
                    value={order}
                    onChange={(event) => setOrder(Number(event.target.value))}
                    className='w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                    placeholder='0'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    Slug Override
                  </label>
                  <input
                    type='text'
                    value={slug}
                    onChange={(event) => {
                      setSlug(event.target.value);
                      setIsSlugEdited(true);
                    }}
                    className='w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                    placeholder='custom-url-slug'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    Read Time
                  </label>
                  <input
                    type='text'
                    required
                    readOnly
                    value={readTime}
                    className='w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-400 transition focus:outline-none'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='block text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                  Tags (Comma separated)
                </label>
                <input
                  type='text'
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  className='w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition focus:border-cyan-500 focus:outline-none'
                  placeholder='e.g. domains, api, setup'
                />
              </div>

              <div className='flex items-center gap-6 pt-2'>
                <label className='flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-300 select-none'>
                  <input
                    type='checkbox'
                    checked={isActive}
                    onChange={(event) => setIsActive(event.target.checked)}
                    className='rounded border-zinc-800 bg-zinc-900 text-cyan-500 focus:ring-cyan-500'
                  />
                  Published
                </label>

                <label className='flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-300 select-none'>
                  <input
                    type='checkbox'
                    checked={isFeatured}
                    onChange={(event) => setIsFeatured(event.target.checked)}
                    className='rounded border-zinc-800 bg-zinc-900 text-cyan-500 focus:ring-cyan-500'
                  />
                  Featured
                </label>
              </div>
            </div>

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
                    <LoadingFileLoader size={20} />
                  </>
                ) : (
                  <>
                    <Save className='h-3.5 w-3.5' /> Save Documentation
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
