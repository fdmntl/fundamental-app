import {
  usePrivy,
  useEmbeddedWallet,
  useLoginWithEmail,
  useLogin,
  isNotCreated,
} from '@privy-io/expo';
import Constants from 'expo-constants';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TextInput, View, BackHandler } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { DebugButton } from '~/components/DebugButton';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';

export default function Login() {
  const [email, setEmail] = useState(Constants.expoConfig?.extra?.email || '');
  const [code, setCode] = useState('');

  const { user } = usePrivy();
  const wallet = useEmbeddedWallet();
  const emailFlow = useLoginWithEmail();

  const { updatePrivy } = useAppData();

  useEffect(() => {
    // Prevent back navigation while on the login screen
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const handleUserLogin = async () => {
      if (user) {
        if (isNotCreated(wallet)) {
          try {
            await wallet.create({ recoveryMethod: 'privy' });
            console.log('Wallet created successfully!');
          } catch (error: any) {
            if (error.message?.includes('already has an embedded wallet')) {
              console.log('Wallet already exists. Skipping creation.');
            } else {
              console.error('Failed to create wallet:', error);
            }
          }
        }

        updatePrivy({ user, wallet });
        router.navigate('/(tabs)');
      }
    };

    handleUserLogin();
  }, [user, router, wallet]);

  const { login } = useLogin();

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <Frame>
        <FTitle className="mx-auto text-4xl">Fundamental</FTitle>
        <Button
          title="Login with Privy"
          className="mx-auto my-4 w-2/3 bg-primary"
          onPress={() => login({ loginMethods: ['email', 'sms', 'google', 'github'] })}
        />
        {/* <DebugButton /> */}
      </Frame>
    </>
  );
}
