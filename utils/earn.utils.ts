import { digitsToAmount } from './helpers/tokens/digitsToAmount';

import { EarnToken } from '~/types/earn';
import { Token, User } from '~/types/supabaseTypes';

export const calculateTotalStakedUSD = (tokens: EarnToken[]): number => {
  return tokens.reduce((sum, token) => sum + token.stakedValue, 0);
};

export const calculateTotalGainsUSD = (tokens: EarnToken[]): number => {
  return tokens.reduce((sum, token) => sum + token.gainsValue, 0);
};

export const calculateAverageAPY = (tokens: EarnToken[]): number => {
  if (tokens.length === 0) return 0;
  const totalStaked = calculateTotalStakedUSD(tokens);
  if (totalStaked === 0) return 0;

  // Weighted average by staked value
  return (
    tokens.reduce((sum, token) => {
      return sum + token.apy * token.stakedValue;
    }, 0) / totalStaked
  );
};

export const sortTokens = (tokens: EarnToken[], sortBy: 'balance' | 'apy'): EarnToken[] => {
  return [...tokens].sort((a, b) => {
    if (sortBy === 'balance') {
      return b.value - a.value;
    }
    return b.apy - a.apy;
  });
};

export const formatAmount = (amount: number, decimals: number): string => {
  return amount.toFixed(decimals);
};

export const formatTokenAmount = (amount: number, token: Token): string => {
  if (amount === 0) return '0';

  // For very small amounts, use up to 6 significant figures
  if (Math.abs(amount) < 0.0001) {
    return amount.toPrecision(3);
  }

  // For normal amounts, use 2-4 decimals and remove trailing zeros
  const decimals = Math.min(4, token.digits);
  const formatted = amount.toFixed(decimals);
  return formatted.replace(/\.?0+$/, '');
};

export const convertAmount = (
  amount: string,
  token: EarnToken,
  isUSD: boolean
): { display: string; converted: string } => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || !amount) {
    return { display: '', converted: '' };
  }

  const tokenPrice = token.last_value;

  if (isUSD) {
    // Prevent division by zero or near-zero token price
    if (!tokenPrice || Math.abs(tokenPrice) < 1e-8) {
      return { display: '', converted: '' };
    }

    const tokenAmount = numAmount / tokenPrice;
    return {
      display: `${formatAmount(numAmount, 2)} USD`,
      converted: `≈ ${formatTokenAmount(tokenAmount, token)} ${token.symbol}`,
    };
  }

  const usdAmount = numAmount * tokenPrice;
  return {
    display: `${formatTokenAmount(numAmount, token)} ${token.symbol}`,
    converted: `≈ $${formatAmount(usdAmount, 2)}`,
  };
};

export const calculateEstimatedYearlyEarnings = (
  amount: string,
  token: EarnToken,
  isUSD: boolean
): number => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return 0;

  const usdValue = isUSD ? numAmount : numAmount * token.last_value;
  return (usdValue * token.apy) / 100;
};

export const getUserTokenBalance = (user: User, tokenAddress: string, token: Token): number => {
  const balance = user.balances.find((b) => b.address.toLowerCase() === tokenAddress.toLowerCase());
  if (!balance) return 0;
  return digitsToAmount(balance.balance, token) || 0;
};

export const getUserTokenValue = (user: User, tokenAddress: string): number => {
  const balance = user.balances.find((b) => b.address.toLowerCase() === tokenAddress.toLowerCase());
  return balance?.value || 0;
};

// Convert Token[] to EarnToken[] by adding user data
export const mapTokensToEarnTokens = (
  tokens: Token[],
  user: User | null,
  stakedData: { [address: string]: { staked: number; gains: number } }
): EarnToken[] => {
  return tokens.map((token) => {
    const balance = user ? getUserTokenBalance(user, token.address, token) : 0;
    const value = user ? getUserTokenValue(user, token.address) : 0;
    const staked = stakedData[token.address]?.staked || 0;
    const gains = stakedData[token.address]?.gains || 0;
    const stakedValue = staked * token.last_value;
    const gainsValue = (stakedValue * gains) / 100;

    return {
      ...token,
      balance,
      value,
      staked,
      stakedValue,
      gains,
      gainsValue,
    };
  });
};
