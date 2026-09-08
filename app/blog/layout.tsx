import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "AI Marketing Automation Blog | Genit",
  description:
    "Practical guides to AI marketing agents, automation, campaigns, social publishing, content operations, integrations, and measurable growth from Genit.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Genit AI Marketing Automation Blog",
    description:
      "Practical guides to AI agents, marketing automation, campaigns, publishing, integrations, and growth.",
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
    title: "Genit AI Marketing Automation Blog",
    description:
      "Practical guides to AI agents, marketing automation, campaigns, publishing, integrations, and growth.",
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
