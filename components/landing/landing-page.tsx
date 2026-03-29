"use client";
import { IdeaSection } from "../layout/idea-section";
import { LandingNavbar } from "./landing-navbar";
import { LandingFooter } from "./landing-footer";
import PartnerLogos from "./Partners-Logos";
// import Communityproject from "../layout/community-project";

import TemplateGrid from "../common/templateGrid";
import { Toaster } from "@/components/ui/sonner";
import LandingPageBanner from "./landing-banner";
import ContactCtaLanding from "./contact-cta-landing";
import LandingCreator from "./landing-creator";
import LandingHero from "./landing-hero";
import LandingCommunityVideos from "./landing-community-videos";
import { LandingAvatar } from "./landing-avatar";
import { LandingVoiceClone } from "./landing-voice-clone";

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex flex-col overflow-x-hidden">
      <Toaster />
      <LandingPageBanner />
      <LandingNavbar />
      <LandingHero />
      <LandingCommunityVideos />
      <LandingCreator />
      <LandingAvatar />
      <LandingVoiceClone />
      <PartnerLogos />
      <ContactCtaLanding />
      <LandingFooter />
    </div>
  );
}
