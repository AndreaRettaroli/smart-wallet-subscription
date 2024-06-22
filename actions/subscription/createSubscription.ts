"use server";

import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function createSubscription(formData: FormData) {
  const rawFormData = {
    sessionKey: formData.get("onSuccessURL") as string,
    productId: formData.get("onSuccessURL") as string,
    userId: formData.get("onSuccessURL") as string,
  };
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User is not autenticathed");

    const subscription = await prisma.subscription.create({
      data: {
        sessionKey: rawFormData.sessionKey,
        productId: rawFormData.productId,
        userId: rawFormData.userId,
      },
    });
    if (!subscription) {
      throw new Error("Failed to create product");
    }
    return {
      success: true,
      message: "success",
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
