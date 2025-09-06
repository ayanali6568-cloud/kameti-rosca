// npx ts-node prisma/seed.ts  (you may need ts-node installed)
import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main(){
  const password = await bcrypt.hash("Pass@123", 10)
  const users = await Promise.all(Array.from({length:33}).map((_,i)=>prisma.user.upsert({
    where: { email: `member${i+1}@mail.com` },
    update: {},
    create: { name: `Member ${i+1}`, email: `member${i+1}@mail.com`, password, role: Role.MEMBER }
  })))

  const admin = await prisma.user.upsert({
    where: { email: "admin@mail.com" },
    update: {},
    create: { name: "Admin", email: "admin@mail.com", password, role: Role.ADMIN }
  })

  const committee = await prisma.committee.create({
    data: {
      name: "Kameti 33 x 1000 AED",
      monthlyAmount: 1000,
      currency: "AED",
      memberCount: 33,
      startAt: new Date(),
      cycles: { create: [{ number: 1, startedAt: new Date() }] },
      memberships: {
        create: users.map((u,idx)=>({ userId: u.id, orderIndex: idx }))
      }
    }
  })

  console.log("Seeded:", { admin: admin.email, committee: committee.name })
}

main().finally(()=>prisma.$disconnect())
