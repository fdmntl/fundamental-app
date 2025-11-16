import { usePrivy, useEmbeddedWallet, useLogin } from '@privy-io/expo';
import { router, Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View, BackHandler, Image } from 'react-native';

import { Button } from '~/components/Button';
import { FText } from '~/components/Text/FText';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { addUserToDB } from '~/services/addUserToDB';

export default function Login() {
  const { user } = usePrivy();
  const wallet = useEmbeddedWallet();

  const { updatePrivy, isReady } = useAppData();

  const { login } = useLogin();

  const lastSyncedUserIdRef = useRef<string | null>(null);

  const handleLogin = async () => {
    try {
      await login({ loginMethods: ['email', 'google'] });
    } catch (error: any) {
      if (error.message === 'The login flow was closed') {
        console.log('Login flow was closed by the user.');
        return;
      }
      console.error('Login error:', error);
    }
  };

  useEffect(() => {
    const setupUser = async () => {
      if (!user) {
        lastSyncedUserIdRef.current = null;
        return;
      }

      if (wallet && wallet.status === 'connected') {
        if (lastSyncedUserIdRef.current === user.id) {
          return;
        }

        lastSyncedUserIdRef.current = user.id;

        await addUserToDB(user);
        updatePrivy({ user, wallet });
        console.log('**** User and wallet updated in AppData ****');
      }
    };
    setupUser();
  }, [user, wallet, updatePrivy]);

  useEffect(() => {
    if (isReady && user) {
      console.log('**** App is ready, navigating to tabs ****');
      router.navigate('/(tabs)');
    }
  }, [isReady, user]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <Frame>
        <View className="mb-64 flex flex-1 flex-col items-center justify-center gap-2">
          <Image
            source={require('../assets/fundamental-text.png')}
            style={{ height: 55, width: 312.5 }}
            resizeMode="contain"
          />
          <FText className="mb-2 text-left text-2xl text-neutral" bold>
            The easiest wallet in the world!
          </FText>
          <Image
            source={require('../assets/app-icon.png')}
            style={{ height: 64, width: 64 }}
            resizeMode="contain"
          />
        </View>
        <View className="absolute bottom-16 w-full items-center">
          <Button title="Take Control Now" className="mt-2 !bg-content" onPress={handleLogin} />
        </View>
      </Frame>
    </>
  );
}
