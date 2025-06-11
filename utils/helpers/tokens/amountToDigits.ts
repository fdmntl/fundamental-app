import { Token } from '~/types/supabaseTypes';

/**
 * Helper function to convert an amount to digits
 * @param amount 1
 * @param token { digits: 10 }
 * @returns 10000000000
 */
export const amountToDigits = (amount: number, token: Token): number => {
  return amount * Math.pow(10, token.digits);
};
