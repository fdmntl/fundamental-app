import { Token } from '~/types/supabaseTypes';

/**
 * Helper function to convert digits to an amount
 * @param amount 10000000000
 * @param token { digits: 10 }
 * @returns 1
 */
export const digitsToAmount = (amount: number, token: Token): number => {
  return amount / Math.pow(10, token.digits);
};

export const printableDigitsToAmount = (amount: number, token: Token): number => {
  amount = amount / Math.pow(10, token.digits);

  if (amount === 0 || !amount) {
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

  return Number(amount.toFixed(nbofdigitsaftercomma - 1));
};
