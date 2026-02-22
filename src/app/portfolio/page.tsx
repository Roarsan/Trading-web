"use client";
import { usePortfolio } from "@/client/hooks/usePortfolio";
import { ErrorDisplay } from "@/client/components/error/ErrorDisplay";

export default function PortfolioPage() {
    const { rows, error } = usePortfolio();
    
    return (
        <main className="page">
            <div className="container-xl">
                <h1 className="page-title">Portfolio</h1>

                {error && <div className="section"><ErrorDisplay error={error} title="Portfolio Error" /></div>}

                {/* Holdings Table */}
                <section className="card card-table">
                    {rows.length === 0 && !error ? (
                        <div className="empty-state">
                            <div className="icon-circle">
                                <svg className="w-8 h-8 icon-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-muted-lg">No holdings yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead className="table-head">
                                    <tr>
                                        <th className="table-head-cell text-left">Symbol</th>
                                        <th className="table-head-cell text-right">Quantity</th>
                                        <th className="table-head-cell text-right">Avg Price</th>
                                        <th className="table-head-cell text-right">Current Price</th>
                                        <th className="table-head-cell text-right">P/L</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {rows.map((row) => (
                                        <tr key={row.symbol} className="table-row">
                                            <td className="table-cell">
                                                <div className="row-gap items-center">
                                                    <div className="icon-circle-sm">
                                                        <span className="text-white font-bold text-sm">
                                                            {row.symbol.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <span className="text-strong">{row.symbol}</span>
                                                </div>
                                            </td>
                                            <td className="table-cell table-cell-right text-gray-900 dark:text-white">{row.quantity}</td>
                                            <td className="table-cell table-cell-right text-gray-700 dark:text-gray-300">
                                                ${row.avgPrice.toFixed(2)}
                                            </td>
                                            <td className="table-cell table-cell-right text-strong">
                                                ${row.currentPrice.toFixed(2)}
                                            </td>
                                            <td className={`table-cell table-cell-right font-semibold ${row.profitLoss >= 0
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
