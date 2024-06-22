"use server";

import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function createProduct(formData: FormData) {
  const rawFormData = {
    customerAPIkey: uuidv4().toString(),
    quota: formData.get("quota") as unknown as number,
    period: formData.get("period") as unknown as number,
    onSuccessURL: formData.get("onSuccessURL") as string,
    onFailURL: formData.get("onFailURL") as string,
    ownerId: formData.get("ownerId") as string,
  };
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User is not autenticathed");

    const product = await prisma.product.create({
      data: {
        customerAPIkey: rawFormData.customerAPIkey,
        quota: rawFormData.quota,
        period: rawFormData.period,
        onSuccessURL: rawFormData.onSuccessURL,
        onFailURL: rawFormData.onFailURL,
        ownerId: rawFormData.ownerId,
      },
    });
    if (!product) {
      throw new Error("Failed to create product");
    }
    return {
      success: true,
      message: "user uploaded",
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
