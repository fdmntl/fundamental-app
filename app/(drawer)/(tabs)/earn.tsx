import { Feather } from '@expo/vector-icons';
import { View, Image, Linking } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { Container } from '~/components/Container';
import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';

export default function Earn() {
  return (
    <Frame>
      <View className="flex-1 justify-between">
        <View
          style={{
            position: 'absolute',
            top: 20,
            left: '85%',
            width: '200%',
            marginLeft: '-100%',
            backgroundColor: '#8435E0',
            paddingVertical: 8,
            alignItems: 'center',
            transform: [{ rotate: '40deg' }],
            zIndex: 10,
          }}>
          <FText className="text-lg text-white" bold>
            Coming Soon
          </FText>
        </View>
        <HeaderBar title="Earn" />
        <ScrollView className="flex-1 gap-8">
          <View className="items-center gap-4 pt-4">
            <FText className="text-center !text-4xl" bold>
              Earn passive income with your Tokens!
            </FText>
            <FText className="text-left text-lg !text-neutral">
              Soon, your tokens won't just sit, they'll work for you.
            </FText>
          </View>
          <View className="w-full gap-4">
            <View className="flex-row items-center gap-3">
              <Feather name="shopping-bag" size={24} className="text-text" />
              <FText className="text-left !text-lg" bold>
                Deposit your tokens
              </FText>
            </View>
            <View className="flex-row items-center gap-3">
              <Feather name="trending-up" size={24} className="text-text" />
              <View className="flex-shrink flex-row flex-wrap items-center gap-1">
                <FText className="flex-shrink text-left !text-lg" bold>
                  Your assets are lent out securely via
                </FText>
                <FText className="flex-shrink text-left !text-lg" bold>
                  Compound
                </FText>
                <Image source={require('~/assets/compound-logo.png')} className="h-5 w-5" />
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <Feather name="percent" size={24} className="text-text" />
              <FText className="text-left !text-lg" bold>
                You earn interest automatically, every block
              </FText>
            </View>
          </View>
          <Container>
            <View className="relative min-h-[80px]">
              <View className="absolute left-0 top-0 h-8 w-28 items-center justify-center rounded-md bg-white">
                <Image
                  source={require('~/assets/compound-text.png')}
                  resizeMode="contain"
                  className="h-10 w-24"
                />
              </View>
              <FText className="mt-10 text-left !text-base !text-text">
                Built on Compound Finance, the protocol trusted by millions for decentralized
                lending and earning. Transparent. Secure. Non-custodial.
              </FText>
              <Image
                source={require('~/assets/compound-table.png')}
                className="mt-2 h-44 w-full rounded-xl"
                resizeMode="contain"
              />
              <TouchableOpacity onPress={() => Linking.openURL('https://compound.finance/')}>
                <View className="mt-2 flex-row items-center gap-1">
                  <FText className="text-sm !text-neutral">Learn more about Compound</FText>
                  <Feather name="external-link" size={12} className="text-neutral" />
                </View>
              </TouchableOpacity>
            </View>
          </Container>
        </ScrollView>
      </View>
    </Frame>
  );
}
