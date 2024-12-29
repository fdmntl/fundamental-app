type Value = {
  value: string;
  timestamp: string;
};

export type Token = {
  address: string;
  name: string;
  logo: string | null;
  symbol: string;
  digits: number;
  description: string;
  value: Value[];
  is_stablecoin: boolean;
};

export type TokenList = Token[];

export type SubscriptionData = {
  new: any;
  old: any;
  eventType: string;
};
