import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { FText } from './Text/FText';

interface ContainerProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
  outline?: boolean;
  useGradient?: boolean;
}

export const Container = ({
  title,
  className,
  children,
  noPadding = false,
  outline = false,
  useGradient = false,
}: ContainerProps) => {
  const gradientColors = ['#741AD9', '#8720FE', '#A250F5'];

  return (
    <View className={`${className}`}>
      {title && (
        <FText className={`mb-2 text-2xl ${useGradient ? 'text-white' : 'text-text'}`} bold>
          {title}
        </FText>
      )}
      <View
        className={`rounded-xl ${useGradient ? '' : 'bg-content'} overflow-hidden ${
          outline ? 'border-2 border-primary' : ''
        }`}>
        {useGradient && (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View className={noPadding ? '' : 'p-4'}>{children}</View>
      </View>
    </View>
  );
};

// colors={['#6115B5', '#741AD9', '#8720FE', '#8435E0', '#A250F5', '#D455FF']}
