import { router } from 'expo-router';
import { TouchableOpacity, View, Image } from 'react-native';
import { Token } from 'types/supabaseTypes';

import { FText } from '../Text/FText';

import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';

interface AssetListDisplayProps {
  token: Token;
}

export const AssetListDisplay = ({ token }: AssetListDisplayProps) => {
  // const actualValue = token.value[-1].value;

  // TODO: Replace token name in router.push with token.address once we have the token data in appData global state

  const icon = tokenIcons[token.symbol];

  const actualValue = 1234.56;
  return (
    <TouchableOpacity onPress={() => router.push(`/assets/${token.name}`)}>
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-x-3">
          <Image source={icon} style={{ height: 40, width: 40 }} />
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
