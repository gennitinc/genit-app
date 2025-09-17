"use client";

import { useUrlState } from "@/hooks/use-url-state";
// import { ProjectPreview } from "../community/project-preview";
import { SidebarProvider } from "../ui/sidebar";
import { PricingDialog } from "../common/pricing-dialog";

function Wrapper({ children }: { children: React.ReactNode }) {
  const { getUrlState } = useUrlState();
  const preview = getUrlState().getValue("gen");
  const checkout = getUrlState().getValue("checkout");

  return (
    
      <SidebarProvider defaultOpen={false}>
        <div className="h-full w-full custom-scrollbar">
          {children}

          {/* {preview && <ProjectPreview />} */}
          <PricingDialog open={!!checkout} />
        </div>
      </SidebarProvider>
  );
}

export default Wrapper;
