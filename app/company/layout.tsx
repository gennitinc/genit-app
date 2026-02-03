import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Gennit AI",
  description:
    "Learn about Gennit AI, our mission to democratize design through artificial intelligence, and the team behind the platform.",
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
