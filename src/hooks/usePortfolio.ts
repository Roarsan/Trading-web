"use client";

import { useEffect, useState } from "react";
import { getOrderService } from "@/domain/orders/OrderService";
import { getMarketService } from "@/domain/market/MarketService";
import { ExpectedError } from "@/domain/errors/ExpectedError";

export interface PortfolioRow {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  profitLoss: number;
}

/**
 * Helper to check if an error is expected 
 */
function isExpectedError(err: unknown): err is ExpectedError {
  return err instanceof ExpectedError;
}

export function usePortfolio(intervalMs = 1000) {
  const [rows, setRows] = useState<PortfolioRow[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const orderService = getOrderService();
  const marketService = getMarketService();

  const updatePortfolio = () => {
    try {
      const holdings = orderService
        .getPortfolio()
        .getHoldings()
        .filter((h) => h.quantity > 0);

      const updatedRows = holdings.map((h) => {
        const stock = marketService.getStock(h.symbol);
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
      if (isExpectedError(err)) {
        setError(err);
        setRows([]);
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    updatePortfolio();
  
    const id = setInterval(() => {
      try {
        marketService.simulatePrices();
        updatePortfolio();
      } catch (err) {
        console.error(
          "Unexpected error in portfolio update interval:",
          err
        );
      }
    }, intervalMs);
  
    return () => clearInterval(id);
  }, [intervalMs]);
  

  return { rows, error };
}
