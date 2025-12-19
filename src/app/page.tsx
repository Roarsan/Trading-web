"use client";
import { useEffect, useState } from "react";
import { Stock } from "@/modules/market/Stock";
import { getMarketService, MarketService } from "@/modules/market/MarketService";
export default function Page() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const marketService = getMarketService();

  useEffect(() => {
    setStocks([...marketService.getStocks()]);

    const interval = setInterval(() => {
      marketService.simulatePrices();
      setStocks([...marketService.getStocks()]);
    }, 1000)

    return () => clearInterval(interval);
  }, []);
  
  return (
    <main className="p-6 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Welcome to TradingApp</h1>
        <p className="text-gray-600">Track markets, manage your portfolio, and trade with confidence.</p>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">Total Portfolio Value: --</div>
          <div className="p-4 border rounded">Day Gain/Loss: --</div>
          <div className="p-4 border rounded">Total Holdings: --</div>
        </div>
      </section>

      {/* Market Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
        {stocks.map((stock) => (
          <div key={stock.symbol} className="p-4 border rounded flex justify-between">
            <div>
              <p className="font-semibold">{stock.symbol}</p>
              <p className="text-gray-600 text-sm">{stock.name}</p>
            </div>

            <p className="font-bold">${stock.price.toFixed(2)}</p>
          </div>
        ))}
      </section>

    </main>
  );
}
