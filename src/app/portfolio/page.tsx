"use client";
import { usePortfolio } from "@/app-core/hooks/usePortfolio";
import { ErrorDisplay } from "@/components/error/ErrorDisplay";

export default function PortfolioPage() {
    const { rows, error } = usePortfolio();
    
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Portfolio</h1>

                {error && <div className="mb-6"><ErrorDisplay error={error} title="Portfolio Error" /></div>}

                {/* Holdings Table */}
                <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                    {rows.length === 0 && !error ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">No holdings yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Avg Price</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Current Price</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">P/L</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {rows.map((row) => (
                                        <tr key={row.symbol} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">{row.symbol.charAt(0)}</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{row.symbol}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 dark:text-white">{row.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">
                                                ${row.avgPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900 dark:text-white">
                                                ${row.currentPrice.toFixed(2)}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${row.profitLoss >= 0
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-red-600 dark:text-red-400"
                                                }`}>
                                                ${row.profitLoss.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
