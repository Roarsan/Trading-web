import type { LiveStock } from "@/shared/types/marketTypes";

export const DEFAULT_MARKET_STOCKS: LiveStock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 150 },
  { symbol: "TSLA", name: "Tesla Motors", price: 220 },
  { symbol: "AMZN", name: "Amazon Inc.", price: 125 },
  { symbol: "MSFT", name: "Microsoft", price: 310 },
];

export const DEFAULT_MARKET_STOCKS_BY_SYMBOL = new Map(
  DEFAULT_MARKET_STOCKS.map((stock) => [stock.symbol, stock]),
);
