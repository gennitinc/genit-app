import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inspiration Gallery - Genit AI",
  description:
    "Browse a curated collection of AI-generated images and videos for design inspiration.",
  keywords: ["AI inspiration", "design gallery", "creative ideas"],
};

export default function InspirationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
