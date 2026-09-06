"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LocalizedText } from "@/components/localized-text";
import Loading, { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { Eye, Heart, Loader2, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  coverImage: string;
  category: string;
  author: Author;
  publishedAt: string;
  readTime: string;
  tags: string[];
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
}

const CATEGORIES = [
  "Latest",
  "Announcements",
  "Changelog",
  "Inside Genit",
  "Marketing hacks",
  "Reports",
  "Tutorials",
  "Stories",
];

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Latest");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchPosts = async (
    currentPage: number,
    category: string,
    isReset: boolean
  ) => {
    if (isReset) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response = await apiResponse.get("/blog", {
        params: { page: currentPage, limit: 6, category },
      });
      if (response.data && response.data.posts) {
        if (isReset) {
          setPosts(response.data.posts);
        } else {
          setPosts((prev) => [...prev, ...response.data.posts]);
        }
        setHasMore(response.data.hasMore);
      }
    } catch (error) {
      console.warn("Failed to fetch blog posts from backend:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(1, selectedCategory, true);
  }, [selectedCategory]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPosts(nextPage, selectedCategory, false);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isLoadingMore, hasMore, page, selectedCategory]
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className='flex min-h-screen flex-col bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'>
      <LandingNavbar />

      <main className='mx-auto w-full max-w-7xl flex-grow px-4 py-16 md:px-12 lg:px-20'>
        <div className='flex flex-col gap-12 md:flex-row'>
          {/* Left Column - Category Sidebar */}
          <div className='scrollbar-hide flex w-full shrink-0 flex-col gap-8 md:sticky md:top-24 md:max-h-[calc(100vh-6rem)] md:w-64 md:self-start md:overflow-y-auto'>
            <div>
              <h1 className='mb-2 text-3xl font-bold tracking-tight text-black dark:text-white'>
                <LocalizedText text={"Blog"} />
              </h1>
              <p className='text-sm text-zinc-600 dark:text-zinc-400'>
                <LocalizedText text={"Compiled notes from the Genit team"} />
              </p>
            </div>

            <nav className='scrollbar-hide flex flex-row gap-1 overflow-x-auto border-b border-zinc-200 pb-4 md:flex-col md:gap-2 md:overflow-x-visible md:border-b-0 md:pb-0 dark:border-zinc-800'>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer rounded-xl px-3 py-2 text-left text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-zinc-100 text-black shadow-sm dark:bg-zinc-900 dark:text-white"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Column - Posts Grid */}
          <div className='flex-grow'>
            {isLoading ? (
              <div className='flex items-center justify-center py-24'>
                <Loading />
              </div>
            ) : posts.length === 0 ? (
              <div className='rounded-3xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-800'>
                <p className='text-zinc-500 dark:text-zinc-400'>
                  <LocalizedText text={"No posts found in this category."} />
                </p>
              </div>
            ) : (
              <div className='flex flex-col gap-8'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                  {posts.map((post) => (
                    <article
                      key={post._id}
                      className='group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 transition-all duration-300 hover:border-zinc-300 hover:shadow-2xl hover:shadow-cyan-500/5 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:hover:border-zinc-700/80'
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className='relative block aspect-video w-full overflow-hidden'
                      >
                        <Image
                          src={decodeURI(post.coverImage)}
                          alt={post.title}
                          fill
                          className='object-cover transition-transform duration-500 group-hover:scale-105'
                          sizes='(max-width: 768px) 100vw, 40vw'
                          priority
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60 dark:from-zinc-950' />
                      </Link>

                      <div className='flex flex-grow flex-col p-6'>
                        <span className='mb-3 block text-xs font-semibold tracking-wider text-cyan-500 uppercase'>
                          {post.category}
                        </span>
                        <h2 className='mb-3 text-xl leading-snug font-semibold tracking-tight text-black transition-colors dark:text-white'>
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className='mb-6 line-clamp-3 flex-grow text-sm text-zinc-600 dark:text-zinc-400'>
                          {post.excerpt}
                        </p>
                        <div className='mt-auto flex flex-col gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800/60'>
                          <div className='flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400'>
                            <span>{formatDate(post.publishedAt)}</span>
                            <span>{post.readTime}</span>
                          </div>

                          <div className='flex items-center gap-4 text-xs font-medium text-zinc-400 dark:text-zinc-500'>
                            <div className='flex items-center gap-1.5'>
                              <Eye className='h-3.5 w-3.5' />
                              <span>{post.viewsCount || 0}</span>
                            </div>
                            <div className='flex items-center gap-1.5'>
                              <Heart className='h-3.5 w-3.5' />
                              <span>{post.likesCount || 0}</span>
                            </div>
                            <div className='flex items-center gap-1.5'>
                              <MessageSquare className='h-3.5 w-3.5' />
                              <span>{post.commentsCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {/* Intersection Observer Target */}
                {hasMore && (
                  <div
                    ref={loadMoreRef}
                    className='flex items-center justify-center py-8'
                  >
                    {isLoadingMore && <LoadingFileLoader size={20} />}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
