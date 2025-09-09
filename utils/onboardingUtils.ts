import { apiResponse } from "./apiResponse";

export interface OnboardingStatus {
  hasOnboarding: boolean;
  onboardingCompleted: boolean;
  shouldRedirect: boolean;
  data: any;
}

/**
 * Check if the current user has completed onboarding
 * @returns Promise<OnboardingStatus> - The onboarding status information
 */
export const checkOnboardingStatus = async (): Promise<OnboardingStatus> => {
  try {
    const response = await apiResponse.get("/auth/onboarding-status", {
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch onboarding status");
    }
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // Return default status indicating onboarding is needed
    return {
      hasOnboarding: false,
      onboardingCompleted: false,
      shouldRedirect: true,
      data: null,
    };
  }
};

/**
 * Check if user should be redirected to onboarding
 * @returns Promise<boolean> - true if user should be redirected to onboarding
 */
export const shouldRedirectToOnboarding = async (): Promise<boolean> => {
  const status = await checkOnboardingStatus();
  return !status.onboardingCompleted;
};

/**
 * Check if user should be redirected to chat (onboarding completed)
 * @returns Promise<boolean> - true if user should be redirected to chat
 */
export const shouldRedirectToChat = async (): Promise<boolean> => {
  const status = await checkOnboardingStatus();
  return status.onboardingCompleted;
};

/**
 * Get the appropriate redirect path based on onboarding status
 * @returns Promise<string> - The path to redirect to
 */
export const getOnboardingRedirectPath = async (): Promise<string> => {
  const status = await checkOnboardingStatus();
  return status.onboardingCompleted ? "/chat" : "/onboarding";
};

