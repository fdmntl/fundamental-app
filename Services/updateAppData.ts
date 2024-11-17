import {
  useEmbeddedWallet,
  isNotCreated,
  usePrivy,
  getUserEmbeddedWallet,
  PrivyEmbeddedWalletProvider,
} from '@privy-io/expo';
import React, { useState, useEffect } from 'react';
import { addressResolverAbi } from 'viem/_types/constants/abis';

import { useAppData } from '~/components/Wrappers/AppData';

export const UpdatePrivyData = () => {
  const wallet = useEmbeddedWallet();
  const { user } = usePrivy();
  const { updateUser, updateWallet, updatePrivy } = useAppData();

  useEffect(() => {
    updateUser({ address: wallet.account?.address, privyID: user?.id });
    updateWallet({ account: wallet.account, status: wallet.status });
    updatePrivy({ user, wallet });

    if (wallet.status === 'connected') {
      updateWallet({ provider: wallet.provider });
    }

    // console.log('User Data Updated:', user, wallet);
  }, [wallet, user]);

  return null;
};
