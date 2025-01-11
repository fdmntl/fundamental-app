import { usePrivy, useLoginWithEmail, useOAuthFlow, useLogin } from '@privy-io/expo';
import Constants from 'expo-constants';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { DebugButton } from '~/components/DebugButton';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';

export default function Login() {
  const [email, setEmail] = useState(Constants.expoConfig?.extra?.email || '');
  const [code, setCode] = useState('');

  const { user } = usePrivy();
  const emailFlow = useLoginWithEmail();
  const oauth = useOAuthFlow();

  useEffect(() => {
    if (user) {
      router.navigate('/(tabs)');
    }
  }, [user, router]);

  useEffect(() => {
    if (emailFlow.state.status === 'error') {
      console.error(emailFlow.state.error);
    } else if (oauth.state.status === 'error') {
      console.error(oauth.state.error);
    }
  }, [emailFlow.state.status, oauth.state.status]);

  // login with google
  const { login } = useLogin();

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <Frame>
        <FTitle className="mx-auto text-4xl">Fundamental</FTitle>
        <Container title="E-Mail" className="mt-2 flex">
          <View className="mb-4 rounded-2xl border-2 border-gray-300">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              inputMode="email"
              className="w-full px-2"
              style={{ marginTop: 20, marginBottom: 20, fontSize: 20 }}
            />
          </View>
          <Button
            title="Send Code"
            className="m-auto mb-4 w-1/2 bg-primary"
            onPress={() => emailFlow.sendCode({ email })}
          />

          <View className="mb-4 rounded-2xl border-2 border-gray-300">
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Code"
              inputMode="numeric"
              className="w-full px-2"
              style={{ marginTop: 20, marginBottom: 20, fontSize: 20 }}
            />
          </View>
          <Button
            title="Login"
            className="m-auto w-2/3 bg-primary"
            onPress={() => emailFlow.loginWithCode({ code, email })}
          />
          <Button
            title="New UI Login"
            className="mx-auto my-4 w-2/3 bg-primary"
            onPress={() => login({ loginMethods: ['email', 'sms'] })}
          />
          <FText className="m-auto mt-4 text-text">
            (OTP state:{' '}
            <FText className="!text-primary" bold>
              {emailFlow.state.status}
            </FText>
            )
          </FText>
        </Container>
        <DebugButton />
      </Frame>
    </>
  );
}
