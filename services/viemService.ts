import {
  createWalletClient,
  custom,
  encodeFunctionData,
  createPublicClient,
  http,
  getContract,
} from 'viem';
import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';
import { base } from 'viem/chains';

// Creates a wallet client using the Privy Embedded Wallet provider
const getWalletClient = async (provider: PrivyEmbeddedWalletProvider) => {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x2105' }],
  });

  const walletClient = createWalletClient({
    chain: base,
    transport: custom(provider),
  });

  return walletClient;
};

// Signs any message using the wallet client
const signMessage = async (provider: PrivyEmbeddedWalletProvider, message: string) => {
  const client = await getWalletClient(provider);
  const [account] = await client.getAddresses();

  try {
    const signature = await client.signMessage({
      account,
      message,
    });
  } catch (error) {
    console.error('Error signing message:', error);
  }
};

// Sends ETH to a destination address
const sendETH = async (
  provider: PrivyEmbeddedWalletProvider,
  destination: string,
  amount: bigint // Amount in wei
) => {
  const client = await getWalletClient(provider);
  const [account] = await client.getAddresses();

  if (!destination.startsWith('0x') || destination.length !== 42) {
    console.error('Invalid destination address:', destination);
    return;
  }

  const to = destination as `0x${string}`;
  try {
    const txHash = await client.sendTransaction({
      account: account,
      from: account,
      to,
      value: amount,
    });
  } catch (error) {
    console.error('Error sending ETH:', error);
  }
};

// Calls the `transfer` function of an ERC-20 token contract to send tokens to a destination address
const sendERC20 = async (
  provider: PrivyEmbeddedWalletProvider,
  tokenAddress: `0x${string}`,
  destination: `0x${string}`,
  amount: bigint
) => {
  const client = await getWalletClient(provider);
  const [account] = await client.getAddresses();

  if (!destination.startsWith('0x') || destination.length !== 42) {
    console.error('Invalid destination address:', destination);
    return;
  }

  try {
    // ERC-20 ABI for `transfer`
    const erc20ABI = [
      {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'recipient', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
      },
    ];

    const data = encodeFunctionData({
      abi: erc20ABI,
      functionName: 'transfer',
      args: [destination, amount],
    });

    const txHash = await client.sendTransaction({
      account: account,
      to: tokenAddress,
      data: data,
      value: 0n, // No ETH is sent with the call
    });

    console.log(`Transaction sent: ${txHash}`);
  } catch (error) {
    console.error('Error sending ERC-20 token:', error);
  }
};

export default { getWalletClient, signMessage, sendETH, sendERC20 };
