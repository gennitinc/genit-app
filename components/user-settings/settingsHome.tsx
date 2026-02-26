import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  CreditCard,
  Shield,
  Palette,
  ChevronRight,
  Check,
  Edit3,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useUserContext, User, Plan } from "@/context/AuthenticatedContext";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import AccountActionModal from "@/components/user/account-action-modal";
import { useAccountActions } from "@/hooks/use-account-actions";
import CreditTopUpModal from "@/components/credits/CreditTopUpModal";
import { apiResponse } from "@/utils/apiResponse";

const SettingsHome = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUserPreferences, fetchCurrentUser } = useUserContext();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { signOut, deleteAccount, isSigningOut, isDeletingAccount } =
    useAccountActions();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);

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

  // Check for billing tab in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    if (tab === "billing") {
      setActiveTab("billing");
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
    value: boolean,
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

  const settingsTabs = [
    { id: "account", label: "Account", icon: UserIcon },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Credits</p>
                      <p className="font-semibold">
                        {user?.creditsRemaining ?? 0}
                      </p>
                    </div>
                    <div>
                      <Button
                        size="sm"
                        variant="ghost"
                        // onClick={() => setIsTopUpOpen(true)}
                        className="cursor-not-allowed"
                      >
                        Top up
                      </Button>
                    </div>
                  </div>
                </div>
                <nav className="space-y-1 p-4">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
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
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="email"
                            defaultValue={user?.email || ""}
                            className="flex-1"
                          />
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4 mr-2" />
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
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Account Status</h4>
                        <p className="text-sm text-muted-foreground">
                          Your account is active and verified
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                      <Button variant="outline">Forgot Password?</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Billing Information
                    </CardTitle>
                    <CardDescription>
                      Manage your subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Current Plan</Label>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">
                              {user?.userPlan || "Free Plan"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {user?.userPlan === Plan.BASIC
                                ? "Free"
                                : user?.business?.businessPlan || "No plan"}
                            </p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
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
                    <div className="space-y-4">
                      {/* <h4 className="font-semibold">Payment Method</h4>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
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
                          <Edit3 className="h-4 w-4 mr-2" />
                          Update
                        </Button>
                      </div> */}
                      <div className="mt-4">
                        <Button
                          // onClick={() => setIsTopUpOpen(true)}
                          className="cursor-not-allowed"
                        >
                          Top up credits
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      View your past invoices and payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {billingHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No billing history yet.
                        </p>
                      ) : (
                        billingHistory.map((rec: any) => (
                          <div
                            key={rec._id || rec.invoiceId || rec.providerId}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {rec.invoiceNumber
                                  ? `Invoice #${rec.invoiceNumber}`
                                  : rec.description || rec.type}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {rec.billingPeriodStart
                                  ? new Date(
                                      rec.billingPeriodStart,
                                    ).toLocaleDateString()
                                  : new Date(
                                      rec.createdAt,
                                    ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">
                                {rec.amount
                                  ? `$${rec.amount.toFixed ? rec.amount.toFixed(2) : rec.amount}`
                                  : "—"}
                              </span>
                              {rec.invoicePdfUrl ? (
                                <a
                                  href={rec.invoicePdfUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Button variant="outline" size="sm">
                                    View invoice
                                  </Button>
                                </a>
                              ) : (
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            Two-Factor Authentication
                          </h4>
                          <p className="text-sm text-muted-foreground">
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
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Login Notifications</h4>
                          <p className="text-sm text-muted-foreground">
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
                              checked,
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Session Management</h4>
                          <p className="text-sm text-muted-foreground">
                            Control active sessions across devices
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage Sessions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sign out</CardTitle>
                    <CardDescription>
                      End your current session on this device
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Signing out will require you to log back in to continue
                      using Gennit.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSignOutModalOpen(true)}
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing out...
                        </>
                      ) : (
                        "Sign out"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <h4 className="font-medium text-destructive">
                          Delete Account
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setIsDeleteModalOpen(true)}
                          disabled={isDeletingAccount}
                        >
                          {isDeletingAccount ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Appearance & Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your experience and interface preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Theme</h4>
                          <p className="text-sm text-muted-foreground">
                            Choose your preferred theme
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={theme === "light" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleThemeChange("light")}
                          >
                            Light
                          </Button>
                          <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleThemeChange("dark")}
                          >
                            Dark
                          </Button>
                          <Button
                            variant={theme === "system" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleThemeChange("system")}
                          >
                            System
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">
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
                              checked,
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Marketing Emails</h4>
                          <p className="text-sm text-muted-foreground">
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
        title="Sign out?"
        description="You'll need to enter your credentials the next time you want to use Gennit."
        confirmLabel="Sign out"
      />
      <AccountActionModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteAccount}
        loading={isDeletingAccount}
        title="Delete account"
        description="This action removes all of your projects, assets, and history. This cannot be undone."
        confirmLabel="Delete account"
        variant="destructive"
      />
      <CreditTopUpModal
        open={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default SettingsHome;
