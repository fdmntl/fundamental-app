import { RouteProp, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { isAddress } from 'viem';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { ConfirmSendModal } from '~/components/Send/ConfirmSendModal';
import { DelayedBalanceRefresher } from '~/components/Send/DelayedBalanceRefresher';
import { RecipientInput } from '~/components/Send/RecipientInput';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { useSendTokenCallback } from '~/services/Send/useSendTokenCallback';
import { Token } from '~/types/supabaseTypes';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';

type SendRouteProps = {
  Send: {
    prefillTokenAddress?: string;
  };
};

export default function Send() {
  const { user, tokens, privy, getToken } = useAppData();

  const route = useRoute<RouteProp<SendRouteProps, 'Send'>>();
  const { prefillTokenAddress } = route.params || {};

  const wallet = privy.wallet;
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [refreshTriggerKey, setRefreshTriggerKey] = useState(0);

  const toggleConfirmModal = () => {
    setIsConfirmModalOpen((prev) => !prev);
  };

  const possessedTokens = user.balances
    .map((balance) => tokens.find((token) => token.address === balance.address))
    .filter((token) => token !== undefined) as Token[];

  const selectedTokenBalance = selectedToken
    ? getUserTokenAmount(selectedToken?.address, tokens, user)
    : 0;

  const isRecipientValid = isAddress(recipient);
  const isAmountValid = parseFloat(amount) > 0 && parseFloat(amount) <= selectedTokenBalance;

  const isInputValid = isRecipientValid && isAmountValid;

  const { handleSendTokenCallback } = useSendTokenCallback({
    selectedToken,
    wallet,
    recipient,
    amount,
    isInputValid,
  });

  const handleSendPress = async () => {
    if (!isInputValid) return;

    try {
      await handleSendTokenCallback();
      setRefreshTriggerKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.log('Error during send token operation:', error);
    }
  };

  useEffect(() => {
    if (prefillTokenAddress) {
      const token = getToken(prefillTokenAddress);
      token && setSelectedToken(token);
    }
  }, [prefillTokenAddress]);

  const title = selectedToken ? `Send ${selectedToken.symbol}` : 'Send';

  return (
    <Frame>
      <View className="flex-1 justify-between">
        <HeaderBar title={title} />
        <View className="flex-1 gap-8">
          <View>
            <RecipientInput value={recipient} onChange={(value) => setRecipient(value)} />
          </View>
          <View>
            <AmountInput
              value={amount}
              selectedToken={selectedToken}
              onChange={(value) => setAmount(value)}
              tokens={possessedTokens}
              user={user}
              selectedTokenBalance={selectedTokenBalance}
              onTokenChange={(token) => setSelectedToken(token)}
            />
          </View>
        </View>
        <View className="absolute bottom-12 z-10 w-full items-center">
          <Button
            title="Send Funds"
            onPress={toggleConfirmModal}
            className="w-[50%] bg-primary"
            disabled={!isInputValid}
          />
        </View>
      </View>
      {recipient && amount && selectedToken && (
        <ConfirmSendModal
          isModalOpen={isConfirmModalOpen}
          toggleModal={toggleConfirmModal}
          onConfirm={handleSendPress}
          recipient={recipient}
          amount={amount}
          selectedToken={selectedToken}
        />
      )}
      <DelayedBalanceRefresher key={refreshTriggerKey} delay={3000} />
    </Frame>
  );
}
