
export class ExpectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpectedError";
    // trace the location at which error was called except expcted errors
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExpectedError);
    }
  }
}

export class StockNotFoundError extends ExpectedError {
  constructor(symbol: string) {
    super(`Stock ${symbol} not found in market`);
    this.name = "StockNotFoundError";
  }
}

export class InsufficientQuantityError extends ExpectedError {
  constructor(symbol: string, owned: number, requested: number) {
    super(`Insufficient quantity. You own ${owned} shares of ${symbol}, but trying to sell ${requested}`);
    this.name = "InsufficientQuantityError";
  }
}

export class HoldingNotFoundError extends ExpectedError {
  constructor(symbol: string) {
    super(`No holdings found for symbol ${symbol}`);
    this.name = "HoldingNotFoundError";
  }
}

export class ValidationError extends ExpectedError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}


