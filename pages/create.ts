import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  const { name, monthlyAmount, memberCount, startAt } = req.body
  if (!name || !monthlyAmount || !memberCount || !startAt) return res.status(400).json({ error: "Missing fields" })

  const committee = await prisma.committee.create({
    data: {
      name,
      monthlyAmount: Number(monthlyAmount),
      memberCount: Number(memberCount),
      startAt: new Date(startAt),
      cycles: { create: [{ number: 1, startedAt: new Date(startAt) }] }
    }
  })

  res.json({ id: committee.id })
}
