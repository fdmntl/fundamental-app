import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import FText from './Text/FText';

interface ContainerProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}
const Container = ({ title, className, children }: ContainerProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <View className={`${className} rounded-xl bg-content`}>
      <TouchableOpacity
        onPress={toggleOpen}
        className={`${isOpen ? 'rounded-t-xl' : 'rounded-xl'} bg-primary px-4 py-2`}>
        <FText className="text-white" bold>
          {title}
        </FText>
      </TouchableOpacity>
      {isOpen && <View className="p-4">{children}</View>}
    </View>
  );
};

export default Container;
