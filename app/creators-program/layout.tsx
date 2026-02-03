import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creators Program - Gennit AI",
  description:
    "Join the Gennit AI Creators Program. Monetize your designs and templates.",
};

export default function CreatorsProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
