import { notFound } from "next/navigation";
import { getAgent } from "@/lib/agents";
const NOTE: Record<string, string> = {
  "ugc-scripts": `Creates a full UGC package: 3 creator scripts (PAS, testimonial, demo) with hooks, captions, b-roll and posting notes${process.env.ENABLE_IMAGE_GEN === "true" ? " + 2 vertical UGC visuals" : ""}${process.env.HEYGEN_API_KEY && process.env.HEYGEN_AVATAR_ID ? " + an AI talking-head video (HeyGen)" : ""}.`,
  "image-creative": process.env.ENABLE_IMAGE_GEN === "true" ? "Creates concepts, prompts and 2 generated vertical images." : "",
};
import { AgentRunner } from "@/components/AgentRunner";
export default async function P({ params }: { params: Promise<{ slug: string }> }) {
  const a = getAgent((await params).slug); if (!a) notFound();
  return <div className="max-w-6xl"><h1 className="text-3xl font-bold text-white">{a.emoji} {a.name}</h1><p className="text-white/60 mt-1 mb-8">{a.tagline}</p><AgentRunner slug={a.slug} name={a.name.replace(" Agent","")} credits={a.credits} note={NOTE[a.slug]} /></div>;
}
