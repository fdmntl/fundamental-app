import React, { useState } from 'react';
import { View, TextInput } from 'react-native';

import { Button } from './Button';
import { Container } from './Container';
import { FText } from './Text/FText';
import alchemy from '../services/alchemyService';

import { useAppData } from '~/components/Wrappers/AppData';
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
          onPress={() => console.log(alchemy.getEthBalance(wallet.account?.address ?? ''))}
          className="bg-primary"
          title="Get ETH Balance"
        />
        {/* <FText className="text-lg">Privy DID is {user.privyID}</FText>
        <Button
          onPress={() => viem.signMessage(wallet.provider, 'hello world')}
          className="bg-primary"
          title="Test Sign Message"
        />
        <Button
          onPress={() =>
            viem.sendETH(wallet.provider, '0x4DcBa6746997427dAC9341C2A007f10d673Ad878', 210000n)
          }
          className="bg-primary"
          title="Send ETH"
        /> */
        /* <Button
          onPress={() =>
            viem.sendERC20(
              wallet.provider,
              '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
              '0x4DcBa6746997427dAC9341C2A007f10d673Ad878',
              690000n
            )
          }
          className="bg-primary"
          title="Send USDC"
        />
        <Button
          onPress={() => {
            console.log('Tokens:', tokens);
            console.log('UserData:', userData);
          }}
          className="bg-primary"
          title="Print appData"
        /> */}
        <FText className="text-lg">Your token balances: </FText>
        <FText className="text-lg"> {JSON.stringify(user.balances)}</FText>
      </Container>
    </View>
  );
};

export default TestModule;
