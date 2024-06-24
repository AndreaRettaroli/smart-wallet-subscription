"use client";
import {
  useCreateKernelClientEOA,
  useCreateKernelClientPasskey,
  useDisconnectKernelClient,
  useKernelClient,
} from "@zerodev/waas";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { useAccount, useConnect, useConnectors, useSignMessage } from "wagmi";

export function ConnectButton() {
  const { address } = useKernelClient();
  const { disconnect } = useDisconnectKernelClient();

  if (!address) {
    return (
      <div className="flex space-x-3">
        <EOA />
        <Passkey />
      </div>
    );
  }

  return (
    <div>
      <p>{address}</p>
      <button onClick={() => disconnect}>Disconnect</button>
      {/* <Siwe /> */}
    </div>
  );
}

function Passkey() {
  const { connectLogin, error } = useCreateKernelClientPasskey({
    version: "v3",
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  useEffect(() => {
    if (error) {
      setIsLoginLoading(false);
    }
  }, [error]);
  return (
    <>
    <button
      disabled={isLoginLoading}
      onClick={() => {
        connectLogin();
        setIsLoginLoading(true);
      }}
    >
      pass
    </button>
    <p>{error?.message}</p>
    </>
  );
}

function EOA() {
  const { connect, isPending, error } = useCreateKernelClientEOA({ version: "v3" });
  const connectors = useConnectors();
  if(error) {
    console.log(error)
  }
  return (
    <>
      <button
        //disabled={isPending}
        onClick={() => {
          //console.log(connectors[0].id);
          connect({ connector: connectors[0] });
        }}
      >
        {connectors[0]?.name}
      </button>
      <p>{error?.details}</p>
    </>
  );
}

// function Siwe() {
//   const { signMessageAsync, isPending } = useSignMessage();
//   const { address, chain } = useAccount();
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       if (!address) {
//         throw new Error("Please connect wallet");
//       }
//       const callbackUrl = "/";
//       const nonce = generateSiweNonce();
//       const message = createSiweMessage({
//         domain: window.location.host,
//         address: address,
//         statement: "Sign in with " + chain?.name + " to the app.",
//         uri: window.location.origin,
//         version: "1",
//         chainId: baseSepolia.id,
//         nonce: nonce,
//       });
//       const signature = await signMessageAsync({ message });
//       const result = await signIn("credentials", {
//         message,
//         signature,
//         redirect: false,
//         callbackUrl,
//       });
//       result?.ok && router.refresh();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <button
//       onClick={(e) => {
//         e.preventDefault();
//         if (session) {
//           signOut();
//         } else {
//           handleLogin();
//         }
//       }}
//       className="btn btn-primary w-full"
//       disabled={isPending || status === "loading"}
//     >
//       {!session ? "Sign-in" : "Sign-out"}
//     </button>
//   );
// }
