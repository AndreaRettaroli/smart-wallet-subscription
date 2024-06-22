"use server";

import { authOptions } from "@/lib/auth";
import { PrismaClient, SubscriptionStatus } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function createPayment(formData: FormData) {
  const rawFormData = {
    tx: formData.get("tx") as string,
    subscriptionId: formData.get("subscriptionId") as string,
  };
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User is not autenticathed");

    const payment = await prisma.payment.create({
      data: {
        tx: rawFormData.tx,
        subscriptionId: rawFormData.subscriptionId,
      },
    });
    if (!payment) {
      await prisma.subscription.update({
        where: {
          id: rawFormData.subscriptionId,
        },
        data: {
          status: SubscriptionStatus.interrupted,
        },
      });
      throw new Error("Failed to create payment, subscription interrupted");
    }
    return {
      success: true,
      message: "success",
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
