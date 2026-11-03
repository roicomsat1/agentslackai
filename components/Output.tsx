"use client";
import { useEffect, useState } from "react";
export function Output({ text }: { text: string }) {
  const parts = text.split(/(!\[[^\]]*\]\([^)]+\))/g);
  const imgs = parts.filter(p => p.startsWith("!["));
  return <div className="text-sm text-white/85 leading-relaxed">
    {parts.map((p, i) => {
      const m = p.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (m) return null;
      return p.trim() ? <pre key={i} className="whitespace-pre-wrap font-sans">{p}</pre> : null;
    })}
    {imgs.length > 0 && <div className="grid sm:grid-cols-2 gap-4 mt-4">{imgs.map((p, i) => { const m = p.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)!; return <a key={i} href={m[2]} download={`visual-${i + 1}.jpg`} className="block"><img src={m[2]} alt={m[1]} className="rounded-xl border border-white/10 w-full" /><span className="text-xs text-white/50">Download {m[1]}</span></a>; })}</div>}
  </div>;
}
export function VideoStatus({ videoId }: { videoId: string }) {
  const [s, setS] = useState<{ status?: string; videoUrl?: string; error?: string }>({ status: "rendering" });
  useEffect(() => {
    let t: any; let stop = false;
    const tick = async () => {
      const r = await fetch(`/api/ugc-status?video_id=${videoId}`); const j = await r.json().catch(() => ({}));
      if (stop) return; setS(j);
      if (j.status !== "completed" && j.status !== "failed" && !j.error) t = setTimeout(tick, 10000);
    };
    tick(); return () => { stop = true; clearTimeout(t); };
  }, [videoId]);
  return <div className="card p-4 mt-4">
    <p className="font-semibold text-white">🎥 AI UGC video</p>
    {s.videoUrl ? <video src={s.videoUrl} controls className="mt-3 rounded-xl max-h-[600px]" /> :
      <p className="text-sm text-white/60 mt-1">{s.status === "failed" || s.error ? `Render failed: ${s.error || "unknown error"}` : `Rendering with HeyGen (${s.status || "pending"})… usually 1–5 minutes. You can leave this page; check History later.`}</p>}
  </div>;
}
