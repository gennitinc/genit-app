"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
// Onboarding removed: no longer import or use onboarding utilities
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
          // For auth pages: if user exists, redirect to app (/chat)
          if (!loading && user) {
            setLoading(false);
            router.push("/chat");
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
