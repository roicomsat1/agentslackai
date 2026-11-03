import Link from "next/link";
import { AGENTS, PLANS, FAQ } from "@/lib/agents";
export function AgentGrid() {
  return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{AGENTS.map(a => (
    <div key={a.slug} className="card p-6 hover:border-violet-500/40 transition">
      <div className="text-3xl">{a.emoji}</div>
      <h3 className="mt-3 font-semibold text-lg text-white">{a.name}</h3>
      <p className="mt-2 text-sm text-white/60">{a.tagline}</p>
      <p className="mt-4 text-xs text-amber-300">{a.credits} credits per run</p>
    </div>))}
    <div className="card p-6 grad-bg/10 flex flex-col justify-center"><h3 className="font-semibold text-white">Start with 50 free credits</h3><p className="text-sm text-white/60 mt-2">Enough to try several agents. No card required.</p><Link href="/signup" className="btn btn-primary mt-4 w-fit">Create free account</Link></div>
  </div>;
}
export function Pricing() {
  return <div className="grid md:grid-cols-3 gap-5">{PLANS.map(p => (
    <div key={p.id} className={`card p-7 relative ${"popular" in p && p.popular ? "border-violet-500/60 shadow-[0_0_60px_-20px_rgba(139,92,246,.7)]" : ""}`}>
      {"popular" in p && p.popular && <span className="absolute -top-3 left-6 grad-bg text-xs px-3 py-1 rounded-full text-white">Most popular</span>}
      <h3 className="font-semibold text-white">{p.name}</h3>
      <p className="mt-3"><span className="text-4xl font-bold text-white">£{p.price}</span><span className="text-white/50">/month</span></p>
      <ul className="mt-5 space-y-2 text-sm text-white/70">{p.features.map(f => <li key={f}>✓ {f}</li>)}</ul>
      <form action="/api/checkout" method="post" className="mt-6"><input type="hidden" name="plan" value={p.id} /><button className={`btn w-full ${"popular" in p && p.popular ? "btn-primary" : "btn-ghost"}`}>Choose {p.name}</button></form>
    </div>))}</div>;
}
export function Faq() {
  return <div className="max-w-3xl mx-auto divide-y divide-white/10">{FAQ.map(f => (
    <details key={f.q} className="py-4 group"><summary className="cursor-pointer font-medium text-white list-none flex justify-between">{f.q}<span className="text-white/40 group-open:rotate-45 transition">+</span></summary><p className="mt-2 text-white/60 text-sm">{f.a}</p></details>))}</div>;
}
export function H({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return <div className="text-center max-w-2xl mx-auto mb-12">{eyebrow && <p className="text-xs uppercase tracking-widest text-violet-300">{eyebrow}</p>}<h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">{title}</h2>{sub && <p className="mt-3 text-white/60">{sub}</p>}</div>;
}
