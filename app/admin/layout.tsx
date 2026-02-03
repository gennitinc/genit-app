import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Gennit AI",
  description:
    "Gennit AI Administration Dashboard for managing models, presenters, and content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin specific wrapper or sidebar could go here */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
