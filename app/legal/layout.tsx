import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal & Privacy - Gennit AI",
  description:
    "Read our Terms of Service, Privacy Policy, and other legal documents regarding Gennit AI usage.",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">{children}</div>
  );
}
