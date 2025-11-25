"use client";
import withAuth from "@/helper/hoc/withAuth";
import { LoginComp } from "@/components/auth/Login";

const SigninClient = () => {
  return <LoginComp />;
};

export default withAuth(SigninClient, true);
