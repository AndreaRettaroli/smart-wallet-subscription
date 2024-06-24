import { createPublicClient } from "viem";
import { baseSepolia } from "viem/chains";
import { http, createConfig } from "wagmi";
import { createConfig as createZdConfig } from "@zerodev/waas"

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_URL),
  },
  ssr: true,
});

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_URL),
});

export const zdConfig = createZdConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_URL),
  },
  projectIds: {
    [baseSepolia.id]: process.env.NEXT_PUBLIC_PROJECT_ID!,
  },
});
