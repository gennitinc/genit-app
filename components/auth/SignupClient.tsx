"use client";
import withAuth from "@/helper/hoc/withAuth";
import { SignupComp } from "@/components/auth/Signup";

const SignupClient = () => {
  return <SignupComp />;
};

export default withAuth(SignupClient, true);
