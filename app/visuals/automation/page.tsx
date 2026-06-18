"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { GradientFrame } from "@/utils/gradient-frame";

export default function AutomationPage() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white">Automation Rules</h2>
          <p className="text-sm text-muted-foreground">Toggle what AI is allowed to do autonomously.</p>
        </div>
      </div>
      
      <div className='group relative overflow-hidden  bg-black/[0.02] p-6 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10 md:p-8 flex flex-col md:flex-row gap-8'>
        <GradientFrame />
        <div className="w-full md:w-1/2 relative z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10 transition-shadow hover:shadow-md">
            <div>
              <p className="font-bold text-foreground dark:text-white mb-1">Content Generation</p>
              <p className="text-xs text-muted-foreground dark:text-white/60">AI automatically drafts posts based on trending topics.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10 transition-shadow hover:shadow-md">
            <div>
              <p className="font-bold text-foreground dark:text-white mb-1">Auto-Publishing</p>
              <p className="text-xs text-muted-foreground dark:text-white/60">Schedule and publish approved drafts without asking.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-[#0a0a0a] dark:ring-white/10 transition-shadow hover:shadow-md opacity-70">
            <div>
              <p className="font-bold text-foreground dark:text-white mb-1">Ticket Resolution</p>
              <p className="text-xs text-muted-foreground dark:text-white/60">AI replies to standard customer inquiries instantly.</p>
            </div>
            <Switch />
          </div>
        </div>
        <div className="w-full md:w-1/2 relative min-h-[300px] rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-lg">
          <img 
            src="https://i.pinimg.com/1200x/a6/fc/f2/a6fcf20b09a6abfbd40522e45583fb91.jpg" 
            alt="Automation Visuals" 
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/60 to-transparent z-0 flex flex-col justify-end p-6">
            <h4 className="text-white font-bold text-xl mb-1 z-10">AI at Work</h4>
            <p className="text-white/80 text-sm z-10">Over 240 hours saved this month.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
