import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Nav";
import { currentUser } from "@/lib/session";
import { signOut } from "@/auth";
import { AGENTS } from "@/lib/agents";
export const dynamic = "force-dynamic";
export default async function L({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  return <div className="min-h-screen md:flex">
    <aside className="md:w-64 border-r border-white/5 p-5 flex flex-col gap-1 text-sm">
      <Logo />
      <div className="card p-4 my-5"><p className="text-white/50 text-xs">Credits</p><p className="text-2xl font-bold grad-text" id="credits">{user.credits}</p><p className="text-xs text-white/50 capitalize">{user.plan} plan</p></div>
      <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-white/5">🏠 Overview</Link>
      {AGENTS.map(a => <Link key={a.slug} href={`/dashboard/agents/${a.slug}`} className="px-3 py-2 rounded-lg hover:bg-white/5">{a.emoji} {a.name.replace(" Agent", "")}</Link>)}
      <Link href="/dashboard/history" className="px-3 py-2 rounded-lg hover:bg-white/5">🕘 History</Link>
      <Link href="/dashboard/billing" className="px-3 py-2 rounded-lg hover:bg-white/5">💳 Billing</Link>
      <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }} className="mt-auto pt-6"><button className="text-white/50 hover:text-white px-3">Sign out ({user.email})</button></form>
    </aside>
    <main className="flex-1 p-6 md:p-10">{children}</main>
  </div>;
}
