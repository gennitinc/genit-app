import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  CreditCard,
  Shield,
  Bell,
  Palette,
  ChevronRight,
  Check,
  Edit3,
  Save,
  X,
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
import { useUserContext, User } from "@/context/AuthenticatedContext";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

const SettingsHome = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUserPreferences } = useUserContext();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

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
                              {user?.userPlan === "Free"
                                ? "Free"
                                : user?.business?.businessPlan || "No plan"}
                            </p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Next Billing Date</Label>
                        <div className="p-4 border rounded-lg">
                          <p className="font-semibold">January 15, 2024</p>
                          <p className="text-sm text-muted-foreground">
                            Auto-renewal enabled
                          </p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-semibold">Payment Method</h4>
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
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              Invoice #{12345 + item}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Dec {15 + item}, 2023
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">$29.00</span>
                            <Button variant="outline" size="sm">
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      ))}
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
                              checked
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
                        <Button variant="destructive" size="sm">
                          Delete Account
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
                              checked
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
    </div>
  );
};

export default SettingsHome;
