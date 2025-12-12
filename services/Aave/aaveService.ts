import { PrivyEmbeddedWalletProvider, EmbeddedWalletState } from '@privy-io/expo';
import {
  createWalletClient,
  createPublicClient,
  custom,
  formatUnits,
  parseUnits,
  getAddress,
} from 'viem';
import { base } from 'viem/chains';

import { trackEvent } from '~/services/PostHog/trackEvent';
import { EarnToken } from '~/types/earn';
import { Token } from '~/types/supabaseTypes';

// Constants
const AAVE_POOL_ADDRESS = '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5';

const SUPPORTED_TOKENS = {
  USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  WETH: '0x4200000000000000000000000000000000000006',
  cbBTC: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
} as const;

// ABIs
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
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
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
];

const AAVE_POOL_ABI = [
  {
    name: 'supply',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'asset', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'onBehalfOf', type: 'address' },
      { name: 'referralCode', type: 'uint16' },
    ],
    outputs: [],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'asset', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'to', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getReserveData',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'asset', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'configuration', type: 'uint256' },
          { name: 'liquidityIndex', type: 'uint128' },
          { name: 'currentLiquidityRate', type: 'uint128' },
          { name: 'variableBorrowIndex', type: 'uint128' },
          { name: 'currentVariableBorrowRate', type: 'uint128' },
          { name: 'currentStableBorrowRate', type: 'uint128' },
          { name: 'lastUpdateTimestamp', type: 'uint40' },
          { name: 'id', type: 'uint16' },
          { name: 'aTokenAddress', type: 'address' },
          { name: 'stableDebtTokenAddress', type: 'address' },
          { name: 'variableDebtTokenAddress', type: 'address' },
          { name: 'interestRateStrategyAddress', type: 'address' },
          { name: 'accruedToTreasury', type: 'uint128' },
          { name: 'unbacked', type: 'uint128' },
          { name: 'isolationModeTotalDebt', type: 'uint128' },
        ],
      },
    ],
  },
];

// Helper: Get wallet and public clients
const getClients = async (provider: PrivyEmbeddedWalletProvider) => {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x2105' }],
  });

  const walletClient = createWalletClient({
    chain: base,
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain: base,
    transport: custom(provider),
  });

  const [account] = await walletClient.getAddresses();

  return { walletClient, publicClient, account };
};

/**
 * Deposit tokens to Aave V3
 * @param tokenSymbol - Token symbol from SUPPORTED_TOKENS (e.g., 'USDC', 'WETH')
 * @param amount - Amount to deposit (in human-readable format)
 * @param wallet - The embedded wallet state
 * @returns Transaction hash
 */
