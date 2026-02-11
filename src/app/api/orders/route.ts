import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/nextAuth";
import { processOrder } from "@/server/orders/orderService";
import { withApiError } from "@/server/api/errors";
import { orderSchema } from "@/server/validation/orderSchemas";

export const POST = withApiError(async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const body = await req.json().catch(() => {
    throw new Error("Invalid JSON");
  });

  const order = orderSchema.parse(body);
  const holdings = await processOrder(session.user.id, order);

  return NextResponse.json({ holdings });
});
