import { Portfolio } from "../portfolio/Portfolio";
import type { Holding } from "@/shared/types/portfolio";
import type { Order } from "./Order";
export class OrderService {
  execute(holdings: Holding[], order: Order): Holding[] {
    const portfolio = new Portfolio(holdings);

    if (order.type === "BUY") {
      portfolio.addStock(order.symbol, order.quantity, order.price);
    }

    if (order.type === "SELL") {
      portfolio.removeStock(order.symbol, order.quantity);
    }
    return portfolio.getHoldings();
  }
}
