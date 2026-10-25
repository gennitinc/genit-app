"use client";

import { AppSidebar } from "./app-sidebar";
import TopNavWithAurora from "./top-nav-with-aurora";
import { useUserContext } from "@/context/AuthenticatedContext";
import withAuth from "@/helper/hoc/withAuth";
import { usePathname } from "next/navigation";
import { useRef } from "react";

function AuthenticatedWorkspace({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className='scroll-container flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto will-change-scroll'
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <main className='flex min-h-0 flex-1 flex-col'>{children}</main>
      </div>
    </div>
  );
}

const ProtectedWorkspace = withAuth(AuthenticatedWorkspace);

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, user } = useUserContext();

  if (pathname === "/plugins" && !loading && !user) return children;

  return <ProtectedWorkspace>{children}</ProtectedWorkspace>;
}
