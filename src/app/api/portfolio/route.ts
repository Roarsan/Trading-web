import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/nextAuth";
import { getHoldingsByUserId } from "@/server/portfolio/portfolioService";
import { unauthorized, withApiError } from "@/server/api/errors";
import type { PortfolioResponse } from "@/shared/types";

export const GET = withApiError(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw error;
  }

  const holdings = await getHoldingsByUserId(session.user.id);

  const response: PortfolioResponse = { holdings };
  return NextResponse.json(response);
});
