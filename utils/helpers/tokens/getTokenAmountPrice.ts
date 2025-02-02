import { Token } from '~/types/supabaseTypes';

export const getTokenAmountPrice = (address: string, amount: number, tokens: Token[]): number => {
  const token = tokens.find((t) => t.address === address);
  if (!token || token.last_value === 0) return 0;

  const latestPrice = token.last_value;
  return latestPrice * amount;
};
