import { useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '../Button';
import { FText } from '../Text/FText';
import { TextInputField } from '../TextInputField';
import { useAppData } from '../Wrappers/AppData';

import { updateENS } from '~/services/Supabase/updateENS';
import { registerName } from '~/services/viemService';
import { toastConfig } from '~/utils/toastConfig';

// Check if the subname is valid and available
// TODO: Check if the subname is available
const isValidSubname = (subname: string) => {
  if (subname.length < 1 || subname.length > 16) {
    return false;
  }
  if (!/^[a-zA-Z0-9-_]*$/.test(subname)) {
    return false;
  }
  return true;
};

export const RegisterENS = () => {
  const { privy, user } = useAppData();
  const [subname, setSubname] = useState('');
  const address = privy.wallet?.account?.address || '';

  if (!privy.wallet || privy.wallet.status !== 'connected') {
    return (
      <FText className="!text-2xl" bold>
        Privy wallet error: not connected
      </FText>
    );
  }

  const provider = privy.wallet.provider;

  return (
    <View className="flex gap-4">
      <FText className="!text-2xl" bold>
        Register an ENS
      </FText>
      <View className="w-full flex-row items-center gap-2">
        <TextInputField
          className="w-[200px]"
          placeholder="username"
          value={subname}
          onChange={(value) => {
            setSubname(value);
          }}
          isValid={isValidSubname(subname)}
        />
        <FText className="!text-3xl" bold>
          .fdmntl.eth
        </FText>
      </View>
      <Button
        title="Register"
        onPress={async () => {
          if (isValidSubname(subname)) {
            try {
              await registerName(provider, subname, address as `0x${string}`);
              updateENS(user.id, subname);
              Toast.show({
                type: 'success',
                text1: 'ENS registered',
                text2: 'Your ENS has been successfully registered.',
                ...toastConfig,
              });
            } catch (error) {
              console.error('Error registering ENS:', error);
              Toast.show({
                type: 'error',
                text1: 'Error registering ENS',
                text2: 'There was an error registering your ENS. Please try again.',
                ...toastConfig,
              });
            }
          } else {
            Toast.show({
              type: 'error',
              text1: 'Invalid ENS',
              text2: 'Please enter a valid ENS name.',
              ...toastConfig,
            });
          }
        }}
      />
    </View>
  );
};
