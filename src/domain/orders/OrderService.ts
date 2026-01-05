

import { Order } from "./Order";
import { Portfolio } from "../portfolio/Portfolio";
import { getMarketService } from "../market/MarketService";
import { StockNotFoundError } from "../errors/ExpectedError";

class OrderService {
  private portfolio = new Portfolio();

  getPortfolio() {
    return this.portfolio;
  }

  execute(order: Order) {
    const stock = getMarketService().getStock(order.symbol);

    if (!stock) {
      throw new StockNotFoundError(order.symbol);
    }

    if (order.type === "BUY") {
      this.portfolio.addStock(order.symbol, order.quantity, stock.price);
    }

    if (order.type === "SELL") {
      this.portfolio.removeStock(order.symbol, order.quantity);
    }
  }
}

let orderService: OrderService | null = null;
export function getOrderService() {
  if (!orderService) {
    orderService = new OrderService();
  }
  return orderService;
}
