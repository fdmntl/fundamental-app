import { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '../Button';
import { FText } from '../Text/FText';
import { TextInputField } from '../TextInputField';
import { useAppData } from '../Wrappers/AppData';

import { updateENS } from '~/services/Supabase/updateENS';
import { registerName, isENSNameAvailable } from '~/services/viemService';
import { debounce } from '~/utils/helpers/debounce';
import { toastConfig } from '~/utils/toastConfig';
import { Wallet } from 'ethers';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';

// Check if the subname is valid and available
// TODO: Check if the subname is available
// Check if the user has enough ETH to pay for registration and gas fees
const isValidSubname = (subname: string) => {
  if (subname.length < 1 || subname.length > 16) {
    return false;
  }
  if (!/^[a-zA-Z0-9-_]*$/.test(subname)) {
    return false;
  }
  return true;
};

export const RegisterENS = () => {
  const { privy, user, tokens } = useAppData();
  const [subname, setSubname] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const address = privy.wallet?.account?.address || '';
  const hasEnoughEth = useRef(true);

  // Check if user has enough ETH
  useEffect(() => {
    if (!privy.wallet) {
      hasEnoughEth.current = false;
      return;
    }
    if (tokens.length === 0) {
      console.log('No tokens available to check ETH balance');
      hasEnoughEth.current = false;
      return;
    }
    tokens.forEach((token) => {
      console.log('Checking token:', token.symbol);
      if (token.symbol === 'ETH') {
        console.log('Checking ETH for ENS registration');
        const userEthAmount = getUserTokenAmount(token.address, tokens, user);
        if (userEthAmount === 0) {
          hasEnoughEth.current = false;
          return;
        } else {
          hasEnoughEth.current = true;
        }
      }
      console.log('User ETH amount:', getUserTokenAmount(token.address, tokens, user));
    });
    console.log('ETH availability:', hasEnoughEth.current);
  }, [privy.wallet, tokens, user, subname]);
  // Watch subname changes
  useEffect(() => {
    if (subname.trim()) {
      checkAvailability(subname);
    } else {
      setIsAvailable(null);
    }
  }, [subname]);

  if (!privy.wallet || privy.wallet.status !== 'connected') {
    return (
      <FText className="text-2xl" bold>
        Privy wallet error: not connected
      </FText>
    );
  }

  const provider = privy.wallet.provider;

  // Debounced ENS availability check
  const checkAvailability = debounce(async (name: string) => {
    setChecking(true);
    if (isValidSubname(name)) {
      try {
        const available = await isENSNameAvailable(`${name}.fdmntl.eth`);
        setIsAvailable(available);
      } catch {
        setIsAvailable(null);
      }
    } else {
      setIsAvailable(null);
    }
    setChecking(false);
  }, 500);

  return (
    <View className="flex gap-2">
      <FText className="text-2xl" bold>
        Register an ENS
      </FText>
      <View className="w-full flex-row items-center gap-2">
        <TextInputField
          className="w-3/5"
          placeholder="username"
          value={subname}
          onChange={(value) => {
            setSubname(value);
            if (!hasInteracted) setHasInteracted(true);
          }}
          isValid={isValidSubname(subname) && isAvailable !== false}
        />
        <FText className="pt-[2px] text-xl" bold>
          .fdmntl.eth
        </FText>
      </View>
      {/* ENS availability feedback */}
      <View className="min-h-[24px] flex-row items-center gap-2">
        {hasInteracted &&
          (checking ? (
            <FText className="text-neutral" bold>
              Checking availability...
            </FText>
          ) : !subname ? (
            <FText className="text-error" bold>
              ENS cannot be empty
            </FText>
          ) : !isValidSubname(subname) ? (
            <FText className="text-error" bold>
              Enter a valid ENS name
            </FText>
          ) : isAvailable === false ? (
            <FText className="text-error" bold>
              Name is already taken
            </FText>
          ) : isAvailable === true ? (
            <FText className="text-success" bold>
              Name is available
            </FText>
          ) : hasEnoughEth.current === false ? (
            <FText className="text-error" bold>
              Not enough ETH to register ENS
            </FText>
          ) : null)}
      </View>
      <Button
        title="Register"
        className="mx-auto w-[150px]"
        disabled={
          !subname ||
          !isValidSubname(subname) ||
          isAvailable !== true ||
          checking ||
          hasEnoughEth.current === false
        }
        onPress={async () => {
          if (isValidSubname(subname) && isAvailable && hasEnoughEth.current) {
            try {
              await registerName(provider, subname, address as `0x${string}`);
              updateENS(user.id, subname);
              Toast.show({
                type: 'success',
                text1: 'ENS registered',
                text2: 'Your ENS has been successfully registered.',
                ...toastConfig,
              });
            } catch (error) {
              console.error('Error registering ENS:', error);
              Toast.show({
                type: 'error',
                text1: 'Error registering ENS',
                text2: 'There was an error registering your ENS. Please try again.',
                ...toastConfig,
              });
            }
          } else {
            Toast.show({
              type: 'error',
              text1: 'Invalid ENS',
              text2:
                isAvailable === false ? 'Name is already taken.' : 'Please enter a valid ENS name.',
              ...toastConfig,
            });
          }
        }}
      />
    </View>
  );
};
