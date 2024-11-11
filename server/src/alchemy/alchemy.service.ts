import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Injectable()
export class AlchemyService {
    private readonly apiKey: string;

    constructor(
        private readonly configService: ConfigService
      ) {        
        this.apiKey = this.configService.get<string>('ALCHEMY_API_KEY');
      }
    

    public async getTokenBalances(address: string): Promise<string> {
        
        const network = "base"
        const Url = `https://${network}-mainnet.g.alchemy.com/v2/${this.apiKey}`;
    
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
        
    }

    public async getEthBalance(address: string): Promise<string> {
        const network = "base"
        Logger.log(`Fetching balance for address: ${address}`);
        
        
        Logger.log(`API Key: ${this.apiKey}`);
        const Url = `https://${network}-mainnet.g.alchemy.com/v2/${this.apiKey}`;

        const data = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1
        };

        try {
            const response = await axios.post(Url, data);
            Logger.log(response.data);
            const weiBalance = response.data.result;
            const ethBalance = parseFloat(weiBalance) / 1e18;
            Logger.log(`Balance for address ${address}: ${weiBalance} WEI`);
            Logger.log(`Balance for address ${address}: ${ethBalance} ETH`);
            return weiBalance;
        } catch (error) {

            Logger.log(error);
            throw error;
        }
    }
}
