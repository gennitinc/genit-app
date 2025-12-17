"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }>;
}

interface ChartBlockProps {
  chartType: string;
  chartData: ChartData;
  config?: {
    title?: string;
    type?: string;
  };
  className?: string;
}

const CHART_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export function ChartBlock({
  chartType,
  chartData,
  config,
  className,
}: ChartBlockProps) {
  // Transform data for Recharts format
  const rechartsData = chartData.labels.map((label, index) => ({
    name: label,
    value: chartData.datasets[0]?.data[index] || 0,
    [chartData.datasets[0]?.label || "value"]:
      chartData.datasets[0]?.data[index] || 0,
  }));

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rechartsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={chartData.datasets[0]?.label || "value"}
                fill={CHART_COLORS[0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
      case "doughnut":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rechartsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  name && percent !== undefined
                    ? `${name} ${(percent * 100).toFixed(0)}%`
                    : ""
                }
                outerRadius={chartType === "doughnut" ? 80 : 100}
                innerRadius={chartType === "doughnut" ? 40 : 0}
                fill="#8884d8"
                dataKey="value"
              >
                {rechartsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rechartsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={chartData.datasets[0]?.label || "value"}
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rechartsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey={chartData.datasets[0]?.label || "value"}
                stroke={CHART_COLORS[0]}
                fill={CHART_COLORS[0]}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Unknown chart type
          </div>
        );
    }
  };

  return (
    <div className={cn("w-full h-full min-h-[300px] p-4", className)}>
      {config?.title && (
        <h3 className="text-lg font-semibold mb-4 text-center">
          {config.title}
        </h3>
      )}
      <div className="w-full h-[250px]">{renderChart()}</div>
    </div>
  );
}

