"use client";

import { useState } from "react";
import { Order, OrderType } from "@/modules/orders/Order";
import { getOrderService } from "@/modules/orders/OrderService";

export default function OrdersPage() {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [message, setMessage] = useState("");
  const orderService = getOrderService();

  const submitOrder = (type: OrderType) => {
    
    if (!symbol || quantity <= 0) {
      setMessage("Please enter valid symbol and quantity.");
      return;
    }

    const order = new Order(symbol.toUpperCase(), quantity, type);
    orderService.execute(order);

    setMessage(`Successfully executed ${type} order for ${quantity} shares of ${symbol.toUpperCase()}`);

    setSymbol("");
    setQuantity(0);
  };

  return (
    <main className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Place an Order</h1>

      {message && (
        <p className="p-3 border rounded bg-green-100 text-green-700">
          {message}
        </p>
      )}

      {/* Order Form */}
      <section className="space-y-4 max-w-sm">
        <input
          type="text"
          placeholder="Stock Symbol (e.g., AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />

        <div className="flex space-x-4">
          <button
            onClick={() => submitOrder("BUY")}
            className="p-2 px-4 bg-green-600 text-white rounded"
          >
            Buy
          </button>

          <button
            onClick={() => submitOrder("SELL")}
            className="p-2 px-4 bg-red-600 text-white rounded"
          >
            Sell
          </button>
        </div>

      </section>
    </main>
  );
}
