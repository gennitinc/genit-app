"use client";

import { useEffect, useState } from "react";
import { apiResponse } from "@/utils/apiResponse";
import { StatsCards } from "@/components/admin/StatsCards";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { Wallet, TrendingUp, Users, ArrowUpRight, DollarSign, PieChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        // We reuse the overview and series data for financial context
        const [overviewRes, seriesRes] = await Promise.all([
          apiResponse.get("/admin/analytics/overview"),
          apiResponse.get("/admin/analytics/series"),
        ]);
        setData({
          overview: overviewRes.data.data,
          series: seriesRes.data.data,
        });
      } catch (err) {
        console.error("Failed to fetch revenue data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-20 bg-muted rounded-3xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-3xl" />)}
        </div>
        <div className="h-96 bg-muted rounded-3xl" />
      </div>
    );
  }

  // Financial summary metrics
  const financialStats = {
    revenue: {
      total: data.overview.revenue.total,
      growth: "+14.2%",
      mrr: data.overview.revenue.total / 12, // Mock MRR calculation
    },
    plans: data.overview.plans
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold tracking-tight uppercase text-xs">
            <DollarSign className="w-3.5 h-3.5" />
            Financial Analysis
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Revenue Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform earnings and subscription conversions.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl px-6 py-6 h-auto shadow-lg shadow-primary/20 gap-2">
            <TrendingUp className="w-5 h-5" /> Detailed Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Revenue", value: `$${financialStats.revenue.total.toLocaleString()}`, trend: "+2.4%", icon: DollarSign, color: "text-emerald-500" },
          { label: "Est. Monthly Revenue", value: `$${Math.round(financialStats.revenue.mrr).toLocaleString()}`, trend: "+1.2%", icon: TrendingUp, color: "text-blue-500" },
          { label: "Active Subscriptions", value: data.overview.users.total, trend: "+18%", icon: Users, color: "text-primary" },
          { label: "Avg Revenue/User", value: `$${Math.round(financialStats.revenue.total / data.overview.users.total)}`, trend: "-2%", icon: PieChart, color: "text-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className={`p-2.5 rounded-2xl bg-muted/50 w-fit mb-4 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
              <span className={`text-xs font-bold mb-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10">
         <div className="rounded-[2.5rem] bg-card border border-border/50 p-8 shadow-xl relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Revenue Trends</h3>
                  <p className="text-sm text-muted-foreground">Historical earnings across all subscription tiers.</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="rounded-lg bg-background">Last 12 Months</Badge>
                </div>
              </div>
              
              <div className="h-[400px]">
                 <AnalyticsCharts 
                    growthData={data.series.userGrowth} 
                    revenueData={data.series.revenue}
                    usageData={[]}
                    hideGrowth={true}
                 />
              </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[2rem] bg-card border border-border/50 p-8">
               <h3 className="text-xl font-bold tracking-tight mb-6">Plan Concentration</h3>
               <div className="space-y-6">
                  {Object.entries(financialStats.plans).map(([plan, count]: [string, any], i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="capitalize">{plan}</span>
                        <span>{Math.round((count / data.overview.users.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-500" 
                          style={{ width: `${(count / data.overview.users.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-primary/10 to-background border border-primary/20 p-8 flex flex-col justify-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <h3 className="text-2xl font-bold tracking-tight mb-4">Financial Health: Excellent</h3>
               <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                 The platform's revenue retention is currently at 94.2%. Conversion rates for the 'Pro' tier have increased by 8% this week.
               </p>
               <Button className="w-fit mx-auto rounded-xl px-10">
                  Optimize Pricing
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
