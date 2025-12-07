"use client";

import { useUrlState } from "@/hooks/use-url-state";
// import { ProjectPreview } from "../community/project-preview";
import { SidebarProvider } from "../ui/sidebar";
import { PricingDialog } from "../common/pricing-dialog";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import HEYO from "@heyo.so/js";

function Wrapper({ children }: { children: React.ReactNode }) {
  const { getUrlState } = useUrlState();
  const preview = getUrlState().getValue("gen");
  const checkout = getUrlState().getValue("checkout");

  const pathName = usePathname();

  useEffect(() => {
    if (pathName != "/chat" && pathName !== "/chat/") {
      HEYO.init({
        projectId: "692eb61c3ad627090e630762",
      });
    }
  }, [pathName]);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="h-full w-full custom-scrollbar">
        {children}

        {/* {preview && <ProjectPreview new />} */}
        <PricingDialog open={!!checkout} />
      </div>
    </SidebarProvider>
  );
}

export default Wrapper;
