"use client";
import { RecoverComp } from "@/components/auth/Recover";
import withAuth from "@/helper/hoc/withAuth";

const RecoverClient = () => {
  return <RecoverComp />;
};

export default withAuth(RecoverClient, true);