export const depositToAave = async (
  tokenSymbol: keyof typeof SUPPORTED_TOKENS,
  amount: string,
  wallet: EmbeddedWalletState | undefined
): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  console.log(`Depositing ${amount} of ${tokenSymbol} to Aave`);

  if (!wallet || wallet.status !== 'connected') {
    return { success: false, error: 'Wallet not connected' };
  }

  const tokenAddress = SUPPORTED_TOKENS[tokenSymbol];
  if (!tokenAddress) {
    return { success: false, error: `Token ${tokenSymbol} not supported` };
  }

  try {
    const normalizedAddress = getAddress(tokenAddress.toLowerCase());
    const provider = await wallet.getProvider();
    const { walletClient, publicClient, account } = await getClients(provider);

    // Get token decimals
    const decimals = (await publicClient.readContract({
      address: normalizedAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })) as number;

    const amountInWei = parseUnits(amount, decimals);

    // Special handling for WETH: Check if user has ETH and needs to wrap
    if (tokenSymbol === 'WETH') {
      const wethBalance = (await publicClient.readContract({
        address: normalizedAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [account],
      })) as bigint;

      // If insufficient WETH, try to wrap ETH
      if (wethBalance < amountInWei) {
        const ethBalance = await publicClient.getBalance({ address: account });
        const neededAmount = amountInWei - wethBalance;

        if (ethBalance < neededAmount) {
          return { success: false, error: 'Insufficient ETH balance to wrap' };
        }

        console.log(`Wrapping ${formatUnits(neededAmount, decimals)} ETH to WETH...`);
        const wrapHash = await walletClient.writeContract({
          address: normalizedAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'deposit',
          value: neededAmount,
          account,
        });

        await publicClient.waitForTransactionReceipt({ hash: wrapHash });
        console.log('ETH wrapped successfully:', wrapHash);
      }
    }

    // Check balance
    const balance = (await publicClient.readContract({
      address: normalizedAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [account],
    })) as bigint;

    if (balance < amountInWei) {
      return { success: false, error: 'Insufficient balance' };
    }

    // Check allowance
    const allowance = (await publicClient.readContract({
      address: normalizedAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [account, AAVE_POOL_ADDRESS],
    })) as bigint;

    // Approve if needed
    if (allowance < amountInWei) {
      console.log('Approving token spend...');
      const approvalHash = await walletClient.writeContract({
        address: normalizedAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [AAVE_POOL_ADDRESS, amountInWei],
        account,
      });

      await publicClient.waitForTransactionReceipt({ hash: approvalHash });
      console.log('Approval successful:', approvalHash);
    }

    // Supply to Aave
    console.log('Supplying to Aave...');
    const supplyHash = await walletClient.writeContract({
      address: AAVE_POOL_ADDRESS as `0x${string}`,
      abi: AAVE_POOL_ABI,
      functionName: 'supply',
      args: [normalizedAddress, amountInWei, account, 0],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash: supplyHash });
    console.log('Supply successful:', supplyHash);

    trackEvent('aave_deposit', {
      token: tokenSymbol,
      amount,
      txHash: supplyHash,
    });

    return { success: true, txHash: supplyHash };
  } catch (error) {
    console.error('Error depositing to Aave:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Withdraw tokens from Aave V3
 * @param tokenSymbol - Token symbol from SUPPORTED_TOKENS (e.g., 'USDC', 'WETH')
 * @param amount - Amount to withdraw (in human-readable format, use 'max' for all)
 * @param wallet - The embedded wallet state
 * @returns Transaction hash
 */
export const withdrawFromAave = async (
  tokenSymbol: keyof typeof SUPPORTED_TOKENS,
  amount: string,
  wallet: EmbeddedWalletState | undefined
): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  console.log(`Withdrawing ${amount} of ${tokenSymbol} from Aave`);

  if (!wallet || wallet.status !== 'connected') {
    return { success: false, error: 'Wallet not connected' };
  }

  const tokenAddress = SUPPORTED_TOKENS[tokenSymbol];
  if (!tokenAddress) {
    return { success: false, error: `Token ${tokenSymbol} not supported` };
  }

  try {
    const normalizedAddress = getAddress(tokenAddress.toLowerCase());
    const provider = await wallet.getProvider();
    const { walletClient, publicClient, account } = await getClients(provider);

    // Get reserve data to find aToken address
    const reserveData = (await publicClient.readContract({
      address: AAVE_POOL_ADDRESS as `0x${string}`,
      abi: AAVE_POOL_ABI,
      functionName: 'getReserveData',
      args: [normalizedAddress],
    })) as any;

    const aTokenAddress = reserveData.aTokenAddress;

    // Get aToken balance (staked amount)
    const aTokenBalance = (await publicClient.readContract({
      address: aTokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [account],
    })) as bigint;

    if (aTokenBalance === 0n) {
      return { success: false, error: 'No staked balance to withdraw' };
    }

    // Determine withdrawal amount
    let amountInWei: bigint;
    if (amount.toLowerCase() === 'max') {
      amountInWei = aTokenBalance;
    } else {
      const decimals = (await publicClient.readContract({
        address: normalizedAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      })) as number;
      amountInWei = parseUnits(amount, decimals);
    }

    if (amountInWei > aTokenBalance) {
      return { success: false, error: 'Insufficient staked balance' };
    }

    // Withdraw from Aave (use max uint256 for full withdrawal)
    const withdrawAmount =
      amount.toLowerCase() === 'max'
        ? BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
        : amountInWei;

    console.log('Withdrawing from Aave...');
    const withdrawHash = await walletClient.writeContract({
      address: AAVE_POOL_ADDRESS as `0x${string}`,
      abi: AAVE_POOL_ABI,
      functionName: 'withdraw',
      args: [normalizedAddress, withdrawAmount, account],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash: withdrawHash });
    console.log('Withdrawal successful:', withdrawHash);

    trackEvent('aave_withdraw', {
      token: tokenSymbol,
      amount,
      txHash: withdrawHash,
    });

    return { success: true, txHash: withdrawHash };
  } catch (error) {
    console.error('Error withdrawing from Aave:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get staked balance and gains for a token
 * @param tokenSymbol - Token symbol from SUPPORTED_TOKENS (e.g., 'USDC', 'WETH')
 * @param wallet - The embedded wallet state
 * @param initialAmount - Initial deposit amount (optional, for calculating gains)
 * @returns Staked balance and gains information
 */
export const getStakedBalance = async (
  tokenSymbol: keyof typeof SUPPORTED_TOKENS,
  wallet: EmbeddedWalletState | undefined,
  initialAmount?: number
): Promise<{
  success: boolean;
  staked: number;
  gains: number;
  gainsPercentage: number;
  apy: number;
  error?: string;
}> => {
  console.log(`Getting staked balance for ${tokenSymbol}`);

  if (!wallet || wallet.status !== 'connected') {
    return {
      success: false,
      staked: 0,
      gains: 0,
      gainsPercentage: 0,
      apy: 0,
      error: 'Wallet not connected',
    };
  }

  const tokenAddress = SUPPORTED_TOKENS[tokenSymbol];
  if (!tokenAddress) {
    return {
      success: false,
      staked: 0,
      gains: 0,
      gainsPercentage: 0,
      apy: 0,
      error: `Token ${tokenSymbol} not supported`,
    };
  }

  try {
    const normalizedAddress = getAddress(tokenAddress.toLowerCase());
    const provider = await wallet.getProvider();
    const { publicClient, account } = await getClients(provider);

    // Get reserve data
    const reserveData = (await publicClient.readContract({
      address: AAVE_POOL_ADDRESS as `0x${string}`,
      abi: AAVE_POOL_ABI,
      functionName: 'getReserveData',
      args: [normalizedAddress],
    })) as any;

    const aTokenAddress = reserveData.aTokenAddress;

    // Get decimals
    const decimals = (await publicClient.readContract({
      address: normalizedAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })) as number;

    // Get aToken balance
    const aTokenBalance = (await publicClient.readContract({
      address: aTokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [account],
    })) as bigint;

    const staked = Number(formatUnits(aTokenBalance, decimals));

    // Calculate APY
    const liquidityRate = BigInt(reserveData.currentLiquidityRate);
    const apy = Number(liquidityRate) / 1e25;

    // Calculate gains
    let gains = 0;
    let gainsPercentage = 0;

    if (initialAmount && initialAmount > 0) {
      gains = staked - initialAmount;
      gainsPercentage = (gains / initialAmount) * 100;
    }

    console.log(`Staked: ${staked}, Gains: ${gains}, APY: ${apy}%`);

    return {
      success: true,
      staked,
      gains,
      gainsPercentage,
      apy,
    };
  } catch (error) {
    console.error('Error getting staked balance:', error);
    return {
      success: false,
      staked: 0,
      gains: 0,
      gainsPercentage: 0,
      apy: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Get complete token information including balance and staking data
 * @param token - Token information
 * @param wallet - The embedded wallet state
 * @param initialStakedAmount - Initial staked amount for gains calculation
 * @returns Complete EarnToken object
 */
export const getEarnTokenData = async (
  token: Token,
  wallet: EmbeddedWalletState | undefined,
  initialStakedAmount?: number
): Promise<EarnToken> => {
  console.log(`Getting complete earn data for ${token.symbol}`);

  if (!wallet || wallet.status !== 'connected') {
    return {
      ...token,
      balance: 0,
      value: 0,
      staked: 0,
      stakedValue: 0,
      gains: 0,
      gainsValue: 0,
    };
  }

  const tokenSymbol = token.symbol.toUpperCase() as keyof typeof SUPPORTED_TOKENS;
  if (!SUPPORTED_TOKENS[tokenSymbol]) {
    console.error(`Token ${token.symbol} not supported`);
    return {
      ...token,
      balance: 0,
      value: 0,
      staked: 0,
      stakedValue: 0,
      gains: 0,
      gainsValue: 0,
    };
  }

  try {
    const provider = await wallet.getProvider();
    const { publicClient, account } = await getClients(provider);
    const normalizedAddress = getAddress(token.address.toLowerCase());

    // Get wallet balance
    const balance = (await publicClient.readContract({
      address: normalizedAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [account],
    })) as bigint;

    const balanceFormatted = Number(formatUnits(balance, token.digits));

    // Get staked balance and gains
    const stakingData = await getStakedBalance(tokenSymbol, wallet, initialStakedAmount);

    // Calculate USD values
    const value = balanceFormatted * token.last_value;
    const stakedValue = stakingData.staked * token.last_value;
    const gainsValue = stakingData.gains * token.last_value;

    return {
      ...token,
      balance: balanceFormatted,
      value,
      staked: stakingData.staked,
      stakedValue,
      gains: stakingData.gainsPercentage,
      gainsValue,
      apy: stakingData.apy,
    };
  } catch (error) {
    console.error('Error getting earn token data:', error);
    return {
      ...token,
      balance: 0,
      value: 0,
      staked: 0,
      stakedValue: 0,
      gains: 0,
      gainsValue: 0,
    };
  }
};

export { SUPPORTED_TOKENS };
