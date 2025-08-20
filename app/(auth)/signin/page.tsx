"use client";
import Link from "next/link";
import React from "react";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/Regex";
import { apiResponse } from "@/utils/apiResponse";
import { enqueueSnackbar, closeSnackbar, SnackbarProvider } from "notistack";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import cookie from "js-cookie";
import dynamic from "next/dynamic";
import { Logo } from "@/components/logo";
import { RegexType, AuthTypes } from "@/types/Authtypes";

const Login = () => {
  // const { fetchCurrentUser } = useUserContext();
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
      const response = await apiResponse.post("/auth/login", formData, {
        withCredentials: true,
      });

      console.log(response);
      if (response.status === 200) {
        enqueueSnackbar("Logged in Successfully", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },

          action: (key) => (
            <button onClick={() => closeSnackbar(key)}>
              {" "}
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className=""
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

        const longerEXP = 1000 * 60 * 60 * 24 * 30;

        cookie.set("gennituToken", response.data.token, {
          expires: new Date(Date.now() + longerEXP),
          // secure: true,
          // sameSite: "strict",
        });

        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error?.message);

      enqueueSnackbar(error?.response?.data.message, {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },

        action: (key) => (
          <button onClick={() => closeSnackbar(key)}>
            {" "}
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className=""
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
          enqueueSnackbar("Logged in Successfully", {
            variant: "success",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },

            action: (key) => (
              <button onClick={() => closeSnackbar(key)}>
                {" "}
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className=""
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

          const longerEXP = 1000 * 60 * 60 * 24 * 30;

          cookie.set("gennituToken", response.data.token, {
            expires: new Date(Date.now() + longerEXP),
            // secure: true,
            // sameSite: "strict",
          });

          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
      } catch (error: any) {
        setLoading2(false);
        console.log(error?.message);

        enqueueSnackbar(error?.response?.data.message, {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },

          action: (key) => (
            <button onClick={() => closeSnackbar(key)}>
              {" "}
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className=""
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
      } finally {
        setLoading2(false);
      }
    }
  };
  const handleGithubSignIn = async (provider: string, data: any) => {
    setLoading3(true);

    const Formdata = {
      email: data.email || "", // GitHub might not return an email
      username: data.name || data.login, // Use login if name is missing
      userdp: data.avatar_url, // GitHub uses `avatar_url` instead of `picture`
      password: data.id + (data.email || ""), // Use `id` since GitHub does not have `sub`
    };

    try {
      const response = await apiResponse.post("auth/github", Formdata, {
        withCredentials: true,
      });

      console.log(response);
      if (response.status === 200) {
        enqueueSnackbar("Logged in Successfully", {
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

        const longerEXP = 1000 * 60 * 60 * 24 * 30;

        cookie.set("gennituToken", response.data.token, {
          expires: new Date(Date.now() + longerEXP),
        });

        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    } catch (error: any) {
      console.log(error?.message);
      enqueueSnackbar(error?.response?.data.message || "An error occurred", {
        variant: "error",
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
    } finally {
      setLoading3(false);
    }
  };

  return (
    <section className="bg-BackgroundLight dark:bg-BackgroundDark">
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-BackgroundLight dark:bg-BackgroundDark px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Sign In Card */}
        <div className="w-full max-w-[26rem] space-y-2 border border-gray-200 dark:border-neutral-800 py-8 px-6 rounded-xl shadow-sm bg-BackgroundLight2 dark:bg-neutral-900">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <Logo className="w-14 h-14" />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Gennit
            </h1>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back, Sign in
            </h1>

            <p className="text-sm text-muted-foreground dark:text-gray-400 mb-6">
              Sign in to continue using Gennit
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
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

            <Button
              type="button"
              variant="outline"
              className="w-full relative overflow-hidden transition-all hover:border-primary/50 hover:bg-primary/10 dark:bg-primary/10"
              disabled={loading3}
            >
              {loading3 ? (
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
                    className="mr-2 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 36 36"
                    fill="url(#facebook__a)"
                    height="40"
                    width="40"
                  >
                    <defs>
                      <linearGradient
                        x1="50%"
                        x2="50%"
                        y1="97.078%"
                        y2="0%"
                        id="facebook__a"
                      >
                        <stop offset="0%" stopColor="#0062E0" />
                        <stop offset="100%" stopColor="#19AFFF" />
                      </linearGradient>
                    </defs>
                    <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
                    <path
                      fill="#FFF"
                      d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
                    />
                  </svg>
                  Continue with Facebook
                </div>
              )}
            </Button>
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
          <form className="space-y-4" onSubmit={HandleSubmit}>
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
                    type="password"
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
                    className="w-full py-3 px-4 pl-11 border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
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
        </div>

        {/* Footer */}
        <div className="mt-8 max-w-md w-full space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            This site is protected by reCAPTCHA and subject to the Klipto{" "}
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
    </section>
  );
};

export default Login;
