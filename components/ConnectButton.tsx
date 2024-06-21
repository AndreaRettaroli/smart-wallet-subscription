"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { baseSepolia } from "viem/chains";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { useAccount, useConnect, useConnectors, useSignMessage } from "wagmi";

export function ConnectButton() {
  const connectors = useConnectors();
  const { connect, isPending } = useConnect();
  const account = useAccount();

  if (!account.address) {
    return (
      <button
        disabled={isPending}
        onClick={() => {
          connect({ connector: connectors[0] });
        }}
      >
        {isPending ? "Connecting..." : "Create Smart Account"}
      </button>
    );
  }

  return (
    <div>
      <p>{account.address.slice(0, 4)}...</p>
      <Siwe />
    </div>
  );
}

function Siwe() {
  const { signMessageAsync, isPending } = useSignMessage();
  const { address, chain } = useAccount();
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!address) {
        throw new Error("Please connect wallet");
      }
      const callbackUrl = "/";
      const nonce = generateSiweNonce();
      const message = createSiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with " + chain?.name + " to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: baseSepolia.id,
        nonce: nonce,
      });
      const signature = await signMessageAsync({ message });
      const result = await signIn("credentials", {
        message,
        signature,
        redirect: false,
        callbackUrl,
      });
      result?.ok && router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (session) {
          signOut();
        } else {
          handleLogin();
        }
      }}
      className="btn btn-primary w-full"
      disabled={isPending || status === "loading"}
    >
      {!session ? "Sign-in" : "Sign-out"}
    </button>
  );
}
