"use client";
import Link from "next/link";
import React from "react";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/Regex";
import { apiResponse } from "@/utils/apiResponse";
import { toast } from "sonner";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import cookie from "js-cookie";
import dynamic from "next/dynamic";
import { Logo } from "@/components/logo";
import { RegexType, AuthTypes } from "@/types/Authtypes";
import withAuth from "@/helper/hoc/withAuth";

// import { LoginSocialGoogle, LoginSocialGithub } from "reactjs-social-login";

const LoginSocialGoogle = dynamic(
  () => import("reactjs-social-login").then((mod) => mod.LoginSocialGoogle),
  {
    ssr: false,
  }
) as React.ComponentType<{
  client_id: string;
  redirect_uri: string;
  scope: string;
  discoveryDocs: string;
  access_type: string;
  onLoginStart: () => boolean;
  onResolve: ({ provider, data }: any) => void;
  onReject: (err: any) => void;
  className: string;
}>;

export const LoginComp = () => {
  const { fetchCurrentUser } = useUserContext();
  const [formData, setFormdata] = React.useState<AuthTypes>({
    email: "",
    password: "",
  });

  const [errorMsg, seterrorMsg] = React.useState<AuthTypes>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const [loading2, setLoading2] = React.useState<boolean>(false);
  const [loading3, setLoading3] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const router = useRouter();

  const handleInputChange = (Event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = Event.target;

    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  const SignupValidate = (regexprops: RegexType) => {
    if (!regexprops.regex.test(regexprops.value)) {
      seterrorMsg((errorprops) => ({
        ...errorprops,
        [regexprops.fieldname]: regexprops.errormsg,
      }));
    } else {
      seterrorMsg((errorprops) => ({
        ...errorprops,
        [regexprops.fieldname]: "",
      }));
    }
  };

  const allfieldvalid = Object.keys(errorMsg).every(
    (field) => !errorMsg[field as keyof typeof errorMsg]
  );

  const HandleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await apiResponse.post("/auth/sign-in", formData, {
        withCredentials: true,
      });

      console.log(response);
      if (response.status === 200) {
        toast.success("Logged in Successfully");

        const longerEXP = 1000 * 60 * 60 * 24 * 30;

        cookie.set("gennituToken", response.data.token, {
          expires: new Date(Date.now() + longerEXP),
          // secure: true,
          // sameSite: "strict",
        });

        // Fetch current user data
        await fetchCurrentUser();

        // Check verification and onboarding status, redirect accordingly
        const userData = await apiResponse.get("/user/active-user");
        const currentUser = userData.data.user;

        if (!currentUser.emailVerified) {
          // Not verified - redirect to verification
          router.push(`/account/verify?email=${encodeURIComponent(currentUser.email)}`);
        } else if (!currentUser.onboarding?.onboardingCompleted) {
          // Verified but not onboarded - redirect to onboarding
          router.push("/onboarding");
        } else {
          // Verified and onboarded - go to chat
          router.push("/chat");
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error?.message);

      toast.error(error?.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (provider: string, data: any) => {
    setLoading2(true);

    const Formdata = {
      email: data.email,
      username: data.name,
      userdp: data.picture,
      password: data.sub + data.email,
    };

    if (data.email_verified === true) {
      try {
        const response = await apiResponse.post("auth/google", Formdata, {
          withCredentials: true,
        });

        console.log(response);
        if (response.status === 200) {
          // Check if it's a new sign-up or existing sign-in based on response message
          const isNewUser = response.data.message?.includes("created") || 
                           response.data.message?.includes("Account created");
          
          toast.success(
            isNewUser 
              ? "Account Created Successfully!" 
              : "Logged in Successfully"
          );

          const longerEXP = 1000 * 60 * 60 * 24 * 30;

          cookie.set("gennituToken", response.data.token, {
            expires: new Date(Date.now() + longerEXP),
            // secure: true,
            // sameSite: "strict",
          });

          // Fetch current user data
          await fetchCurrentUser();

          // Check verification and onboarding status, redirect accordingly
          const userData = await apiResponse.get("/user/active-user");
          const currentUser = userData.data.user;

          if (!currentUser.emailVerified) {
            // Not verified - redirect to verification
            router.push(
              `/account/verify?email=${encodeURIComponent(currentUser.email)}`
            );
          } else if (!currentUser.onboarding?.onboardingCompleted) {
            // Verified but not onboarded - redirect to onboarding
            router.push("/onboarding");
          } else {
            // Verified and onboarded - go to chat
            router.push("/chat");
          }
        }
      } catch (error: any) {
        setLoading2(false);
        console.log(error?.message);

        toast.error(error?.response?.data.message);
      } finally {
        setLoading2(false);
      }
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
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to continue using Gennit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Social Login Buttons */}
          <div className="space-y-1">
            <LoginSocialGoogle
              {...{
                client_id: process.env.NEXT_PUBLIC_GG_APP_ID || "",
                redirect_uri:
                  typeof window !== "undefined"
                    ? window.location.origin
                    : "http://gennit.app" + "/auth/google/callback",
                scope: "openid profile email",
                discoveryDocs: "claims_supported",
                access_type: "online",
                onLoginStart: () => {
                  setLoading2(true);
                  return false;
                },
                onResolve: ({ provider, data }: any) => {
                  handleGoogleSignIn(provider, data);
                },
                onReject: (err: any) => {
                  console.log(err);
                  setLoading2(false);
                },
                className: "w-full",
              }}
            >
              <Button
                type="button"
                variant="outline"
                className="w-full relative overflow-hidden transition-all hover:border-primary/50 hover:bg-primary/10 dark:bg-primary/10"
                disabled={loading2}
              >
                {loading2 ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin mr-2 h-4 w-4 text-gray-600"
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
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      version="1.1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 48 48"
                      enableBackground="new 0 0 48 48"
                      className="mr-2 w-4 h-4"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      ></path>
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      ></path>
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                    </svg>
                    Continue with Google
                  </div>
                )}
              </Button>
            </LoginSocialGoogle>
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <hr className="flex-grow border-t border-gray-300 dark:border-neutral-800" />
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
              Or sign up with
            </span>
            <hr className="flex-grow border-t border-gray-300 dark:border-neutral-800" />
          </div>

          {/* Form */}
          <form className="space-y-4 mt-5" onSubmit={HandleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    onChange={(Event: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange(Event);
                      const regexprops: RegexType = {
                        fieldname: Event.target.name,
                        value: Event.target.value,
                        errormsg:
                          "Please include a valid email address to login",
                        regex: EMAIL_REGEX,
                      };
                      SignupValidate(regexprops);
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
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                  </div>
                </div>
                {errorMsg.email && formData.email && (
                  <p className="text-xs text-TextLight2 dark:text-TextDark2 mt-1">
                    {errorMsg.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    name="password"
                    onChange={(Event: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange(Event);
                      const regexProps: RegexType = {
                        fieldname: "password",
                        regex: PASSWORD_REGEX,
                        value: Event.target.value,
                        errormsg: "8+ characters required",
                      };
                      SignupValidate(regexProps);
                    }}
                    className="w-full py-3 px-4 pl-11 pr-11 border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    placeholder="Enter password"
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
                      <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
                      <circle cx="16.5" cy="7.5" r=".5" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
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
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
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
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errorMsg.password && formData.password && (
                  <p className="text-xs text-TextLight2 dark:text-TextDark2 mt-1">
                    {errorMsg.password}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all"
              type="submit"
              disabled={!allfieldvalid || loading}
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
                  Signing in...
                </div>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center text-sm text-muted-foreground my-4 w-full flex flex-col items-center justify-center gap-1">
            {/* Sign Up Link */}
            <div>
              <span> Don't have an account? </span>

              <Link
                href="/signup"
                className="font-medium text-TextLight2 dark:text-TextDark2 underline hover:no-underline"
                prefetch={false}
              >
                Sign Up
              </Link>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <span> Forgot password? </span>
              <Link
                href="/recover"
                className="text-sm font-medium text-TextLight2 dark:text-TextDark2 underline hover:no-underline"
                prefetch={false}
              >
                recover
              </Link>
            </div>
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
  );
};
