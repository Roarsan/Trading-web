import { Stock } from "./Stock";

export class MarketService {
    private stocks: Stock[] = [];

    constructor() {
        // Seed market with initial data
        this.stocks = [
            new Stock("AAPL", "Apple Inc.", 150),
            new Stock("TSLA", "Tesla Motors", 220),
            new Stock("AMZN", "Amazon Inc.", 125),
            new Stock("MSFT", "Microsoft", 310),
        ];
    }

    getStocks() {
        return this.stocks;
    }

    getStock(symbol: string) {
        return this.stocks.find((s) => s.symbol === symbol);
    }

    simulatePrices() {
        // Random walk algorithm
        this.stocks.forEach((stock) => {
            const movement = (Math.random() - 0.5) * 2; // -1 to +1
            stock.updatePrice(movement);
        });
    }
}
export const marketService = new MarketService();