import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { usePrivy, useEmbeddedWallet } from '@privy-io/expo';
import { router } from 'expo-router';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, LayoutRectangle } from 'react-native';

import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { CustomRefreshControl } from '~/components/CustomRefreshControl';
import Graph from '~/components/Graph';
import { GraphRangeSelector } from '~/components/Graph/GraphRangeSelector';
import { GuideTour, GuideStep } from '~/components/Guide/GuideTour';
import { HeaderBar } from '~/components/HeaderBar';
import { HomeInfo } from '~/components/Info/HomeInfo';
import { ProfileDetailModal } from '~/components/Profile/ProfileDetailModal';
import { FText } from '~/components/Text/FText';
import { TradeHistoryButton } from '~/components/Transaction/TradeHistoryButton';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { refreshUserBalances } from '~/services/refreshUserBalance';
import { GraphRange, graphRangeMap } from '~/types/graph';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';

export default function Home() {
  const { user, tokens, updateUser } = useAppData();
  const { user: privyUser } = usePrivy();
  const wallet = useEmbeddedWallet();
  const { updatePrivy } = useAppData();
  useEffect(() => {
    const updateUser = async () => {
      await updatePrivy({ user: privyUser!, wallet });
    };

    updateUser();
  }, [privyUser, wallet]);
  const [selectedRange, setSelectedRange] = useState<GraphRange>('1month');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isProfileDetailModalVisible, setIsProfileDetailModalVisible] = useState(false);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [guideSteps, setGuideSteps] = useState<GuideStep[]>([]);

  const graphRef = useRef<View>(null);
  const actionsRef = useRef<View>(null);
  const assetsRef = useRef<View>(null);

  const measure = (ref: React.RefObject<View>): Promise<LayoutRectangle> => {
    return new Promise((resolve) => {
      ref.current?.measure((_x, _y, width, height, pageX, pageY) => {
        resolve({ x: pageX, y: pageY, width, height });
      });
    });
  };

  const startGuide = async () => {
    const graphView = graphRef.current;
    const actionsView = actionsRef.current;
    const assetsView = assetsRef.current;

    if (graphView && actionsView && assetsView) {
      const [graphLayout, actionsLayout, assetsLayout] = await Promise.all([
        measure(graphRef),
        measure(actionsRef),
        measure(assetsRef),
      ]);

      setGuideSteps([
        {
          name: 'graph',
          text: 'The graph shows the evolution of your portfolio over time.',
          target: graphLayout,
          shape: 'rounded-rectangle',
          borderRadius: 12,
        },
        {
          name: 'actions',
          text: 'Use the send, receive, and deposit buttons to quickly manage your assets.',
          target: actionsLayout,
          shape: 'rounded-rectangle',
          borderRadius: 12,
        },
        {
          name: 'assets',
          text: "Your money and crypto's value is displayed here. Tap an asset to learn more.",
          target: assetsLayout,
          shape: 'rounded-rectangle',
          borderRadius: 12,
        },
      ]);
      setIsGuideVisible(true);
    }
  };

  // Time range options and labels
  const rangeOptions: GraphRange[] = ['1day', '1week', '1month', '1year'];
  const rangeLabels: Record<GraphRange, string> = {
    '1day': '1D',
    '1week': '1W',
    '1month': '1M',
    '1year': '1Y',
  };

  // Combine token series into total portfolio value series
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
      <HeaderBar title="Home" onInfoPress={startGuide} />
      <CustomRefreshControl
        onRefresh={onBalanceRefresh}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{ paddingBottom: 50 }}>
        <View className="flex gap-y-4">
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
              onPress={() => {
                router.push('/send');
              }}
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
          <TradeHistoryButton />
          <View ref={assetsRef} onLayout={() => {}}>
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
      <GuideTour
        visible={isGuideVisible}
        steps={guideSteps}
        onClose={() => setIsGuideVisible(false)}
      />
    </Frame>
  );
}
