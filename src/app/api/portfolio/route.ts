import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/nextAuth";
import { getHoldingsByUserId } from "@/server/portfolio/portfolioService";
import type { PortfolioResponse } from "@/shared/types";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const holdings = await getHoldingsByUserId(session.user.id);

  const response: PortfolioResponse = { holdings };
  return NextResponse.json(response);
}
