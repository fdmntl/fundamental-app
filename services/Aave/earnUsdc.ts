import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';
import {
  createWalletClient,
  createPublicClient,
  custom,
  encodeFunctionData,
  getAddress,
  formatUnits,
  parseUnits,
} from 'viem';
import { base } from 'viem/chains';
import { trackEvent } from '~/services/PostHog/trackEvent';
import { EmbeddedWalletState } from '@privy-io/expo';

// Aave V3 Addresses on Base
const AAVE_ADDRESSES = {
  POOL: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5', // Aave V3 Pool
  USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC on Base
  aUSDC: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB', // aUSDC token (interest-bearing)
} as const;

// Helper: Get wallet and public clients
const getClients = async (provider: PrivyEmbeddedWalletProvider) => {
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x2105' }], // Base
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

// ============================================
// 1. GET AAVE DATA (APY, User Balance, etc.)
// ============================================

/**
 * Get current USDC supply APY on Aave
 * @returns APY as a percentage (e.g., 5.25 for 5.25%)
 */
export const getAaveSupplyAPY = async (
  wallet: EmbeddedWalletState | undefined
): Promise<number> => {
  if (!wallet || wallet.status !== 'connected') return 0;
  const provider = await wallet.getProvider();
  const { publicClient } = await getClients(provider);

  // ABI for getReserveData
  const poolABI = [
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
            { name: 'currentLiquidityRate', type: 'uint128' }, // This is the supply APY
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

  try {
    const reserveData = await publicClient.readContract({
      address: AAVE_ADDRESSES.POOL,
      abi: poolABI,
      functionName: 'getReserveData',
      args: [AAVE_ADDRESSES.USDC],
    }) as any;

    // currentLiquidityRate is in Ray units (1e27)
    // Convert to percentage: (rate / 1e27) * 100
    const liquidityRate = BigInt(reserveData.currentLiquidityRate);
    const apy = Number(liquidityRate) / 1e25; // Divide by 1e27 then multiply by 100

    return apy;
  } catch (error) {
    console.error('Error fetching Aave APY:', error);
    throw error;
  }
};

/**
 * Get user's USDC balance in Aave (aUSDC balance)
 * @returns Balance in USDC (formatted, e.g., "100.50")
 */
export const getAaveUSDCBalance = async (
  provider: PrivyEmbeddedWalletProvider
): Promise<string> => {
  const { publicClient, account } = await getClients(provider);

  // ERC-20 balanceOf ABI
  const erc20ABI = [
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
    },
  ];

  try {
    const balance = await publicClient.readContract({
      address: AAVE_ADDRESSES.aUSDC,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [account],
    }) as bigint;

    // USDC has 6 decimals
    return formatUnits(balance, 6);
  } catch (error) {
    console.error('Error fetching Aave USDC balance:', error);
    return '0';
  }
};

/**
 * Get user's total account data from Aave
 * @returns Object with totalCollateralBase, totalDebtBase, availableBorrowsBase, etc.
 */
export const getAaveAccountData = async (
  provider: PrivyEmbeddedWalletProvider
) => {
  const { publicClient, account } = await getClients(provider);

  const poolABI = [
    {
      name: 'getUserAccountData',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'user', type: 'address' }],
      outputs: [
        { name: 'totalCollateralBase', type: 'uint256' },
        { name: 'totalDebtBase', type: 'uint256' },
        { name: 'availableBorrowsBase', type: 'uint256' },
        { name: 'currentLiquidationThreshold', type: 'uint256' },
        { name: 'ltv', type: 'uint256' },
        { name: 'healthFactor', type: 'uint256' },
      ],
    },
  ];

  try {
    const accountData = await publicClient.readContract({
      address: AAVE_ADDRESSES.POOL,
      abi: poolABI,
      functionName: 'getUserAccountData',
      args: [account],
    }) as any;

    return {
      totalCollateralUSD: formatUnits(accountData[0], 8), // Base currency is USD with 8 decimals
      totalDebtUSD: formatUnits(accountData[1], 8),
      availableBorrowsUSD: formatUnits(accountData[2], 8),
      currentLiquidationThreshold: Number(accountData[3]) / 100, // In percentage
      ltv: Number(accountData[4]) / 100, // Loan-to-value in percentage
      healthFactor: formatUnits(accountData[5], 18),
    };
  } catch (error) {
    console.error('Error fetching Aave account data:', error);
    throw error;
  }
};

