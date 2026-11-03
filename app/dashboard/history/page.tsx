import { currentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
export default async function H() {
  const user = (await currentUser())!;
  const gens = await prisma.generation.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return <div className="max-w-4xl"><h1 className="text-3xl font-bold text-white">History</h1>
    <div className="mt-6 space-y-4">{gens.length === 0 && <p className="text-white/50">No generations yet.</p>}{gens.map(g => <details key={g.id} id={g.id} className="card p-5"><summary className="cursor-pointer"><b className="text-white">{g.agent}</b> <span className="text-white/40 text-sm">· {g.createdAt.toLocaleString("en-GB")} · {g.credits} credits</span></summary><pre className="whitespace-pre-wrap font-sans text-sm text-white/80 mt-4">{g.output}</pre></details>)}</div></div>;
}
