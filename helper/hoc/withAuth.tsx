"use client";
import { useUserContext } from "@/context/AuthenticatedContext";
import { getAuthRedirect, withAuthRedirect } from "@/lib/auth-redirect";
import Loading from "@/utils/Loading";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
    const searchParams = useSearchParams();
    const redirect = getAuthRedirect(searchParams);
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
            } else if (
              !user.onboarding?.onboardingCompleted &&
              !user.onboarding?.onboardingSkipped
            ) {
              // Verified but not onboarded - redirect to onboarding
              router.push(withAuthRedirect("/onboarding", redirect));
              return;
            } else {
              // Verified and onboarded - redirect to inspire create
              router.push(redirect);
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

          if (
            !skipOnboardingCheck &&
            !user.onboarding?.onboardingCompleted &&
            !user.onboarding?.onboardingSkipped
          ) {
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
      redirect,
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
          user.onboarding?.onboardingSkipped ||
          pathname === "/onboarding")
      ) {
        return <Component {...props} />;
      }
    }

    return null;
  };
}

export default withAuth;
