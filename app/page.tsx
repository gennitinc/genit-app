"use client";

import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOnboardingRedirectPath } from "@/utils/onboardingUtils";
import Loading from "@/utils/Loading";
import { LandingPage } from "@/components/landing/landing-page";

function Page() {
  const { user, loading } = useUserContext();
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingAndRedirect = async () => {
      // If still loading, wait
      if (loading) return;

      // If no user, show landing page (no redirect needed)
      if (!user) {
        setIsCheckingOnboarding(false);
        return;
      }

      try {
        // Get the appropriate redirect path based on onboarding status
        const redirectPath = await getOnboardingRedirectPath();
        console.log(`Redirecting to: ${redirectPath}`);
        router.push(redirectPath);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // If there's an error, assume onboarding is needed
        router.push("/onboarding");
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingAndRedirect();
  }, [user, loading, router]);

  // Show loading while checking authentication and onboarding status
  if (loading || isCheckingOnboarding) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="flex items-center justify-center h-screen">
      <Loading />
    </div>
  );
}

export default Page;
