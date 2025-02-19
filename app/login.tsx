import { usePrivy, useEmbeddedWallet, useLogin, isNotCreated } from '@privy-io/expo';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View, BackHandler, useColorScheme } from 'react-native';

import { Button } from '~/components/Button';
import { FTitle } from '~/components/Text/FTitle';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';

export default function Login() {
  const { user } = usePrivy();
  const wallet = useEmbeddedWallet();

  const { updatePrivy } = useAppData();

  useEffect(() => {
    // Prevent back navigation
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
        <View className="flex flex-1 flex-col items-center justify-center">
          <FTitle className="text-4xl">Fundamental</FTitle>
          <Button
            title="Login/Register"
            className="mt-2 w-2/3 bg-primary"
            onPress={() =>
              login({ loginMethods: ['email', 'google', 'github'] }).catch((error) => {
                if (error.message.includes('The login flow was closed')) {
                  console.log('Login flow was cancelled by the user.');
                } else {
                  console.error('Login error:', error);
                }
              })
            }
          />
        </View>
      </Frame>
    </>
  );
}
