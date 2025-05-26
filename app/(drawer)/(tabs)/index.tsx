import { useEmbeddedWallet, usePrivy } from '@privy-io/expo';
import { useEffect } from 'react';
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

import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { router } from 'expo-router';

export default function Home() {
  const { privy, user } = useAppData();
  const { user: privyUser } = usePrivy();
  const wallet = useEmbeddedWallet();
  const { updatePrivy } = useAppData();

  useEffect(() => {
    const updateUser = async () => {
      await updatePrivy({ user: privyUser!, wallet });
    };

    updateUser();
  }, [privyUser, wallet]);

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

  return (
    <Frame>
      <HeaderBar title="Home" pillContent={homePillContent} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-2 pb-24">
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
            <Button title="Deposit" onPress={() => router.push('/deposit')} />
            <DebugButton />
            <LogoutButton />
          </View>
        </View>
      </ScrollView>
    </Frame>
  );
}
