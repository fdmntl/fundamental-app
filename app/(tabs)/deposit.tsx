import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { View, Image } from 'react-native';

import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { Button } from '~/components/Button';
import { FText } from '~/components/Text/FText';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { coinbaseOnramp } from '~/services/Onramp/coinbaseOnramp';

export default function DepositPage() {
  const { user } = useAppData();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Frame>
        <DetailsHeader title="Deposit" />
        <View className="gap-2 pb-24">
          <View className="flex-row items-center gap-2 rounded-lg px-2 pb-2">
            <Feather name="info" size={22} className="text-neutral" />
            <FText className="flex-1 !text-neutral" italic>
              Fundamental uses USDC, the digital dollar.
            </FText>
          </View>
          <Button
            icon={
              <Image source={require('~/assets/coinbase.png')} className="h-12 w-12 rounded-full" />
            }
            title="Coinbase Pay"
            className="h-20 bg-[#0052ff]"
            disableGradient
            onPress={() => {
              coinbaseOnramp(user.wallet_address);
            }}
          />

          <FText className="mt-5 text-center !text-neutral" italic>
            Coming Soon:
          </FText>

          <Button
            icon={
              <Image source={require('~/assets/ZKP2P.png')} className="h-12 w-12 rounded-full" />
            }
            title="ZKP2P (Revolut / Paypal)"
            className="h-20 bg-[#1d1f22]"
            disableGradient
            disabled
            onPress={() => {}}
          />
          <Button
            icon={<FontAwesome6 name="building-columns" className="text-text" size={18} />}
            title="Bank Transfer"
            className="h-20 bg-[#1d1f22]"
            disableGradient
            disabled
            onPress={() => {}}
          />
        </View>
      </Frame>
    </>
  );
}
