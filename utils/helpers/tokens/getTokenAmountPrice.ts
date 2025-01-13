import { Token } from '~/types/supabaseTypes';

export const getTokenAmountPrice = (address: string, amount: number, tokens: Token[]): number => {
  const token = tokens.find((t) => t.address === address);
  if (!token || token.value.length === 0) return 0;

  const latestPrice = Number(token.value.at(-1)?.value ?? 0);
  return latestPrice * amount;
};
