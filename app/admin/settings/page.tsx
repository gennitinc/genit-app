"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Globe,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className='mx-auto max-w-5xl p-8 pb-20'>
      <div className='mb-10 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            <LocalizedText text={"Platform Settings"} />
          </h1>
          <p className='text-muted-foreground text-sm'>
            <LocalizedText
              text={
                "Configure global system parameters and administrative controls."
              }
            />
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className='h-11 gap-2 rounded-xl px-6'
        >
          {loading ? (
            <RefreshCw className='h-4 w-4 animate-spin' />
          ) : (
            <Save className='h-4 w-4' />
          )}
          <LocalizedText text={"Save Configuration"} />
        </Button>
      </div>

      <div className='space-y-8'>
        {/* General Settings */}
        <div className='bg-card border-border/50 rounded-3xl border p-8 shadow-sm'>
          <div className='mb-8 flex items-center gap-3'>
            <div className='text-primary rounded-xl bg-indigo-600 p-2.5 hover:bg-indigo-700/10'>
              <Globe className='h-5 w-5' />
            </div>
            <h2 className='text-xl font-bold'>
              <LocalizedText text={"General Configuration"} />
            </h2>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='siteName' className='text-sm font-semibold'>
                <LocalizedText text={"Platform Name"} />
              </Label>
              <Input
                id='siteName'
                defaultValue='Genit AI'
                className='bg-background border-border/50 h-11 rounded-xl'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='adminEmail' className='text-sm font-semibold'>
                <LocalizedText text={"System Notification Email"} />
              </Label>
              <Input
                id='adminEmail'
                defaultValue='admin@trygenit.com'
                className='bg-background border-border/50 h-11 rounded-xl'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='maintenance' className='text-sm font-semibold'>
                <LocalizedText text={"Maintenance Mode"} />
              </Label>
              <div className='border-border/40 bg-muted/20 flex items-center justify-between rounded-xl border p-3'>
                <span className='text-muted-foreground text-xs italic'>
                  <LocalizedText text={"Temporarily disable public access"} />
                </span>
                <Switch id='maintenance' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='registrations' className='text-sm font-semibold'>
                <LocalizedText text={"Allow New Signups"} />
              </Label>
              <div className='border-border/40 bg-muted/20 flex items-center justify-between rounded-xl border p-3'>
                <span className='text-muted-foreground text-xs italic'>
                  <LocalizedText text={"Enable user registration"} />
                </span>
                <Switch id='registrations' defaultChecked />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Performance */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='bg-card border-border/50 h-fit rounded-3xl border p-8 shadow-sm'>
            <div className='mb-8 flex items-center gap-3'>
              <div className='rounded-xl bg-amber-500/10 p-2.5 text-amber-500'>
                <Shield className='h-5 w-5' />
              </div>
              <h2 className='text-xl font-bold'>
                <LocalizedText text={"Security"} />
              </h2>
            </div>

            <div className='space-y-6'>
              <div className='group flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-sm font-semibold'>
                    <LocalizedText text={"Two-Factor Auth"} />
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    <LocalizedText text={"Require 2FA for admin logins"} />
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className='group flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-sm font-semibold'>
                    <LocalizedText text={"IP Whitelisting"} />
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    <LocalizedText text={"Restrict admin panel access"} />
                  </p>
                </div>
                <Switch />
              </div>
              <div className='group flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-sm font-semibold'>
                    <LocalizedText text={"Activity Logging"} />
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    <LocalizedText text={"Store detailed event history"} />
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className='bg-card border-border/50 h-fit rounded-3xl border p-8 shadow-sm'>
            <div className='mb-8 flex items-center gap-3'>
              <div className='rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500'>
                <Zap className='h-5 w-5' />
              </div>
              <h2 className='text-xl font-bold'>
                <LocalizedText text={"Performance"} />
              </h2>
            </div>

            <div className='space-y-6'>
              <div className='group flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-sm font-semibold'>
                    <LocalizedText text={"Deep Caching"} />
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    <LocalizedText text={"Cache generation results"} />
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className='group flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-sm font-semibold'>
                    <LocalizedText text={"CDN Integration"} />
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    <LocalizedText text={"Serve assets via edge nodes"} />
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className='group flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-sm font-semibold'>
                    <LocalizedText text={"Debug Mode"} />
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    <LocalizedText text={"Show detailed error logs"} />
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>

        {/* Global Limits */}
        <div className='rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 shadow-sm'>
          <div className='mb-6 flex items-center gap-3'>
            <div className='rounded-xl bg-rose-500/10 p-2.5 text-rose-500'>
              <AlertTriangle className='h-5 w-5' />
            </div>
            <h2 className='text-xl font-bold text-rose-500'>
              <LocalizedText text={"Critical Controls"} />
            </h2>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='hardLimit' className='text-sm font-semibold'>
                <LocalizedText text={"Global Generation Cap"} />
              </Label>
              <div className='flex gap-2'>
                <Input
                  id='hardLimit'
                  defaultValue='10000'
                  className='bg-background border-border/50 h-11 rounded-xl'
                />
                <Button variant='outline' className='h-11 rounded-xl'>
                  <LocalizedText text={"Update"} />
                </Button>
              </div>
              <p className='text-muted-foreground px-1 text-[10px] italic'>
                <LocalizedText
                  text={"Maximum generations allowed platform-wide per day."}
                />
              </p>
            </div>

            <div className='flex flex-col justify-end'>
              <Button
                variant='destructive'
                className='h-11 cursor-not-allowed rounded-xl opacity-50'
              >
                <LocalizedText text={"Reset System Metrics"} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
