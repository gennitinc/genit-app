"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { LocalizedText } from "@/components/localized-text";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUserContext } from "@/context/AuthenticatedContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUserContext();
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, []);

  // Protect the admin route
  useEffect(() => {
    if (!loading && !isMounting && (!user || user.role !== "admin")) {
      redirect("/apps");
    }
  }, [user, loading, isMounting]);

  if (loading || isMounting) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='flex animate-pulse flex-col items-center gap-4'>
          <div className='h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700/20' />
          <p className='text-muted-foreground text-sm'>
            <LocalizedText text={"Verifying admin access..."} />
          </p>
        </div>
      </div>
    );
  }

  // If not admin after loading, the redirect will handle it
  if (!user || user.role !== "admin") return null;

  return (
    <SidebarProvider defaultOpen>
      <div className='bg-background text-foreground flex h-screen min-h-screen w-full overflow-hidden overflow-y-scroll'>
        <AdminSidebar />
        <SidebarInset className='flex flex-1 flex-col overflow-hidden transition-all duration-300'>
          <AdminTopNav />
          <main className='custom-scrollbar flex-1 overflow-y-auto px-2 py-10 md:px-6 lg:px-10'>
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
