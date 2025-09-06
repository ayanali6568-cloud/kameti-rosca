import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  const { name, email, password, role } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" })
  const hashed = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role === "ADMIN" ? Role.ADMIN : Role.MEMBER }
    })
    res.json({ id: user.id })
  } catch (e:any) {
    res.status(400).json({ error: e.message })
  }
}
