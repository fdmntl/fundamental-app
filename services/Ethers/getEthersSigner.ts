import { ethers } from 'ethers';
import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';

export const getEthersSigner = (provider: PrivyEmbeddedWalletProvider) => {
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const ethersSigner = ethersProvider.getSigner();
  return ethersSigner;
};
