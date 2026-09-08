import { BlogComments } from "@/components/blog/blog-comments";
import { BlogSocial } from "@/components/blog/blog-social";
import { ShareButtons } from "@/components/blog/share-buttons";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LocalizedText } from "@/components/localized-text";
import { apiResponse, clientUrl } from "@/utils/apiResponse";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
  tags: string[];
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
}

const retiredUnverifiedFallbackPosts: Record<string, BlogPost> = {
  "how-sentry-uses-genit": {
    _id: "1",
    title: "How Sentry uses Genit to build what can't be bought",
    slug: "how-sentry-uses-genit",
    excerpt:
      "Sentry, founded in 2012, is one of the most successful companies in dev tools. Like many companies that started with a product-led growth motion, Sentry has since added a sales motion.",
    coverImage: "/blog/sentry-cover.png",
    category: "Stories",
    author: {
      name: "Genit Team",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
      title: "Product Team",
    },
    publishedAt: "2025-11-18T00:00:00.000Z",
    readTime: "5 min read",
    tags: ["Sentry", "Stories"],
    content: `
      <h2>Embracing a new way of building software</h2>
      <p>Sentry, founded in 2012, is one of the most successful companies in dev tools. Like many companies that started with a product-led growth motion, Sentry has since added a sales motion to increase growth further.</p>
      <p>Chris De Vylder, CRO at Sentry, joined four years ago and leads sales, customer success, and support. Sentry's approach has always been dev-first, meaning any tooling they build internally or acquire externally must meet extremely high developer experience standards.</p>
 
      <h2>Struggling with outdated sales tools</h2>
      <p>Before adopting Genit, the sales team relied heavily on manual pipelines, spreadsheets, and complex internal dashboards that only a handful of senior engineers could edit. Whenever the sales structure or the customer conversion triggers evolved, the sales ops team had to wait in long engineering queues to get visual modifications implemented.</p>
      <p>"We wanted something that would bridge the gap between high-level sales data and operational flexibility without sacrificing our design standards," explains Chris. "That's when we discovered Genit."</p>
 
      <h2>Becoming a builder</h2>
      <p>Using Genit, the product ops and sales ops teams were able to prototype and deploy custom internal reporting systems and user conversion funnels entirely through natural conversation. Instead of writing code from scratch or configuring brittle drag-and-drop systems, they describe the layout they want, and Genit's AI designs and executes the interface in real time.</p>
      <p>The result is a highly tailored system that feels completely native to the Sentry brand, featuring clean design tokens, custom gradient themes, and responsive screens that work perfectly on any desktop or mobile device.</p>
 
      <h2>The build vs. buy question has changed forever</h2>
      <p>The old dilemma of whether to build internal tools using scarce engineering hours or buy rigid third-party software has been transformed. With AI-assisted construction, teams can build custom applications tailored to their exact workflows in hours instead of months. Sentry's sales ops team now builds, modifies, and launches conversion landing pages and internal dashboards on the fly, proving that custom software doesn't have to carry a high engineering cost anymore.</p>
    `,
  },
  "how-appdirect-turned-non-technical-teams-into-builders-with-genit": {
    _id: "2",
    title: "How AppDirect turned non-technical teams into builders with Genit",
    slug: "how-appdirect-turned-non-technical-teams-into-builders-with-genit",
    excerpt:
      "AppDirect is a leading subscription commerce platform that serves millions of businesses globally. Learn how AppDirect leveraged AI design to empower non-technical teams.",
    coverImage: "/blog/appdirect-cover.png",
    category: "Stories",
    author: {
      name: "Genit Team",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      title: "Content Director",
    },
    publishedAt: "2025-11-18T00:00:00.000Z",
    readTime: "4 min read",
    tags: ["AppDirect", "Stories"],
    content: `
      <h2>Empowering teams with custom software</h2>
      <p>AppDirect is a leading subscription commerce platform that simplifies the way businesses buy, sell, and manage cloud services. Because of the vast catalog of services they manage, customer support and product success teams regularly need customized dashboards to trace customer accounts and transaction metrics.</p>
 
      <h2>Unlocking creativity across departments</h2>
      <p>Before Genit, creating custom screens for various account management tiers meant filing extensive design specifications. Non-technical project managers felt disconnected from the execution phase, often settling for generic grid layouts that didn't help support productivity.</p>
      <p>By using Genit, non-technical teams have transitioned from static spec writers to active application builders. By describing target layouts in natural language, they generate beautiful, functional admin screens in minutes. The interfaces incorporate advanced data visualizations, search layouts, and custom interactive tables.</p>
 
      <h2>Sustained efficiency and collaboration</h2>
      <p>Today, AppDirect support agents operate with highly optimized user interfaces built specifically for their daily tasks. The turnaround time for UI modifications has dropped to zero, allowing continuous, iterative design improvements directly based on agent feedback.</p>
    `,
  },
  "how-thinkific-uses-genit-to-prototype-the-future": {
    _id: "3",
    title: "How Thinkific uses Genit to prototype the future",
    slug: "how-thinkific-uses-genit-to-prototype",
    excerpt:
      "Thinkific is a leading platform that enables creators to build, market, and sell online courses. Discover how their team prototypes new UI concepts in record time.",
    coverImage: "/blog/thinkific-cover.png",
    category: "Stories",
    author: {
      name: "Genit Team",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      title: "Design Lead",
    },
    publishedAt: "2025-11-18T00:00:00.000Z",
    readTime: "6 min read",
    tags: ["Thinkific", "Stories"],
    content: `
      <h2>Rapid prototyping in user experience</h2>
      <p>Thinkific is a leading platform that empowers creators to build, market, and sell online courses. For a company serving over 50,000 course creators, maintaining a fluid, modern, and highly intuitive user interface is critical to business success.</p>
 
      <h2>Accelerating the design loop</h2>
      <p>The UX team at Thinkific is constantly testing new interactive elements, layout structures, and navigation paths. Historically, developing a high-fidelity prototype that could be loaded with live dummy data required dedicated frontend engineering support, slowing down user research studies.</p>
      <p>Genit has completely unlocked their prototyping speed. Designers can now convert static Figma wireframes into live, interactive web views instantly. They load real content, test animations, and run usability sessions with functional web interfaces before writing a single line of production react code.</p>
 
      <h2>Bridging design and production</h2>
      <p>This streamlined workflow ensures that the final designs handed off to engineers are already validated by real user tests. It minimizes alignment gaps and ensures Thinkific can deliver next-generation course creator features faster than ever.</p>
    `,
  },
  "build-apps-from-a-link-with-genit": {
    _id: "4",
    title: "Build apps from a link with Genit Build with URL",
    slug: "build-apps-from-a-link-with-genit",
    excerpt:
      "We are thrilled to launch Build with URL. You can now import any existing web page link and start modifying its design, components, and layout using natural conversation.",
    coverImage: "/blog/build-with-url.png",
    category: "Announcements",
    author: {
      name: "Genit Team",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
      title: "Product Marketing",
    },
    publishedAt: "2025-11-18T00:00:00.000Z",
    readTime: "3 min read",
    tags: ["Announcements", "Build with URL"],
    content: `
      <h2>Introducing Build with URL</h2>
      <p>We are thrilled to announce one of the most requested features in Genit history: <strong>Build with URL</strong>. With this launch, you are no longer limited to starting your applications from scratch or pre-built templates.</p>
 
      <h2>How it works</h2>
      <p>Simply paste a link to any existing web page or interface into the URL bar, and Genit's AI engine will ingest its structure, components, styles, and layout. From there, you can prompt modifications, change content, modify buttons, adjust colors, or add completely new sections through natural chat instructions.</p>
      <p>It's the easiest way to recreate legacy pages, refactor outdated company sites, or design inspired components by building upon existing layouts you love.</p>
 
      <h2>Key benefits for creators</h2>
      <ul>
        <li><strong>Instant Ingestion:</strong> Ingest complex structures in seconds.</li>
        <li><strong>Visual Fidelity:</strong> Retain high-fidelity styles, margins, and color schemes.</li>
        <li><strong>Conversational Refinement:</strong> Make modifications easily using simple prompts.</li>
      </ul>
      <p>Build with URL is available immediately for all subscription tiers. Paste your first URL and start customizing today!</p>
    `,
  },
};

