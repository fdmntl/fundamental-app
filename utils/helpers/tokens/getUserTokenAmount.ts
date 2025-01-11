import { useAppData } from '~/components/Wrappers/AppData';

export const getUserTokenAmount = (address: string): number => {
  const { tokens, user } = useAppData();
  const balanceObj = user.balances.find((b) => b.token_address === address);
  const digits = tokens.find((token) => token.address === address)?.digits;

  if (!balanceObj || !digits || digits === 0) return 0;
  return balanceObj.balance / Math.pow(10, digits);
};
