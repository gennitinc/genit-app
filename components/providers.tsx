"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthenticatedContextProvider } from "@/context/AuthenticatedContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticatedContextProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem={false}
          disableTransitionOnChange
          storageKey='genit-theme'
        >
          {children}
        </ThemeProvider>
      </AuthenticatedContextProvider>
    </QueryClientProvider>
  );
}
