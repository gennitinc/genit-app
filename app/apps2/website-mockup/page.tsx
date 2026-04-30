"use client";

import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Globe,
  Layers,
  Monitor,
  Play,
  Smartphone,
  Sparkles,
  Upload,
} from "lucide-react";
import React, { useState } from "react";

const WebsiteMockupPage = () => {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className='bg-background text-foreground flex min-h-screen w-full flex-col'>
      <LandingPageBanner />
      <LandingNavbar />

      <main className='flex-grow pt-12 md:pt-20'></main>

      <LandingFooter />
    </div>
  );
};

export default WebsiteMockupPage;
