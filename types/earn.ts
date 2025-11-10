import { Token } from '~/types/supabaseTypes';

export type SortType = 'balance' | 'apy';

export type EarnToken = Token & {
  balance: number; // Balance disponible de l'utilisateur
  value: number; // Valeur USD de la balance disponible
  staked: number; // Montant staké par l'utilisateur
  stakedValue: number; // Valeur USD du montant staké
  gains: number; // Gains en % depuis le stake
  gainsValue: number; // Gains en USD
};

export type StakeTransaction = {
  id: string;
  token_address: string;
  amount: number;
  timestamp: string;
  type: 'stake' | 'unstake';
};