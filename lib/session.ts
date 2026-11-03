import { auth } from "@/auth";
import { prisma, hasDb } from "@/lib/db";
export async function currentUser() {
  const s = await auth();
  const id = (s?.user as any)?.id as string | undefined;
  if (!id || !hasDb) return null;
  return prisma.user.findUnique({ where: { id } });
}
