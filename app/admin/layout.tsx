"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { SidebarInset } from "@/components/ui/sidebar";
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20" />
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If not admin after loading, the redirect will handle it
  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden h-screen overflow-y-scroll">
      <AdminSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
        <AdminTopNav />
        <main className="flex-1 overflow-y-auto py-10 custom-scrollbar px-2 md:px-6 lg:px-10">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
