// Asset generation helpers: OpenAI Images + HeyGen avatar video
export const imageGenEnabled = () => process.env.ENABLE_IMAGE_GEN === "true" && !!process.env.OPENAI_API_KEY;

export async function generateImage(prompt: string, size: "1024x1536" | "1024x1024" = "1024x1536"): Promise<string | null> {
  try {
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5", prompt, size, quality: "medium", output_format: "jpeg", output_compression: 70, n: 1 }),
    });
    const j = await r.json();
    if (!r.ok) { console.error("image gen failed", j?.error?.message); return null; }
    const d = j?.data?.[0];
    return d?.url || (d?.b64_json ? `data:image/jpeg;base64,${d.b64_json}` : null);
  } catch (e) { console.error(e); return null; }
}

export function extractVO(text: string) {
  const m = text.match(/<<<VO\s*([\s\S]*?)\s*VO>>>/);
  return m ? m[1].trim() : null;
}

export type HeygenStart = { status: "rendering"; videoId: string } | { status: "skipped" | "error"; message: string };
export async function startHeygenVideo(script: string): Promise<HeygenStart> {
  const key = process.env.HEYGEN_API_KEY, avatar = process.env.HEYGEN_AVATAR_ID, voice = process.env.HEYGEN_VOICE_ID;
  if (!key) return { status: "skipped", message: "HeyGen not configured (HEYGEN_API_KEY missing)." };
  if (!avatar) return { status: "skipped", message: "HeyGen avatar not configured (HEYGEN_AVATAR_ID missing)." };
  if (!voice) return { status: "skipped", message: "HeyGen voice not configured (HEYGEN_VOICE_ID missing)." };
  try {
    const r = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST", headers: { "Content-Type": "application/json", "X-Api-Key": key },
      body: JSON.stringify({
        video_inputs: [{
          character: process.env.HEYGEN_AVATAR_TYPE === "talking_photo" ? { type: "talking_photo", talking_photo_id: avatar } : { type: "avatar", avatar_id: avatar, avatar_style: "normal" },
          voice: { type: "text", input_text: script.slice(0, 1500), voice_id: voice },
        }],
        dimension: { width: 720, height: 1280 },
      }),
    });
    const j = await r.json();
    const id = j?.data?.video_id;
    if (!r.ok || !id) return { status: "error", message: j?.error?.message || j?.message || `HeyGen error ${r.status}` };
    return { status: "rendering", videoId: id };
  } catch (e: any) { return { status: "error", message: String(e?.message || e) }; }
}

export async function heygenStatus(videoId: string) {
  const r = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`, { headers: { "X-Api-Key": process.env.HEYGEN_API_KEY! }, cache: "no-store" });
  const j = await r.json();
  return { status: j?.data?.status as string | undefined, videoUrl: j?.data?.video_url as string | undefined, thumbnail: j?.data?.thumbnail_url as string | undefined, error: j?.data?.error?.message || j?.data?.error };
}
