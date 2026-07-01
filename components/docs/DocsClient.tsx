"use client";

import { Logo } from "@/components/logo";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  BookOpen,
  ChevronRight,
  Copy,
  FileText,
  Library,
  Loader2,
  Menu,
  Search,
  Send,
  Sparkles,
  TerminalSquare,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

type DocPage = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  section: string;
  order: number;
  readTime: string;
  tags: string[];
};

type Heading = {
  id: string;
  text: string;
  level: number;
};

const stripTags = (value: string) => value.replace(/<[^>]*>/g, "");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function processContent(htmlContent = ""): {
  modifiedHtml: string;
  headings: Heading[];
} {
  const safeHtmlContent = htmlContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  const headings: Heading[] = [];
  const modifiedHtml = safeHtmlContent.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h\1>/gi,
    (match, level, attrs, body) => {
      const text = stripTags(body);
      const id = slugify(text);
      headings.push({ id, text, level: Number(level) });
      return `<h${level}${attrs} id="${id}" style="scroll-margin-top: 96px;">${body}</h${level}>`;
    }
  );

  return { modifiedHtml, headings };
}

function groupDocs(docs: DocPage[]) {
  return docs.reduce<Record<string, DocPage[]>>((groups, doc) => {
    groups[doc.section] = [...(groups[doc.section] || []), doc].sort(
      (a, b) => a.order - b.order || a.title.localeCompare(b.title)
    );
    return groups;
  }, {});
}

