"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import Loading from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

const ResetPassword = () => {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const [otpValue, setOtpValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [step, setStep] = useState<"verify" | "reset">("verify");

  useEffect(() => {
    // If no email parameter, redirect to recover page
    if (!email) {
      router.push("/recover");
    }
  }, [email, router]);

  const handleVerifyCode = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code", {
        duration: 3000,
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiResponse.post(`auth/verifypasswordresetoken`, {
        token: otpValue,
      });

      if (response.status === 200) {
        toast.success(
          "Code verified successfully! Please enter your new password.",
          {
            duration: 3000,
          }
        );
        setStep("reset");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Invalid verification code";
      toast.error(errorMessage, {
        duration: 3000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        duration: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        duration: 3000,
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiResponse.post(`auth/updatepassword`, {
        token: otpValue,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        toast.success(
          "Password reset successfully! You can now log in with your new password.",
          {
            duration: 3000,
          }
        );

        // Redirect to signin page
        router.push("/signin");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage, {
        duration: 3000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      const response = await apiResponse.post(`auth/forgot-password`, {
        email: email,
      });

      if (response.status === 200) {
        toast.success("A new reset code has been sent to your email", {
          duration: 3000,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to resend reset code";
      toast.error(errorMessage, {
        duration: 3000,
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex justify-center items-center min-h-[100vh] overflow-hidden w-full bg-white dark:bg-black">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center min-h-[100vh] overflow-hidden w-full bg-white dark:bg-black">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center">
              <Logo className="w-14 h-14" />
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Gennit
              </h1>
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter the 6-digit verification code sent to{" "}
              <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === "verify" ? (
              <>
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
                    onClick={handleVerifyCode}
                    disabled={otpValue.length !== 6 || isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? "Verifying..." : "Verify Code"}
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
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleResetPassword}
                  disabled={!newPassword || !confirmPassword || isVerifying}
                  className="w-full"
                >
                  {isVerifying ? "Resetting..." : "Reset Password"}
                </Button>
              </>
            )}

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Remember your password?{" "}
                <button
                  onClick={() => router.push("/signin")}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
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

export default ResetPassword;
