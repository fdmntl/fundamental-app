import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, TextInput, Alert, Image } from 'react-native';
import FText from '~/components/Text/FText';
import { Button } from '~/components/Button';
import { http, createPublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { isAddress } from 'viem';

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const RecipientInput = forwardRef((props, ref) => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    value: recipientAddress,
  }));

  const handleSendFunds = () => {
    if (isAddress(recipientAddress)) {
      // Logic to send funds, this could involve interacting with a wallet or smart contract
      Alert.alert('Sending Funds', `Funds will be sent to ${recipientAddress}`);
    } else {
      Alert.alert('Error', 'Please enter a valid Ethereum address.');
    }
  };

  const isValidAddress = isAddress(recipientAddress);

  const getEnsNameAndAvatar = async () => {
    const ensName = await client.getEnsName({ address: recipientAddress as `0x${string}` });
    if (ensName) {
      console.log('ENS Name:', ensName);
      setEnsName(ensName);
      const ensAvatar = await client.getEnsAvatar({ name: normalize(ensName) });
      setEnsAvatar(ensAvatar);
      console.log('ENS Avatar:', ensAvatar);
    } else {
      console.log('ENS Name not found.');
    }
  };

  return (
    <View className="mb-4 h-40 w-full rounded-xl bg-content p-4">
      <View className="flex-row items-center">
        <FText className="font-bold text-text">Recipient</FText>
      </View>
      <View className="mt-4 flex-row items-center">
        <TextInput
          className={`flex-1 rounded-md bg-content p-3 ${recipientAddress === '' ? 'border border-background text-text' : isValidAddress ? 'border border-success text-success' : 'border border-error text-error'}`}
          placeholder="0x1234...abcd"
          placeholderTextColor="#888"
          value={recipientAddress}
          onChangeText={(text) => {
            setRecipientAddress(text);
          }}
        />
        {ensAvatar && (
          <View className="ml-4 items-center">
            <Image
              source={{
                uri: ensAvatar,
              }}
              className="h-16 w-16 rounded-full"
            />
            {ensName && <FText className="font-semibold text-text">{ensName}</FText>}
          </View>
        )}
      </View>
    </View>
  );
});

export default RecipientInput;
