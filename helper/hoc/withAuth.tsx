"use client";
import { useUserContext } from "@/context/AuthenticatedContext";
import Loading from "@/utils/Loading";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function withAuth(
  Component: React.ComponentType<any>,
  isAuthPage: boolean = false,
  skipOnboardingCheck: boolean = false
) {
  return function Hoc(props: any) {
    const { user, loading, setLoading } = useUserContext();
    const router = useRouter();
    const pathname = usePathname();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
      const handleAuthAndOnboarding = async () => {
        if (loading) {
          return; // Wait for auth to finish loading
        }

        if (isAuthPage) {
          // For auth pages (signin, signup, etc.): if user exists and is verified, redirect based on onboarding status
          if (user) {
            if (!user.emailVerified) {
              // Not verified - stay on auth page
              setIsCheckingAuth(false);
              return;
            } else if (!user.onboarding?.onboardingCompleted) {
              // Verified but not onboarded - redirect to onboarding
              router.push("/onboarding");
              return;
            } else {
              // Verified and onboarded - redirect to inspire create
              router.push("/chat");
              return;
            }
          }
          // No user - allow access to auth page
          setIsCheckingAuth(false);
        } else {
          // For protected pages: check authentication and onboarding
          if (!user) {
            // No user - redirect to signin
            router.push("/signin");
            return;
          }

          // User exists - check verification and onboarding
          if (!user.emailVerified) {
            // Not verified - redirect to verification
            router.push(
              `/account/verify?email=${encodeURIComponent(user.email)}`
            );
            return;
          }

          if (!skipOnboardingCheck && !user.onboarding?.onboardingCompleted) {
            // Verified but not onboarded - redirect to onboarding
            // Exception: if already on onboarding page, allow access
            if (pathname !== "/onboarding") {
              router.push("/onboarding");
              return;
            }
          }

          // User is verified and (onboarded or skipOnboardingCheck is true) - allow access
          setIsCheckingAuth(false);
        }
      };

      handleAuthAndOnboarding();
    }, [
      loading,
      user,
      router,
      setLoading,
      isAuthPage,
      skipOnboardingCheck,
      pathname,
    ]);

    if (loading || isCheckingAuth) {
      return (
        <div className='flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-black'>
          <Loading />
        </div>
      );
    }

    if (isAuthPage) {
      // For auth pages: render if no user or user not verified
      if (!loading && (!user || !user.emailVerified)) {
        setLoading(false);
        return <Component {...props} />;
      }
    } else {
      // For protected pages: render if user exists, is verified, and (onboarded or skipOnboardingCheck)
      if (
        !loading &&
        user &&
        user.emailVerified &&
        (skipOnboardingCheck ||
          user.onboarding?.onboardingCompleted ||
          pathname === "/onboarding")
      ) {
        setLoading(false);
        return <Component {...props} />;
      }
    }

    return null;
  };
}

export default withAuth;
