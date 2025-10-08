"use client";
import React from "react";
import { useEffect, useState } from "react";

const LandingPageBanner = () => {
  const [showBanner, setShowBanner] = useState<boolean>(true);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("lp_banner_dismissed");
      if (dismissed === "true") setShowBanner(false);
    } catch (_) {}
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    try {
      localStorage.setItem("lp_banner_dismissed", "true");
    } catch (_) {}
  };

  return (
    <div>
      {showBanner && (
        <div className="relative flex items-center px-2 justify-start md:items-center md:justify-center font-medium py-2 bg-gradient-to-r from-violet-500 via-[#560280] to-[#E0724A] text-sm text-white">
          <p>
            Exclusive Price Drop! Hurry, 🎉{" "}
            <span className="underline underline-offset-2 text-sm">
              Offer Ends Soon!
            </span>
          </p>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss banner"
            className="absolute right-3 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingPageBanner;
