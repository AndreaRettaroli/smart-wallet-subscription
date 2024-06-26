"use server";

import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function getSubscription(subscriptionId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User is not autenticathed");
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
      },
    });
    if (!subscription) {
      throw new Error("A subscription not found");
    }
    return {
      success: true,
      data: subscription,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  } finally {
    await prisma.$disconnect();
  }
}
