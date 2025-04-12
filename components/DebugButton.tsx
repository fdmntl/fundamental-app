import { usePrivy } from '@privy-io/expo';
import React from 'react';
import { slice } from 'viem';

import { Button } from './Button';
import { useAppData } from './Wrappers/AppData';

import { AddUser } from '~/services/addUserToDB';
import { refreshUserBalances } from '~/services/refreshUserBalance';

export const DebugButton = () => {
  const { user } = useAppData();
  const { updateUser } = useAppData();
  const { privy } = useAppData();
  const { user: address } = useAppData();
  const { user: privyUser } = usePrivy();
  const { getAccessToken } = usePrivy();
  const { tokens } = useAppData();
  const debug = async () => {
    await refreshUserBalances(user, updateUser);
    await AddUser(privy.user, privy.wallet);
    console.log('\n---------------------App data---------------------');
    console.log('User:', user);
    console.log('\nPrivy:', privy);
    console.log('\n---------------------Privy data---------------------');
    console.log('Privy User:', privyUser);
    const accessToken = await getAccessToken();
    console.log('\nPrivy Access Token:', accessToken);
    console.log('\n---------------------Tokens---------------------');
    tokens.forEach((token) => {
      const { name, address, symbol, digits, description, is_stablecoin } = token;
      console.log({
        name,
        address,
        symbol,
        digits,
        description,
        is_stablecoin,
      });
    });
  };

  return <Button onPress={debug} title="Debug" />;
};
