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
      </div>
    </main>
  );
}
