"use client";
import React, { useEffect, useState, ReactNode } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/utils/Loading";

import cookie from "js-cookie";
import { apiResponse } from "@/utils/apiResponse";
import { NetworkStatus } from "@/components/network/NetworkStatus";

const uToken = cookie.get("gennituToken");

enum Plan {
  BASIC = "Basic",
  CREATOR = "Creator",
  STUDIO = "Studio",
  PRO_STUDIO = "Pro Studio",
  AGENCY = "Agency",
  ENTERPRISE = "Enterprise",
}

export interface User {
  _id: string;
  username: string;
  email: string;
  userdp: string;
  emailVerified: boolean;
  createdAt: number;
  updatedAt: number;
  webtourguide: boolean;
  emailtourguide: boolean;
  webtemplatetourguide: boolean;
  emailtemplatetourguide: boolean;
  formtourguide: boolean;
  __v: number;
  business: {
    _id: string;
    businessName: string;
    businessLogo: string;
    businessDescription: string;
    businessAddress: string;
    businessPhone: string;
    businessEmail: string;
    businessBio: string;
    businessWebsite: string;
    businessCategory: string;
    businessPlan: string;
    designer: boolean;

    emailCampaignProfile: [
      {
        approvedName: string;
        approvedEmail: string;
      },
    ];
  };
  userPlan: Plan;
  creditsRemaining?: number;
  creditsUsed?: number;
  status: {
    label: string;
    icon: string;
    userid: string | undefined;
  };
  preferences?: {
    theme: "light" | "dark" | "system";
    emailNotifications: boolean;
    marketingEmails: boolean;
    twoFactorAuth: boolean;
    loginNotifications: boolean;
  };
  onboarding?: {
    _id: string;
    onboardingCompleted: boolean;
    onboardingStep: string;
    businessName?: string;
    businessBio?: string;
    industry?: string;
    country?: string;
    language?: string;
    companyWebsite?: string;
    primaryGoal?: string;
    channels?: string[]; // Legacy format
    socialMediaUrls?: { platform: string; url: string }[];
    primaryColor?: string;
    secondaryColor?: string;
  };
}

type StatusOption = {
  userid: string | undefined;
  icon: string;
  label: string;
  default?: boolean;
};

interface AuthenticatedContextInt {
  user: User | null;
  setuser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchCurrentUser: () => Promise<void>;
  updateUserPreferences: (
    preferences: Partial<User["preferences"]>,
  ) => Promise<void>;
  setIsKlipAiVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isKlipAiVisible: boolean;
  setIsBotOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBotOpen: boolean;
  setKlipBotNotify: React.Dispatch<React.SetStateAction<boolean>>;
  klipBotNotify: boolean;
  StatusValue: StatusOption | undefined;
  setStatusValue: React.Dispatch<
    React.SetStateAction<StatusOption | undefined>
  >;
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthenticatedContext = React.createContext<AuthenticatedContextInt>(
  {} as AuthenticatedContextInt,
);

export function AuthenticatedContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setuser] = useState<User | null>(null);
  const [isKlipAiVisible, setIsKlipAiVisible] = useState(true);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [klipBotNotify, setKlipBotNotify] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [StatusValue, setStatusValue] = useState<StatusOption | undefined>();
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [isNetworkErrorWithDelay, setIsNetworkErrorWithDelay] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [dataFetched, setDataFetched] = useState(false);

  const fetchCurrentUser = async () => {
    setLoading(true);
    setIsNetworkError(false);
    setIsNetworkErrorWithDelay(false);

    try {
      const response = await apiResponse.get("/user/active-user");

      if (response.status === 200) {
        setuser(response.data.user);
        setStatusValue(response.data.user.status);
        setDataFetched(true);
      } else {
        throw new Error("Incomplete user data");
      }
    } catch (error: any) {
      // Check if it's a network error (no response) vs authentication error
      if (!error.response) {
        // Network error - no response from server
        setIsNetworkError(true);
        setTimeout(() => setIsNetworkErrorWithDelay(true), 300);
        setDataFetched(false);
      } else {
        // Authentication error (401, 403, etc.) - clear token and redirect to signin
        if (error.response.status === 401 || error.response.status === 403) {
          cookie.remove("gennituToken");
          setuser(null);
          setDataFetched(false);
          // Redirect to signin page
          router.push("/signin");
        } else {
          // Other server errors - treat as network error
          setIsNetworkError(true);
          setTimeout(() => setIsNetworkErrorWithDelay(true), 300);
          setDataFetched(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserPreferences = async (
    preferences: Partial<User["preferences"]>,
  ) => {
    if (!user) return;

    try {
      const response = await apiResponse.put("/user/preferences", preferences);

      if (response.status === 200) {
        // Update local user state with new preferences
        setuser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            preferences: {
              ...prevUser.preferences,
              ...preferences,
            } as User["preferences"],
          };
        });
      }
    } catch (error) {
      console.error("Failed to update user preferences:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (uToken) fetchCurrentUser();
    else setLoading(false); // No need to fetch if there's no token
  }, [isReload]);

  // Show network status only for actual network errors when user exists
  const shouldShowNetworkStatus =
    isNetworkErrorWithDelay && uToken && user !== null;

  return (
    <AuthenticatedContext.Provider
      value={{
        user,
        setuser,
        fetchCurrentUser,
        updateUserPreferences,
        isKlipAiVisible,
        setIsKlipAiVisible,
        loading,
        setLoading,
        isBotOpen,
        setIsBotOpen,
        klipBotNotify,
        setKlipBotNotify,
        StatusValue,
        isReload,
        setStatusValue,
        setIsReload,
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center min-h-[100dvh] overflow-hidden w-full bg-white dark:bg-black">
          <Loading />
        </div>
      ) : shouldShowNetworkStatus ? (
        <NetworkStatus
          isError={isNetworkError}
          retryFunction={fetchCurrentUser}
        />
      ) : (
        children
      )}
    </AuthenticatedContext.Provider>
  );
}

export function useUserContext() {
  if (AuthenticatedContext === undefined) {
    throw new Error(
      "Authenticated context cannot be used outside of the provider",
    );
  }
  return React.useContext(AuthenticatedContext);
}
