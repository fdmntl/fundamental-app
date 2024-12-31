import { forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { FText } from './Text/FText';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ title, ...touchableProps }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={`items-center rounded-[28px] bg-primary p-3 ${touchableProps.className}`}>
        <FText className="text-center text-lg text-white" bold>
          {title}
        </FText>
      </TouchableOpacity>
    );
  }
);
