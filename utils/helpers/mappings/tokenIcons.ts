const AAVE = require('assets/icons/AAVE.png');
const BTC = require('assets/icons/BTC.png');
const cbBTC = require('assets/icons/BTC.png');
const COMP = require('assets/icons/COMP.png');
const ETH = require('assets/icons/ETH.png');
const LINK = require('assets/icons/LINK.png');
const USDC = require('assets/icons/USDC.png');
const WETH = require('assets/icons/WETH.png');

export const tokenIcons: { [key: string]: any } = {
  WETH,
  ETH,
  USDC,
  BTC,
  cbBTC,
  AAVE,
  LINK,
  COMP,
  default: USDC,
};
