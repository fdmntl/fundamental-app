import { Handler } from '@netlify/functions';
import { AlchemyService } from '../../../src/alchemy/alchemy.service';
import { ConfigService } from '@nestjs/config';


const alchemyService = new AlchemyService(new ConfigService());

export const handler: Handler = async (event) => {
    const address = event.path.split('/').pop();
    if (!address) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Address not provided' }),
        };
    }
    const balance = await alchemyService.getTokenBalances(address);
    if (!balance) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Balance not found' }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ balance }),
    };
};