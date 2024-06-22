"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(formData: FormData) {
  const rawFormData = {
    address: formData.get("address") as string,
    email: formData.get("email") as string,
  };
  try {
    // Check if a user with the given address or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ address: rawFormData.address }, { email: rawFormData.email }],
      },
    });
    if (existingUser) {
      throw new Error("A user with this address or email already exists");
    }
    const user = await prisma.user.create({
      data: {
        address: rawFormData.address,
        email: rawFormData.email,
      },
    });
    if (!user) {
      throw new Error("Failed to create user");
    }
    return {
      success: true,
      message: "user uploaded",
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
