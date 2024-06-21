"use client"
import { useAccount, useConnect, useConnectors } from 'wagmi'
 
export function ConnectButton() {
  const connectors = useConnectors();
  const { connect, isPending } = useConnect();
  const account = useAccount()
  
  if(!account.address) {
    return (
        <button
          disabled={isPending}
          onClick={() => {
            connect({ connector: connectors[0] })
          }} 
        >
          {isPending ? 'Connecting...' : 'Create Smart Account'}
        </button>
  )}

  return <div>{account.address.slice(0, 4)}...</div>
  
}