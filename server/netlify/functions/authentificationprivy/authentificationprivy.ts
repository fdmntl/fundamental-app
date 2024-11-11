import { Handler } from '@netlify/functions';
import { useEmbeddedWallet, isNotCreated, usePrivy } from '@privy-io/expo';

export const handler: Handler = async (event) => {
    const address = event.path.split('/').pop();
    const user = usePrivy();
    const wallet = useEmbeddedWallet();
    if (isNotCreated(wallet) || !user.user) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'No user or wallet found.' }),
        };
    }
    if (wallet.status !== 'connected') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Wallet not connected.' }),
        };
    }
    const provider = wallet.provider;
    if (!provider) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'No provider found.' }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ user, wallet, provider }),
    };
};