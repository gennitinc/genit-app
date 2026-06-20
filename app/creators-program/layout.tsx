import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creators Program - Genit AI",
  description:
    "Join the Genit AI Creators Program. Monetize your designs and templates.",
};

export default function CreatorsProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
