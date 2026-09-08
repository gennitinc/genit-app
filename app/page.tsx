import { LandingPage } from "@/components/landing/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Genit AI Marketing Platform | Agents, Automation & Campaigns",
  description:
    "Plan, create, automate, publish, communicate, and optimize with AI marketing agents, workflows, campaigns, content tools, analytics, and 1,000+ integrations.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Genit AI Marketing Platform | Your Autonomous Marketing Team",
    description:
      "Move from a marketing goal to real execution with brand-aware AI agents and connected workflows.",
    url: "/",
  },
};

function Page() {
  return <LandingPage />;
}

export default Page;
