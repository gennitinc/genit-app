"use client";

// import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { useUserContext } from "@/context/AuthenticatedContext";
// Onboarding removed: no onboarding redirect util needed
import Loading from "@/utils/Loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      <div className='flex h-screen w-full items-center justify-center bg-white dark:bg-black'>
        <Loading />
      </div>
    );
  }

  // If no user, show landing page
  if (!user) {
    return <LandingPage />;
  }

  // This should not be reached as authenticated users get redirected
  return (
    <div className='flex h-screen items-center justify-center bg-white dark:bg-black'>
      <Loading />
    </div>
  );
}

export default Page;
