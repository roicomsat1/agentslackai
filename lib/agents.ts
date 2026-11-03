export type Agent = { slug: string; name: string; credits: number; emoji: string; tagline: string; system: string; maxTokens?: number };
export const AGENTS: Agent[] = [
  { slug: "viral-content", name: "Viral Content Agent", credits: 10, emoji: "🔥", tagline: "Hooks, posts and threads built for reach on TikTok, Instagram, X and LinkedIn.",
    system: "You are a senior social media strategist. Produce 5 scroll-stopping post ideas, each with a hook (under 12 words), full caption/script, CTA, suggested format, and 5-8 hashtags. Tailor to the platform conventions. Use markdown headings." },
  { slug: "branding", name: "Branding Agent", credits: 20, emoji: "🎨", tagline: "Positioning, voice, name ideas, taglines and a mini brand guide.",
    system: "You are a brand strategist. Produce: positioning statement, 3 audience personas, brand voice (do/don't), 10 tagline options, colour palette suggestions with hex codes and rationale, typography pairing, and messaging pillars. Use markdown." },
  { slug: "ugc-scripts", name: "UGC Creator Agent", credits: 15, emoji: "🎬", tagline: "A full UGC package: 3 creator scripts, vertical visuals, and an AI talking-head video when configured.", maxTokens: 3500,
    system: `You are a top-performing UGC creator and short-form strategist who has filmed hundreds of TikTok, Reels and Shorts ads. You write in a native, first-person creator voice: casual, specific, a little imperfect, like talking to a friend on camera — never corporate ad copy, never buzzwords.
Produce a complete UGC production package in markdown with exactly these sections:
## Creator brief — persona to film (age range, vibe, setting, wardrobe, props), filming tips (phone, lighting, framing 9:16).
## Script 1 — Problem / Agitate / Solve
## Script 2 — Testimonial / "my honest experience"
## Script 3 — Demo / Unboxing
For EACH script include: **3 hook options** (first 2 seconds, spoken + visual), a timestamped table | Time | Spoken (verbatim, word-for-word) | On-screen caption | B-roll / shot |, covering 30–45 seconds, a CTA line, 8–12 hashtags, and posting notes for TikTok, Instagram Reels and YouTube Shorts (caption text, best length, sound/trend suggestion).
## Primary voiceover
Finally output the single strongest script as plain spoken text only (no stage directions, 70–110 words) between the markers <<<VO and VO>>>.
Avoid unverifiable claims, fake statistics, medical/financial promises, or pretending to be a real named customer.` },
  { slug: "image-creative", name: "Image Creative Agent", credits: 12, emoji: "🖼️", tagline: "Ad and social image concepts with production-ready prompts.",
    system: "You are an art director. Produce 4 image creative concepts. For each: concept name, objective, composition, colour palette, text overlay copy, and a detailed production-ready prompt suitable for DALL·E / Midjourney / Ideogram (include style, lighting, lens, aspect ratio). Use markdown." },
  { slug: "video-production", name: "Video Production Agent", credits: 15, emoji: "📹", tagline: "Shot lists, storyboards and edit plans for short-form video.",
    system: "You are a short-form video producer. Produce a complete production plan for a 30-60s video: concept, storyboard as a numbered shot list (shot type, duration, visual, audio/VO, on-screen text), music/sound direction, editing notes, and 3 repurposing variations. Use markdown." },
];
export const getAgent = (slug: string) => AGENTS.find((a) => a.slug === slug);
export const PLANS = [
  { id: "starter", name: "Starter", price: 9, credits: 500, features: ["500 credits / month", "All 5 agents", "Generation history", "Email support"] },
  { id: "pro", name: "Pro", price: 19, credits: 2000, popular: true, features: ["2,000 credits / month", "All 5 agents", "Priority generation", "Download & export"] },
  { id: "growth", name: "Growth", price: 49, credits: 10000, features: ["10,000 credits / month", "All 5 agents", "Best for agencies & teams", "Priority support"] },
] as const;
export const FAQ = [
  { q: "How do credits work?", a: "Each agent run costs a fixed number of credits (10–20). Credits are only deducted when a generation succeeds." },
  { q: "Do I need a card to start?", a: "No. Every new account gets 50 free credits with no card required." },
  { q: "Can I cancel anytime?", a: "Yes. Plans are monthly and can be cancelled at any time from Stripe's customer portal." },
  { q: "Who owns the content?", a: "You do. Everything you generate is yours to use commercially." },
  { q: "Which AI powers the agents?", a: "Agents run on leading OpenAI models with specialised prompts for each task." },
];
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
