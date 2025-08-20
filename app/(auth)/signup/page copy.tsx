"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/Regex";
import { apiResponse } from "@/utils/apiResponse";
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from "notistack";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import cookie from "js-cookie";
import { Logo } from "@/components/logo";
import { AuthTypes, RegexType } from "@/types/Authtypes";
// import withAuth from "@/helper/hoc/withAuth";

const Signup = () => {
  const pathname = usePathname();
  const [profile, setProfile] = useState<string>("");
  const [provider, setProvider] = useState("");
  const router = useRouter();

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

  const [backgroundColor, setBackgroundColor] = React.useState(
    getRandomColor()
  );

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
      const response = await apiResponse.post("auth/sign-up", Formdata, {
        withCredentials: true,
      });
      const User = response?.data;
      console.log("user", User);
      const userId = User?.user?._id.toString();
      if (response.status === 200) {
        enqueueSnackbar("Account Created Successfully", {
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
      console.log(error);

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

  const handleGoogleSignUp = async (provider: string, data: any) => {
    console.log("data", data);

    const Formdata = {
      email: data.email,
      username: data.name,
      userdp: data.picture,
      password: data.sub + data.email,
    };

    console.log("formdata", Formdata);
    if (data.email_verified === true) {
      try {
        const response = await apiResponse.post("auth/google", Formdata, {
          withCredentials: true,
        });
        const User = response?.data;
        console.log("user", User);
        const userId = User?.user?._id.toString();
        if (response.status === 200) {
          enqueueSnackbar("Account Created Successfully", {
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
        console.log(error);

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

  const handleGithubSignUp = async (provider: string, data: any) => {
    setLoading3(true);
    console.log("data", data);

    const Formdata = {
      email: data.email || "", // GitHub might not return an email
      username: data.name || data.login, // Use login if name is missing
      userdp: data.avatar_url, // GitHub uses `avatar_url`
      password: data.id + (data.email || ""), // Use `id` since GitHub does not have `sub`
    };

    console.log("formdata", Formdata);
    try {
      const response = await apiResponse.post("auth/github", Formdata, {
        withCredentials: true,
      });
      const User = response?.data;
      console.log("user", User);

      if (response.status === 200) {
        enqueueSnackbar("Account Created Successfully", {
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
      console.log(error);
      enqueueSnackbar(error?.response?.data?.message || "An error occurred", {
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

  const onLogout = useCallback(() => {}, []);

  return (
    <section
      className="bg-BackgroundLight dark:bg-BackgroundDark relative"
      style={{
        backgroundImage: "url(https://static.canva.com/web/images/41412dafd5013cc68fd1f63991b8ad37.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-BackgroundLight dark:bg-BackgroundDark px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Sign Up Card */}
        <div className="w-full max-w-md space-y-2 border border-gray-200 dark:border-neutral-800 py-8 px-6 rounded-xl shadow-sm bg-BackgroundLight2 dark:bg-BackgroundDark2">
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
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground text-gray-600 dark:text-gray-400">
              Welcome! Please fill in the details to get started.
            </p>
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

          {/* Divider */}
          <div className="flex items-center">
            <hr className="flex-grow border-t border-gray-300 dark:border-neutral-800" />
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
              Or sign up with
            </span>
            <hr className="flex-grow border-t border-gray-300 dark:border-neutral-800" />
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full relative overflow-hidden transition-all hover:border-primary/50 hover:bg-primary/10"
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
              className="w-full relative overflow-hidden transition-all hover:border-primary/50 hover:bg-primary/10"
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
                  Signing up...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    viewBox="0 0 438.549 438.549"
                    className="mr-2 w-4 h-4"
                    fill="currentColor"
                  >
                    <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"></path>
                  </svg>
                  Continue with GitHub
                </div>
              )}
            </Button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-TextLight2 dark:text-TextDark2 underline hover:no-underline"
                prefetch={false}
              >
                Log in
              </Link>
            </span>
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
              Privacy Policy
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
