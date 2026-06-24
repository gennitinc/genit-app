import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presentation Studio - Genit AI",
  description: "Create stunning AI-powered presentations in minutes.",
  keywords: ["AI presentation maker", "slide generator", "pitch deck creator"],
};

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
