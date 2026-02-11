export type OrderType = "BUY" | "SELL";

export class Order {
    symbol: string;
    quantity: number;
    type: OrderType;
    price: number;

    constructor(symbol: string, quantity: number, type: OrderType,price: number) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.type = type;
        this.price = price;

    }
}