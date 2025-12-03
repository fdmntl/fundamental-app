import { useEffect, useState, useRef, useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import { AaveInfo } from '~/components/Earn/AaveInfo';
import { EarnStats } from '~/components/Earn/EarnStats';
import { SortButtons } from '~/components/Earn/SortButtons';
import { StakeModal } from '~/components/Earn/StakeModal';
import { TokenList } from '~/components/Earn/TokenList';
import { UnstakeModal } from '~/components/Earn/UnstakeModal';
import { HeaderBar } from '~/components/HeaderBar';
import { WavyLine } from '~/components/WavyLine';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { useTheme } from '~/components/Wrappers/ThemeWrapper';
import { SortType, EarnToken, StakedData } from '~/types/earn';
import {
  mapTokensToEarnTokens,
  sortTokens,
  calculateTotalStakedUSD,
  calculateTotalGainsUSD,
  calculateAverageAPY,
} from '~/utils/earn.utils';

import {
  getStakedBalance,
  depositToAave,
  withdrawFromAave,
  SUPPORTED_TOKENS,
} from '~/services/Aave/aaveService';
import { CustomRefreshControl } from '~/components/CustomRefreshControl';


export default function Earn() {
  const { theme } = useTheme();
  const { user, tokens, privy } = useAppData();
  const wallet = privy.wallet;
  const [sortBy, setSortBy] = useState<SortType>('balance');
  const [selectedToken, setSelectedToken] = useState<EarnToken | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [useUSD, setUseUSD] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [stakedData, setStakedData] = useState<{
    [address: string]: StakedData;
  }>({});
  const [averageAPY, setAverageAPY] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStakedData = async () => {
      setLoading(true);
      setScrollEnabled(false);
      const data: { [address: string]: StakedData } = {};
      for (const token of tokens) {
        console.log('Fetching staked data for token:', token.symbol);
        if (token.symbol in SUPPORTED_TOKENS) {
          const staked = await getStakedBalance(token.symbol as keyof typeof SUPPORTED_TOKENS, wallet);
          data[token.address] = {
            ...staked,
          };
        }
      }
      setStakedData(data);
      getAverageAPY();
      setScrollEnabled(true);
      setLoading(false);
    };

    fetchStakedData();
  },[]);
  
  const fetchStakedData = useCallback(async () => {
    setLoading(true);
    setScrollEnabled(false);
    const data: { [address: string]: StakedData } = {};
    for (const token of tokens) {
      console.log('Fetching staked data for token:', token.symbol);
      if (token.symbol in SUPPORTED_TOKENS) {
        const staked = await getStakedBalance(token.symbol as keyof typeof SUPPORTED_TOKENS, wallet);
        console.log('Staked data:', staked);
        data[token.address] = {
          ...staked,
        };
        
      }
    }
    console.log('All staked data:', data);
    setStakedData(data);
    getAverageAPY();
    setScrollEnabled(true);
    setLoading(false);
  }, [tokens, wallet]);

  const scrollViewRef = useRef<ScrollView>(null);
  

  const earnTokens = mapTokensToEarnTokens(tokens, user, stakedData);
  const sortedTokens = sortTokens(earnTokens, sortBy);

  const totalStakedUSD = calculateTotalStakedUSD(earnTokens);
  const totalGainsUSD = calculateTotalGainsUSD(earnTokens);

  const getAverageAPY = () => {
    const apy = earnTokens.length > 0 ? calculateAverageAPY(earnTokens) : 0;
    setAverageAPY(apy);
  };

  const handleStake = (token: EarnToken) => {
    setSelectedToken(token);
    setStakeAmount('');
    setUseUSD(false);
    setShowStakeModal(true);
  };

  const handleUnstake = (token: EarnToken) => {
    setSelectedToken(token);
    setStakeAmount('');
    setUseUSD(false);
    setShowUnstakeModal(true);
  };

  const handleConfirmStake = () => {
    if (!selectedToken) return;
    depositToAave(selectedToken.symbol as keyof typeof SUPPORTED_TOKENS, stakeAmount, wallet);
    console.log(`Stake ${stakeAmount} ${useUSD ? 'USD' : selectedToken.symbol}`);
    // TODO: appel à smart contract ici
    setShowStakeModal(false);
  };

  const handleConfirmUnstake = () => {
    if (!selectedToken) return;
    withdrawFromAave(selectedToken.symbol as keyof typeof SUPPORTED_TOKENS, stakeAmount, wallet);
    console.log(`Unstake ${stakeAmount} ${useUSD ? 'USD' : selectedToken.symbol}`);
    // TODO: appel à smart contract ici
    setShowUnstakeModal(false);
  };

  return (
    <Frame>
      <CustomRefreshControl
              ref={scrollViewRef}
              onRefresh={fetchStakedData}
              scrollEnabled={scrollEnabled}
              contentContainerStyle={{ paddingBottom: 50 }}>
        <HeaderBar title="Earn" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-6 pb-10">
            <EarnStats
              totalStakedUSD={totalStakedUSD}
              totalGainsUSD={totalGainsUSD}
              averageAPY={averageAPY}
            />

            <WavyLine className={`${theme === 'dark' ? 'text-content' : 'text-gray-400'}`} />

            <SortButtons sortBy={sortBy} onSortChange={setSortBy} />
            
            <TokenList
              tokens={sortedTokens}
              onStake={handleStake}
              onUnstake={handleUnstake}
              loading={loading}
            />

            <AaveInfo />
          </View>
        </ScrollView>

        {/* Stake Modal */}
        <StakeModal
          visible={showStakeModal}
          token={selectedToken}
          amount={stakeAmount}
          useUSD={useUSD}
          onClose={() => setShowStakeModal(false)}
          onAmountChange={setStakeAmount}
          onToggleCurrency={() => setUseUSD(!useUSD)}
          onConfirm={handleConfirmStake}
          onMax={() => {
            if (!selectedToken) return;
            setStakeAmount((selectedToken.balance - 0.1 / (10 ** selectedToken.digits)).toString());
          }}
        />

        {/* Unstake Modal */}
        <UnstakeModal
          visible={showUnstakeModal}
          token={selectedToken}
          amount={stakeAmount}
          useUSD={useUSD}
          onClose={() => setShowUnstakeModal(false)}
          onAmountChange={setStakeAmount}
          onToggleCurrency={() => setUseUSD(!useUSD)}
          onConfirm={handleConfirmUnstake}
          onMax={() => {
            if (!selectedToken) return;
            setStakeAmount(selectedToken.staked.toString());
          }}
        />
      </CustomRefreshControl>
    </Frame>
  );
}
