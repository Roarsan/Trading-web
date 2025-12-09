"use client";
import { useEffect, useState } from "react";
import { marketService } from "@/modules/market/MarketService";
import { Stock } from "@/modules/market/Stock";
export default function MarketPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);

    useEffect(() => {
        setStocks([...marketService.getStocks()]);

        const interval = setInterval(() => {
            marketService.simulatePrices();
            setStocks([...marketService.getStocks()]);

        }, 1000);

        return () => clearInterval(interval);
    }, [])
    return (
        <main className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Market</h1>

            {/* Live Prices List */}
            <section className="space-y-3">
                {stocks.map((stock) => (
                    <div
                        key={stock.symbol}
                        className="p-4 border rounded flex justify-between"
                    >
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
