import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, PLAN_CREDITS } from "@/lib/stripe";
import { prisma } from "@/lib/db";
export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "not configured" }, { status: 503 });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature")!, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return NextResponse.json({ error: "bad signature" }, { status: 400 }); }
  // Grant credits on each paid invoice (first payment + monthly renewals)
  if (event.type === "invoice.paid") {
    const inv = event.data.object as any;
    const meta = inv.parent?.subscription_details?.metadata || inv.subscription_details?.metadata || {};
    const plan = meta.plan as string; const userId = meta.userId as string;
    if (userId && PLAN_CREDITS[plan]) await prisma.user.update({ where: { id: userId }, data: { credits: { increment: PLAN_CREDITS[plan] }, plan } });
  }
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    if (sub.metadata?.userId) await prisma.user.update({ where: { id: sub.metadata.userId }, data: { plan: "free" } });
  }
  return NextResponse.json({ received: true });
}
