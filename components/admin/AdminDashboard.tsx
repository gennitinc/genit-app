"use client";

import { useState, useEffect } from "react";
import { StatsCards } from "./StatsCards";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { RecentUsersTable } from "./RecentUsersTable";
import { apiResponse } from "@/utils/apiResponse";
import { Loader2, RefreshCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
      setError(err.response?.data?.message || "Failed to load dashboard data. Ensure you have admin privileges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading analytics dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] p-6 text-center max-w-md mx-auto">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-6">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Button onClick={fetchDashboardData} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Overview</h1>
          <p className="text-muted-foreground">Monitor your platform's growth and user activity.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchDashboardData} 
          disabled={loading}
          className="gap-2 bg-background/50 backdrop-blur-sm self-start"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </Button>
      </div>

      <StatsCards stats={data.overview} />
      
      <AnalyticsCharts 
        growthData={data.series.userGrowth} 
        revenueData={data.series.revenue}
        usageData={data.topActivities}
      />

      <RecentUsersTable />

      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Deep Insights</h2>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Your platform is growing. We've detected a significant increase in 
            <strong> {data.overview.content.total.toLocaleString()} </strong> 
            pieces of AI content created. Most users are currently interacting with 
            <strong> {data.topActivities[0]?.name || 'new features'}</strong>.
          </p>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 text-sm font-medium">
              Daily Avg: {Math.round(data.overview.content.total / 30)} generations
            </div>
            <div className="px-4 py-2 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 text-sm font-medium">
              System Status: Optimal
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/30 transition-colors duration-500" />
      </div>
    </div>
  );
};
