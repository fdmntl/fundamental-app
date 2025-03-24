import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';
import { maxUint256 } from 'viem';

import { approveERC20, checkERC20Allowance } from '~/services/viemService';

const cowRelayerAddress = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110';

// sets infinite allowance for the cow contract to spend a token
export const setCowInfiniteAllowance = async (
  provider: PrivyEmbeddedWalletProvider,
  tokenAddress: string
) => {
  approveERC20(
    provider,
    tokenAddress as `0x${string}`,
    cowRelayerAddress as `0x${string}`,
    BigInt(maxUint256)
  );
};

export const checkAndSetCowAllowance = async (
  provider: PrivyEmbeddedWalletProvider,
  tokenAddress: string,
  userAddress: string
) => {
  const allowance = await checkERC20Allowance(
    provider,
    tokenAddress,
    userAddress,
    cowRelayerAddress
  );

  // if allowance is less than maxUint256, set infinite allowance
  if (BigInt(allowance) < BigInt(maxUint256)) {
    setCowInfiniteAllowance(provider, tokenAddress);
  }
};
