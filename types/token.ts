export type token = {
  contractAddress: string;
  name: string; // The token's name, null if not defined in the contract and not available from other sources.
  symbol: string; // The token's symbol. null if not defined in the contract and not available from other sources.
  decimals: number; // The number of decimals in the token's contract. null if not defined in the contract and not available from other sources.
  logo: string; // URL of the token's logo image. null if not available.
};
