import { usePrivy, useEmbeddedWallet, useLogin, isNotCreated } from '@privy-io/expo';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { View, BackHandler, Image } from 'react-native';

import { Button } from '~/components/Button';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { InsertSupabaseData } from '~/services/Supabase/insertData';

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
            console.log('✅ Wallet created successfully!');
          } catch (error: any) {
            if (error.message?.includes('already has an embedded wallet')) {
              console.log('✅ Wallet already exists. Skipping creation.');
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
        <View className="mb-64 flex flex-1 flex-col items-center justify-center gap-2">
          <Image
            source={require('../assets/fundamental-text.png')}
            style={{ height: 55, width: 312.5 }}
            resizeMode="contain"
          />
          <FText className="mb-2 text-left !text-2xl !text-neutral" bold>
            The easiest wallet in the world.
          </FText>
          <Image
            source={require('../assets/app-icon.png')}
            style={{ height: 64, width: 64 }}
            resizeMode="contain"
          />
        </View>
        <View className="absolute bottom-16 w-full items-center">
          <Button
            title="Take Control Now"
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
