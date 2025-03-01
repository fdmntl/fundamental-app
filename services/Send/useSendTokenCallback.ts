import { EmbeddedWalletState } from '@privy-io/expo';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

import { sendERC20, sendETH } from '~/services/viemService';
import { Token } from '~/types/supabaseTypes';
import { amountToDigits } from '~/utils/helpers/tokens/amountToDigits';

interface useSendTokenProps {
  selectedToken: Token | null;
  wallet: EmbeddedWalletState | undefined;
  recipient: string;
  amount: string;
  isInputValid: boolean;
}

export const useSendTokenCallback = ({
  selectedToken,
  wallet,
  recipient,
  amount,
  isInputValid,
}: useSendTokenProps) => {
  const handleSendTokenCallback = useCallback(async () => {
    if (!isInputValid || !selectedToken || !wallet || wallet.status !== 'connected') {
      return;
    }

    const value = BigInt(amountToDigits(parseFloat(amount), selectedToken));

    try {
      if (selectedToken.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        // ETH is not an ERC-20 token, so we need to handle it separately. We represent it with 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
        await sendETH(wallet.provider, recipient, value);
      } else {
        await sendERC20(
          wallet.provider,
          selectedToken.address as `0x${string}`,
          recipient as `0x${string}`,
          value
        );
      }
      Toast.show({
        type: 'success',
        text1: 'Transaction Sent!',
        text2: `You sent ${amount} ${selectedToken.symbol} to ${recipient}`,
      });
    } catch (error) {
      console.error('Error sending token', error);
      Toast.show({
        type: 'error',
        text1: 'Error Sending Transaction',
        text2: 'Please try again later',
      });
    }
  }, [amount, isInputValid, recipient, selectedToken, wallet]);

  return { handleSendTokenCallback };
};
