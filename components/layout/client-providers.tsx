"use client";

import Wrapper from "@/components/layout/wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthenticatedContextProvider } from "@/context/AuthenticatedContext";
import { ProjectProvider } from "@/context/DesignProject";
import { LanguageProvider } from "@/context/LanguageContext";
import MixpanelProvider from "@/provider/MixpanelProver";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, useState } from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider
          clientId={
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
            process.env.NEXT_PUBLIC_GG_APP_ID ||
            ""
          }
        >
          <AuthenticatedContextProvider>
            <LanguageProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='dark'
                enableSystem
                disableTransitionOnChange
                storageKey='genit-theme'
              >
                <ProjectProvider>
                  <Wrapper>
                    {children}
                    <Suspense fallback={null}>
                      <MixpanelProvider />
                    </Suspense>
                  </Wrapper>
                </ProjectProvider>
              </ThemeProvider>
            </LanguageProvider>
            <Toaster />
          </AuthenticatedContextProvider>
        </GoogleOAuthProvider>
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </TooltipProvider>
  );
}
