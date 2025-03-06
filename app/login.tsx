import { usePrivy, useEmbeddedWallet, useLogin, useEmbeddedEthereumWallet } from '@privy-io/expo';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { View, BackHandler, Image } from 'react-native';
import { Button } from '~/components/Button';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { addUserToDB } from '~/services/addUserToDB';

const fundy = require('../assets/fundy.png');

export default function Login() {
  const { user } = usePrivy();
  const wallet = useEmbeddedWallet();

  const { updatePrivy } = useAppData();

  useEffect(() => {
    if (user) {
      updatePrivy({ user, wallet });
      router.navigate('/(tabs)');
    }
  }, [user]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  const { login } = useLogin();

  const handleLogin = async () => {
    try {
      const session = await login({ loginMethods: ['email', 'google', 'github'] });
      console.log('Logged in:', session.user);
      await addUserToDB(session.user);
      updatePrivy({ user: session.user, wallet });
      router.navigate('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

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
          <Button title="Login/Register" className="mt-2 w-1/2 !bg-content" onPress={handleLogin} />
        </View>
      </Frame>
    </>
  );
}
