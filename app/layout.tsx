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

const metadata: Metadata = {
  title:
    "Gennit AI – Intelligent Media Design for Graphics, Videos & Animation",
  description:
    "Gennit is an AI media design platform that creates stunning graphics, videos, animations, brand assets, and marketing visuals in minutes—no design skills required.",
  keywords: [
    "AI media design",
    "AI graphics generator",
    "video creation software",
    "animation maker",
    "brand asset generator",
    "marketing visuals",
    "design automation",
    "AI video editor",
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
    title:
      "Gennit AI – Intelligent Media Design for Graphics, Videos & Animation",
    description: "AI-powered media design platform for creators and marketers",
    creator: "@GennitAI",
    images: {
      url: "https://www.gennit.online/opengraph-image.png",
      alt: "Gennit AI – AI Media Design Platform",
    },
  },
  openGraph: {
    title:
      "Gennit AI – Intelligent Media Design for Graphics, Videos & Animation",
    description:
      "AI-powered media design for creators, marketers, and businesses. Generate high-quality graphics, videos, animations, and brand assets at scale.",
    url: "https://www.gennit.online",
    siteName: "Gennit AI",
    images: [
      {
        url: "https://www.gennit.online/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Gennit AI – AI Media Design Platform",
      },
    ],
    locale: "en_US",
    type: "website",
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
        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Gennit AI",
              url: "https://www.gennit.online",
              logo: "https://www.gennit.online/logo.png",
              description:
                "Gennit AI is an intelligent media design platform that creates stunning graphics, videos, animations, brand assets, and marketing visuals using AI.",
              sameAs: [
                "https://twitter.com/GennitAI",
                "https://www.linkedin.com/company/gennit",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "support@gennit.online",
              },
            }),
          }}
        />
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
      </body>
    </html>
  );
}
