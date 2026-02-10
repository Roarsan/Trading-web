import { Stock } from "@/domain/market/Stock";

export class MarketSimulation {
  private stocks: Stock[] = [];

  constructor() {
    this.stocks = [
      new Stock("AAPL", "Apple Inc.", 150),
      new Stock("TSLA", "Tesla Motors", 220),
      new Stock("AMZN", "Amazon Inc.", 125),
      new Stock("MSFT", "Microsoft", 310),
    ];
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
