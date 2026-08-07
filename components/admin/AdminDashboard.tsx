"use client";

import { AnalyticsCharts } from "./AnalyticsCharts";
import { RecentUsersTable } from "./RecentUsersTable";
import { StatsCards } from "./StatsCards";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewRes, seriesRes, activitiesRes] = await Promise.all([
        apiResponse.get("/admin/analytics/overview"),
        apiResponse.get("/admin/analytics/series"),
        apiResponse.get("/admin/analytics/top-activities"),
      ]);

      setData({
        overview: overviewRes.data.data,
        series: seriesRes.data.data,
        topActivities: activitiesRes.data.data,
      });
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data. Ensure you have admin privileges."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className='flex h-[600px] flex-col items-center justify-center gap-4'>
        <LoadingFileLoader size={16} />
        <p className='text-muted-foreground animate-pulse text-sm'>
          <LocalizedText text={"Loading analytics dashboard..."} />
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mx-auto flex h-[600px] max-w-md flex-col items-center justify-center p-6 text-center'>
        <div className='bg-destructive/10 text-destructive mb-6 rounded-full p-4'>
          <AlertCircle className='h-12 w-12' />
        </div>
        <h2 className='mb-2 text-xl font-bold'>
          <LocalizedText text={"Access Denied"} />
        </h2>
        <p className='text-muted-foreground mb-8'>{error}</p>
        <Button
          onClick={fetchDashboardData}
          variant='outline'
          className='gap-2'
        >
          <RefreshCcw className='h-4 w-4' />
          <LocalizedText text={"Retry"} />
        </Button>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl py-4 pb-20'>
      <div className='mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='mb-2 text-3xl font-bold tracking-tight'>
            <LocalizedText text={"Admin Overview"} />
          </h1>
          <p className='text-muted-foreground'>
            <LocalizedText
              text={"Monitor your platform's growth and user activity."}
            />
          </p>
        </div>
        <Button
          variant='outline'
          onClick={fetchDashboardData}
          disabled={loading}
          className='bg-background/50 gap-2 self-start backdrop-blur-sm'
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <LocalizedText text={"Refresh Stats"} />
        </Button>
      </div>

      <StatsCards stats={data.overview} />

      <AnalyticsCharts
        growthData={data.series.userGrowth}
        revenueData={data.series.revenue}
        usageData={data.topActivities}
      />

      <RecentUsersTable />

      <div className='from-primary/10 via-background to-background border-primary/20 group relative mt-12 overflow-hidden rounded-3xl border bg-gradient-to-br p-8'>
        <div className='relative z-10'>
          <h2 className='mb-4 text-2xl font-bold'>
            <LocalizedText text={"Deep Insights"} />
          </h2>
          <p className='text-muted-foreground mb-6 max-w-2xl'>
            <LocalizedText
              text={
                "Your platform is growing. We've detected a significant increase in"
              }
            />
            <strong> {data.overview.content.total.toLocaleString()} </strong>
            <LocalizedText
              text={
                "pieces of AI content created. Most users are currently interacting with"
              }
            />
            <strong> {data.topActivities[0]?.name || "new features"}</strong>.
          </p>
          <div className='flex gap-4'>
            <div className='bg-background/80 border-border/50 rounded-xl border px-4 py-2 text-sm font-medium backdrop-blur-md'>
              <LocalizedText text={"Daily Avg:"} />
              {Math.round(data.overview.content.total / 30)}{" "}
              <LocalizedText text={"generations"} />
            </div>
            <div className='bg-background/80 border-border/50 rounded-xl border px-4 py-2 text-sm font-medium backdrop-blur-md'>
              <LocalizedText text={"System Status: Optimal"} />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-indigo-600 blur-[100px] transition-colors duration-500 group-hover:bg-indigo-600 hover:bg-indigo-700/20 hover:bg-indigo-700/30' />
      </div>
    </div>
  );
};
