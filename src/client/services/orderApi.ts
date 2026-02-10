import { ValidationError } from "@/domain/expectedError/ExpectedError";
import type { Order} from "@/domain/orders/Order";

export async function placeOrder(input: Order) {

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

  const data = await res.json();
  if (!res.ok) {
    throw new ValidationError(data?.error ?? "Order failed");
  }

}
