import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma, hasDb } from "@/lib/db";
const schema = z.object({ name: z.string().max(80).optional(), email: z.string().email(), password: z.string().min(8).max(200) });
export async function POST(req: Request) {
  if (!hasDb) return NextResponse.json({ error: "Sign-ups are temporarily unavailable (database not configured)." }, { status: 503 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and a password of at least 8 characters." }, { status: 400 });
  const email = parsed.data.email.toLowerCase().trim();
  if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  await prisma.user.create({ data: { email, name: parsed.data.name, passwordHash: await bcrypt.hash(parsed.data.password, 10), credits: 50 } });
  return NextResponse.json({ ok: true });
}
