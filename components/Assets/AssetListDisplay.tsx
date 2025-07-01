import { router } from 'expo-router';
import { TouchableOpacity, View, Image } from 'react-native';
import { Token } from 'types/supabaseTypes';

import { FText } from '../Text/FText';
import { useAppData } from '../Wrappers/AppData';

import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { roundNumberToDecimal } from '~/utils/helpers/numbers/roundNumberToDecimal';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';

interface AssetListDisplayProps {
  token: Token;
}

export const AssetListDisplay = ({ token }: AssetListDisplayProps) => {
  const { tokens, user } = useAppData();
  const userTokenValue = getUserTokenValue(token.address, tokens, user).toFixed(2);
  const userTokenAmount = getUserTokenAmount(token.address, tokens, user);

  const icon = tokenIcons[token.symbol];

  return (
    <TouchableOpacity onPress={() => router.push(`/assets/${token.address}`)}>
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-x-3">
          <Image source={icon} style={{ height: 40, width: 40 }} />
          <View>
            <FText bold>{token.name}</FText>
            {!token.is_stablecoin && (
              <FText className="text-sm">
                {roundNumberToDecimal(userTokenAmount)} {token.symbol}
              </FText>
            )}
          </View>
        </View>
        <View className="flex items-end justify-center gap-2">
          <FText bold className="text-2xl">
            ${userTokenValue}
          </FText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
