export type Token = {
  address: string;
  name: string;
  symbol: string;
  digits: number;
  description: string;
  //   value: number;
  is_stablecoin: boolean;
};

export type TokenList = Token[];

export type SubscriptionData = {
  new: any;
  old: any;
  eventType: string;
};
