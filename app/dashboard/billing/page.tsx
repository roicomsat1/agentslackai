import { Pricing } from "@/components/Sections";
import { currentUser } from "@/lib/session";
export default async function B({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const user = (await currentUser())!; const sp = await searchParams;
  return <div className="max-w-5xl"><h1 className="text-3xl font-bold text-white">Billing</h1><p className="text-white/60 mt-1">Current plan: <b className="capitalize text-white">{user.plan}</b> · {user.credits} credits</p>
    {sp.success && <p className="mt-4 text-emerald-400">Payment received — credits will appear shortly.</p>}
    {sp.error && <p className="mt-4 text-amber-300">Payments aren't switched on yet. Please check back soon.</p>}
    <div className="mt-8"><Pricing /></div></div>;
}
