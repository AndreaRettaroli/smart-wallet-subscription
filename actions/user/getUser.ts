"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getUser(formData: FormData) {
  const rawFormData = {
    address: formData.get("address") as string,
    email: formData.get("email") as string,
  };
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User is not autenticathed");

    // Check if a user with the given address or email already exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ address: rawFormData.address }, { email: rawFormData.email }],
      },
    });
    if (!user) {
      throw new Error("A user not found");
    }

    return {
      success: true,
      message: "user found",
      data: user,
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
