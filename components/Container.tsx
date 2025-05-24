import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { FText } from './Text/FText';

interface ContainerProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
  titleAbove?: boolean;
}

export const Container = ({
  title,
  className,
  children,
  noPadding = false,
  titleAbove = false,
}: ContainerProps) => {
  return (
    <View className={`${className}`}>
      {title && titleAbove && (
        <FText className="mb-2 text-2xl text-text" bold>
          {title}
        </FText>
      )}
      <View className={`rounded-xl bg-content ${noPadding ? '' : 'p-0'}`}>
        {title && !titleAbove && (
          <View>
            <FText className="px-4 py-2 text-xl" bold>
              {title}
            </FText>

            <LinearGradient
              colors={['#741AD9', '#8720FE', '#A250F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 3, width: '100%', borderRadius: 1 }}
            />
          </View>
        )}
        <View className={noPadding ? '' : 'p-4'}>{children}</View>
      </View>
    </View>
  );
};

// colors={['#6115B5', '#741AD9', '#8720FE', '#8435E0', '#A250F5', '#D455FF']}
