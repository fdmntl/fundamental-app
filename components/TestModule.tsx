import React, { useState } from 'react';
import { View, TextInput } from 'react-native';

import { Button } from './Button';
import { Container } from './Container';
import { FText } from './Text/FText';

import { useAppData } from '~/components/Wrappers/AppData';
import { setCowInfiniteAllowance } from '~/services/cowService';
import { getWalletClient, resolveENS } from '~/services/viemService';

const TestModule = () => {
  const { user, privy, tokens } = useAppData();
  const wallet = privy.wallet;

  const [ensDomain, setEnsDomain] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState<string | null>('');

  if (!wallet) {
    return <FText className="text-lg">Wallet not created</FText>;
  }

  if (wallet.status !== 'connected') {
    return <FText className="text-lg">Wallet not connected</FText>;
  }

  const handleResolveENS = async () => {
    try {
      const address = await resolveENS(ensDomain);

      if (address === null) {
        console.log('ENS domain not resolved');
      } else {
        console.log(`Resolved Address: ${address}`);
      }

      setResolvedAddress(address);
    } catch (error) {
      console.error(error);
      setResolvedAddress('Error resolving ENS domain');
    }
  };

  const walletClient = getWalletClient(wallet.provider);
  return (
    <View>
      <Container className="" title="Test Module">
        <FText className="text-lg text-text">Resolve ENS Domain</FText>
        <TextInput
          className="my-2 rounded border border-gray-300 p-2 text-text"
          placeholder="Enter ENS domain (e.g., vitalik.eth)"
          value={ensDomain}
          onChangeText={setEnsDomain}
          placeholderTextColor="#888"
        />
        <Button onPress={handleResolveENS} className="bg-primary" title="Resolve ENS" />
        <FText className="text-lg">Resolved Address:</FText>
        <FText className="text-lg">{resolvedAddress}</FText>
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
