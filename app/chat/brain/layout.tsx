import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Brain - Genit AI",
  description: "Your personalized AI workspace and memory.",
};

export default function BrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
