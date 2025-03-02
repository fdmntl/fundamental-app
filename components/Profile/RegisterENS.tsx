import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

import { Container } from '../Container';
import { FText } from '../Text/FText';
import { FTitle } from '../Text/FTitle';
import { useAppData } from '../Wrappers/AppData';

import { copyToClipboard } from '~/utils/helpers/copyToClipboard';
import { trimAddress } from '~/utils/helpers/strings/trimAddress';
import { toastConfig } from '~/utils/toastConfig';
import { Button } from '../Button';
import { View } from 'react-native';
import { TextInputField } from '../TextInputField';

export const RegisterENS = () => {
  const { privy, user } = useAppData();
  const [subname, setSubname] = useState('');

  // Check if the subname is valid and available
  const isValidSubname = (subaname: string) => {
    if (subname.length < 1 || subname.length > 16) {
      return false;
    }
    if (!/^[a-zA-Z0-9-_]*$/.test(subname)) {
      return false;
    }
    return true;
  };
  return (
    <Container className="gap-5">
      <View className="flex flex-wrap">
        <FText className="!text-2xl" bold>
          Register an ENS
        </FText>
        <View className="w-full flex-row items-center">
          <View className="w-3/5">
            <TextInputField
              label=""
              placeholder="username"
              value={subname}
              onChange={(value) => {
                setSubname(value);
              }}
              isValid={isValidSubname(subname)}
            />
          </View>
          <FText className="mt-9 !text-3xl" bold>
            .fdmntl.eth
          </FText>
        </View>
        <Button
          title="Register"
          onPress={() => {
            if (isValidSubname(subname)) {
              // Register the ENS
              Toast.show({
                type: 'success',
                text1: 'ENS Registered',
                text2: 'Your ENS has been successfully registered!',
                ...toastConfig,
              });
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
    </Container>
  );
};
