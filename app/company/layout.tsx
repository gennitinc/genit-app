import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Genit | AI Marketing Execution Platform",
  description:
    "Learn about Genit's mission to give businesses an autonomous AI marketing team for planning, creation, automation, publishing, communication, and growth.",
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
