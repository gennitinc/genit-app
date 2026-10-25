"use client";
import { MainContent } from "@/components/layout/main-content";
import { DESIGN_TYPES } from "@/lib/design-types";
import { apiResponse } from "@/utils/apiResponse";
import { useRef } from "react";

function ChatPageForAuthenticatedUsers() {
  const scrapeStartedRef = useRef(false);

  const ScrapePinterest = async () => {
    if (scrapeStartedRef.current) return;
    scrapeStartedRef.current = true;

    const designType =
      DESIGN_TYPES[Math.floor(Math.random() * DESIGN_TYPES.length)];

    void apiResponse
      .get(
        `/designinspirations/scrape/pins/search?q=${encodeURIComponent(designType)}&limit=30&category=${designType}`
      )
      .catch((error) => console.error("Failed to scrape Pinterest:", error));
  };

  // useEffect(() => {
  //   ScrapePinterest();
  // }, []);

  return (
    <div
      id='main-content'
      className='mr-2 ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
      style={{
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <MainContent />
    </div>
  );
}

export default ChatPageForAuthenticatedUsers;
