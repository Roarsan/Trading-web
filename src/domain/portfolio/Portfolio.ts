import type { Holding } from "@/shared/types/portfolio";
import { InsufficientQuantityError, HoldingNotFoundError } from "../expectedError/ExpectedError";

export class Portfolio {
  constructor(private holdings: Holding[] = []) {}

  getHoldings() {
    return this.holdings;
  }

  addStock(symbol: string, quantity: number, price: number) {
    const existing = this.holdings.find((h) => h.symbol === symbol);
    if (existing) {
      const totalCost = existing.quantity * existing.avgPrice + price * quantity;
      existing.quantity += quantity;
      existing.avgPrice = totalCost / existing.quantity;
    } else {
      this.holdings.push({ symbol, quantity, avgPrice: price });
    }
  }

  removeStock(symbol: string, quantity: number) {
    const existing = this.holdings.find((h) => h.symbol === symbol);
    if (!existing) throw new HoldingNotFoundError(symbol);
    if (existing.quantity < quantity) {
      throw new InsufficientQuantityError(symbol, existing.quantity, quantity);
    }
    existing.quantity -= quantity;
    if (existing.quantity <= 0) {
      this.holdings = this.holdings.filter((h) => h.symbol !== symbol);
    }
  }
}

