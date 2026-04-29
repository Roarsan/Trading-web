"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchHoldings } from "@/client/services/portfolioApi";
import { useLiveMarket } from "@/client/hooks/useLiveMarket";

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

  const { stocks, error: marketError } = useLiveMarket();

  const updatePortfolio = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    try {
      const holdings = await fetchHoldings();
      if (requestId !== requestIdRef.current) return;

      const stockBySymbol = new Map(stocks.map((stock) => [stock.symbol, stock]));
      const updatedRows: PortfolioRow[] = holdings.map((h) => {
        const stock = stockBySymbol.get(h.symbol);
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
      setError(marketError);
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
  }, [stocks, marketError]);

  useEffect(() => {
    const initialId = window.setTimeout(updatePortfolio, 0);

    const id = setInterval(updatePortfolio, intervalMs);

    return () => {
      window.clearTimeout(initialId);
      clearInterval(id);
    };
  }, [intervalMs, updatePortfolio]);

  return { rows, error };
}
