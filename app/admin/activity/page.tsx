"use client";

import { useEffect, useState } from "react";
import { apiResponse } from "@/utils/apiResponse";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Activity, Clock, Zap, Search, Download, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <div className="p-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
            <p className="text-muted-foreground text-sm">Monitor system usage and user generation events in real-time.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button variant="destructive" className="gap-2 opacity-50 cursor-not-allowed">
            <Trash2 className="w-4 h-4" /> Clear Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Generations Today", value: "1,284", trend: "+12%", icon: Zap },
          { label: "Avg Execution Time", value: "3.2s", trend: "-0.4s", icon: Clock },
          { label: "System Load", value: "Optimal", trend: "99.9%", icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-card border border-border/50 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs font-medium text-emerald-500">{stat.trend}</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-muted/50">
              <stat.icon className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50 flex items-center gap-4 bg-muted/10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by event type or user..." 
              className="pl-10 h-10 rounded-xl bg-background"
            />
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider">Live Feed</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Event Type</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Count</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Trend</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Last Activity</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={5}><div className="h-12 bg-muted/50 rounded-xl w-full" /></TableCell>
                  </TableRow>
                ))
              ) : activities.map((act, i) => (
                <TableRow key={i} className="hover:bg-muted/10 transition-colors group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-background border border-border/50">
                         <Zap className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="font-semibold text-sm capitalize">{act.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{act.value.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-emerald-500">+{Math.floor(Math.random() * 20)}%</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground italic">
                    Just now
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0 text-[10px] uppercase font-bold">
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