// Do not publish customer stories unless they come from the verified content API.
const staticFallbackPosts: Record<string, BlogPost> = {};

// Next.js App Router dynamic metadata generator
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  let post: BlogPost | null = null;

  try {
    const response = await apiResponse.get(`/blog/${slug}`, { timeout: 2500 });
    if (response.data && response.data.post) {
      post = response.data.post;
    }
  } catch {
    post = staticFallbackPosts[slug] || null;
  }

  if (!post) {
    return {
      title: "Blog Post Not Found | Genit AI",
      alternates: { canonical: `/blog/${slug}` },
    };
  }

  const ogUrl = `${clientUrl || "https://www.trygenit.com"}/blog/${slug}`;
  const coverUrl = post.coverImage.startsWith("http")
    ? post.coverImage
    : `${clientUrl || "https://www.trygenit.com"}${post.coverImage}`;

  return {
    title: `${post.title} – Genit AI Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: ogUrl,
      images: [
        {
          url: coverUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [coverUrl],
    },
  };
}

// Parses H2 tags from content to build the Table of Contents dynamically
// and injects id attributes into the HTML for smooth scrolling navigation.
function processContentWithHeadings(htmlContent: string = ""): {
  modifiedHtml: string;
  headings: { text: string; id: string }[];
} {
  // Strip out script tags to prevent React warnings and execution
  const safeHtmlContent = htmlContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  const headings: { text: string; id: string }[] = [];
  const modifiedHtml = safeHtmlContent.replace(
    /<h2>(.*?)<\/h2>/g,
    (match, p1) => {
      const text = p1.replace(/<[^>]*>/g, "");
      const id = text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      headings.push({ text, id });
      return `<h2 id="${id}" style="scroll-margin-top: 100px;">${p1}</h2>`;
    }
  );
  return { modifiedHtml, headings };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  let post: BlogPost | null = null;
  let hasLiked = false;

  try {
    const response = await apiResponse.get(`/blog/${slug}`, { timeout: 2500 });
    if (response.data && response.data.post) {
      post = response.data.post;
      hasLiked = !!response.data.hasLiked;
    } else {
      post = staticFallbackPosts[slug] || null;
    }
  } catch (error) {
    console.warn(
      "Failed to fetch post details from server, using fallback:",
      error
    );
    post = staticFallbackPosts[slug] || null;
  }

  if (!post) {
    return (
      <div className='flex min-h-screen flex-col justify-between bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'>
        <LandingNavbar />
        <div className='py-40 text-center'>
          <h1 className='mb-4 text-3xl font-bold text-black dark:text-white'>
            <LocalizedText text={"Post Not Found"} />
          </h1>
          <p className='mb-8 text-zinc-600 dark:text-zinc-400'>
            <LocalizedText
              text={"The blog article you are looking for does not exist."}
            />
          </p>
          <Link href='/blog' className='text-cyan-500 hover:underline'>
            <LocalizedText text={"Back to all posts"} />
          </Link>
        </div>
        <LandingFooter />
      </div>
    );
  }

  // Fetch related posts in the same category
  let relatedPosts: BlogPost[] = [];
  try {
    const listRes = await apiResponse.get(`/blog?category=${post.category}`);
    if (listRes.data && listRes.data.posts) {
      relatedPosts = listRes.data.posts.filter(
        (p: BlogPost) => p._id !== post?._id
      );
    }
  } catch (error) {
    console.warn("Failed to fetch related posts:", error);
    relatedPosts = Object.values(staticFallbackPosts).filter(
      (p) => p.category === post?.category && p.slug !== slug
    );
  }

  if (relatedPosts.length === 0) {
    try {
      const listRes = await apiResponse.get("/blog");
      if (listRes.data && listRes.data.posts) {
        relatedPosts = listRes.data.posts.filter(
          (p: BlogPost) => p._id !== post?._id
        );
      }
    } catch {
      relatedPosts = Object.values(staticFallbackPosts).filter(
        (p) => p.slug !== slug
      );
    }
  }

  const { modifiedHtml, headings } = processContentWithHeadings(post.content);

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

      <main className='mx-auto w-full max-w-7xl flex-grow px-4 py-12 md:px-12 lg:px-20'>
        {/* Back Link */}
        <Link
          href='/blog'
          className='group mb-10 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white'
        >
          <span className='transform transition-transform group-hover:-translate-x-1'>
            <LocalizedText text={"&larr;"} />
          </span>{" "}
          <LocalizedText text={"All posts"} />
        </Link>

        <div className='grid grid-cols-1 gap-12 lg:grid-cols-12'>
          {/* Main Article Content (Left/Center) */}
          <div className='flex flex-col lg:col-span-8'>
            <span className='mb-4 text-xs font-semibold tracking-wider text-zinc-600 uppercase dark:text-zinc-400'>
              <LocalizedText text={"Published"} />
              {formatDate(post.publishedAt)} <LocalizedText text={"in"} />{" "}
              <span className='text-cyan-500'>{post.category}</span>
            </span>

            <h1 className='mb-8 text-3xl leading-tight font-semibold tracking-tight text-black md:text-3xl dark:text-white'>
              {post.title}
            </h1>

            {/* Author Info */}
            <div className='mb-10 flex items-center gap-3 border-b border-zinc-200 pb-6 dark:border-zinc-800/60'>
              <Image
                src={decodeURI(post.author.avatar)}
                alt={post.author.name}
                width={40}
                height={40}
                className='size-8 rounded-full object-cover'
              />
              <div>
                <div className='text-sm font-medium text-black dark:text-white'>
                  {post.author.name}
                </div>
                {post.author.title && (
                  <div className='text-xs text-zinc-600 dark:text-zinc-400'>
                    {post.author.title}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div className='relative aspect-video w-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800/80'>
              <Image
                src={decodeURI(post.coverImage)}
                alt={post.title}
                fill
                priority
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 60vw'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent dark:from-zinc-950/20' />
            </div>

            <BlogSocial
              postId={post._id}
              initialViews={post.viewsCount || 0}
              initialLikes={post.likesCount || 0}
              initialComments={post.commentsCount || 0}
              initialHasLiked={hasLiked}
              recordView={false}
            />

            {/* Post Content Body */}
            <div
              className='prose dark:prose-invert prose-h2:text-black dark:prose-h2:text-white prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-p:mb-6 prose-p:text-zinc-800 dark:prose-p:text-zinc-300 prose-p:text-base md:prose-p:text-lg prose-strong:text-black dark:prose-strong:text-white prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-200 prose-blockquote:my-8 prose-blockquote:text-lg prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 [&_pre]:scrollbar-hide max-w-none space-y-6 leading-relaxed text-zinc-800 dark:text-zinc-300 [&_.video-container]:my-8 [&_.video-container]:overflow-hidden [&_.video-container]:rounded-lg [&_.video-container]:border [&_.video-container]:border-zinc-200 dark:[&_.video-container]:border-zinc-800 [&_a]:text-cyan-600 [&_a]:underline hover:[&_a]:text-cyan-500 dark:[&_a]:text-cyan-400 dark:hover:[&_a]:text-cyan-300 [&_code]:font-mono [&_code]:text-sm [&_code]:text-zinc-800 dark:[&_code]:text-zinc-300 [&_img]:my-6 [&_img]:rounded-lg [&_img]:border [&_img]:border-zinc-200 dark:[&_img]:border-zinc-800/80 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-zinc-200 [&_pre]:bg-zinc-100 [&_pre]:p-5 dark:[&_pre]:border-zinc-800 dark:[&_pre]:bg-zinc-950'
              dangerouslySetInnerHTML={{ __html: modifiedHtml }}
            />

            <BlogSocial
              postId={post._id}
              initialViews={post.viewsCount || 0}
              initialLikes={post.likesCount || 0}
              initialComments={post.commentsCount || 0}
              initialHasLiked={hasLiked}
            />

            <div
              id='blog-comments-desktop'
              className='hidden w-full justify-center lg:flex'
            >
              <BlogComments postId={post._id} />
            </div>
          </div>

          {/* Sidebar Info (Right) */}
          <div className='flex h-fit flex-col gap-10 border-t border-zinc-200 pt-10 lg:sticky lg:top-24 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 dark:border-zinc-800/60'>
            {/* Reading Time */}
            <div>
              <span className='mb-1 block text-sm font-semibold tracking-wide text-black uppercase dark:text-white'>
                <LocalizedText text={"Reading time"} />
              </span>
              <span className='text-sm text-zinc-600 dark:text-zinc-400'>
                {post.readTime}
              </span>
            </div>

            {/* Outline / Table of Contents */}
            {headings.length > 0 && (
              <div>
                <span className='mb-4 block text-sm font-semibold tracking-wide text-black uppercase dark:text-white'>
                  <LocalizedText text={"Outline"} />
                </span>
                <ul className='space-y-3'>
                  {headings.map((h, idx) => (
                    <li key={idx}>
                      <a
                        href={`#${h.id}`}
                        className='flex text-sm text-zinc-600 transition-colors hover:text-cyan-600 dark:text-zinc-400 dark:hover:text-cyan-400'
                      >
                        <span className='mr-2 flex-shrink-0 text-zinc-400 dark:text-zinc-600'>
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>

                        <span className='line-clamp-2'>{h.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social Share Buttons */}
            <div>
              <span className='mb-4 block text-sm font-semibold tracking-wide text-black uppercase dark:text-white'>
                <LocalizedText text={"Share this"} />
              </span>
              <ShareButtons title={post.title} slug={slug} />
            </div>
          </div>
        </div>

        {/* Related Articles row */}
        {relatedPosts.length > 0 && (
          <div className='mt-16 w-full border-t border-zinc-200 pt-12 dark:border-zinc-800/60'>
            <h3 className='mb-8 text-2xl font-bold text-black dark:text-white'>
              <LocalizedText text={"Related articles"} />
            </h3>
            <div className='scrollbar-hide -mx-4 flex gap-6 overflow-x-auto scroll-smooth px-4 pb-6 md:-mx-0 md:px-0'>
              {relatedPosts.slice(0, 3).map((item) => (
                <div
                  key={item._id}
                  className='group flex w-[285px] min-w-[285px] shrink-0 flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 transition-all duration-300 hover:border-zinc-300 md:w-[340px] md:min-w-[340px] dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:hover:border-zinc-700/80'
                >
                  <Link
                    href={`/blog/${item.slug}`}
                    className='relative block aspect-video overflow-hidden'
                  >
                    <Image
                      src={decodeURI(item.coverImage)}
                      alt={item.title}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                      sizes='(max-width: 768px) 100vw, 30vw'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-zinc-950/20' />
                  </Link>
                  <div className='flex flex-grow flex-col p-5'>
                    <span className='mb-2 block text-[10px] font-semibold tracking-wider text-cyan-500 uppercase'>
                      {item.category}
                    </span>
                    <h4 className='line-clamp-2 text-base leading-snug font-semibold text-black transition-colors dark:text-white'>
                      <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                    </h4>
                    <span className='mt-4 block text-[11px] text-zinc-500 dark:text-zinc-400'>
                      {new Date(item.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
