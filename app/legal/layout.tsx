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
    <div className="">{children}</div>
  );
}
