
import withAuth from "@/helper/hoc/withAuth";
import { RecoverComp } from "@/components/auth/Recover";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account recovery – Gennit AI",
  description: "Recover your Gennit AI account and access your projects.",
  robots: {
    index: false,
    follow: false,
  },
};


const Recover = () => {
  return <RecoverComp />;
};

export default withAuth(Recover, true);
