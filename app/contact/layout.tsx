import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support - Genit AI",
  description:
    "Get in touch with the Genit AI team. We are here to help with any questions or support you need.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
