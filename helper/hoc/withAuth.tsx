"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { getOnboardingRedirectPath } from "@/utils/onboardingUtils";
import Loading from "@/utils/Loading";

function withAuth(
  Component: React.ComponentType<any>,
  isAuthPage: boolean = false,
  skipOnboardingCheck: boolean = false
) {
  return function Hoc(props: any) {
    const { user, loading, setLoading } = useUserContext();
    const router = useRouter();
    const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);

    useEffect(() => {
      const handleAuthAndOnboarding = async () => {
        if (isAuthPage) {
          // For auth pages: if user exists, check onboarding and redirect appropriately
          if (!loading && user) {
            setLoading(false);

            if (!skipOnboardingCheck) {
              try {
                setIsCheckingOnboarding(true);
                const redirectPath = await getOnboardingRedirectPath();
                router.push(redirectPath);
              } catch (error) {
                console.error("Error checking onboarding status:", error);
                router.push("/onboarding");
              } finally {
                setIsCheckingOnboarding(false);
              }
            } else {
              router.push("/chat");
            }
            return;
          }
        } else {
          // For protected pages: if no user, redirect to /signin
          if (!loading && !user) {
            setLoading(false);
            router.push("/signin");
            return;
          }
        }
      };

      handleAuthAndOnboarding();
    }, [loading, user, router, setLoading, isAuthPage, skipOnboardingCheck]);

    if (loading || isCheckingOnboarding) {
      return (
        <div className="flex justify-center items-center min-h-[100dvh] overflow-hidden w-full bg-black">
          <Loading />
        </div>
      );
    }

    if (isAuthPage) {
      // For auth pages: render if no user
      if (!loading && !user) {
        setLoading(false);
        return <Component {...props} />;
      }
    } else {
      // For protected pages: render if user exists
      if (!loading && user) {
        setLoading(false);
        return <Component {...props} />;
      }
    }

    return null;
  };
}

export default withAuth;
