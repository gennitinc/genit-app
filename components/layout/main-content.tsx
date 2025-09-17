"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { IdeaSection } from "./idea-section";
import HomeGrid from "../common/templateGrid";
import TemplateGrid from "../common/templateGrid";

export function MainContent() {
  return (
    <div className="w-full px-2 overflow-x-hidden sm:px-6 lg:px-8 py-8">
      <IdeaSection />
      {/* AI Team Features */}
      <TemplateGrid />

      {/* <HomeInfoGrid /> */}
    </div>
  );
}
