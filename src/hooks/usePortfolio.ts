"use client";

import { useEffect, useState } from "react";
import { getOrderService } from "@/domain/orders/OrderService";
import { getMarketService } from "@/domain/market/MarketService";

export interface PortfolioRow {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  profitLoss: number;
}

export function usePortfolio(intervalMs = 1000) {
  const [rows, setRows] = useState<PortfolioRow[]>([]);
  const orderService = getOrderService();
  const marketService = getMarketService();

  const updatePortfolio = () => {
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
  };

  useEffect(() => {
    updatePortfolio();

    const id = setInterval(() => {
      marketService.simulatePrices();
      updatePortfolio();
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return rows;
}
