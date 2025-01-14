import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import AmountInput from '~/components/Send/AmountInput';
import RecipientInput from '~/components/Send/RecipientInput';
import { SubSendHeader } from '~/components/Send/SubSendHeader';
import { FText } from '~/components/Text/FText';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { Token } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { sendERC20, sendETH } from '~/services/viemService';
import { amountToDigits } from '~/utils/helpers/tokens/amountToDigits';

export default function SendToken() {
  const { address } = useLocalSearchParams();
  const { tokens, user, privy } = useAppData();

  const wallet = privy.wallet;
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(
    tokens.find((token) => token.address === address) || null
  );

  const selectedTokenBalance = selectedToken
    ? user.balances.find((balance) => balance.token_address === selectedToken.address)?.balance || 0
    : 0;

  const isInputValid =
    recipient && parseFloat(amount) > 0 && parseFloat(amount) <= selectedTokenBalance;

  const handleSendPress = () => {
    if (!isInputValid || !selectedToken || !wallet || wallet.status !== 'connected') {
      return;
    }
    if (selectedToken.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      // ETH is not an ERC-20 token, so we need to handle it separately. We represent it with 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
      sendETH(
        wallet.provider,
        recipient,
        BigInt(amountToDigits(parseFloat(amount), selectedToken))
      );
    } else {
      sendERC20(
        wallet.provider,
        selectedToken.address as `0x${string}`,
        recipient as `0x${string}`,
        BigInt(amountToDigits(parseFloat(amount), selectedToken))
      );
    }
  };

  if (!selectedToken) {
    return (
      <Frame>
        <View className="flex h-64 items-center justify-center">
          <FText>Token not found</FText>
        </View>
      </Frame>
    );
  }

  const icon = tokenIcons[selectedToken.symbol];

  return (
    <>
      <Stack.Screen options={{ title: selectedToken?.name || 'Send Token', headerShown: false }} />
      <Frame>
        <View className="flex-1 gap-4">
          <SubSendHeader title={selectedToken.symbol} address={address as string} icon={icon} />
          <RecipientInput value={recipient} onChange={setRecipient} />
          <AmountInput
            value={amount}
            onChange={setAmount}
            tokens={[selectedToken]}
            user={user}
            defaultToken={selectedToken}
            selectedTokenBalance={selectedTokenBalance}
            onTokenChange={setSelectedToken}
          />
          <View className="absolute bottom-[2rem] w-full items-center">
            <Button
              title="Send Funds"
              onPress={handleSendPress}
              className={`bg-primary px-12 ${isInputValid ? '' : 'opacity-50'}`}
              disabled={!isInputValid}
            />
          </View>
        </View>
      </Frame>
    </>
  );
}
