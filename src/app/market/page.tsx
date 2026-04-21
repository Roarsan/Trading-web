"use client";
import { useLiveMarket } from "@/client/hooks/useLiveMarket";
import { ErrorDisplay } from "@/client/components/error/ErrorDisplay";

export default function MarketPage() {
    const { stocks, error } = useLiveMarket();

    return (
        <main className="page">
            <div className="container-xl">
                <h1 className="page-title">Market</h1>

                {error && 
                <div className="section">
                    <ErrorDisplay error={error} title="Market Error" />
                </div>}

                {/* Live Prices Table */}
                <section className="card card-table">
                    {stocks.length === 0 && !error ? (
                        <div className="empty-state">
                            <p className="text-muted-lg">No stocks available.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead className="table-head">
                                    <tr>
                                        <th className="table-head-cell text-left">Symbol</th>
                                        <th className="table-head-cell text-left">Company</th>
                                        <th className="table-head-cell text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {stocks.map((stock) => (
                                        <tr key={stock.symbol} className="table-row">
                                            <td className="table-cell">
                                                <div className="row-gap-center">
                                                    <div className="icon-circle-sm">
                                                        <span className="text-white font-bold text-sm">
                                                            {stock.symbol.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <span className="text-strong">{stock.symbol}</span>
                                                </div>
                                            </td>
                                            <td className="table-cell text-muted-sm">
                                                {stock.name}
                                            </td>
                                            <td className="table-cell table-cell-right text-strong">
                                                ${stock.price.toFixed(2)}
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
