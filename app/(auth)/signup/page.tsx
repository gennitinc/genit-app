import SignupClient from "@/components/auth/SignupClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up – Genit AI",
  description:
    "Create your Genit account and start planning, creating, publishing, and optimizing marketing with autonomous AI agents.",
  robots: {
    index: false,
    follow: false,
  },
};

const Signup = () => {
  return <SignupClient />;
};

export default Signup;
