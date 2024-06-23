import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { parseSiweMessage } from "viem/siwe";
import { publicClient } from "./config";
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 15 * 24 * 24 * 30,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Wallet",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          // const valid = await publicClient.verifySiweMessage({
          //   message: credentials?.message!,
          //   signature: credentials?.signature! as `0x${string}`,
          // })
          const message = parseSiweMessage(credentials?.message!)
          if (//valid &&
             message.address) {
            return {
              id: message.address,  
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
};