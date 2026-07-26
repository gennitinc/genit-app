import CreditTopUpModal from "@/components/credits/CreditTopUpModal";
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
import { useAccountActions } from "@/hooks/use-account-actions";
import { useToast } from "@/hooks/use-toast";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { GradientFrame } from "@/utils/gradient-frame";
import {
  Bot,
  Check,
  ChevronRight,
  CreditCard,
  Download,
  Edit3,
  Loader2,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Target,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const SettingsHome = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateOrganization, updateUserPreferences } = useUserContext();
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
  const [openingBillingPortal, setOpeningBillingPortal] = useState(false);
  const [savingAuto, setSavingAuto] = useState(false);
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

  // Sync active tab with ?tab= URL param.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    const valid = [
      "account",
      "brand",
      "automation",
      "billing",
      "security",
      "preferences",
    ];
    if (tab && valid.includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

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
    { id: "account", label: "Account", icon: UserIcon },
    { id: "brand", label: "Brand", icon: Palette },
    { id: "automation", label: "Genit Auto", icon: Bot },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  return (
    <div className='mx-auto min-h-screen max-w-6xl'>
      <div className='container mx-auto max-w-6xl px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-foreground mb-2 text-3xl font-bold'>Settings</h1>
          <p className='text-muted-foreground'>
            Manage your account settings and preferences
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
          {/* Sidebar Navigation */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-12 overflow-hidden'>
              <CardContent className='p-0'>
                <div className='border-border border-b p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-muted-foreground text-sm'>Credits</p>
                      <p className='font-semibold'>
                        {user?.creditsRemaining ?? 0}
                      </p>
                    </div>
                    <div>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => setIsTopUpOpen(true)}
                      >
                        Top up
                      </Button>
                    </div>
                  </div>
                </div>
                <nav className='space-y-1 p-4'>
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon
                          className={`size-4 ${
                            activeTab === tab.id
                              ? "text-indigo-600 hover:text-indigo-700"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        />
                        {tab.label}
                        <ChevronRight className='ml-auto h-4 w-4' />
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-3'>
            {/* Account Settings */}
            {activeTab === "account" && (
              <div className='space-y-6'>
                <Card className='relative overflow-hidden'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <UserIcon className='h-5 w-5' />
                      Account Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='username'>Username</Label>
                        <Input
                          id='username'
                          defaultValue={user?.username || ""}
                        />
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          defaultValue={user?.business?.businessName || ""}
                        />
                      </div> */}
                      <div className='space-y-2'>
                        <Label htmlFor='email'>Email Address</Label>
                        <div className='flex items-center gap-2'>
                          <Input
                            id='email'
                            defaultValue={user?.email || ""}
                            className='flex-1'
                          />
                          <Button variant='outline' size='sm'>
                            <Edit3 className='mr-2 h-4 w-4' />
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="businessPhone">Business Phone</Label>
                      <Input
                        id="businessPhone"
                        defaultValue={user?.business?.businessPhone || ""}
                      />
                    </div> */}
                    <Separator />
                    <div className='flex items-center justify-between'>
                      <div>
                        <h4 className='font-medium'>Account Status</h4>
                        <p className='text-muted-foreground text-sm'>
                          Your account is active and verified
                        </p>
                      </div>
                      <Badge
                        variant='secondary'
                        className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      >
                        <Check className='mr-1 h-3 w-3' />
                        Verified
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className='relative overflow-hidden'>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='currentPassword'>Current Password</Label>
                      <Input
                        id='currentPassword'
                        type='password'
                        placeholder='Enter current password'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='newPassword'>New Password</Label>
                      <Input
                        id='newPassword'
                        type='password'
                        placeholder='Enter new password'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='confirmPassword'>
                        Confirm New Password
                      </Label>
                      <Input
                        id='confirmPassword'
                        type='password'
                        placeholder='Confirm new password'
                      />
                    </div>
                    <div className='flex flex-col gap-2 space-y-2 lg:flex-row'>
                      <Button>
                        <Save className='mr-2 h-4 w-4' />
                        Update Password
                      </Button>
                      <Button variant='outline'>Forgot Password?</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Brand Settings */}
            {activeTab === "brand" && <BrandSettings />}

            {activeTab === "automation" && (
              <Card className='border-border/70 bg-card/70 relative overflow-hidden shadow-sm'>
                <CardHeader className='bg-muted/20 border-b p-5 sm:p-6'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex min-w-0 items-start gap-3'>
                      <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl'>
                        <Bot className='h-5 w-5' />
                      </div>
                      <div>
                        <CardTitle className='text-xl'>
                          Genit Auto marketing loop
                        </CardTitle>
                        <CardDescription className='mt-1 max-w-2xl text-sm leading-6'>
                          Reviews active campaigns and performance, then
                          improves recommendations until you turn Auto off.
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
                        Run autonomously
                      </h4>
                      <p className='text-muted-foreground mt-0.5 max-w-2xl text-sm leading-5'>
                        Uses your brand, campaigns, posts, email activity,
                        attribution, and connected marketing data.
                      </p>
                    </div>
                    <Switch
                      aria-label='Run Genit Auto autonomously'
                      className='active:scale-[0.97]'
                      checked={currentOrg?.autoModeEnabled ?? false}
                      disabled={
                        savingAuto ||
                        ((!user || user.userPlan === Plan.BASIC) &&
                          !currentOrg?.autoModeEnabled)
                      }
                      onCheckedChange={(checked) =>
                        saveAutoSettings({ autoModeEnabled: checked })
                      }
                    />
                  </div>

                  {(!user || user.userPlan === Plan.BASIC) &&
                    !currentOrg?.autoModeEnabled && (
                      <p className='border-primary/20 bg-primary/5 text-muted-foreground rounded-xl border p-3 text-sm'>
                        Genit Auto is available on every paid plan.{" "}
                        <a
                          className='text-primary font-medium hover:underline'
                          href='/pricing'
                        >
                          View plans
                        </a>
                      </p>
                    )}

                  <section className='bg-background/60 space-y-5 rounded-xl border p-4 sm:p-5'>
                    <div className='flex items-start gap-3'>
                      <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg'>
                        <Target className='h-4 w-4' />
                      </div>
                      <div>
                        <h4 className='font-semibold'>Goals & learning</h4>
                        <p className='text-muted-foreground mt-0.5 text-sm leading-5'>
                          Set a measurable target. Each loop evaluates progress,
                          adjusts the plan, and remembers the result.
                        </p>
                      </div>
                    </div>

                    <div className='bg-muted/30 grid gap-3 rounded-xl border p-3 md:grid-cols-2'>
                      <div className='space-y-1.5 md:col-span-2'>
                        <Label htmlFor='auto-goal-title' className='text-xs'>
                          Goal
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
                          Metric
                        </Label>
                        <select
                          id='auto-goal-metric'
                          className='border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]'
                          value={goalMetric}
                          onChange={(event) =>
                            setGoalMetric(
                              event.target.value as typeof goalMetric
                            )
                          }
                        >
                          <option value='impressions'>Impressions</option>
                          <option value='clicks'>Clicks</option>
                          <option value='conversions'>Conversions</option>
                          <option value='conversionValue'>
                            Conversion value
                          </option>
                          <option value='roi'>ROI</option>
                        </select>
                      </div>
                      <div className='space-y-1.5'>
                        <Label htmlFor='auto-goal-target' className='text-xs'>
                          Target
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
                        <Plus className='h-4 w-4' /> Add goal
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
                        <p className='text-sm font-medium'>Current plan</p>
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
                          Controlled experiments
                        </h4>
                        <p className='text-muted-foreground mt-0.5 text-sm leading-5'>
                          Compare two active campaigns for at least three
                          cycles. A winner needs at least 10% measured lift.
                        </p>
                      </div>
                    </div>

                    <div className='bg-muted/30 grid gap-3 rounded-xl border p-3 md:grid-cols-2'>
                      <div className='space-y-1.5 md:col-span-2'>
                        <Label
                          htmlFor='auto-experiment-title'
                          className='text-xs'
                        >
                          Experiment name
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
                          Success metric
                        </Label>
                        <select
                          id='auto-experiment-metric'
                          className='border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]'
                          value={experimentMetric}
                          onChange={(event) =>
                            setExperimentMetric(
                              event.target.value as typeof experimentMetric
                            )
                          }
                        >
                          <option value='impressions'>Impressions</option>
                          <option value='clicks'>Clicks</option>
                          <option value='conversions'>Conversions</option>
                          <option value='conversionValue'>Value</option>
                          <option value='roi'>ROI</option>
                        </select>
                      </div>
                      <div className='space-y-1.5'>
                        <Label
                          htmlFor='auto-experiment-lift'
                          className='text-xs'
                        >
                          Minimum lift (%)
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
                          Variant A
                        </Label>
                        <select
                          id='auto-variant-a'
                          className='border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]'
                          value={variantA}
                          onChange={(event) => setVariantA(event.target.value)}
                        >
                          <option value=''>Choose campaign</option>
                          {autoCampaigns.map((campaign) => (
                            <option key={campaign._id} value={campaign._id}>
                              {campaign.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='space-y-1.5'>
                        <Label htmlFor='auto-variant-b' className='text-xs'>
                          Variant B
                        </Label>
                        <select
                          id='auto-variant-b'
                          className='border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]'
                          value={variantB}
                          onChange={(event) => setVariantB(event.target.value)}
                        >
                          <option value=''>Choose campaign</option>
                          {autoCampaigns.map((campaign) => (
                            <option key={campaign._id} value={campaign._id}>
                              {campaign.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        className='active:scale-[0.97] md:col-span-2 md:justify-self-end'
                        onClick={addAutoExperiment}
                        disabled={savingAuto || autoCampaigns.length < 2}
                      >
                        <Plus className='h-4 w-4' /> Create experiment
                      </Button>
                    </div>
                    {autoCampaigns.length < 2 && (
                      <p className='text-muted-foreground flex items-center gap-2 text-xs'>
                        <span className='bg-muted-foreground/60 size-1.5 rounded-full' />
                        Activate at least two GTM campaigns to run an
                        experiment.
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
                                {experiment.variantA?.value ?? "—"} vs{" "}
                                {experiment.variantB?.campaignName || "B"}:{" "}
                                {experiment.variantB?.value ?? "—"} ·{" "}
                                {experiment.samples || 0}/3 cycles
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
                          <h4 className='font-medium'>Adaptive allocation</h4>
                          <p className='text-muted-foreground text-sm'>
                            Proposed GTM budget split from performance and
                            experiment winners. Applying updates campaign plans,
                            not provider ad spend.
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
                          Apply allocation
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
                              Planned budget{" "}
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
                          <h4 className='font-medium'>Scenario simulation</h4>
                          <p className='text-muted-foreground text-sm'>
                            Linear forecast if the proposed allocation is
                            applied.
                          </p>
                        </div>
                        <Badge variant='secondary'>
                          {
                            (
                              autoInsights?.simulation ||
                              currentOrg?.autoModeSimulation
                            )?.confidence
                          }{" "}
                          confidence
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
                                baseline ·{" "}
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
                          <h4 className='font-semibold'>Specialist missions</h4>
                          <p className='text-muted-foreground mt-0.5 max-w-xl text-sm leading-5'>
                            Turn the current plan into strategist, creator, and
                            analyst work. Approval never includes publishing.
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
                        Compile plan
                      </Button>
                    </div>
                    {autoMissions.length === 0 ? (
                      <div className='bg-muted/20 flex flex-col items-center rounded-xl border border-dashed px-4 py-7 text-center'>
                        <div className='bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full'>
                          <Bot className='h-4 w-4' />
                        </div>
                        <p className='mt-3 text-sm font-medium'>
                          No missions yet
                        </p>
                        <p className='text-muted-foreground mt-1 max-w-sm text-xs leading-5'>
                          Complete an Auto plan, then compile it into specialist
                          work.
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
                                        In Brand Brain
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
                                      Approve mission
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
                                      Retry
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
                                      Cancel
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
                                              Save output
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
                                  Approve outputs and remember
                                </Button>
                              )}

                              {mission.status === "completed" && (
                                <div className='space-y-3 border-t pt-3'>
                                  <div className='flex flex-wrap gap-2'>
                                    <select
                                      aria-label='Publishing account'
                                      className='border-input bg-background h-9 min-w-52 rounded-md border px-3 text-sm'
                                      value={
                                        missionDraftAccounts[mission._id] || ""
                                      }
                                      onChange={(event) =>
                                        setMissionDraftAccounts((current) => ({
                                          ...current,
                                          [mission._id]: event.target.value,
                                        }))
                                      }
                                    >
                                      <option value=''>Choose account</option>
                                      {publishingIntegrations.map(
                                        (integration) => (
                                          <option
                                            key={integration._id}
                                            value={integration._id}
                                          >
                                            {integration.platform} ·{" "}
                                            {integration.accountName}
                                          </option>
                                        )
                                      )}
                                    </select>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() =>
                                        createMissionDraft(mission._id)
                                      }
                                    >
                                      Create channel draft
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
                                            Save draft
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
                                            Approve and publish
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
                                            Schedule
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
                                  Learned outcome:{" "}
                                  {mission.outcome.publishedAssets} assets ·{" "}
                                  {mission.outcome.metrics?.clicks || 0} clicks
                                  · {mission.outcome.conversions || 0}{" "}
                                  conversions
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
                        <h4 className='font-medium'>Auto alerts</h4>
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
                              Acknowledge
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
                        <Shield className='h-4 w-4' /> Action guardrails
                      </h4>
                      <p className='text-muted-foreground text-sm'>
                        Control which autonomous actions need a person and how
                        much one cycle may use.
                      </p>
                    </div>
                    <div className='grid gap-4 sm:grid-cols-3'>
                      <div className='space-y-2'>
                        <Label htmlFor='approval-policy'>
                          Require approval
                        </Label>
                        <select
                          id='approval-policy'
                          className='border-input bg-background h-9 w-full rounded-md border px-3 text-sm'
                          value={
                            currentOrg?.automationApprovalPolicy ??
                            "destructive"
                          }
                          disabled={savingAuto}
                          onChange={(event) =>
                            saveAutoSettings({
                              automationApprovalPolicy: event.target.value as
                                "destructive" | "external" | "all",
                            })
                          }
                        >
                          <option value='destructive'>
                            Destructive actions
                          </option>
                          <option value='external'>All external actions</option>
                          <option value='all'>Every action</option>
                        </select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='daily-action-limit'>
                          Daily actions
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
                          Credits per run
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
                        <h4 className='font-medium'>Approvals & run history</h4>
                        <p className='text-muted-foreground text-sm'>
                          The latest governed actions for this organization.
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
                        Refresh
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
                                  Reject
                                </Button>
                                <Button
                                  size='sm'
                                  onClick={() =>
                                    decideAutomationRun(run._id, "approve")
                                  }
                                >
                                  Approve
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
                                Retry
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
                        <RefreshCw className='h-4 w-4' /> Loop timer
                      </h4>
                      <p className='text-muted-foreground text-sm'>
                        Choose how often Genit starts a new marketing cycle.
                      </p>
                    </div>
                    <select
                      aria-label='Marketing loop timer'
                      className='border-input bg-background h-9 rounded-md border px-3 text-sm'
                      value={currentOrg?.autoModeIntervalMinutes ?? 1440}
                      disabled={savingAuto || !currentOrg?.autoModeEnabled}
                      onChange={(event) =>
                        saveAutoSettings({
                          autoModeIntervalMinutes: Number(event.target.value),
                        })
                      }
                    >
                      <option value={10}>Every 10 minutes</option>
                      <option value={30}>Every 30 minutes</option>
                      <option value={60}>Every hour</option>
                      <option value={360}>Every 6 hours</option>
                      <option value={1440}>Every day</option>
                      <option value={10080}>Every week</option>
                    </select>
                  </div>

                  {currentOrg?.autoModeLastRunAt && (
                    <p className='text-muted-foreground text-xs'>
                      Last cycle:{" "}
                      {new Date(currentOrg.autoModeLastRunAt).toLocaleString()}
                      {currentOrg.autoModeLastError
                        ? ` · ${currentOrg.autoModeLastError}`
                        : " · Completed successfully"}
                    </p>
                  )}
                  <p className='text-muted-foreground text-xs'>
                    Genit Auto analyzes and recommends. Publishing, sending, and
                    destructive changes follow the guardrails above.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Billing Settings */}
            {activeTab === "billing" && (
              <div className='space-y-6'>
                <Card className='relative overflow-hidden'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <CreditCard className='h-5 w-5' />
                      Billing Information
                    </CardTitle>
                    <CardDescription>
                      Manage your subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label>Current Plan</Label>
                        <div className='flex items-center justify-between rounded-lg border p-4'>
                          <div>
                            <h4 className='font-semibold'>
                              {user?.userPlan || "Free Plan"}
                            </h4>
                            <p className='text-muted-foreground text-sm'>
                              {user?.userPlan === Plan.BASIC
                                ? "Free"
                                : currentOrg?.businessPlan || "No plan"}
                            </p>
                          </div>
                          <Badge variant='secondary'>Active</Badge>
                        </div>
                      </div>
                      {/* <div className="space-y-2">
                        <Label>Next Billing Date</Label>
                        <div className="p-4 border rounded-lg">
                          <p className="font-semibold">January 15, 2024</p>
                          <p className="text-sm text-muted-foreground">
                            Auto-renewal enabled
                          </p>
                        </div>
                      </div> */}
                    </div>
                    <Separator />
                    <div className='space-y-4'>
                      {/* <h4 className="font-semibold">Payment Method</h4>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-6 text-xs font-bold text-white bg-blue-600 rounded">
                            VISA
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4532</p>
                            <p className="text-sm text-muted-foreground">
                              Expires 12/25
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Update
                        </Button>
                      </div> */}
                      <div className='mt-4'>
                        <Button onClick={() => setIsTopUpOpen(true)}>
                          Top up credits
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='relative overflow-hidden'>
                  <CardHeader className='gap-3 sm:flex-row sm:items-start sm:justify-between'>
                    <div>
                      <CardTitle>Billing History</CardTitle>
                      <CardDescription>
                        View your past invoices and payments
                      </CardDescription>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={openBillingPortal}
                      disabled={openingBillingPortal}
                    >
                      {openingBillingPortal && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      )}
                      Invoices & receipts
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {billingHistory.length === 0 ? (
                        <p className='text-muted-foreground text-sm'>
                          No billing history yet.
                        </p>
                      ) : (
                        billingHistory.map((rec: any) => (
                          <div
                            key={rec._id || rec.invoiceId || rec.providerId}
                            className='flex items-center justify-between rounded-lg border p-4'
                          >
                            <div>
                              <div className='flex items-center gap-2'>
                                <p className='font-medium'>
                                  {rec.invoiceNumber
                                    ? `Invoice #${rec.invoiceNumber}`
                                    : rec.description ||
                                      (rec.type === "credit_topup"
                                        ? "Credit top up"
                                        : "Subscription")}
                                </p>
                                <Badge
                                  variant={
                                    rec.status === "paid"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className='capitalize'
                                >
                                  {rec.status}
                                </Badge>
                              </div>
                              <p className='text-muted-foreground text-sm'>
                                {rec.billingPeriodStart
                                  ? new Date(
                                      rec.billingPeriodStart
                                    ).toLocaleDateString()
                                  : new Date(
                                      rec.createdAt
                                    ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className='flex items-center gap-4'>
                              <span className='font-semibold'>
                                {rec.amount
                                  ? `$${rec.amount.toFixed ? rec.amount.toFixed(2) : rec.amount}`
                                  : "—"}
                              </span>
                              {rec.invoicePdfUrl ? (
                                <a
                                  href={rec.invoicePdfUrl}
                                  target='_blank'
                                  rel='noreferrer'
                                >
                                  <Button variant='outline' size='sm'>
                                    <Download className='mr-2 h-4 w-4' />
                                    Download invoice
                                  </Button>
                                </a>
                              ) : null}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className='relative overflow-hidden'>
                  <CardHeader>
                    <CardTitle>Plans & pricing</CardTitle>
                    <CardDescription>
                      Upgrade your monthly credit allowance at any time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
              <div className='space-y-6'>
                <Card className='relative overflow-hidden'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Shield className='h-5 w-5' />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium'>
                            Two-Factor Authentication
                          </h4>
                          <p className='text-muted-foreground text-sm'>
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          checked={user?.preferences?.twoFactorAuth ?? false}
                          onCheckedChange={(checked) =>
                            handlePreferenceChange("twoFactorAuth", checked)
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium'>Login Notifications</h4>
                          <p className='text-muted-foreground text-sm'>
                            Get notified when someone logs into your account
                          </p>
                        </div>
                        <Switch
                          checked={
                            user?.preferences?.loginNotifications ?? true
                          }
                          onCheckedChange={(checked) =>
                            handlePreferenceChange(
                              "loginNotifications",
                              checked
                            )
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium'>Session Management</h4>
                          <p className='text-muted-foreground text-sm'>
                            Control active sessions across devices
                          </p>
                        </div>
                        <Button variant='outline' size='sm'>
                          Manage Sessions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='relative overflow-hidden'>
                  <CardHeader>
                    <CardTitle>Sign out</CardTitle>
                    <CardDescription>
                      End your current session on this device
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <p className='text-muted-foreground text-sm'>
                      Signing out will require you to log back in to continue
                      using genit.
                    </p>
                    <Button
                      variant='outline'
                      onClick={() => setIsSignOutModalOpen(true)}
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? (
                        <>
                          <LoadingFileLoader size={16} />
                          Signing out...
                        </>
                      ) : (
                        "Sign out"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className='relative overflow-hidden'>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='rounded-lg border border-dashed p-4'>
                        <h4 className='text-destructive font-medium'>
                          Delete Account
                        </h4>
                        <p className='text-muted-foreground mb-4 text-xs'>
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => setIsDeleteModalOpen(true)}
                          disabled={isDeletingAccount}
                        >
                          {isDeletingAccount ? (
                            <>
                              <LoadingFileLoader size={16} />
                              Deleting...
                            </>
                          ) : (
                            "Delete Account"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === "preferences" && (
              <div className='space-y-6'>
                <Card className='relative overflow-hidden'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Palette className='h-5 w-5' />
                      Appearance & Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your experience and interface preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium'>Theme</h4>
                          <p className='text-muted-foreground text-sm'>
                            Choose your preferred theme
                          </p>
                        </div>
                        <div className='flex gap-2'>
                          <Button
                            variant={theme === "light" ? "default" : "outline"}
                            size='sm'
                            onClick={() => handleThemeChange("light")}
                          >
                            Light
                          </Button>
                          <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            size='sm'
                            onClick={() => handleThemeChange("dark")}
                          >
                            Dark
                          </Button>
                          <Button
                            variant={theme === "system" ? "default" : "outline"}
                            size='sm'
                            onClick={() => handleThemeChange("system")}
                          >
                            System
                          </Button>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium'>Email Notifications</h4>
                          <p className='text-muted-foreground text-sm'>
                            Receive email updates about your account
                          </p>
                        </div>
                        <Switch
                          checked={
                            user?.preferences?.emailNotifications ?? true
                          }
                          onCheckedChange={(checked) =>
                            handlePreferenceChange(
                              "emailNotifications",
                              checked
                            )
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium'>Marketing Emails</h4>
                          <p className='text-muted-foreground text-sm'>
                            Receive promotional content and updates
                          </p>
                        </div>
                        <Switch
                          checked={user?.preferences?.marketingEmails ?? false}
                          onCheckedChange={(checked) =>
                            handlePreferenceChange("marketingEmails", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
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
    </div>
  );
};

export default SettingsHome;
