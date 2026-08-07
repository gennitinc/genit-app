"use client";

import { LocalizedText } from "@/components/localized-text";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  hideGrowth = false,
}: AnalyticsChartsProps) => {
  return (
    <div
      className={cn(
        "mt-8 grid grid-cols-1 gap-6",
        !hideGrowth && "lg:grid-cols-2"
      )}
    >
      {/* Revenue & Growth Chart */}
      {!hideGrowth && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-card border-border/50 rounded-lg border p-6'
        >
          <h3 className='mb-6 flex items-center justify-between text-lg font-semibold'>
            <LocalizedText text={"Platform Growth"} />
            <span className='text-muted-foreground bg-muted rounded px-2 py-1 text-xs font-normal'>
              <LocalizedText text={"Last 30 Days"} />
            </span>
          </h3>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id='colorCount' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#88888820'
                />
                <XAxis
                  dataKey='_id'
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
                    fontSize: "12px",
                  }}
                />
                <Area
                  type='monotone'
                  dataKey='count'
                  stroke='#3b82f6'
                  strokeWidth={2}
                  fillOpacity={1}
                  fill='url(#colorCount)'
                  name='New Users'
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
        className='bg-card border-border/50 rounded-lg border p-6'
      >
        <h3 className='mb-6 text-lg font-semibold'>
          <LocalizedText text={"Feature Distribution"} />
        </h3>
        <div className='flex h-[300px] w-full items-center justify-center'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={usageData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey='count'
              >
                {usageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className='flex w-1/3 flex-col gap-2'>
            {usageData.map((item, index) => (
              <div key={item.name} className='flex items-center text-xs'>
                <div
                  className='mr-2 h-3 w-3 rounded-full'
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className='text-muted-foreground flex-1 truncate'>
                  {item.name}
                </span>
                <span className='ml-2 font-semibold'>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
