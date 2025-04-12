import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { View } from 'react-native';

import { FText } from './Text/FText';

interface ContainerProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export const Container = ({ title, className, children }: ContainerProps) => {
  const gradientDirection = useMemo(
    () => ({
      start: { x: Math.random(), y: Math.random() },
      end: { x: Math.random(), y: Math.random() },
    }),
    []
  );

  return (
    <View className={`${className} rounded-xl bg-content`}>
      {title && (
        <View>
          <FText className="px-4 py-2 text-xl" bold>
            {title}
          </FText>

          <LinearGradient
            colors={['#8720FE', '#A250F5']}
            {...gradientDirection}
            style={{ height: 3, width: '100%', borderRadius: 1 }}
          />
        </View>
      )}
      <View className="p-4">{children}</View>
    </View>
  );
};

// colors={['#6115B5', '#741AD9', '#8720FE', '#8435E0', '#A250F5', '#D455FF']}
