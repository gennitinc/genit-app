"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MainContent } from "@/components/layout/main-content";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { useRef, useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import Loading from "@/utils/Loading";
import withAuth from "@/helper/hoc/withAuth";
import { shouldRedirectToOnboarding } from "@/utils/onboardingUtils";

function ChatPageForAuthenticatedUsers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useUserContext();
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Check onboarding status and redirect if needed
  useEffect(() => {
    const checkOnboardingAndRedirect = async () => {
      if (loading) return; // Wait for auth to load

      if (!user) {
        router.push("/signin");
        return;
      }

      if (hasRedirected) return; // Prevent multiple redirects

      try {
        // Check if user should be redirected to onboarding
        const needsOnboarding = await shouldRedirectToOnboarding();

        if (needsOnboarding) {
          // User hasn't completed onboarding, redirect to onboarding
          console.log(
            "User hasn't completed onboarding, redirecting to onboarding"
          );
          setHasRedirected(true);
          router.push("/onboarding");
        } else {
          // User has completed onboarding, allow access to chat
          console.log("User has completed onboarding, allowing access to chat");
          setIsCheckingOnboarding(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // If there's an error, assume onboarding is needed
        setHasRedirected(true);
        router.push("/onboarding");
      }
    };

    checkOnboardingAndRedirect();
  }, [user, loading, router, hasRedirected]);

  // Show loading while checking onboarding status
  if (isCheckingOnboarding) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex relative w-full h-screen overflow-hidden">
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container"
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <div
          id="main-content"
          className="flex-1"
          style={{
            // Optimize rendering performance
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default withAuth(ChatPageForAuthenticatedUsers);
