import { Token, User } from '~/types/supabaseTypes';

/**
 * Helper function to get amount of a token for a user
 * @param address 0x4200000000000000000000000000000000000006
 * @param tokens [{ address: '0x420 ...', digits: 10 }] tokens array from appData
 * @param user { balances: [{ address: '0x420 ...', balance: 100 }] } user object from appData
 * @returns 100 (token amount)
 */
export const getUserTokenAmount = (address: string, tokens: Token[], user: User): number => {
  if (!user || !user.balances || user.balances.length === 0) return 0;
  const balanceObj = user.balances.find((b) => b.address === address);
  const digits = tokens.find((token) => token.address === address)?.digits;

  if (!balanceObj || !digits || digits === 0) return 0;

  const tokenAmount = balanceObj.balance / Math.pow(10, digits);
  return tokenAmount;
};
