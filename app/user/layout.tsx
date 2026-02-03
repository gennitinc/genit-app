import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Settings - Gennit AI",
  description: "Manage your account, subscription, and preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
