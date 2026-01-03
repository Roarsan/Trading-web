"use client";

import { useState } from "react";
import { Order, OrderType } from "@/domain/orders/Order";
import { getOrderService } from "@/domain/orders/OrderService";

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
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Place an Order</h1>

        {message && (
          <div className="mb-6 p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            <p className="font-medium">{message}</p>
          </div>
        )}

        {/* Order Form */}
        <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Symbol
            </label>
            <input
              type="text"
              placeholder="Stock Symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              onClick={() => submitOrder("BUY")}
              className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Buy
            </button>

            <button
              onClick={() => submitOrder("SELL")}
              className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Sell
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
