"use client";
import React, { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useRouter, useSearchParams } from "next/navigation";
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from "notistack";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthenticatedContext";
import { createClient } from "@/lib/supabase";

export default function VerifyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useUserContext();
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verified" | "expired" | "error"
  >("pending");

  // Check for verification token in URL
  const code = searchParams.get("code");
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const pending = searchParams.get("pending");

  useEffect(() => {
    console.log("Verify account - Loading:", loading, "User:", user);

    // If still loading, wait
    if (loading) {
      return;
    }

    // If user exists and is verified, redirect to onboarding or chat
    if (user && user.emailVerified) {
      console.log("User is verified, checking onboarding status");
      checkOnboardingStatus();
    } else if (user) {
      console.log("User is not verified, setting email for resend");
      // Set email for resend functionality
      setEmail(user.email || "");
    }
    // If no user, don't redirect - let them stay on the page
  }, [user, loading, router]);

  // Handle verification from URL token
  useEffect(() => {
    if (code) {
      handleEmailVerification(code);
    } else if (token && type === "signup") {
      handleEmailVerification(token);
    } else if (pending === "true") {
      setVerificationStatus("pending");
    }
  }, [code, token, type, pending]);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch("/api/business-profile");
      if (response.ok) {
        const result = await response.json();
        if (result.data?.onboardingCompleted) {
          console.log("User has completed onboarding, redirecting to chat");
          router.push("/chat");
        } else {
          console.log(
            "User has not completed onboarding, redirecting to onboarding"
          );
          router.push("/onboarding");
        }
      } else {
        // If no business profile exists, redirect to onboarding
        console.log("No business profile found, redirecting to onboarding");
        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // On error, redirect to onboarding as fallback
      router.push("/onboarding");
    }
  };

  const handleEmailVerification = async (verificationToken: string) => {
    try {
      const supabase = createClient();

      // Check if this is a code or token
      const isCode = verificationToken.includes("-"); // UUID format like fc8f9f8b-5b16-4da6-ba0c-1663d2117dd3

      let data, error;

      if (isCode) {
        // Handle verification code
        const result =
          await supabase.auth.exchangeCodeForSession(verificationToken);
        data = result.data;
        error = result.error;
      } else {
        // Handle verification token (for both signup and magic link)
        // Try signup first, then magic link if that fails
        let result = await supabase.auth.verifyOtp({
          token: verificationToken,
          type: "signup",
          email: email || user?.email || "",
        });

        if (result.error) {
          // If signup verification fails, try magic link
          result = await supabase.auth.verifyOtp({
            token: verificationToken,
            type: "magiclink",
            email: email || user?.email || "",
          });
        }

        data = result.data;
        error = result.error;
      }

      if (error) {
        throw error;
      }

      if (data.user) {
        setVerificationStatus("verified");
        enqueueSnackbar("Email verified successfully! Redirecting...", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          action: (key) => (
            <button onClick={() => closeSnackbar(key)}>
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ),
        });

        // Force page reload to refresh auth context
        setTimeout(() => {
          window.location.href = "/onboarding";
        }, 2000);
      }
    } catch (error: any) {
      console.error("Verification error:", error);

      // Check if link is expired
      if (
        error?.message?.includes("expired") ||
        error?.message?.includes("invalid") ||
        error?.status === 400
      ) {
        setVerificationStatus("expired");
      } else {
        setVerificationStatus("error");
      }

      enqueueSnackbar(
        error?.message || "Failed to verify email. Please try again.",
        {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          action: (key) => (
            <button onClick={() => closeSnackbar(key)}>
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ),
        }
      );
    }
  };

  const handleResendVerification = async () => {
    const emailToUse = email || user?.email;
    if (!emailToUse) {
      enqueueSnackbar("Email not found. Please sign in again.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
      return;
    }

    setIsResending(true);
    try {
      const supabase = createClient();

      // Send magic link for email verification
      const { error } = await supabase.auth.signInWithOtp({
        email: emailToUse,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-account?pending=true`,
        },
      });

      if (error) {
        throw error;
      }

      enqueueSnackbar("Magic link sent! Please check your inbox.", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        action: (key) => (
          <button onClick={() => closeSnackbar(key)}>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ),
      });

      // Reset status to pending after resending
      setVerificationStatus("pending");
    } catch (error: any) {
      console.error("Resend error:", error);
      enqueueSnackbar(
        error?.message || "Failed to send magic link. Please try again.",
        {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          action: (key) => (
            <button onClick={() => closeSnackbar(key)}>
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ),
        }
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Only show loading if we're actively checking onboarding status
  if (loading && user?.emailVerified) {
    return (
      <div className="bg-BackgroundLight dark:bg-BackgroundDark">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-BackgroundLight dark:bg-BackgroundDark">
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-BackgroundLight dark:bg-BackgroundDark px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Verify Account Card */}
        <div className="w-full max-w-[26rem] space-y-2 border border-gray-200 dark:border-neutral-800 py-8 px-6 rounded-xl shadow-sm bg-BackgroundLight2 dark:bg-neutral-900">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <Logo className="w-14 h-14" />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Gennit
            </h1>
          </div>

          {/* Header */}
          <div className="text-center space-y-2 mt-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {verificationStatus === "verified" && "Email Verified!"}
              {verificationStatus === "expired" && "Link Expired"}
              {verificationStatus === "error" && "Verification Error"}
              {(verificationStatus === "pending" || !verificationStatus) &&
                "Verify your email"}
            </h1>
            <p className="text-sm text-muted-foreground text-gray-600 dark:text-gray-400">
              {verificationStatus === "verified" &&
                "Your email has been verified successfully!"}
              {verificationStatus === "expired" &&
                "The verification link has expired. Please request a new one."}
              {verificationStatus === "error" &&
                "There was an error verifying your email. Please try again."}
              {(verificationStatus === "pending" || !verificationStatus) &&
                "We've sent a verification link to your email address."}
            </p>
          </div>

          {/* Email Display */}
          {email && (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sent to:{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {email}
                </span>
              </p>
            </div>
          )}

          {/* Email Icon */}
          <div className="flex justify-center mt-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                verificationStatus === "verified"
                  ? "bg-green-100 dark:bg-green-900/20"
                  : verificationStatus === "expired"
                    ? "bg-red-100 dark:bg-red-900/20"
                    : verificationStatus === "error"
                      ? "bg-red-100 dark:bg-red-900/20"
                      : "bg-cyan-100 dark:bg-cyan-900/20"
              }`}
            >
              {verificationStatus === "verified" ? (
                <svg
                  className="w-10 h-10 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : verificationStatus === "expired" ||
                verificationStatus === "error" ? (
                <svg
                  className="w-10 h-10 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-10 h-10 text-cyan-600 dark:text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-4 mt-6">
            <div className="space-y-2">
              {verificationStatus === "verified" && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  You will be redirected to onboarding shortly...
                </p>
              )}
              {verificationStatus === "expired" && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  The verification link has expired. Please request a new
                  verification email.
                </p>
              )}
              {verificationStatus === "error" && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  There was an error verifying your email. Please try requesting
                  a new verification email.
                </p>
              )}
              {(verificationStatus === "pending" || !verificationStatus) && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please check your email and click the verification link to
                    continue.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Didn't receive the email? Check your spam folder or try
                    resending.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-6">
            {verificationStatus === "verified" ? (
              <Button
                onClick={() => (window.location.href = "/onboarding")}
                className="w-full text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all"
              >
                Continue to Onboarding
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </div>
                  ) : verificationStatus === "expired" ||
                    verificationStatus === "error" ? (
                    "Request New Verification Email"
                  ) : (
                    "Resend verification email"
                  )}
                </Button>

                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all"
                >
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 max-w-md w-full space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            This site is protected by reCAPTCHA and subject to our{" "}
            <a
              href="#"
              className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
            >
              Privacy
            </a>{" "}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            ©2025 Gennit. A product of{" "}
            <a
              className="text-gray-800 dark:text-white font-medium hover:text-blue-600"
              href="#"
            >
              Klipto Inc.
            </a>{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
