export type Holding = {
  symbol: string;
  quantity: number;
  avgPrice: number;
};

export type PortfolioResponse = {
  holdings: Holding[];
};
