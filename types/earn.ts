import { Token } from '~/types/supabaseTypes';

export type SortType = 'balance' | 'apy';

export type EarnToken = Token & {
  balance: number; // User's available balance
  value: number; // USD value of available balance
  staked: number; // Amount staked by the user
  stakedValue: number; // USD value of staked amount
  gains: number; // Gains in % since staking
  gainsValue: number; // Gains in USD
};

export type StakeTransaction = {
  id: string;
  token_address: string;
  amount: number;
  timestamp: string;
  type: 'stake' | 'unstake';
};
