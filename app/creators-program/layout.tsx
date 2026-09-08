import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creators Program - Genit AI",
  description:
    "Join the Genit Creators Program, share the AI marketing platform with your audience, and earn through eligible referrals.",
  alternates: { canonical: "/creators-program" },
};

export default function CreatorsProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
