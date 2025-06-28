import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { FText } from '~/components/Text/FText';

interface NumberRangeInputProps {
  from: number;
  to: number;
  selectedValue: number | null;
  onValueChange: (value: number) => void;
}

export const NumberRangeInput = ({
  from,
  to,
  selectedValue,
  onValueChange,
}: NumberRangeInputProps) => {
  const numbers = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  return (
    <View className="flex-row justify-center">
      {numbers.map((number, index) => (
        <TouchableOpacity
          key={number}
          className={`h-16 w-10 items-center justify-center rounded-md border ${
            index > 0 ? '-ml-px' : ''
          } ${selectedValue === number ? 'z-10 border-primary bg-primary' : 'border-gray-400'}`}
          onPress={() => onValueChange(number)}>
          <FText
            className={`text-lg ${selectedValue === number ? 'text-white' : 'text-text'}`}
            bold>
            {number}
          </FText>
        </TouchableOpacity>
      ))}
    </View>
  );
};
