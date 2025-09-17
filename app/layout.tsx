"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react"; // Added import for React
import { Toaster } from "@/components/ui/sonner";
import { AuthenticatedContextProvider } from "@/context/AuthenticatedContext";
import { ThemeProvider } from "@/components/theme-provider";
import Wrapper from "@/components/layout/wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import Loading from "@/utils/Loading";
import { ProjectProvider } from "@/context/DesignProject";
const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Gennit Ai",
  description: "Generate modern web apps with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} custom-scrollbar`}>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <AuthenticatedContextProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
                // storageKey="gennit-theme"
              >
                <ProjectProvider>
                
                      <Suspense
                        fallback={
                          <div className="h-screen flex flex-col items-center justify-center">
                            <Loading />
                          </div>
                        }
                      >
                        <Wrapper>{children}</Wrapper>
                      </Suspense>
                </ProjectProvider>
              </ThemeProvider>
              <Toaster />
            </AuthenticatedContextProvider>

            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
