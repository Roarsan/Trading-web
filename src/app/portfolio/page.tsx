"use client";
import { getOrderService } from "@/modules/orders/OrderService";
import { useState, useEffect } from "react";
import { getMarketService } from "@/modules/market/MarketService";

interface PortfolioRow {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    profitLoss: number;
}


export default function PortfolioPage() {
    const [rows, setRows] = useState<PortfolioRow[]>([]);
    const marketService = getMarketService();
    const orderService = getOrderService();

    const updatePortfolio = () => {
        const holdings = orderService.getPortfolio().getHoldings().filter(h => h.quantity > 0);

        const updatedRows = holdings.map((h): PortfolioRow => {
            const stock = marketService.getStock(h.symbol);
            const currentPrice = stock ? stock.price : 0;
            const profitLoss = (currentPrice - h.avgPrice) * h.quantity;

            return {
                symbol: h.symbol,
                quantity: h.quantity,
                avgPrice: h.avgPrice,
                currentPrice,
                profitLoss,
            };

        });
        setRows(updatedRows);
    };
    useEffect(() => {
        // Initial load
        updatePortfolio();

        // Update every second for live P/L changes
        const interval = setInterval(() => {
            marketService.simulatePrices();
            updatePortfolio();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Portfolio</h1>

            {/* Holdings Table */}
            <section>
                <table className="w-full border-collapse border text-left">
                    <thead>
                        <tr>
                            <th className="border p-2">Symbol</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Avg Price</th>
                            <th className="border p-2">Current Price</th>
                            <th className="border p-2">P/L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="border p-2 text-center">
                                    No holdings yet.
                                </td>
                            </tr>
                        )}
                        {rows.map((row) => (
                            <tr key={row.symbol}>
                                <td className="border p-2">{row.symbol}</td>
                                <td className="border p-2">{row.quantity}</td>
                                <td className="border p-2">
                                    ${row.avgPrice.toFixed(2)}
                                </td>
                                <td className="border p-2">
                                    ${row.currentPrice.toFixed(2)}
                                </td>
                                <td
                                    className={`border p-2 ${row.profitLoss >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    ${row.profitLoss}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}
