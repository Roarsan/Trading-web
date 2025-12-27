"use client";
import { useEffect, useState } from "react";
import {  getMarketService } from "@/modules/market/MarketService";
import { Stock } from "@/modules/market/Stock";
export default function MarketPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const marketService = getMarketService();

    useEffect(() => {
        setStocks([... marketService.getStocks()]);

        const interval = setInterval(() => {
            marketService.simulatePrices();
            setStocks([...marketService.getStocks()]);

        }, 1000);

        return () => clearInterval(interval);
    }, [])
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Market</h1>

                {/* Live Prices List */}
                <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-200 dark:divide-slate-700">
                        {stocks.map((stock) => (
                            <div
                                key={stock.symbol}
                                className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex justify-between items-center"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{stock.symbol.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg text-gray-900 dark:text-white">{stock.symbol}</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{stock.name}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-xl text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
