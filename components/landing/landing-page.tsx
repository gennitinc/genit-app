"use client";
// import Communityproject from "../layout/community-project";

import TemplateGrid from "../common/templateGrid";
import { IdeaSection } from "../layout/idea-section";
import PartnerLogos from "./Partners-Logos";
import ContactCtaLanding from "./contact-cta-landing";
import { LandingAvatar } from "./landing-avatar";
import LandingPageBanner from "./landing-banner";
import LandingCommunityVideos from "./landing-community-videos";
import LandingCreator from "./landing-creator";
import { LandingFooter } from "./landing-footer";
import LandingHero from "./landing-hero";
import { LandingNavbar } from "./landing-navbar";
import { LandingVoiceClone } from "./landing-voice-clone";
import { Toaster } from "@/components/ui/sonner";

export function LandingPage() {
  return (
    <div className='flex min-h-screen w-full flex-col bg-white dark:bg-black'>
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
