import { useState } from 'react';
import { View } from 'react-native';
import { isAddress } from 'viem';

import { Button } from '~/components/Button';
import { HeaderBar, PillMessageBox } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { RecipientInput } from '~/components/Send/RecipientInput';
import { FText } from '~/components/Text/FText';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { useSendTokenCallback } from '~/services/Send/useSendTokenCallback';
import { Token } from '~/types/supabaseTypes';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';

const sendPillContent = () => {
  return (
    <PillMessageBox>
      <FText className="mb-4 !text-lg" bold>
        Here you can quickly and securely send cryptocurrency to any recipient with a valid address.
      </FText>
      <FText className="!text-lg" bold>
        Just enter the recipient’s address, username or ens domain, specify the amount, and confirm
        the transaction to transfer funds instantly.
      </FText>
    </PillMessageBox>
  );
};

export default function Send() {
  const { user, tokens, privy, updateUser } = useAppData();

  const wallet = privy.wallet;
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
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

  const handleSendPress = () => {
    handleSendTokenCallback();
  };

  return (
    <Frame>
      <HeaderBar title="Send" pillContent={sendPillContent} />
      <View className="flex-1 gap-4">
        <View className="mb-4 flex-1">
          <RecipientInput value={recipient} onChange={(value) => setRecipient(value)} />
        </View>
        <View className="mb-4 flex-1">
          <AmountInput
            value={amount}
            onChange={(value) => setAmount(value)}
            tokens={possessedTokens}
            user={user}
            selectedTokenBalance={selectedTokenBalance}
            onTokenChange={(token) => setSelectedToken(token)}
          />
        </View>
        <View className="absolute bottom-[6rem] w-full items-center">
          <Button
            title="Send Funds"
            onPress={handleSendPress}
            className={`bg-primary px-12 ${isInputValid ? '' : 'opacity-50'}`}
            disabled={!isInputValid}
          />
        </View>
      </View>
    </Frame>
  );
}
