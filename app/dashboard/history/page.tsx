import { currentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Output, VideoStatus } from "@/components/Output";
export default async function H() {
  const user = (await currentUser())!;
  const gens = await prisma.generation.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return <div className="max-w-4xl"><h1 className="text-3xl font-bold text-white">History</h1>
    <div className="mt-6 space-y-4">{gens.length === 0 && <p className="text-white/50">No generations yet.</p>}{gens.map((g: any) => <details key={g.id} id={g.id} className="card p-5"><summary className="cursor-pointer"><b className="text-white">{g.agent}</b> <span className="text-white/40 text-sm">· {g.createdAt.toLocaleString("en-GB")} · {g.credits} credits</span></summary><div className="mt-4"><Output text={g.output} />{(g.input as any)?.heygenVideoId && <VideoStatus videoId={(g.input as any).heygenVideoId} />}</div></details>)}</div></div>;
}
