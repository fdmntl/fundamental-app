import { ethers } from 'ethers';
import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';

export const getEthersSigner = async (provider: PrivyEmbeddedWalletProvider) => {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x2105' }],
  });
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const ethersSigner = ethersProvider.getSigner();
  return ethersSigner;
};
