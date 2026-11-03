import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { getAgent } from "@/lib/agents";
export const maxDuration = 60;
const schema = z.object({ agent: z.string(), niche: z.string().min(2).max(300), audience: z.string().max(300).default(""), tone: z.string().max(100).default("Friendly"), goals: z.string().max(1000).default(""), platform: z.string().max(60).default("Instagram") });
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Please fill in your niche/business." }, { status: 400 });
  const input = parsed.data;
  const agent = getAgent(input.agent);
  if (!agent) return NextResponse.json({ error: "Unknown agent." }, { status: 404 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "AI is not configured yet." }, { status: 503 });
  // Reserve credits atomically
  const reserved = await prisma.user.updateMany({ where: { id: user.id, credits: { gte: agent.credits } }, data: { credits: { decrement: agent.credits } } });
  if (reserved.count === 0) return NextResponse.json({ error: `Not enough credits. This agent needs ${agent.credits}.` }, { status: 402 });
  try {
    const { text } = await generateText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      system: agent.system + " Be specific to the business. Never invent statistics, testimonials or guarantees.",
      prompt: `Business / niche: ${input.niche}\nTarget audience: ${input.audience || "not specified"}\nTone: ${input.tone}\nPrimary platform: ${input.platform}\nGoals: ${input.goals || "grow awareness and sales"}`,
      maxOutputTokens: 1800,
    });
    let output = text;
    if (agent.slug === "image-creative" && process.env.ENABLE_IMAGE_GEN === "true") {
      try {
        const r = await fetch("https://api.openai.com/v1/images/generations", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: "gpt-image-1", prompt: `Social media ad creative for ${input.niche}, ${input.tone} tone, aimed at ${input.audience}. Clean, modern, high-converting.`, size: "1024x1024" }) });
        const j = await r.json();
        const b64 = j?.data?.[0]?.b64_json; const url = j?.data?.[0]?.url;
        if (url) output += `\n\n## Generated image\n\n![creative](${url})`;
        else if (b64) output += `\n\n## Generated image\n\n![creative](data:image/png;base64,${b64})`;
      } catch {}
    }
    const gen = await prisma.generation.create({ data: { userId: user.id, agent: agent.slug, input, output, credits: agent.credits } });
    const fresh = await prisma.user.findUnique({ where: { id: user.id }, select: { credits: true } });
    return NextResponse.json({ id: gen.id, output, credits: fresh?.credits });
  } catch (e) {
    await prisma.user.update({ where: { id: user.id }, data: { credits: { increment: agent.credits } } });
    console.error(e);
    return NextResponse.json({ error: "Generation failed — your credits were refunded. Please try again." }, { status: 500 });
  }
}
