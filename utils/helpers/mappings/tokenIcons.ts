const USDC = require('assets/icons/USDC.png');
const WETH = require('assets/icons/WETH.png');
const ETH = require('assets/icons/ETH.png');
const BTC = require('assets/icons/BTC.png');
const cbBTC = require('assets/icons/BTC.png');
const AAVE = require('assets/icons/AAVE.png');
const LINK = require('assets/icons/LINK.png');

export const tokenIcons: { [key: string]: any } = {
  WETH,
  ETH,
  USDC,
  BTC,
  cbBTC,
  AAVE,
  LINK,
  default: USDC,
};
