import { passkeyConnector } from '@zerodev/wallet'
import { createPublicClient } from 'viem';
import { baseSepolia } from 'viem/chains'; 
import { http, createConfig } from 'wagmi'
 
export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    passkeyConnector(process.env.NEXT_PUBLIC_PROJECT_ID!, baseSepolia, "v3", "zerodev_quickstart")
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true
})

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_URL)
})