import { TouchableOpacity, View } from 'react-native';

import { FText } from '~/components/Text/FText';
import { GraphRange } from '~/types/graph';

interface GraphRangeSelectorProps {
  rangeOptions: GraphRange[];
  selectedRange: GraphRange;
  onSelectRange: (range: GraphRange) => void;
  rangeLabels: Record<GraphRange, string>;
}

export function GraphRangeSelector({
  rangeOptions,
  selectedRange,
  onSelectRange,
  rangeLabels,
}: GraphRangeSelectorProps) {
  return (
    <View className="my-1 flex-row justify-around">
      {rangeOptions.map((range) => (
        <TouchableOpacity
          key={range}
          onPress={() => onSelectRange(range)}
          className={`rounded-lg px-4 py-2 ${selectedRange === range ? 'bg-primary' : ''}`}>
          <FText
            className={`${selectedRange === range ? 'text-white' : 'text-text'} !text-base`}
            bold>
            {rangeLabels[range]}
          </FText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
