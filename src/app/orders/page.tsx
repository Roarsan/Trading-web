"use client";

import { useState } from "react";
import { ErrorPopup } from "@/client/components/error/ErrorPopup";
import { ValidationError, ExpectedError } from "@/domain/expectedError/ExpectedError";
import { OrderType } from "@/domain/orders/Order";
import { placeOrder } from "../../client/services/orderApi";
import { useLiveMarket } from "@/client/hooks/useLiveMarket";

function isExpectedError(err: unknown): err is ExpectedError {
  return err instanceof ExpectedError;
}

export default function OrdersPage() {
  const [error, setError] = useState<Error | null>(null);
  const { stocks, error: marketError } = useLiveMarket();

  const [message, setMessage] = useState("");
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState<number>(0);


  const submitOrder = async (type: OrderType) => {
    setError(null);
    setMessage("");

    if (marketError) {
      setError(marketError);
      return;
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol || quantity <= 0) {
      setError(new ValidationError("Please enter valid symbol and quantity."));
      return;
    }

    const marketStock = stocks.find((stock) => stock.symbol === normalizedSymbol);
    if (!marketStock) {
      setError(new ValidationError("Symbol not found in live market data."));
      return;
    }

    try {
      await placeOrder({
        symbol,
        quantity,
        type,
        price: marketStock.price,
      });

      setMessage(
        `Successfully executed ${type} order for ${quantity} shares of ${symbol}`
      );
      setSymbol("");
      setQuantity(0);
    } catch (err) {
      if (isExpectedError(err)) {
        setError(err);
        setMessage("");
      } else if (err instanceof Error) {
        setError(new ValidationError(err.message));
      } else {
        setError(new ValidationError("Something went wrong"));
      }
    }
  };

  return (
    <main className="page">
      <ErrorPopup error={error} onClose={() => setError(null)} />

      <div className="container-lg">
        <h1 className="page-title">Place an Order</h1>

        {message && (
          <div className="banner-success">
            <p className="text-strong">{message}</p>
          </div>
        )}

        <section className="card card-padded-lg stack">
          <div>
            <label className="form-label">Stock Symbol</label>
            <input
              type="text"
              placeholder="Stock Symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Quantity</label>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-input"
            />
          </div>

          <div className="row-gap pt-4">
            <button
              onClick={() => submitOrder("BUY")}
              className="button button-green button-stretch"
            >
              Buy
            </button>

            <button
              onClick={() => submitOrder("SELL")}
              className="button button-red button-stretch"
            >
              Sell
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
