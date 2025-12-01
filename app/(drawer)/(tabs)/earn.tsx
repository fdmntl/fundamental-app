import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Container } from '~/components/Container';
import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { EarnStats } from '~/components/Earn/EarnStats';
import { SortButtons } from '~/components/Earn/SortButtons';
import { TokenList } from '~/components/Earn/TokenList';
import { StakeModal } from '~/components/Earn/StakeModal';
import { UnstakeModal } from '~/components/Earn/UnstakeModal';
import { AaveInfo } from '~/components/Earn/AaveInfo';
import { SortType, EarnToken } from '~/types/earn';
import { Token, User } from '~/types/supabaseTypes';
import {
  mapTokensToEarnTokens,
  sortTokens,
  calculateTotalStakedUSD,
  calculateTotalGainsUSD,
} from '~/utils/earn.utils';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';

import { supplyUSDCToAave, getAaveSupplyAPY } from '~/services/Aave/earnUsdc';

export default function Earn() {
  const { user, tokens, privy, getToken } = useAppData();
  const wallet = privy.wallet;
  const [sortBy, setSortBy] = useState<SortType>('balance');
  const [selectedToken, setSelectedToken] = useState<EarnToken | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [useUSD, setUseUSD] = useState(false);
  const [stakedData, setStakedData] = useState<{ [address: string]: { staked: number; gains: number } }>({});
  const [loading, setLoading] = useState(true);
  const [averageAPY, setAverageAPY] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (averageAPY !== 0) return;
    getAverageAPY();
  }, [wallet]);

  const loadData = async () => {
    try {
      setLoading(true);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const earnTokens = mapTokensToEarnTokens(tokens, user, stakedData);
  const sortedTokens = sortTokens(earnTokens, sortBy);

  const totalStakedUSD = calculateTotalStakedUSD(earnTokens);
  const totalGainsUSD = calculateTotalGainsUSD(earnTokens);

  const getAverageAPY = async () => {
    const apy = await getAaveSupplyAPY(wallet);
    setAverageAPY(apy);
  }
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

  if (loading) {
    return (
      <Container>
        <HeaderBar title="Earn" />
        <View className="flex-1 items-center justify-center">
          <FText>Loading...</FText>
        </View>
      </Container>
    );
  }

  return (
    <Frame>
      <HeaderBar title="Earn" />
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        <EarnStats
          totalStakedUSD={totalStakedUSD}
          totalGainsUSD={totalGainsUSD}
          averageAPY={averageAPY}
        />
        <SortButtons sortBy={sortBy} onSortChange={setSortBy} />
        <TokenList tokens={sortedTokens} user={user} onStake={handleStake} onUnstake={handleUnstake} />
        <AaveInfo />
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
