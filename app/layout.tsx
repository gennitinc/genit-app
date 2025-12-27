"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react"; // Added import for React
import { Toaster } from "@/components/ui/sonner";
import { AuthenticatedContextProvider } from "@/context/AuthenticatedContext";
import { ThemeProvider } from "@/components/theme-provider";
import Wrapper from "@/components/layout/wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import Loading from "@/utils/Loading";
import { ProjectProvider } from "@/context/DesignProject";
const inter = Inter({ subsets: ["latin"] });
import { Analytics } from "@vercel/analytics/next";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { PWAInstaller } from "@/components/pwa/pwa-installer";

const metadata: Metadata = {
  title:
    "Gennit AI – AI Image & Video Generator | Create Graphics, Videos & Animations",
  description:
    "Gennit AI supports Image and Video Generation. Create stunning AI-generated images and videos, animations, brand assets, and marketing visuals in minutes—no design skills required. Free AI image generator and video creator.",
  keywords: [
    "AI image generator",
    "AI video generator",
    "AI image creation",
    "AI video creation",
    "generate images with AI",
    "generate videos with AI",
    "AI media design",
    "AI graphics generator",
    "video creation software",
    "animation maker",
    "brand asset generator",
    "marketing visuals",
    "design automation",
    "AI video editor",
    "AI image editor",
    "text to image AI",
    "text to video AI",
    "AI art generator",
    "AI video maker",
    "artificial intelligence image generator",
    "artificial intelligence video generator",
    "free AI image generator",
    "free AI video generator",
    "AI content creation",
    "automated video generation",
    "automated image generation",
  ],
  authors: [{ name: "Gennit Team" }],
  creator: "Gennit",
  metadataBase: new URL("https://www.gennit.online"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.gennit.online",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gennit AI – AI Image & Video Generator | Create Graphics & Videos",
    description:
      "Gennit AI supports Image and Video Generation. Create stunning AI-generated images and videos instantly—no design skills required.",
    creator: "@GennitAI",
    images: {
      url: "https://www.gennit.online/opengraph-image.png",
      alt: "Gennit AI – AI Image & Video Generator Platform",
    },
  },
  openGraph: {
    title: "Gennit AI – AI Image & Video Generator | Create Graphics & Videos",
    description:
      "Gennit AI supports Image and Video Generation. Create stunning AI-generated images and videos, animations, brand assets, and marketing visuals instantly. Free AI image and video generator.",
    url: "https://www.gennit.online",
    siteName: "Gennit AI",
    images: [
      {
        url: "https://www.gennit.online/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Gennit AI – AI Media Design Platform",
      },
      {
        url: "https://www.gennit.online/opengraph-image.png",
        width: 1200,
        height: 1200,
        alt: "Gennit AI – AI Media Design Platform",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
    // Additional OpenGraph properties for better platform support
    countryName: "United States",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gennit AI",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Gennit AI" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Enhanced OpenGraph Meta Tags for WhatsApp, Facebook, LinkedIn, etc. */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.gennit.online" />
        <meta
          property="og:title"
          content="Gennit AI – AI Image & Video Generator | Create Graphics & Videos"
        />
        <meta
          property="og:description"
          content="Gennit AI supports Image and Video Generation. Create stunning AI-generated images and videos, animations, brand assets, and marketing visuals instantly. Free AI image and video generator."
        />
        <meta
          property="og:image"
          content="https://www.gennit.online/opengraph-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Gennit AI – AI Media Design Platform"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:site_name" content="Gennit AI" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en_GB" />

        {/* WhatsApp specific (uses OpenGraph but prefers square images) */}
        <meta
          property="og:image:secure_url"
          content="https://www.gennit.online/opengraph-image.png"
        />

        {/* Facebook specific */}
        <meta property="fb:app_id" content="" />
        <meta
          property="article:author"
          content="https://www.facebook.com/gennit"
        />
        <meta
          property="article:publisher"
          content="https://www.facebook.com/gennit"
        />

        {/* LinkedIn specific */}
        <meta
          property="og:image:url"
          content="https://www.gennit.online/opengraph-image.png"
        />

        {/* Additional platform support */}
        <meta name="author" content="Gennit Team" />
        <meta name="publisher" content="Gennit AI" />
        <meta name="copyright" content="Gennit AI" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        {/* Telegram */}
        <meta name="telegram:channel" content="@GennitAI" />

        {/* Discord */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Slack */}
        <meta name="slack-app-id" content="" />

        {/* Microsoft Teams / Office 365 */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icon-192x192.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Additional image formats for better compatibility */}
        <link
          rel="image_src"
          href="https://www.gennit.online/opengraph-image.png"
        />

        {/* Schema.org for rich snippets */}
        <meta
          itemProp="name"
          content="Gennit AI – AI Image & Video Generator"
        />
        <meta
          itemProp="description"
          content="Gennit AI supports Image and Video Generation. Create stunning AI-generated images and videos instantly with advanced AI models."
        />
        <meta
          itemProp="image"
          content="https://www.gennit.online/opengraph-image.png"
        />
        <meta itemProp="applicationCategory" content="DesignApplication" />
        <meta itemProp="operatingSystem" content="Web Browser" />
        <meta
          itemProp="offers"
          itemType="https://schema.org/Offer"
          itemScope
          content="Free tier available"
        />
        <meta
          itemProp="featureList"
          content="AI Image Generation, AI Video Generation, Text to Image, Text to Video"
        />

        {/* Comprehensive Structured Data for SEO and AI Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Gennit AI",
                url: "https://www.gennit.online",
                logo: "https://www.gennit.online/logo.png",
                description:
                  "Gennit AI is an intelligent media design platform that supports Image and Video Generation. Create stunning AI-generated images and videos, animations, brand assets, and marketing visuals using artificial intelligence.",
                foundingDate: "2024",
                sameAs: [
                  "https://twitter.com/GennitAI",
                  "https://www.linkedin.com/company/gennit",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  email: "support@gennit.online",
                  availableLanguage: "English",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Gennit AI",
                applicationCategory: "DesignApplication",
                operatingSystem: "Web Browser",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  description:
                    "Free tier available with AI image and video generation",
                },
                description:
                  "Gennit AI supports Image and Video Generation. AI-powered platform for creating images, videos, animations, and brand assets. Generate high-quality media content with artificial intelligence.",
                url: "https://www.gennit.online",
                browserRequirements: "Requires JavaScript. Requires HTML5.",
                softwareVersion: "1.0",
                releaseNotes:
                  "Gennit AI now supports both Image and Video Generation using advanced AI models.",
                featureList: [
                  "AI Image Generation",
                  "AI Video Generation",
                  "Text to Image",
                  "Text to Video",
                  "Image to Video",
                  "Animation Creation",
                  "Brand Asset Generation",
                  "Marketing Visual Creation",
                  "Multiple Aspect Ratios",
                  "Custom Styles",
                  "High Resolution Output",
                ],
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.9",
                  ratingCount: "1000",
                  bestRating: "5",
                  worstRating: "1",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Gennit AI - Image & Video Generator",
                applicationCategory: "DesignApplication",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                description:
                  "Gennit AI supports Image and Video Generation. Create AI-generated images and videos instantly. Free AI image generator and video creator with advanced AI models.",
                url: "https://www.gennit.online",
                screenshot: "https://www.gennit.online/opengraph-image.png",
                softwareVersion: "1.0",
                releaseNotes:
                  "Now supports both AI Image Generation and AI Video Generation",
                applicationSubCategory: "AI Content Creation",
                permissions: "Internet access required",
                softwareRequirements: "Modern web browser",
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Does Gennit AI support Image Generation?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Gennit AI supports AI Image Generation. You can create stunning images from text prompts using advanced AI models. Generate high-quality images in various styles, aspect ratios, and resolutions.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Does Gennit AI support Video Generation?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Gennit AI supports AI Video Generation. Create videos from text prompts, images, or a combination of both. Generate professional videos with custom aspect ratios, durations, and styles.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What is Gennit AI?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Gennit AI is an intelligent media design platform that supports both Image and Video Generation. It enables users to create stunning AI-generated images and videos, animations, brand assets, and marketing visuals without requiring design skills.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How do I generate images with Gennit AI?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "To generate images with Gennit AI, simply enter a text prompt describing the image you want to create, select your preferred AI model, aspect ratio, and style, then click Generate. The AI will create your image in seconds.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How do I generate videos with Gennit AI?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "To generate videos with Gennit AI, enter a text prompt describing your video, optionally upload reference images or frames, select your video model, aspect ratio, and duration, then click Generate. The AI will create your video.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is Gennit AI free to use?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Gennit AI offers a free tier that allows you to generate images and videos. There are also premium plans available with more features and higher generation limits.",
                    },
                  },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: "How to Generate Images and Videos with Gennit AI",
                description:
                  "Step-by-step guide to creating AI-generated images and videos using Gennit AI",
                step: [
                  {
                    "@type": "HowToStep",
                    position: 1,
                    name: "Sign Up or Log In",
                    text: "Create a free account on Gennit AI or log in to your existing account.",
                  },
                  {
                    "@type": "HowToStep",
                    position: 2,
                    name: "Choose Generation Type",
                    text: "Select whether you want to generate an Image or Video from the main menu.",
                  },
                  {
                    "@type": "HowToStep",
                    position: 3,
                    name: "Enter Your Prompt",
                    text: "Type a detailed description of the image or video you want to create in the prompt field.",
                  },
                  {
                    "@type": "HowToStep",
                    position: 4,
                    name: "Configure Settings",
                    text: "Select your preferred AI model, aspect ratio, resolution, and style options.",
                  },
                  {
                    "@type": "HowToStep",
                    position: 5,
                    name: "Generate",
                    text: "Click the Generate button and wait for Gennit AI to create your image or video.",
                  },
                  {
                    "@type": "HowToStep",
                    position: 6,
                    name: "Download or Share",
                    text: "Once generated, you can download, share, or further customize your AI-generated content.",
                  },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.gennit.online",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "AI Image Generator",
                    item: "https://www.gennit.online/inspire/create?mode=ai-image-gen",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "AI Video Generator",
                    item: "https://www.gennit.online/inspire/create?mode=ai-video-gen",
                  },
                ],
              },
            ]),
          }}
        />

        {/* Additional AI Search Optimization */}
        <meta name="application-name" content="Gennit AI" />
        <meta name="apple-mobile-web-app-title" content="Gennit AI" />
        <meta
          name="msapplication-tooltip"
          content="Gennit AI - Image & Video Generator"
        />
        <meta name="msapplication-starturl" content="/" />

        {/* AI Search Engine Optimization */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        {/* Semantic HTML hints for AI */}
        <meta
          name="keywords"
          content="AI image generator, AI video generator, generate images with AI, generate videos with AI, text to image, text to video, AI art generator, AI video maker, artificial intelligence image generator, artificial intelligence video generator, free AI image generator, free AI video generator"
        />

        {/* Additional semantic data */}
        <meta name="subject" content="AI Image and Video Generation Platform" />
        <meta
          name="topic"
          content="Artificial Intelligence, Image Generation, Video Generation, Content Creation"
        />
        <meta
          name="summary"
          content="Gennit AI supports Image and Video Generation. Create AI-generated images and videos instantly with advanced AI models."
        />
        <meta
          name="classification"
          content="Software, AI, Design, Content Creation"
        />
        <meta
          name="category"
          content="AI Image Generator, AI Video Generator, Design Software"
        />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="DC.title" content="Gennit AI - Image & Video Generator" />
        <meta name="DC.creator" content="Gennit Team" />
        <meta name="DC.subject" content="AI Image and Video Generation" />
        <meta
          name="DC.description"
          content="Gennit AI supports Image and Video Generation. Create stunning AI-generated images and videos."
        />
        <meta name="DC.publisher" content="Gennit AI" />
        <meta name="DC.contributor" content="Gennit Team" />
        <meta name="DC.date" content="2024" />
        <meta name="DC.type" content="Software" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.identifier" content="https://www.gennit.online" />
        <meta name="DC.language" content="en" />
        <meta name="DC.rights" content="Copyright Gennit AI" />
        <meta name="DC.coverage" content="Worldwide" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="ICBM" content="37.7749, -122.4194" />
      </head>
      <body className={`${inter.className} custom-scrollbar`}>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <AuthenticatedContextProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
                // storageKey="gennit-theme"
              >
                <ProjectProvider>
                  <Suspense
                    fallback={
                      <div className="h-screen flex flex-col items-center justify-center">
                        <Loading />
                      </div>
                    }
                  >
                    <Wrapper>{children}</Wrapper>
                  </Suspense>
                </ProjectProvider>
              </ThemeProvider>
              <Toaster />
            </AuthenticatedContextProvider>

            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </TooltipProvider>
        <Analytics />
        <ServiceWorkerRegister />
        <PWAInstaller />
      </body>
    </html>
  );
}
