"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnalyticsChartsProps {
  growthData: any[];
  revenueData: any[];
  usageData: any[];
  hideGrowth?: boolean;
}

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

export const AnalyticsCharts = ({ 
  growthData, 
  revenueData, 
  usageData,
  hideGrowth = false 
}: AnalyticsChartsProps) => {
  return (
    <div className={cn(
      "grid grid-cols-1 gap-6 mt-8",
      !hideGrowth && "lg:grid-cols-2"
    )}>
      {/* Revenue & Growth Chart */}
      {!hideGrowth && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
            Platform Growth
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">Last 30 Days</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#888888" }} 
                  minTickGap={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#888888" }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  name="New Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Feature Usage (Pie Chart) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border border-border/50"
      >
        <h3 className="text-lg font-semibold mb-6">Feature Distribution</h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={usageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {usageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="w-1/3 flex flex-col gap-2">
            {usageData.map((item, index) => (
              <div key={item.name} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-muted-foreground truncate flex-1">{item.name}</span>
                <span className="font-semibold ml-2">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
