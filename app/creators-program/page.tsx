"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { JoinReferralCard } from "@/components/referral/join-referral-card";
import { Toaster } from "@/components/ui/sonner";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";

export default function ReferralLandingPage() {
  const router = useRouter();
  const { user } = useUserContext();

  const handleJoinSuccess = () => {
    // Redirect to the referral dashboard after successful join
    router.push("/user/referral");
  };

  return (
    <div className='flex min-h-screen w-full flex-col bg-white dark:bg-black'>
      <Toaster />
      <LandingNavbar />
      <main className='relative flex-grow'>
        <div className='w-full'>
          <JoinReferralCard onJoinSuccess={handleJoinSuccess} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
