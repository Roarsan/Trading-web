import { prisma } from "@/server/db/prisma";
import { ExpectedError } from "@/domain/expectedError/ExpectedError";
import { getHoldingsByUserId } from "@/server/portfolio/portfolioService";
import { Order } from "@/domain/orders/Order";
import { OrderService } from "@/domain/orders/OrderService";


export async function processOrder(userId: string, order: Order) {
  try {
    const existingData = await prisma.holding.findMany({
      where: { userId },
      orderBy: { symbol: "asc" },
    });

    const orderService = new OrderService();
    const newHoldings = orderService.execute(
      existingData.map((h) => ({
        symbol: h.symbol,
        quantity: h.quantity,
        avgPrice: h.avgPrice,
      })),
      new Order(order.symbol, order.quantity, order.type,order.price,)
    );


    const existingDataMap = new Map(existingData.map((h) => [h.symbol, h]));
    const updatedHoldingMap = new Map(newHoldings.map((h) => [h.symbol, h]));

    const deletes = existingData
      .filter((h) => !updatedHoldingMap.has(h.symbol))
      .map((h) => prisma.holding.delete({ where: { id: h.id } }));

    const updates = newHoldings
      .filter((h) => existingDataMap.has(h.symbol))
      .map((h) =>
        prisma.holding.update({
          where: { id: existingDataMap.get(h.symbol)!.id },
          data: { quantity: h.quantity, avgPrice: h.avgPrice },
        }),
      );

    const creates = newHoldings
      .filter((h) => !existingDataMap.has(h.symbol))
      .map((h) =>
        prisma.holding.create({
          data: {
            userId,
            symbol: h.symbol,
            quantity: h.quantity,
            avgPrice: h.avgPrice,
          },
        }),
      );

    if (deletes.length || updates.length || creates.length) {
      await prisma.$transaction([...deletes, ...updates, ...creates]);
    }

    return await getHoldingsByUserId(userId);
  } catch (err) {
    if (err instanceof ExpectedError) {
      throw err;
    }
    console.error("processOrder failed:", err);
    throw new Error("Unexpected server error");
  }
}
