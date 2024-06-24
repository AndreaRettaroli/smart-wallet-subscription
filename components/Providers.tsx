"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config, zdConfig } from "@/lib/config";
import { SessionProvider } from "next-auth/react";
import { ZeroDevProvider } from "@zerodev/waas";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ZeroDevProvider config={zdConfig}>{children}</ZeroDevProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}
