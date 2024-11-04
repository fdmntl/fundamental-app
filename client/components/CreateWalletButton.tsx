import { useEmbeddedWallet, isNotCreated, usePrivy } from '@privy-io/expo';
import React from 'react';
import { Alert, View } from 'react-native';

import { Button } from './Button';
import Container from './Container';
import FText from './Text/FText';

const CreateWalletButton = () => {
  const user = usePrivy();
  const wallet = useEmbeddedWallet();

  const handleCreateWallet = async () => {
    try {
      await wallet.create({ recoveryMethod: 'privy' });
      Alert.alert('Success', 'Wallet created successfully!');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create wallet: ' + error.message);
    }
  };

  if (isNotCreated(wallet)) {
    return <Button onPress={handleCreateWallet} className="bg-primary" title="Create Wallet" />;
  }

  return (
    <View>
      <Container className="" title="Wallet Data">
        <FText className="text-lg">Your wallet has been created!</FText>
        <FText className="text-lg">Your adress is {wallet.account?.address}</FText>
      </Container>
    </View>
  );
};

export default CreateWalletButton;
