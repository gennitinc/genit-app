import SignupClient from "@/components/auth/SignupClient";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign Up – Gennit AI",
  description:
    "Create your Gennit AI account and start creating stunning AI-powered media designs.",
  robots: {
    index: false,
    follow: false,
  },
};

const Signup = () => {
  return <SignupClient />;
};

export default Signup;
