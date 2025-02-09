import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';

import { approveERC20 } from '~/services/viemService';
import { maxUint256 } from 'viem';

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
