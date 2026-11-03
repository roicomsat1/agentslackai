import Stripe from "stripe";
export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
export const PRICE_IDS: Record<string, string | undefined> = { starter: process.env.STRIPE_PRICE_STARTER, pro: process.env.STRIPE_PRICE_PRO, growth: process.env.STRIPE_PRICE_GROWTH };
export const PLAN_CREDITS: Record<string, number> = { starter: 500, pro: 2000, growth: 10000 };
