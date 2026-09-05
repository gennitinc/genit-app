import { AutoModeDialog } from "@/components/common/auto-mode-dialog";
import CreditTopUpModal from "@/components/credits/CreditTopUpModal";
import { LanguageSelect } from "@/components/language-select";
import { LocalizedText } from "@/components/localized-text";
import PricingComponent from "@/components/pricing/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import BrandSettings from "@/components/user-settings/brand-settings";
import AccountActionModal from "@/components/user/account-action-modal";
import {
  Organization,
  Plan,
  User,
  useUserContext,
} from "@/context/AuthenticatedContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAccountActions } from "@/hooks/use-account-actions";
import { useToast } from "@/hooks/use-toast";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import {
  ArrowDownUp,
  Bell,
  Bot,
  Check,
  CreditCard,
  Download,
  KeyRound,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Shield,
  SlidersHorizontal,
  Sun,
  Target,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SettingsHome = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("account");
  const { user, setuser, updateOrganization, updateUserPreferences } =
    useUserContext();
  const router = useRouter();
  const currentOrg: Organization | null =
    user?.currentOrganization && typeof user.currentOrganization === "object"
      ? user.currentOrganization
      : user?.business && typeof user.business === "object"
        ? (user.business as Organization)
        : null;
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { signOut, deleteAccount, isSigningOut, isDeletingAccount } =
    useAccountActions();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<any[]>([]);
  const [openingBillingPortal, setOpeningBillingPortal] = useState(false);
  const [savingAuto, setSavingAuto] = useState(false);
  const [isAutoModeDialogOpen, setIsAutoModeDialogOpen] = useState(false);
  const [automationRuns, setAutomationRuns] = useState<any[]>([]);
  const [autoInsights, setAutoInsights] = useState<any>(null);
  const [autoCampaigns, setAutoCampaigns] = useState<any[]>([]);
  const [autoMissions, setAutoMissions] = useState<any[]>([]);
  const [autoDrafts, setAutoDrafts] = useState<any[]>([]);
  const [publishingIntegrations, setPublishingIntegrations] = useState<any[]>(
    []
  );
  const [missionEdits, setMissionEdits] = useState<Record<string, string>>({});
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({});
  const [missionDraftAccounts, setMissionDraftAccounts] = useState<
    Record<string, string>
  >({});
  const [draftRunAt, setDraftRunAt] = useState<Record<string, string>>({});
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalMetric, setGoalMetric] = useState<
    "impressions" | "clicks" | "conversions" | "conversionValue" | "roi"
  >("clicks");
  const [goalTarget, setGoalTarget] = useState(100);
  const [experimentTitle, setExperimentTitle] = useState("");
  const [experimentMetric, setExperimentMetric] = useState<
    "impressions" | "clicks" | "conversions" | "conversionValue" | "roi"
  >("clicks");
  const [variantA, setVariantA] = useState("");
  const [variantB, setVariantB] = useState("");
  const [experimentLift, setExperimentLift] = useState(10);
  const [username, setUsername] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [sendingPasswordReset, setSendingPasswordReset] = useState(false);

  const fetchAutomationRuns = async () => {
    if (!currentOrg?._id) return;
    setLoadingRuns(true);
    try {
      const response = await apiResponse.get("/apps/automation/actions/runs");
      setAutomationRuns(response.data?.runs || []);
      setAutoInsights(response.data?.autonomy || null);
      setAutoCampaigns(response.data?.campaigns || []);
      setAutoMissions(response.data?.missions || []);
      setAutoDrafts(response.data?.drafts || []);
      setPublishingIntegrations(response.data?.publishingIntegrations || []);
    } catch {
      setAutomationRuns([]);
    } finally {
      setLoadingRuns(false);
    }
  };

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const resp = await apiResponse.get("/payment/billing-history");
        setBillingHistory(resp.data?.billingHistory || []);
        setCreditTransactions(resp.data?.creditTransactions || []);
      } catch (e) {
        console.warn("Could not fetch billing history", e);
      }
    };

    if (activeTab === "billing") fetchBilling();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "automation") void fetchAutomationRuns();
  }, [activeTab, currentOrg?._id]);

  useEffect(() => {
    if (activeTab !== "automation" || !currentOrg?._id) return;
    const interval = window.setInterval(
      () => void fetchAutomationRuns(),
      15000
    );
    return () => window.clearInterval(interval);
  }, [activeTab, currentOrg?._id]);

  useEffect(() => {
    const valid = [
      "account",
      "brand",
      "automation",
      "billing",
      "security",
      "preferences",
    ];
    const syncTab = () => {
      const tab = new URLSearchParams(window.location.search).get("tab");
      setActiveTab(tab && valid.includes(tab) ? tab : "account");
    };
    syncTab();
    window.addEventListener("popstate", syncTab);
    return () => window.removeEventListener("popstate", syncTab);
  }, []);

  useEffect(() => setUsername(user?.username || ""), [user?.username]);

  const selectTab = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url);
  };

  const saveProfile = async () => {
    const nextUsername = username.trim();
    if (!user?._id || nextUsername.length < 2) {
      toast({
        title: "Enter a valid username",
        description: "Use at least 2 characters.",
        variant: "destructive",
      });
      return;
    }
    setSavingProfile(true);
    try {
      const response = await apiResponse.post(`/user/profile/${user._id}`, {
        username: nextUsername,
      });
      setuser((current) =>
        current
          ? { ...current, username: response.data.user.username }
          : current
      );
      toast({ title: "Account updated" });
    } catch (error: any) {
      toast({
        title: "Could not update account",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const startPasswordReset = async () => {
    if (!user?.email) return;
    setSendingPasswordReset(true);
    try {
      await apiResponse.post("/auth/forgot-password", { email: user.email });
      router.push(`/reset-password?email=${encodeURIComponent(user.email)}`);
    } catch (error: any) {
      toast({
        title: "Could not send reset code",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setSendingPasswordReset(false);
    }
  };

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    try {
      setTheme(newTheme);
      await updateUserPreferences({ theme: newTheme });
      toast({
        title: "Theme updated",
        description: "Your theme preference has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme preference.",
        variant: "destructive",
      });
    }
  };

  const handlePreferenceChange = async (
    key: keyof NonNullable<User["preferences"]>,
    value: boolean
  ) => {
    try {
      await updateUserPreferences({ [key]: value });
      toast({
        title: "Preference updated",
        description: "Your preference has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preference.",
        variant: "destructive",
      });
    }
  };

  const openBillingPortal = async () => {
    setOpeningBillingPortal(true);
    try {
      const response = await apiResponse.get("/payment/portal");
      window.location.assign(response.data.customerPortalUrl);
    } catch {
      toast({
        title: "Could not open billing portal",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setOpeningBillingPortal(false);
    }
  };

  const saveAutoSettings = async (updates: Partial<Organization>) => {
    if (!currentOrg?._id) return false;
    setSavingAuto(true);
    try {
      await updateOrganization(currentOrg._id, updates);
      toast({
        title: "Genit Auto updated",
        description:
          updates.autoModeEnabled === false
            ? "The marketing loop has stopped."
            : "Your marketing loop schedule has been saved.",
      });
      return true;
    } catch {
      toast({
        title: "Error",
        description: "Could not update Genit Auto.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSavingAuto(false);
    }
  };

  const approveAutoMode = async () => {
    if (await saveAutoSettings({ autoModeEnabled: true })) {
      setIsAutoModeDialogOpen(false);
    }
  };

  const decideAutomationRun = async (
    runId: string,
    decision: "approve" | "reject" | "retry"
  ) => {
    try {
      await apiResponse.post(
        `/apps/automation/actions/runs/${runId}/${decision}`
      );
      await fetchAutomationRuns();
      toast({
        title:
          decision === "approve"
            ? "Action approved"
            : decision === "retry"
              ? "Action queued again"
              : "Action rejected",
        description:
          decision === "approve" || decision === "retry"
            ? "The action has returned to the execution queue."
            : "The action will not run.",
      });
    } catch {
      toast({
        title: "Could not update action",
        variant: "destructive",
      });
    }
  };

  const addAutoGoal = async () => {
    if (!goalTitle.trim() || !Number.isFinite(goalTarget) || goalTarget < 0) {
      toast({
        title: "Goal needs a title and target",
        variant: "destructive",
      });
      return;
    }
    const saved = await saveAutoSettings({
      autoModeGoals: [
        ...(currentOrg?.autoModeGoals || []),
        {
          id: crypto.randomUUID(),
          title: goalTitle.trim(),
          metric: goalMetric,
          target: goalTarget,
          status: "active",
        },
      ],
    });
    if (saved) setGoalTitle("");
  };

  const removeAutoGoal = (goalId: string) =>
    saveAutoSettings({
      autoModeGoals: (currentOrg?.autoModeGoals || []).filter(
        (goal) => goal.id !== goalId
      ),
    });

  const addAutoExperiment = async () => {
    if (
      !experimentTitle.trim() ||
      !variantA ||
      !variantB ||
      variantA === variantB ||
      !Number.isFinite(experimentLift) ||
      experimentLift < 0 ||
      experimentLift > 100
    ) {
      toast({
        title: "Choose two different campaigns",
        variant: "destructive",
      });
      return;
    }
    const saved = await saveAutoSettings({
      autoModeExperiments: [
        ...(autoInsights?.experiments || currentOrg?.autoModeExperiments || []),
        {
          id: crypto.randomUUID(),
          title: experimentTitle.trim(),
          metric: experimentMetric,
          minimumLiftPercent: experimentLift,
          samples: 0,
          status: "running",
          variantA: { campaignId: variantA },
          variantB: { campaignId: variantB },
        },
      ],
    });
    if (!saved) return;
    setExperimentTitle("");
    await fetchAutomationRuns();
  };

  const removeAutoExperiment = async (experimentId: string) => {
    const saved = await saveAutoSettings({
      autoModeExperiments: (
        autoInsights?.experiments ||
        currentOrg?.autoModeExperiments ||
        []
      ).filter((experiment: any) => experiment.id !== experimentId),
    });
    if (saved) await fetchAutomationRuns();
  };

  const applyAutoAllocation = async () => {
    try {
      await apiResponse.post("/apps/automation/auto/allocation/apply");
      await fetchAutomationRuns();
      toast({
        title: "Allocation applied",
        description: "The planned GTM campaign budgets were updated.",
      });
    } catch (error: any) {
      toast({
        title: "Could not apply allocation",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const acknowledgeAutoAlert = async (alertId: string) => {
    try {
      await apiResponse.post(
        `/apps/automation/auto/alerts/${alertId}/acknowledge`
      );
      await fetchAutomationRuns();
    } catch {
      toast({ title: "Could not acknowledge alert", variant: "destructive" });
    }
  };

  const compileAutoMissions = async () => {
    try {
      await apiResponse.post("/apps/automation/auto/missions/compile");
      await fetchAutomationRuns();
      toast({
        title: "Missions compiled",
        description: "Review and approve each mission before it runs.",
      });
    } catch (error: any) {
      toast({
        title: "Could not compile missions",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const decideAutoMission = async (
    missionId: string,
    decision: "approve" | "retry"
  ) => {
    try {
      await apiResponse.post(
        `/apps/automation/auto/missions/${missionId}/${decision}`
      );
      await fetchAutomationRuns();
      toast({
        title: decision === "approve" ? "Mission approved" : "Mission retried",
        description: "The next specialist step is queued.",
      });
    } catch (error: any) {
      toast({
        title: "Could not update mission",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const missionAction = async (
    missionId: string,
    action: "outputs/approve" | "cancel"
  ) => {
    try {
      await apiResponse.post(
        `/apps/automation/auto/missions/${missionId}/${action}`
      );
      await fetchAutomationRuns();
      toast({
        title: action === "cancel" ? "Mission cancelled" : "Outputs approved",
        description:
          action === "cancel"
            ? "Queued specialist work was stopped."
            : "Curated outputs were added to Brand Brain.",
      });
    } catch (error: any) {
      toast({
        title: "Could not update mission",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const saveMissionOutput = async (
    missionId: string,
    stepId: string,
    fallback: string
  ) => {
    try {
      await apiResponse.patch(
        `/apps/automation/auto/missions/${missionId}/steps/${stepId}`,
        { content: missionEdits[stepId] ?? fallback }
      );
      await fetchAutomationRuns();
      toast({ title: "Mission output saved" });
    } catch (error: any) {
      toast({
        title: "Could not save output",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const createMissionDraft = async (missionId: string) => {
    const integrationId = missionDraftAccounts[missionId];
    if (!integrationId) {
      toast({ title: "Choose a publishing account", variant: "destructive" });
      return;
    }
    try {
      await apiResponse.post(
        `/apps/automation/auto/missions/${missionId}/drafts`,
        { integrationId }
      );
      await fetchAutomationRuns();
      toast({ title: "Channel draft created" });
    } catch (error: any) {
      toast({
        title: "Could not create draft",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const saveMissionDraft = async (missionId: string, draft: any) => {
    try {
      await apiResponse.patch(
        `/apps/automation/auto/missions/${missionId}/drafts/${draft._id}`,
        { content: draftEdits[draft._id] ?? draft.content }
      );
      await fetchAutomationRuns();
      toast({ title: "Draft saved" });
    } catch (error: any) {
      toast({
        title: "Could not save draft",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const publishMissionDraft = async (
    missionId: string,
    draftId: string,
    scheduled: boolean
  ) => {
    try {
      await apiResponse.post(
        `/apps/automation/auto/missions/${missionId}/drafts/${draftId}/schedule`,
        { runAt: scheduled ? draftRunAt[draftId] : undefined }
      );
      await fetchAutomationRuns();
      toast({
        title: scheduled ? "Publishing scheduled" : "Publishing approved",
        description: "The external action is now in the governed run ledger.",
      });
    } catch (error: any) {
      toast({
        title: "Could not queue publishing",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const settingsTabs = [
    {
      id: "account",
      label: t("Account"),
      description: "Personal details and password",
      icon: UserIcon,
    },
    {
      id: "brand",
      label: t("Brand"),
      description: "Identity, voice, and profiles",
      icon: Palette,
    },
    {
      id: "automation",
      label: t("Marketing Loop"),
      description: "Goals, experiments, and runs",
      icon: ArrowDownUp,
    },
    {
      id: "billing",
      label: t("Billing"),
      description: "Credits, invoices, and plans",
      icon: CreditCard,
    },
    {
      id: "security",
      label: t("Security"),
      description: "Sessions and account access",
      icon: Shield,
    },
    {
      id: "preferences",
      label: t("Preferences"),
      description: "Appearance and notifications",
      icon: SlidersHorizontal,
    },
  ];
  const activeTabDetails =
    settingsTabs.find((tab) => tab.id === activeTab) || settingsTabs[0];
  const ActiveTabIcon = activeTabDetails.icon;

  return (
    <div className='mx-auto min-h-screen w-full max-w-[100rem] px-2 pb-16 sm:px-6'>
      <div className='pt-5 sm:pt-8'>
        <div className='mb-7'>
          <p className='text-xs font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400'>
            {t("Workspace")}
          </p>
          <h1 className='mt-1 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-white'>
            {t("Settings")}
          </h1>
          <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
            {t("Manage your account, brand, and billing.")}
          </p>
        </div>

        <div className='flex flex-col gap-8 md:flex-row md:items-start'>
          <aside className='top-14 z-10 min-w-0 md:sticky md:w-64 md:shrink-0'>
            <div className='rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-xs font-medium text-zinc-500 dark:text-zinc-400'>
                    {t("Available credits")}
                  </p>
                  <p className='mt-0.5 text-xl font-semibold text-zinc-950 tabular-nums dark:text-white'>
                    {(user?.creditsRemaining ?? 0).toLocaleString()}
                  </p>
                </div>
                <Button
                  size='sm'
                  onClick={() => setIsTopUpOpen(true)}
                  className='rounded-xl active:scale-[0.97]'
                >
                  {t("Top up")}
                </Button>
              </div>
            </div>
            <nav
              aria-label='Settings'
              className='scrollbar-hide mt-3 flex gap-1 overflow-x-auto border-b border-zinc-200 pb-2 md:flex-col md:overflow-visible md:border-0 md:pb-0 dark:border-white/10'
            >
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type='button'
                    aria-current={selected ? "page" : undefined}
                    onClick={() => selectTab(tab.id)}
                    className={`group flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-[background-color,color,box-shadow,transform] active:scale-[0.98] md:w-full ${
                      selected
                        ? "bg-white text-zinc-950 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:text-white dark:ring-white/10"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`size-4 ${
                        selected
                          ? "text-sky-600 dark:text-sky-400"
                          : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                      }`}
                    />
                    <span className='whitespace-nowrap'>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className='min-w-0 flex-1 [&_input]:rounded-xl [&_textarea]:rounded-xl'>
            {/* <div className='mb-5 flex items-start gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-400/15'>
                <ActiveTabIcon className='size-5' />
              </div>
              <div>
                <h2 className='text-xl font-semibold tracking-tight text-zinc-950 dark:text-white'>
                  {activeTabDetails.label}
                </h2>
                <p className='mt-0.5 text-sm text-zinc-500 dark:text-zinc-400'>
                  {activeTabDetails.description}
                </p>
              </div>
            </div> */}

            {activeTab === "account" && (
              <div className='space-y-5'>
                <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardHeader className='border-b border-zinc-200 p-5 dark:border-white/10'>
                    <CardTitle className='text-base'>
                      {t("Account details")}
                    </CardTitle>
                    <CardDescription>
                      {t("The identity used across your Genit workspace.")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-5 p-5'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='username'>{t("Username")}</Label>
                        <Input
                          id='username'
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                          className='h-10 rounded-xl border-zinc-200 bg-white hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.04]'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='email'>{t("Email address")}</Label>
                        <Input
                          id='email'
                          value={user?.email || ""}
                          readOnly
                          aria-describedby='email-help'
                          className='h-10 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.025] dark:hover:bg-white/[0.025]'
                        />
                        <p
                          id='email-help'
                          className='text-xs text-zinc-500 dark:text-zinc-400'
                        >
                          {t("Contact support to change your sign-in email.")}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10'>
                      <div className='flex items-center gap-2 text-sm'>
                        <span className='flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'>
                          <Check className='size-4' />
                        </span>
                        <span className='font-medium text-zinc-900 dark:text-zinc-100'>
                          {user?.emailVerified
                            ? "Email verified"
                            : "Email verification pending"}
                        </span>
                      </div>
                      <Button
                        onClick={saveProfile}
                        disabled={
                          savingProfile ||
                          username.trim() === (user?.username || "")
                        }
                        className='rounded-xl active:scale-[0.97]'
                      >
                        {savingProfile && (
                          <Loader2 className='mr-2 size-4 animate-spin' />
                        )}
                        <LocalizedText text={"Save account"} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardHeader className='border-b border-zinc-200 p-5 dark:border-white/10'>
                    <CardTitle className='text-base'>
                      <LocalizedText text={"Password"} />
                    </CardTitle>
                    <CardDescription>
                      <LocalizedText
                        text={
                          "Reset your password through your verified email."
                        }
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-start gap-3'>
                      <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300'>
                        <KeyRound className='size-4' />
                      </span>
                      <div>
                        <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                          <LocalizedText text={"Secure reset"} />
                        </p>
                        <p className='mt-0.5 text-sm text-zinc-500 dark:text-zinc-400'>
                          <LocalizedText
                            text={"We’ll send a six-digit code to "}
                          />
                          {user?.email}.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      onClick={startPasswordReset}
                      disabled={sendingPasswordReset}
                      className='shrink-0 rounded-xl active:scale-[0.97]'
                    >
                      {sendingPasswordReset && (
                        <Loader2 className='mr-2 size-4 animate-spin' />
                      )}
                      <LocalizedText text={"Reset password"} />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Brand Settings */}
            {activeTab === "brand" && <BrandSettings />}

            {activeTab === "automation" && (
              <Card className='relative overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                <CardHeader className='sm-py-2 border-b border-zinc-200 bg-zinc-50/60 p-5 py-2 sm:p-6 dark:border-white/10 dark:bg-white/[0.02]'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex min-w-0 items-start gap-3'>
                      <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl'>
                        <ArrowDownUp className='h-5 w-5' />
                      </div>
                      <div>
                        <CardTitle className='text-xl'>
                          <LocalizedText text={"Genit Auto marketing loop"} />
                        </CardTitle>
                        <CardDescription className='mt-1 max-w-2xl text-sm leading-6'>
                          <LocalizedText
                            text={"Reviews active campaigns and performance"}
                          />
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        currentOrg?.autoModeEnabled ? "secondary" : "outline"
                      }
                      className='shrink-0'
                    >
                      {currentOrg?.autoModeEnabled ? "Running" : "Paused"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4 p-4 sm:p-6'>
                  <div className='bg-background/60 flex items-center justify-between gap-5 rounded-xl border p-4'>
                    <div className='min-w-0'>
                      <h4 className='text-sm font-semibold'>
                        <LocalizedText text={"Run autonomously"} />
                      </h4>
                      <p className='text-muted-foreground mt-0.5 max-w-2xl text-sm leading-5'>
                        <LocalizedText
                          text={
                            "Uses your brand, campaigns, posts, email activity, attribution, and connected marketing data."
                          }
                        />
                      </p>
                    </div>
                    <Switch
                      aria-label='Run Genit Auto autonomously'
                      className='active:scale-[0.97]'
                      checked={currentOrg?.autoModeEnabled ?? false}
                      disabled={savingAuto}
                      onCheckedChange={(checked) => {
                        if (checked) setIsAutoModeDialogOpen(true);
                        else void saveAutoSettings({ autoModeEnabled: false });
                      }}
                    />
                  </div>

                  <section className='bg-background/60 space-y-5 rounded-xl border p-4 sm:p-5'>
                    <div className='flex items-start gap-3'>
                      <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg'>
                        <Target className='h-4 w-4' />
                      </div>
                      <div>
                        <h4 className='font-semibold'>
                          <LocalizedText text={"Goals & learning"} />
                        </h4>
                        <p className='text-muted-foreground mt-0.5 text-sm leading-5'>
                          <LocalizedText
                            text={
                              "Set a measurable target. Each loop evaluates progress, adjusts the plan, and remembers the result."
                            }
                          />
                        </p>
                      </div>
                    </div>

                    <div className='bg-muted/30 grid gap-3 rounded-xl border p-3 md:grid-cols-2'>
                      <div className='space-y-1.5 md:col-span-2'>
                        <Label htmlFor='auto-goal-title' className='text-xs'>
                          <LocalizedText text={"Goal"} />
                        </Label>
                        <Input
                          id='auto-goal-title'
                          placeholder='e.g. Reach 500 campaign clicks'
                          value={goalTitle}
                          onChange={(event) => setGoalTitle(event.target.value)}
                          className='bg-background hover:bg-background h-10'
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <Label htmlFor='auto-goal-metric' className='text-xs'>
                          <LocalizedText text={"Metric"} />
                        </Label>
                        <Select
                          value={goalMetric}
                          onValueChange={(value) =>
                            setGoalMetric(value as typeof goalMetric)
                          }
                        >
                          <SelectTrigger
                            id='auto-goal-metric'
                            className='bg-background h-10 w-full'
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='impressions'>
                              <LocalizedText text={"Impressions"} />
                            </SelectItem>
                            <SelectItem value='clicks'>
                              <LocalizedText text={"Clicks"} />
                            </SelectItem>
                            <SelectItem value='conversions'>
                              <LocalizedText text={"Conversions"} />
                            </SelectItem>
                            <SelectItem value='conversionValue'>
                              <LocalizedText text={"Conversion value"} />
                            </SelectItem>
                            <SelectItem value='roi'>
                              <LocalizedText text={"ROI"} />
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-1.5'>
                        <Label htmlFor='auto-goal-target' className='text-xs'>
                          <LocalizedText text={"Target"} />
                        </Label>
                        <Input
                          id='auto-goal-target'
                          type='number'
                          min={0}
                          value={goalTarget}
                          onChange={(event) =>
                            setGoalTarget(Number(event.target.value))
                          }
                          className='bg-background hover:bg-background h-10'
                        />
                      </div>
                      <Button
                        className='active:scale-[0.97] md:col-span-2 md:justify-self-end'
                        onClick={addAutoGoal}
                        disabled={
                          savingAuto ||
                          (currentOrg?.autoModeGoals?.length || 0) >= 10
                        }
                      >
                        <Plus className='h-4 w-4' />{" "}
                        <LocalizedText text={"Add goal"} />
                      </Button>
                    </div>

                    {(currentOrg?.autoModeGoals || []).length > 0 && (
                      <div className='divide-y overflow-hidden rounded-xl border'>
                        {currentOrg?.autoModeGoals?.map((goal) => {
                          const latest = (
                            autoInsights?.latestEvaluation ||
                            currentOrg.autoModeEvaluations?.[
                              (currentOrg.autoModeEvaluations?.length || 1) - 1
                            ]
                          )?.goals.find((item: any) => item.id === goal.id);
                          return (
                            <div
                              key={goal.id}
                              className='hover:bg-muted/30 flex items-center justify-between gap-3 p-3 transition-colors'
                            >
                              <div>
                                <div className='flex flex-wrap items-center gap-2'>
                                  <p className='text-sm font-medium'>
                                    {goal.title}
                                  </p>
                                  <Badge variant='secondary'>
                                    {goal.status}
                                  </Badge>
                                </div>
                                <p className='text-muted-foreground text-xs'>
                                  {latest
                                    ? `${latest.current.toLocaleString()} / ${goal.target.toLocaleString()} ${goal.metric} · ${latest.progress}% · ${latest.trend}`
                                    : `Target: ${goal.target.toLocaleString()} ${goal.metric}`}
                                </p>
                              </div>
                              <Button
                                size='icon'
                                variant='ghost'
                                aria-label={`Remove ${goal.title}`}
                                onClick={() => removeAutoGoal(goal.id)}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(autoInsights?.currentPlan ||
                      currentOrg?.autoModeCurrentPlan) && (
                      <div className='bg-muted/20 rounded-xl border p-4'>
                        <p className='text-sm font-medium'>
                          <LocalizedText text={"Current plan"} />
                        </p>
                        <p className='text-muted-foreground mt-1 text-xs'>
                          {
                            (
                              autoInsights?.currentPlan ||
                              currentOrg?.autoModeCurrentPlan
                            )?.objective
                          }
                        </p>
                        {(
                          autoInsights?.currentPlan ||
                          currentOrg?.autoModeCurrentPlan
                        )?.correction && (
                          <p className='mt-2 text-xs text-amber-600'>
                            {
                              (
                                autoInsights?.currentPlan ||
                                currentOrg?.autoModeCurrentPlan
                              )?.correction
                            }
                          </p>
                        )}
                        <ol className='mt-3 space-y-2'>
                          {(
                            autoInsights?.currentPlan ||
                            currentOrg?.autoModeCurrentPlan
                          )?.steps
                            .slice(0, 5)
                            .map((step: any, index: number) => (
                              <li
                                key={`${step.title}-${index}`}
                                className='text-sm'
                              >
                                <span className='font-medium'>
                                  {index + 1}. {step.title}
                                </span>
                                <span className='text-muted-foreground'>
                                  {` — ${step.action}`}
                                </span>
                              </li>
                            ))}
                        </ol>
                      </div>
                    )}
                  </section>

                  <section className='bg-background/60 space-y-5 rounded-xl border p-4 sm:p-5'>
                    <div className='flex items-start gap-3'>
                      <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg'>
                        <RefreshCw className='h-4 w-4' />
                      </div>
                      <div>
                        <h4 className='font-semibold'>
                          <LocalizedText text={"Controlled experiments"} />
                        </h4>
                        <p className='text-muted-foreground mt-0.5 text-sm leading-5'>
                          <LocalizedText
                            text={
                              "Compare two active campaigns for at least three cycles. A winner needs at least 10% measured lift."
                            }
                          />
                        </p>
                      </div>
                    </div>

                    <div className='bg-muted/30 grid gap-3 rounded-xl border p-3 md:grid-cols-2'>
                      <div className='space-y-1.5 md:col-span-2'>
                        <Label
                          htmlFor='auto-experiment-title'
                          className='text-xs'
                        >
                          <LocalizedText text={"Experiment name"} />
                        </Label>
                        <Input
                          id='auto-experiment-title'
                          placeholder='e.g. Homepage CTA test'
                          value={experimentTitle}
                          onChange={(event) =>
                            setExperimentTitle(event.target.value)
                          }
                          className='bg-background hover:bg-background h-10'
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <Label
                          htmlFor='auto-experiment-metric'
                          className='text-xs'
                        >
                          <LocalizedText text={"Success metric"} />
                        </Label>
                        <Select
                          value={experimentMetric}
                          onValueChange={(value) =>
                            setExperimentMetric(
                              value as typeof experimentMetric
                            )
                          }
                        >
                          <SelectTrigger
                            id='auto-experiment-metric'
                            className='bg-background h-10 w-full'
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='impressions'>
                              <LocalizedText text={"Impressions"} />
                            </SelectItem>
                            <SelectItem value='clicks'>
                              <LocalizedText text={"Clicks"} />
                            </SelectItem>
                            <SelectItem value='conversions'>
                              <LocalizedText text={"Conversions"} />
                            </SelectItem>
                            <SelectItem value='conversionValue'>
                              <LocalizedText text={"Conversion value"} />
                            </SelectItem>
                            <SelectItem value='roi'>
                              <LocalizedText text={"ROI"} />
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-1.5'>
                        <Label
                          htmlFor='auto-experiment-lift'
                          className='text-xs'
                        >
                          <LocalizedText text={"Minimum lift (%)"} />
                        </Label>
                        <Input
                          id='auto-experiment-lift'
                          type='number'
                          min={0}
                          max={100}
                          value={experimentLift}
                          onChange={(event) =>
                            setExperimentLift(Number(event.target.value))
                          }
                          className='bg-background hover:bg-background h-10'
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <Label htmlFor='auto-variant-a' className='text-xs'>
                          <LocalizedText text={"Variant A"} />
                        </Label>
                        <Select value={variantA} onValueChange={setVariantA}>
                          <SelectTrigger
                            id='auto-variant-a'
                            className='bg-background h-10 w-full'
                          >
                            <SelectValue placeholder='Choose campaign' />
                          </SelectTrigger>
                          <SelectContent>
                            {autoCampaigns.map((campaign) => (
                              <SelectItem
                                key={campaign._id}
                                value={campaign._id}
                              >
                                {campaign.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-1.5'>
                        <Label htmlFor='auto-variant-b' className='text-xs'>
                          <LocalizedText text={"Variant B"} />
                        </Label>
                        <Select value={variantB} onValueChange={setVariantB}>
                          <SelectTrigger
                            id='auto-variant-b'
                            className='bg-background h-10 w-full'
                          >
                            <SelectValue placeholder='Choose campaign' />
                          </SelectTrigger>
                          <SelectContent>
                            {autoCampaigns.map((campaign) => (
                              <SelectItem
                                key={campaign._id}
                                value={campaign._id}
                              >
                                {campaign.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className='active:scale-[0.97] md:col-span-2 md:justify-self-end'
                        onClick={addAutoExperiment}
                        disabled={savingAuto || autoCampaigns.length < 2}
                      >
                        <Plus className='h-4 w-4' />{" "}
                        <LocalizedText text={"Create experiment"} />
                      </Button>
                    </div>
                    {autoCampaigns.length < 2 && (
                      <p className='text-muted-foreground flex items-center gap-2 text-xs'>
                        <span className='bg-muted-foreground/60 size-1.5 rounded-full' />
                        <LocalizedText
                          text={
                            "Activate at least two GTM campaigns to run an experiment."
                          }
                        />
                      </p>
                    )}
                    {(
                      autoInsights?.experiments ||
                      currentOrg?.autoModeExperiments ||
                      []
                    ).length > 0 && (
                      <div className='divide-y overflow-hidden rounded-xl border'>
                        {(
                          autoInsights?.experiments ||
                          currentOrg?.autoModeExperiments ||
                          []
                        ).map((experiment: any) => (
                          <div
                            key={experiment.id}
                            className='hover:bg-muted/30 flex items-center justify-between gap-3 p-3 transition-colors'
                          >
                            <div>
                              <div className='flex flex-wrap items-center gap-2'>
                                <p className='text-sm font-medium'>
                                  {experiment.title}
                                </p>
                                <Badge variant='secondary'>
                                  {experiment.status}
                                </Badge>
                              </div>
                              <p className='text-muted-foreground text-xs'>
                                {experiment.variantA?.campaignName || "A"}:{" "}
                                {experiment.variantA?.value ?? "—"}{" "}
                                <LocalizedText text={"vs"} />{" "}
                                {experiment.variantB?.campaignName || "B"}:{" "}
                                {experiment.variantB?.value ?? "—"} ·{" "}
                                {experiment.samples || 0}
                                <LocalizedText text={"/3 cycles"} />
                                {experiment.winner
                                  ? ` · Winner ${experiment.winner} (${experiment.liftPercent}% lift)`
                                  : ""}
                              </p>
                            </div>
                            <Button
                              size='icon'
                              variant='ghost'
                              aria-label={`Remove ${experiment.title}`}
                              onClick={() =>
                                removeAutoExperiment(experiment.id)
                              }
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {(autoInsights?.allocation || currentOrg?.autoModeAllocation)
                    ?.campaigns?.length > 0 && (
                    <section className='bg-background/60 space-y-3 rounded-xl border p-4 sm:p-5'>
                      <div className='flex items-center justify-between gap-4'>
                        <div>
                          <h4 className='font-medium'>
                            <LocalizedText text={"Adaptive allocation"} />
                          </h4>
                          <p className='text-muted-foreground text-sm'>
                            <LocalizedText
                              text={
                                "Proposed GTM budget split from performance and experiment winners. Applying updates campaign plans, not provider ad spend."
                              }
                            />
                          </p>
                        </div>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={applyAutoAllocation}
                          disabled={
                            !(
                              autoInsights?.allocation ||
                              currentOrg?.autoModeAllocation
                            )?.totalBudget
                          }
                        >
                          <LocalizedText text={"Apply allocation"} />
                        </Button>
                      </div>
                      <div className='grid gap-2 sm:grid-cols-2'>
                        {(
                          autoInsights?.allocation ||
                          currentOrg?.autoModeAllocation
                        )?.campaigns.map((campaign: any) => (
                          <div
                            key={campaign.campaignId}
                            className='rounded-lg border p-3'
                          >
                            <div className='flex items-center justify-between'>
                              <p className='text-sm font-medium'>
                                {campaign.campaignName}
                              </p>
                              <Badge variant='secondary'>
                                {campaign.share}%
                              </Badge>
                            </div>
                            <p className='text-muted-foreground mt-1 text-xs'>
                              <LocalizedText text={"Planned budget"} />{" "}
                              {campaign.suggestedBudget.toLocaleString()} ·{" "}
                              {campaign.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {(autoInsights?.simulation ||
                    currentOrg?.autoModeSimulation) && (
                    <section className='bg-background/60 space-y-3 rounded-xl border p-4 sm:p-5'>
                      <div className='flex items-center justify-between gap-3'>
                        <div>
                          <h4 className='font-medium'>
                            <LocalizedText text={"Scenario simulation"} />
                          </h4>
                          <p className='text-muted-foreground text-sm'>
                            <LocalizedText
                              text={
                                "Linear forecast if the proposed allocation is applied."
                              }
                            />
                          </p>
                        </div>
                        <Badge variant='secondary'>
                          {
                            (
                              autoInsights?.simulation ||
                              currentOrg?.autoModeSimulation
                            )?.confidence
                          }{" "}
                          <LocalizedText text={"confidence"} />
                        </Badge>
                      </div>
                      <div className='grid gap-2 sm:grid-cols-3'>
                        {(
                          ["clicks", "conversions", "conversionValue"] as const
                        ).map((metric) => {
                          const simulation =
                            autoInsights?.simulation ||
                            currentOrg?.autoModeSimulation;
                          return (
                            <div key={metric} className='rounded-lg border p-3'>
                              <p className='text-muted-foreground text-xs capitalize'>
                                {metric === "conversionValue"
                                  ? "Conversion value"
                                  : metric}
                              </p>
                              <p className='text-lg font-semibold'>
                                {simulation.projected[metric].toLocaleString()}
                              </p>
                              <p className='text-muted-foreground text-xs'>
                                {simulation.baseline[metric].toLocaleString()}{" "}
                                <LocalizedText text={"baseline ·"} />{" "}
                                {simulation.uplift[metric] >= 0 ? "+" : ""}
                                {simulation.uplift[metric]}%
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  <section className='bg-background/60 space-y-4 rounded-xl border p-4 sm:p-5'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                      <div className='flex items-start gap-3'>
                        <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg'>
                          <Bot className='h-4 w-4' />
                        </div>
                        <div>
                          <h4 className='font-semibold'>
                            <LocalizedText text={"Specialist missions"} />
                          </h4>
                          <p className='text-muted-foreground mt-0.5 max-w-xl text-sm leading-5'>
                            <LocalizedText
                              text={
                                "Turn the current plan into strategist, creator, and analyst work. Approval never includes publishing."
                              }
                            />
                          </p>
                        </div>
                      </div>
                      <Button
                        size='sm'
                        variant='outline'
                        className='shrink-0 active:scale-[0.97]'
                        onClick={compileAutoMissions}
                        disabled={
                          !(
                            autoInsights?.currentPlan ||
                            currentOrg?.autoModeCurrentPlan
                          )
                        }
                      >
                        <LocalizedText text={"Compile plan"} />
                      </Button>
                    </div>
                    {autoMissions.length === 0 ? (
                      <div className='bg-muted/20 flex flex-col items-center rounded-xl border border-dashed px-4 py-7 text-center'>
                        <div className='bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full'>
                          <Bot className='h-4 w-4' />
                        </div>
                        <p className='mt-3 text-sm font-medium'>
                          <LocalizedText text={"No missions yet"} />
                        </p>
                        <p className='text-muted-foreground mt-1 max-w-sm text-xs leading-5'>
                          <LocalizedText
                            text={
                              "Complete an Auto plan, then compile it into specialist work."
                            }
                          />
                        </p>
                      </div>
                    ) : (
                      <div className='space-y-2'>
                        {autoMissions.map((mission) => {
                          const drafts = autoDrafts.filter(
                            (draft) => draft.metadata?.missionId === mission._id
                          );
                          return (
                            <div
                              key={mission._id}
                              className='space-y-3 rounded-lg border p-3'
                            >
                              <div className='flex items-start justify-between gap-3'>
                                <div>
                                  <div className='flex flex-wrap items-center gap-2'>
                                    <p className='text-sm font-medium'>
                                      {mission.title}
                                    </p>
                                    <Badge variant='secondary'>
                                      {mission.status}
                                    </Badge>
                                    {mission.memoryWrittenAt && (
                                      <Badge variant='outline'>
                                        <LocalizedText
                                          text={"In Brand Brain"}
                                        />
                                      </Badge>
                                    )}
                                  </div>
                                  <p className='text-muted-foreground mt-1 text-xs'>
                                    {mission.steps
                                      .map(
                                        (step: any) =>
                                          `${step.role}: ${step.status}`
                                      )
                                      .join(" · ")}
                                  </p>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                  {mission.status === "proposed" && (
                                    <Button
                                      size='sm'
                                      onClick={() =>
                                        decideAutoMission(
                                          mission._id,
                                          "approve"
                                        )
                                      }
                                    >
                                      <LocalizedText text={"Approve mission"} />
                                    </Button>
                                  )}
                                  {mission.status === "failed" && (
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() =>
                                        decideAutoMission(mission._id, "retry")
                                      }
                                    >
                                      <LocalizedText text={"Retry"} />
                                    </Button>
                                  )}
                                  {[
                                    "proposed",
                                    "running",
                                    "review",
                                    "failed",
                                  ].includes(mission.status) && (
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      onClick={() =>
                                        missionAction(mission._id, "cancel")
                                      }
                                    >
                                      <LocalizedText text={"Cancel"} />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {mission.steps.some(
                                (step: any) => step.result?.content
                              ) && (
                                <div className='space-y-2'>
                                  {mission.steps
                                    .filter((step: any) => step.result?.content)
                                    .map((step: any) => {
                                      const content = step.result.content;
                                      return (
                                        <div
                                          key={step.id}
                                          className='space-y-2'
                                        >
                                          <Label htmlFor={`mission-${step.id}`}>
                                            {step.title}
                                          </Label>
                                          <textarea
                                            id={`mission-${step.id}`}
                                            className='border-input bg-background min-h-28 w-full rounded-md border px-3 py-2 text-sm'
                                            value={
                                              missionEdits[step.id] ?? content
                                            }
                                            readOnly={
                                              mission.status !== "review"
                                            }
                                            onChange={(event) =>
                                              setMissionEdits((current) => ({
                                                ...current,
                                                [step.id]: event.target.value,
                                              }))
                                            }
                                          />
                                          {mission.status === "review" && (
                                            <Button
                                              size='sm'
                                              variant='outline'
                                              onClick={() =>
                                                saveMissionOutput(
                                                  mission._id,
                                                  step.id,
                                                  content
                                                )
                                              }
                                            >
                                              <LocalizedText
                                                text={"Save output"}
                                              />
                                            </Button>
                                          )}
                                        </div>
                                      );
                                    })}
                                </div>
                              )}

                              {mission.status === "review" && (
                                <Button
                                  size='sm'
                                  onClick={() =>
                                    missionAction(
                                      mission._id,
                                      "outputs/approve"
                                    )
                                  }
                                >
                                  <LocalizedText
                                    text={"Approve outputs and remember"}
                                  />
                                </Button>
                              )}

                              {mission.status === "completed" && (
                                <div className='space-y-3 border-t pt-3'>
                                  <div className='flex flex-wrap gap-2'>
                                    <Select
                                      value={
                                        missionDraftAccounts[mission._id] || ""
                                      }
                                      onValueChange={(value) =>
                                        setMissionDraftAccounts((current) => ({
                                          ...current,
                                          [mission._id]: value,
                                        }))
                                      }
                                    >
                                      <SelectTrigger
                                        aria-label='Publishing account'
                                        className='h-9 min-w-52 rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04]'
                                      >
                                        <SelectValue placeholder='Choose account' />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {publishingIntegrations.map(
                                          (integration) => (
                                            <SelectItem
                                              key={integration._id}
                                              value={integration._id}
                                            >
                                              {integration.platform} ·{" "}
                                              {integration.accountName}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() =>
                                        createMissionDraft(mission._id)
                                      }
                                    >
                                      <LocalizedText
                                        text={"Create channel draft"}
                                      />
                                    </Button>
                                  </div>

                                  {drafts.map((draft) => (
                                    <div
                                      key={draft._id}
                                      className='bg-muted/40 space-y-2 rounded-md p-3'
                                    >
                                      <div className='flex items-center gap-2'>
                                        <Badge variant='outline'>
                                          {draft.platform}
                                        </Badge>
                                        <Badge variant='secondary'>
                                          {draft.status}
                                        </Badge>
                                        <span className='text-muted-foreground text-xs'>
                                          {draft.accountName}
                                        </span>
                                      </div>
                                      <textarea
                                        aria-label={`${draft.platform} draft`}
                                        className='border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm'
                                        value={
                                          draftEdits[draft._id] ?? draft.content
                                        }
                                        readOnly={
                                          !["draft", "failed"].includes(
                                            draft.status
                                          )
                                        }
                                        onChange={(event) =>
                                          setDraftEdits((current) => ({
                                            ...current,
                                            [draft._id]: event.target.value,
                                          }))
                                        }
                                      />
                                      {["draft", "failed"].includes(
                                        draft.status
                                      ) && (
                                        <div className='flex flex-wrap gap-2'>
                                          <Button
                                            size='sm'
                                            variant='outline'
                                            onClick={() =>
                                              saveMissionDraft(
                                                mission._id,
                                                draft
                                              )
                                            }
                                          >
                                            <LocalizedText
                                              text={"Save draft"}
                                            />
                                          </Button>
                                          <Button
                                            size='sm'
                                            onClick={() =>
                                              publishMissionDraft(
                                                mission._id,
                                                draft._id,
                                                false
                                              )
                                            }
                                          >
                                            <LocalizedText
                                              text={"Approve and publish"}
                                            />
                                          </Button>
                                          <Input
                                            aria-label='Schedule publishing time'
                                            type='datetime-local'
                                            className='w-auto'
                                            value={draftRunAt[draft._id] || ""}
                                            onChange={(event) =>
                                              setDraftRunAt((current) => ({
                                                ...current,
                                                [draft._id]: event.target.value,
                                              }))
                                            }
                                          />
                                          <Button
                                            size='sm'
                                            variant='outline'
                                            disabled={!draftRunAt[draft._id]}
                                            onClick={() =>
                                              publishMissionDraft(
                                                mission._id,
                                                draft._id,
                                                true
                                              )
                                            }
                                          >
                                            <LocalizedText text={"Schedule"} />
                                          </Button>
                                        </div>
                                      )}
                                      {draft.metadata?.publishError && (
                                        <p className='text-destructive text-xs'>
                                          {draft.metadata.publishError}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {mission.outcome && (
                                <p className='text-muted-foreground border-t pt-2 text-xs'>
                                  <LocalizedText text={"Learned outcome:"} />{" "}
                                  {mission.outcome.publishedAssets}{" "}
                                  <LocalizedText text={"assets ·"} />{" "}
                                  {mission.outcome.metrics?.clicks || 0}{" "}
                                  <LocalizedText text={"clicks ·"} />
                                  {mission.outcome.conversions || 0}{" "}
                                  <LocalizedText text={"conversions"} />
                                </p>
                              )}
                              {mission.steps.some(
                                (step: any) => step.error
                              ) && (
                                <p className='text-destructive text-xs'>
                                  {
                                    mission.steps.find(
                                      (step: any) => step.error
                                    )?.error
                                  }
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {(
                    autoInsights?.alerts ||
                    currentOrg?.autoModeAlerts?.filter(
                      (alert) => alert.status === "open"
                    ) ||
                    []
                  ).length > 0 && (
                    <>
                      <Separator />
                      <div className='space-y-3'>
                        <h4 className='font-medium'>
                          <LocalizedText text={"Auto alerts"} />
                        </h4>
                        {(
                          autoInsights?.alerts ||
                          currentOrg?.autoModeAlerts?.filter(
                            (alert) => alert.status === "open"
                          ) ||
                          []
                        ).map((alert: any) => (
                          <div
                            key={alert.id}
                            className='flex items-center justify-between gap-3 rounded-lg border p-3'
                          >
                            <div>
                              <div className='flex items-center gap-2'>
                                <Badge variant='secondary'>
                                  {alert.severity}
                                </Badge>
                                <p className='text-sm font-medium'>
                                  {alert.title}
                                </p>
                              </div>
                              <p className='text-muted-foreground mt-1 text-xs'>
                                {alert.message}
                              </p>
                            </div>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() => acknowledgeAutoAlert(alert.id)}
                            >
                              <LocalizedText text={"Acknowledge"} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className='space-y-4'>
                    <div>
                      <h4 className='flex items-center gap-2 font-medium'>
                        <Shield className='h-4 w-4' />{" "}
                        <LocalizedText text={"Action guardrails"} />
                      </h4>
                      <p className='text-muted-foreground text-sm'>
                        <LocalizedText
                          text={
                            "Control which autonomous actions need a person and how much one cycle may use."
                          }
                        />
                      </p>
                    </div>
                    <div className='grid gap-4 sm:grid-cols-3'>
                      <div className='space-y-2'>
                        <Label htmlFor='approval-policy'>
                          <LocalizedText text={"Require approval"} />
                        </Label>
                        <Select
                          value={
                            currentOrg?.automationApprovalPolicy ??
                            "destructive"
                          }
                          disabled={savingAuto}
                          onValueChange={(value) =>
                            saveAutoSettings({
                              automationApprovalPolicy: value as
                                "destructive" | "external" | "all",
                            })
                          }
                        >
                          <SelectTrigger
                            id='approval-policy'
                            className='h-10 w-full rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04]'
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='destructive'>
                              <LocalizedText text={"Destructive actions"} />
                            </SelectItem>
                            <SelectItem value='external'>
                              <LocalizedText text={"All external actions"} />
                            </SelectItem>
                            <SelectItem value='all'>
                              <LocalizedText text={"Every action"} />
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='daily-action-limit'>
                          <LocalizedText text={"Daily actions"} />
                        </Label>
                        <Input
                          id='daily-action-limit'
                          type='number'
                          min={1}
                          max={1000}
                          defaultValue={
                            currentOrg?.automationDailyActionLimit ?? 100
                          }
                          disabled={savingAuto}
                          onBlur={(event) =>
                            saveAutoSettings({
                              automationDailyActionLimit: Number(
                                event.target.value
                              ),
                            })
                          }
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='run-credit-limit'>
                          <LocalizedText text={"Credits per run"} />
                        </Label>
                        <Input
                          id='run-credit-limit'
                          type='number'
                          min={0}
                          max={10000}
                          defaultValue={
                            currentOrg?.automationMaxCreditsPerRun ?? 50
                          }
                          disabled={savingAuto}
                          onBlur={(event) =>
                            saveAutoSettings({
                              automationMaxCreditsPerRun: Number(
                                event.target.value
                              ),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium'>
                          <LocalizedText text={"Approvals & run history"} />
                        </h4>
                        <p className='text-muted-foreground text-sm'>
                          <LocalizedText
                            text={
                              "The latest governed actions for this organization."
                            }
                          />
                        </p>
                      </div>
                      <Button
                        size='sm'
                        variant='outline'
                        disabled={loadingRuns}
                        onClick={fetchAutomationRuns}
                      >
                        <RefreshCw
                          className={`mr-2 h-4 w-4 ${loadingRuns ? "animate-spin" : ""}`}
                        />
                        <LocalizedText text={"Refresh"} />
                      </Button>
                    </div>
                    {automationRuns.length === 0 ? (
                      <p className='text-muted-foreground rounded-lg border p-4 text-sm'>
                        {loadingRuns
                          ? "Loading runs…"
                          : "No automation runs yet."}
                      </p>
                    ) : (
                      <div className='divide-y rounded-lg border'>
                        {automationRuns.slice(0, 10).map((run) => (
                          <div
                            key={run._id}
                            className='flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center'
                          >
                            <div className='min-w-0'>
                              <div className='flex flex-wrap items-center gap-2'>
                                <p className='truncate text-sm font-medium'>
                                  {run.action?.label || run.taskType}
                                </p>
                                <Badge variant='secondary'>
                                  {String(run.status).replaceAll("_", " ")}
                                </Badge>
                              </div>
                              <p className='text-muted-foreground mt-1 text-xs'>
                                {run.error ||
                                  run.approvalReason ||
                                  `${run.attempts || 0} execution attempt${run.attempts === 1 ? "" : "s"}`}
                                {run.createdAt
                                  ? ` · ${new Date(run.createdAt).toLocaleString()}`
                                  : ""}
                              </p>
                            </div>
                            {run.status === "awaiting_approval" && (
                              <div className='flex gap-2'>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() =>
                                    decideAutomationRun(run._id, "reject")
                                  }
                                >
                                  <LocalizedText text={"Reject"} />
                                </Button>
                                <Button
                                  size='sm'
                                  onClick={() =>
                                    decideAutomationRun(run._id, "approve")
                                  }
                                >
                                  <LocalizedText text={"Approve"} />
                                </Button>
                              </div>
                            )}
                            {run.status === "failed" && (
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() =>
                                  decideAutomationRun(run._id, "retry")
                                }
                              >
                                <LocalizedText text={"Retry"} />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
                    <div>
                      <h4 className='flex items-center gap-2 font-medium'>
                        <RefreshCw className='h-4 w-4' />{" "}
                        <LocalizedText text={"Loop timer"} />
                      </h4>
                      <p className='text-muted-foreground text-sm'>
                        <LocalizedText
                          text={
                            "Choose how often Genit starts a new marketing cycle."
                          }
                        />
                      </p>
                    </div>
                    <Select
                      value={String(
                        currentOrg?.autoModeIntervalMinutes ?? 1440
                      )}
                      disabled={savingAuto || !currentOrg?.autoModeEnabled}
                      onValueChange={(value) =>
                        saveAutoSettings({
                          autoModeIntervalMinutes: Number(value),
                        })
                      }
                    >
                      <SelectTrigger
                        aria-label='Marketing loop timer'
                        className='h-10 w-full rounded-xl border-zinc-200 bg-white sm:w-48 dark:border-white/10 dark:bg-white/[0.04]'
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='10'>
                          <LocalizedText text={"Every 10 minutes"} />
                        </SelectItem>
                        <SelectItem value='30'>
                          <LocalizedText text={"Every 30 minutes"} />
                        </SelectItem>
                        <SelectItem value='60'>
                          <LocalizedText text={"Every hour"} />
                        </SelectItem>
                        <SelectItem value='360'>
                          <LocalizedText text={"Every 6 hours"} />
                        </SelectItem>
                        <SelectItem value='1440'>
                          <LocalizedText text={"Every day"} />
                        </SelectItem>
                        <SelectItem value='10080'>
                          <LocalizedText text={"Every week"} />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {currentOrg?.autoModeLastRunAt && (
                    <p className='text-muted-foreground text-xs'>
                      <LocalizedText text={"Last cycle:"} />{" "}
                      {new Date(currentOrg.autoModeLastRunAt).toLocaleString()}
                      {currentOrg.autoModeLastError
                        ? ` · ${currentOrg.autoModeLastError}`
                        : " · Completed successfully"}
                    </p>
                  )}
                  <p className='text-muted-foreground text-xs'>
                    <LocalizedText
                      text={
                        "Genit Auto analyzes and recommends. Publishing, sending, and destructive changes follow the guardrails above."
                      }
                    />
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Billing Settings */}
            {activeTab === "billing" && (
              <div className='space-y-5'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <Card className='rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                    <CardContent className='p-5'>
                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <p className='text-xs font-medium text-zinc-500 dark:text-zinc-400'>
                            <LocalizedText text={"Current plan"} />
                          </p>
                          <p className='mt-1 text-xl font-semibold text-zinc-950 dark:text-white'>
                            {user?.userPlan || "Basic"}
                          </p>
                          <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
                            {user?.userPlan === Plan.BASIC
                              ? "Free plan"
                              : currentOrg?.businessPlan ||
                                "Active subscription"}
                          </p>
                        </div>
                        <Badge className='bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300'>
                          <LocalizedText text={"Active"} />
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                    <CardContent className='flex items-center justify-between gap-4 p-5'>
                      <div>
                        <p className='text-xs font-medium text-zinc-500 dark:text-zinc-400'>
                          <LocalizedText text={"Credit balance"} />
                        </p>
                        <p className='mt-1 text-xl font-semibold text-zinc-950 tabular-nums dark:text-white'>
                          {(user?.creditsRemaining ?? 0).toLocaleString()}
                        </p>
                        <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
                          <LocalizedText text={"Pay what you want from $10."} />
                        </p>
                      </div>
                      <Button
                        onClick={() => setIsTopUpOpen(true)}
                        className='shrink-0 rounded-xl active:scale-[0.97]'
                      >
                        <LocalizedText text={"Top up"} />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardHeader className='gap-4 border-b border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10'>
                    <div>
                      <CardTitle className='text-base'>
                        <LocalizedText text={"Billing history"} />
                      </CardTitle>
                      <CardDescription className='mt-1'>
                        <LocalizedText
                          text={"Payments, top-ups, invoices, and receipts."}
                        />
                      </CardDescription>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={openBillingPortal}
                      disabled={openingBillingPortal}
                      className='rounded-xl active:scale-[0.97]'
                    >
                      {openingBillingPortal && (
                        <Loader2 className='mr-2 size-4 animate-spin' />
                      )}
                      <LocalizedText text={"Invoices & receipts"} />
                    </Button>
                  </CardHeader>
                  <CardContent className='p-0'>
                    {billingHistory.length === 0 ? (
                      <div className='flex flex-col items-center px-5 py-12 text-center'>
                        <span className='flex size-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400'>
                          <CreditCard className='size-5' />
                        </span>
                        <p className='mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                          <LocalizedText text={"No billing activity yet"} />
                        </p>
                        <p className='mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400'>
                          <LocalizedText
                            text={
                              "Completed subscriptions and credit top-ups will appear here."
                            }
                          />
                        </p>
                      </div>
                    ) : (
                      <div className='divide-y divide-zinc-200 dark:divide-white/10'>
                        {billingHistory.map((rec: any) => (
                          <div
                            key={rec._id || rec.invoiceId || rec.providerId}
                            className='flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between'
                          >
                            <div className='min-w-0'>
                              <div className='flex flex-wrap items-center gap-2'>
                                <p className='truncate text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                                  {rec.invoiceNumber
                                    ? `Invoice #${rec.invoiceNumber}`
                                    : rec.description ||
                                      (rec.type === "credit_topup"
                                        ? "Credit top up"
                                        : "Subscription")}
                                </p>
                                <Badge variant='outline' className='capitalize'>
                                  {rec.status}
                                </Badge>
                              </div>
                              <p className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>
                                {new Date(
                                  rec.billingPeriodStart || rec.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className='flex items-center justify-between gap-4 sm:justify-end'>
                              <span className='text-sm font-semibold text-zinc-950 tabular-nums dark:text-white'>
                                {rec.amount
                                  ? `$${rec.amount.toFixed ? rec.amount.toFixed(2) : rec.amount}`
                                  : "—"}
                              </span>
                              {rec.invoicePdfUrl && (
                                <Button
                                  asChild
                                  variant='outline'
                                  size='sm'
                                  className='rounded-xl'
                                >
                                  <a
                                    href={rec.invoicePdfUrl}
                                    target='_blank'
                                    rel='noreferrer'
                                  >
                                    <Download className='mr-2 size-4' />
                                    <LocalizedText text={"Download"} />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardHeader className='border-b border-zinc-200 p-5 dark:border-white/10'>
                    <CardTitle className='text-base'>
                      <LocalizedText text={"Credit activity"} />
                    </CardTitle>
                    <CardDescription className='mt-1'>
                      <LocalizedText text={"Successful charges and automatic refunds."} />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-0'>
                    {creditTransactions.length === 0 ? (
                      <p className='px-5 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400'>
                        <LocalizedText text={"No credit activity yet"} />
                      </p>
                    ) : (
                      <div className='divide-y divide-zinc-200 dark:divide-white/10'>
                        {creditTransactions.map((transaction: any) => {
                          const charged = transaction.settledAmount ?? transaction.amount;
                          const refunded = transaction.status === "refunded";
                          const credited = transaction.direction === "credit";
                          return (
                            <div key={transaction._id} className='flex items-center justify-between gap-4 px-5 py-4'>
                              <div className='min-w-0'>
                                <p className='truncate text-sm font-medium text-zinc-900 capitalize dark:text-zinc-100'>
                                  {String(transaction.reason).replaceAll("_", " ")}
                                </p>
                                <p className='mt-1 text-xs text-zinc-500 dark:text-zinc-400'>
                                  {new Date(transaction.createdAt).toLocaleString()} · {transaction.balanceAfter} remaining
                                </p>
                              </div>
                              <Badge variant={refunded || credited ? "secondary" : "outline"}>
                                {refunded
                                  ? `Refunded ${transaction.amount}`
                                  : credited
                                    ? `+${charged} credits`
                                    : `−${charged} credits`}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardHeader className='border-b border-zinc-200 p-5 dark:border-white/10'>
                    <CardTitle className='text-base'>
                      <LocalizedText text={"Plans & pricing"} />
                    </CardTitle>
                    <CardDescription>
                      <LocalizedText
                        text={
                          "Upgrade your monthly credit allowance at any time."
                        }
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-3 sm:p-5'>
                    <PricingComponent
                      embedded
                      pricingCurrency={{
                        country: "US",
                        currency: "USD",
                        locale: "en-US",
                        rate: 1,
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className='space-y-5'>
                <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardHeader className='border-b border-zinc-200 p-5 dark:border-white/10'>
                    <CardTitle className='text-base'>
                      <LocalizedText text={"Account protection"} />
                    </CardTitle>
                    <CardDescription>
                      <LocalizedText
                        text={"Security controls for your Genit account."}
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='divide-y divide-zinc-200 p-0 dark:divide-white/10'>
                    <div className='flex items-center justify-between gap-5 px-5 py-4'>
                      <div className='flex min-w-0 items-start gap-3'>
                        <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300'>
                          <Bell className='size-4' />
                        </span>
                        <div>
                          <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                            <LocalizedText text={"Login notifications"} />
                          </p>
                          <p className='mt-0.5 text-sm text-zinc-500 dark:text-zinc-400'>
                            <LocalizedText
                              text={
                                "Save your preference for account-access alerts."
                              }
                            />
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={user?.preferences?.loginNotifications ?? true}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("loginNotifications", checked)
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between gap-5 px-5 py-4'>
                      <div className='flex min-w-0 items-start gap-3'>
                        <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300'>
                          <KeyRound className='size-4' />
                        </span>
                        <div>
                          <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                            <LocalizedText text={"Two-factor authentication"} />
                          </p>
                          <p className='mt-0.5 text-sm text-zinc-500 dark:text-zinc-400'>
                            <LocalizedText
                              text={
                                "Additional verification is not available yet."
                              }
                            />
                          </p>
                        </div>
                      </div>
                      <Badge variant='outline'>
                        <LocalizedText text={"Coming soon"} />
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between gap-5 px-5 py-4'>
                      <div className='flex min-w-0 items-start gap-3'>
                        <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300'>
                          <Monitor className='size-4' />
                        </span>
                        <div>
                          <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                            <LocalizedText text={"Device sessions"} />
                          </p>
                          <p className='mt-0.5 text-sm text-zinc-500 dark:text-zinc-400'>
                            <LocalizedText
                              text={
                                "Multi-device session controls are not available yet."
                              }
                            />
                          </p>
                        </div>
                      </div>
                      <Badge variant='outline'>
                        <LocalizedText text={"Coming soon"} />
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className='rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardContent className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                        <LocalizedText text={"Sign out of this device"} />
                      </p>
                      <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
                        <LocalizedText
                          text={
                            "Signing out will require you to log back in to continue using genit."
                          }
                        />
                      </p>
                    </div>
                    <Button
                      variant='outline'
                      onClick={() => setIsSignOutModalOpen(true)}
                      disabled={isSigningOut}
                      className='shrink-0 rounded-xl active:scale-[0.97]'
                    >
                      {isSigningOut ? (
                        <>
                          <LoadingFileLoader size={16} />
                          <LocalizedText text={"Signing out..."} />
                        </>
                      ) : (
                        "Sign out"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className='rounded-lg border-red-200 bg-red-50/50 shadow-none dark:border-red-500/20 dark:bg-red-500/[0.06]'>
                  <CardContent className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm font-medium text-red-900 dark:text-red-200'>
                        <LocalizedText text={"Delete account"} />
                      </p>
                      <p className='mt-1 max-w-xl text-sm text-red-700/80 dark:text-red-300/70'>
                        <LocalizedText
                          text={
                            "Permanently remove your projects, assets, and history. This cannot be undone."
                          }
                        />
                      </p>
                    </div>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => setIsDeleteModalOpen(true)}
                      disabled={isDeletingAccount}
                      className='shrink-0 rounded-xl active:scale-[0.97]'
                    >
                      {isDeletingAccount ? (
                        <>
                          <LoadingFileLoader size={16} />
                          <LocalizedText text={"Deleting..."} />
                        </>
                      ) : (
                        "Delete account"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === "preferences" && (
              <div className='space-y-5'>
                <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardHeader className='border-b border-zinc-200 p-5 dark:border-white/10'>
                    <CardTitle className='text-base'>
                      {t("Interface language")}
                    </CardTitle>
                    <CardDescription>
                      {t("Choose the language used throughout Genit.")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-5'>
                    <LanguageSelect className='w-full sm:w-56' />
                  </CardContent>
                </Card>

                <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardHeader className='border-b border-zinc-200 p-5 dark:border-white/10'>
                    <CardTitle className='text-base'>
                      {t("Appearance")}
                    </CardTitle>
                    <CardDescription>
                      {t("Choose how Genit looks on this device.")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-5'>
                    <div className='grid grid-cols-3 gap-2 rounded-lg bg-zinc-100 p-1.5 dark:bg-white/[0.05]'>
                      {[
                        { value: "light", label: t("Light"), icon: Sun },
                        { value: "dark", label: t("Dark"), icon: Moon },
                        { value: "system", label: t("System"), icon: Monitor },
                      ].map((option) => {
                        const Icon = option.icon;
                        const selected = theme === option.value;
                        return (
                          <button
                            key={option.value}
                            type='button'
                            aria-pressed={selected}
                            onClick={() =>
                              handleThemeChange(
                                option.value as "light" | "dark" | "system"
                              )
                            }
                            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-[background-color,color,box-shadow,transform] active:scale-[0.98] ${
                              selected
                                ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                            }`}
                          >
                            <Icon className='size-4' />
                            <span className='hidden sm:inline'>
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
                  <CardHeader className='border-b border-zinc-200 p-5 dark:border-white/10'>
                    <CardTitle className='text-base'>
                      {t("Email preferences")}
                    </CardTitle>
                    <CardDescription>
                      {t("Control the messages you receive from Genit.")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='divide-y divide-zinc-200 p-0 dark:divide-white/10'>
                    <div className='flex items-center justify-between gap-5 px-5 py-4'>
                      <div>
                        <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                          {t("Account updates")}
                        </p>
                        <p className='mt-0.5 text-sm text-zinc-500 dark:text-zinc-400'>
                          {t(
                            "Product activity and important account messages."
                          )}
                        </p>
                      </div>
                      <Switch
                        checked={user?.preferences?.emailNotifications ?? true}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("emailNotifications", checked)
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between gap-5 px-5 py-4'>
                      <div>
                        <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                          {t("Product news")}
                        </p>
                        <p className='mt-0.5 text-sm text-zinc-500 dark:text-zinc-400'>
                          {t("Tips, launches, and occasional offers.")}
                        </p>
                      </div>
                      <Switch
                        checked={user?.preferences?.marketingEmails ?? false}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("marketingEmails", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
      <AccountActionModal
        open={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={signOut}
        loading={isSigningOut}
        title='Sign out?'
        description="You'll need to enter your credentials the next time you want to use genit."
        confirmLabel='Sign out'
      />
      <AccountActionModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteAccount}
        loading={isDeletingAccount}
        title='Delete account'
        description='This action removes all of your projects, assets, and history. This cannot be undone.'
        confirmLabel='Delete account'
        variant='destructive'
      />
      <CreditTopUpModal
        open={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
      />
      <AutoModeDialog
        open={isAutoModeDialogOpen}
        onOpenChange={setIsAutoModeDialogOpen}
        onApprove={approveAutoMode}
        approving={savingAuto}
      />
    </div>
  );
};

export default SettingsHome;
