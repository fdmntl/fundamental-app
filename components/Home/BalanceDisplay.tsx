import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import FText from '../Text/FText';

const BalanceDisplay = () => {
  const tempAmount = 1234.56;
  //! Do not check if positive/negative but check for evolution
  const isAmountPositive = tempAmount > 0;

  return (
    <View className="px-2">
      {/* <View className="mb-[-12px]">
        <FText>Current Balance:</FText>
      </View> */}
      <View className="flex flex-row items-center">
        <FText className="mr-4 flex flex-shrink pt-6 !text-6xl" bold>
          {tempAmount}
        </FText>
        <View>
          {isAmountPositive ? (
            <Feather name="trending-up" size={50} className="text-success" />
          ) : (
            <Feather name="trending-down" size={50} className="text-error" />
          )}
        </View>
      </View>
    </View>
  );
};

export default BalanceDisplay;
