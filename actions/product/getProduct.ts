"use server";

import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function getProduct(productId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User is not autenticathed");
    // Check if a user with the given address or email already exists
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new Error("A product not found");
    }
    return {
      success: true,
      data: product,
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
