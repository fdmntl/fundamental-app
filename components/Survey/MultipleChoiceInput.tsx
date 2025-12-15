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
    <View className="gap-y-3">
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          className={`w-full rounded-lg border p-4 ${
            selectedOption === option ? 'border-primary bg-primary/10' : 'border-gray-400 bg-background'
          }`}
          onPress={() => onOptionSelect(option)}>
          <FText
            className={`text-lg ${selectedOption === option ? 'text-primary' : 'text-text'}`}
            bold={selectedOption === option}>
            {option}
          </FText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

