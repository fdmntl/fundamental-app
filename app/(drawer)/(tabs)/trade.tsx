import { OrderParameters } from '@cowprotocol/cow-sdk';
import { Feather } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { ConfirmTradeModal } from '~/components/Trade/ConfirmTradeModal';
import { QuoteDisplay } from '~/components/Trade/QuoteDisplay';
import { TradeHistoryButton } from '~/components/Transaction/TradeHistoryButton';
import { PendingTradesSection } from '~/components/Trade/PendingTradesSection';
import { CustomRefreshControl } from '~/components/CustomRefreshControl';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { checkAndSetCowAllowance } from '~/services/CoW/setCowInfiniteAllowance';
import { signCowQuote } from '~/services/CoW/signCowQuote';
import { submitCowOrder } from '~/services/CoW/submitCowOrder';
import { getCowOrderStatus } from '~/services/CoW/getCowOrderStatus';
import { Token } from '~/types/supabaseTypes';
import { amountToDigits } from '~/utils/helpers/tokens/amountToDigits';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';

type TradeRouteProps = {
  Trade: {
    prefillTokenAddress?: string;
    method?: 'buy' | 'sell';
  };
};

export default function Trade() {
  const { user, tokens, privy, tradeHistory, isTradeHistoryLoading, fetchTradeHistory, getToken } =
    useAppData();
  const wallet = privy.wallet;

  const route = useRoute<RouteProp<TradeRouteProps, 'Trade'>>();
  const { prefillTokenAddress, method } = route.params || {};

  const defaultToken = getToken('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'); // USDC on Base

  const [payAmount, setPayAmount] = useState('');
  const [selectedPayToken, setSelectedPayToken] = useState<Token | null>(defaultToken || null);
  const [selectedGetToken, setSelectedGetToken] = useState<Token | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [quote, setQuote] = useState<OrderParameters | null>(null);
  const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);

  const toggleConfirmModal = () => {
    setIsConfirmModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (prefillTokenAddress) {
      const token = getToken(prefillTokenAddress);
      if (token) {
        if (method === 'buy') {
          setSelectedGetToken(token);
          if (defaultToken && token.address === defaultToken.address) {
            setSelectedPayToken(null);
          }
        } else {
          setSelectedPayToken(token);
        }
      } else {
        console.log(`Token with address ${prefillTokenAddress} not found.`);
        Toast.show({
          type: 'error',
          text1: 'Token not found',
          text2: `The token with address ${prefillTokenAddress} could not be found.`,
        });
      }
    }
  }, [prefillTokenAddress, method]);

  useEffect(() => {
    const openOrders = tradeHistory.filter((order) => order.status.toLowerCase() === 'open');

    if (openOrders.length > 0) {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }

      const newIntervalId = setInterval(async () => {
        let refreshNeeded = false;
        for (const order of openOrders) {
          if (!order.uid) {
            console.warn('Order UID is missing, cannot check status:', order);
            continue;
          }
          try {
            const statusResult = await getCowOrderStatus(order.uid);
            if (
              statusResult &&
              statusResult.order &&
              statusResult.order.status.toLowerCase() !== 'open'
            ) {
              const orderStatus = statusResult.order.status.toLowerCase();
              console.log(
                `Order ${order.uid} status changed to ${statusResult.order.status}. Refreshing history.`
              );
              refreshNeeded = true;

              if (orderStatus === 'fulfilled') {
                const boughtTokenInfo = getToken(statusResult.order.buyToken);
                if (boughtTokenInfo && statusResult.order.executedBuyAmount) {
                  const displayAmount = digitsToAmount(
                    Number(statusResult.order.executedBuyAmount),
                    boughtTokenInfo
                  );
                  const amountStr = displayAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  });
                  Toast.show({
                    type: 'success',
                    text1: 'Trade Completed!',
                    text2: `+${amountStr} ${boughtTokenInfo.symbol}`,
                  });
                }
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Trade timed out!',
                });
              }
              break;
            }
          } catch (error) {
            console.log(`Error fetching status for order ${order.uid}:`, error);
          }
        }

        if (refreshNeeded) {
          fetchTradeHistory();
        }
      }, 10000); // Poll every 10 seconds

      setPollingIntervalId(newIntervalId);
    } else {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
        setPollingIntervalId(null);
      }
    }

    // Cleanup function for when the component unmounts or dependencies change
    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };
  }, [tradeHistory, fetchTradeHistory]);

  const possessedTokens = user.balances
    .map((balance) => tokens.find((token) => token.address === balance.address))
    .filter((token) => token !== undefined) as Token[];

  const selectedTokenBalance = selectedPayToken
    ? user.balances.find((balance) => balance.address === selectedPayToken.address)?.balance || 0
    : 0;

  const isAmountValid = parseFloat(payAmount) > 0 && parseFloat(payAmount) <= selectedTokenBalance;

  const handleSwapTokens = () => {
    console.log('Swap button pressed');

    if (!selectedPayToken && !selectedGetToken) {
      console.log('Cannot swap - no tokens selected');
      Toast.show({
        type: 'info',
        text1: 'Please select at least one token',
      });
      return;
    }

    const tempToken = selectedPayToken;
    setSelectedPayToken(selectedGetToken);
    setSelectedGetToken(tempToken);
    setPayAmount('');
    setQuote(null);
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
        const orderSubmissionResult = await submitCowOrder(quote, formattedAmount, signature);

        if (orderSubmissionResult) {
          console.log('Order submitted, new UID (if available):', orderSubmissionResult);
        }

        await fetchTradeHistory();
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
      <HeaderBar title="Trade" />
      <View className="flex-1">
        <CustomRefreshControl onRefresh={fetchTradeHistory}>
          <View className="gap-4 pb-24">
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

            <PendingTradesSection tradeOrders={tradeHistory} isLoading={isTradeHistoryLoading} />
          </View>
        </CustomRefreshControl>
      </View>

      <View className="absolute bottom-8 z-10 w-full items-center">
        <Button
          title="Trade"
          onPress={toggleConfirmModal}
          className="w-[50%] bg-primary"
          disabled={!isValid}
        />
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
