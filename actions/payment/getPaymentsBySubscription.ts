"use server";

import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function getPaymentsBySubscription(subscriptionId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User is not autenticathed");
    const payment = await prisma.payment.findMany({
      where: {
        id: subscriptionId,
      },
    });
    if (!payment) {
      throw new Error("Failed to fetch payments");
    }
    return {
      success: true,
      data: payment,
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
