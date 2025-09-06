# Kameti / Committee (ROSCA) Starter — Next.js + Prisma + Stripe

This is a minimal starter kit for running a rotating savings (committee / ROSCA) app with:
- User logins and roles (admin/member) via NextAuth Credentials (simple mock, replace with a real provider later).
- Committee config (e.g., 33 users × 1000 AED per month).
- Payment collection via Stripe Checkout.
- Webhook to record successful payments.
- Basic dashboard to see "how much each member has paid" and current cycle status.

> ⚠️ Important
> - This is an MVP for **education and prototyping**. Before taking real money, consult a qualified lawyer in your jurisdiction (UAE) and a PCI/fintech specialist. Consider licensing requirements for collective savings and payouts. Use **Stripe Connect** for automated payouts to members if/when allowed.
> - Replace demo auth with production-ready auth and harden all API routes.
> - Run behind HTTPS and store secrets only in environment variables.

## Stack
- Next.js (Pages Router)
- Prisma + SQLite (easy local dev) — switch to Postgres/MySQL in production
- NextAuth (Credentials) — swap to email/OTP or OAuth as needed
- Stripe Checkout + Webhooks

## Quick Start

1) **Install deps**
```bash
npm install
```

2) **Env vars**
Copy `.env.example` to `.env.local` and fill:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-me"
STRIPE_SECRET_KEY="sk_live_or_test"
STRIPE_PRICE_AED_1000="price_xxx"  # optional if you create a Stripe Price
STRIPE_WEBHOOK_SECRET="whsec_xxx"
BASE_URL="http://localhost:3000"
```

> To create a product/price in Stripe (AED 1000/month), you can do it in the Stripe Dashboard and paste the Price ID into `STRIPE_PRICE_AED_1000`.

3) **Prisma db**
```bash
npx prisma migrate dev --name init
```

4) **Run**
```bash
npm run dev
```

5) **Stripe webhook (local)**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Paste the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Core Concepts

- **Committee** = configuration for a ROSCA group (name, monthlyAmount, memberCount, startAt, drawMethod).
- **Cycle** = one full round where each member gets a lump sum once.
- **Payment** = a member's monthly payment for a given cycle month.
- **Payout** = the month a member receives the pooled amount.

The MVP supports a **fixed monthly amount** (e.g., 1000 AED) and a **fixed roster** (e.g., 33 members). You can adapt for auctions/bidding later.

## Payment Flow

1. Member hits **Pay** on the dashboard for the current month.
2. Server creates a **Stripe Checkout Session** for AED 1000 (or remaining balance).
3. On success, Stripe calls our **webhook**, which records a `Payment` row and marks the month as paid for that member.
4. Admin view shows who's paid/not paid and who is slated for the current **Payout**.

## UAE Notes (non-legal)
- Stripe supports AED and UAE cards. For **member-to-member payouts**, evaluate **Stripe Connect (Express)** to transfer funds to recipients. Otherwise, funds land in the organizer’s Stripe account, and payouts are handled off-platform.
- Avoid storing raw card data; **never** log secrets. Use Stripe Checkout/Elements only.

## Roadmap
- Role-based email/OTP auth, audit logs
- Admin controls for creating/locking committees and draws (random, fixed, or need-based)
- Late fees, receipts, export to CSV, WhatsApp/email reminders
- Stripe Connect for automated member payouts
- Multi-committee support per admin

---

Happy building!
