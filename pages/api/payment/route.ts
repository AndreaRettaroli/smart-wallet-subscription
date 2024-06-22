import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { createPayment } from "@/actions/payment/createPayment";

const prisma = new PrismaClient();

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        product: true,
        payments: true,
      },
    });

    for (const item of subscriptions) {
      if (
        //item.nextPaymentDate.toLocaleDateString() ===
        new Date().toLocaleDateString()
      ) {
        //I have to pay
        //TODO: implement payment function that use session id
        //payment auto update status of subscription
        const response = await createPayment({
          tx: "",
          subscriptionId: item.id,
        } as unknown as FormData);

        let nextPayment = new Date(
          new Date().setDate(new Date(item.nextPaymentDate ?? "").getDate() + 1)
        ); //as default retry to pay tomorrow
        if (response && response.success) {
          nextPayment = new Date(
            new Date().setDate(
              new Date(item.nextPaymentDate ?? "").getDate() +
                item.product.period
            )
          );
        }
        await prisma.subscription.update({
          where: { id: item.id },
          data: { nextPaymentDate: nextPayment },
        });
        console.log(
          `Subscription ${item.id} update result ${
            response && response.success
          }, next scheduled payment is for ${nextPayment.toLocaleString()}`
        );
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
