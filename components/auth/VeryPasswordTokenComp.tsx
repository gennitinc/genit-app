"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { apiResponse } from "@/utils/apiResponse";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleCheckIcon, XCircleIcon } from "lucide-react";
import { Logo } from "@/components/logo";

export function VerifyPasswordTokenComp() {
  const searchParams = useSearchParams();
  const token = searchParams.get("resetToken");
  const [loading, setLoading] = React.useState(false);
  const [verifymessage, setverifymessage] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        const response = await apiResponse.post(
          `auth/verifypasswordresetoken`,
          {
            token: token,
          }
        );

        const data = response.data;

        if (response.status === 200) {
          console.log("data", data);
          setLoading(false);
          setverifymessage(data?.message);
          setTimeout(() => {
            router.push(`/auth/updatepassword?token=${token}`);
          }, 1000);
          return;
        } else {
          setLoading(false);
          alert(data.message);
          setTimeout(() => {
            router.push("/auth/recover");
          }, 1000);
          return;
        }
      } catch (error: any) {
        console.log(error);
        setLoading(false);
        setTimeout(() => {
          setError(error?.response?.data.message);
        }, 200);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-BackgroundLight dark:bg-BackgroundDark px-4 py-8 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center">
          <Logo className="w-14 h-14" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Gennit
          </h1>
        </div>
      ) : verifymessage ? (
        <div className="flex min-h-screen flex-col items-center justify-center bg-BackgroundLight dark:bg-BackgroundDark px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Main Card */}
            <div className="bg-BackgroundLight2 dark:bg-BackgroundDark2 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm p-8 text-center space-y-6">
              <div className="flex justify-center items-center">
                <Logo className="w-14 h-14" />
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Gennit
                </h1>
              </div>

              <div className="space-y-4">
                <CircleCheckIcon className="mx-auto h-16 w-16 text-green-500" />
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Verified Successfully
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can now update your password.
                </p>
              </div>

              <Link
                href={`/auth/updatepassword?token=${token}`}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg transition-all"
                prefetch={false}
              >
                Update Password
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-8 space-y-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                This site is protected by reCAPTCHA and subject to the Klip{" "}
                <a
                  href="#"
                  className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
                >
                  Privacy Policy
                </a>{" "}
                &{" "}
                <a
                  href="#"
                  className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
                >
                  Terms of Service
                </a>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                ©2026 Gennit. A product of{" "}
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
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center bg-BackgroundLight dark:bg-BackgroundDark px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Main Card */}
            <div className="bg-BackgroundLight2 dark:bg-BackgroundDark2 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm p-8 text-center space-y-6">
              <div className="flex justify-center">
                <Logo className="w-16 h-16" />
              </div>

              <div className="space-y-4">
                <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Oops, Link has Expired
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You need to request a new verification link.
                </p>
              </div>

              <Link
                href="/auth/recover"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg transition-all"
                prefetch={false}
              >
                Back to Recovery
              </Link>
            </div>

            {/* Footer */}
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
                ©2026 Gennit. A product of{" "}
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
      )}
    </div>
  );
}

export default VerifyPasswordTokenComp;
