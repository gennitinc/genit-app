import Image from "next/image";
import {
  ArrowUpRight,
  Users,
  Briefcase,
  Zap,
  Trophy,
  Layers,
  Target,
  Clock,
  Globe,
  Award,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { HoverVideoPlayer } from "@/components/features/hover-video-player";

export default function About2() {
  return (
    <div className="dark:bg-black bg-white">
      <LandingNavbar />

              {/* <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                AI‑Powered {" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Design
                </span>
              </h1> */}
      {/* Hero Section with Timeline */}
      

    
      <LandingFooter />
    </div>
  );
}
