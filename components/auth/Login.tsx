"use client";
import { AuthMediaCarousel, loginCarouselData } from "./AuthMediaCarousel";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/AuthenticatedContext";
import withAuth from "@/helper/hoc/withAuth";
import { identifyAndTrackAuth, trackEvent } from "@/lib/mixpanelClient";
import { AuthTypes, RegexType } from "@/types/Authtypes";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/Regex";
import { apiResponse } from "@/utils/apiResponse";
import { useGoogleLogin } from "@react-oauth/google";
import cookie from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React from "react";

type GoogleProfile = {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  sub: string;
};

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
    trackEvent("login_attempted", { auth_method: "password" });

    try {
      const response = await apiResponse.post("/auth/sign-in", formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Logged in Successfully");

        const longerEXP = 1000 * 60 * 60 * 24 * 30;

        cookie.set("genituToken", response.data.token, {
          expires: new Date(Date.now() + longerEXP),
          // secure: true,
          // sameSite: "strict",
        });

        // Fetch current user data
        await fetchCurrentUser();

        // Check verification and onboarding status, redirect accordingly
        const userData = await apiResponse.get("/user/active-user");
        const currentUser = userData.data.user;
        identifyAndTrackAuth(
          {
            id: currentUser._id,
            email: currentUser.email,
            username: currentUser.username,
            plan: currentUser.userPlan,
            createdAt: currentUser.createdAt,
            emailVerified: currentUser.emailVerified,
            onboardingCompleted: currentUser.onboarding?.onboardingCompleted,
            role: currentUser.role,
          },
          "login_completed",
          { auth_method: "password" }
        );

        if (!currentUser.emailVerified) {
          // Not verified - redirect to verification
          router.push(
            `/account/verify?email=${encodeURIComponent(currentUser.email)}`
          );
        } else if (!currentUser.onboarding?.onboardingCompleted) {
          // Verified but not onboarded - redirect to onboarding
          router.push("/onboarding");
        } else {
          // Verified and onboarded - go to inspire create
          router.push("/chat");
        }
      }
    } catch (error: any) {
      setLoading(false);
      trackEvent("login_failed", {
        auth_method: "password",
        reason: error?.response?.data?.message || error?.message,
      });

      toast.error(error?.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (provider: string, data: any) => {
    setLoading2(true);
    trackEvent("login_attempted", { auth_method: "google" });

    const Formdata = {
      email: data.email,
      username: data.name,
      userdp: data.picture,
      password: data.sub + data.email,
    };

    if (data.email_verified !== true) {
      setLoading2(false);
      toast.error("Please use a verified Google account email");
      return;
    }

    try {
      const response = await apiResponse.post("auth/google", Formdata, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Check if it's a new sign-up or existing sign-in based on response message
        const isNewUser =
          response.data.message?.includes("created") ||
          response.data.message?.includes("Account created");

        toast.success(
          isNewUser ? "Account Created Successfully!" : "Logged in Successfully"
        );

        const longerEXP = 1000 * 60 * 60 * 24 * 30;

        cookie.set("genituToken", response.data.token, {
          expires: new Date(Date.now() + longerEXP),
          // secure: true,
          // sameSite: "strict",
        });

        // Fetch current user data
        await fetchCurrentUser();

        // Check verification and onboarding status, redirect accordingly
        const userData = await apiResponse.get("/user/active-user");
        const currentUser = userData.data.user;
        identifyAndTrackAuth(
          {
            id: currentUser._id,
            email: currentUser.email,
            username: currentUser.username,
            plan: currentUser.userPlan,
            createdAt: currentUser.createdAt,
            emailVerified: currentUser.emailVerified,
            onboardingCompleted: currentUser.onboarding?.onboardingCompleted,
            role: currentUser.role,
          },
          "login_completed",
          { auth_method: "google" }
        );

        if (!currentUser.emailVerified) {
          // Not verified - redirect to verification
          router.push(
            `/account/verify?email=${encodeURIComponent(currentUser.email)}`
          );
        } else if (!currentUser.onboarding?.onboardingCompleted) {
          // Verified but not onboarded - redirect to onboarding
          router.push("/onboarding");
        } else {
          // Verified and onboarded - go to inspire create
          router.push("/chat");
        }
      }
    } catch (error: any) {
      setLoading2(false);
      trackEvent("login_failed", {
        auth_method: "google",
        reason: error?.response?.data?.message || error?.message,
      });

      toast.error(error?.response?.data.message);
    } finally {
      setLoading2(false);
    }
  };

  const googleLogin = useGoogleLogin({
    scope: "openid profile email",
    onSuccess: async ({ access_token }) => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch Google profile");
        }

        const data = (await response.json()) as GoogleProfile;
        await handleGoogleSignIn("google", data);
      } catch (error: any) {
        setLoading2(false);
        trackEvent("login_failed", {
          auth_method: "google",
          reason: error?.message,
        });
        toast.error("Unable to sign in with Google");
      }
    },
    onError: () => {
      setLoading2(false);
      toast.error("Google sign in was cancelled or failed");
    },
    onNonOAuthError: () => {
      setLoading2(false);
      toast.error("Google sign in was cancelled or failed");
    },
  });

  return (
    <div className='grid h-screen grid-cols-1 lg:grid-cols-2'>
      <div className='relative hidden h-screen items-end justify-center overflow-hidden lg:flex'>
        <AuthMediaCarousel
          media={loginCarouselData.media}
          autoPlayInterval={5000}
        />
        <svg
          width={960}
          height={960}
          viewBox='0 0 960 960'
          fill='none'
          className='pointer-events-none absolute top-0 opacity-40'
        >
          <mask
            id='mask0_4940_405685'
            style={{ maskType: "alpha" }}
            maskUnits='userSpaceOnUse'
            x={0}
            y={0}
            width={960}
            height={960}
          >
            <rect
              width={960}
              height={960}
              fill='url(#paint0_radial_4940_405685)'
            />
          </mask>
          <g mask='url(#mask0_4940_405685)'>
            <g clipPath='url(#clip0_4940_405685)'>
              <mask id='path-3-inside-1_4940_405685' fill='white'>
                <path d='M0 0H96V96H0V0Z' />
              </mask>
              <path
                d='M96 96V97H97V96H96ZM95 0V96H97V0H95ZM96 95H0V97H96V95Z'
                fill='#D0D5DD'
                mask='url(#path-3-inside-1_4940_405685)'
              />
              <mask id='path-5-inside-2_4940_405685' fill='white'>
                <path d='M96 0H192V96H96V0Z' />
              </mask>
              <path
                d='M192 96V97H193V96H192ZM191 0V96H193V0H191ZM192 95H96V97H192V95Z'
                fill='#D0D5DD'
                mask='url(#path-5-inside-2_4940_405685)'
              />
              <mask id='path-7-inside-3_4940_405685' fill='white'>
                <path d='M192 0H288V96H192V0Z' />
              </mask>
              <path
                d='M288 96V97H289V96H288ZM287 0V96H289V0H287ZM288 95H192V97H288V95Z'
                fill='#D0D5DD'
                mask='url(#path-7-inside-3_4940_405685)'
              />
              <mask id='path-9-inside-4_4940_405685' fill='white'>
                <path d='M288 0H384V96H288V0Z' />
              </mask>
              <path
                d='M384 96V97H385V96H384ZM383 0V96H385V0H383ZM384 95H288V97H384V95Z'
                fill='#D0D5DD'
                mask='url(#path-9-inside-4_4940_405685)'
              />
              <mask id='path-11-inside-5_4940_405685' fill='white'>
                <path d='M384 0H480V96H384V0Z' />
              </mask>
              <path
                d='M480 96V97H481V96H480ZM479 0V96H481V0H479ZM480 95H384V97H480V95Z'
                fill='#D0D5DD'
                mask='url(#path-11-inside-5_4940_405685)'
              />
              <mask id='path-13-inside-6_4940_405685' fill='white'>
                <path d='M480 0H576V96H480V0Z' />
              </mask>
              <path
                d='M576 96V97H577V96H576ZM575 0V96H577V0H575ZM576 95H480V97H576V95Z'
                fill='#D0D5DD'
                mask='url(#path-13-inside-6_4940_405685)'
              />
              <mask id='path-15-inside-7_4940_405685' fill='white'>
                <path d='M576 0H672V96H576V0Z' />
              </mask>
              <path
                d='M672 96V97H673V96H672ZM671 0V96H673V0H671ZM672 95H576V97H672V95Z'
                fill='#D0D5DD'
                mask='url(#path-15-inside-7_4940_405685)'
              />
              <mask id='path-17-inside-8_4940_405685' fill='white'>
                <path d='M672 0H768V96H672V0Z' />
              </mask>
              <path
                d='M768 96V97H769V96H768ZM767 0V96H769V0H767ZM768 95H672V97H768V95Z'
                fill='#D0D5DD'
                mask='url(#path-17-inside-8_4940_405685)'
              />
              <mask id='path-19-inside-9_4940_405685' fill='white'>
                <path d='M768 0H864V96H768V0Z' />
              </mask>
              <path
                d='M864 96V97H865V96H864ZM863 0V96H865V0H863ZM864 95H768V97H864V95Z'
                fill='#D0D5DD'
                mask='url(#path-19-inside-9_4940_405685)'
              />
              <mask id='path-21-inside-10_4940_405685' fill='white'>
                <path d='M864 0H960V96H864V0Z' />
              </mask>
              <path
                d='M960 96V97H961V96H960ZM959 0V96H961V0H959ZM960 95H864V97H960V95Z'
                fill='#D0D5DD'
                mask='url(#path-21-inside-10_4940_405685)'
              />
              <mask id='path-23-inside-11_4940_405685' fill='white'>
                <path d='M0 96H96V192H0V96Z' />
              </mask>
              <path
                d='M96 192V193H97V192H96ZM95 96V192H97V96H95ZM96 191H0V193H96V191Z'
                fill='#D0D5DD'
                mask='url(#path-23-inside-11_4940_405685)'
              />
              <mask id='path-25-inside-12_4940_405685' fill='white'>
                <path d='M96 96H192V192H96V96Z' />
              </mask>
              <path
                d='M192 192V193H193V192H192ZM191 96V192H193V96H191ZM192 191H96V193H192V191Z'
                fill='#D0D5DD'
                mask='url(#path-25-inside-12_4940_405685)'
              />
              <mask id='path-27-inside-13_4940_405685' fill='white'>
                <path d='M192 96H288V192H192V96Z' />
              </mask>
              <path d='M192 96H288V192H192V96Z' fill='#F2F4F7' />
              <path
                d='M288 192V193H289V192H288ZM287 96V192H289V96H287ZM288 191H192V193H288V191Z'
                fill='#D0D5DD'
                mask='url(#path-27-inside-13_4940_405685)'
              />
              <mask id='path-29-inside-14_4940_405685' fill='white'>
                <path d='M288 96H384V192H288V96Z' />
              </mask>
              <path
                d='M384 192V193H385V192H384ZM383 96V192H385V96H383ZM384 191H288V193H384V191Z'
                fill='#D0D5DD'
                mask='url(#path-29-inside-14_4940_405685)'
              />
              <mask id='path-31-inside-15_4940_405685' fill='white'>
                <path d='M384 96H480V192H384V96Z' />
              </mask>
              <path
                d='M480 192V193H481V192H480ZM479 96V192H481V96H479ZM480 191H384V193H480V191Z'
                fill='#D0D5DD'
                mask='url(#path-31-inside-15_4940_405685)'
              />
              <mask id='path-33-inside-16_4940_405685' fill='white'>
                <path d='M480 96H576V192H480V96Z' />
              </mask>
              <path
                d='M576 192V193H577V192H576ZM575 96V192H577V96H575ZM576 191H480V193H576V191Z'
                fill='#D0D5DD'
                mask='url(#path-33-inside-16_4940_405685)'
              />
              <mask id='path-35-inside-17_4940_405685' fill='white'>
                <path d='M576 96H672V192H576V96Z' />
              </mask>
              <path
                d='M672 192V193H673V192H672ZM671 96V192H673V96H671ZM672 191H576V193H672V191Z'
                fill='#D0D5DD'
                mask='url(#path-35-inside-17_4940_405685)'
              />
              <mask id='path-37-inside-18_4940_405685' fill='white'>
                <path d='M672 96H768V192H672V96Z' />
              </mask>
              <path
                d='M768 192V193H769V192H768ZM767 96V192H769V96H767ZM768 191H672V193H768V191Z'
                fill='#D0D5DD'
                mask='url(#path-37-inside-18_4940_405685)'
              />
              <mask id='path-39-inside-19_4940_405685' fill='white'>
                <path d='M768 96H864V192H768V96Z' />
              </mask>
              <path d='M768 96H864V192H768V96Z' fill='#F2F4F7' />
              <path
                d='M864 192V193H865V192H864ZM863 96V192H865V96H863ZM864 191H768V193H864V191Z'
                fill='#D0D5DD'
                mask='url(#path-39-inside-19_4940_405685)'
              />
              <mask id='path-41-inside-20_4940_405685' fill='white'>
                <path d='M864 96H960V192H864V96Z' />
              </mask>
              <path
                d='M960 192V193H961V192H960ZM959 96V192H961V96H959ZM960 191H864V193H960V191Z'
                fill='#D0D5DD'
                mask='url(#path-41-inside-20_4940_405685)'
              />
              <mask id='path-43-inside-21_4940_405685' fill='white'>
                <path d='M0 192H96V288H0V192Z' />
              </mask>
              <path d='M0 192H96V288H0V192Z' fill='#F2F4F7' />
              <path
                d='M96 288V289H97V288H96ZM95 192V288H97V192H95ZM96 287H0V289H96V287Z'
                fill='#D0D5DD'
                mask='url(#path-43-inside-21_4940_405685)'
              />
              <mask id='path-45-inside-22_4940_405685' fill='white'>
                <path d='M96 192H192V288H96V192Z' />
              </mask>
              <path
                d='M192 288V289H193V288H192ZM191 192V288H193V192H191ZM192 287H96V289H192V287Z'
                fill='#D0D5DD'
                mask='url(#path-45-inside-22_4940_405685)'
              />
              <mask id='path-47-inside-23_4940_405685' fill='white'>
                <path d='M192 192H288V288H192V192Z' />
              </mask>
              <path
                d='M288 288V289H289V288H288ZM287 192V288H289V192H287ZM288 287H192V289H288V287Z'
                fill='#D0D5DD'
                mask='url(#path-47-inside-23_4940_405685)'
              />
              <mask id='path-49-inside-24_4940_405685' fill='white'>
                <path d='M288 192H384V288H288V192Z' />
              </mask>
              <path
                d='M384 288V289H385V288H384ZM383 192V288H385V192H383ZM384 287H288V289H384V287Z'
                fill='#D0D5DD'
                mask='url(#path-49-inside-24_4940_405685)'
              />
              <mask id='path-51-inside-25_4940_405685' fill='white'>
                <path d='M384 192H480V288H384V192Z' />
              </mask>
              <path
                d='M480 288V289H481V288H480ZM479 192V288H481V192H479ZM480 287H384V289H480V287Z'
                fill='#D0D5DD'
                mask='url(#path-51-inside-25_4940_405685)'
              />
              <mask id='path-53-inside-26_4940_405685' fill='white'>
                <path d='M480 192H576V288H480V192Z' />
              </mask>
              <path
                d='M576 288V289H577V288H576ZM575 192V288H577V192H575ZM576 287H480V289H576V287Z'
                fill='#D0D5DD'
                mask='url(#path-53-inside-26_4940_405685)'
              />
              <mask id='path-55-inside-27_4940_405685' fill='white'>
                <path d='M576 192H672V288H576V192Z' />
              </mask>
              <path d='M576 192H672V288H576V192Z' fill='#F2F4F7' />
              <path
                d='M672 288V289H673V288H672ZM671 192V288H673V192H671ZM672 287H576V289H672V287Z'
                fill='#D0D5DD'
                mask='url(#path-55-inside-27_4940_405685)'
              />
              <mask id='path-57-inside-28_4940_405685' fill='white'>
                <path d='M672 192H768V288H672V192Z' />
              </mask>
              <path
                d='M768 288V289H769V288H768ZM767 192V288H769V192H767ZM768 287H672V289H768V287Z'
                fill='#D0D5DD'
                mask='url(#path-57-inside-28_4940_405685)'
              />
              <mask id='path-59-inside-29_4940_405685' fill='white'>
                <path d='M768 192H864V288H768V192Z' />
              </mask>
              <path
                d='M864 288V289H865V288H864ZM863 192V288H865V192H863ZM864 287H768V289H864V287Z'
                fill='#D0D5DD'
                mask='url(#path-59-inside-29_4940_405685)'
              />
              <mask id='path-61-inside-30_4940_405685' fill='white'>
                <path d='M864 192H960V288H864V192Z' />
              </mask>
              <path
                d='M960 288V289H961V288H960ZM959 192V288H961V192H959ZM960 287H864V289H960V287Z'
                fill='#D0D5DD'
                mask='url(#path-61-inside-30_4940_405685)'
              />
              <mask id='path-63-inside-31_4940_405685' fill='white'>
                <path d='M0 288H96V384H0V288Z' />
              </mask>
              <path
                d='M96 384V385H97V384H96ZM95 288V384H97V288H95ZM96 383H0V385H96V383Z'
                fill='#D0D5DD'
                mask='url(#path-63-inside-31_4940_405685)'
              />
              <mask id='path-65-inside-32_4940_405685' fill='white'>
                <path d='M96 288H192V384H96V288Z' />
              </mask>
              <path
                d='M192 384V385H193V384H192ZM191 288V384H193V288H191ZM192 383H96V385H192V383Z'
                fill='#D0D5DD'
                mask='url(#path-65-inside-32_4940_405685)'
              />
              <mask id='path-67-inside-33_4940_405685' fill='white'>
                <path d='M192 288H288V384H192V288Z' />
              </mask>
              <path
                d='M288 384V385H289V384H288ZM287 288V384H289V288H287ZM288 383H192V385H288V383Z'
                fill='#D0D5DD'
                mask='url(#path-67-inside-33_4940_405685)'
              />
              <mask id='path-69-inside-34_4940_405685' fill='white'>
                <path d='M288 288H384V384H288V288Z' />
              </mask>
              <path
                d='M384 384V385H385V384H384ZM383 288V384H385V288H383ZM384 383H288V385H384V383Z'
                fill='#D0D5DD'
                mask='url(#path-69-inside-34_4940_405685)'
              />
              <mask id='path-71-inside-35_4940_405685' fill='white'>
                <path d='M384 288H480V384H384V288Z' />
              </mask>
              <path
                d='M480 384V385H481V384H480ZM479 288V384H481V288H479ZM480 383H384V385H480V383Z'
                fill='#D0D5DD'
                mask='url(#path-71-inside-35_4940_405685)'
              />
              <mask id='path-73-inside-36_4940_405685' fill='white'>
                <path d='M480 288H576V384H480V288Z' />
              </mask>
              <path
                d='M576 384V385H577V384H576ZM575 288V384H577V288H575ZM576 383H480V385H576V383Z'
                fill='#D0D5DD'
                mask='url(#path-73-inside-36_4940_405685)'
              />
              <mask id='path-75-inside-37_4940_405685' fill='white'>
                <path d='M576 288H672V384H576V288Z' />
              </mask>
              <path
                d='M672 384V385H673V384H672ZM671 288V384H673V288H671ZM672 383H576V385H672V383Z'
                fill='#D0D5DD'
                mask='url(#path-75-inside-37_4940_405685)'
              />
              <mask id='path-77-inside-38_4940_405685' fill='white'>
                <path d='M672 288H768V384H672V288Z' />
              </mask>
              <path
                d='M768 384V385H769V384H768ZM767 288V384H769V288H767ZM768 383H672V385H768V383Z'
                fill='#D0D5DD'
                mask='url(#path-77-inside-38_4940_405685)'
              />
              <mask id='path-79-inside-39_4940_405685' fill='white'>
                <path d='M768 288H864V384H768V288Z' />
              </mask>
              <path
                d='M864 384V385H865V384H864ZM863 288V384H865V288H863ZM864 383H768V385H864V383Z'
                fill='#D0D5DD'
                mask='url(#path-79-inside-39_4940_405685)'
              />
              <mask id='path-81-inside-40_4940_405685' fill='white'>
                <path d='M864 288H960V384H864V288Z' />
              </mask>
              <path d='M864 288H960V384H864V288Z' fill='#F2F4F7' />
              <path
                d='M960 384V385H961V384H960ZM959 288V384H961V288H959ZM960 383H864V385H960V383Z'
                fill='#D0D5DD'
                mask='url(#path-81-inside-40_4940_405685)'
              />
              <mask id='path-83-inside-41_4940_405685' fill='white'>
                <path d='M0 384H96V480H0V384Z' />
              </mask>
              <path
                d='M96 480V481H97V480H96ZM95 384V480H97V384H95ZM96 479H0V481H96V479Z'
                fill='#D0D5DD'
                mask='url(#path-83-inside-41_4940_405685)'
              />
              <mask id='path-85-inside-42_4940_405685' fill='white'>
                <path d='M96 384H192V480H96V384Z' />
              </mask>
              <path
                d='M192 480V481H193V480H192ZM191 384V480H193V384H191ZM192 479H96V481H192V479Z'
                fill='#D0D5DD'
                mask='url(#path-85-inside-42_4940_405685)'
              />
              <mask id='path-87-inside-43_4940_405685' fill='white'>
                <path d='M192 384H288V480H192V384Z' />
              </mask>
              <path
                d='M288 480V481H289V480H288ZM287 384V480H289V384H287ZM288 479H192V481H288V479Z'
                fill='#D0D5DD'
                mask='url(#path-87-inside-43_4940_405685)'
              />
              <mask id='path-89-inside-44_4940_405685' fill='white'>
                <path d='M288 384H384V480H288V384Z' />
              </mask>
              <path d='M288 384H384V480H288V384Z' fill='#F2F4F7' />
              <path
                d='M384 480V481H385V480H384ZM383 384V480H385V384H383ZM384 479H288V481H384V479Z'
                fill='#D0D5DD'
                mask='url(#path-89-inside-44_4940_405685)'
              />
              <mask id='path-91-inside-45_4940_405685' fill='white'>
                <path d='M384 384H480V480H384V384Z' />
              </mask>
              <path
                d='M480 480V481H481V480H480ZM479 384V480H481V384H479ZM480 479H384V481H480V479Z'
                fill='#D0D5DD'
                mask='url(#path-91-inside-45_4940_405685)'
              />
              <mask id='path-93-inside-46_4940_405685' fill='white'>
                <path d='M480 384H576V480H480V384Z' />
              </mask>
              <path
                d='M576 480V481H577V480H576ZM575 384V480H577V384H575ZM576 479H480V481H576V479Z'
                fill='#D0D5DD'
                mask='url(#path-93-inside-46_4940_405685)'
              />
              <mask id='path-95-inside-47_4940_405685' fill='white'>
                <path d='M576 384H672V480H576V384Z' />
              </mask>
              <path
                d='M672 480V481H673V480H672ZM671 384V480H673V384H671ZM672 479H576V481H672V479Z'
                fill='#D0D5DD'
                mask='url(#path-95-inside-47_4940_405685)'
              />
              <mask id='path-97-inside-48_4940_405685' fill='white'>
                <path d='M672 384H768V480H672V384Z' />
              </mask>
              <path
                d='M768 480V481H769V480H768ZM767 384V480H769V384H767ZM768 479H672V481H768V479Z'
                fill='#D0D5DD'
                mask='url(#path-97-inside-48_4940_405685)'
              />
              <mask id='path-99-inside-49_4940_405685' fill='white'>
                <path d='M768 384H864V480H768V384Z' />
              </mask>
              <path
                d='M864 480V481H865V480H864ZM863 384V480H865V384H863ZM864 479H768V481H864V479Z'
                fill='#D0D5DD'
                mask='url(#path-99-inside-49_4940_405685)'
              />
              <mask id='path-101-inside-50_4940_405685' fill='white'>
                <path d='M864 384H960V480H864V384Z' />
              </mask>
              <path
                d='M960 480V481H961V480H960ZM959 384V480H961V384H959ZM960 479H864V481H960V479Z'
                fill='#D0D5DD'
                mask='url(#path-101-inside-50_4940_405685)'
              />
              <mask id='path-103-inside-51_4940_405685' fill='white'>
                <path d='M0 480H96V576H0V480Z' />
              </mask>
              <path d='M0 480H96V576H0V480Z' fill='#F2F4F7' />
              <path
                d='M96 576V577H97V576H96ZM95 480V576H97V480H95ZM96 575H0V577H96V575Z'
                fill='#D0D5DD'
                mask='url(#path-103-inside-51_4940_405685)'
              />
              <mask id='path-105-inside-52_4940_405685' fill='white'>
                <path d='M96 480H192V576H96V480Z' />
              </mask>
              <path
                d='M192 576V577H193V576H192ZM191 480V576H193V480H191ZM192 575H96V577H192V575Z'
                fill='#D0D5DD'
                mask='url(#path-105-inside-52_4940_405685)'
              />
              <mask id='path-107-inside-53_4940_405685' fill='white'>
                <path d='M192 480H288V576H192V480Z' />
              </mask>
              <path
                d='M288 576V577H289V576H288ZM287 480V576H289V480H287ZM288 575H192V577H288V575Z'
                fill='#D0D5DD'
                mask='url(#path-107-inside-53_4940_405685)'
              />
              <mask id='path-109-inside-54_4940_405685' fill='white'>
                <path d='M288 480H384V576H288V480Z' />
              </mask>
              <path
                d='M384 576V577H385V576H384ZM383 480V576H385V480H383ZM384 575H288V577H384V575Z'
                fill='#D0D5DD'
                mask='url(#path-109-inside-54_4940_405685)'
              />
              <mask id='path-111-inside-55_4940_405685' fill='white'>
                <path d='M384 480H480V576H384V480Z' />
              </mask>
              <path
                d='M480 576V577H481V576H480ZM479 480V576H481V480H479ZM480 575H384V577H480V575Z'
                fill='#D0D5DD'
                mask='url(#path-111-inside-55_4940_405685)'
              />
              <mask id='path-113-inside-56_4940_405685' fill='white'>
                <path d='M480 480H576V576H480V480Z' />
              </mask>
              <path
                d='M576 576V577H577V576H576ZM575 480V576H577V480H575ZM576 575H480V577H576V575Z'
                fill='#D0D5DD'
                mask='url(#path-113-inside-56_4940_405685)'
              />
              <mask id='path-115-inside-57_4940_405685' fill='white'>
                <path d='M576 480H672V576H576V480Z' />
              </mask>
              <path d='M576 480H672V576H576V480Z' fill='#F2F4F7' />
              <path
                d='M672 576V577H673V576H672ZM671 480V576H673V480H671ZM672 575H576V577H672V575Z'
                fill='#D0D5DD'
                mask='url(#path-115-inside-57_4940_405685)'
              />
              <mask id='path-117-inside-58_4940_405685' fill='white'>
                <path d='M672 480H768V576H672V480Z' />
              </mask>
              <path
                d='M768 576V577H769V576H768ZM767 480V576H769V480H767ZM768 575H672V577H768V575Z'
                fill='#D0D5DD'
                mask='url(#path-117-inside-58_4940_405685)'
              />
              <mask id='path-119-inside-59_4940_405685' fill='white'>
                <path d='M768 480H864V576H768V480Z' />
              </mask>
              <path
                d='M864 576V577H865V576H864ZM863 480V576H865V480H863ZM864 575H768V577H864V575Z'
                fill='#D0D5DD'
                mask='url(#path-119-inside-59_4940_405685)'
              />
              <mask id='path-121-inside-60_4940_405685' fill='white'>
                <path d='M864 480H960V576H864V480Z' />
              </mask>
              <path
                d='M960 576V577H961V576H960ZM959 480V576H961V480H959ZM960 575H864V577H960V575Z'
                fill='#D0D5DD'
                mask='url(#path-121-inside-60_4940_405685)'
              />
              <mask id='path-123-inside-61_4940_405685' fill='white'>
                <path d='M0 576H96V672H0V576Z' />
              </mask>
              <path
                d='M96 672V673H97V672H96ZM95 576V672H97V576H95ZM96 671H0V673H96V671Z'
                fill='#D0D5DD'
                mask='url(#path-123-inside-61_4940_405685)'
              />
              <mask id='path-125-inside-62_4940_405685' fill='white'>
                <path d='M96 576H192V672H96V576Z' />
              </mask>
              <path
                d='M192 672V673H193V672H192ZM191 576V672H193V576H191ZM192 671H96V673H192V671Z'
                fill='#D0D5DD'
                mask='url(#path-125-inside-62_4940_405685)'
              />
              <mask id='path-127-inside-63_4940_405685' fill='white'>
                <path d='M192 576H288V672H192V576Z' />
              </mask>
              <path
                d='M288 672V673H289V672H288ZM287 576V672H289V576H287ZM288 671H192V673H288V671Z'
                fill='#D0D5DD'
                mask='url(#path-127-inside-63_4940_405685)'
              />
              <mask id='path-129-inside-64_4940_405685' fill='white'>
                <path d='M288 576H384V672H288V576Z' />
              </mask>
              <path
                d='M384 672V673H385V672H384ZM383 576V672H385V576H383ZM384 671H288V673H384V671Z'
                fill='#D0D5DD'
                mask='url(#path-129-inside-64_4940_405685)'
              />
              <mask id='path-131-inside-65_4940_405685' fill='white'>
                <path d='M384 576H480V672H384V576Z' />
              </mask>
              <path
                d='M480 672V673H481V672H480ZM479 576V672H481V576H479ZM480 671H384V673H480V671Z'
                fill='#D0D5DD'
                mask='url(#path-131-inside-65_4940_405685)'
              />
              <mask id='path-133-inside-66_4940_405685' fill='white'>
                <path d='M480 576H576V672H480V576Z' />
              </mask>
              <path
                d='M576 672V673H577V672H576ZM575 576V672H577V576H575ZM576 671H480V673H576V671Z'
                fill='#D0D5DD'
                mask='url(#path-133-inside-66_4940_405685)'
              />
              <mask id='path-135-inside-67_4940_405685' fill='white'>
                <path d='M576 576H672V672H576V576Z' />
              </mask>
              <path
                d='M672 672V673H673V672H672ZM671 576V672H673V576H671ZM672 671H576V673H672V671Z'
                fill='#D0D5DD'
                mask='url(#path-135-inside-67_4940_405685)'
              />
              <mask id='path-137-inside-68_4940_405685' fill='white'>
                <path d='M672 576H768V672H672V576Z' />
              </mask>
              <path
                d='M768 672V673H769V672H768ZM767 576V672H769V576H767ZM768 671H672V673H768V671Z'
                fill='#D0D5DD'
                mask='url(#path-137-inside-68_4940_405685)'
              />
              <mask id='path-139-inside-69_4940_405685' fill='white'>
                <path d='M768 576H864V672H768V576Z' />
              </mask>
              <path
                d='M864 672V673H865V672H864ZM863 576V672H865V576H863ZM864 671H768V673H864V671Z'
                fill='#D0D5DD'
                mask='url(#path-139-inside-69_4940_405685)'
              />
              <mask id='path-141-inside-70_4940_405685' fill='white'>
                <path d='M864 576H960V672H864V576Z' />
              </mask>
              <path
                d='M960 672V673H961V672H960ZM959 576V672H961V576H959ZM960 671H864V673H960V671Z'
                fill='#D0D5DD'
                mask='url(#path-141-inside-70_4940_405685)'
              />
              <mask id='path-143-inside-71_4940_405685' fill='white'>
                <path d='M0 672H96V768H0V672Z' />
              </mask>
              <path
                d='M96 768V769H97V768H96ZM95 672V768H97V672H95ZM96 767H0V769H96V767Z'
                fill='#D0D5DD'
                mask='url(#path-143-inside-71_4940_405685)'
              />
              <mask id='path-145-inside-72_4940_405685' fill='white'>
                <path d='M96 672H192V768H96V672Z' />
              </mask>
              <path
                d='M192 768V769H193V768H192ZM191 672V768H193V672H191ZM192 767H96V769H192V767Z'
                fill='#D0D5DD'
                mask='url(#path-145-inside-72_4940_405685)'
              />
              <mask id='path-147-inside-73_4940_405685' fill='white'>
                <path d='M192 672H288V768H192V672Z' />
              </mask>
              <path
                d='M288 768V769H289V768H288ZM287 672V768H289V672H287ZM288 767H192V769H288V767Z'
                fill='#D0D5DD'
                mask='url(#path-147-inside-73_4940_405685)'
              />
              <mask id='path-149-inside-74_4940_405685' fill='white'>
                <path d='M288 672H384V768H288V672Z' />
              </mask>
              <path d='M288 672H384V768H288V672Z' fill='#F2F4F7' />
              <path
                d='M384 768V769H385V768H384ZM383 672V768H385V672H383ZM384 767H288V769H384V767Z'
                fill='#D0D5DD'
                mask='url(#path-149-inside-74_4940_405685)'
              />
              <mask id='path-151-inside-75_4940_405685' fill='white'>
                <path d='M384 672H480V768H384V672Z' />
              </mask>
              <path
                d='M480 768V769H481V768H480ZM479 672V768H481V672H479ZM480 767H384V769H480V767Z'
                fill='#D0D5DD'
                mask='url(#path-151-inside-75_4940_405685)'
              />
              <mask id='path-153-inside-76_4940_405685' fill='white'>
                <path d='M480 672H576V768H480V672Z' />
              </mask>
              <path
                d='M576 768V769H577V768H576ZM575 672V768H577V672H575ZM576 767H480V769H576V767Z'
                fill='#D0D5DD'
                mask='url(#path-153-inside-76_4940_405685)'
              />
              <mask id='path-155-inside-77_4940_405685' fill='white'>
                <path d='M576 672H672V768H576V672Z' />
              </mask>
              <path
                d='M672 768V769H673V768H672ZM671 672V768H673V672H671ZM672 767H576V769H672V767Z'
                fill='#D0D5DD'
                mask='url(#path-155-inside-77_4940_405685)'
              />
              <mask id='path-157-inside-78_4940_405685' fill='white'>
                <path d='M672 672H768V768H672V672Z' />
              </mask>
              <path
                d='M768 768V769H769V768H768ZM767 672V768H769V672H767ZM768 767H672V769H768V767Z'
                fill='#D0D5DD'
                mask='url(#path-157-inside-78_4940_405685)'
              />
              <mask id='path-159-inside-79_4940_405685' fill='white'>
                <path d='M768 672H864V768H768V672Z' />
              </mask>
              <path
                d='M864 768V769H865V768H864ZM863 672V768H865V672H863ZM864 767H768V769H864V767Z'
                fill='#D0D5DD'
                mask='url(#path-159-inside-79_4940_405685)'
              />
              <mask id='path-161-inside-80_4940_405685' fill='white'>
                <path d='M864 672H960V768H864V672Z' />
              </mask>
              <path d='M864 672H960V768H864V672Z' fill='#F2F4F7' />
              <path
                d='M960 768V769H961V768H960ZM959 672V768H961V672H959ZM960 767H864V769H960V767Z'
                fill='#D0D5DD'
                mask='url(#path-161-inside-80_4940_405685)'
              />
              <mask id='path-163-inside-81_4940_405685' fill='white'>
                <path d='M0 768H96V864H0V768Z' />
              </mask>
              <path d='M0 768H96V864H0V768Z' fill='#F2F4F7' />
              <path
                d='M96 864V865H97V864H96ZM95 768V864H97V768H95ZM96 863H0V865H96V863Z'
                fill='#D0D5DD'
                mask='url(#path-163-inside-81_4940_405685)'
              />
              <mask id='path-165-inside-82_4940_405685' fill='white'>
                <path d='M96 768H192V864H96V768Z' />
              </mask>
              <path
                d='M192 864V865H193V864H192ZM191 768V864H193V768H191ZM192 863H96V865H192V863Z'
                fill='#D0D5DD'
                mask='url(#path-165-inside-82_4940_405685)'
              />
              <mask id='path-167-inside-83_4940_405685' fill='white'>
                <path d='M192 768H288V864H192V768Z' />
              </mask>
              <path
                d='M288 864V865H289V864H288ZM287 768V864H289V768H287ZM288 863H192V865H288V863Z'
                fill='#D0D5DD'
                mask='url(#path-167-inside-83_4940_405685)'
              />
              <mask id='path-169-inside-84_4940_405685' fill='white'>
                <path d='M288 768H384V864H288V768Z' />
              </mask>
              <path
                d='M384 864V865H385V864H384ZM383 768V864H385V768H383ZM384 863H288V865H384V863Z'
                fill='#D0D5DD'
                mask='url(#path-169-inside-84_4940_405685)'
              />
              <mask id='path-171-inside-85_4940_405685' fill='white'>
                <path d='M384 768H480V864H384V768Z' />
              </mask>
              <path
                d='M480 864V865H481V864H480ZM479 768V864H481V768H479ZM480 863H384V865H480V863Z'
                fill='#D0D5DD'
                mask='url(#path-171-inside-85_4940_405685)'
              />
              <mask id='path-173-inside-86_4940_405685' fill='white'>
                <path d='M480 768H576V864H480V768Z' />
              </mask>
              <path
                d='M576 864V865H577V864H576ZM575 768V864H577V768H575ZM576 863H480V865H576V863Z'
                fill='#D0D5DD'
                mask='url(#path-173-inside-86_4940_405685)'
              />
              <mask id='path-175-inside-87_4940_405685' fill='white'>
                <path d='M576 768H672V864H576V768Z' />
              </mask>
              <path d='M576 768H672V864H576V768Z' fill='#F2F4F7' />
              <path
                d='M672 864V865H673V864H672ZM671 768V864H673V768H671ZM672 863H576V865H672V863Z'
                fill='#D0D5DD'
                mask='url(#path-175-inside-87_4940_405685)'
              />
              <mask id='path-177-inside-88_4940_405685' fill='white'>
                <path d='M672 768H768V864H672V768Z' />
              </mask>
              <path
                d='M768 864V865H769V864H768ZM767 768V864H769V768H767ZM768 863H672V865H768V863Z'
                fill='#D0D5DD'
                mask='url(#path-177-inside-88_4940_405685)'
              />
              <mask id='path-179-inside-89_4940_405685' fill='white'>
                <path d='M768 768H864V864H768V768Z' />
              </mask>
              <path
                d='M864 864V865H865V864H864ZM863 768V864H865V768H863ZM864 863H768V865H864V863Z'
                fill='#D0D5DD'
                mask='url(#path-179-inside-89_4940_405685)'
              />
              <mask id='path-181-inside-90_4940_405685' fill='white'>
                <path d='M864 768H960V864H864V768Z' />
              </mask>
              <path
                d='M960 864V865H961V864H960ZM959 768V864H961V768H959ZM960 863H864V865H960V863Z'
                fill='#D0D5DD'
                mask='url(#path-181-inside-90_4940_405685)'
              />
              <mask id='path-183-inside-91_4940_405685' fill='white'>
                <path d='M0 864H96V960H0V864Z' />
              </mask>
              <path
                d='M96 960V961H97V960H96ZM95 864V960H97V864H95ZM96 959H0V961H96V959Z'
                fill='#D0D5DD'
                mask='url(#path-183-inside-91_4940_405685)'
              />
              <mask id='path-185-inside-92_4940_405685' fill='white'>
                <path d='M96 864H192V960H96V864Z' />
              </mask>
              <path
                d='M192 960V961H193V960H192ZM191 864V960H193V864H191ZM192 959H96V961H192V959Z'
                fill='#D0D5DD'
                mask='url(#path-185-inside-92_4940_405685)'
              />
              <mask id='path-187-inside-93_4940_405685' fill='white'>
                <path d='M192 864H288V960H192V864Z' />
              </mask>
              <path
                d='M288 960V961H289V960H288ZM287 864V960H289V864H287ZM288 959H192V961H288V959Z'
                fill='#D0D5DD'
                mask='url(#path-187-inside-93_4940_405685)'
              />
              <mask id='path-189-inside-94_4940_405685' fill='white'>
                <path d='M288 864H384V960H288V864Z' />
              </mask>
              <path
                d='M384 960V961H385V960H384ZM383 864V960H385V864H383ZM384 959H288V961H384V959Z'
                fill='#D0D5DD'
                mask='url(#path-189-inside-94_4940_405685)'
              />
              <mask id='path-191-inside-95_4940_405685' fill='white'>
                <path d='M384 864H480V960H384V864Z' />
              </mask>
              <path
                d='M480 960V961H481V960H480ZM479 864V960H481V864H479ZM480 959H384V961H480V959Z'
                fill='#D0D5DD'
                mask='url(#path-191-inside-95_4940_405685)'
              />
              <mask id='path-193-inside-96_4940_405685' fill='white'>
                <path d='M480 864H576V960H480V864Z' />
              </mask>
              <path
                d='M576 960V961H577V960H576ZM575 864V960H577V864H575ZM576 959H480V961H576V959Z'
                fill='#D0D5DD'
                mask='url(#path-193-inside-96_4940_405685)'
              />
              <mask id='path-195-inside-97_4940_405685' fill='white'>
                <path d='M576 864H672V960H576V864Z' />
              </mask>
              <path
                d='M672 960V961H673V960H672ZM671 864V960H673V864H671ZM672 959H576V961H672V959Z'
                fill='#D0D5DD'
                mask='url(#path-195-inside-97_4940_405685)'
              />
              <mask id='path-197-inside-98_4940_405685' fill='white'>
                <path d='M672 864H768V960H672V864Z' />
              </mask>
              <path
                d='M768 960V961H769V960H768ZM767 864V960H769V864H767ZM768 959H672V961H768V959Z'
                fill='#D0D5DD'
                mask='url(#path-197-inside-98_4940_405685)'
              />
              <mask id='path-199-inside-99_4940_405685' fill='white'>
                <path d='M768 864H864V960H768V864Z' />
              </mask>
              <path
                d='M864 960V961H865V960H864ZM863 864V960H865V864H863ZM864 959H768V961H864V959Z'
                fill='#D0D5DD'
                mask='url(#path-199-inside-99_4940_405685)'
              />
              <mask id='path-201-inside-100_4940_405685' fill='white'>
                <path d='M864 864H960V960H864V864Z' />
              </mask>
              <path
                d='M960 960V961H961V960H960ZM959 864V960H961V864H959ZM960 959H864V961H960V959Z'
                fill='#D0D5DD'
                mask='url(#path-201-inside-100_4940_405685)'
              />
            </g>
            <rect x='0.5' y='0.5' width={959} height={959} stroke='#D0D5DD' />
          </g>
          <defs>
            <radialGradient
              id='paint0_radial_4940_405685'
              cx={0}
              cy={0}
              r={1}
              gradientUnits='userSpaceOnUse'
              gradientTransform='translate(480 -0.000114441) rotate(90) scale(960 501.059)'
            >
              <stop />
              <stop offset='0.953125' stopOpacity={0} />
            </radialGradient>
            <clipPath id='clip0_4940_405685'>
              <rect width={960} height={960} fill='white' />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className='flex min-h-[100vh] w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-black'>
        <Card className='mx-4 w-full max-w-md lg:border-none lg:bg-transparent'>
          <CardHeader className='text-center'>
            <div className='mt-4 flex items-center justify-center gap-2'>
              <Logo />
              <h1 className='text-foreground text-2xl font-semibold tracking-tight'>
                Genit
              </h1>
            </div>
            <CardTitle className='text-2xl font-bold'>Welcome back</CardTitle>
            <CardDescription>Sign in to continue using genit</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            {/* Social Login Buttons */}
            <div className='space-y-1'>
              <Button
                type='button'
                variant='outline'
                className='hover:border-primary/50 relative w-full overflow-hidden py-5 transition-all hover:bg-white/70'
                disabled={loading2}
                onClick={() => {
                  setLoading2(true);
                  googleLogin();
                }}
              >
                {loading2 ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      className='mr-2 h-4 w-4 animate-spin text-gray-600'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <div className='flex items-center justify-center'>
                    <svg
                      stroke='currentColor'
                      fill='currentColor'
                      strokeWidth='0'
                      version='1.1'
                      x='0px'
                      y='0px'
                      viewBox='0 0 48 48'
                      enableBackground='new 0 0 48 48'
                      className='mr-2 h-4 w-4'
                      height='1em'
                      width='1em'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fill='#FFC107'
                        d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                      ></path>
                      <path
                        fill='#FF3D00'
                        d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                      ></path>
                      <path
                        fill='#4CAF50'
                        d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                      ></path>
                      <path
                        fill='#1976D2'
                        d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                      ></path>
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className='flex items-center'>
              <hr className='flex-grow border-t border-gray-200 dark:border-neutral-900' />
              <span className='px-3 text-sm text-gray-500 dark:text-gray-400'>
                Or sign up with
              </span>
              <hr className='flex-grow border-t border-gray-200 dark:border-neutral-900' />
            </div>

            {/* Form */}
            <form className='mt-5 space-y-4' onSubmit={HandleSubmit}>
              <div className='space-y-4'>
                {/* Email Field */}
                <div>
                  <div className='relative'>
                    <input
                      type='email'
                      name='email'
                      required
                      onChange={(
                        Event: React.ChangeEvent<HTMLInputElement>
                      ) => {
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
                        <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                        <circle cx={12} cy={7} r={4} />
                      </svg>
                    </div>
                  </div>
                  {errorMsg.email && formData.email && (
                    <p className='text-TextLight2 dark:text-TextDark2 mt-1 text-xs'>
                      {errorMsg.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className='relative'>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      name='password'
                      onChange={(
                        Event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleInputChange(Event);
                        const regexProps: RegexType = {
                          fieldname: "password",
                          regex: PASSWORD_REGEX,
                          value: Event.target.value,
                          errormsg: "8+ characters required",
                        };
                        SignupValidate(regexProps);
                      }}
                      className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 pr-11 pl-11 text-sm text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-cyan-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100'
                      placeholder='Enter password'
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
                        <path d='M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z' />
                        <circle cx='16.5' cy='7.5' r='.5' />
                      </svg>
                    </div>
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 transition-colors hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                    >
                      {showPassword ? (
                        <svg
                          className='h-4 w-4'
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
                          <path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
                          <path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' />
                          <path d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' />
                          <line x1='2' x2='22' y1='2' y2='22' />
                        </svg>
                      ) : (
                        <svg
                          className='h-4 w-4'
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
                          <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
                          <circle cx='12' cy='12' r='3' />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errorMsg.password && formData.password && (
                    <p className='text-TextLight2 dark:text-TextDark2 mt-1 text-xs'>
                      {errorMsg.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className='focus:ring-primary/30 dark:focus:ring-primary/40 w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 focus:ring-4 focus:outline-none'
                type='submit'
                disabled={!allfieldvalid || loading}
              >
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      className='mr-3 -ml-1 h-4 w-4 animate-spin text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
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
            <div className='text-muted-foreground my-4 flex w-full flex-col items-center justify-center gap-4 text-center text-sm'>
              {/* Sign Up Link */}
              <div>
                <span> Don't have an account? </span>

                <Link
                  href='/signup'
                  className='text-TextLight2 dark:text-TextDark2 font-medium underline hover:no-underline'
                  prefetch={false}
                >
                  Sign Up
                </Link>
              </div>

              {/* Forgot Password Link */}
              <div className='text-center'>
                <span> Forgot password? </span>
                <Link
                  href='/recover'
                  className='text-TextLight2 dark:text-TextDark2 text-sm font-medium underline hover:no-underline'
                  prefetch={false}
                >
                  recover
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='mt-5 w-full max-w-[26rem] space-y-3'>
          <p className='text-center text-xs leading-relaxed text-gray-600 dark:text-gray-400'>
            This site is protected by reCAPTCHA and our{" "}
            <a
              href='#'
              className='text-TextLight1 dark:text-TextDark1 underline hover:no-underline'
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
          <p className='text-center text-xs text-gray-600 dark:text-gray-400'>
            ©2026 genit. A product of{" "}
            <a
              className='font-medium text-gray-800 hover:text-blue-600 dark:text-white'
              href='#'
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
