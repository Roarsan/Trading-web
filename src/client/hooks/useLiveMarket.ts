"use client";

import { useEffect, useState } from "react";
import { connectLiveMarket } from "@/client/services/liveMarketSocket";
import type { LiveStock } from "@/shared/types/marketTypes";

export function useLiveMarket() {
  const [stocks, setStocks] = useState<LiveStock[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    return connectLiveMarket(
      (updatedStocks) => {
        setStocks(updatedStocks);
      },
      (err) => {
        setError(err);
      }
    );
  }, []);

  return { stocks, error };
}
