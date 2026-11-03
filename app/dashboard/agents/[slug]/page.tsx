import { notFound } from "next/navigation";
import { getAgent } from "@/lib/agents";
import { AgentRunner } from "@/components/AgentRunner";
export default async function P({ params }: { params: Promise<{ slug: string }> }) {
  const a = getAgent((await params).slug); if (!a) notFound();
  return <div className="max-w-6xl"><h1 className="text-3xl font-bold text-white">{a.emoji} {a.name}</h1><p className="text-white/60 mt-1 mb-8">{a.tagline}</p><AgentRunner slug={a.slug} name={a.name.replace(" Agent","")} credits={a.credits} /></div>;
}
