import React, { useState } from 'react';
import { View, TextInput, Alert, Image } from 'react-native';
import FText from '~/components/Text/FText';
import { Button } from '~/components/Button';

const RecipientInput = () => {
  const [recipientAddress, setRecipientAddress] = useState('');

  const handleSendFunds = () => {
    if (recipientAddress) {
      // Logic to send funds, this could involve interacting with a wallet or smart contract
      Alert.alert('Sending Funds', `Funds will be sent to ${recipientAddress}`);
    } else {
      Alert.alert('Error', 'Please enter a valid Ethereum address.');
    }
  };

  return (
    <View className="items-center rounded-lg bg-primary p-4">
      <View className="mb-4 flex-row items-center">
        <FText className="text-white">Recipient</FText>
        <Image
          source={{
            uri: 'https://pbs.twimg.com/profile_images/1709489482414624768/ncqZhUxo_400x400.jpg',
          }}
          className="ml-4 h-16 w-16 rounded-full"
        />
      </View>
      <TextInput
        className="mb-4 w-full rounded-md bg-blue-700 p-3 text-white"
        placeholder="0x1234...abcd"
        placeholderTextColor="#888"
        value={recipientAddress}
        onChangeText={setRecipientAddress}
      />
      <Button title="Send Funds" onPress={handleSendFunds} />
    </View>
  );
};

export default RecipientInput;
