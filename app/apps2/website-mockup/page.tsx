"use client";

import React, { useState } from "react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Globe,
  Upload,
  Play,
  Sparkles,
  Monitor,
  Smartphone,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WebsiteMockupPage = () => {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col text-foreground">
      <LandingPageBanner />
      <LandingNavbar />

      <main className="flex-grow pt-12 md:pt-20">
        
      </main>

      <LandingFooter />
    </div>
  );
};

export default WebsiteMockupPage;
