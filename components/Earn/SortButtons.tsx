import { View, TouchableOpacity } from 'react-native';
import { FText } from '~/components/Text/FText';
import { SortType } from '~/types/earn';
import { Container } from '../Container';

type SortButtonsProps = {
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
};

export const SortButtons = ({ sortBy, onSortChange }: SortButtonsProps) => {
  const handleSortChange = (sort: SortType) => {
    onSortChange(sort);
  };

  return (
    <View className="flex-row gap-8 px-2 mb-6 mt-4">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSortChange('balance')}
        className={`${
          sortBy === 'balance' ? 'border-primary bg-primary/10' : 'border-neutral/20'
        }`}>
        <FText className={sortBy === 'balance' ? 'text-primary' : 'text-text'} bold>
          Sort by Balance
        </FText>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSortChange('apy')}
        className={` ${
          sortBy === 'apy' ? 'border-primary bg-primary/10' : 'border-neutral/20'
        }`}>
        <FText className={sortBy === 'apy' ? 'text-primary' : 'text-text'} bold>
          Sort by APY
        </FText>
      </TouchableOpacity>
    </View>
  );
};
