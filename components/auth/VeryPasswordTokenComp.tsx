"use client";

import { LocalizedText } from "@/components/localized-text";
import { Logo } from "@/components/logo";
import { apiResponse } from "@/utils/apiResponse";
import { CircleCheckIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

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
          setLoading(false);
          setverifymessage(data?.message);
          setTimeout(() => {
            router.push(`/update-password?token=${token}`);
          }, 1000);
          return;
        } else {
          setLoading(false);
          alert(data.message);
          setTimeout(() => {
            router.push("/recover");
          }, 1000);
          return;
        }
      } catch (error: any) {
        setLoading(false);
        setTimeout(() => {
          setError(error?.response?.data.message);
        }, 200);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className='bg-BackgroundLight dark:bg-BackgroundDark flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
      {loading ? (
        <div className='flex items-center justify-center'>
          <Logo className='h-14 w-14' />
          <h1 className='text-foreground text-2xl font-semibold tracking-tight'>
            <LocalizedText text={"Genit"} />
          </h1>
        </div>
      ) : verifymessage ? (
        <div className='bg-BackgroundLight dark:bg-BackgroundDark flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
          <div className='w-full max-w-md'>
            {/* Main Card */}
            <div className='bg-BackgroundLight2 dark:bg-BackgroundDark2 space-y-6 rounded-xl border border-gray-200 p-8 text-center shadow-sm dark:border-neutral-800'>
              <div className='flex items-center justify-center'>
                <Logo className='h-14 w-14' />
                <h1 className='text-foreground text-2xl font-semibold tracking-tight'>
                  <LocalizedText text={"Genit"} />
                </h1>
              </div>

              <div className='space-y-4'>
                <CircleCheckIcon className='mx-auto h-16 w-16 text-green-500' />
                <h1 className='text-foreground text-2xl font-semibold tracking-tight'>
                  <LocalizedText text={"Verified Successfully"} />
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  <LocalizedText text={"You can now update your password."} />
                </p>
              </div>

              <Link
                href={`/update-password?token=${token}`}
                className='focus:ring-primary/30 dark:focus:ring-primary/40 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 focus:ring-4 focus:outline-none'
              >
                <LocalizedText text={"Update Password"} />
              </Link>
            </div>

            {/* Footer */}
            <div className='mt-8 space-y-3'>
              <p className='text-center text-xs leading-relaxed text-gray-600 dark:text-gray-400'>
                <LocalizedText
                  text={
                    "This site is protected by reCAPTCHA and subject to the Klip"
                  }
                />{" "}
                <a
                  href='#'
                  className='text-TextLight1 dark:text-TextDark1 underline hover:no-underline'
                >
                  <LocalizedText text={"Privacy Policy"} />
                </a>{" "}
                &{" "}
                <a
                  href='#'
                  className='text-TextLight1 dark:text-TextDark1 underline hover:no-underline'
                >
                  <LocalizedText text={"Terms of Service"} />
                </a>
              </p>
              <p className='text-center text-xs text-gray-600 dark:text-gray-400'>
                <LocalizedText text={"©2026 genit. A product of"} />{" "}
                <a
                  className='font-medium text-gray-800 hover:text-blue-600 dark:text-white'
                  href='#'
                >
                  <LocalizedText text={"Klip Inc."} />
                </a>{" "}
                <LocalizedText text={"All rights reserved."} />
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className='bg-BackgroundLight dark:bg-BackgroundDark flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
          <div className='w-full max-w-md'>
            {/* Main Card */}
            <div className='bg-BackgroundLight2 dark:bg-BackgroundDark2 space-y-6 rounded-xl border border-gray-200 p-8 text-center shadow-sm dark:border-neutral-800'>
              <div className='flex justify-center'>
                <Logo className='h-16 w-16' />
              </div>

              <div className='space-y-4'>
                <XCircleIcon className='mx-auto h-16 w-16 text-red-500' />
                <h1 className='text-foreground text-2xl font-semibold tracking-tight'>
                  <LocalizedText text={"Oops, Link has Expired"} />
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  <LocalizedText
                    text={"You need to request a new verification link."}
                  />
                </p>
              </div>

              <Link
                href='/recover'
                className='focus:ring-primary/30 dark:focus:ring-primary/40 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 focus:ring-4 focus:outline-none'
              >
                <LocalizedText text={"Back to Recovery"} />
              </Link>
            </div>

            {/* Footer */}
            <div className='mt-5 w-full max-w-[26rem] space-y-3'>
              <p className='text-center text-xs leading-relaxed text-gray-600 dark:text-gray-400'>
                <LocalizedText
                  text={"This site is protected by reCAPTCHA and our"}
                />{" "}
                <a
                  href='#'
                  className='text-TextLight1 dark:text-TextDark1 underline hover:no-underline'
                >
                  <LocalizedText text={"Policy"} />
                </a>{" "}
                {/* &{" "}
                <a
                  href="#"
                  className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
                >
                  Terms of Service
                </a> */}
              </p>
              <p className='text-center text-xs text-gray-600 dark:text-gray-400'>
                <LocalizedText text={"©2026 genit. A product of"} />{" "}
                <a
                  className='font-medium text-gray-800 hover:text-blue-600 dark:text-white'
                  href='#'
                >
                  <LocalizedText text={"Klip Inc."} />
                </a>{" "}
                <LocalizedText text={"All rights reserved."} />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyPasswordTokenComp;
