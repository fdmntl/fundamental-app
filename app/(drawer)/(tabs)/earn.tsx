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
            <FText className="text-center text-3xl" bold>
              Earn passive income with your Tokens!
            </FText>
            <FText className="text-neutral">
              Soon, your tokens won't just sit, they'll work for you.
            </FText>
          </View>
          <View className="w-full gap-4 py-4">
            <View className="flex-row items-center gap-3">
              <Feather name="shopping-bag" size={24} className="text-text" />
              <FText className="" bold>
                Deposit your tokens
              </FText>
            </View>
            <View className="flex-row items-center gap-3">
              <Feather name="trending-up" size={24} className="text-text" />
              <View className="flex-shrink flex-row flex-wrap items-center gap-1">
                <FText bold>Your assets are lent out securely</FText>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <Feather name="percent" size={24} className="text-text" />
              <FText className="flex-shrink flex-wrap" bold>
                Earn interest automatically every block
              </FText>
            </View>
          </View>
          <Container>
            <View className="relative gap-2">
              <Image
                source={require('~/assets/aave-splash.png')}
                className="h-[9rem] w-full rounded-xl"
              />
              <Image
                source={require('~/assets/Aave-logo.png')}
                className="absolute left-3 top-3 h-8 w-32"
                resizeMode="contain"
              />
              <FText className="text-base">
                Built on Aave - the protocol trusted by millions for decentralized lending and
                earning.
              </FText>
              <TouchableOpacity onPress={() => Linking.openURL('https://aave.com/')}>
                <View className="flex-row items-center gap-1">
                  <FText className="text-sm text-neutral">Learn more</FText>
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
