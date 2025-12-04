export type OrderType = "BUY" | "SELL";

export class Order{
    symbol:string;
    quantity:number;
    type:OrderType;

    constructor(    symbol:string,quantity:number,type:OrderType){
        this.symbol = symbol;
        this.quantity = quantity;
        this.type = type;
    }
}