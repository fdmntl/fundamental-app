import { Token } from '~/types/supabaseTypes';

export const digitsToAmount = (amount: number, token: Token): number => {
  return amount / Math.pow(10, token.digits);
};
