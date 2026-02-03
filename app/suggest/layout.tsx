import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Requests - Gennit AI",
  description:
    "Suggest new features or improvements for Gennit AI. Help us build the future of design.",
};

export default function SuggestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
