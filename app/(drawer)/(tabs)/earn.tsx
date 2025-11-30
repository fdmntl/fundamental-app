import { useState } from 'react';
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
import { SortType, EarnToken } from '~/types/earn';
import {
  mapTokensToEarnTokens,
  sortTokens,
  calculateTotalStakedUSD,
  calculateTotalGainsUSD,
  calculateAverageAPY,
} from '~/utils/earn.utils';

export default function Earn() {
  const { theme } = useTheme();
  const { user, tokens, privy, getToken } = useAppData();
  const [sortBy, setSortBy] = useState<SortType>('balance');
  const [selectedToken, setSelectedToken] = useState<EarnToken | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [useUSD, setUseUSD] = useState(false);

  const [stakedData, setStakedData] = useState<{
    [address: string]: { staked: number; gains: number };
  }>({});

  const earnTokens = mapTokensToEarnTokens(tokens, user, stakedData);
  const sortedTokens = sortTokens(earnTokens, sortBy);

  const totalStakedUSD = calculateTotalStakedUSD(earnTokens);
  const totalGainsUSD = calculateTotalGainsUSD(earnTokens);
  const averageAPY = calculateAverageAPY(earnTokens);

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
    console.log(`Stake ${stakeAmount} ${useUSD ? 'USD' : selectedToken.symbol}`);
    // TODO: appel à smart contract ici
    setShowStakeModal(false);
  };

  const handleConfirmUnstake = () => {
    if (!selectedToken) return;
    console.log(`Unstake ${stakeAmount} ${useUSD ? 'USD' : selectedToken.symbol}`);
    // TODO: appel à smart contract ici
    setShowUnstakeModal(false);
  };

  return (
    <Frame>
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
            user={user}
            onStake={handleStake}
            onUnstake={handleUnstake}
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
          setStakeAmount(selectedToken.balance.toString());
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
    </Frame>
  );
}