// ============================================
// 2. SUPPLY USDC TO AAVE
// ============================================

/**
 * Supply USDC to Aave to earn interest
 * @param provider Privy provider
 * @param amount Amount in USDC (e.g., "100.50" for 100.50 USDC)
 * @returns Transaction hash
 */
export const supplyUSDCToAave = async (
  provider: PrivyEmbeddedWalletProvider,
  amount: string
): Promise<`0x${string}`> => {
  const { walletClient, publicClient, account } = await getClients(provider);

  // Convert amount to wei (USDC has 6 decimals)
  const amountWei = parseUnits(amount, 6);

  // Step 1: Check and approve USDC if needed
  const allowance = await checkERC20Allowance(
    publicClient,
    AAVE_ADDRESSES.USDC,
    account,
    AAVE_ADDRESSES.POOL
  );

  if (allowance < amountWei) {
    console.log('Approving USDC...');
    await approveERC20ForAave(provider, amountWei);
    // Wait a bit for the approval to be mined
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Step 2: Supply to Aave
  const poolABI = [
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
  ];

  try {
    const data = encodeFunctionData({
      abi: poolABI,
      functionName: 'supply',
      args: [AAVE_ADDRESSES.USDC, amountWei, account, 0], // referralCode = 0
    });

    const txHash = await walletClient.sendTransaction({
      account,
      to: AAVE_ADDRESSES.POOL,
      data,
      value: 0n,
    });

    trackEvent('aave_supply', {
      amount,
      asset: 'USDC',
      txHash,
    });

    console.log('Supply transaction sent:', txHash);
    return txHash;
  } catch (error) {
    console.error('Error supplying to Aave:', error);
    throw error;
  }
};

// ============================================
// 3. WITHDRAW USDC FROM AAVE
// ============================================

/**
 * Withdraw USDC from Aave
 * @param provider Privy provider
 * @param amount Amount in USDC (e.g., "100.50" for 100.50 USDC), use "max" to withdraw all
 * @returns Transaction hash
 */
export const withdrawUSDCFromAave = async (
  provider: PrivyEmbeddedWalletProvider,
  amount: string
): Promise<`0x${string}`> => {
  const { walletClient, account } = await getClients(provider);

  // Convert amount to wei, or use max value for "max"
  const amountWei =
    amount.toLowerCase() === 'max'
      ? BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') // type(uint256).max
      : parseUnits(amount, 6);

  const poolABI = [
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
  ];

  try {
    const data = encodeFunctionData({
      abi: poolABI,
      functionName: 'withdraw',
      args: [AAVE_ADDRESSES.USDC, amountWei, account],
    });

    const txHash = await walletClient.sendTransaction({
      account,
      to: AAVE_ADDRESSES.POOL,
      data,
      value: 0n,
    });

    trackEvent('aave_withdraw', {
      amount,
      asset: 'USDC',
      txHash,
    });

    console.log('Withdraw transaction sent:', txHash);
    return txHash;
  } catch (error) {
    console.error('Error withdrawing from Aave:', error);
    throw error;
  }
};

// ============================================
// 4. BORROW USDC FROM AAVE
// ============================================

/**
 * Borrow USDC from Aave (requires collateral)
 * @param provider Privy provider
 * @param amount Amount in USDC to borrow
 * @param interestRateMode 1 for stable rate, 2 for variable rate
 * @returns Transaction hash
 */
export const borrowUSDCFromAave = async (
  provider: PrivyEmbeddedWalletProvider,
  amount: string,
  interestRateMode: 1 | 2 = 2 // Default to variable rate
): Promise<`0x${string}`> => {
  const { walletClient, account } = await getClients(provider);

  const amountWei = parseUnits(amount, 6);

  const poolABI = [
    {
      name: 'borrow',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'asset', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'interestRateMode', type: 'uint256' },
        { name: 'referralCode', type: 'uint16' },
        { name: 'onBehalfOf', type: 'address' },
      ],
      outputs: [],
    },
  ];

  try {
    const data = encodeFunctionData({
      abi: poolABI,
      functionName: 'borrow',
      args: [AAVE_ADDRESSES.USDC, amountWei, interestRateMode, 0, account],
    });

    const txHash = await walletClient.sendTransaction({
      account,
      to: AAVE_ADDRESSES.POOL,
      data,
      value: 0n,
    });

    trackEvent('aave_borrow', {
      amount,
      asset: 'USDC',
      interestRateMode,
      txHash,
    });

    console.log('Borrow transaction sent:', txHash);
    return txHash;
  } catch (error) {
    console.error('Error borrowing from Aave:', error);
    throw error;
  }
};

