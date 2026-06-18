"use client";

import React from "react";
import { Activity } from "lucide-react";

export default function AIPage() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white">AI Recommendations</h2>
          <p className="text-sm text-muted-foreground">View your ai recommendations metrics and settings.</p>
        </div>
      </div>
      <div className="flex-grow border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
        <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-bold mb-2">Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          We are currently integrating deeper analytics for the visual flow. Check back later!
        </p>
      </div>
    </div>
  );
}
