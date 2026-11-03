import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/agents";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/features", "/pricing", "/about", "/contact", "/privacy", "/terms", "/signup"].map(p => ({ url: `${SITE_URL}${p}`, lastModified: new Date(), changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}
