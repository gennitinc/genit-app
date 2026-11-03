import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Genit",
  description:
    "Genit is an AI marketing workspace for small teams: design, video, posting, inbox, campaigns, and automation in one place, built around your brand.",
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
