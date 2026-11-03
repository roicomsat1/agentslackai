"use client";
import { useState } from "react";
import { Output, VideoStatus } from "@/components/Output";
export function AgentRunner({ slug, name, credits, note }: { slug: string; name: string; credits: number; note?: string }) {
  const [out, setOut] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [videoId, setVideoId] = useState("");
  async function run(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr(""); setOut(""); setVideoId("");
    const body = Object.fromEntries(new FormData(e.currentTarget)); 
    const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, agent: slug }) });
    const j = await r.json(); setBusy(false);
    if (!r.ok) return setErr(j.error || "Something went wrong");
    setOut(j.output); setVideoId(j.video?.videoId || ""); const el = document.getElementById("credits"); if (el && j.credits != null) el.textContent = String(j.credits);
  }
  function download() { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([out.replace(/!\[[^\]]*\]\(data:[^)]+\)/g, "[image]")], { type: "text/markdown" })); a.download = `${slug}-${Date.now()}.md`; a.click(); }
  return <div className="grid lg:grid-cols-[380px_1fr] gap-6">
    <form onSubmit={run} className="card p-6 space-y-4 h-fit">{note && <p className="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-400/20 rounded-lg p-3">{note}</p>}
      <label className="block text-sm">Business / niche *<input name="niche" required minLength={2} className="input mt-1" placeholder="e.g. Vegan bakery in Manchester" /></label>
      <label className="block text-sm">Target audience<input name="audience" className="input mt-1" placeholder="e.g. Health-conscious 25–40s" /></label>
      <label className="block text-sm">Tone<select name="tone" className="input mt-1">{["Friendly","Professional","Bold","Playful","Luxury","Educational"].map(t => <option key={t}>{t}</option>)}</select></label>
      <label className="block text-sm">Platform<select name="platform" className="input mt-1">{["Instagram","TikTok","LinkedIn","X / Twitter","YouTube","Facebook","Website"].map(t => <option key={t}>{t}</option>)}</select></label>
      <label className="block text-sm">Goals<textarea name="goals" rows={3} className="input mt-1" placeholder="e.g. Launch new product, grow followers" /></label>
      <button disabled={busy} className="btn btn-primary w-full">{busy ? "Agent is working…" : `Run ${name} · ${credits} credits`}</button>
      {err && <p className="text-sm text-rose-400">{err}</p>}
    </form>
    <div className="card p-6 min-h-[400px]">
      {out ? <><div className="flex gap-2 justify-end mb-4"><button onClick={() => navigator.clipboard.writeText(out)} className="btn btn-ghost !py-1.5 text-sm">Copy</button><button onClick={download} className="btn btn-ghost !py-1.5 text-sm">Download .md</button></div>
        <Output text={out} />{videoId && <VideoStatus videoId={videoId} />}</>
        : <div className="h-full grid place-items-center text-white/40 text-sm">{busy ? slug === "ugc-scripts" ? "Writing scripts and creating visuals — this can take up to 90 seconds…" : "Generating — this usually takes 10–30 seconds…" : "Your result will appear here."}</div>}
    </div>
  </div>;
}
