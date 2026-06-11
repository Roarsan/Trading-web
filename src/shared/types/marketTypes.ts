export interface LiveStock {
  symbol: string;
  name: string;
  price: number;
}

export interface FinnhubTrade {
  s: string;
  p: number;
  t: number;
  v: number;
}

export interface FinnhubMessage {
  type: string;
  data?: FinnhubTrade[];
  msg?: string;
}
