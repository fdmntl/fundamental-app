import { EmbeddedWalletState } from '@privy-io/expo';
import * as _privy_io_public_api from '@privy-io/public-api';

type Privy = {
  user?: _privy_io_public_api.PrivyUser;
  wallet?: EmbeddedWalletState;
};

export type { Privy };
