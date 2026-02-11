"use client";
import { useEffect, useState } from "react";
import { getMarketSimulation } from "@/client/services/marketSimulation";
import { Stock } from "@/domain/market/Stock";

export function useLiveMarket(intervalMs = 1000) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const marketSimulation = getMarketSimulation();
  useEffect(() => {
    const update = () => {
      marketSimulation.simulatePrices();
      setStocks([...marketSimulation.getStocks()]);
      setError(null);
    };

      try {
        update();
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          throw err;
        }
      }
    const interval = setInterval(() => {
      try {
        update();
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          throw err;
        }
      }
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);
  return { stocks, error };
}
