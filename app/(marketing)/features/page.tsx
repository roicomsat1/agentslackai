import { AgentGrid, H } from "@/components/Sections";
import { AGENTS } from "@/lib/agents";
export const metadata = { title: "Features" };
export default function P() {
  return <div className="max-w-6xl mx-auto px-5 py-20"><H eyebrow="Features" title="Meet your AI content team" sub="Each agent is purpose-built with its own expert prompt and output format." /><AgentGrid />
    <div className="mt-16 grid md:grid-cols-2 gap-5">{AGENTS.map(a => <div key={a.slug} className="card p-6"><h3 className="font-semibold text-white">{a.emoji} {a.name}</h3><p className="mt-2 text-sm text-white/60">{a.system.replace(/^You are (a|an) /, "Works like a ")}</p></div>)}</div>
    <div className="mt-16 grid md:grid-cols-3 gap-5">{[["Generation history","Every output is saved to your dashboard."],["Copy & download","One-click copy or download as Markdown."],["Fair credits","Credits are refunded automatically if a generation fails."]].map(([t,d]) => <div key={t} className="card p-6"><h3 className="font-semibold text-white">{t}</h3><p className="text-sm text-white/60 mt-1">{d}</p></div>)}</div>
  </div>;
}
