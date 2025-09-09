"use client";
import React from "react";
import { Logo } from "@/components/logo";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { PASSWORD_REGEX } from "@/utils/Regex";
import { toast } from "sonner";
import { apiResponse } from "@/utils/apiResponse";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegexType } from "@/types/Authtypes";

export function UpdatePasswordComp() {
  const router = useRouter();
  const params = useSearchParams();
  const Token = params.get("token");

  const [formData, setFormdata] = React.useState({
    password: "",
    confirmpassword: "",
  });
  const [errorMsg, seterrorMsg] = React.useState({
    password: "",
    confirmpassword: "",
  });

  const handleInputChange = (Event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = Event.target;

    setFormdata({
      ...formData,
      [name]: value,
    });

    // Check if passwords match for confirm password field
    if (name === "confirmpassword") {
      if (value !== formData.password) {
        seterrorMsg((prev) => ({
          ...prev,
          confirmpassword: "Passwords do not match",
        }));
      } else {
        seterrorMsg((prev) => ({
          ...prev,
          confirmpassword: "",
        }));
      }
    }
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

  const allfieldvalid =
    Object.keys(errorMsg).every(
      (field) => !errorMsg[field as keyof typeof errorMsg]
    ) &&
    formData.password &&
    formData.confirmpassword &&
    formData.password === formData.confirmpassword;

  React.useEffect(() => {
    if (!Token) {
      router.push("/recover");
    }
  }, [Token, router]);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  const HandleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await apiResponse.post("auth/updatepassword", {
        newPassword: formData.password,
        token: Token,
      });

      if (response.status === 200) {
        toast.success(`${response.data?.message}`);
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
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
          <CardTitle className="text-2xl font-bold">Update password</CardTitle>
          <CardDescription>
            Your email has been verified. Please enter a new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form */}
          <form className="space-y-4" onSubmit={HandleSubmit}>
            <div className="space-y-4">
              {/* New Password Field */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    name="password"
                    value={formData.password}
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
                    placeholder="Enter new password"
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

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    name="confirmpassword"
                    value={formData.confirmpassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full py-3 px-4 pl-11 pr-11 border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                  >
                    {showConfirmPassword ? (
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
                {errorMsg.confirmpassword && formData.confirmpassword && (
                  <p className="text-xs text-TextLight2 dark:text-TextDark2 mt-1">
                    {errorMsg.confirmpassword}
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
                  Updating...
                </div>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
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
}

export default UpdatePasswordComp;
