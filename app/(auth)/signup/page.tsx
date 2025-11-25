"use client";
import type { Metadata } from "next";
import withAuth from "@/helper/hoc/withAuth";
import { SignupComp } from "@/components/auth/Signup";

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
  return <SignupComp />;
};

export default withAuth(Signup, true);
