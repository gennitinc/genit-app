import { pricingCurrencyForCountry } from "@/lib/pricing-currency";
// import Communityproject from "../layout/community-project";
import TemplateGrid from "../common/templateGrid";
import { IdeaSection } from "../layout/idea-section";
import PricingComponent from "../pricing/page";
import LandingTestimonials from "./LandingTestimonials";
import LandinngIntegrations from "./LandinngIntegrations";
import PartnerLogos from "./Partners-Logos";
import ContactCtaLanding from "./contact-cta-landing";
import { LandingAvatar } from "./landing-avatar";
import LandingPageBanner from "./landing-banner";
import LandingBrandDNA from "./landing-brand-dna";
import LandingCommunityVideos from "./landing-community-videos";
import LandingCreator from "./landing-creator";
import { LandingFooter } from "./landing-footer";
import LandingHero from "./landing-hero";
import { LandingNavbar } from "./landing-navbar";
import LandingUnifiedInbox from "./landing-unified-inbox";
import { LandingVoiceClone } from "./landing-voice-chat";
import { Toaster } from "@/components/ui/sonner";

export function LandingPage() {
  const pricingCurrency = pricingCurrencyForCountry(null);

  return (
    <div className='min-h-screen w-full bg-white dark:bg-black'>
      <Toaster />
      {/* <LandingPageBanner /> */}
      <LandingNavbar />
      <div className='w-full overflow-x-hidden'>
        <LandingHero />
        <LandingBrandDNA />
        <LandinngIntegrations />
        <LandingUnifiedInbox />
        <LandingVoiceClone />
        <LandingCreator />
        <PricingComponent pricingCurrency={pricingCurrency} />
        <LandingTestimonials />
        <ContactCtaLanding />
        <LandingFooter />
      </div>
    </div>
  );
}
