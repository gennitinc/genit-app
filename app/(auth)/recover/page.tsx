"use client";
import Link from "next/link";
import React from "react";
import { Logo } from "@/components/logo";
import { EMAIL_REGEX } from "@/utils/Regex";
import { apiResponse } from "@/utils/apiResponse";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthTypes, RegexType } from "@/types/Authtypes";
import withAuth from "@/helper/hoc/withAuth";

const Recover = () => {
  const [formData, setFormdata] = React.useState<AuthTypes>({
    email: "",
  });

  const [errorMsg, setErrorMsg] = React.useState<AuthTypes>({
    email: "",
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  const validateSignup = (regexProps: RegexType) => {
    if (!regexProps.regex.test(regexProps.value)) {
      setErrorMsg((prevErrorMsg) => ({
        ...prevErrorMsg,
        [regexProps.fieldname]: regexProps.errormsg,
      }));
    } else {
      setErrorMsg((prevErrorMsg) => ({
        ...prevErrorMsg,
        [regexProps.fieldname]: "",
      }));
    }
  };

  const allFieldsValid = Object.keys(errorMsg).every(
    (field) => !errorMsg[field as keyof typeof errorMsg]
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await apiResponse.post("auth/forgot-password", formData);

      if (response.status === 200) {
        toast.success(`Password reset code has been sent to your email`);

        // Redirect to password reset verification page
        window.location.href = `/reset-password?email=${encodeURIComponent(formData.email)}`;
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] min-h-[100dvh] overflow-hidden w-full bg-black">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mt-4 gap-2">
            <Logo />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Gennit
            </h1>
          </div>
          <CardTitle className="text-2xl font-bold">
            Recover your account
          </CardTitle>
          <CardDescription>
            Enter the email address associated with your account and we'll send
            you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(event) => {
                    handleInputChange(event);
                    validateSignup({
                      fieldname: event.target.name,
                      value: event.target.value,
                      errormsg: "Please include a valid email address",
                      regex: EMAIL_REGEX,
                    });
                  }}
                  className="w-full py-3 px-4 pl-11 border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  placeholder="Enter email"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-neutral-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>
              {errorMsg.email && formData.email && (
                <p className="text-xs text-TextLight2 dark:text-TextDark2 mt-1">
                  {errorMsg.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!allFieldsValid || loading}
              className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all"
            >
              {loading ? (
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
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          {/* Divider */}
          <hr className="border-t border-gray-300 dark:border-neutral-800 my-6" />

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Remember your login details?{" "}
              <Link
                href="/signin"
                className="font-medium text-TextLight2 dark:text-TextDark2 underline hover:no-underline"
                prefetch={false}
              >
                Sign In
              </Link>
            </span>
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
            Klipto Inc.
          </a>{" "}
          All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default withAuth(Recover, true);
