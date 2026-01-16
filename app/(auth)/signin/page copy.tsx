import SigninClient from "@/components/auth/SigninClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In – Gennit AI",
  description: "Sign in to your Gennit AI account and access your projects.",
  robots: {
    index: false,
    follow: false,
  },
};

const Login = () => {
  return <SigninClient />;
};

export default Login;
