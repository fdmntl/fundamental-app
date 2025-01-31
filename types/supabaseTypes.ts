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
  is_stablecoin: boolean;
  daily_value: Value[];
  weekly_value: Value[];
  monthly_value: Value[];
  yearly_value: Value[];
  last_value: number;
};

export type TokenList = Token[];

export type User = {
  id: string;
  created_at: string;
  wallet_address: string;
  ens?: string;
  balances: { token_address: string; balance: number }[];
  selected_money?: string;
};

export type SubscriptionData = {
  new: any;
  old: any;
  eventType: string;
};
