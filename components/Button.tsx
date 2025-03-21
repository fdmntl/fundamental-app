import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { FText } from './Text/FText';

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

export const Button = ({ title, onPress, className }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex items-center justify-center overflow-hidden rounded-3xl px-6 py-3 ${className}`}>
      <LinearGradient
        colors={['#6115B5', '#741AD9', '#8720FE', '#8435E0', '#A250F5', '#D455FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject} // Ensures full coverage of the gradient
      />
      <FText className="text-lg text-white" bold>
        {title}
      </FText>
    </TouchableOpacity>
  );
};
