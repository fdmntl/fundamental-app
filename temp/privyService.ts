// privyService.ts
import { useEmbeddedWallet, isNotCreated, usePrivy, getUserEmbeddedWallet, PrivyEmbeddedWalletProvider } from '@privy-io/expo';

const getPrivy = async () => {
    const user = usePrivy();
    const wallet = useEmbeddedWallet();

    if (isNotCreated(wallet) || !user.user) {
        console.error("No user or wallet found.");
        return null
    }
    if (wallet.status !== 'connected') {
        console.error("Wallet not connected.");
        return null;
    }
    const provider = wallet.provider;
    if (!provider) {
        console.error("No provider found.");
        return null;
    }
    return { user, wallet, provider };
}

export default getPrivy;
