import React from 'react';
import { View } from 'react-native';

import { FText } from '~/components/Text/FText';
import { FreeTextInput } from './FreeTextInput';
import { MultipleChoiceInput } from './MultipleChoiceInput';
import { NumberRangeInput } from './NumberRangeInput';

export type Question = {
  id: string;
  text: string;
  type: 'number_range' | 'free_text' | 'multiple_choice';
  data?: {
    from?: number;
    to?: number;
    placeholder?: string;
    options?: string[];
  };
};

interface QuestionCardProps {
  question: Question;
  answer: any;
  onAnswerChange: (answer: any) => void;
}

export const QuestionCard = ({ question, answer, onAnswerChange }: QuestionCardProps) => {
  const renderInput = () => {
    switch (question.type) {
      case 'number_range':
        return (
          <NumberRangeInput
            from={question.data?.from || 1}
            to={question.data?.to || 5}
            selectedValue={answer}
            onValueChange={onAnswerChange}
          />
        );
      case 'free_text':
        return (
          <FreeTextInput
            value={answer || ''}
            onChange={onAnswerChange}
            placeholder={question.data?.placeholder}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoiceInput
            options={question.data?.options || []}
            selectedOption={answer}
            onOptionSelect={onAnswerChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <FText className="mb-8 text-center text-3xl text-text" bold>
        {question.text}
      </FText>
      {renderInput()}
    </View>
  );
};
