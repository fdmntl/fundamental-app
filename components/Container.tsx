import { View } from 'react-native';

import { FText } from './Text/FText';

interface ContainerProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export const Container = ({ title, className, children }: ContainerProps) => {
  return (
    <View className={`${className} rounded-xl bg-content`}>
      {title && (
        <View className="rounded-t-xl border-b-[3px] border-primary px-4 py-2">
          <FText className="text-xl text-primary" bold>
            {title}
          </FText>
        </View>
      )}
      <View className="p-4">{children}</View>
    </View>
  );
};
