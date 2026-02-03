import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community & Inspiration - Gennit AI",
  description:
    "Explore AI-generated art and videos created by the Gennit AI community. Find inspiration for your next project.",
  keywords: [
    "AI art community",
    "AI video inspiration",
    "generative art gallery",
    "Gennit showcase",
  ],
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
