# AgentSlack AI

Owned-stack rebuild of agentslackai.com (it replaces the Abacus.AI-hosted version).

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v4 · Auth.js v5 (email + password, optional Google) · Prisma + Postgres · Vercel AI SDK + OpenAI · Stripe Checkout · Vercel

## Features
- Marketing pages: `/`, `/features`, `/pricing`, `/about`, `/contact`, `/privacy`, `/terms`. They're statically cached and include JSON-LD (Organization, SoftwareApplication, FAQ).
- `sitemap.xml` and `robots.txt`, security headers, and no `x-powered-by` header
- Auth: sign-up gives a new account 50 free credits. Sessions use JWTs, and `/dashboard/*` is protected.
- 5 agents: Viral Content (10 credits), Branding (20), UGC Ad Scripts (15), Image Creative (12), Video Production (15).
  - Credits are reserved atomically and refunded if a run fails. Every run is saved to History, and you can copy or download it as .md.
  - Image Creative returns production-ready prompts. Set `ENABLE_IMAGE_GEN=true` to also generate an image with `gpt-image-1`.
- Stripe: there are subscription checkout plans for Starter £9 (500 credits), Pro £19 (2,000) and Growth £49 (10,000). The `invoice.paid` webhook adds the monthly credits.
- `/api/health` reports which services are configured.

## Environment variables
See `.env.example`.

| Var | Required | Notes |
|---|---|---|
| `AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `DATABASE_URL` | yes for accounts | Postgres connection string (Neon recommended) |
| `OPENAI_API_KEY` | yes for agents | `OPENAI_MODEL` defaults to `gpt-4o-mini` |
| `AUTH_URL`, `NEXT_PUBLIC_SITE_URL` | recommended | Your canonical URL |
| `AUTH_GOOGLE_ID/SECRET` | optional | Turns on Google sign-in. Callback: `/api/auth/callback/google` |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER/PRO/GROWTH` | for payments | Create 3 recurring GBP prices. The webhook goes to `/api/stripe/webhook` and needs the `invoice.paid` and `customer.subscription.deleted` events. |

## Run it locally
```bash
npm install
cp .env.example .env.local   # fill in AUTH_SECRET, DATABASE_URL, OPENAI_API_KEY
npx prisma db push
npm run dev
```

## Database (Neon via the Vercel Marketplace)
```bash
vercel integration add neon      # free plan; connects DATABASE_URL to the project
vercel --prod                    # the build runs `prisma db push` automatically when DATABASE_URL is set
```

## Domain cutover (agentslackai.com)
1. Vercel → Project → Settings → Domains: add `agentslackai.com` and `www.agentslackai.com`.
2. At your DNS provider (Cloudflare), set an `A` record for `@` to `76.76.21.21` and a `CNAME` for `www` to `cname.vercel-dns.com`. Use DNS-only (grey cloud), or SSL "Full (strict)".
3. Update `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to `https://agentslackai.com`, update the Google OAuth and Stripe webhook URLs to match, then redeploy.
4. Vercel automatically redirects HTTP to HTTPS.
5. Switch off the Abacus.AI deployment.
