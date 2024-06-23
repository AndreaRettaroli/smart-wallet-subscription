"use client";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { parseAbi } from "viem";
import { useWriteContracts } from "wagmi/experimental";
import { config } from "@/lib/config";

const tokenAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
// const abi = [
//   {
//     inputs: [
//       {
//         internalType: "address",
//         name: "from",
//         type: "address",
//       },
//       {
//         internalType: "address",
//         name: "to",
//         type: "address",
//       },
//       {
//         internalType: "uint256",
//         name: "value",
//         type: "uint256",
//       },
//     ],
//     name: "transferFrom",
//     outputs: [
//       {
//         internalType: "bool",
//         name: "",
//         type: "bool",
//       },
//     ],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ] as const;

const abi = parseAbi([
  "function approve(address, uint256) returns (bool)",
  "function transferFrom(address, address, uint256) returns (bool)",
]); //parseAbi(["function mint(address _to, uint256 amount) public"]);
const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL!;

export default function CreateSubscription() {
  const { address } = useAccount();
  const { data: session } = useSession();
  const { data, writeContracts, isPending } = useWriteContracts({ config });

  if (address && session)
    return (
      <div>
        <button
          disabled={isPending}
          onClick={() => {
            writeContracts({
              contracts: [
                {
                  address: tokenAddress,
                  abi,
                  functionName: "approve",
                  args: ["0x00000000002E3A39aFEf1132214fEee5a55ce127", 1],
                },
                {
                  address: tokenAddress,
                  abi: abi,
                  functionName: "transferFrom",
                  args: [
                    "0x00000000002e3a39afef1132214feee5a55ce127",
                    "0x383b14727ac2bd3923f1583789d5385c3a26f91e" as `0x${string}`,
                    1,
                  ], //from, to, ammount
                },
              ],
              capabilities: {
                paymasterService: {
                  url: paymasterUrl,
                },
              },
            });
          }}
        >
          {isPending ? "Subscribing..." : "Subscribe"}
        </button>
        {data && <p>{`UserOp Hash: ${data}`}</p>}
      </div>
    );

  return <></>;
}

//usdc basesepolia 0x036CbD53842c5426634e7929541eC2318f3dCF7e
