"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchHoldings } from "@/client/services/portfolioApi";
import { useLiveMarket } from "@/client/hooks/useLiveMarket";

export interface PortfolioRow {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  profitLoss: number;
}

interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const { stocks, error: marketError } = useLiveMarket();

  const refreshHoldings = useCallback(async () => {
    try {
      const data = await fetchHoldings();
      setHoldings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setHoldings([]);
    }
  }, []);

  useEffect(() => {
    refreshHoldings();
  }, [refreshHoldings]);

  const rows: PortfolioRow[] = useMemo(() => {
    const stockBySymbol = new Map(
      stocks.map((stock) => [stock.symbol, stock])
    );

    return holdings.map((holding) => {
      const stock = stockBySymbol.get(holding.symbol);

      const currentPrice = stock?.price ?? holding.avgPrice;

      return {
        symbol: holding.symbol,
        quantity: holding.quantity,
        avgPrice: holding.avgPrice,
        currentPrice,
        profitLoss:
          (currentPrice - holding.avgPrice) * holding.quantity,
      };
    });
  }, [holdings, stocks]);

  return {
    rows,
    error: error ?? marketError,
    refreshHoldings,
  };
}