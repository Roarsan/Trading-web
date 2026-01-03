"use client";
import { useLiveMarket } from "@/hooks/useLiveMarket";
export default function Page() {
const stocks = useLiveMarket();
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center space-y-3 mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to TradingApp</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Track markets, manage your portfolio, and trade with confidence.</p>
        </section>

        {/* Quick Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Day Gain/Loss</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Holdings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">--</p>
            </div>
          </div>
        </section>

        {/* Market Overview */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Market Overview</h2>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {stocks.map((stock) => (
                <div key={stock.symbol} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex justify-between items-center">
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
          </div>
        </section>
      </div>
    </main>
  );
}
