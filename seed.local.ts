import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Admin password from .env
  const adminPasswordPlain = process.env.ADMIN_PASSWORD || "Pass@123"
  const adminPassword = await bcrypt.hash(adminPasswordPlain, 10)

  // Default password for members
  const memberPassword = await bcrypt.hash("Pass@123", 10)

  // 33 test members
  const users = await Promise.all(
    Array.from({ length: 33 }).map((_, i) =>
      prisma.user.upsert({
        where: { email: `member${i + 1}@mail.com` },
        update: {},
        create: {
          name: `Member ${i + 1}`,
          email: `member${i + 1}@mail.com`,
          password: memberPassword,
          role: Role.MEMBER,
        },
      })
    )
  )

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@mail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mail.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  // Committee with members
  const committee = await prisma.committee.create({
    data: {
      name: "Kameti 33 x 1000 AED",
      monthlyAmount: 1000,
      currency: "AED",
      memberCount: 33,
      startAt: new Date(),
      drawMethod: "fixed",
      cycles: {
        create: [
          {
            number: 1,
            startedAt: new Date(),
          },
        ],
      },
      memberships: {
        create: users.map((u, idx) => ({
          userId: u.id,
          orderIndex: idx,
        })),
      },
    },
    include: {
      memberships: true,
      cycles: true,
    },
  })

  console.log("✅ Seed completed")
  console.log("Admin email:", admin.email)
  console.log("Admin password (from .env):", adminPasswordPlain)
  console.log("Committee:", committee.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
