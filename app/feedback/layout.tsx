import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Requests & Support | Genit AI",
  description:
    "Report a problem, get help with your account or billing, or suggest a feature or integration for Genit.",
  keywords: [
    "feature requests",
    "Genit support",
    "product suggestions",
    "AI marketing feedback",
    "developer requests",
  ],
  alternates: { canonical: "/feedback" },
  openGraph: {
    title: "Feature Requests & Support | Genit AI",
    description:
      "Report a problem, ask for help, or suggest a feature for Genit.",
    url: "https://www.trygenit.com/feedback",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Genit Feature Requests & Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Feature Requests & Support | Genit AI",
    description:
      "Report a problem, ask for help, or suggest a feature for Genit.",
    images: ["/opengraph-image.png"],
  },
};

export default function FeedbackLayout({
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
