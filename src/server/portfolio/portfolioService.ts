import { prisma } from "@/server/db/prisma";
import type { Holding } from "@/shared/types/portfolio";

export async function getHoldingsByUserId(userId: string): Promise<Holding[]> {
  return prisma.holding.findMany({
    where: { userId },
    orderBy: { symbol: "asc" },
    select: {
      symbol: true,
      quantity: true,
      avgPrice: true,
    },
  });
}
