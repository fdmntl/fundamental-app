import React, { useState } from 'react';
import { View, TextInput } from 'react-native';

import { Button } from './Button';
import { Container } from './Container';
import { FText } from './Text/FText';

import { useAppData } from '~/components/Wrappers/AppData';
import { setCowInfiniteAllowance } from '~/services/CoW/setCowInfiniteAllowance';
import { getWalletClient, resolveENS } from '~/services/viemService';
import { getCowQuote } from '~/services/CoW/getCowQuote';
import { OrderParameters } from '@cowprotocol/cow-sdk';
import { signCowQuote } from '~/services/CoW/signCowQuote';
import { getEthersSigner } from '~/services/ethersService';

const TestModule = () => {
  const { user, privy, tokens } = useAppData();
  const wallet = privy.wallet;

  const [ensDomain, setEnsDomain] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState<string | null>('');

  let quote: OrderParameters;

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
  const signer = getEthersSigner(wallet.provider);
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
        <Button
          className="bg-primary"
          title="Get Cow Quote - 0.1 USDC -> WETH"
          onPress={async () => {
            try {
              quote = await getCowQuote(
                user.wallet_address,
                '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
                '0x4200000000000000000000000000000000000006',
                '10000'
              );
              console.log(quote);
            } catch (error) {
              console.error('Error fetching quote:', error);
            }
          }}
        />
        <Button
          className="bg-primary"
          title="Sign Cow Quote"
          onPress={async () => {
            try {
              const signedOrder = await signCowQuote(quote, '10000', user.wallet_address, signer);
              console.log(signedOrder);
            } catch (error) {
              console.error('Error signing quote:', error);
            }
          }}
        />
      </Container>
    </View>
  );
};

export default TestModule;
