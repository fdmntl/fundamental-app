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
import { TransactionBookDisplay } from '~/components/Transaction/TradeHistoric';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';
import { BalanceRefreshControl } from '~/components/BalanceRefreshControl';
import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import QuickAction from '~/components/QuickAction';

import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';

export default function Home() {
  const { tokens, user } = useAppData();
  const { user: privyUser } = usePrivy();
  const wallet = useEmbeddedWallet();
  const { updatePrivy } = useAppData();
  const stableCoins = tokens.filter((item) => item.is_stablecoin);
  const cryptos = tokens.filter((item) => !item.is_stablecoin);

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
            <BalanceRefreshControl>
              <View className="flex gap-y-5">
                {/* quick access Section*/}
                <View className="flex-row justify-between px-2">
                  <QuickAction
                    icon="dollar-sign"
                    label="Top-up"
                    onPress={() => Toast.show({ type: 'info', text1: 'Feature coming soon!' })}
                  />
                  <QuickAction
                    icon="send"
                    label="Send"
                    onPress={() => Toast.show({ type: 'info', text1: 'Feature coming soon!' })}
                  />
                  <QuickAction
                    icon="grid"
                    label="Receive"
                    onPress={() => Toast.show({ type: 'info', text1: 'Feature coming soon!' })}
                  />
                  <QuickAction
                    icon="repeat"
                    label="Trade"
                    onPress={() => Toast.show({ type: 'info', text1: 'Feature coming soon!' })}
                  />
                </View>
                {/* Trade Historic section */}
                <Container title="Trade Historic" className="mt-4">
                  <TransactionBookDisplay user={user} />
                </Container>
                {/* Coin section */}
                <Container title="Money">
                  <View className="flex gap-y-4">
                    {stableCoins
                      .sort(
                        (a, b) =>
                          getUserTokenValue(b.address, tokens, user) -
                          getUserTokenValue(a.address, tokens, user)
                      )
                      .map((item) => (
                        <AssetListDisplay key={item.address} token={item} />
                      ))}
                  </View>
                </Container>
                <Container title="Crypto">
                  <View className="flex gap-y-4">
                    {cryptos
                      .sort(
                        (a, b) =>
                          getUserTokenValue(b.address, tokens, user) -
                          getUserTokenValue(a.address, tokens, user)
                      )
                      .map((item) => (
                        <AssetListDisplay key={item.address} token={item} />
                      ))}
                  </View>
                </Container>
              </View>
            </BalanceRefreshControl>
          </View>
        </View>
      </ScrollView>
    </Frame>
  );
}
