export class Stock {
    symbol: string;
    name: string;
    price: number;

    constructor(symbol:string,name: string,price:number){
        this.symbol = symbol;
        this.name = name;
        this.price = price;
    }

    updatePrice(amount:number){
        this.price = this.price + amount;
    }

}
