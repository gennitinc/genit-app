import { LoginComp } from "@/components/auth/Login";
import withAuth from "@/helper/hoc/withAuth";
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
  return <LoginComp />;
};

export default withAuth(Login, true);
