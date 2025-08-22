"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MainContent } from "@/components/layout/main-content";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { useRef, useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import Loading from "@/utils/Loading";

export default function ChatPageForAuthenticatedUsers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useUserContext();
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Global timeout for auth loading
  useEffect(() => {
    const authTimeout = setTimeout(() => {
      if (loading) {
        console.log("Auth loading timeout, redirecting to signin");
        router.push("/signin");
      }
    }, 10000); // 10 second timeout for auth loading

    return () => clearTimeout(authTimeout);
  }, [loading, router]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (loading) return;

      if (!user) {
        console.log("No user found, redirecting to signin");
        router.push("/signin");
        return;
      }

      // Check if user is verified
      if (!user.emailVerified) {
        router.push("/verify-account");
        return;
      }

      try {
        const response = await fetch("/api/business-profile");
        if (response.ok) {
          const result = await response.json();
          // Check if user has completed onboarding
          if (!result.data?.onboardingCompleted) {
            console.log("User has not completed onboarding, redirecting...");
            router.push("/onboarding");
            return;
          }
          console.log("User has completed onboarding, allowing access to chat");
        } else {
          // If API returns error, assume user needs onboarding
          console.log("API error, redirecting to onboarding");
          router.push("/onboarding");
          return;
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // On error, redirect to onboarding as fallback
        router.push("/onboarding");
        return;
      }

      setIsCheckingOnboarding(false);
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log("Onboarding check timeout, redirecting to onboarding");
      setIsCheckingOnboarding(false);
      router.push("/onboarding");
    }, 3000); // 3 second timeout - more aggressive

    checkOnboardingStatus();

    return () => clearTimeout(timeoutId);
  }, [user, loading, router]);

  // Show loading while checking onboarding status
  if (loading || isCheckingOnboarding) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loading />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Checking access...
        </p>
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
