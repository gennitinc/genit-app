"use client";
import withAuth from "@/helper/hoc/withAuth";
import { RecoverComp } from "@/components/auth/Recover";

const RecoverClient = () => {
  return <RecoverComp />;
};

export default withAuth(RecoverClient, true);
