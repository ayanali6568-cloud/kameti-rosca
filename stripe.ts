import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20", // Stripe ka latest supported API version
});

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const { amount } = req.body;

      // Stripe PaymentIntent create karo
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
      });

      return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }
}
