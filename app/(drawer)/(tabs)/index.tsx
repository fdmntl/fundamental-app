import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { usePrivy, useEmbeddedWallet } from '@privy-io/expo';
import { router } from 'expo-router';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView } from 'react-native';

import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { CustomRefreshControl } from '~/components/CustomRefreshControl';
import Graph from '~/components/Graph';
import { GraphRangeSelector } from '~/components/Graph/GraphRangeSelector';
import { HeaderBar } from '~/components/HeaderBar';
import { HomePageGuide, HomePageGuideHandle } from '~/components/Help/HomePageGuide';
import { OnboardingScreen } from '~/components/OnboardingSceen/OnboardingScreen';
import { ProfileDetailModal } from '~/components/Profile/ProfileDetailModal';
import { SurveyModal } from '~/components/Survey/SurveyModal';
import { TradeHistoryButton } from '~/components/Transaction/TradeHistoryButton';
import { UpdateCard } from '~/components/Update/UpdateCard';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { useSurveyManager } from '~/hooks/useSurveyManager';
import { trackEvent } from '~/services/PostHog/trackEvent';
import { refreshUserBalances } from '~/services/refreshUserBalance';
import { GraphRange, graphRangeMap } from '~/types/graph';
import { hasSeenOnboarding, markOnboardingAsSeen } from '~/utils/Storage/asyncStorage';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';

export default function Home() {
  const { user, tokens, updateUser } = useAppData();
  const { user: privyUser } = usePrivy();
  const wallet = useEmbeddedWallet();
  const { updatePrivy } = useAppData();
  const { isSurveyVisible, survey, handleCloseSurvey } = useSurveyManager();

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
  const guideRef = useRef<HomePageGuideHandle>(null);

  const graphRef = useRef<View>(null);
  const actionsRef = useRef<View>(null);
  const assetsRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const tradeHistoryRef = useRef<View>(null);

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

    // Determine the minimum length available across all token series for the current range
    let minLength = Infinity;
    let seriesForLabels: { label: string; value: number }[] | undefined = undefined;

    for (const token of tokens) {
      const series = token[key] || [];
      if (series.length < minLength) {
        minLength = series.length;
        seriesForLabels = series; // Keep track of a series that has this minLength for labels
      }
    }

    if (minLength === 0 || minLength === Infinity || !seriesForLabels) return [];

    const labels = seriesForLabels.map((dp) => dp.label);
    const sums = new Array<number>(minLength).fill(0);

    tokens.forEach((token) => {
      const series = token[key] || [];
      const amount = getUserTokenAmount(token.address, tokens, user);

      for (let i = 0; i < minLength; i++) {
        const dataPoint = series[i];
        let pointValue = 0;

        if (dataPoint !== undefined) {
          pointValue = dataPoint.value;
        }
        const valueContribution = (pointValue || 0) * amount;
        sums[i] += valueContribution;
      }
    });

    let combinedLatestValue = 0;
    tokens.forEach((token) => {
      const amount = getUserTokenAmount(token.address, tokens, user);
      if (typeof token.last_value === 'number') {
        combinedLatestValue += token.last_value * amount;
      }
    });

    const historicalData = sums.map((value, i) => ({ value, label: labels[i] }));
    const now = new Date();
    const currentTimeLabel = now.toISOString();
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
      <HeaderBar
        title="Home"
        onInfoPress={() => {
          guideRef.current?.startGuide();
          trackEvent('guide_started', {
            guide_type: 'home_page',
          });
        }}
      />

      <CustomRefreshControl
        ref={scrollViewRef}
        onRefresh={onBalanceRefresh}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{ paddingBottom: 50 }}>
        <View className="flex gap-y-4">
          <UpdateCard />
          <View
            ref={graphRef}
            onLayout={() => {}}
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
          <View ref={actionsRef} onLayout={() => {}} className="h-14 w-full flex-row gap-4">
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
              icon={<Feather name="plus" size={24} className="text-white" />}
              title="Deposit"
              className="flex-[2] bg-content"
              onPress={() => {
                router.push('/deposit');
              }}
            />
          </View>
          <View ref={tradeHistoryRef} onLayout={() => {}}>
            <TradeHistoryButton />
          </View>
          <View ref={assetsRef} onLayout={() => {}} className="gap-y-4">
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
        </View>
      </CustomRefreshControl>

      <ProfileDetailModal
        visible={isProfileDetailModalVisible}
        onClose={() => setIsProfileDetailModalVisible(false)}
      />
      <HomePageGuide
        ref={guideRef}
        graphRef={graphRef}
        actionsRef={actionsRef}
        assetsRef={assetsRef}
        tradeHistoryRef={tradeHistoryRef}
        scrollViewRef={scrollViewRef}
      />
      {survey && (
        <SurveyModal
          surveyName={survey.name}
          questions={survey.questions}
          isVisible={isSurveyVisible}
          onClose={handleCloseSurvey}
        />
      )}
    </Frame>
  );
}
