import type { FinnhubMessage, LiveStock } from "@/shared/types/marketTypes";
import {
  DEFAULT_MARKET_STOCKS,
  DEFAULT_MARKET_STOCKS_BY_SYMBOL,
} from "@/shared/constants/marketStocks";

const SYMBOLS = DEFAULT_MARKET_STOCKS.map((stock) => stock.symbol);

export function connectLiveMarket(
  onUpdate: (stocks: LiveStock[]) => void,
  onError: (error: Error) => void
) {
  const token = process.env.NEXT_PUBLIC_FINNHUB_TOKEN;
  //show the default stocks
  const defaultStocks = new Map<string, LiveStock>(
    DEFAULT_MARKET_STOCKS.map((stock) => [stock.symbol, { ...stock }]),
  );

  onUpdate(Array.from(defaultStocks.values()).sort((a, b) => a.symbol.localeCompare(b.symbol)));

  if (!token) {
    onError(new Error("Missing NEXT_PUBLIC_FINNHUB_TOKEN"));
    return () => {};
  }

 const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`);

  ws.onopen = () => {
    SYMBOLS.forEach((symbol) => {
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    });
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data) as FinnhubMessage;

    if (message.type === "error") {
      onError(new Error(message.msg ?? "Live market websocket error"));
      return;
    }

    if (message.type !== "trade" || !message.data) return;

    message.data.forEach((trade) => {
      const stockInfo = DEFAULT_MARKET_STOCKS_BY_SYMBOL.get(trade.s);
      defaultStocks.set(trade.s, {
        symbol: trade.s,
        name: stockInfo?.name ?? trade.s,
        price: trade.p,
      });
    });

    onUpdate(Array.from(defaultStocks.values()).sort((a, b) => a.symbol.localeCompare(b.symbol)));
  };

  return () => {
    SYMBOLS.forEach((symbol) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
      }
    });

    ws.close();
  };
}
