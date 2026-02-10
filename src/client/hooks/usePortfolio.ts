"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMarketSimulation } from "@/client/services/marketSimulation";
import { fetchHoldings } from "@/client/services/portfolioApi";

export interface PortfolioRow {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  profitLoss: number;
}

export function usePortfolio(intervalMs = 1000) {
  const [rows, setRows] = useState<PortfolioRow[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const requestIdRef = useRef(0);

  const marketSimulation = getMarketSimulation();

  const updatePortfolio = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    try {
      const holdings = await fetchHoldings();
      if (requestId !== requestIdRef.current) return;

      const updatedRows: PortfolioRow[] = holdings.map((h) => {
        const stock = marketSimulation.getStock(h.symbol);
        const currentPrice = stock ? stock.price : 0;

        return {
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
          currentPrice,
          profitLoss: (currentPrice - h.avgPrice) * h.quantity,
        };
      });

      setRows(updatedRows);
      setError(null);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      if (err instanceof Error) {
        setError(err);
        setRows([]);
        return;
      }

      setError(new Error("Unknown error"));
      setRows([]);
    }
  }, [marketSimulation]);

  useEffect(() => {
    updatePortfolio();

    const id = setInterval(() => {
      try {
        marketSimulation.simulatePrices();
        updatePortfolio();
      } catch (err) {
        console.error("Unexpected error in portfolio update interval:", err);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, marketSimulation, updatePortfolio]);

  return { rows, error };
}
