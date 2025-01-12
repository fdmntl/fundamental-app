import { Token, User } from '~/types/supabaseTypes';

export const getUserTokenAmount = (address: string, tokens: Token[], user: User): number => {
  const balanceObj = user.balances.find((b) => b.token_address === address);
  const digits = tokens.find((token) => token.address === address)?.digits;

  if (!balanceObj || !digits || digits === 0) return 0;

  const tokenAmount = balanceObj.balance / Math.pow(10, digits);
  return tokenAmount;
};
