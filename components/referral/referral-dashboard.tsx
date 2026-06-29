"use client";

import { JoinReferralCard } from "./join-referral-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useUserContext } from "@/context/AuthenticatedContext";
import { apiResponse } from "@/utils/apiResponse";
import { GradientFrame } from "@/utils/gradient-frame";
import {
  Code,
  Copy,
  Crown,
  Download,
  Link as LinkIcon,
  Medal,
  RefreshCw,
} from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { LoadingFileLoader } from "@/utils/Loading";

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
      const defaultLink = `https://www.trygenit.com/signup#/?creator=@${user?.username}`;
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
    const code = `<a href="${stats.referralLink}" target="_blank" rel="noopener noreferrer">Join me on genit</a>`;
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
      <div className='flex h-full items-center justify-center'>
        <LoadingFileLoader size={24} />
      </div>
    );
  }

  // Show join card if user is not enrolled
  if (!isEnrolled) {
    return <JoinReferralCard onJoinSuccess={handleJoinSuccess} />;
  }

  return (
    <div className='mx-auto w-full max-w-6xl space-y-8 px-6 pt-10 pb-16'>
      {/* Page Header */}
      <header className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-semibold tracking-tight md:text-3xl'>
            Referral Dashboard
          </h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Track your earnings and grow your supporter community.
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={handleRefresh}
          disabled={refreshing}
          className='self-start sm:self-auto'
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </header>

      {/* KPI Row */}
      <section className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Card className='relative'>
          <GradientFrame />
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-foreground text-3xl font-semibold'>
              $
              {stats.totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className='mt-1 text-xs text-green-600'>
              +{stats.revenueChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className='relative'>
          <GradientFrame />
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              Total Supporters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-foreground text-3xl font-semibold'>
              {stats.totalSupporters}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              <span className='text-green-600'>
                {stats.activeSupporters} active
              </span>{" "}
              · {stats.expiringSupporters} expiring
            </p>
          </CardContent>
        </Card>

        <Card className='relative'>
          <GradientFrame />
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              Revenue Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-foreground text-3xl font-semibold'>
              {stats.revenueShare}%
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              Earned on every supported plan
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Analytics Row */}
      <section className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <Card className='relative lg:col-span-2'>
          <GradientFrame />
          <CardHeader>
            <CardTitle className='text-sm font-medium'>
              Supporters Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='relative flex h-[240px] items-center justify-center'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx='50%'
                    cy='50%'
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={2}
                    dataKey='value'
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='text-foreground text-3xl font-semibold'>
                    {stats.totalSupporters}
                  </div>
                  <div className='text-muted-foreground text-xs'>Total</div>
                </div>
              </div>
            </div>
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <div className='flex items-start gap-2'>
                <div className='mt-1 h-3 w-3 shrink-0 rounded bg-green-500'></div>
                <div>
                  <p className='text-foreground text-sm font-medium'>
                    {stats.activeSupporters}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Supporting &gt; 7 days
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <div className='mt-1 h-3 w-3 shrink-0 rounded bg-orange-500'></div>
                <div>
                  <p className='text-foreground text-sm font-medium'>
                    {stats.expiringSupporters}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Expiring &lt; 7 days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='relative h-fit lg:col-span-1'>
          <GradientFrame />
          <CardHeader>
            <CardTitle className='text-sm font-medium'>
              Top Supporters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {stats.referredUsers.length > 0 ? (
                stats.referredUsers.map((supporter, index) => (
                  <div key={supporter._id} className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage src={supporter.userdp} />
                      <AvatarFallback>
                        {getInitials(supporter.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2'>
                        <p className='truncate text-sm font-medium'>
                          @{supporter.username}
                        </p>
                        {index === 0 ? (
                          <Crown className='h-4 w-4 text-yellow-500' />
                        ) : (
                          <Medal className='h-4 w-4 text-gray-400' />
                        )}
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        {supporter.daysActive}d active
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-muted-foreground py-4 text-center text-sm'>
                  No supporters yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Engagement Row */}
      <section className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card className='relative'>
          <GradientFrame />
          <CardHeader>
            <CardTitle className='text-sm font-medium'>
              Share Your Link
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-3'>
              <div className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                QR Code
              </div>
              <div className='flex items-center justify-center rounded-lg border bg-white p-4'>
                <img src={qrCodeUrl} alt='QR Code' className='h-48 w-48' />
              </div>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDownloadQR("png")}
                  className='w-full'
                >
                  <Download className='mr-2 h-4 w-4' />
                  Download PNG
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleCopyCode}
                  className='w-full'
                >
                  <Code className='mr-2 h-4 w-4' />
                  Copy Embed
                </Button>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                Referral Link
              </div>
              <div className='flex items-center gap-2'>
                <LinkIcon className='text-muted-foreground h-4 w-4 shrink-0' />
                <Input value={stats.referralLink} readOnly className='flex-1' />
              </div>
              <Button onClick={handleCopyLink} className='w-full'>
                <Copy className='mr-2 h-4 w-4' />
                Copy Link
              </Button>
              <p className='text-muted-foreground text-xs'>
                Supporters back you for 365 days after picking you as their
                Creator. Re-engage them regularly to keep your support active.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='relative h-fit'>
          <GradientFrame />
          <CardHeader>
            <CardTitle className='text-sm font-medium'>Media Kit</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground text-sm'>
              A complete brand toolkit to help you stand out and onboard new
              supporters.
            </p>
            <div>
              <div className='text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase'>
                Includes
              </div>
              <ul className='text-foreground grid grid-cols-2 gap-y-1 text-sm'>
                <li>· Logo</li>
                <li>· Colors</li>
                <li>· Font</li>
                <li>· Elements</li>
              </ul>
            </div>
            <Button className='w-full'>
              <Download className='mr-2 h-4 w-4' />
              Download from Google Drive
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
