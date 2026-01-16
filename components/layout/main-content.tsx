"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { IdeaSection } from "./idea-section";
import HomeGrid from "../common/templateGrid";
import TemplateGrid from "../common/templateGrid";
import DesignType from "../chat/designType";
import CommunityComp from "../landing/CommunityComp";

export function MainContent() {
  return (
    <div className="w-full  overflow-x-hidden sm:px-6 lg:px-8 py-8">
      <div className="md:mt-10 lg:mt-20 px-2">
        <IdeaSection />
      </div>

      {/* AI Team Features */}
      <div className="mt-10">
        <CommunityComp />
      </div>

      {/* <HomeInfoGrid /> */}
    </div>
  );
}
