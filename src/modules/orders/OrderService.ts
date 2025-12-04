// modules/orders/OrderService.ts

import { Order } from "./Order";
import { Portfolio } from "../portfolio/Portfolio";
import { marketService } from "../market/MarketService";

class OrderService {
  private portfolio = new Portfolio();

  getPortfolio() {
    return this.portfolio;
  }

  execute(order: Order) {
    const stock = marketService.getStock(order.symbol);
    if (!stock) return;

    if (order.type === "BUY") {
      this.portfolio.addStock(order.symbol, order.quantity, stock.price);
    }

    if (order.type === "SELL") {
      this.portfolio.removeStock(order.symbol, order.quantity);
    }
  }
}

export const orderService = new OrderService();
