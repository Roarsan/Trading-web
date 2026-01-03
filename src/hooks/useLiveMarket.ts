"use client";

import { useEffect, useState } from "react";
import { getMarketService } from "@/modules/market/MarketService";
import { Stock } from "@/modules/market/Stock";

export function useLiveMarket(intervalMs = 1000) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const marketService = getMarketService();

  useEffect(() => {
    setStocks([...marketService.getStocks()]);

    const interval = setInterval(() => {
      marketService.simulatePrices();
      setStocks([...marketService.getStocks()]);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return stocks;
}
