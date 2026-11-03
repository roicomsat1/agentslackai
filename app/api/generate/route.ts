import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/session";
import { getAgent } from "@/lib/agents";
import { imageGenEnabled, generateImage, extractVO, startHeygenVideo } from "@/lib/media";
export const maxDuration = 120;
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
      maxOutputTokens: agent.maxTokens || 1800,
    });
    let output = text.replace(/<<<VO\s*([\s\S]*?)\s*VO>>>/, "$1");
    let video: any = null;
    const images: string[] = [];
    if ((agent.slug === "image-creative" || agent.slug === "ugc-scripts") && imageGenEnabled()) {
      const base = agent.slug === "ugc-scripts"
        ? [`Authentic UGC-style vertical smartphone photo: a relatable creator filming a selfie video in a real, slightly messy home setting, holding/using a product for ${input.niche}. Natural window light, candid expression mid-sentence, shot on iPhone, no text, no logos, aimed at ${input.audience || "everyday customers"}.`,
           `Vertical TikTok thumbnail for a ${input.tone.toLowerCase()} UGC video about ${input.niche}: close-up creator face reacting with surprise, product in hand, bright natural light, shallow depth of field, leave clean space at top for caption, no text.`]
        : [`Scroll-stopping vertical social media ad creative for ${input.niche}, ${input.tone} tone, aimed at ${input.audience || "target customers"}. Clean, modern, premium lighting, no text.`,
           `Lifestyle product photo for ${input.niche}, ${input.tone} mood, editorial composition, vertical, no text.`];
      const results = await Promise.all(base.map(p => generateImage(p)));
      results.forEach(u => u && images.push(u));
      if (images.length) output += `\n\n## Generated visuals\n\n` + images.map((u, i) => `![Visual ${i + 1}](${u})`).join("\n\n");
      else output += `\n\n> Image generation was attempted but failed — use the prompts above in your image tool.`;
    }
    if (agent.slug === "ugc-scripts") {
      const vo = extractVO(text);
      video = vo ? await startHeygenVideo(vo) : { status: "skipped", message: "No primary voiceover found." };
      if (video.status === "rendering") output += `\n\n## AI UGC video\n\nHeyGen video rendering — video_id: \`${video.videoId}\``;
      else output += `\n\n## AI UGC video\n\n> ${video.message}`;
    }
    const gen = await prisma.generation.create({ data: { userId: user.id, agent: agent.slug, input: video?.videoId ? { ...input, heygenVideoId: video.videoId } : input, output, credits: agent.credits } });
    const fresh = await prisma.user.findUnique({ where: { id: user.id }, select: { credits: true } });
    return NextResponse.json({ id: gen.id, output, credits: fresh?.credits, video });
  } catch (e) {
    await prisma.user.update({ where: { id: user.id }, data: { credits: { increment: agent.credits } } });
    console.error(e);
    return NextResponse.json({ error: "Generation failed — your credits were refunded. Please try again." }, { status: 500 });
  }
}
