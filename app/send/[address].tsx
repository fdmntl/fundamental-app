import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import AmountInput from '~/components/Send/AmountInput';
import RecipientInput from '~/components/Send/RecipientInput';
import { Frame } from '~/components/Wrappers/Frame';
import { useAppData } from '~/components/Wrappers/AppData';
import { Token } from '~/types/supabaseTypes';
import { SubSendHeader } from '~/components/Send/SubSendHeader';

import { FText } from '~/components/Text/FText';

export default function SendToken() {
  const { address } = useLocalSearchParams(); // Retrieve token address from route
  const { tokens, userData } = useAppData();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(
    tokens.find((token) => token.address === address) || null
  );

  const balanceMap = Array.isArray(userData?.balances)
    ? userData.balances.reduce<Record<string, number>>((acc, { token_address, balance }) => {
        acc[token_address] = balance;
        return acc;
      }, {})
    : {};

  const selectedTokenBalance = selectedToken ? balanceMap[selectedToken.address] || 0 : 0;

  const isInputValid =
    recipient && parseFloat(amount) > 0 && parseFloat(amount) <= selectedTokenBalance;

  const handleSendPress = () => {
    console.log(`Sending ${amount} ${selectedToken?.symbol} to ${recipient}`);
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

  return (
    <>
      <Stack.Screen options={{ title: selectedToken?.name || 'Send Token', headerShown: false }} />
      <Frame>
        <View className="flex-1">
          <SubSendHeader title={`${selectedToken.name} ${address}`} address={address as string} />
          <RecipientInput value={recipient} onChange={setRecipient} />
          <AmountInput
            value={amount}
            onChange={setAmount}
            tokens={[selectedToken]}
            defaultToken={selectedToken}
            selectedTokenBalance={selectedTokenBalance}
            onTokenChange={setSelectedToken}
          />
          <Button
            title="Send"
            onPress={handleSendPress}
            disabled={!isInputValid}
            className={`bg-primary ${isInputValid ? '' : 'opacity-50'}`}
          />
        </View>
      </Frame>
    </>
  );
}

// import { useLocalSearchParams } from 'expo-router';
// import { View } from 'react-native';

// import { FText } from '~/components/Text/FText';

// export default function SendToken() {
//   const params = useLocalSearchParams();
//   console.log('Received params:', params); // Debug log

//   const { address } = params;
//   if (!address) {
//     console.error('Token address not provided');
//     return (
//       <View className="flex h-64 items-center justify-center">
//         <FText>Token address is missing.</FText>
//       </View>
//     );
//   }

//   return (
//     <View>
//       <FText>Sending token at address: {address}</FText>
//     </View>
//   );
// }
