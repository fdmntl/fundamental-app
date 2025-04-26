export type Value = {
  value: number;
  label: string;
};

export type Token = {
  address: string;
  name: string;
  symbol: string;
  digits: number;
  description: string;
  is_stablecoin: boolean;
  daily_values: Value[];
  weekly_values: Value[];
  monthly_values: Value[];
  yearly_values: Value[];
  last_value: number;
};

export type TokenList = Token[];

export type User = {
  id: string;
  created_at: string;
  wallet_address: string;
  ens?: string;
  balances: { address: string; balance: number; value: number }[];
  total_value_historic: Value[];
};

export type SubscriptionData = {
  new: any;
  old: any;
  eventType: string;
};

export enum FeedbackType {
  Bug = 'bug',
  FeatureRequest = 'feature_request',
  UiIssue = 'ui_issue',
  DesignCritique = 'design_critique',
  PerformanceIssue = 'performance_issue',
  Other = 'other',
}

export enum ScreenName {
  Home = 'home',
  Assets = 'assets',
  Trade = 'trade',
  Earn = 'earn',
  Send = 'send',
  Profile = 'profile',
  Other = 'other',
}