export function DocsClient({ initialSlug }: { initialSlug?: string }) {
  const router = useRouter();
  const [docs, setDocs] = useState<DocPage[]>([]);
  const [activeSlug, setActiveSlug] = useState(initialSlug || "");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      try {
        const response = await apiResponse.get("/docs", {
          params: { limit: 200 },
        });
        const nextDocs = response.data.docs || [];
        setDocs(nextDocs);

        if (!initialSlug && nextDocs[0]) {
          setActiveSlug(nextDocs[0].slug);
        }
      } catch (error) {
        console.warn("Failed to fetch documentation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, [initialSlug]);

  useEffect(() => {
    if (initialSlug) setActiveSlug(initialSlug);
  }, [initialSlug]);

  const activeDoc = useMemo(() => {
    return docs.find((doc) => doc.slug === activeSlug) || docs[0] || null;
  }, [activeSlug, docs]);

  const filteredDocs = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return docs;

    return docs.filter((doc) =>
      [doc.title, doc.excerpt, doc.section, ...(doc.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [docs, query]);

  const groupedDocs = useMemo(() => groupDocs(filteredDocs), [filteredDocs]);
  const { modifiedHtml, headings } = useMemo(
    () => processContent(activeDoc?.content || ""),
    [activeDoc?.content]
  );

  const openDoc = (slug: string) => {
    setActiveSlug(slug);
    setMobileNavOpen(false);
    router.push(`/docs/${slug}`);
  };

  const copyLink = async () => {
    if (!activeDoc || typeof window === "undefined") return;
    await navigator.clipboard.writeText(
      `${window.location.origin}/docs/${activeDoc.slug}`
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const sidebar = (
    <aside className='flex h-full w-full flex-col border-zinc-900 bg-[#070707] lg:w-80 lg:border-r'>
      <div className='flex items-center gap-2 border-b border-zinc-900 px-4 py-4 lg:hidden'>
        <Logo className='h-8 w-8' />
        <span className='font-semibold text-white'>Documentation</span>
        <button
          type='button'
          onClick={() => setMobileNavOpen(false)}
          className='ml-auto rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white'
          aria-label='Close docs navigation'
        >
          <X className='h-5 w-5' />
        </button>
      </div>

      <div className='flex items-center gap-2 px-4 py-5'>
        <div className='relative flex-1'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500' />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search...'
            className='h-11 w-full rounded-xl border border-zinc-800 bg-black pr-3 pl-10 text-sm text-zinc-200 transition outline-none placeholder:text-zinc-500 focus:border-zinc-600'
          />
        </div>
        <button
          type='button'
          aria-label='Ask AI'
          className='flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-black text-zinc-400 transition hover:border-zinc-700 hover:text-white'
        >
          <Sparkles className='h-4 w-4' />
        </button>
      </div>

      <nav className='flex-1 space-y-8 overflow-y-auto px-4 pb-8'>
        {Object.keys(groupedDocs).length === 0 ? (
          <div className='rounded-xl border border-dashed border-zinc-800 p-5 text-center text-sm text-zinc-500'>
            No docs found
          </div>
        ) : (
          Object.entries(groupedDocs).map(([section, items]) => (
            <div key={section} className='space-y-2'>
              <h2 className='px-2 text-sm font-semibold text-zinc-200'>
                {section}
              </h2>
              <div className='space-y-1'>
                {items.map((doc) => {
                  const active = activeDoc?.slug === doc.slug;
                  return (
                    <button
                      key={doc._id}
                      type='button'
                      onClick={() => openDoc(doc.slug)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                        active
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-200"
                      }`}
                    >
                      <span className='line-clamp-1'>{doc.title}</span>
                      {!active && (
                        <ChevronRight className='h-3.5 w-3.5 shrink-0 text-zinc-700' />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </nav>
    </aside>
  );

  return (
    <div className='min-h-screen bg-[#050505] text-zinc-100'>
      <header className='sticky top-0 z-40 border-b border-zinc-900 bg-[#080808]/95 backdrop-blur'>
        <div className='flex h-16 items-center gap-4 px-4 lg:px-8'>
          <button
            type='button'
            onClick={() => setMobileNavOpen(true)}
            className='rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white lg:hidden'
            aria-label='Open docs navigation'
          >
            <Menu className='h-5 w-5' />
          </button>

          <Link href='/' className='flex items-center gap-2'>
            <Logo className='h-9 w-9' />
            <span className='text-xl font-bold tracking-tight text-white'>
              Genit
            </span>
          </Link>

          <nav className='ml-4 hidden items-center gap-8 text-sm font-medium md:flex'>
            <Link href='/docs' className='flex items-center gap-2 text-white'>
              <BookOpen className='h-4 w-4' />
              Documentation
            </Link>
            <Link
              href='/docs'
              className='flex items-center gap-2 text-zinc-500 transition hover:text-zinc-200'
            >
              <TerminalSquare className='h-4 w-4' />
              API Reference
            </Link>
            <Link
              href='/docs'
              className='flex items-center gap-2 text-zinc-500 transition hover:text-zinc-200'
            >
              <Library className='h-4 w-4' />
              Knowledge Base
            </Link>
          </nav>

          <div className='ml-auto flex items-center gap-2'>
            <Link
              href='/signin'
              className='hidden rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 sm:inline-flex'
            >
              Sign In
            </Link>
            <Link
              href='/signup'
              className='rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200'
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div className='fixed inset-0 z-50 bg-black/70 lg:hidden'>
          <div className='h-full w-[86vw] max-w-sm'>{sidebar}</div>
        </div>
      )}

      <div className='flex min-h-[calc(100vh-4rem)]'>
        <div className='sticky top-16 hidden h-[calc(100vh-4rem)] lg:block'>
          {sidebar}
        </div>

        <main className='min-w-0 flex-1'>
          {isLoading ? (
            <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center'>
              <LoadingFileLoader size={16} />
            </div>
          ) : !activeDoc ? (
            <div className='mx-auto max-w-2xl px-6 py-32 text-center'>
              <FileText className='mx-auto mb-4 h-10 w-10 text-zinc-600' />
              <h1 className='text-2xl font-semibold text-white'>
                Documentation is coming soon
              </h1>
              <p className='mt-2 text-sm text-zinc-500'>
                Published docs will appear here automatically.
              </p>
            </div>
          ) : (
            <div className='mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-12'>
              <article className='min-w-0 lg:mx-auto lg:w-full lg:max-w-3xl'>
                <div className='mb-5 flex items-center gap-2 text-sm text-zinc-500'>
                  <span>{activeDoc.section}</span>
                  <ChevronRight className='h-4 w-4' />
                  <span>{activeDoc.title}</span>
                </div>

                <div className='mb-8 flex items-start justify-between gap-4'>
                  <div>
                    <h1 className='text-4xl font-bold tracking-tight text-white md:text-5xl'>
                      {activeDoc.title}
                    </h1>
                    <p className='mt-4 text-lg leading-8 text-zinc-500'>
                      {activeDoc.excerpt}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={copyLink}
                    className='hidden h-11 shrink-0 items-center gap-2 rounded-xl border border-zinc-800 bg-black px-3 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white sm:inline-flex'
                  >
                    <Copy className='h-4 w-4' />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div
                  className='prose prose-invert prose-headings:tracking-tight prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-3xl prose-h2:font-bold prose-h3:mt-9 prose-h3:text-xl prose-p:text-lg prose-p:leading-8 prose-p:text-zinc-400 prose-a:text-white prose-a:underline prose-strong:text-white prose-code:rounded-md prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-zinc-200 prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-black prose-li:text-zinc-400 max-w-none [&_blockquote]:border-l-zinc-700 [&_img]:rounded-xl [&_img]:border [&_img]:border-zinc-800'
                  dangerouslySetInnerHTML={{ __html: modifiedHtml }}
                />

                <div className='mt-12 rounded-xl border border-zinc-800 bg-black p-3'>
                  <div className='flex items-center gap-3'>
                    <input
                      placeholder='Ask a question...'
                      className='min-h-12 flex-1 bg-transparent px-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-500'
                    />
                    <button
                      type='button'
                      aria-label='Send question'
                      className='flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 hover:text-white'
                    >
                      <Send className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </article>

              <aside className='hidden lg:block'>
                <div className='sticky top-28 border-l border-zinc-800 pl-6'>
                  <div className='mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-200'>
                    <Menu className='h-4 w-4' />
                    On this page
                  </div>
                  <nav className='space-y-3'>
                    {headings.length ? (
                      headings.map((heading) => (
                        <a
                          key={heading.id}
                          href={`#${heading.id}`}
                          className={`block text-sm leading-6 transition hover:text-white ${
                            heading.level === 3
                              ? "pl-4 text-zinc-600"
                              : "text-zinc-400"
                          }`}
                        >
                          {heading.text}
                        </a>
                      ))
                    ) : (
                      <p className='text-sm text-zinc-600'>No sections yet</p>
                    )}
                  </nav>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
