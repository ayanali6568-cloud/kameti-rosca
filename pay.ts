import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import Stripe from "stripe"

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  const { id } = req.query
  const { userId, cycleId, monthIndex } = req.body

  const committee = await prisma.committee.findUnique({ where: { id: id as string } })
  if (!committee) return res.status(404).json({ error: "Committee not found" })

  const amount = committee.monthlyAmount

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.BASE_URL}/dashboard?success=1`,
    cancel_url: `${process.env.BASE_URL}/dashboard?canceled=1`,
    currency: "aed",
    line_items: [{
      price_data: { currency: "aed", product_data: { name: `${committee.name} — Month ${Number(monthIndex)+1}` }, unit_amount: amount * 100 },
      quantity: 1
    }],
    metadata: {
      committeeId: committee.id,
      userId,
      cycleId,
      monthIndex: String(monthIndex)
    }
  })

  res.json({ url: session.url })
}
