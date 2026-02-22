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

                {/* Live Prices List */}
                <section className="card card-table">
                    {stocks.length === 0 && !error ? (
                        <div className="empty-state">
                            <p className="text-muted-lg">No stocks available.</p>
                        </div>
                    ) : (
                        <div className="table-body">
                            {stocks.map((stock) => (
                                <div
                                    key={stock.symbol}
                                    className="table-row card-padded row-justify"
                                >
                                    <div className="row-gap items-center">
                                        <div className="icon-circle-md">
                                            <span className="text-white font-bold text-lg">{stock.symbol.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="text-strong text-lg">{stock.symbol}</p>
                                            <p className="text-muted-sm">{stock.name}</p>
                                        </div>
                                    </div>
                                    <p className="text-strong text-xl">${stock.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
