type Value = {
  value: string;
  timestamp: string;
};

export type Token = {
  address: string;
  name: string;
  symbol: string;
  digits: number;
  description: string;
  value: Value[];
  is_stablecoin: boolean;
};

export type TokenList = Token[];

export type UserData = {
  id: string;
  created_at: string;
  wallet_address: string;
  ens?: string;
  balances: { [key: string]: number };
  selected_money?: string;
};

export type SubscriptionData = {
  new: any;
  old: any;
  eventType: string;
};
