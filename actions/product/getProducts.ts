"use server";

import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function getProduct(ownerId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User is not autenticathed");
    // Check if a user with the given address or email already exists
    const products = await prisma.product.findMany({
      where: {
        ownerId: ownerId,
      },
    });
    if (!products) {
      throw new Error("Failed to fetch products");
    }
    return {
      success: true,
      data: products,
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
