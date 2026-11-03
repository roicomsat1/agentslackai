import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/agents";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "AgentSlack AI — AI agents that create content for your business", template: "%s · AgentSlack AI" },
  description: "Five specialised AI agents for viral content, branding, UGC ad scripts, image creatives and video production. Start free with 50 credits — no card needed.",
  openGraph: { title: "AgentSlack AI", description: "Stop creating content. Let AI grow your business.", type: "website", siteName: "AgentSlack AI" },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-GB"><body className="antialiased font-sans min-h-screen">{children}</body></html>;
}
