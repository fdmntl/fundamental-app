import { View } from 'react-native';

import { TextInputField } from '~/components/TextInputField';

interface FreeTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FreeTextInput = ({ value, onChange, placeholder }: FreeTextInputProps) => {
  return (
    <View>
      <TextInputField
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Type your answer here...'}
      />
    </View>
  );
};
