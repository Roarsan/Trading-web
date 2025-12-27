export interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

export class Portfolio {
  private holdings: Holding[] = [];

  private storageKey = "trading-portfolio";

  constructor() {
    this.loadFromStorage();
  }

  //get the strings from local storge parse it to object and assigns it to holdings
  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.holdings = parsed.holdings || [];
        } catch {
          this.holdings = [];
        }
      }
    }
  }

  //set the item in local storage using the key and stringifies holdings
  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({ holdings: this.holdings })
      );
    }
  }

  getHoldings() {
    this.loadFromStorage();
    return this.holdings;
  }

  getHolding(symbol: string) {
    return this.holdings.find((h) => h.symbol === symbol);
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
    this.saveToStorage();
  }
  
  removeStock(symbol: string, quantity: number) {
    const existing = this.holdings.find((h) => h.symbol === symbol);
    if (existing) {
      existing.quantity -= quantity;
    } else {
      return;
    }
    if (existing.quantity <= 0) {
      this.holdings = this.holdings.filter((h) => h.symbol !== symbol);
    }
    this.saveToStorage();
  }


}

