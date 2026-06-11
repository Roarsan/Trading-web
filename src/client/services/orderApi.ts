import { ValidationError } from "@/domain/expectedError/ExpectedError";
import type { Order} from "@/domain/orders/Order";
import type { Holding } from "@/shared/types";

type PlaceOrderResponse = {
  holdings: Holding[];
};

export async function placeOrder(input: Order): Promise<Holding[]> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      symbol: input.symbol,
      quantity: input.quantity,
      type: input.type,
      price: input.price,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as Partial<PlaceOrderResponse> & {
    error?: { message?: string } | string;
  };

  if (!res.ok) {
    const errorMessage =
      typeof data.error === "string"
        ? data.error
        : data.error?.message;
    const message = errorMessage ?? "Order failed";
    throw new ValidationError(message);
  }

  return data.holdings ?? [];
}
