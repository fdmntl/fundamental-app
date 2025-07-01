import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '../Button';

export const AssetDetailsCTAs = ({ tokenAddress }: { tokenAddress: string }) => {
  const router = useRouter();

  return (
    <View className="h-14 w-full flex-row gap-4">
      <Button
        icon={<Feather name="send" size={20} className="text-text" />}
        title="Send"
        className="flex-[2] bg-content"
        onPress={() => {
          if (tokenAddress) {
            router.push({
              pathname: '/send',
              params: {
                prefillTokenAddress: tokenAddress,
              },
            });
          } else {
            console.log('Token address is undefined');
            Toast.show({
              type: 'error',
              text1: 'Token address is not available.',
            });
          }
        }}
      />
      <Button
        disableGradient
        title="Buy"
        className="flex-1 bg-content"
        onPress={() => {
          if (tokenAddress) {
            router.push({
              pathname: '/trade',
              params: {
                prefillTokenAddress: tokenAddress,
                method: 'buy',
              },
            });
          } else {
            console.log('Token address is undefined');
            Toast.show({
              type: 'error',
              text1: 'Token address is not available.',
            });
          }
        }}
      />
      <Button
        title="Sell"
        disableGradient
        className="flex-1 bg-content"
        onPress={() => {
          if (tokenAddress) {
            router.push({
              pathname: '/trade',
              params: {
                prefillTokenAddress: tokenAddress,
                method: 'sell',
              },
            });
          } else {
            console.log('Token address is undefined');
            Toast.show({
              type: 'error',
              text1: 'Token address is not available.',
            });
          }
        }}
      />
    </View>
  );
};
