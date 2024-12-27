import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useAppData } from '~/components/Wrappers/AppData';
import { FText } from '~/components/Text/FText';

const UserInfo: React.FC = () => {
  const { userData } = useAppData();
  const [walletAddress, setWalletAddress] = useState<string>(''); // State for wallet address input

  // Function to find user by wallet address
  const findUserByAddress = (address: string) => {
    return userData.find((user) => user.wallet_address === address);
  };

  const user = findUserByAddress(walletAddress);

  return (
    <View className="p-4">
      <FText bold className="!text-lg">
        Find User by Wallet Address
      </FText>

      <TextInput
        placeholder="Enter wallet address"
        value={walletAddress}
        onChangeText={setWalletAddress}
        className="mt-4 rounded-md border border-gray-300 p-2"
      />

      {user ? (
        <View className="mt-4">
          <FText bold className="!text-md">
            User Info:
          </FText>
          <FText>ID: {user.id}</FText>
          <FText>Wallet Address: {user.wallet_address}</FText>
          <FText>ENS: {user.ens || 'N/A'}</FText>
          <FText>Balances: {JSON.stringify(user.balances)}</FText>
          <FText>Selected Money: {user.selected_money || 'N/A'}</FText>
        </View>
      ) : walletAddress ? (
        <FText className="mt-4">No user found for the given wallet address.</FText>
      ) : (
        <FText className="mt-4">Please enter a wallet address to search.</FText>
      )}
    </View>
  );
};

export default UserInfo;
