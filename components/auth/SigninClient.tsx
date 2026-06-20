"use client";
import { LoginComp } from "@/components/auth/Login";
import withAuth from "@/helper/hoc/withAuth";

const SigninClient = () => {
  return <LoginComp />;
};

export default withAuth(SigninClient, true);
