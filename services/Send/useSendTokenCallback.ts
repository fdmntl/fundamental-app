import { EmbeddedWalletState } from '@privy-io/expo';
import { useCallback } from 'react';

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
  const handleSendTokenCallback = useCallback(() => {
    if (!isInputValid || !selectedToken || !wallet || wallet.status !== 'connected') {
      return;
    }
    if (selectedToken.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      // ETH is not an ERC-20 token, so we need to handle it separately. We represent it with 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
      sendETH(
        wallet.provider,
        recipient,
        BigInt(amountToDigits(parseFloat(amount), selectedToken))
        // Update the user's balance in the database
      );
    } else {
      sendERC20(
        wallet.provider,
        selectedToken.address as `0x${string}`,
        recipient as `0x${string}`,
        BigInt(amountToDigits(parseFloat(amount), selectedToken))
        // Update the user's balance in the database
      );
    }
  }, [amount, isInputValid, recipient, selectedToken, wallet]);

  return { handleSendTokenCallback };
};
