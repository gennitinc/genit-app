"use client";
import { SignupComp } from "@/components/auth/Signup";
import withAuth from "@/helper/hoc/withAuth";

const SignupClient = () => {
  //new
  return <SignupComp />;
};

export default withAuth(SignupClient, true);
