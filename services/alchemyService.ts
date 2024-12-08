import axios from 'axios';
const ALCHEMY_API_KEY = process.env.EXPO_PUBLIC_ALCHEMY_API_KEY

const getEthBalance = async (address: string) => {
    const network = "base"
    const Url = `https://${network}-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

    const data = {
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [address, "latest"],
      id: 1
    };

    try {
      const response = await axios.post(Url, data);
      const weiBalance = response.data.result;
      const ethBalance = parseFloat(weiBalance) / 1e18;

      return weiBalance;
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      throw error;
    }
  };


const getTokenBalances = async (address: string) => {
    const network = "base"
    const Url = `https://${network}-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

  const data = {
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    params: [address],
    id: 1
  };

  try {
    const response = await axios.post(Url, data);
    const balances = response.data.result;

    return balances;
  } catch (error) {
    console.error('Error fetching token balances:', error);
    throw error;
  }
};

export default {getTokenBalances, getEthBalance};
