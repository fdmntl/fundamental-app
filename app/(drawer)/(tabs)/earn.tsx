import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Image, Linking, TextInput, Modal } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { Container } from '~/components/Container';
import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';

// Types
type SortType = 'balance' | 'apy';
type Token = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  balance: number;
  staked: number;
  apy: number;
  usdPrice: number;
  gains: number; // gains en %
};

// Mock data
const mockTokens: Token[] = [
  {
    id: '1',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '◆',
    balance: 0.067,
    staked: 0.5,
    apy: 4.2,
    usdPrice: 4209.1,
    gains: 8.5,
  },
  {
    id: '2',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '$',
    balance: 1500,
    staked: 5000,
    apy: 5.8,
    usdPrice: 1,
    gains: 12.3,
  },
  {
    id: '3',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    icon: '₿',
    balance: 0.012,
    staked: 0,
    apy: 3.5,
    usdPrice: 89500,
    gains: 0,
  },
];

export default function Earn() {
  const [sortBy, setSortBy] = useState<SortType>('balance');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [useUSD, setUseUSD] = useState(false);

  // Trier les tokens
  const sortedTokens = [...mockTokens].sort((a, b) => {
    if (sortBy === 'balance') {
      return (b.staked * b.usdPrice) - (a.staked * a.usdPrice);
    }
    return b.apy - a.apy;
  });

  // Calculer la valeur totale stakée
  const totalStakedUSD = mockTokens.reduce((sum, token) => 
    sum + (token.staked * token.usdPrice), 0
  );

  // Calculer les gains totaux
  const totalGainsUSD = mockTokens.reduce((sum, token) => {
    if (token.staked === 0) return sum;
    return sum + (token.staked * token.usdPrice * token.gains / 100);
  }, 0);

  // Convertir montant token <-> USD
  const getDisplayAmount = (token: Token) => {
    if (!stakeAmount) return '';
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount)) return '';
    
    if (useUSD) {
      return `${amount} USD`;
    }
    return `${amount} ${token.symbol}`;
  };

  const getConvertedAmount = (token: Token) => {
    if (!stakeAmount) return '';
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount)) return '';
    
    if (useUSD) {
      return `≈ ${(amount / token.usdPrice).toFixed(6)} ${token.symbol}`;
    }
    return `≈ $${(amount * token.usdPrice).toFixed(2)}`;
  };

  const handleStake = (token: Token) => {
    setSelectedToken(token);
    setStakeAmount('');
    setUseUSD(false);
    setShowStakeModal(true);
  };

  const handleUnstake = (token: Token) => {
    setSelectedToken(token);
    setStakeAmount('');
    setUseUSD(false);
    setShowUnstakeModal(true);
  };

  const confirmStake = () => {
    // Ici vous ajouterez l'appel au smart contract
    console.log(`Staking ${stakeAmount} ${useUSD ? 'USD' : selectedToken?.symbol}`);
    setShowStakeModal(false);
  };

  const confirmUnstake = () => {
    // Ici vous ajouterez l'appel au smart contract
    console.log(`Unstaking ${stakeAmount} ${useUSD ? 'USD' : selectedToken?.symbol}`);
    setShowUnstakeModal(false);
  };

  return (
    <Frame>
      <View className="flex-1">
        <HeaderBar title="Earn" />
        
        <ScrollView className="flex-1">

          {/* Stats d'en-tête */}
          <Container>
            <View className="gap-4 rounded-xl bg-primary/10 p-4">
              <View>
                <FText className="text-sm text-neutral">Total Staked Value</FText>
                <FText className="text-3xl" bold>${totalStakedUSD.toFixed(2)}</FText>
              </View>
              <View className="flex-row justify-between">
                <View>
                  <FText className="text-sm text-neutral">Total Earnings</FText>
                  <FText className="text-xl text-success" bold>+${totalGainsUSD.toFixed(2)}</FText>
                </View>
                <View>
                  <FText className="text-sm text-neutral">Avg APY</FText>
                  <FText className="text-xl" bold>
                    {(mockTokens.reduce((sum, t) => sum + t.apy, 0) / mockTokens.length).toFixed(1)}%
                  </FText>
                </View>
              </View>
            </View>
          </Container>

          {/* Options de tri */}
          <View className="flex-row gap-2 px-4 pb-4 mt-5">
            <TouchableOpacity
              onPress={() => setSortBy('balance')}
              className={`flex-1 rounded-lg border p-3 ${
                sortBy === 'balance' ? 'border-primary bg-primary/10' : 'border-neutral/20'
              }`}>
              <FText className={sortBy === 'balance' ? 'text-primary' : 'text-text'} bold>
                Sort by Balance
              </FText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSortBy('apy')}
              className={`flex-1 rounded-lg border p-3 ${
                sortBy === 'apy' ? 'border-primary bg-primary/10' : 'border-neutral/20'
              }`}>
              <FText className={sortBy === 'apy' ? 'text-primary' : 'text-text'} bold>
                Sort by APY
              </FText>
            </TouchableOpacity>
          </View>

          {/* Liste des tokens */}
          <Container>
            <View className="gap-3">
              {sortedTokens.map((token) => (
                <View key={token.id} className="rounded-xl border border-neutral/20 bg-background p-4">
                  {/* En-tête du token */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                        <FText className="text-2xl">{token.icon}</FText>
                      </View>
                      <View>
                        <FText className="text-lg" bold>{token.symbol}</FText>
                        <FText className="text-sm text-neutral">{token.name}</FText>
                      </View>
                    </View>
                    <View className="items-end">
                      <View className="rounded-full bg-success/20 px-3 py-1">
                        <FText className="text-success" bold>{token.apy}% APY</FText>
                      </View>
                    </View>
                  </View>

                  {/* Balances */}
                  <View className="mt-4 gap-2">
                    <View className="flex-row justify-between">
                      <FText className="text-neutral">Available</FText>
                      <FText bold>
                        {token.balance} {token.symbol} (${(token.balance * token.usdPrice).toFixed(2)})
                      </FText>
                    </View>
                    {token.staked > 0 && (
                      <>
                        <View className="flex-row justify-between">
                          <FText className="text-neutral">Staked</FText>
                          <FText bold>
                            {token.staked} {token.symbol} (${(token.staked * token.usdPrice).toFixed(2)})
                          </FText>
                        </View>
                        <View className="flex-row justify-between">
                          <FText className="text-neutral">Earnings</FText>
                          <FText className="text-success" bold>
                            +{token.gains}% (${((token.staked * token.usdPrice * token.gains) / 100).toFixed(2)})
                          </FText>
                        </View>
                      </>
                    )}
                  </View>

                  {/* Boutons d'action */}
                  <View className="mt-4 flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleStake(token)}
                      disabled={token.balance === 0}
                      className={`flex-1 rounded-lg py-3 ${
                        token.balance === 0 ? 'bg-neutral/20' : 'bg-primary'
                      }`}>
                      <FText className={`text-center ${token.balance === 0 ? 'text-neutral' : 'text-white'}`} bold>
                        Stake
                      </FText>
                    </TouchableOpacity>
                    {token.staked > 0 && (
                      <TouchableOpacity
                        onPress={() => handleUnstake(token)}
                        className="flex-1 rounded-lg border-2 border-primary py-3">
                        <FText className="text-center text-primary" bold>
                          Unstake
                        </FText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Container>

          {/* Info Aave */}
          <Container className='mt-4'>
            <View className="relative mt-2 gap-2">
              <Image
                source={require('~/assets/aave-splash.png')}
                className="h-[9rem] w-full rounded-xl"
              />
              <Image
                source={require('~/assets/Aave-logo.png')}
                className="absolute left-3 top-3 h-8 w-32"
                resizeMode="contain"
              />
              <FText className="text-base">
                Built on Aave - the protocol trusted by millions for decentralized lending and earning.
              </FText>
              <TouchableOpacity onPress={() => Linking.openURL('https://aave.com/')}>
                <View className="flex-row items-center gap-1">
                  <FText className="text-sm text-neutral">Learn more</FText>
                  <Feather name="external-link" size={12} className="text-neutral" />
                </View>
              </TouchableOpacity>
            </View>
          </Container>

          <View className="h-8" />
        </ScrollView>
      </View>

      {/* Modal de Stake */}
      <Modal visible={showStakeModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-background p-6">
            <View className="mb-6 flex-row items-center justify-between">
              <FText className="text-2xl" bold>Stake {selectedToken?.symbol}</FText>
              <TouchableOpacity onPress={() => setShowStakeModal(false)}>
                <Feather name="x" size={24} />
              </TouchableOpacity>
            </View>

            {/* Informations */}
            <View className="mb-6 gap-3 rounded-xl bg-primary/10 p-4">
              <View className="flex-row justify-between">
                <FText className="text-neutral">APY</FText>
                <FText className="text-success" bold>{selectedToken?.apy}%</FText>
              </View>
              <View className="flex-row justify-between">
                <FText className="text-neutral">Available Balance</FText>
                <FText bold>
                  {selectedToken?.balance} {selectedToken?.symbol}
                </FText>
              </View>
              <View className="flex-row justify-between">
                <FText className="text-neutral">Current Price</FText>
                <FText bold>${selectedToken?.usdPrice.toFixed(2)}</FText>
              </View>
            </View>

            {/* Input avec switch USD */}
            <View className="mb-2">
              <FText className="mb-2 text-neutral">Amount to Stake</FText>
              <View className="flex-row items-center rounded-xl border border-neutral/20 bg-background">
                <TextInput
                  value={stakeAmount}
                  onChangeText={setStakeAmount}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  className="flex-1 p-4 text-text"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  onPress={() => setUseUSD(!useUSD)}
                  className="mr-4 rounded-lg bg-primary/20 px-3 py-2">
                  <FText className="text-primary" bold>{useUSD ? 'USD' : selectedToken?.symbol}</FText>
                </TouchableOpacity>
              </View>
              {stakeAmount && selectedToken && (
                <FText className="mt-1 text-sm text-neutral">
                  {getConvertedAmount(selectedToken)}
                </FText>
              )}
            </View>

            {/* Bouton Max */}
            <TouchableOpacity
              onPress={() => setStakeAmount(selectedToken?.balance.toString() || '0')}
              className="mb-6 self-end">
              <FText className="text-primary" bold>Use Max</FText>
            </TouchableOpacity>

            {/* Résumé */}
            {stakeAmount && selectedToken && (
              <View className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <FText className="mb-2 text-lg" bold>Confirmation</FText>
                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <FText className="text-neutral">You will stake</FText>
                    <FText bold>{getDisplayAmount(selectedToken)}</FText>
                  </View>
                  <View className="flex-row justify-between">
                    <FText className="text-neutral">Estimated yearly earnings</FText>
                    <FText className="text-success" bold>
                      +${((parseFloat(stakeAmount) * (useUSD ? 1 : selectedToken.usdPrice) * selectedToken.apy) / 100).toFixed(2)}
                    </FText>
                  </View>
                </View>
              </View>
            )}

            {/* Boutons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowStakeModal(false)}
                className="flex-1 rounded-xl border-2 border-neutral/20 py-4">
                <FText className="text-center" bold>Cancel</FText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmStake}
                disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
                className={`flex-1 rounded-xl py-4 ${
                  !stakeAmount || parseFloat(stakeAmount) === 0 ? 'bg-neutral/20' : 'bg-primary'
                }`}>
                <FText className="text-center text-white" bold>Confirm Stake</FText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Unstake */}
      <Modal visible={showUnstakeModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-background p-6">
            <View className="mb-6 flex-row items-center justify-between">
              <FText className="text-2xl" bold>Unstake {selectedToken?.symbol}</FText>
              <TouchableOpacity onPress={() => setShowUnstakeModal(false)}>
                <Feather name="x" size={24} />
              </TouchableOpacity>
            </View>

            {/* Informations */}
            <View className="mb-6 gap-3 rounded-xl bg-primary/10 p-4">
              <View className="flex-row justify-between">
                <FText className="text-neutral">Staked Balance</FText>
                <FText bold>
                  {selectedToken?.staked} {selectedToken?.symbol}
                </FText>
              </View>
              <View className="flex-row justify-between">
                <FText className="text-neutral">Total Earnings</FText>
                <FText className="text-success" bold>
                  +{selectedToken?.gains}% (${selectedToken && ((selectedToken.staked * selectedToken.usdPrice * selectedToken.gains) / 100).toFixed(2)})
                </FText>
              </View>
            </View>

            {/* Input avec switch USD */}
            <View className="mb-2">
              <FText className="mb-2 text-neutral">Amount to Unstake</FText>
              <View className="flex-row items-center rounded-xl border border-neutral/20 bg-background">
                <TextInput
                  value={stakeAmount}
                  onChangeText={setStakeAmount}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  className="flex-1 p-4 text-text"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  onPress={() => setUseUSD(!useUSD)}
                  className="mr-4 rounded-lg bg-primary/20 px-3 py-2">
                  <FText className="text-primary" bold>{useUSD ? 'USD' : selectedToken?.symbol}</FText>
                </TouchableOpacity>
              </View>
              {stakeAmount && selectedToken && (
                <FText className="mt-1 text-sm text-neutral">
                  {getConvertedAmount(selectedToken)}
                </FText>
              )}
            </View>

            {/* Bouton Max */}
            <TouchableOpacity
              onPress={() => setStakeAmount(selectedToken?.staked.toString() || '0')}
              className="mb-6 self-end">
              <FText className="text-primary" bold>Unstake All</FText>
            </TouchableOpacity>

            {/* Résumé */}
            {stakeAmount && selectedToken && (
              <View className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <FText className="mb-2 text-lg" bold>Confirmation</FText>
                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <FText className="text-neutral">You will receive</FText>
                    <FText bold>{getDisplayAmount(selectedToken)}</FText>
                  </View>
                  <View className="flex-row justify-between">
                    <FText className="text-neutral">Including rewards</FText>
                    <FText className="text-success" bold>
                      +${((parseFloat(stakeAmount) * (useUSD ? 1 : selectedToken.usdPrice) * selectedToken.gains) / 100).toFixed(2)}
                    </FText>
                  </View>
                </View>
              </View>
            )}

            {/* Boutons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowUnstakeModal(false)}
                className="flex-1 rounded-xl border-2 border-neutral/20 py-4">
                <FText className="text-center" bold>Cancel</FText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmUnstake}
                disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
                className={`flex-1 rounded-xl py-4 ${
                  !stakeAmount || parseFloat(stakeAmount) === 0 ? 'bg-neutral/20' : 'bg-primary'
                }`}>
                <FText className="text-center text-white" bold>Confirm Unstake</FText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Frame>
  );
}