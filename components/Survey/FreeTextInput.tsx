import { TextInput, View } from 'react-native';

interface FreeTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FreeTextInput = ({ value, onChange, placeholder }: FreeTextInputProps) => {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || 'Type your answer here...'}
        placeholderTextColor="#9CA3AF" // gray-400
        multiline
        className="h-32 rounded-lg border border-gray-400 bg-background p-4 text-lg text-text"
        textAlignVertical="top"
      />
    </View>
  );
};
