export interface Holding {
    symbol: string;
    quantity: number;
    avgPrice: number;
}

export class Portfolio {
    private holdings: Holding[] = [];
    getHoldings() {
        return this.holdings;
    }

    getHolding(symbol: string) {
        return this.holdings.find((h) => h.symbol === symbol);
    }

    addStock(symbol: string, quantity: number, price: number) {
        const existing = this.holdings.find((h) => h.symbol === symbol);
        if (existing) {
            const totalCost = existing.quantity * existing.avgPrice+ price * quantity ;

            existing.quantity += quantity;
            existing.avgPrice = totalCost / existing.quantity;
        } else {
            this.holdings.push({ symbol, quantity, avgPrice: price });
        }
    }
    removeStock(symbol:string,quantity:number){
        const existing = this.holdings.find((h) => h.symbol === symbol);
        if(existing){
            existing.quantity -= quantity;
        }else{
            return;
        }
        if (existing.quantity<=0){
            this.holdings = this.holdings.filter((h)=>h.symbol!==symbol);
        }

    }


}