import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { FText } from './Text/FText';

interface ContainerProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export const Container = ({ title, className, children }: ContainerProps) => {
  if (title) {
    return (
      <View className={`${className} rounded-xl bg-content`}>
        <View className={`rounded-t-xl px-4 py-2`}>
          <FText className="text-xl text-primary" bold>
            {title}
          </FText>
        </View>
        <View className="p-4">{children}</View>
      </View>
    );
  } else {
    return (
      <View className={`${className} rounded-xl bg-content`}>
        <View className="p-4">{children}</View>
      </View>
    );
  }
};
