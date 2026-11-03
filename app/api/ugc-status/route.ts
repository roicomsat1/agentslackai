import { NextResponse } from "next/server";
import { currentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { heygenStatus } from "@/lib/media";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const id = new URL(req.url).searchParams.get("video_id") || "";
  const owns = await prisma.generation.findFirst({ where: { userId: user.id, input: { path: ["heygenVideoId"], equals: id } }, select: { id: true } });
  if (!owns || !process.env.HEYGEN_API_KEY) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(await heygenStatus(id));
}
