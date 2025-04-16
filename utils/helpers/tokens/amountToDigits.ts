import { Token } from '~/types/supabaseTypes';

/**
 * Helper function to convert an amount to digits
 * @param amount 1
 * @param token { digits: 10 }
 * @returns 10000000000
 */
export const amountToDigits = (amount: number, token: Token): number => {
  return amount * Math.pow(10, token.digits);
};

export const printableAmountToDigits = (amount: number, token: Token): string => {
  if (amount === 0) {
    return '0';
  }

  if (0.01 >= token.last_value) {
    return amount.toFixed(0);
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

  return amount.toFixed(nbofdigitsaftercomma - 1);
}
