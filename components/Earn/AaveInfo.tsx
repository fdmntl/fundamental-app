import { Feather } from '@expo/vector-icons';
import { View, Image, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Container } from '~/components/Container';
import { FText } from '~/components/Text/FText';

export const AaveInfo = () => {
  return (
    <View className="mt-4 gap-2">
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
        Built on Aave - the protocol trusted by millions for decentralized lending and earning.
    </FText>
    <TouchableOpacity onPress={() => Linking.openURL('https://aave.com/')}>
        <View className="flex-row items-center gap-1">
        <FText className="text-sm text-neutral">Learn more</FText>
        <Feather name="external-link" size={12} className="text-neutral" />
        </View>
    </TouchableOpacity>
    </View>
  );
};