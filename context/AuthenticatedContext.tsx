"use client";
import { NetworkStatus } from "@/components/network/NetworkStatus";
import {
  identifyAndTrackAuth,
  identifyUser,
  resetMixpanelUser,
  trackEvent,
} from "@/lib/mixpanelClient";
import Loading from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

const uToken = cookie.get("genituToken");

export enum Plan {
  BASIC = "Basic",
  CREATOR = "Creator",
  STUDIO = "Studio",
  PRO_STUDIO = "Pro Studio",
  AGENCY = "Agency",
  ENTERPRISE = "Enterprise",
}

export interface Organization {
  _id: string;
  businessName: string;
  businessLogo?: string;
  businessBio?: string;
  businessWebsite?: string;
  businessCategory?: string;
  businessPlan?: string;
  industry?: string;
  country?: string;
  language?: string;
  brandColors?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  fontHeadline?: string;
  fontBody?: string;
  aboutUs?: string;
  mission?: string;
  vision?: string;
  slogan?: string;
  values?: string[];
  voiceTone?: string[];
  socialMediaUrls?: { platform: string; url: string }[];
  owner: string;
  members?: { user: string; role: string; joinedAt?: string }[];
  derivedFromOnboarding?: boolean;
  autoModeEnabled?: boolean;
  autoModeIntervalMinutes?: number;
  autoModeLastRunAt?: string;
  autoModeLastError?: string;
  automationApprovalPolicy?: "destructive" | "external" | "all";
  automationDailyActionLimit?: number;
  automationMaxCreditsPerRun?: number;
  autoModeGoals?: Array<{
    id: string;
    title: string;
    metric: "impressions" | "clicks" | "conversions" | "conversionValue" | "roi";
    target: number;
    deadline?: string;
    status: "active" | "achieved" | "paused";
  }>;
  autoModeCurrentPlan?: {
    generatedAt: string;
    objective: string;
    correction?: string;
    steps: Array<{
      title: string;
      action: string;
      priority: "high" | "medium" | "low";
      status: string;
    }>;
  };
  autoModeEvaluations?: Array<{
    evaluatedAt: string;
    metrics: Record<string, number>;
    goals: Array<{
      id: string;
      current: number;
      target: number;
      progress: number;
      trend: "improving" | "declining" | "flat";
      status: string;
    }>;
  }>;
  autoModeExperiments?: Array<{
    id: string;
    title: string;
    metric: "impressions" | "clicks" | "conversions" | "conversionValue" | "roi";
    minimumLiftPercent: number;
    samples: number;
    status: "running" | "paused" | "completed";
    winner?: "A" | "B";
    liftPercent?: number;
    variantA: { campaignId: string; campaignName?: string; value?: number };
    variantB: { campaignId: string; campaignName?: string; value?: number };
  }>;
  autoModeAllocation?: {
    generatedAt: string;
    totalBudget: number;
    appliedAt?: string;
    campaigns: Array<{
      campaignId: string;
      campaignName: string;
      share: number;
      suggestedBudget: number;
      reason: string;
    }>;
  };
  autoModeSimulation?: {
    generatedAt: string;
    model: string;
    confidence: "low" | "medium";
    baseline: {
      clicks: number;
      conversions: number;
      conversionValue: number;
      budget: number;
    };
    projected: {
      clicks: number;
      conversions: number;
      conversionValue: number;
      budget: number;
    };
    uplift: {
      clicks: number;
      conversions: number;
      conversionValue: number;
    };
  };
  autoModeAlerts?: Array<{
    id: string;
    severity: "success" | "warning" | "critical";
    title: string;
    message: string;
    status: "open" | "acknowledged";
    createdAt: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields kept for back-compat with existing settings UI
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  designer?: boolean;
  emailCampaignProfile?: { approvedName: string; approvedEmail: string }[];
}

export interface Team {
  _id: string;
  organization: string;
  name: string;
  description?: string;
  color?: string;
  members?: { user: string; role: string; joinedAt?: string }[];
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
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
  business: Organization;
  allOrganizations?: Organization[];
  currentOrganization?: Organization | null;
  userPlan: Plan;
  role: "user" | "admin";
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
    onboardingSkipped?: boolean;
    onboardingStep: string;
    businessName?: string;
    businessBio?: string;
    industry?: string;
    country?: string;
    language?: string;
    companyWebsite?: string;
    brandLogo?: string;
    ogImage?: string;
    aboutUs?: string;
    mission?: string;
    vision?: string;
    slogan?: string;
    values?: string[];
    voiceTone?: string[];
    brandColors?: string[];
    fontHeadline?: string;
    fontBody?: string;
    primaryGoal?: string;
    channels?: string[]; // Legacy format
    socialMediaUrls?: { platform: string; url: string }[];
    primaryColor?: string;
    secondaryColor?: string;
    role?: string;
    hearAboutUs?: string;
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
  switchOrganization: (orgId: string) => Promise<void>;
  createOrganization: (payload: {
    businessName: string;
    businessBio?: string;
    businessLogo?: string;
    businessWebsite?: string;
    industry?: string;
    country?: string;
    language?: string;
    brandColors?: string[];
    primaryColor?: string;
    secondaryColor?: string;
    fontHeadline?: string;
    fontBody?: string;
    aboutUs?: string;
    mission?: string;
    vision?: string;
    slogan?: string;
    values?: string[];
    voiceTone?: string[];
    socialMediaUrls?: { platform: string; url: string }[];
  }) => Promise<Organization | null>;
  updateOrganization: (
    orgId: string,
    updates: Partial<Organization> & Record<string, any>
  ) => Promise<Organization | null>;
  createTeam: (
    orgId: string,
    payload: { name: string; description?: string; color?: string }
  ) => Promise<Team | null>;
  inviteToTeam: (
    orgId: string,
    teamId: string,
    payload: { email: string; role?: "Lead" | "Member" | "Viewer" }
  ) => Promise<{ _id: string; email: string; role: string } | null>;
  leaveTeam: (
    orgId: string,
    teamId: string
  ) => Promise<{ leftOrganization: boolean } | null>;
  fetchTeamsForOrg: (orgId: string) => Promise<Team[]>;
  updateUserPreferences: (
    preferences: Partial<User["preferences"]>
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
  {} as AuthenticatedContextInt
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
          cookie.remove("genituToken");
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

  const switchOrganization = async (orgId: string) => {
    try {
      const response = await apiResponse.patch(`/orgs/switch/${orgId}`);
      if (response.status === 200) {
        const next = response.data.currentOrganization as Organization;
        setuser((prev) =>
          prev ? { ...prev, currentOrganization: next } : prev
        );
        trackEvent("organization_switched", { organization_id: orgId });
      }
    } catch (error) {
      console.error("Failed to switch organization:", error);
      throw error;
    }
  };

  const createOrganization = async (payload: {
    businessName: string;
    businessBio?: string;
    businessLogo?: string;
    businessWebsite?: string;
    industry?: string;
    country?: string;
    language?: string;
    brandColors?: string[];
    primaryColor?: string;
    secondaryColor?: string;
    fontHeadline?: string;
    fontBody?: string;
    aboutUs?: string;
    mission?: string;
    vision?: string;
    slogan?: string;
    values?: string[];
    voiceTone?: string[];
    socialMediaUrls?: { platform: string; url: string }[];
  }) => {
    try {
      const response = await apiResponse.post(`/orgs`, payload);
      if (response.status === 201 || response.status === 200) {
        const org = response.data.organization as Organization;
        setuser((prev) =>
          prev
            ? {
                ...prev,
                allOrganizations: [...(prev.allOrganizations || []), org],
                currentOrganization: org,
              }
            : prev
        );
        trackEvent("organization_created", { organization_id: org._id });
        return org;
      }
      return null;
    } catch (error: any) {
      if (error?.response?.status === 402) {
        const err = new Error(
          error?.response?.data?.message ||
            "Upgrade to a paid plan to create more organizations."
        ) as Error & { code?: string };
        err.code = "UPGRADE_REQUIRED";
        throw err;
      }
      console.error("Failed to create organization:", error);
      throw error;
    }
  };

  const updateOrganization = async (
    orgId: string,
    updates: Partial<Organization> & Record<string, any>
  ) => {
    try {
      const response = await apiResponse.patch(`/orgs/${orgId}`, updates);
      if (response.status === 200) {
        const org = response.data.organization as Organization;
        setuser((prev) => {
          if (!prev) return prev;
          const nextAll = (prev.allOrganizations || []).map((o) =>
            o._id === org._id ? org : o
          );
          const isCurrent =
            prev.currentOrganization &&
            typeof prev.currentOrganization === "object" &&
            prev.currentOrganization._id === org._id;
          return {
            ...prev,
            allOrganizations: nextAll,
            currentOrganization: isCurrent ? org : prev.currentOrganization,
            business:
              typeof prev.business === "object" &&
              (prev.business as Organization)?._id === org._id
                ? org
                : prev.business,
          };
        });
        trackEvent("organization_updated", { organization_id: orgId });
        return org;
      }
      return null;
    } catch (error) {
      console.error("Failed to update organization:", error);
      throw error;
    }
  };

  const createTeam = async (
    orgId: string,
    payload: { name: string; description?: string; color?: string }
  ) => {
    try {
      const response = await apiResponse.post(`/orgs/${orgId}/teams`, payload);
      if (response.status === 201 || response.status === 200) {
        trackEvent("team_created", {
          organization_id: orgId,
          team_id: response.data.team?._id,
        });
        return response.data.team as Team;
      }
      return null;
    } catch (error) {
      console.error("Failed to create team:", error);
      throw error;
    }
  };

  const inviteToTeam = async (
    orgId: string,
    teamId: string,
    payload: { email: string; role?: "Lead" | "Member" | "Viewer" }
  ) => {
    try {
      const response = await apiResponse.post(
        `/orgs/${orgId}/teams/${teamId}/invitations`,
        payload
      );
      if (response.status === 201 || response.status === 200) {
        trackEvent("team_invitation_sent", {
          organization_id: orgId,
          team_id: teamId,
          role: payload.role || "Member",
        });
        return response.data.invitation;
      }
      return null;
    } catch (error) {
      console.error("Failed to invite to team:", error);
      throw error;
    }
  };

  const leaveTeam = async (orgId: string, teamId: string) => {
    try {
      const response = await apiResponse.post(
        `/orgs/${orgId}/teams/${teamId}/leave`
      );
      if (response.status === 200) {
        const leftOrganization = !!response.data?.leftOrganization;
        if (leftOrganization) {
          // Strip the org from local user state so the switcher updates instantly.
          setuser((prev) => {
            if (!prev) return prev;
            const nextAll = (prev.allOrganizations || []).filter(
              (o) => o._id !== orgId
            );
            const currentIsThisOrg =
              prev.currentOrganization &&
              typeof prev.currentOrganization === "object" &&
              prev.currentOrganization._id === orgId;
            return {
              ...prev,
              allOrganizations: nextAll,
              currentOrganization: currentIsThisOrg
                ? nextAll[0] || null
                : prev.currentOrganization,
            };
          });
        }
        trackEvent("team_left", {
          organization_id: orgId,
          team_id: teamId,
          left_organization: leftOrganization,
        });
        return { leftOrganization };
      }
      return null;
    } catch (error) {
      console.error("Failed to leave team:", error);
      throw error;
    }
  };

  const fetchTeamsForOrg = async (orgId: string): Promise<Team[]> => {
    try {
      const response = await apiResponse.get(`/orgs/${orgId}/teams`);
      if (response.status === 200) {
        return (response.data.teams as Team[]) || [];
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      return [];
    }
  };

  const updateUserPreferences = async (
    preferences: Partial<User["preferences"]>
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
        trackEvent("user_preferences_updated", {
          changed_fields: Object.keys(preferences ?? {}),
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

  useEffect(() => {
    if (!user?._id) return;
    identifyAndTrackAuth(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        plan: user.userPlan,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
        onboardingCompleted: user.onboarding?.onboardingCompleted,
        role: user.role,
      },
      "login_completed",
      { source: "session_restore" }
    );
  }, [user?._id]);

  // Show network status only for actual network errors when user exists
  const shouldShowNetworkStatus =
    isNetworkErrorWithDelay && uToken && user !== null;

  return (
    <AuthenticatedContext.Provider
      value={{
        user,
        setuser,
        fetchCurrentUser,
        switchOrganization,
        createOrganization,
        updateOrganization,
        createTeam,
        inviteToTeam,
        leaveTeam,
        fetchTeamsForOrg,
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
      {/* {loading ? (
        <div className='flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-white dark:bg-black'>
          <Loading />
        </div>
      ) : shouldShowNetworkStatus ? (
        <NetworkStatus
          isError={isNetworkError}
          retryFunction={fetchCurrentUser}
        />
      ) : (
        children
      )} */}
      {children}
    </AuthenticatedContext.Provider>
  );
}

export function useUserContext() {
  if (AuthenticatedContext === undefined) {
    throw new Error(
      "Authenticated context cannot be used outside of the provider"
    );
  }
  return React.useContext(AuthenticatedContext);
}
