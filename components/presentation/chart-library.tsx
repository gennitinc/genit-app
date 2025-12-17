"use client";

import { useState, useMemo } from "react";
import {
  X,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Download,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }>;
}

interface ChartLibraryProps {
  onInsertChart: (chartType: string, chartData: ChartData, config: any) => void;
  onClose?: () => void;
  showHeader?: boolean;
}

type ChartType = "bar" | "pie" | "line" | "doughnut" | "area";

const CHART_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export function ChartLibrary({
  onInsertChart,
  onClose,
  showHeader = true,
}: ChartLibraryProps) {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartTitle, setChartTitle] = useState("");
  const [labels, setLabels] = useState("Q1, Q2, Q3, Q4");
  const [data, setData] = useState("100, 200, 150, 300");
  const [dataLabel, setDataLabel] = useState("Sales");

  const parsedLabels = useMemo(() => {
    return labels
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
  }, [labels]);

  const parsedData = useMemo(() => {
    return data
      .split(",")
      .map((d) => parseFloat(d.trim()))
      .filter((n) => !isNaN(n));
  }, [data]);

  const chartData: ChartData = useMemo(() => {
    const dataset: ChartData["datasets"][0] = {
      label: dataLabel || "Data",
      data: parsedData,
    };

    if (chartType === "pie" || chartType === "doughnut") {
      dataset.backgroundColor = CHART_COLORS.slice(0, parsedLabels.length);
    } else {
      dataset.backgroundColor = CHART_COLORS[0];
      dataset.borderColor = CHART_COLORS[0];
    }

    return {
      labels: parsedLabels,
      datasets: [dataset],
    };
  }, [parsedLabels, parsedData, dataLabel, chartType]);

  const handleInsert = () => {
    if (parsedLabels.length === 0 || parsedData.length === 0) {
      return;
    }

    onInsertChart(chartType, chartData, {
      title: chartTitle,
      type: chartType,
    });
  };

  const chartIcons = {
    bar: BarChart3,
    pie: PieChart,
    line: LineChart,
    doughnut: PieChart,
    area: TrendingUp,
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Header */}
      {showHeader && (
        <div className="p-4 pb-0 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10 dark:bg-purple-500/10">
                <BarChart3 className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Chart Library
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create data visualizations
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Chart Configuration */}
      <div className="flex-1 overflow-hidden px-4">
        <ScrollArea className="h-full">
          <div className="space-y-4 pb-4">
            {/* Chart Type Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Chart Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  ["bar", "pie", "line", "doughnut", "area"] as ChartType[]
                ).map((type) => {
                  const Icon = chartIcons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setChartType(type)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                        chartType === type
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-border hover:border-purple-500/50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs capitalize">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chart Title */}
            <div className="space-y-2">
              <Label htmlFor="chart-title" className="text-xs font-medium">
                Chart Title (Optional)
              </Label>
              <Input
                id="chart-title"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="e.g., Sales Overview"
                className="h-9 text-sm"
              />
            </div>

            {/* Labels */}
            <div className="space-y-2">
              <Label htmlFor="chart-labels" className="text-xs font-medium">
                Labels (comma-separated)
              </Label>
              <Input
                id="chart-labels"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                placeholder="Q1, Q2, Q3, Q4"
                className="h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground">
                {parsedLabels.length} label(s) detected
              </p>
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="chart-data" className="text-xs font-medium">
                Data Values (comma-separated)
              </Label>
              <Input
                id="chart-data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="100, 200, 150, 300"
                className="h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground">
                {parsedData.length} value(s) detected
              </p>
            </div>

            {/* Data Label */}
            <div className="space-y-2">
              <Label htmlFor="data-label" className="text-xs font-medium">
                Data Series Label
              </Label>
              <Input
                id="data-label"
                value={dataLabel}
                onChange={(e) => setDataLabel(e.target.value)}
                placeholder="Sales, Revenue, etc."
                className="h-9 text-sm"
              />
            </div>

            {/* Preview Info */}
            {parsedLabels.length > 0 && parsedData.length > 0 && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Preview</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    Type:{" "}
                    <span className="font-mono capitalize">{chartType}</span>
                  </p>
                  <p>
                    Data Points:{" "}
                    {Math.min(parsedLabels.length, parsedData.length)}
                  </p>
                  {chartTitle && <p>Title: {chartTitle}</p>}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Insert Button */}
      <div className="p-4 pt-0 border-t border-border flex-shrink-0">
        <Button
          onClick={handleInsert}
          className="w-full"
          size="sm"
          disabled={
            parsedLabels.length === 0 ||
            parsedData.length === 0 ||
            parsedLabels.length !== parsedData.length
          }
        >
          <Download className="w-4 h-4 mr-2" />
          Insert Chart
        </Button>
        {parsedLabels.length !== parsedData.length && (
          <p className="text-xs text-destructive mt-2 text-center">
            Number of labels must match number of data values
          </p>
        )}
      </div>
    </div>
  );
}
