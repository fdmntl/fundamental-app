import { PrivyEmbeddedWalletProvider, EmbeddedWalletState } from '@privy-io/expo';
import * as _privy_io_public_api from '@privy-io/public-api';

type User = {
  address?: string;
  privyID?: string;
};

type Wallet = {
  account?: _privy_io_public_api.PrivyEthereumEmbeddedWalletAccount;
  provider?: PrivyEmbeddedWalletProvider;
  status?: string;
};

type Privy = {
  user?: _privy_io_public_api.PrivyUser;
  wallet?: EmbeddedWalletState;
  provider?: PrivyEmbeddedWalletProvider;
};

export type { User, Wallet, Privy };
