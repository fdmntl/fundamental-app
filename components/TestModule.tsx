import { OrderParameters, SigningResult } from '@cowprotocol/cow-sdk';
import { useState, useEffect } from 'react';
import { TextInput, ScrollView } from 'react-native';

import { Button } from './Button';
import { Container } from './Container';
import { FText } from './Text/FText';

import { useAppData } from '~/components/Wrappers/AppData';
import { getCowOrderStatus } from '~/services/CoW/getCowOrderStatus';
import { getCowQuote } from '~/services/CoW/getCowQuote';
import { setCowInfiniteAllowance } from '~/services/CoW/setCowInfiniteAllowance';
import { signCowQuote } from '~/services/CoW/signCowQuote';
import { submitCowOrder } from '~/services/CoW/submitCowOrder';
import { getEthersSigner } from '~/services/Ethers/getEthersSigner';
import { coinbaseOnramp } from '~/services/Onramp/coinbaseOnramp';
import { getWalletClient, resolveENS, checkERC20Allowance } from '~/services/viemService';

const TestModule = () => {
  const { user, privy } = useAppData();
  const wallet = privy.wallet;

  const [ensDomain, setEnsDomain] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState<string | null>('');

  let quote: OrderParameters;
  let signature: SigningResult;
  let orderId: string;

  useEffect(() => {
    if (user.balances) {
      console.log('User Balances:', user.balances);
    } else {
      console.log('No balances found');
    }
  }, [user.balances]); // Logs when balances change

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

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
      <Container className="" title="Test Module">
        <Button
          className="bg-primary"
          title="Coinbase Onramp Test"
          onPress={() => coinbaseOnramp(user.wallet_address)}
        />
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
          title="Log Balances"
          onPress={() => console.log('User Balances:', user.balances)}
        />

        <Button
          className="bg-primary"
          title="Approve USDC"
          onPress={() =>
            setCowInfiniteAllowance(wallet.provider, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')
          }
        />

        <Button
          className="bg-primary"
          title="Check USDC Allowance"
          onPress={async () => {
            const allowance = await checkERC20Allowance(
              wallet.provider,
              '0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913',
              user.wallet_address as `0x${string}`,
              '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110'
            );
            console.log('Allowance:', allowance);
          }}
        />
        <Button
          className="bg-primary"
          title="Get Cow Quote - 0.10 USDC -> WETH"
          onPress={async () => {
            quote = await getCowQuote(
              user.wallet_address,
              '0x833589fcd6eDb6E08f4c7C32D4f71b54bda02913',
              '0x4200000000000000000000000000000000000006',
              '100000'
            );
            console.log('Quote:', quote);
          }}
        />

        <Button
          className="bg-primary"
          title="Sign Cow Quote"
          onPress={async () => {
            signature = await signCowQuote(quote, '100000', user.wallet_address, wallet.provider);
            console.log('Signed order:', signature);
          }}
        />

        <Button
          className="bg-primary"
          title="Submit Cow Order"
          onPress={async () => {
            const result = await submitCowOrder(quote, '100000', signature);
            if (result) {
              orderId = result;
            }
            console.log('Order ID:', orderId);
          }}
        />

        <Button
          className="bg-primary"
          title="Get Cow Order Status"
          onPress={async () => {
            const orderStatus = await getCowOrderStatus(
              '0x7a43cf815dae479f40b5f9df705efeaffccaa4751a72535ff368edfcf960ffa7df7782a4f5841ef3ae0bf828b4ac89c3018604f66791c8ed'
            );
            console.log('Order Status:', orderStatus);
          }}
        />
      </Container>
    </ScrollView>
  );
};

export default TestModule;
