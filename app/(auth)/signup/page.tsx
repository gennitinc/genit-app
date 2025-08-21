"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/Regex";
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from "notistack";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { AuthTypes, RegexType } from "@/types/Authtypes";
import { useUserContext } from "@/context/AuthenticatedContext";
// import withAuth from "@/helper/hoc/withAuth";

const Signup = () => {
  const pathname = usePathname();
  const [profile, setProfile] = useState<string>("");
  const [provider, setProvider] = useState("");
  const router = useRouter();
  const { signUp, signInWithProvider } = useUserContext();

  const UserDp: Array<string> = [
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/1.png",
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/2.png",
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/3.png",
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/4.png",
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/5.png",
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/6.png",
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/7.png",
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/8.png",
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/9.png",
    "https://enterboxbucket.blob.core.windows.net/programmablefiles/10.png",
  ];

  const RandomProfile = () => {
    const newUserDp = Math.floor(Math.random() * UserDp.length);
    const result = UserDp[newUserDp];
    return result;
  };

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let newhex = "";
    for (let i = 0; i < 6; i++) {
      newhex += letters[Math.floor(Math.random() * 16)];
    }
    while (newhex === "#FFFFFF") console.log(newhex);
    return newhex;
  }

  const [backgroundColor, setBackgroundColor] =
    React.useState(getRandomColor());

  const [Formdata, setFormdata] = React.useState<AuthTypes>({
    username: "",
    email: "",
    password: "",
    userdp: "",
  });

  const [fullName, setFullName] = React.useState<string>("");

  const [errormsg, setErrormsg] = React.useState<AuthTypes>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const [loading2, setLoading2] = React.useState<boolean>(false);
  const [loading3, setLoading3] = React.useState<boolean>(false);

  const handleInputChange = (Event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = Event.target;
    if (name === "email") {
      const newusername = value.substring(0, value.indexOf("@"));
      setFullName(newusername);
    }

    const userdpvalue = `https://eu.ui-avatars.com/api/?name=${
      Formdata.username
    }&background=${backgroundColor && backgroundColor}&color=ffffff`;
    setFormdata({
      ...Formdata,
      username: fullName,
      userdp: RandomProfile(),
      [name]: value,
    });
  };

  const allfieldvalid = Object.keys(errormsg).every(
    (field) => !errormsg[field as keyof typeof errormsg]
  );

  const SignupValidate = (Regexprop: RegexType): void => {
    if (!Regexprop.regex.test(Regexprop.value)) {
      setErrormsg((regexerror: AuthTypes) => ({
        ...regexerror,
        [Regexprop.fieldname]: Regexprop.errormsg,
      }));
    } else {
      setErrormsg((regexerror: AuthTypes) => ({
        ...regexerror,
        [Regexprop.fieldname]: "",
      }));
    }
  };

  const HandleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setBackgroundColor(getRandomColor());

    setLoading(true);
    try {
      const { data, error } = await signUp(
        Formdata.email,
        Formdata.password || "",
        Formdata.username || "",
        Formdata.userdp
      );

      if (error) {
        throw error;
      }

      enqueueSnackbar(
        "Account Created Successfully! Please check your email to verify your account.",
        {
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
        }
      );

      router.push("/signin");
    } catch (error: any) {
      setLoading(false);
      console.log(error);

      enqueueSnackbar(error?.message || "An error occurred during sign up", {
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

  const handleGoogleSignUp = async () => {
    setLoading2(true);
    try {
      const { data, error } = await signInWithProvider("google");
      if (error) {
        throw error;
      }
      // The redirect will happen automatically
    } catch (error: any) {
      setLoading2(false);
      console.log(error);
      enqueueSnackbar(
        error?.message || "An error occurred during Google sign up",
        {
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
        }
      );
    } finally {
      setLoading2(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setLoading3(true);
    try {
      const { data, error } = await signInWithProvider("facebook");
      if (error) {
        throw error;
      }
      // The redirect will happen automatically
    } catch (error: any) {
      setLoading3(false);
      console.log(error);
      enqueueSnackbar(
        error?.message || "An error occurred during Facebook sign up",
        {
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
        }
      );
    } finally {
      setLoading3(false);
    }
  };

  const onLogout = useCallback(() => {}, []);

  return (
    <section className="bg-BackgroundLight dark:bg-BackgroundDark">
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-BackgroundLight dark:bg-BackgroundDark px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Sign Up Card */}
        <div className="w-full max-w-[26rem] space-y-2 border border-gray-200 dark:border-neutral-800 py-8 px-6 rounded-xl shadow-sm bg-BackgroundLight2 dark:bg-neutral-900">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <Logo className="w-14 h-14" />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Gennit
            </h1>
          </div>

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground text-gray-600 dark:text-gray-400">
              Welcome! Please fill in the details to get started.
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full relative overflow-hidden transition-all hover:border-primary/50 hover:bg-primary/10 dark:bg-primary/10"
              disabled={loading2}
              onClick={handleGoogleSignUp}
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
                  Signing up...
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
              onClick={handleFacebookSignUp}
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
                  Signing up...
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
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange(event);
                      const regexProps: RegexType = {
                        fieldname: "email",
                        regex: EMAIL_REGEX,
                        value: event.target.value,
                        errormsg:
                          "Please include a valid email address so we can get back to you",
                      };
                      SignupValidate(regexProps);
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
                {errormsg.email && Formdata.email && (
                  <p className="text-xs text-TextLight2 dark:text-TextDark2 mt-1">
                    {errormsg.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleInputChange(event);
                      const regexProps: RegexType = {
                        fieldname: "password",
                        regex: PASSWORD_REGEX,
                        value: event.target.value,
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
                {errormsg.password && Formdata.password && (
                  <p className="text-xs text-TextLight2 dark:text-TextDark2 mt-1">
                    {errormsg.password}
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
                  Creating account...
                </div>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-TextLight2 dark:text-TextDark2 underline hover:no-underline"
                prefetch={false}
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 max-w-[26rem] w-full space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            This site is protected by reCAPTCHA and subject to our{" "}
            <a
              href="#"
              className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
            >
              Privacy
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
    </section>
  );
};

export default Signup;
