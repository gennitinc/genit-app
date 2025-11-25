import RecoverClient from "@/components/auth/RecoverClient";
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
  return <RecoverClient />;
};

export default Recover;
