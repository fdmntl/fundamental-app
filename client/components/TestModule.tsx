import { useEmbeddedWallet, isNotCreated, usePrivy, getUserEmbeddedWallet, PrivyEmbeddedWalletProvider } from '@privy-io/expo';
import React from 'react';
import { Alert, View } from 'react-native';
import alchemy from '../Services/alchemyService';
import signMessage from '~/Services/privyService';
import { isConnected, needsRecovery } from '@privy-io/expo';
import viem from '~/Services/viemService';

import { Button } from './Button';
import Container from './Container';
import FText from './Text/FText';

const TestModule = () => {
  const user = usePrivy();
  const wallet = useEmbeddedWallet();

  if (isNotCreated(wallet)) {
    return <FText className="text-lg">Wallet not created</FText>;
  }

  if (wallet.status != 'connected') {
    return <FText className="text-lg">Wallet not connected</FText>;
  }

  const walletClient = viem.getWalletClient(wallet.provider);

  return (
    <View>
      <Container className="" title="Test Module">
        <FText className="text-lg">Your address is {wallet.account?.address}</FText>
        <Button onPress={() => alchemy.getEthBalance(wallet.account?.address ?? "")} className="bg-primary" title="Get ETH Balance" />
        <FText className="text-lg">Privy DID is {user.user?.id}</FText>
        <Button onPress={() => viem.signMessage(wallet.provider, 'hello world')} className="bg-primary" title="Test Sign Message" />
        <Button onPress={() => viem.sendETH(wallet.provider, '0x4DcBa6746997427dAC9341C2A007f10d673Ad878', 21n)} className="bg-primary" title="Send ETH" />
      </Container>
    </View>
  );
};

export default TestModule;
