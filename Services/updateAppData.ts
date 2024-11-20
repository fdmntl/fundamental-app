import { useEmbeddedWallet, usePrivy } from '@privy-io/expo';
import { useEffect } from 'react';

import { useAppData } from '~/components/Wrappers/AppData';

export const UpdatePrivyData = () => {
  const wallet = useEmbeddedWallet();
  const { user } = usePrivy();
  const { updateUser, updateWallet, updatePrivy } = useAppData();

  useEffect(() => {
    updateUser({ address: wallet.account?.address, privyID: user?.id });
    updateWallet({ account: wallet.account ?? undefined, status: wallet.status });
    updatePrivy({ user: user ?? undefined, wallet });

    if (wallet.status === 'connected') {
      updateWallet({ provider: wallet.provider });
    }
  }, [wallet, user]);

  return null;
};
