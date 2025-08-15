import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId, paymentMethodId, trialDays } = await req.json()

    if (!planId || !paymentMethodId) {
      return NextResponse.json({ error: "Plan ID and payment method required" }, { status: 400 })
    }

    // Create subscription
    const subscription = await createSubscription({
      userId: session.user.id,
      planId,
      paymentMethodId,
      trialDays,
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscriptions = await Database.getUserSubscriptions(session.user.id)
    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("Get subscriptions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function createSubscription(params: {
  userId: string
  planId: string
  paymentMethodId: string
  trialDays?: number
}) {
  const { userId, planId, paymentMethodId, trialDays = 0 } = params

  const now = new Date()
  const trialEnd = trialDays > 0 ? new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000) : null
  const periodStart = trialEnd || now
  const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const subscription = {
    id: `sub-${Date.now()}`,
    userId,
    planId,
    status: trialDays > 0 ? "trialing" : "active",
    currentPeriodStart: periodStart.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    trialStart: trialDays > 0 ? now.toISOString() : undefined,
    trialEnd: trialEnd?.toISOString(),
    cancelAtPeriodEnd: false,
    metadata: { paymentMethodId },
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }

  // Save to database
  await Database.saveSubscription(subscription)

  // Create initial invoice if not in trial
  if (trialDays === 0) {
    await createInitialInvoice(subscription)
  }

  return subscription
}

async function createInitialInvoice(subscription: any) {
  const plan = await Database.getPlan(subscription.planId)
  if (!plan) throw new Error("Plan not found")

  const invoice = {
    id: `inv-${Date.now()}`,
    subscriptionId: subscription.id,
    userId: subscription.userId,
    amount: plan.price,
    currency: plan.currency,
    status: "open",
    dueDate: subscription.currentPeriodStart,
    items: [
      {
        id: `item-${Date.now()}`,
        description: `${plan.name} - Monthly Subscription`,
        quantity: 1,
        unitPrice: plan.price,
        amount: plan.price,
        metadata: { planId: plan.id },
      },
    ],
    tax: 0,
    discount: 0,
    total: plan.price,
    paymentAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await Database.saveInvoice(invoice)
  return invoice
}
