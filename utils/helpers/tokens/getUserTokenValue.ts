import { Token, User } from '~/types/supabaseTypes';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';

export const getUserTokenValue = (address: string, tokens: Token[], user: User) => {
  const token = tokens.find((token) => token.address === address);
  const value = token?.value[token.value.length - 1].value;
  const balance = getUserTokenAmount(address, tokens, user);

  if (!value || !balance) return 0;
  return parseFloat(value) * balance;
};
