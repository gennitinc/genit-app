"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AspectRatio, Resolution } from "@/types/inspire";
import { useUserContext } from "@/context/AuthenticatedContext";
import { apiResponse } from "@/utils/apiResponse";
import { PremiumInput } from "@/components/ui/premium-input";

// ─── Main Page ────────────────────────────────────────────────────────────────
import {
  Loader2,
  Image as ImageIcon,
  Wand2,
  History,
  Users,
  ViewIcon,
  BookOpen,
  LayoutDashboard,
  Trash,
  Plus,
  Minus,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import withAuth from "@/helper/hoc/withAuth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IconTemplate } from "@tabler/icons-react";
import {
  ImageCommunityTab,
  ImagePreviewTab,
  ImageTemplatesTab,
  TutorialTab,
} from "@/components/inspire";
import { ImageHistoryTab } from "@/components/inspire/image-history-tab";
import { ModelSelector } from "@/components/inspire/model-selector";
import { Model } from "@/types/inspire";
import { imageGenApi } from "@/utils/inspire-api";
import { Toaster } from "@/components/ui/sonner";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  ASPECT_RATIOS,
  AspectRatioCard,
} from "@/components/video/resolution-selector";



function ImageGenerationPage() {

  return (
    <div className="relative w-full bg-white dark:bg-black">
      <Toaster />
      <LandingPageBanner />
      <LandingNavbar />
      <div
        id="main-content"
        className="flex-1 relative px-2 md:px-6 lg:px-20 mt-5"
      >
        <div className="bg-grid-black/[0.05] dark:bg-grid-white/[0.05] absolute inset-0 -z-10" />
       

        
      </div>

      <LandingFooter />
    </div>
  );
}



export default withAuth(ImageGenerationPage);
