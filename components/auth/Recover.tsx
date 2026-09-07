"use client";

import { LocalizedText } from "@/components/localized-text";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthRedirect, withAuthRedirect } from "@/lib/auth-redirect";
import { AuthTypes, RegexType } from "@/types/Authtypes";
import Loading from "@/utils/Loading";
import { EMAIL_REGEX } from "@/utils/Regex";
import { apiResponse } from "@/utils/apiResponse";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import React from "react";

export const RecoverComp = () => {
  const searchParams = useSearchParams();
  const redirect = getAuthRedirect(searchParams);
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
        window.location.href = withAuthRedirect(
          `/reset-password?email=${encodeURIComponent(formData.email)}`,
          redirect
        );
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-[100vh] w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-black'>
      <Card className='mx-4 w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mt-4 flex items-center justify-center gap-2'>
            <Logo />
            <h1 className='text-foreground text-2xl font-semibold tracking-tight'>
              <LocalizedText text={"Genit"} />
            </h1>
          </div>
          <CardTitle className='text-2xl font-bold'>
            <LocalizedText text={"Recover your account"} />
          </CardTitle>
          <CardDescription>
            <LocalizedText
              text={
                "Enter the email address associated with your account and we'll send you instructions to reset your password."
              }
            />
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Form */}
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <div className='relative'>
                <input
                  type='email'
                  name='email'
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
                  className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 pl-11 text-sm text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-cyan-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100'
                  placeholder='Enter email'
                />
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                  <svg
                    className='h-4 w-4 text-gray-500 dark:text-neutral-400'
                    xmlns='http://www.w3.org/2000/svg'
                    width={24}
                    height={24}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
                    <polyline points='22,6 12,13 2,6' />
                  </svg>
                </div>
              </div>
              {errorMsg.email && formData.email && (
                <p className='text-TextLight2 dark:text-TextDark2 mt-1 text-xs'>
                  {errorMsg.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={!allFieldsValid || loading}
              className='focus:ring-primary/30 dark:focus:ring-primary/40 w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 focus:ring-4 focus:outline-none'
            >
              {loading ? (
                <div className='flex items-center justify-center'>
                  <Loading size={20} />
                  <LocalizedText text={"Sending..."} />
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          {/* Divider */}
          <hr className='my-6 border-t border-gray-300 dark:border-neutral-800' />

          {/* Sign In Link */}
          <div className='text-center'>
            <span className='text-muted-foreground text-sm'>
              <LocalizedText text={"Remember your login details?"} />{" "}
              <Link
                href={withAuthRedirect("/signin", redirect)}
                className='text-TextLight2 dark:text-TextDark2 font-medium underline hover:no-underline'
              >
                <LocalizedText text={"Sign In"} />
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>

      <div className='mt-5 w-full max-w-[26rem] space-y-3'>
        <p className='text-center text-xs leading-relaxed text-gray-600 dark:text-gray-400'>
          <LocalizedText text={"This site is protected by reCAPTCHA and our"} />{" "}
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
  );
};
