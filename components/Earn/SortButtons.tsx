import { View } from 'react-native';

import { Button } from '../Button';

import { SortType } from '~/types/earn';

type SortButtonsProps = {
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
};

export const SortButtons = ({ sortBy, onSortChange }: SortButtonsProps) => {
  const handleSortChange = (sort: SortType) => {
    onSortChange(sort);
  };

  return (
    <View className="flex-row items-center justify-around">
      <Button
        onPress={() => handleSortChange('apy')}
        title="% Sort by APY"
        disableGradient={sortBy !== 'apy'}
        className={sortBy !== 'apy' ? 'bg-content' : ''}
      />

      <Button
        onPress={() => handleSortChange('balance')}
        title="$ Sort by Balance"
        disableGradient={sortBy !== 'balance'}
        className={sortBy !== 'balance' ? 'bg-content' : ''}
      />
    </View>
  );
};