// ============================================
// 5. REPAY BORROWED USDC TO AAVE
// ============================================

/**
 * Repay borrowed USDC to Aave
 * @param provider Privy provider
 * @param amount Amount in USDC to repay, use "max" to repay all debt
 * @param interestRateMode 1 for stable rate, 2 for variable rate
 * @returns Transaction hash
 */
export const repayUSDCToAave = async (
  provider: PrivyEmbeddedWalletProvider,
  amount: string,
  interestRateMode: 1 | 2 = 2
): Promise<`0x${string}`> => {
  const { walletClient, publicClient, account } = await getClients(provider);

  // Convert amount to wei
  const amountWei =
    amount.toLowerCase() === 'max'
      ? BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      : parseUnits(amount, 6);

  // Step 1: Approve USDC if needed
  const allowance = await checkERC20Allowance(
    publicClient,
    AAVE_ADDRESSES.USDC,
    account,
    AAVE_ADDRESSES.POOL
  );

  if (allowance < amountWei) {
    console.log('Approving USDC for repayment...');
    await approveERC20ForAave(provider, amountWei);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Step 2: Repay
  const poolABI = [
    {
      name: 'repay',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'asset', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'interestRateMode', type: 'uint256' },
        { name: 'onBehalfOf', type: 'address' },
      ],
      outputs: [{ name: '', type: 'uint256' }],
    },
  ];

  try {
    const data = encodeFunctionData({
      abi: poolABI,
      functionName: 'repay',
      args: [AAVE_ADDRESSES.USDC, amountWei, interestRateMode, account],
    });

    const txHash = await walletClient.sendTransaction({
      account,
      to: AAVE_ADDRESSES.POOL,
      data,
      value: 0n,
    });

    trackEvent('aave_repay', {
      amount,
      asset: 'USDC',
      interestRateMode,
      txHash,
    });

    console.log('Repay transaction sent:', txHash);
    return txHash;
  } catch (error) {
    console.error('Error repaying to Aave:', error);
    throw error;
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Approve USDC for Aave Pool
 */
const approveERC20ForAave = async (
  provider: PrivyEmbeddedWalletProvider,
  amount: bigint
) => {
  const { walletClient, account } = await getClients(provider);

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
    args: [AAVE_ADDRESSES.POOL, amount],
  });

  const txHash = await walletClient.sendTransaction({
    account,
    to: AAVE_ADDRESSES.USDC,
    data,
    value: 0n,
  });

  console.log('Approval transaction sent:', txHash);
  return txHash;
};

/**
 * Check ERC-20 allowance
 */
const checkERC20Allowance = async (
  publicClient: any,
  tokenAddress: string,
  owner: string,
  spender: string
): Promise<bigint> => {
  const erc20ABI = [
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
  ];

  try {
    const normalizedTokenAddress = getAddress(tokenAddress);
    const normalizedOwner = getAddress(owner);
    const normalizedSpender = getAddress(spender);

    const allowance = await publicClient.readContract({
      address: normalizedTokenAddress,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [normalizedOwner, normalizedSpender],
    });

    return BigInt(allowance as string);
  } catch (error) {
    console.error('Error checking allowance:', error);
    return 0n;
  }
};