import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import React from 'react';

import { FText } from './Text/FText';

interface ButtonProps {
  title?: string;
  icon?: React.ReactNode;
  textClassName?: string;
  gradientColors?: string[];
  disableGradient?: boolean;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  title,
  icon,
  textClassName,
  gradientColors,
  disableGradient = false,
  onPress,
  className,
  disabled,
}: ButtonProps) => {
  if (!title && !icon) {
    return null;
  }

  let effectiveTextClassName = textClassName;
  if (!effectiveTextClassName) {
    if (disableGradient) {
      effectiveTextClassName = 'text-text'; // Theme-aware for solid backgrounds
    } else {
      effectiveTextClassName = 'text-white'; // Good for default gradient
    }
  }

  const defaultGradientColors = ['#741AD9', '#8720FE', '#A250F5'];
  const currentGradientColors = gradientColors || defaultGradientColors;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      className={`flex items-center justify-center overflow-hidden rounded-2xl px-6 py-3 ${
        disabled ? 'opacity-50' : ''
      } ${className}`}>
      {!disableGradient && (
        <LinearGradient
          colors={currentGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject} // Ensures full coverage of the gradient
        />
      )}
      <View className="flex-row items-center justify-center gap-x-2">
        {icon}
        {title && (
          <FText className={`text-lg ${effectiveTextClassName}`} bold>
            {title}
          </FText>
        )}
      </View>
    </TouchableOpacity>
  );
};
