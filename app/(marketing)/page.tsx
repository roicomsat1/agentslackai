import Link from "next/link";
import { AgentGrid, Pricing, Faq, H } from "@/components/Sections";
import { FAQ, SITE_URL } from "@/lib/agents";
export const revalidate = 3600;
export default function Home() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Organization", name: "AgentSlack AI", url: SITE_URL, logo: `${SITE_URL}/icon.svg` },
    { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "AgentSlack AI", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "AggregateOffer", priceCurrency: "GBP", lowPrice: 0, highPrice: 49 } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,.18),transparent_50%)]" />
      <div className="max-w-6xl mx-auto px-5 pt-24 pb-20 text-center">
        <p className="inline-block text-xs px-3 py-1 rounded-full border border-white/15 text-white/70">5 specialised AI agents · 50 free credits</p>
        <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight text-white">Stop Creating Content.<br /><span className="grad-text">Let AI Grow Your Business.</span></h1>
        <p className="mt-6 text-lg text-white/65 max-w-2xl mx-auto">Viral posts, brand strategy, UGC ad scripts, image creatives and video plans — generated in seconds by AI agents trained for each job.</p>
        <div className="mt-9 flex justify-center gap-3"><Link href="/signup" className="btn btn-primary">Start free — no card</Link><Link href="/features" className="btn btn-ghost">See the agents</Link></div>
      </div>
    </section>
    <section className="max-w-6xl mx-auto px-5 py-16"><H eyebrow="Your AI team" title="Five agents. One content engine." sub="Pick an agent, describe your business, and get ready-to-use output." /><AgentGrid /></section>
    <section className="max-w-6xl mx-auto px-5 py-16"><H eyebrow="How it works" title="From idea to content in three steps" />
      <div className="grid md:grid-cols-3 gap-5">{[["1","Describe your business","Tell the agent your niche, audience, tone and goals."],["2","Agent gets to work","A specialised AI agent drafts content built for your platform."],["3","Copy, download, publish","Save to history, export, and post wherever you grow."]].map(([n,t,d]) => <div key={n} className="card p-6"><span className="grad-text text-3xl font-bold">{n}</span><h3 className="mt-2 font-semibold text-white">{t}</h3><p className="mt-1 text-sm text-white/60">{d}</p></div>)}</div>
    </section>
    <section className="max-w-6xl mx-auto px-5 py-16"><H eyebrow="Pricing" title="Simple, credit-based plans" sub="Start free with 50 credits. Upgrade when you're ready." /><Pricing /></section>
    <section className="max-w-6xl mx-auto px-5 py-16"><H title="Frequently asked questions" /><Faq /></section>
    <section className="max-w-4xl mx-auto px-5"><div className="card p-10 text-center bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-amber-500/10"><h2 className="text-3xl font-bold text-white">Ready to put content on autopilot?</h2><p className="mt-2 text-white/60">Create your account and try every agent with 50 free credits.</p><Link href="/signup" className="btn btn-primary mt-6">Get started free</Link></div></section>
  </>;
}
