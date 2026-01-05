import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { FText } from '~/components/Text/FText';

interface MultipleChoiceInputProps {
  options: string[];
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
}

export const MultipleChoiceInput = ({
  options,
  selectedOption,
  onOptionSelect,
}: MultipleChoiceInputProps) => {
  return (
    <View className="items-center gap-y-3">
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          className={`w-3/4 rounded-lg border-[3px] p-4 ${
            selectedOption === option
              ? 'border-primary bg-primary-secondary'
              : 'border-gray-400 bg-background'
          }`}
          onPress={() => onOptionSelect(option)}>
          <FText
            className={`self-center text-lg ${selectedOption === option ? 'text-white' : 'text-text'}`}
            bold>
            {option}
          </FText>
        </TouchableOpacity>
      ))}
    </View>
  );
};
