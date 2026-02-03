import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In / Sign Up - Gennit AI",
  description:
    "Access your Gennit AI account to start generating stunning AI images and videos. Secure login and registration.",
  openGraph: {
    title: "Sign In / Sign Up - Gennit AI",
    description:
      "Access your Gennit AI account to start generating stunning AI images and videos. Secure login and registration.",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
