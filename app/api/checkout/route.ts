import { NextResponse } from "next/server";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { currentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/agents";
export async function POST(req: Request) {
  const form = await req.formData();
  const plan = String(form.get("plan") || "");
  const user = await currentUser();
  if (!user) return NextResponse.redirect(new URL(`/signup?plan=${plan}`, req.url), 303);
  const price = PRICE_IDS[plan];
  if (!stripe || !price) return NextResponse.redirect(new URL(`/dashboard/billing?error=stripe`, req.url), 303);
  let customer = user.stripeCustomerId;
  if (!customer) {
    const c = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
    customer = c.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customer } });
  }
  const base = new URL(req.url).origin || SITE_URL;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription", customer, line_items: [{ price, quantity: 1 }],
    metadata: { userId: user.id, plan }, subscription_data: { metadata: { userId: user.id, plan } },
    success_url: `${base}/dashboard/billing?success=1`, cancel_url: `${base}/pricing`,
  });
  return NextResponse.redirect(session.url!, 303);
}
