import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates Library - Genit AI",
  description:
    "Start your design with professionally crafted AI templates. Customize images and videos in seconds.",
  keywords: ["AI templates", "design templates", "video templates"],
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
