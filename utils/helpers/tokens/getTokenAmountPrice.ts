import { Token } from '~/types/supabaseTypes';

/**
 * Helper function to get the price of a token amount
 * @param address 0x4200000000000000000000000000000000000006
 * @param amount 1 (token amount)
 * @param tokens [{ address: '0x420 ...', last_value: 100 }] tokens array from appData
 * @returns 100 (price of 1 token)
 */
export const getTokenAmountPrice = (address: string, amount: number, tokens: Token[]): number => {
  const token = tokens.find((t) => t.address === address);
  if (!token || token.last_value === 0) return 0;

  const latestPrice = token.last_value;
  return latestPrice * amount;
};
