import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import Stripe from "stripe"
import { buffer } from "micro"

export const config = { api: { bodyParser: false } }

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  const sig = req.headers["stripe-signature"] as string
  const buf = await buffer(req)
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err:any) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const md = session.metadata || {}
    if (md.userId && md.committeeId && md.cycleId && md.monthIndex) {
      const committee = await prisma.committee.findUnique({ where: { id: md.committeeId } })
      if (committee) {
        await prisma.payment.upsert({
          where: {
            userId_committeeId_cycleId_monthIndex: {
              userId: md.userId,
              committeeId: md.committeeId,
              cycleId: md.cycleId,
              monthIndex: Number(md.monthIndex)
            }
          },
          update: { status: "succeeded", amount: committee.monthlyAmount, currency: committee.currency, stripeId: session.id },
          create: {
            userId: md.userId,
            committeeId: md.committeeId,
            cycleId: md.cycleId,
            monthIndex: Number(md.monthIndex),
            amount: committee.monthlyAmount,
            currency: committee.currency,
            status: "succeeded",
            stripeId: session.id
          }
        })
      }
    }
  }

  res.json({ received: true })
}
