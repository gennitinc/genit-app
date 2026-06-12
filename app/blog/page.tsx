"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { apiResponse } from "@/utils/apiResponse";
import { Loader2 } from "lucide-react";

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
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Latest");
  const [isLoading, setIsLoading] = useState(true);

  // Initial Seed fallback if backend is unreachable
  const staticFallbackPosts: BlogPost[] = [];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await apiResponse.get("/blog");
        if (response.data && response.data.posts) {
          setPosts(response.data.posts);
          setFilteredPosts(response.data.posts);
        } else {
          setPosts(staticFallbackPosts);
          setFilteredPosts(staticFallbackPosts);
        }
      } catch (error) {
        console.warn("Failed to fetch blog posts from backend, using fallback:", error);
        setPosts(staticFallbackPosts);
        setFilteredPosts(staticFallbackPosts);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory === "Latest") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter(
          (post) => post.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }
  }, [selectedCategory, posts]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <LandingNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Column - Category Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                Blog
              </h1>
              <p className="text-zinc-400 text-sm">
                Compiled notes from the Genit team
              </p>
            </div>

            <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 gap-1 md:gap-2 border-b border-zinc-800 md:border-b-0 scrollbar-hide">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
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
                <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-400">No posts found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post._id}
                    className="group relative flex flex-col bg-zinc-900/40 border border-zinc-800/60 rounded-3xl overflow-hidden hover:border-zinc-700/80 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/5"
                  >
                    <Link href={`/blog/${post.slug}`} className="block relative aspect-video w-full overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 40vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                    </Link>

                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs font-semibold text-cyan-500 tracking-wider uppercase mb-3 block">
                        {post.category}
                      </span>
                      <h2 className="text-xl font-semibold text-white tracking-tight leading-snug mb-3 transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/60 text-xs text-zinc-500">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
