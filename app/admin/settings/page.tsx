"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Globe, Zap, Settings, Save, AlertTriangle, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground text-sm">Configure global system parameters and administrative controls.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="rounded-xl px-6 h-11 gap-2">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Configuration
        </Button>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="rounded-3xl bg-card border border-border/50 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">General Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-sm font-semibold">Platform Name</Label>
              <Input id="siteName" defaultValue="Gennit AI" className="h-11 rounded-xl bg-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="text-sm font-semibold">System Notification Email</Label>
              <Input id="adminEmail" defaultValue="admin@gennit.online" className="h-11 rounded-xl bg-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance" className="text-sm font-semibold">Maintenance Mode</Label>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20">
                <span className="text-xs text-muted-foreground italic">Temporarily disable public access</span>
                <Switch id="maintenance" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrations" className="text-sm font-semibold">Allow New Signups</Label>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20">
                <span className="text-xs text-muted-foreground italic">Enable user registration</span>
                <Switch id="registrations" defaultChecked />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-card border border-border/50 p-8 shadow-sm h-fit">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Security</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Two-Factor Auth</Label>
                  <p className="text-xs text-muted-foreground">Require 2FA for admin logins</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">IP Whitelisting</Label>
                  <p className="text-xs text-muted-foreground">Restrict admin panel access</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Activity Logging</Label>
                  <p className="text-xs text-muted-foreground">Store detailed event history</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border/50 p-8 shadow-sm h-fit">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Performance</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Deep Caching</Label>
                  <p className="text-xs text-muted-foreground">Cache generation results</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">CDN Integration</Label>
                  <p className="text-xs text-muted-foreground">Serve assets via edge nodes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between group">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Debug Mode</Label>
                  <p className="text-xs text-muted-foreground">Show detailed error logs</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>

        {/* Global Limits */}
        <div className="rounded-3xl bg-rose-500/5 border border-rose-500/20 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-rose-500">Critical Controls</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="hardLimit" className="text-sm font-semibold">Global Generation Cap</Label>
              <div className="flex gap-2">
                <Input id="hardLimit" defaultValue="10000" className="h-11 rounded-xl bg-background border-border/50" />
                <Button variant="outline" className="h-11 rounded-xl">Update</Button>
              </div>
              <p className="text-[10px] text-muted-foreground italic px-1">Maximum generations allowed platform-wide per day.</p>
            </div>
            
            <div className="flex flex-col justify-end">
               <Button variant="destructive" className="h-11 rounded-xl opacity-50 cursor-not-allowed">Reset System Metrics</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
