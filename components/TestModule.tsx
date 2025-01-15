import React from 'react';
import { View } from 'react-native';

import { Button } from './Button';
import { Container } from './Container';
import { FText } from './Text/FText';

import { useAppData } from '~/components/Wrappers/AppData';
import { getWalletClient } from '~/services/viemService';
import { setCowInfiniteAllowance } from '~/services/cowService';

const TestModule = () => {
  const { user, privy, tokens } = useAppData();
  const wallet = privy.wallet;

  if (!wallet) {
    return <FText className="text-lg">Wallet not created</FText>;
  }

  if (wallet.status !== 'connected') {
    return <FText className="text-lg">Wallet not connected</FText>;
  }

  const walletClient = getWalletClient(wallet.provider);
  return (
    <View>
      <Container className="" title="Test Module">
        <FText className="text-lg">Your address is {user.wallet_address}</FText>
        <Button
          className="bg-primary"
          title="Approve USDC"
          onPress={() =>
            setCowInfiniteAllowance(wallet.provider, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')
          }></Button>
      </Container>
    </View>
  );
};

export default TestModule;
