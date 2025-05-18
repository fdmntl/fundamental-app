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

  return (
    <Frame>
      <HeaderBar title="Fundamental" pillContent={homePillContent} />
      <ScrollView showsVerticalScrollIndicator={false} className=" padding-bottom-100">
        <View className="gap-2 pb-24">
          <ProfileModal />
          <View className="gap-4">
            <Container title="User info">
              <FText className="text-lg">Your wallet is {privy.wallet?.status}!</FText>
              {/* does he need to know that ? */}
              <FText className="text-lg">Your address is {privy.wallet?.account?.address}</FText>
              {/* Find better phrasing imo */}
              <FText className="text-lg">Your userId is {user.id}</FText>
              {/* Probably useless no? */}
              <FText className="text-lg">Your created your account at {user.created_at}</FText>
              {/* yeah ... */}
              <FText className="text-lg">Your ens is {user.ens}</FText>
              {/* show earlier on the page */}
              {/* probs a general balance of the wallet / biggest move in the coin he owns ? */}
            </Container>
            <DebugButton />
            <LogoutButton />
          </View>
        </View>
      </ScrollView>
    </Frame>
  );
}
