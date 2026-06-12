"use client";

import "./globals.css";
import Wrapper from "@/components/layout/wrapper";
import { PWAInstaller } from "@/components/pwa/pwa-installer";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { ThemeProvider } from "@/components/theme-provider";
// Added import for React
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthenticatedContextProvider } from "@/context/AuthenticatedContext";
import { ProjectProvider } from "@/context/DesignProject";
import MixpanelProvider from "@/provider/MixpanelProver";
import Loading from "@/utils/Loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import type React from "react";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title:
    "Genit AI – Create stunning graphics, commercial videos, stock images and brand assets, no design skills or expensive budget required.",
  description:
    "Genit AI supports Image and Video Generation. Create stunning AI-generated images and videos, animations, brand assets, and marketing visuals in minutes—no design skills required. Free AI image generator and video creator.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
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
  authors: [{ name: "genit Team" }],
  creator: "genit",
  metadataBase: new URL("https://www.trygenit.com"),
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
    canonical: "https://www.trygenit.com",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Genit AI – Create stunning graphics, commercial videos, stock images and brand assets, no design skills or expensive budget required.",
    description:
      "Genit AI supports Image and Video Generation. Create stunning AI-generated images and videos instantly—no design skills required.",
    creator: "@genitAI",
    images: {
      url: "https://www.trygenit.com/opengraph-image.png",
      alt: "Genit AI – Create stunning graphics, commercial videos, stock images and brand assets, no design skills or expensive budget required.",
    },
  },
  openGraph: {
    title:
      "Genit AI – Create stunning graphics, commercial videos, stock images and brand assets, no design skills or expensive budget required.",
    description:
      "Genit AI supports Image and Video Generation. Create stunning AI-generated images and videos, animations, brand assets, and marketing visuals instantly. Free AI image and video generator.",
    url: "https://www.trygenit.com",
    siteName: "Genit AI",
    images: [
      {
        url: "https://www.trygenit.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Genit AI – Create stunning graphics, commercial videos, stock images and brand assets, no design skills or expensive budget required.",
      },
      {
        url: "https://www.trygenit.com/opengraph-image.png",
        width: 1200,
        height: 1200,
        alt: "Genit AI – Create stunning graphics, commercial videos, stock images and brand assets, no design skills or expensive budget required.",
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
    title: "Genit AI",
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
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Blocking script to prevent theme flash - must run before any content renders */}
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('genit-theme') || 'dark';
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var resolvedTheme = theme === 'system' ? systemTheme : theme;
                  
                  if (resolvedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                    document.documentElement.style.backgroundColor = 'oklch(0.145 0 0)';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                    document.documentElement.style.backgroundColor = 'oklch(1 0 0)';
                  }
                  
                  // Also set body background immediately
                  if (document.body) {
                    document.body.style.backgroundColor = resolvedTheme === 'dark' 
                      ? 'oklch(0.145 0 0)' 
                      : 'oklch(1 0 0)';
                  }
                } catch (e) {
                  // Fallback to dark theme if there's an error
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                  document.documentElement.style.backgroundColor = 'oklch(0.145 0 0)';
                  if (document.body) {
                    document.body.style.backgroundColor = 'oklch(0.145 0 0)';
                  }
                }
              })();
            `,
          }}
        />
        {/* PWA Meta Tags */}
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#000000' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
        <meta name='apple-mobile-web-app-title' content='Genit AI' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <meta name='mobile-web-app-capable' content='yes' />



        {/* Slack */}
        <meta name='slack-app-id' content='' />

        {/* Microsoft Teams / Office 365 */}
        <meta name='msapplication-TileColor' content='#000000' />
        <meta name='msapplication-TileImage' content='/icon-192x192.png' />
        <meta name='msapplication-config' content='/browserconfig.xml' />



        {/* Schema.org for rich snippets */}
        <meta
          itemProp='name'
          content='Genit AI – AI Image & Video Generator'
        />
        <meta
          itemProp='description'
          content='Genit AI supports Image and Video Generation. Create stunning AI-generated images and videos instantly with advanced AI models.'
        />
        <meta
          itemProp='image'
          content='https://www.trygenit.com/opengraph-image.png'
        />
        <meta itemProp='applicationCategory' content='DesignApplication' />
        <meta itemProp='operatingSystem' content='Web Browser' />
        <meta
          itemProp='offers'
          itemType='https://schema.org/Offer'
          itemScope
          content='Free tier available'
        />
        <meta
          itemProp='featureList'
          content='AI Image Generation, AI Video Generation, Text to Image, Text to Video'
        />

        {/* Comprehensive Structured Data for SEO and AI Search */}
        <Script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Genit AI",
                url: "https://www.trygenit.com",
                logo: "https://www.trygenit.com/logo.jpeg",
                description:
                  "Genit AI is an intelligent media design platform that supports Image and Video Generation. Create stunning AI-generated images and videos, animations, brand assets, and marketing visuals using artificial intelligence.",
                foundingDate: "2024",
                sameAs: [
                  "https://twitter.com/genitAI",
                  "https://www.linkedin.com/company/genit",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  email: "support@trygenit.com",
                  availableLanguage: "English",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Genit AI",
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
                  "Genit AI supports Image and Video Generation. AI-powered platform for creating images, videos, animations, and brand assets. Generate high-quality media content with artificial intelligence.",
                url: "https://www.trygenit.com",
                browserRequirements: "Requires JavaScript. Requires HTML5.",
                softwareVersion: "1.0",
                releaseNotes:
                  "Genit AI now supports both Image and Video Generation using advanced AI models.",
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
                name: "Genit AI - Image & Video Generator",
                applicationCategory: "DesignApplication",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                description:
                  "Genit AI supports Image and Video Generation. Create AI-generated images and videos instantly. Free AI image generator and video creator with advanced AI models.",
                url: "https://www.trygenit.com",
                screenshot: "https://www.trygenit.com/opengraph-image.png",
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
                    name: "Does Genit AI support Image Generation?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Genit AI supports AI Image Generation. You can create stunning images from text prompts using advanced AI models. Generate high-quality images in various styles, aspect ratios, and resolutions.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Does Genit AI support Video Generation?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Genit AI supports AI Video Generation. Create videos from text prompts, images, or a combination of both. Generate professional videos with custom aspect ratios, durations, and styles.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What is Genit AI?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Genit AI is an intelligent media design platform that supports both Image and Video Generation. It enables users to create stunning AI-generated images and videos, animations, brand assets, and marketing visuals without requiring design skills.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How do I generate images with Genit AI?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "To generate images with Genit AI, simply enter a text prompt describing the image you want to create, select your preferred AI model, aspect ratio, and style, then click Generate. The AI will create your image in seconds.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How do I generate videos with Genit AI?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "To generate videos with Genit AI, enter a text prompt describing your video, optionally upload reference images or frames, select your video model, aspect ratio, and duration, then click Generate. The AI will create your video.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is Genit AI free to use?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Genit AI offers a free tier that allows you to generate images and videos. There are also premium plans available with more features and higher generation limits.",
                    },
                  },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: "How to Generate Images and Videos with Genit AI",
                description:
                  "Step-by-step guide to creating AI-generated images and videos using Genit AI",
                step: [
                  {
                    "@type": "HowToStep",
                    position: 1,
                    name: "Sign Up or Log In",
                    text: "Create a free account on Genit AI or log in to your existing account.",
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
                    text: "Click the Generate button and wait for Genit AI to create your image or video.",
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
                    item: "https://www.trygenit.com",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "AI Image Generator",
                    item: "https://www.trygenit.com/inspire/create?mode=ai-image-gen",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "AI Video Generator",
                    item: "https://www.trygenit.com/inspire/create?mode=ai-video-gen",
                  },
                ],
              },
            ]),
          }}
        />

        {/* Additional AI Search Optimization */}
        <meta name='application-name' content='Genit AI' />
        <meta name='apple-mobile-web-app-title' content='Genit AI' />
        <meta
          name='msapplication-tooltip'
          content='Genit AI - Image & Video Generator'
        />
        <meta name='msapplication-starturl' content='/' />

        {/* AI Search Engine Optimization */}
        <meta
          name='robots'
          content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        />
        <meta
          name='googlebot'
          content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        />
        <meta
          name='bingbot'
          content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        />

        {/* Semantic HTML hints for AI */}
        <meta
          name='keywords'
          content='AI image generator, AI video generator, generate images with AI, generate videos with AI, text to image, text to video, AI art generator, AI video maker, artificial intelligence image generator, artificial intelligence video generator, free AI image generator, free AI video generator'
        />

        {/* Additional semantic data */}
        <meta name='subject' content='AI Image and Video Generation Platform' />
        <meta
          name='topic'
          content='Artificial Intelligence, Image Generation, Video Generation, Content Creation'
        />
        <meta
          name='summary'
          content='Genit AI supports Image and Video Generation. Create AI-generated images and videos instantly with advanced AI models.'
        />
        <meta
          name='classification'
          content='Software, AI, Design, Content Creation'
        />
        <meta
          name='category'
          content='AI Image Generator, AI Video Generator, Design Software'
        />
        <meta name='coverage' content='Worldwide' />
        <meta name='target' content='all' />
        <meta name='audience' content='all' />
        <meta name='DC.title' content='Genit AI - Image & Video Generator' />
        <meta name='DC.creator' content='genit Team' />
        <meta name='DC.subject' content='AI Image and Video Generation' />
        <meta
          name='DC.description'
          content='Genit AI supports Image and Video Generation. Create stunning AI-generated images and videos.'
        />
        <meta name='DC.publisher' content='Genit AI' />
        <meta name='DC.contributor' content='genit Team' />
        <meta name='DC.date' content='2024' />
        <meta name='DC.type' content='Software' />
        <meta name='DC.format' content='text/html' />
        <meta name='DC.identifier' content='https://www.trygenit.com' />
        <meta name='DC.language' content='en' />
        <meta name='DC.rights' content='Copyright Genit AI' />
        <meta name='DC.coverage' content='Worldwide' />
        <meta name='geo.region' content='US' />
        <meta name='geo.placename' content='United States' />
        <meta name='ICBM' content='37.7749, -122.4194' />
      </head>

      <body
        suppressHydrationWarning
        className={`${inter.className} custom-scrollbar`}
      >
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <AuthenticatedContextProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='dark'
                enableSystem
                disableTransitionOnChange
                storageKey='genit-theme'
              >
                <ProjectProvider>
                  <Suspense
                    fallback={
                      <div className='flex h-screen flex-col items-center justify-center bg-white dark:bg-black'>
                        <Loading />
                      </div>
                    }
                  >
                    <Wrapper>
                      <MixpanelProvider>{children}</MixpanelProvider>
                    </Wrapper>
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
        {/* Theme initialization script - runs before interactive to prevent flash */}
        <Script
          id='theme-init'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('genit-theme') || 'dark';
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var resolvedTheme = theme === 'system' ? systemTheme : theme;
                  
                  if (resolvedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              })();
            `,
          }}
        />
        <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
      </body>
    </html>
  );
}
