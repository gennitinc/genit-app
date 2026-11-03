import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creators & Affiliate Program | Genit AI",
  description:
    "Earn a recurring commission when people you refer subscribe to a paid Genit plan.",
  keywords: [
    "Genit affiliate program",
    "creator partnership",
    "AI marketing affiliate",
    "marketing referral program",
    "creator rewards",
  ],
  alternates: { canonical: "/creators-program" },
  openGraph: {
    title: "Creators & Affiliate Program | Genit AI",
    description:
      "Earn a recurring commission when people you refer subscribe to Genit.",
    url: "https://www.trygenit.com/creators-program",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Genit Creators Program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creators & Affiliate Program | Genit AI",
    description:
      "Earn a recurring commission when people you refer subscribe to Genit.",
    images: ["/opengraph-image.png"],
  },
};

export default function CreatorsProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col bg-white text-neutral-900 dark:bg-black dark:text-neutral-100'>
      {children}
    </div>
  );
}
