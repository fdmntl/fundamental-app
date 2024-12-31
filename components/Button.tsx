import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { FText } from './Text/FText';

type ButtonProps = {
  title: string;
  className?: string;
} & TouchableOpacityProps;

export const Button = ({ title, className }: ButtonProps) => {
  return (
    <TouchableOpacity className={`${className} items-center rounded-[28px] bg-primary p-3`}>
      <FText className="text-lg text-white" bold>
        {title}
      </FText>
    </TouchableOpacity>
  );
};
