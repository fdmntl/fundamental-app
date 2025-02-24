import { usePrivy, useEmbeddedWallet, useLogin, isNotCreated } from '@privy-io/expo';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View, BackHandler, Image } from 'react-native';

import { Button } from '~/components/Button';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';

const fundy = require('../assets/fundy.png');

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
        <View className="mb-64 flex flex-1 flex-col items-center justify-center">
          <Image source={fundy} style={{ height: 64, width: 96 }} resizeMode="contain" />
          <FTitle className="mt-4 text-4xl">Fundamental</FTitle>
          <FText className="text-left !text-neutral" bold>
            The easiest wallet in the world.
          </FText>
        </View>
        <View className="absolute bottom-16 w-full items-center">
          <Button
            title="Login/Register"
            className="mt-2 w-1/2 !bg-content"
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
