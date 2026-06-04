import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Requests - Genit AI",
  description:
    "Suggest new features or improvements for Genit AI. Help us build the future of design.",
};

export default function SuggestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
