import { router } from 'expo-router';
import { TouchableOpacity, View, Image } from 'react-native';
import { Token } from 'types/supabaseTypes';

import { FText } from '../Text/FText';

import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';

interface AssetListDisplayProps {
  token: Token;
}

export const AssetListDisplay = ({ token }: AssetListDisplayProps) => {
  const userTokenValue = getUserTokenValue(token.address).toFixed(2);

  const icon = tokenIcons[token.symbol];

  return (
    <TouchableOpacity onPress={() => router.push(`/assets/${token.address}`)}>
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
          $ {userTokenValue}
        </FText>
      </View>
    </TouchableOpacity>
  );
};
