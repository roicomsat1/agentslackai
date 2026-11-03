import { NextResponse } from "next/server";
import { prisma, hasDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  let db = hasDb ? "configured" : "missing";
  if (hasDb) { try { await prisma.$queryRaw`SELECT 1`; db = "ok"; } catch { db = "error"; } }
  return NextResponse.json({ ok: true, db, ai: Boolean(process.env.OPENAI_API_KEY), stripe: Boolean(process.env.STRIPE_SECRET_KEY), auth: Boolean(process.env.AUTH_SECRET) });
}
