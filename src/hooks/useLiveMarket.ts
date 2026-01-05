"use client";

import { useEffect, useState } from "react";
import { getMarketService } from "@/domain/market/MarketService";
import { Stock } from "@/domain/market/Stock";
import { ExpectedError } from "@/domain/errors/ExpectedError";

/**
 * Helper to check if an error is expected 
 */
function isExpectedError(err: unknown): err is ExpectedError {
  return err instanceof ExpectedError;
}

export function useLiveMarket(intervalMs = 1000) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const marketService = getMarketService();

  useEffect(() => {

    const update = () => {
      marketService.simulatePrices();
      setStocks([...marketService.getStocks()]);
      setError(null);
    };

    try {
      update(); // initial load
    } catch (err) {
      if (isExpectedError(err)) {
        setError(err);
        setStocks([]);
      } else {
        throw err;
      }
    }

    const interval = setInterval(() => {
      try {
        update();
      } catch (err) {
          console.error("Unexpected error in market update interval:", err);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return { stocks, error };
}
