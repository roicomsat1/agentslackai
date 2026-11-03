import Link from "next/link";
import { AGENTS } from "@/lib/agents";
import { currentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
export default async function D() {
  const user = (await currentUser())!;
  const recent = await prisma.generation.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 });
  return <div className="max-w-5xl">
    <h1 className="text-3xl font-bold text-white">Hi{user.name ? `, ${user.name}` : ""} 👋</h1><p className="text-white/60 mt-1">Choose an agent to get started.</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">{AGENTS.map(a => <Link key={a.slug} href={`/dashboard/agents/${a.slug}`} className="card p-5 hover:border-violet-500/50"><div className="text-2xl">{a.emoji}</div><h3 className="font-semibold text-white mt-2">{a.name}</h3><p className="text-sm text-white/55 mt-1">{a.tagline}</p><p className="text-xs text-amber-300 mt-3">{a.credits} credits</p></Link>)}</div>
    <h2 className="text-xl font-semibold text-white mt-12">Recent generations</h2>
    <div className="mt-4 space-y-2">{recent.length === 0 ? <p className="text-white/50 text-sm">Nothing yet — run your first agent above.</p> : recent.map(g => <Link key={g.id} href={`/dashboard/history#${g.id}`} className="card p-4 block text-sm"><b className="text-white">{g.agent}</b> <span className="text-white/40">· {g.createdAt.toLocaleString("en-GB")}</span><p className="text-white/60 truncate">{g.output.slice(0, 140)}</p></Link>)}</div>
  </div>;
}
