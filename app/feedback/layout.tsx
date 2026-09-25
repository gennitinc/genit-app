import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Requests & Support | Genit AI",
  description:
    "Submit feature suggestions, share feedback, or request assistance for Genit's AI marketing agents, automation, campaigns, and integrations.",
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
      "Help shape the future of autonomous marketing. Submit suggestions or reach our engineering and support team.",
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
      "Help shape the future of autonomous marketing. Submit suggestions or reach our engineering and support team.",
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
