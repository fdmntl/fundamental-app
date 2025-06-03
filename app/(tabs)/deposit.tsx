import { Stack } from 'expo-router';
import { View } from 'react-native';

import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
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
          <Container title="">
            <FText className="">Fundamental uses USDC - the digital dollar.</FText>
          </Container>
          <Container title="Methods">
            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <FText className="">Coinbase Pay</FText>
                <Button
                  title="Deposit"
                  onPress={() => {
                    coinbaseOnramp(user.wallet_address);
                  }}
                />
              </View>
              <View className="flex-row items-center justify-between">
                <FText className="">ZKP2P (Revolut / Paypal)</FText>
                <Button title="Coming Soon" disabled onPress={() => {}} />
              </View>
              <View className="flex-row items-center justify-between">
                <FText className="">Bank Transfer</FText>
                <Button title="Coming Soon" disabled onPress={() => {}} />
              </View>
            </View>
          </Container>
        </View>
      </Frame>
    </>
  );
}
