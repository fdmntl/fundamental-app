import { usePrivy } from '@privy-io/expo';
import { useAppData } from './Wrappers/AppData';
import React from 'react';

import { Button } from './Button';

export const DebugButton = () => {
  const { user } = useAppData();
  const { privy } = useAppData();
  const { user: privyUser } = usePrivy();
  const { getAccessToken } = usePrivy();
  const { tokens } = useAppData();
  const debug = async () => {
    console.log('\n---------------------App data---------------------');
    console.log('User:', user);
    console.log('\nPrivy:', privy);
    console.log('\n---------------------Privy data---------------------');
    console.log('Privy User:', privyUser);
    const accessToken = await getAccessToken();
    console.log('\nPrivy Access Token:', accessToken);
    console.log('\n---------------------Tokens---------------------');
    tokens.forEach((token) => {
      const { name, address, symbol, digits, description, is_stablecoin, value } = token;
      console.log({
        name,
        address,
        symbol,
        digits,
        description,
        is_stablecoin,
        valueLength: value.length,
      });
    });
  };

  return <Button onPress={debug} className="bg-primary" title="Debug" />;
};
