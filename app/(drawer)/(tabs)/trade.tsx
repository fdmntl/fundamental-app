import { OrderParameters } from '@cowprotocol/cow-sdk';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { ConfirmTradeModal } from '~/components/Trade/ConfirmTradeModal';
import { QuoteDisplay } from '~/components/Trade/QuoteDisplay';
import { TradeHistoryButton } from '~/components/Transaction/TradeHistoryButton';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { checkAndSetCowAllowance } from '~/services/CoW/setCowInfiniteAllowance';
import { signCowQuote } from '~/services/CoW/signCowQuote';
import { submitCowOrder } from '~/services/CoW/submitCowOrder';
import { Token } from '~/types/supabaseTypes';
import { amountToDigits } from '~/utils/helpers/tokens/amountToDigits';

export default function Trade() {
  const { user, tokens, privy, getToken } = useAppData();
  const wallet = privy.wallet;

  const defaultToken = getToken('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'); // USDC on Base

  const [payAmount, setPayAmount] = useState('');
  const [selectedPayToken, setSelectedPayToken] = useState<Token | null>(defaultToken || null);
  const [selectedGetToken, setSelectedGetToken] = useState<Token | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [quote, setQuote] = useState<OrderParameters | null>(null);

  const toggleConfirmModal = () => {
    setIsConfirmModalOpen((prev) => !prev);
  };

  const possessedTokens = user.balances
    .map((balance) => tokens.find((token) => token.address === balance.address))
    .filter((token) => token !== undefined) as Token[];

  const selectedTokenBalance = selectedPayToken
    ? user.balances.find((balance) => balance.address === selectedPayToken.address)?.balance || 0
    : 0;

  const isAmountValid = parseFloat(payAmount) > 0 && parseFloat(payAmount) <= selectedTokenBalance;

  const handleSwapTokens = () => {
    console.log('Swap button pressed');

    // No swap if at least one token is not selected
    if (!selectedPayToken && !selectedGetToken) {
      console.log('Cannot swap - no tokens selected');
      Toast.show({
        type: 'info',
        text1: 'Please select at least one token',
      });
      return;
    }

    // Swap the tokens
    const tempToken = selectedPayToken;
    setSelectedPayToken(selectedGetToken);
    setSelectedGetToken(tempToken);
    setPayAmount('');
    setQuote(null);

    Toast.show({
      type: 'success',
      text1: 'Tokens swapped',
    });
  };

  const handleTradePress = async () => {
    if (
      quote &&
      selectedPayToken &&
      user.wallet_address &&
      payAmount &&
      wallet &&
      wallet.status === 'connected'
    ) {
      const provider = wallet.provider;
      const formattedAmount = amountToDigits(Number(payAmount), selectedPayToken).toString();
      try {
        await checkAndSetCowAllowance(provider, selectedPayToken.address, user.wallet_address);
        const signature = await signCowQuote(quote, formattedAmount, user.wallet_address, provider);
        await submitCowOrder(quote, formattedAmount, signature);
        Toast.show({
          type: 'success',
          text1: 'Trade successful!',
        });
      } catch (error) {
        console.error('Error signing or submitting quote:', error);
        Toast.show({
          type: 'error',
          text1: 'Trade failed. Please try again.',
        });
      }
    }
  };

  const isValid = isAmountValid && selectedPayToken && selectedGetToken && quote;

  return (
    <Frame>
      <View className="flex-1 justify-between">
        <HeaderBar title="Trade" />
        <View className="flex-1 gap-4">
          {/* Amount Input for "You Pay" */}
          <AmountInput
            value={payAmount}
            selectedToken={selectedPayToken}
            onChange={(value) => setPayAmount(value)}
            tokens={possessedTokens}
            user={user}
            selectedTokenBalance={selectedTokenBalance}
            onTokenChange={(token) => {
              if (token && token.address === selectedGetToken?.address) {
                Toast.show({
                  type: 'error',
                  text1: 'You cannot select the same token to pay and receive.',
                });
                return;
              }
              setPayAmount('');
              setSelectedPayToken(token);
            }}
            title="You Pay"
          />

          {/* Swap Button */}
          <View className="z-10 my-[-25px] items-center">
            <TouchableOpacity
              onPress={handleSwapTokens}
              className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
              activeOpacity={0.7}
              accessibilityLabel="Swap tokens"
              accessibilityRole="button">
              <Feather
                name="refresh-ccw"
                size={24}
                color="white"
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            </TouchableOpacity>
          </View>

          {/* Quote Display */}
          <QuoteDisplay
            tokens={tokens}
            user={user}
            selectedToken={selectedGetToken}
            youPayValue={parseFloat(payAmount) || 0}
            youPayToken={selectedPayToken || possessedTokens[0]}
            onTokenChange={(token) => {
              if (token && token.address === selectedPayToken?.address) {
                Toast.show({
                  type: 'error',
                  text1: 'You cannot select the same token to pay and receive.',
                });
                return;
              }
              setSelectedGetToken(token);
            }}
            onQuote={(newQuote) => {
              setQuote(newQuote);
            }}
          />
          <TradeHistoryButton />
        </View>

        <View className="mb-8 w-full items-center p-4">
          <Button
            title="Trade"
            onPress={toggleConfirmModal}
            className="w-[50%] bg-primary"
            disabled={!isValid}
          />
        </View>
      </View>
      {selectedGetToken && selectedPayToken && quote ? (
        <ConfirmTradeModal
          isModalOpen={isConfirmModalOpen}
          toggleModal={toggleConfirmModal}
          onConfirm={handleTradePress}
          quote={quote}
          selectedPayToken={selectedPayToken}
          selectedGetToken={selectedGetToken}
        />
      ) : null}
    </Frame>
  );
}
