import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Token } from 'types/supabaseTypes';

import { FText } from '../Text/FText';

interface AssetListDisplayProps {
  token: Token;
}

export const AssetListDisplay = ({ token }: AssetListDisplayProps) => {
  // const actualValue = token.value[-1].value;

  const actualValue = 1234.56;
  return (
    <TouchableOpacity onPress={() => router.push(`/assets/${token.name}`)}>
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-x-3">
          <Feather name="cpu" size={24} className="text-text" />
          <View>
            <FText className="">{token.name}</FText>
            <FText className="!text-sm" bold>
              {token.symbol}
            </FText>
          </View>
        </View>
        <FText bold className="!text-2xl">
          $ {actualValue}
        </FText>
      </View>
    </TouchableOpacity>
  );
};
