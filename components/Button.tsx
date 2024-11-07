/**
 * @file Button.tsx
 * @description This file contains the implementation of a custom Button component using React Native's TouchableOpacity.
 * The Button component is designed to be reusable and customizable, with support for forwarding refs and additional props.
 */

import { forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import FText from './Text/FText';

/**
 * Props for the Button component.
 *
 * @typedef {Object} ButtonProps
 * @property {string} title - The title to be displayed on the button.
 * @extends {TouchableOpacityProps}
 */
type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

/**
 * Button component
 *
 * This is a custom Button component built using React Native's TouchableOpacity. It supports forwarding refs and accepts
 * additional TouchableOpacityProps for further customization.
 *
 * @component
 * @param {ButtonProps} props - The props for the Button component.
 * @param {string} props.title - The text to be displayed inside the button.
 * @param {React.Ref<TouchableOpacity>} ref - The ref to be forwarded to the TouchableOpacity component.
 * @returns {JSX.Element} A styled button component with text.
 *
 * @example
 * ```tsx
 * <Button title="Click Me" onPress={() => console.log('Button pressed!')} />
 * ```
 */
export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ title, ...touchableProps }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={`items-center rounded-[28px] bg-primary p-4 shadow-md ${touchableProps.className}`}>
        <FText className="text-center text-lg font-bold text-white">{title}</FText>
      </TouchableOpacity>
    );
  }
);
