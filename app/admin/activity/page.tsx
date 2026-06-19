"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiResponse } from "@/utils/apiResponse";
import { format } from "date-fns";
import { Activity, Clock, Download, Search, Trash2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // Using top-activities as the base data for now
        const res = await apiResponse.get("/admin/analytics/top-activities");
        setActivities(res.data.data);
      } catch (err) {
        console.error("Failed to fetch activity logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className='mx-auto max-w-7xl p-8 pb-20'>
      <div className='mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div className='flex items-center gap-4'>
          <div className='bg-indigo-600 hover:bg-indigo-700/10 text-primary rounded-2xl p-3'>
            <Activity className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Activity Logs</h1>
            <p className='text-muted-foreground text-sm'>
              Monitor system usage and user generation events in real-time.
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' className='gap-2'>
            <Download className='h-4 w-4' /> Export CSV
          </Button>
          <Button
            variant='destructive'
            className='cursor-not-allowed gap-2 opacity-50'
          >
            <Trash2 className='h-4 w-4' /> Clear Logs
          </Button>
        </div>
      </div>

      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        {[
          {
            label: "Generations Today",
            value: "1,284",
            trend: "+12%",
            icon: Zap,
          },
          {
            label: "Avg Execution Time",
            value: "3.2s",
            trend: "-0.4s",
            icon: Clock,
          },
          {
            label: "System Load",
            value: "Optimal",
            trend: "99.9%",
            icon: Activity,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className='bg-card border-border/50 flex items-center justify-between rounded-3xl border p-6'
          >
            <div className='space-y-1'>
              <p className='text-muted-foreground text-sm'>{stat.label}</p>
              <div className='flex items-center gap-2'>
                <span className='text-2xl font-bold'>{stat.value}</span>
                <span className='text-xs font-medium text-emerald-500'>
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className='bg-muted/50 rounded-xl p-2'>
              <stat.icon className='text-muted-foreground h-5 w-5' />
            </div>
          </div>
        ))}
      </div>

      <div className='bg-card border-border/50 overflow-hidden rounded-3xl border shadow-sm'>
        <div className='border-border/50 bg-muted/10 flex items-center gap-4 border-b p-6'>
          <div className='relative max-w-md flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Filter by event type or user...'
              className='bg-background h-10 rounded-xl pl-10'
            />
          </div>
          <div className='ml-auto flex items-center gap-1.5'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
            <span className='text-xs font-semibold tracking-wider uppercase'>
              Live Feed
            </span>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <Table>
            <TableHeader className='bg-muted/30'>
              <TableRow>
                <TableHead className='py-4 text-xs font-bold tracking-wider uppercase'>
                  Event Type
                </TableHead>
                <TableHead className='py-4 text-xs font-bold tracking-wider uppercase'>
                  Count
                </TableHead>
                <TableHead className='py-4 text-xs font-bold tracking-wider uppercase'>
                  Trend
                </TableHead>
                <TableHead className='py-4 text-xs font-bold tracking-wider uppercase'>
                  Last Activity
                </TableHead>
                <TableHead className='py-4 text-right text-xs font-bold tracking-wider uppercase'>
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className='animate-pulse'>
                      <TableCell colSpan={5}>
                        <div className='bg-muted/50 h-12 w-full rounded-xl' />
                      </TableCell>
                    </TableRow>
                  ))
                : activities.map((act, i) => (
                    <TableRow
                      key={i}
                      className='hover:bg-muted/10 group transition-colors'
                    >
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <div className='bg-background border-border/50 rounded-lg border p-1.5'>
                            <Zap className='text-primary h-3.5 w-3.5' />
                          </div>
                          <span className='text-sm font-semibold capitalize'>
                            {act.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className='font-medium'>{act.value}</span>
                      </TableCell>
                      <TableCell>
                        <span className='text-xs font-medium text-emerald-500'>
                          +{Math.floor(Math.random() * 20)}%
                        </span>
                      </TableCell>
                      <TableCell className='text-muted-foreground text-sm italic'>
                        Just now
                      </TableCell>
                      <TableCell className='text-right'>
                        <Badge className='border-none bg-emerald-500/10 px-2 py-0 text-[10px] font-bold text-emerald-500 uppercase'>
                          Successful
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
