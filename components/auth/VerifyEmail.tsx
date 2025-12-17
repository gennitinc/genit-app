"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import Loading from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { useUserContext } from "@/context/AuthenticatedContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "../logo";

const VerifyEmailComp = () => {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const { fetchCurrentUser, loading } = useUserContext();
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // If no email parameter, redirect to signup
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  const handleVerifyEmail = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiResponse.post(`auth/verify-email`, {
        verificationCode: otpValue,
      });

      if (response.status === 200) {
        toast.success("Email verified successfully!");

        // Fetch updated user data
        await fetchCurrentUser();

        // Redirect to onboarding after verification
        router.push("/onboarding");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during verification";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      const response = await apiResponse.post(`auth/verify-email`, {
        email: email,
      });

      if (response.status === 200) {
        toast.success("A new verification code has been sent to your email");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to resend verification code";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex justify-center items-center min-h-[100vh] min-h-[100dvh] overflow-hidden w-full bg-black">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center min-h-[100vh] min-h-[100dvh] overflow-hidden w-full bg-black">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center">
              <Logo className="w-14 h-14" />
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Gennit
              </h1>
            </div>
            <CardTitle className="text-2xl font-bold">
              Verify Your Email
            </CardTitle>
            <CardDescription>
              Enter the 6-digit verification code sent to{" "}
              <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
                disabled={isVerifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleVerifyEmail}
                disabled={otpValue.length !== 6 || isVerifying}
                className="w-full"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>

              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive the code? Check your spam folder or</p>
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-primary hover:underline disabled:opacity-50"
              >
                request a new one
              </button>
            </div>
          </CardContent>
        </Card>
        <div className="mt-5 max-w-[26rem] w-full space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            This site is protected by reCAPTCHA and our{" "}
            <a
              href="#"
              className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
            >
              Policy
            </a>{" "}
            {/* &{" "}
                <a
                  href="#"
                  className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
                >
                  Terms of Service
                </a> */}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            ©2025 Gennit. A product of{" "}
            <a
              className="text-gray-800 dark:text-white font-medium hover:text-blue-600"
              href="#"
            >
              Klip Inc.
            </a>{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailComp;
