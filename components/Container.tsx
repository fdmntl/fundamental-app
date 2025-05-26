import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { FText } from './Text/FText';

interface ContainerProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}

export const Container = ({ title, className, children, noPadding = false }: ContainerProps) => {
  return (
    <View className={`${className}`}>
      {title && (
        <FText className="mb-2 text-2xl text-text" bold>
          {title}
        </FText>
      )}
      <View className={`rounded-xl bg-content ${noPadding ? '' : 'p-0'}`}>
        <View className={noPadding ? '' : 'p-4'}>{children}</View>
      </View>
    </View>
  );
};

// colors={['#6115B5', '#741AD9', '#8720FE', '#8435E0', '#A250F5', '#D455FF']}
