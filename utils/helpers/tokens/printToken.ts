import { Token } from '~/types/supabaseTypes';

/**
 * Helper function to convert an amount to a printable format
 * @param amount 1
 * @param token { last_value: 100 }
 * @returns 1.00
 */

function truncateNumber(num: number, digits: number): number {
  const factor = Math.pow(10, digits);
  return Math.floor(num * factor) / factor;
}

export const printToken = (amount: number, token?: Token): number => {
  if (amount === 0 || !amount || !token) {
    return 0;
  }

  if (token.last_value <= 0.01) {
    return Number(amount.toFixed(0));
  }

  let nbofTokens = amount;
  let nbofdigitsaftercomma = 0;
  let modulo = 1;

  while (modulo < nbofTokens) {
    modulo *= 10;
  }

  while (nbofTokens * token.last_value >= 0.01) {
    nbofTokens %= modulo;
    modulo /= 10;
    if (nbofTokens < 1) {
      nbofdigitsaftercomma++;
    }
  }
  return truncateNumber(amount, Math.max(0, nbofdigitsaftercomma - 1));
};
