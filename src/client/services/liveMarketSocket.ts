import type { FinnhubMessage, LiveStock } from "@/shared/types/marketTypes";

const SYMBOL_NAMES: Record<string, string> = {
  AAPL: "Apple Inc.",
  TSLA: "Tesla Motors",
  AMZN: "Amazon Inc.",
  MSFT: "Microsoft",
};

const SYMBOLS = Object.keys(SYMBOL_NAMES);

export function connectLiveMarket(
  onUpdate: (stocks: LiveStock[]) => void,
  onError: (error: Error) => void
) {
  const token = process.env.NEXT_PUBLIC_FINNHUB_TOKEN;

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

  const prices = new Map<string, LiveStock>();

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data) as FinnhubMessage;

    if (message.type === "error") {
      onError(new Error(message.msg ?? "Live market websocket error"));
      return;
    }

    if (message.type !== "trade" || !message.data) return;

    message.data.forEach((trade) => {
      prices.set(trade.s, {
        symbol: trade.s,
        name: SYMBOL_NAMES[trade.s] ?? trade.s,
        price: trade.p,
      });
    });

    onUpdate(Array.from(prices.values()).sort((a, b) => a.symbol.localeCompare(b.symbol)));
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
