import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const APP_ENV =  process.env.NODE_ENV;
const IS_PROD = process.env.NODE_ENV === "production";

type MixpanelProps = Record<string, unknown>;

export type MixpanelUserProfile = {
  id: string;
  email?: string;
  username?: string;
  plan?: string;
  createdAt?: number | string | Date;
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
  role?: string;
};

let initialized = false;
let initFailed = false;

const isMixpanelEnabled = () =>
  typeof window !== "undefined" && Boolean(MIXPANEL_TOKEN);

const toIsoDate = (value?: number | string | Date) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export const initMixpanel = (MIXPANEL_TOKEN_VALUE: string) => {
  if (!isMixpanelEnabled()) {
    console.warn("Mixpanel token is missing! Check your .env file.");
    return false;
  }

  if (initialized && !initFailed) return true;

  try {
    mixpanel.init(MIXPANEL_TOKEN_VALUE as string, {
      autocapture: true,
      track_pageview: true,
      persistence: "localStorage",
      ignore_dnt: true,
      debug: !IS_PROD,
      batch_requests: IS_PROD,
      api_transport: "XHR",
      loaded: (instance) => {
        if (!IS_PROD) {
          console.log("[mixpanel] initialized", {
            distinct_id: instance.get_distinct_id?.(),
            token: MIXPANEL_TOKEN_VALUE,
          });
        }
      },
    });
    initialized = true;
    initFailed = false;
    return true;
  } catch (error) {
    initialized = false;
    initFailed = true;
    console.error("Mixpanel initialization failed:", error);
    return false;
  }
};

const withDefaults = (properties?: MixpanelProps): MixpanelProps => ({
  app: "gennit-app",
  environment: APP_ENV,
  ...properties,
});

export const trackEvent = (eventName: string, properties?: MixpanelProps) => {
  if (!isMixpanelEnabled()) return;
  const ready = initialized || initMixpanel(MIXPANEL_TOKEN as string);
  if (!ready) return;
  try {
    mixpanel.track(eventName, withDefaults(properties), (response) => {
      if (!IS_PROD) {
        console.log("[mixpanel] track callback", { eventName, response });
      }
    });
  } catch (error) {
    console.error(`Mixpanel track failed for "${eventName}":`, error);
  }
};

export const identifyUser = (profile: MixpanelUserProfile) => {
  if (!isMixpanelEnabled()) return;
  const ready = initialized || initMixpanel(MIXPANEL_TOKEN as string);
  if (!ready) return;
  try {
    mixpanel.identify(profile.id);
    if (mixpanel.people?.set) {
      mixpanel.people.set({
        $email: profile.email,
        $name: profile.username,
        plan: profile.plan,
        role: profile.role,
        email_verified: profile.emailVerified,
        onboarding_completed: profile.onboardingCompleted,
        signed_up_at: toIsoDate(profile.createdAt),
        last_seen_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error(`Mixpanel identify failed for user "${profile.id}":`, error);
  }
};

export const identifyAndTrackAuth = (
  profile: MixpanelUserProfile,
  eventName: "signup_completed" | "login_completed",
  properties?: MixpanelProps,
) => {
  identifyUser(profile);
  trackEvent(eventName, {
    auth_method: properties?.auth_method || "password",
    plan: profile.plan,
    ...properties,
  });
};

export const resetMixpanelUser = () => {
  if (!isMixpanelEnabled()) return;
  const ready = initialized || initMixpanel(MIXPANEL_TOKEN as string);
  if (!ready) return;
  try {
    mixpanel.reset();
  } catch (error) {
    console.error("Mixpanel reset failed:", error);
  }
};

export const trackPageView = (path: string, properties?: MixpanelProps) => {
  trackEvent("page_viewed", {
    path,
    ...properties,
  });
};

export const trackExperimentExposure = (
  experimentKey: string,
  variant: string,
  properties?: MixpanelProps,
) => {
  trackEvent("ab_experiment_exposed", {
    experiment_key: experimentKey,
    variant,
    ...properties,
  });
};

export const trackAppOpened = (
  appId: string,
  appName: string,
  source: string,
  properties?: MixpanelProps,
) => {
  trackEvent("app_opened", {
    app_id: appId,
    app_name: appName,
    source,
    ...properties,
  });
};

export const trackFeatureUsed = (
  featureName: string,
  properties?: MixpanelProps,
) => {
  trackEvent("feature_used", {
    feature_name: featureName,
    ...properties,
  });
};
