import { Feather } from '@expo/vector-icons';
import { View, TextInput } from 'react-native';

import { FText } from '~/components/Text/FText';

interface TextInputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isValid?: boolean;
  errorMessage?: string;
  className?: string;
}

export const TextInputField = ({
  label,
  placeholder,
  value,
  onChange,
  isValid = true,
  errorMessage,
  className,
}: TextInputFieldProps) => {
  return (
    <View className={`gap-2 ${className}`}>
      {label && (
        <FText className="!text-2xl" bold>
          {label}
        </FText>
      )}
      <View className="flex-row items-center">
        <TextInput
          className={`flex-1 text-4xl font-semibold
            ${value === '' ? 'text-text' : isValid ? 'text-success' : 'text-error'}`}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
        />
      </View>
      {!isValid && value && errorMessage && (
        <View className="-mt-2 flex-row items-center gap-2">
          <Feather name="info" size={20} className="text-neutral" />
          <FText className="!text-neutral" bold>
            {errorMessage}
          </FText>
        </View>
      )}
    </View>
  );
};
