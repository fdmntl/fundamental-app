import { useState, useRef } from 'react';
import { View } from 'react-native';
import { isAddress } from 'viem';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { ConfirmSendModal } from '~/components/Send/ConfirmSendModal';
import { RecipientInput } from '~/components/Send/RecipientInput';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { useSendTokenCallback } from '~/services/Send/useSendTokenCallback';
import { Token } from '~/types/supabaseTypes';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { DelayedBalanceRefresher } from '~/components/Send/DelayedBalanceRefresher';
import { SendPageGuide, SendPageGuideHandle } from '~/components/Help/SendPageGuide';

export default function Send() {
  const { user, tokens, privy } = useAppData();

  const wallet = privy.wallet;
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [refreshTriggerKey, setRefreshTriggerKey] = useState(0);

  const recipientRef = useRef<View>(null);
  const amountRef = useRef<View>(null);
  const sendButtonRef = useRef<View>(null);
  const guideRef = useRef<SendPageGuideHandle>(null);

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

  return (
    <Frame>
      <View className="flex-1 justify-between">
        <HeaderBar title="Send" onInfoPress={() => guideRef.current?.startGuide()} />
        <View className="flex-1 gap-8">
          <View ref={recipientRef} onLayout={() => {}}>
            <RecipientInput value={recipient} onChange={(value) => setRecipient(value)} />
          </View>
          <View ref={amountRef} onLayout={() => {}}>
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
          <View ref={sendButtonRef} onLayout={() => {}} className="w-[50%]">
            <Button
              title="Send"
              onPress={() => {
                setIsConfirmModalOpen(true);
              }}
              className="w-full bg-primary"
              disabled={!isInputValid}
            />
          </View>
        </View>
      </View>
      {recipient && amount && selectedToken && (
        <ConfirmSendModal
          isModalOpen={isConfirmModalOpen}
          toggleModal={() => setIsConfirmModalOpen(false)}
          onConfirm={handleSendPress}
          recipient={recipient}
          amount={amount}
          selectedToken={selectedToken}
        />
      )}
      <SendPageGuide
        ref={guideRef}
        recipientRef={recipientRef}
        amountRef={amountRef}
        sendButtonRef={sendButtonRef}
      />
      <DelayedBalanceRefresher key={refreshTriggerKey} delay={3000} />
    </Frame>
  );
}
