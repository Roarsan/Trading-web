import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/nextAuth";

import { ExpectedError } from "@/domain/expectedError/ExpectedError";
import { processOrder } from "@/server/orders/orderService";
import { Order } from "@/domain/orders/Order";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let order: Order;
  try {
    order = (await req.json()) as Order;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const symbol = order.symbol?.toUpperCase().trim();
  const quantity = Number(order.quantity);
  const price = Number(order.price);

  if (!symbol || !Number.isFinite(quantity) || quantity <= 0) {
    return NextResponse.json({ error: "Invalid symbol or quantity" }, { status: 400 });
  }

  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  if (order.type !== "BUY" && order.type !== "SELL") {
    return NextResponse.json({ error: "Invalid order type" }, { status: 400 });
  }

  try {
    const holdings = await processOrder(session.user.id, {
      symbol,
      quantity,
      price,
      type: order.type,
    });
    return NextResponse.json({ holdings });
  } catch (err) {
    if (err instanceof ExpectedError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
