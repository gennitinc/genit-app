// Onboarding removed: this file is deprecated. Keep as no-op exports if imported elsewhere.
export const shouldRedirectToOnboarding = async (): Promise<boolean> => {
  return false;
};

export const shouldRedirectToChat = async (): Promise<boolean> => {
  return true;
};

export const getOnboardingRedirectPath = async (): Promise<string> => {
  return "/chat";
};
