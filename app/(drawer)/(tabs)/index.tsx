import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { usePrivy, useEmbeddedWallet } from '@privy-io/expo';
import { router } from 'expo-router';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { View } from 'react-native';

import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { CustomRefreshControl } from '~/components/CustomRefreshControl';
import Graph from '~/components/Graph';
import { GraphRangeSelector } from '~/components/Graph/GraphRangeSelector';
import { HeaderBar } from '~/components/HeaderBar';
import { ProfileDetailModal } from '~/components/Profile/ProfileDetailModal';
import { TradeHistoryButton } from '~/components/Transaction/TradeHistoryButton';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { refreshUserBalances } from '~/services/refreshUserBalance';
import { GraphRange, graphRangeMap } from '~/types/graph';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';
import { setItem, getItem } from '~/utils/Storage/asyncStorage';
import { hasSeenOnboarding, markOnboardingAsSeen } from '~/utils/Storage/asyncStorage';
import { OnboardingScreen } from '~/components/OnboardingSceen/OnboardingScreen';
import { B } from '@privy-io/expo/dist/predicates-a469debb';

export default function Home() {
  const { user, tokens, updateUser } = useAppData();
  const { user: privyUser } = usePrivy();
  const wallet = useEmbeddedWallet();
  const { updatePrivy } = useAppData();

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const updateUser = async () => {
      await updatePrivy({ user: privyUser!, wallet });
    };
    updateUser();
  }, [privyUser, wallet]);

  useEffect(() => {
    const checkOnboardingScreen = async () => {
      const seen = await hasSeenOnboarding();
      if (!seen) {
        await markOnboardingAsSeen();
        setShowOnboarding(true);
      }
    };
    checkOnboardingScreen();
  }, []);

  const [selectedRange, setSelectedRange] = useState<GraphRange>('1month');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isProfileDetailModalVisible, setIsProfileDetailModalVisible] = useState(false);

  const rangeOptions: GraphRange[] = ['1day', '1week', '1month', '1year'];
  const rangeLabels: Record<GraphRange, string> = {
    '1day': '1D',
    '1week': '1W',
    '1month': '1M',
    '1year': '1Y',
  };

  const totalData = useMemo(() => {
    if (!tokens.length) return [];
    const key = graphRangeMap[selectedRange];
    const firstSeries = tokens[0][key] || [];
    const length = firstSeries.length;
    if (length === 0) return [];

    const labels = firstSeries.map((dp) => dp.label);
    const sums = new Array<number>(length).fill(0);

    tokens.forEach((token) => {
      const series = token[key] || [];
      const amount = getUserTokenAmount(token.address, tokens, user);
      for (let i = 0; i < length; i++) {
        sums[i] += (series[i]?.value || 0) * amount;
      }
    });

    let combinedLatestValue = 0;
    tokens.forEach((token) => {
      if (typeof token.last_value === 'number') {
        const amount = getUserTokenAmount(token.address, tokens, user);
        combinedLatestValue += token.last_value * amount;
      }
    });

    const historicalData = sums.map((value, i) => ({ value, label: labels[i] }));
    const currentTimeLabel = new Date().toISOString();
    return [...historicalData, { value: combinedLatestValue, label: currentTimeLabel }];
  }, [tokens, user, selectedRange]);

  const stableCoins = tokens.filter((item) => item.is_stablecoin);
  const cryptos = tokens.filter((item) => !item.is_stablecoin);

  const onBalanceRefresh = useCallback(async () => {
    if (!user) {
      console.warn('no user, skipping');
      return;
    }
    await refreshUserBalances(user, updateUser);
  }, [user, updateUser]);

  return (
    <Frame>
      <OnboardingScreen visible={showOnboarding} onClose={() => setShowOnboarding(false)} />

      <HeaderBar title="Home" />
      <CustomRefreshControl
        onRefresh={onBalanceRefresh}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{ paddingBottom: 50 }}>
        <View className="flex gap-y-4">
          <View
            onTouchStart={() => setScrollEnabled(false)}
            onTouchEnd={() => setScrollEnabled(true)}
            onTouchCancel={() => setScrollEnabled(true)}>
            <Container noPadding>
              <Graph
                data={totalData}
                selectedRange={selectedRange}
                selectedRangeComponent={
                  <GraphRangeSelector
                    rangeOptions={rangeOptions}
                    selectedRange={selectedRange}
                    onSelectRange={setSelectedRange}
                    rangeLabels={rangeLabels}
                  />
                }
              />
            </Container>
          </View>

          <View className="flex-row items-center justify-between px-2">
            <Button
              title="onboarding screen"
              disableGradient
              className="flex-1 bg-content"
              onPress={() => setShowOnboarding(true)}
            />
            <Button
              title="check value"
              className="flex-1 bg-content"
              disableGradient
              onPress={async () => {
                const value = await getItem('hasSeenOnboardingScreen');
                console.log('Value:', value);
              }}
            />
            <Button
              title="clear storage"
              className="flex-1 bg-content"
              disableGradient
              onPress={async () => {
                await setItem('hasSeenOnboardingScreen', false);
                console.log('Storage cleared');
              }}
            />
          </View>
          <View className="h-14 w-full flex-row gap-4">
            <Button
              icon={<Feather name="send" size={24} className="text-text" />}
              disableGradient
              className="flex-1 bg-content"
              onPress={() => router.push('/send')}
            />
            <Button
              icon={<FontAwesome6 name="qrcode" size={22} className="text-text" />}
              disableGradient
              className="flex-1 bg-content"
              onPress={() => setIsProfileDetailModalVisible(true)}
            />
            <Button
              icon={<Feather name="plus" size={20} className="text-white" />}
              title="Deposit"
              className="flex-[2] bg-content"
              onPress={() => {}}
            />
          </View>

          <TradeHistoryButton />

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
      </CustomRefreshControl>

      <ProfileDetailModal
        visible={isProfileDetailModalVisible}
        onClose={() => setIsProfileDetailModalVisible(false)}
      />
    </Frame>
  );
}
