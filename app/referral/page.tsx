"use client";

import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { JoinReferralCard } from "@/components/referral/join-referral-card";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";

export default function ReferralLandingPage() {
  const router = useRouter();
  const { user } = useUserContext();

  const handleJoinSuccess = () => {
    // Redirect to the referral dashboard after successful join
    router.push("/user/referral");
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col">
      <Toaster />
      <LandingNavbar />
      <main className="flex-grow relative">
        <div className="w-full">
          <JoinReferralCard onJoinSuccess={handleJoinSuccess} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

