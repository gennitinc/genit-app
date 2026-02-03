import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support - Gennit AI",
  description:
    "Get in touch with the Gennit AI team. We are here to help with any questions or support you need.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
