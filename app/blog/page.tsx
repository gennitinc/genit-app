"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { apiResponse } from "@/utils/apiResponse";
import { Loader2 } from "lucide-react";
import Loading from "@/utils/Loading";

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

  const fetchPosts = async (currentPage: number, category: string, isReset: boolean) => {
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      <LandingNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-12 lg:px-20 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Column - Category Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-8 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto scrollbar-hide">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-2">
                Blog
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Compiled notes from the Genit team
              </p>
            </div>

            <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 gap-1 md:gap-2 border-b border-zinc-200 dark:border-zinc-800 md:border-b-0 scrollbar-hide">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white shadow-sm"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Column - Posts Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loading />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <p className="text-zinc-500 dark:text-zinc-400">No posts found in this category.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.map((post) => (
                    <article
                      key={post._id}
                      className="group relative flex flex-col bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-3xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/5"
                    >
                      <Link href={`/blog/${post.slug}`} className="block relative aspect-video w-full overflow-hidden">
                        <Image
                          src={decodeURI(post.coverImage)}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 40vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent opacity-60" />
                      </Link>

                      <div className="p-6 flex flex-col flex-grow">
                        <span className="text-xs font-semibold text-cyan-500 tracking-wider uppercase mb-3 block">
                          {post.category}
                        </span>
                        <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight leading-snug mb-3 transition-colors">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800/60 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {/* Intersection Observer Target */}
                {hasMore && (
                  <div ref={loadMoreRef} className="flex items-center justify-center py-8">
                    {isLoadingMore && <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />}
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
