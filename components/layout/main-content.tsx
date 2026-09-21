"use client";

import DesignType from "../chat/designType";
import HomeGrid from "../common/templateGrid";
import TemplateGrid from "../common/templateGrid";
import CommunityComp from "../landing/CommunityComp";
import { IdeaSection } from "./idea-section";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MainContent() {
  return (
    <div className='w-full overflow-x-hidden py-8 sm:px-2 lg:px-8'>
      <div className='relative flex w-full flex-col items-center justify-center'>
        <IdeaSection />
      </div>

      {/* AI Team Features */}
      <div className='lg:mt-0'>
        <CommunityComp filter />
      </div>

      {/* <HomeInfoGrid /> */}
    </div>
  );
}
