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
export const getWalletClient = async (provider: PrivyEmbeddedWalletProvider) => {
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

// Creates a public client using the Privy Embedded Wallet provider
export const getPublicClient = async (provider: PrivyEmbeddedWalletProvider) => {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x2105' }],
  });

  const publicClient = createPublicClient({
    chain: base,
    transport: custom(provider),
  });

  return publicClient;
};

// Signs any message using the wallet client
export const signMessage = async (provider: PrivyEmbeddedWalletProvider, message: string) => {
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
export const sendETH = async (
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
export const sendERC20 = async (
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
  } catch (error) {
    console.error('Error sending ERC-20 token:', error);
  }
};

// Calls the `register` method of the contract at 0x2441914218D4f50F27189C73cD3A1ADdedAB07B0
export const registerName = async (
  provider: PrivyEmbeddedWalletProvider,
  label: string,
  owner: `0x${string}`
) => {
  const contractAddress = '0x2441914218D4f50F27189C73cD3A1ADdedAB07B0';
  const client = await getWalletClient(provider);
  const [account] = await client.getAddresses();

  if (!owner.startsWith('0x') || owner.length !== 42) {
    console.error('Invalid owner address:', owner);
    return;
  }

  try {
    // ABI for `register` method
    const contractABI = [
      {
        name: 'register',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'label', type: 'string' },
          { name: 'owner', type: 'address' },
        ],
        outputs: [],
      },
    ];

    // Prepare data for the register method
    const data = encodeFunctionData({
      abi: contractABI,
      functionName: 'register',
      args: [label, owner],
    });

    // Send transaction
    const txHash = await client.sendTransaction({
      account: account,
      to: contractAddress,
      data: data,
      value: 0n, // No ETH is sent with the call
    });
  } catch (error) {
    console.error('Error calling register method:', error);
  }
};

// Calls the `approve` function of an ERC-20 token contract to set an allowance for a spender
export const approveERC20 = async (
  provider: PrivyEmbeddedWalletProvider,
  tokenAddress: `0x${string}`,
  spender: `0x${string}`,
  amount: bigint
) => {
  const client = await getWalletClient(provider);
  const [account] = await client.getAddresses();

  if (!spender.startsWith('0x') || spender.length !== 42) {
    console.error('Invalid spender address:', spender);
    return;
  }

  try {
    // ERC-20 ABI for `approve`
    const erc20ABI = [
      {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
      },
    ];

    const data = encodeFunctionData({
      abi: erc20ABI,
      functionName: 'approve',
      args: [spender, amount],
    });

    const txHash = await client.sendTransaction({
      account: account,
      to: tokenAddress,
      data: data,
      value: 0n, // No ETH is sent with the call
    });

    console.log('Approval transaction sent. Hash:', txHash);
  } catch (error) {
    console.error('Error setting ERC-20 token approval:', error);
  }
};
