import { useAppData } from '~/components/Wrappers/AppData';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';

export const getUserTokenValue = (address: string) => {
  const { tokens, user } = useAppData();
  const token = tokens.find((token) => token.address === address);
  const value = token?.value[token.value.length - 1].value;
  const balance = getUserTokenAmount(address);

  if (!value || !balance) return 0;
  return parseFloat(value) * balance;
};
