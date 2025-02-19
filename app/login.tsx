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
  const { login } = useLogin();

  const { updatePrivy } = useAppData();

  useEffect(() => {
    // Prevent back navigation while on the login screen
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user) {
      if (isNotCreated(wallet)) {
        try {
          wallet.create({ recoveryMethod: 'privy' });
          console.log('Success', 'Wallet created successfully!');
        } catch (error: any) {
          console.error('Error', 'Failed to create wallet: ' + error.message);
        }
      }

      updatePrivy({ user, wallet });

      router.replace('/(tabs)');
    }
  }, [user, router, wallet]);

  useEffect(() => {
    if (emailFlow.state.status === 'error') {
      console.error(emailFlow.state.error);
      // Error state to display a message in the UI
    }
  }, [emailFlow.state.status]);

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <Frame>
        <FTitle className="mx-auto text-4xl">Fundamental</FTitle>
        <Container title="E-Mail" className="mt-2 flex">
          <View className="mb-4 rounded-2xl border-2 border-gray-300">
            <TextInput
              className={`w-full px-2 text-3xl text-text`}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              inputMode="email"
              placeholderTextColor="#888"
            />
          </View>
          <Button
            title="Send Code"
            className="m-auto mb-4 w-1/2 bg-primary"
            onPress={() => emailFlow.sendCode({ email })}
          />
          <View className="mb-4 rounded-2xl border-2 border-gray-300">
            <TextInput
              className={'w-full px-2 text-3xl text-text'}
              value={code}
              onChangeText={setCode}
              placeholder="Code"
              inputMode="numeric"
              placeholderTextColor="#888"
            />
          </View>
          <Button
            title="Login"
            className="m-auto w-2/3 bg-primary"
            onPress={() => emailFlow.loginWithCode({ code, email })}
          />
          {/* New UI Login using updated useLogin
          <Button
            title="New UI Login"
            className="mx-auto my-4 w-2/3 bg-primary"
            onPress={() => login({ loginMethods: ['email', 'sms'] })}
          /> */}
          {/* <FText className="m-auto mt-4 text-text">
            (OTP state:{' '}
            <FText className="!text-primary" bold>
              {emailFlow.state.status}
            </FText>
            )
          </FText> */}
        </Container>
      </Frame>
    </>
  );
}
