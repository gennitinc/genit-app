"use client";

import { PricingDialog } from "../common/pricing-dialog";
// import { ProjectPreview } from "../community/project-preview";
import { SidebarProvider } from "../ui/sidebar";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useUrlState } from "@/hooks/use-url-state";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function Wrapper({ children }: { children: React.ReactNode }) {
  const { getUrlState } = useUrlState();
  const preview = getUrlState().getValue("gen");
  const checkout = getUrlState().getValue("checkout");
  const { user, updateUserPreferences } = useUserContext();
  const pathname = usePathname();
  const isChatIdPage = /^\/chat\/[^/]+$/.test(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(user?.preferences?.sidebarOpen ?? true);
  }, [user?._id, user?.preferences?.sidebarOpen]);

  useEffect(() => {
    setChatSidebarOpen(false);
  }, [pathname]);

  const handleSidebarOpenChange = useCallback(
    (open: boolean) => {
      setSidebarOpen(open);
      if (user) {
        void updateUserPreferences({ sidebarOpen: open }).catch(() =>
          setSidebarOpen(!open)
        );
      }
    },
    [user, updateUserPreferences]
  );

  // useEffect(() => {
  //   // Whitelist: Only show HEYO on these public/marketing pages
  //   const allowedRoutes = [
  //     "/", // Landing page
  //     "/pricing",
  //     "/company",
  //     "/contact",
  //     "/inspirations",
  //     "/suggest",
  //     "/legal/privacy-policy",
  //     "/legal/terms-of-service",
  //   ];

  //   const shouldShowHEYO = allowedRoutes.includes(pathName);

  //   // Only initialize HEYO on whitelisted routes
  //   if (shouldShowHEYO) {
  //     if (!heyoInitialized.current) {
  //       try {
  //         HEYO.init({
  //           projectId: "692eb61c3ad627090e630762",
  //         });
  //         heyoInitialized.current = true;
  //       } catch (error) {
  //         console.error("Failed to initialize HEYO:", error);
  //       }
  //     }
  //   } else {
  //     // Cleanup: Try to destroy/remove HEYO when navigating away
  //     if (heyoInitialized.current) {
  //       try {
  //         // Check if HEYO has a destroy method
  //         if (typeof (HEYO as any).destroy === "function") {
  //           (HEYO as any).destroy();
  //         }
  //         // Also try to remove the HEYO widget from DOM
  //         const heyoWidget = document.querySelector("[data-heyo-widget]");
  //         if (heyoWidget) {
  //           heyoWidget.remove();
  //         }
  //         // Remove any HEYO-related elements
  //         const heyoElements = document.querySelectorAll(
  //           '[id*="heyo"], [class*="heyo"], [data-heyo]'
  //         );
  //         heyoElements.forEach((el) => el.remove());
  //         heyoInitialized.current = false;
  //       } catch (error) {
  //         console.error("Failed to cleanup HEYO:", error);
  //         // Reset state even if cleanup fails
  //         heyoInitialized.current = false;
  //       }
  //     }
  //   }
  // }, [pathName]);

  return (
    <SidebarProvider
      open={isChatIdPage ? chatSidebarOpen : sidebarOpen}
      onOpenChange={isChatIdPage ? setChatSidebarOpen : handleSidebarOpenChange}
    >
      <div className='custom-scrollbar h-full w-full'>
        {children}

        {/* {preview && <ProjectPreview new />} */}
        <PricingDialog open={!!checkout} />
      </div>
    </SidebarProvider>
  );
}

export default Wrapper;
