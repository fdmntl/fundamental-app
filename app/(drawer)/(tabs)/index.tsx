import { Link } from 'expo-router';
import { View, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { DebugButton } from '~/components/DebugButton';
import { HeaderBar, PillMessageBox } from '~/components/HeaderBar';
import { LogoutButton } from '~/components/LogoutButton';
import { ProfileModal } from '~/components/Profile/ProfileModal';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { InsertSupabaseData } from '~/services/Supabase/insertData';
import { useEffect, useRef } from 'react';
import { supabase } from '~/supabaseConfig';

import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';

export default function Home() {
  const { privy, user } = useAppData();
  const homePillContent = () => {
    return (
      <PillMessageBox>
        <FText className="!text-2xl" bold>
          Good Morning!
        </FText>
      </PillMessageBox>
    );
  };

  const showToast = () => {
    Toast.show({
      type: 'fundamental',
      text1: 'Hello',
      text2: 'This is a toast 👋',
    });
  };

  async function AddUser(user: any, wallet: any) {
    const user_id = user.id;
    // Check if user already exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', wallet.account.address)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Supabase fetch error:', fetchError);
      return;
    }
    if (existingUser) {
      console.log('User already exists in Supabase, skipping creation');
      return;
    }
    const data = {
      id: user_id,
      created_at: new Date(),
      ens: '', // might wanna add this later
      balances: [],
      wallet_address: wallet.account.address,
      total_value_historic: [],
    };
    try {
      const insertedUsers = await InsertSupabaseData({
        tableName: 'users',
        data: [data],
        upsert: false,
      });
      console.log('✅ User added:', insertedUsers);
    } catch (error: any) {
      console.error('❌ Failed to add user:', error);
    }
  }

  const ref = useRef(false);
  useEffect(() => {
    const addUserIfNeeded = async () => {
      if (privy.user && privy.wallet && !ref.current) {
        try {
          await AddUser(privy.user, privy.wallet);
          ref.current = true;
        } catch (error) {
          console.error('Error adding user:', error);
        }
      }
    };

    addUserIfNeeded();
  }, [privy.user, privy.wallet]);

  return (
    <Frame>
      <HeaderBar title="Home" pillContent={homePillContent} />
      <ScrollView>
        <View className="gap-2">
          <FTitle className="text-4xl">Welcome to Fundamental!</FTitle>
          <FText className="text-lg">This is Fundamental</FText>
          <ProfileModal />
          <View className="gap-4">
            <Container className="" title="User info">
              <FText className="text-lg">Your wallet status is {privy.wallet?.status}</FText>
              <FText className="text-lg">Your address is {privy.wallet?.account?.address}</FText>
              <FText className="text-lg">Your userId is {user.id}</FText>
              <FText className="text-lg">Your created your account at {user.created_at}</FText>
              <FText className="text-lg">Your ens is {user.ens}</FText>
            </Container>
            <Button title="Show toast" onPress={showToast} />
            <DebugButton />
            <LogoutButton />
          </View>
          <Container title="Hello World" className="mt-4">
            <View>
              <FText>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum."
              </FText>
            </View>
          </Container>
          <Link
            className="mt-4 bg-primary"
            href={{ pathname: '/details', params: { name: 'Dan' } }}
            asChild>
            <Button title="Show Details" />
          </Link>
        </View>
      </ScrollView>
    </Frame>
  );
}
