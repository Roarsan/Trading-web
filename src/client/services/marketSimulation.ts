import { Stock } from "@/domain/market/Stock";
import { DEFAULT_MARKET_STOCKS } from "@/shared/constants/marketStocks";

export class MarketSimulation {
  private stocks: Stock[] = [];

  constructor() {
    this.stocks = DEFAULT_MARKET_STOCKS.map(
      (stock) => new Stock(stock.symbol, stock.name, stock.price),
    );
  }

  getStocks(): Stock[] {
    return this.stocks;
  }

  getStock(symbol: string): Stock | undefined {
    return this.stocks.find((s) => s.symbol === symbol);
  }

  simulatePrices() {
    this.stocks.forEach((stock) => {
      const movement = (Math.random() - 0.5) * 2;
      stock.updatePrice(movement);
    });
  }
}

let marketSimulation: MarketSimulation | null = null;

export function getMarketSimulation() {
  if (!marketSimulation) {
    marketSimulation = new MarketSimulation();
  }
  return marketSimulation;
}
