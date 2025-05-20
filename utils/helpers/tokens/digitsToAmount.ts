import { Token } from '~/types/supabaseTypes';

/**
 * Helper function to convert digits to an amount
 * @param amount 10000000000
 * @param token { digits: 10 }
 * @returns 1
 */
export const digitsToAmount = (amount: number, token: Token): number => {
  return amount / Math.pow(10, token.digits);
};
