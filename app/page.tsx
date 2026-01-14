"use client";

// import type { Metadata } from "next";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Onboarding removed: no onboarding redirect util needed
import Loading from "@/utils/Loading";
import { LandingPage } from "@/components/landing/landing-page";


function Page() {
  const { user, loading } = useUserContext();
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // If still loading, wait
      if (loading) return;

      // If no user, show landing page (no redirect needed)
      if (!user) {
        setIsCheckingOnboarding(false);
       
        return;
      }

      // Authenticated: redirect to the app
      router.push("/chat");
      setIsCheckingOnboarding(false);
    };

    checkAuthAndRedirect();
  }, [user, loading, router]);

  // Show loading while checking authentication and onboarding status
  if (loading || isCheckingOnboarding) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black w-full">
        <LandingPage />
      </div>
    );
  }

  // If no user, show landing page
  if (!user) {
    return <LandingPage />;
  }

  // This should not be reached as authenticated users get redirected
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
      <LandingPage />
    </div>
  );
}

export default Page;
