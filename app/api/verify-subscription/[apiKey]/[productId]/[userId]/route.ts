import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { apiKey, productId, userId } = req.query;
  if (
    typeof apiKey !== "string" &&
    typeof productId !== "string" &&
    typeof userId !== "string"
  ) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        productId: productId as string,
        userId: userId as string,
        product: {
          customerAPIkey: apiKey as string,
        },
      },
      include: {
        product: true,
      },
    });
    if (subscription)
      if (subscription.status === SubscriptionStatus.active) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    else {
      res.status(404).json("Invalid params");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
