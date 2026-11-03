import { Pricing, Faq, H } from "@/components/Sections";
export const metadata = { title: "Pricing" };
export default function P() { return <div className="max-w-6xl mx-auto px-5 py-20"><H eyebrow="Pricing" title="Plans that grow with you" sub="Every account starts with 50 free credits. Prices in GBP, billed monthly, cancel anytime." /><Pricing /><div className="mt-20"><Faq /></div></div>; }
