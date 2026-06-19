import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Blog – AI-Powered Marketing, SaaS Insights & Growth Hacks",
  description:
    "Stay ahead with the latest from the Genit team. Discover how AI image and video generation, design automation, and content workflow scaling are reshaping startup marketing.",
  openGraph: {
    title: "Blog – AI-Powered Marketing, SaaS Insights & Growth Hacks",
    description:
      "Stay ahead with the latest from the Genit team. Discover how AI image and video generation, design automation, and content workflow scaling are reshaping startup marketing.",
    url: "https://www.trygenit.com/blog",
    siteName: "Genit AI",
    images: [
      {
        url: "https://www.trygenit.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genit AI Blog – AI-Powered Marketing, SaaS Insights & Growth Hacks",
    description:
      "Stay ahead with the latest from the Genit team. Discover how AI image and video generation, design automation, and content workflow scaling are reshaping startup marketing.",
    images: ["https://www.trygenit.com/opengraph-image.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
