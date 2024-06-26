"use server";

import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function getSubscriptionsByProduct(productId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User is not autenticathed");
    const subscriptions = await prisma.subscription.findMany({
      where: {
        productId: productId,
      },
    });
    if (!subscriptions) {
      throw new Error("Failed to fetch subscriptions");
    }
    return {
      success: true,
      data: subscriptions,
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
