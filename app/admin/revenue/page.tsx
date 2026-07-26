"use client";

import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { StatsCards } from "@/components/admin/StatsCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiResponse } from "@/utils/apiResponse";
import {
  ArrowUpRight,
  DollarSign,
  PieChart,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

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
      <div className='animate-pulse space-y-8 p-8'>
        <div className='bg-muted h-20 w-1/3 rounded-3xl' />
        <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='bg-muted h-32 rounded-3xl' />
          ))}
        </div>
        <div className='bg-muted h-96 rounded-3xl' />
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
    plans: data.overview.plans,
  };

  return (
    <div className='mx-auto max-w-7xl p-8 pb-20'>
      <div className='mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center'>
        <div className='space-y-1'>
          <div className='text-primary flex items-center gap-2 text-xs font-bold tracking-tight uppercase'>
            <DollarSign className='h-3.5 w-3.5' />
            Financial Analysis
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight'>
            Revenue Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Monitor platform earnings and subscription conversions.
          </p>
        </div>
        <div className='flex gap-3'>
          <Button className='shadow-primary/20 h-auto gap-2 rounded-lg bg-indigo-600 px-6 py-6 shadow-lg hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90'>
            <TrendingUp className='h-5 w-5' /> Detailed Report
          </Button>
        </div>
      </div>

      <div className='mb-10 grid grid-cols-1 gap-6 md:grid-cols-4'>
        {[
          {
            label: "Total Revenue",
            value: `$${financialStats.revenue.total.toLocaleString()}`,
            trend: "+2.4%",
            icon: DollarSign,
            color: "text-emerald-500",
          },
          {
            label: "Est. Monthly Revenue",
            value: `$${Math.round(financialStats.revenue.mrr).toLocaleString()}`,
            trend: "+1.2%",
            icon: TrendingUp,
            color: "text-blue-500",
          },
          {
            label: "Active Subscriptions",
            value: data.overview.users.total,
            trend: "+18%",
            icon: Users,
            color: "text-primary",
          },
          {
            label: "Avg Revenue/User",
            value: `$${Math.round(financialStats.revenue.total / data.overview.users.total)}`,
            trend: "-2%",
            icon: PieChart,
            color: "text-amber-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className='bg-card border-border/50 rounded-[2rem] border p-6 shadow-sm transition-all duration-300 hover:shadow-md'
          >
            <div
              className={`bg-muted/50 mb-4 w-fit rounded-lg p-2.5 ${stat.color}`}
            >
              <stat.icon className='h-5 w-5' />
            </div>
            <p className='text-muted-foreground mb-1 text-sm font-medium'>
              {stat.label}
            </p>
            <div className='flex items-end gap-2'>
              <span className='text-2xl font-bold tracking-tight'>
                {stat.value}
              </span>
              <span
                className={`mb-1 text-xs font-bold ${stat.trend.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}
              >
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 gap-10'>
        <div className='bg-card border-border/50 relative overflow-hidden rounded-[2.5rem] border p-8 shadow-xl'>
          {/* Background design */}
          <div className='absolute top-0 right-0 -mt-48 -mr-48 h-96 w-96 rounded-full bg-indigo-600 blur-[100px] hover:bg-indigo-700/5' />

          <div className='relative z-10'>
            <div className='mb-8 flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-bold tracking-tight'>
                  Revenue Trends
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Historical earnings across all subscription tiers.
                </p>
              </div>
              <div className='flex gap-2'>
                <Badge variant='outline' className='bg-background rounded-lg'>
                  Last 12 Months
                </Badge>
              </div>
            </div>

            <div className='h-[400px]'>
              <AnalyticsCharts
                growthData={data.series.userGrowth}
                revenueData={data.series.revenue}
                usageData={[]}
                hideGrowth={true}
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='bg-card border-border/50 rounded-[2rem] border p-8'>
            <h3 className='mb-6 text-xl font-bold tracking-tight'>
              Plan Concentration
            </h3>
            <div className='space-y-6'>
              {Object.entries(financialStats.plans).map(
                ([plan, count]: [string, any], i) => (
                  <div key={i} className='space-y-2'>
                    <div className='flex justify-between text-sm font-medium'>
                      <span className='capitalize'>{plan}</span>
                      <span>
                        {Math.round((count / data.overview.users.total) * 100)}%
                      </span>
                    </div>
                    <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
                      <div
                        className='h-full rounded-full bg-indigo-600 transition-all duration-500 hover:bg-indigo-700'
                        style={{
                          width: `${(count / data.overview.users.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className='from-primary/10 to-background border-primary/20 group relative flex flex-col justify-center overflow-hidden rounded-[2rem] border bg-gradient-to-br p-8 text-center'>
            <div className='absolute inset-0 bg-indigo-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-indigo-700/5' />
            <h3 className='mb-4 text-2xl font-bold tracking-tight'>
              Financial Health: Excellent
            </h3>
            <p className='text-muted-foreground mx-auto mb-8 max-w-sm'>
              The platform's revenue retention is currently at 94.2%. Conversion
              rates for the 'Pro' tier have increased by 8% this week.
            </p>
            <Button className='mx-auto w-fit rounded-xl px-10'>
              Optimize Pricing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
