"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Copy,
  Download,
  Crown,
  Medal,
  Link as LinkIcon,
  Code,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";
import { apiResponse } from "@/utils/apiResponse";
import { useUserContext } from "@/context/AuthenticatedContext";
import { JoinReferralCard } from "./join-referral-card";

interface ReferredUser {
  _id: string;
  username: string;
  email: string;
  userdp?: string;
  referredAt: Date;
  daysActive: number;
  isActive: boolean; // Active for more than 7 days
}

interface ReferralStats {
  totalRevenue: number;
  revenueChange: number;
  revenueShare: number;
  totalSupporters: number;
  activeSupporters: number; // > 7 days
  expiringSupporters: number; // < 7 days
  referralLink: string;
  referredUsers: ReferredUser[];
}

export default function ReferralDashboard() {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [stats, setStats] = useState<ReferralStats>({
    totalRevenue: 0,
    revenueChange: 0,
    revenueShare: 75,
    totalSupporters: 0,
    activeSupporters: 0,
    expiringSupporters: 0,
    referralLink: "",
    referredUsers: [],
  });

  const checkEnrollmentStatus = async () => {
    try {
      const response = await apiResponse.get("/referral/status", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsEnrolled(response.data.isEnrolled || false);
        return response.data.isEnrolled || false;
      }
    } catch (error: any) {
      // If endpoint doesn't exist or returns 404, user is not enrolled
      if (error.response?.status === 404) {
        setIsEnrolled(false);
        return false;
      }
      console.error("Failed to check enrollment status:", error);
      // Default to not enrolled if we can't check
      setIsEnrolled(false);
      return false;
    }
    return false;
  };

  const fetchReferralData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const enrolled = await checkEnrollmentStatus();

      if (!enrolled) {
        setIsEnrolled(false);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setIsEnrolled(true);

      // TODO: Replace with actual API endpoint
      const response = await apiResponse.get("/referral/stats", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch referral data:", error);
      // Set default data for development
      const defaultLink = `https://www.gennit.online/#/?creator=@${user?.username}`;
      setStats({
        totalRevenue: 6240.28,
        revenueChange: 10,
        revenueShare: 75,
        totalSupporters: 121,
        activeSupporters: 81,
        expiringSupporters: 40,
        referralLink: defaultLink,
        referredUsers: [
          {
            _id: "1",
            username: "sophie.w",
            email: "sophia@example.com",
            userdp: undefined,
            referredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            daysActive: 30,
            isActive: true,
          },
          {
            _id: "2",
            username: "mkahn",
            email: "michael@example.com",
            userdp: undefined,
            referredAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
            daysActive: 21,
            isActive: true,
          },
          {
            _id: "3",
            username: "emmyward",
            email: "emily@example.com",
            userdp: undefined,
            referredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            daysActive: 15,
            isActive: true,
          },
          {
            _id: "4",
            username: "m.jordan",
            email: "mickael@example.com",
            userdp: undefined,
            referredAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
            daysActive: 9,
            isActive: true,
          },
        ],
      });
      // If we have default data, assume enrolled for development
      setIsEnrolled(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleJoinSuccess = () => {
    setIsEnrolled(true);
    fetchReferralData();
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const handleRefresh = () => {
    fetchReferralData(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(stats.referralLink);
    toast.success("Link copied!", {
      description: "Referral link has been copied to clipboard.",
    });
  };

  const handleCopyCode = () => {
    const code = `<a href="${stats.referralLink}" target="_blank" rel="noopener noreferrer">Join me on Gennit</a>`;
    navigator.clipboard.writeText(code);
    toast.success("Code copied!", {
      description: "Referral code has been copied to clipboard.",
    });
  };

  const handleDownloadQR = (format: "png" | "svg") => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      stats.referralLink
    )}&format=${format}`;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `referral-qr.${format}`;
    link.click();
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    stats.referralLink
  )}`;

  const chartData = [
    {
      name: "Active (>7 days)",
      value: stats.activeSupporters,
      color: "#10b981",
    },
    {
      name: "Expiring (<7 days)",
      value: stats.expiringSupporters,
      color: "#f97316",
    },
  ];

  const getInitials = (username: string) => {
    return username
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <svg
          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  // Show join card if user is not enrolled
  if (!isEnrolled) {
    return <JoinReferralCard onJoinSuccess={handleJoinSuccess} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {/* Total Revenue Card */}
        <Card className="break-inside-avoid mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              $
              {stats.totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-green-600 mt-1">
              +{stats.revenueChange}% from last month
            </p>
          </CardContent>
        </Card>

        {/* Total Supporters Card */}
        <Card className="break-inside-avoid mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Referral Analytics
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative flex items-center justify-center h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {stats.totalSupporters}
                  </div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-xs">
                  Supporting &gt; 7 days: {stats.activeSupporters}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span className="text-xs">
                  Expiring in &lt; 7 days: {stats.expiringSupporters}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Supporters Card */}
        <Card className="h-fit break-inside-avoid mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Referred Users: {stats.referredUsers.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.referredUsers.length > 0 ? (
                stats.referredUsers.map((supporter, index) => (
                  <div key={supporter._id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={supporter.userdp} />
                      <AvatarFallback>
                        {getInitials(supporter.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          @{supporter.username}
                        </p>
                        {index === 0 ? (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Medal className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {supporter.daysActive}d active
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No supporters yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Share Link Card */}
        <Card className="break-inside-avoid mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Share your Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code Section */}
            <div className="space-y-3">
              <div className="text-sm font-medium">QR code</div>
              <div className="flex items-center justify-center p-4 bg-white rounded-lg border">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadQR("png")}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="flex-1"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>

            {/* Share Link Section */}
            <div className="space-y-3">
              <div className="text-sm font-medium">Share Link</div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <Input value={stats.referralLink} readOnly className="flex-1" />
              </div>
              <Button
                onClick={handleCopyLink}
                className="w-full"
                variant="default"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <p className="text-xs text-muted-foreground">
                Users support you for 365 days after they select you as a
                Creator. You should regularly remind them to maintain their
                support.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Media Kit Card */}
        <Card className="h-fit break-inside-avoid mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Media Kit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Including:</div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Logo</li>
                <li>Colors</li>
                <li>Font</li>
                <li>Elements</li>
              </ul>
            </div>
            <Button variant="default" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download from Google Drive
            </Button>
            <p className="text-xs text-muted-foreground">
              Our Media Kit provides a comprehensive selection of resources to
              help you successfully apply as a Creator and gain more supporters.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
