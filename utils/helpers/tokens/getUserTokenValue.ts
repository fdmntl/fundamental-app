import { Token, User } from '~/types/supabaseTypes';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';

/**
 * Helper function to get the value of a token for a user
 * @param address 0x4200000000000000000000000000000000000006
 * @param tokens [{ address: '0x420 ...', last_value: 100 }] tokens array from appData
 * @param user { balances: [{ address: '0x420 ...', balance: 100 }] } user object from appData
 * @returns 10000 (token value)
 */
export const getUserTokenValue = (address: string, tokens: Token[], user: User): number => {
  const token = tokens.find((token) => token.address === address);
  const value = token?.last_value;
  const balance = getUserTokenAmount(address, tokens, user);

  if (!value || !balance) return 0;
  return value * balance;
};
