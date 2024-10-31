import { useEmbeddedWallet, isNotCreated, usePrivy, getUserEmbeddedWallet, PrivyEmbeddedWalletProvider, EmbeddedWalletState } from "@privy-io/expo";
import * as _privy_io_public_api from '@privy-io/public-api';

type data = {
    user?: User;
    wallet?: Wallet;
    privy?: Privy;
}

type User = {
    address?: string;
    privyID?: string;
}

type Wallet = {
    account?: string;
    status?: string;
    provider?: string;
}

type Privy = {
    user?: _privy_io_public_api.PrivyUser;
    wallet?: EmbeddedWalletState;
    provider?: PrivyEmbeddedWalletProvider;
}
